import { ExternalLink, Flag, Trophy } from 'lucide-react';
import Link from 'next/link';

const placements = [
  {
    place: '11th',
    event: 'Kali-CTF 26',
    description: 'Placed 11th in Kali-CTF 26 after a strong competitive run.',
    href: 'https://register.kali-team.online/',
    Icon: Flag,
  },
  {
    place: '9th',
    event: 'LIT CTF 2026',
    description: 'Earned a top 10 finish at LIT CTF 2026.',
    href: 'https://lit.lhsmathcs.org/',
    Icon: Flag,
  },
  {
    place: '29th',
    event: 'SekaiCTF',
    description:
      "Placed 29th out of 926 teams in Project SEKAI's fifth annual CTF, featuring an $8,000 prize pool.",
    href: 'https://ctf.sekai.team/',
    Icon: Flag,
  },
  {
    place: '9th',
    event: 'V1tCTF',
    description: 'Top 9 finish out of 953 teams.',
    href: 'https://2026.v1t.site/',
    Icon: Flag,
  },
  {
    place: '20th',
    event: 'DEF CON 34 CTF Qualifier',
    description: "Competed against the world's best CTF teams in one of the biggest CTF events",
    href: 'https://bbbctf.com/',
    Icon: Flag,
  },
  {
    place: '1st',
    event: 'THEM?!CTF 2026',
    description: 'First place finish at THEM?!CTF 2026.',
    href: 'https://ctf.themctf.com/',
    Icon: Trophy,
  },
  {
    place: '7th',
    event: 'MetaCTF February 2026',
    description: 'Strong finish in a monthly MetaCTF event.',
    href: 'https://metactf.com/blog/tag/flash-feb2026/',
    Icon: Flag,
  },
  {
    place: '8th',
    event: 'boroCTF 2026 HS Bracket',
    description: 'Top 10 result in the high school bracket.',
    href: 'https://boroctf.com/',
    Icon: Flag,
  },
  {
    place: '9th',
    event: 'GPN CTF 2026 HS Bracket',
    description: 'Another top 10 high school bracket placement.',
    href: 'https://gpn24.ctf.kitctf.de/',
    Icon: Flag,
  },
  {
    place: '5th',
    event: 'TJCTF 2026',
    description: 'Top five placement at TJCTF 2026.',
    href: 'https://tjctf.org/',
    Icon: Flag,
  },
  {
    place: '8th',
    event: 'BroncoCTF 2026',
    description: 'Placed 8th in BroncoCTF, a dynamic-scoring CTF with no team size limit.',
    href: 'https://broncosec.com/BroncoCTF',
    Icon: Flag,
  },
  {
    place: '14th',
    event: 'Junior.Crypt.2026 CTF',
    description: 'Placed 14th in Junior.Crypt.2026 CTF on the GRODNO::CTF platform.',
    href: 'https://ctftime.org/event/3335/',
    Icon: Flag,
  },
  {
    place: '10th',
    event: 'LYKNCTF',
    description:
      'Placed 10th in LYKNCTF, an online beginner-friendly jeopardy event with 657 teams.',
    href: 'https://ctftime.org/event/3280/',
    Icon: Flag,
  },
];

export default function CtfPlacementsPage() {
  return (
    <main className='relative flex h-min w-full flex-1 flex-col flex-nowrap items-center justify-start overflow-hidden p-0'>
      <section className='relative flex h-min w-full max-w-full flex-none flex-col flex-nowrap items-start justify-center gap-6 overflow-visible p-[80px_0px] sm:px-5 lg:w-[80%] lg:max-w-[750px] lg:px-0'>
        <div className='border-dark-gray-4 flex w-full items-center gap-3 border-b border-dashed pb-6'>
          <div className='bg-dark-gray-3 border-border-color flex h-11 w-11 items-center justify-center rounded-lg border'>
            <Flag
              className='text-light-gray-3'
              size={24}
            />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-white'>CTF Placements</h1>
            <p className='text-light-gray-2 text-[15px] font-medium'>
              Competition results and team placements.
            </p>
          </div>
        </div>

        <div className='grid w-full grid-cols-1 gap-3 sm:grid-cols-2'>
          {placements.map(({ place, event, description, href, Icon }) => (
            <Link
              key={`${place}-${event}`}
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              className='bg-very-dark-gray border-dark-gray-3 hover:border-border-color group flex min-h-40 flex-col justify-between rounded-xl border p-5 transition-colors'
            >
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <p className='text-light-gray-3 text-3xl leading-none font-bold'>{place}</p>
                  <h2 className='text-light-gray-4 mt-2 text-lg font-semibold'>{event}</h2>
                </div>
                <div className='bg-dark-gray-4 border-border-color text-light-gray-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border'>
                  <Icon size={22} />
                </div>
              </div>

              <div className='mt-5'>
                <p className='text-light-gray-2 text-[15px] font-medium'>{description}</p>
                <div className='text-light-gray-3 mt-4 flex items-center gap-2 text-sm font-semibold'>
                  <span>View event</span>
                  <ExternalLink size={15} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
