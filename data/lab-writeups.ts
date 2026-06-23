export type LabWriteup = {
  slug: string;
  title: string;
  source: 'OffSec' | 'TryHackMe';
  difficulty: string;
  categories: string[];
  summary: string;
  thumbnail: string;
  file: string;
};

export const labWriteups: LabWriteup[] = [
  {
    slug: 'soupdecode',
    title: 'SoupDecode',
    source: 'TryHackMe',
    difficulty: 'Intermediate',
    categories: ['Active Directory', 'SMB', 'Kerberoasting', 'Pass-the-Hash'],
    summary:
      'Guest SMB access, RID brute forcing, password spraying, Kerberoasting, backup-share hash exposure, and pass-the-hash to SYSTEM.',
    thumbnail: '/images/lab-writeups/soupdecode.svg',
    file: 'soupdecode.md',
  },
  {
    slug: 'slort',
    title: 'Slort',
    source: 'OffSec',
    difficulty: 'Intermediate',
    categories: ['Windows', 'XAMPP', 'LFI/RFI', 'Log Poisoning', 'Scheduled Task'],
    summary:
      'A XAMPP target where verbose include errors, RFI, log poisoning, and a writable scheduled-task binary lead to SYSTEM.',
    thumbnail: '/images/lab-writeups/slort.svg',
    file: 'slort.md',
  },
  {
    slug: 'hutch',
    title: 'Hutch',
    source: 'OffSec',
    difficulty: 'Intermediate',
    categories: ['Active Directory', 'WebDAV', 'LDAP', 'LAPS', 'GodPotato'],
    summary:
      'Anonymous LDAP leaks credentials, WebDAV gives ASPX RCE, and LAPS or SeImpersonate paths lead to SYSTEM.',
    thumbnail: '/images/lab-writeups/hutch.svg',
    file: 'hutch.md',
  },
  {
    slug: 'exfiltrated',
    title: 'Exfiltrated',
    source: 'OffSec',
    difficulty: 'Intermediate',
    categories: ['Linux', 'Subrion CMS', 'File Upload', 'ExifTool', 'Cron'],
    summary:
      'Subrion CMS upload bypass provides a shell, then a root cron job running ExifTool is abused for privilege escalation.',
    thumbnail: '/images/lab-writeups/exfiltrated.svg',
    file: 'exfiltrated.md',
  },
  {
    slug: 'pelican',
    title: 'Pelican',
    source: 'OffSec',
    difficulty: 'Intermediate',
    categories: ['Linux', 'Zookeeper', 'Exhibitor', 'gcore', 'Memory Dump'],
    summary:
      'Exhibitor/Zookeeper exploitation gets a shell, and sudo gcore exposes the root password from process memory.',
    thumbnail: '/images/lab-writeups/pelican.svg',
    file: 'pelican.md',
  },
  {
    slug: 'payday',
    title: 'PayDay',
    source: 'OffSec',
    difficulty: 'Intermediate',
    categories: ['Linux', 'CS-Cart', 'Authenticated RCE', 'SSH', 'sudo'],
    summary:
      'CS-Cart admin access leads to a webshell and a simple local privilege escalation through reused credentials and sudo access.',
    thumbnail: '/images/lab-writeups/payday.svg',
    file: 'payday.md',
  },
  {
    slug: 'hokkaido',
    title: 'Hokkaido',
    source: 'OffSec',
    difficulty: 'Intermediate',
    categories: ['Active Directory', 'MSSQL', 'BloodHound', 'ACL Abuse', 'SeBackupPrivilege'],
    summary:
      'A long AD credential chain through SMB, MSSQL impersonation, targeted Kerberoasting, password reset rights, and SAM/SYSTEM dumping.',
    thumbnail: '/images/lab-writeups/hokkaido.svg',
    file: 'hokkaido.md',
  },
  {
    slug: 'vulnnet-active',
    title: 'VulnNet: Active',
    source: 'TryHackMe',
    difficulty: 'Medium',
    categories: ['Active Directory', 'Redis', 'Responder', 'NetNTLMv2', 'GodPotato'],
    summary:
      'Redis UNC coercion captures NetNTLMv2, cracked credentials expose a writable share, and SeImpersonate leads to SYSTEM.',
    thumbnail: '/images/lab-writeups/vulnnet-active.svg',
    file: 'vulnnet-active.md',
  },
];

export function getLabWriteup(slug: string) {
  return labWriteups.find((writeup) => writeup.slug === slug);
}
