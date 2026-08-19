'use client';

import { CalendarDays, ExternalLink, Flag, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type SortOption = 'date' | 'placement';

const placements = [
  {
    place: '4th',
    rank: 4,
    date: '2026-08-15',
    dateLabel: 'Aug 15, 2026',
    event: '0xV01D CTF 2026 V2',
    description: 'Earned a 4th place finish in the second 0xV01D CTF event of 2026.',
    href: 'https://ctftime.org/event/3387/',
    Icon: Flag,
  },
  {
    place: '3rd',
    rank: 3,
    date: '2026-08-08',
    dateLabel: 'Aug 8, 2026',
    event: 'scriptCTF 2026',
    description: 'Secured 3rd place in ScriptSorcerers’ 48-hour jeopardy-style CTF.',
    href: 'https://ctf.scriptsorcerers.xyz/',
    Icon: Trophy,
  },
  {
    place: '11th',
    rank: 11,
    date: '2026-08-05',
    dateLabel: 'Aug 5, 2026',
    event: 'Kali-CTF 26',
    description: 'Placed 11th in Kali-CTF 26 after a strong competitive run.',
    href: 'https://register.kali-team.online/',
    Icon: Flag,
  },
  {
    place: '9th',
    rank: 9,
    date: '2026-08-01',
    dateLabel: 'Aug 1, 2026',
    event: 'LIT CTF 2026',
    description: 'Earned a top 10 finish at LIT CTF 2026.',
    href: 'https://lit.lhsmathcs.org/',
    Icon: Flag,
  },
  {
    place: '29th',
    rank: 29,
    date: '2026-06-27',
    dateLabel: 'Jun 27, 2026',
    event: 'SekaiCTF',
    description:
      "Placed 29th out of 926 teams in Project SEKAI's fifth annual CTF, featuring an $8,000 prize pool.",
    href: 'https://ctf.sekai.team/',
    Icon: Flag,
  },
  {
    place: '9th',
    rank: 9,
    date: '2026-06-27',
    dateLabel: 'Jun 27, 2026',
    event: 'V1tCTF',
    description: 'Top 9 finish out of 953 teams.',
    href: 'https://2026.v1t.site/',
    Icon: Flag,
  },
  {
    place: '20th',
    rank: 20,
    date: '2026-05-22',
    dateLabel: 'May 22, 2026',
    event: 'DEF CON 34 CTF Qualifier',
    description: "Competed against the world's best CTF teams in one of the biggest CTF events",
    href: 'https://bbbctf.com/',
    Icon: Flag,
  },
  {
    place: '1st',
    rank: 1,
    date: '2026-05-29',
    dateLabel: 'May 29, 2026',
    event: 'THEM?!CTF 2026',
    description: 'First place finish at THEM?!CTF 2026.',
    href: 'https://ctf.themctf.com/',
    Icon: Trophy,
  },
  {
    place: '7th',
    rank: 7,
    date: '2026-02-26',
    dateLabel: 'Feb 26, 2026',
    event: 'MetaCTF February 2026',
    description: 'Strong finish in a monthly MetaCTF event.',
    href: 'https://metactf.com/blog/tag/flash-feb2026/',
    Icon: Flag,
  },
  {
    place: '8th',
    rank: 8,
    date: '2026-06-12',
    dateLabel: 'Jun 12, 2026',
    event: 'boroCTF 2026 HS Bracket',
    description: 'Top 10 result in the high school bracket.',
    href: 'https://boroctf.com/',
    Icon: Flag,
  },
  {
    place: '9th',
    rank: 9,
    date: '2026-06-05',
    dateLabel: 'Jun 5, 2026',
    event: 'GPN CTF 2026 HS Bracket',
    description: 'Another top 10 high school bracket placement.',
    href: 'https://gpn24.ctf.kitctf.de/',
    Icon: Flag,
  },
  {
    place: '5th',
    rank: 5,
    date: '2026-05-15',
    dateLabel: 'May 15, 2026',
    event: 'TJCTF 2026',
    description: 'Top five placement at TJCTF 2026.',
    href: 'https://tjctf.org/',
    Icon: Flag,
  },
  {
    place: '8th',
    rank: 8,
    date: '2026-07-11',
    dateLabel: 'Jul 11, 2026',
    event: 'BroncoCTF 2026',
    description: 'Placed 8th in BroncoCTF, a dynamic-scoring CTF with no team size limit.',
    href: 'https://broncosec.com/BroncoCTF',
    Icon: Flag,
  },
  {
    place: '14th',
    rank: 14,
    date: '2026-07-11',
    dateLabel: 'Jul 11, 2026',
    event: 'Junior.Crypt.2026 CTF',
    description: 'Placed 14th in Junior.Crypt.2026 CTF on the GRODNO::CTF platform.',
    href: 'https://ctftime.org/event/3335/',
    Icon: Flag,
  },
  {
    place: '10th',
    rank: 10,
    date: '2026-07-06',
    dateLabel: 'Jul 6, 2026',
    event: 'LYKNCTF',
    description:
      'Placed 10th in LYKNCTF, an online beginner-friendly jeopardy event with 657 teams.',
    href: 'https://ctftime.org/event/3280/',
    Icon: Flag,
  },
];

export default function CtfPlacementsPage() {
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const sortedPlacements = [...placements].sort((a, b) => {
    if (sortBy === 'placement') {
      return a.rank - b.rank || b.date.localeCompare(a.date);
    }

    return b.date.localeCompare(a.date) || a.rank - b.rank;
  });

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

        <div className='flex w-full items-center justify-between gap-3'>
          <p className='text-light-gray-2 text-sm font-medium'>Sort by</p>
          <div
            className='bg-very-dark-gray border-dark-gray-3 flex rounded-lg border p-1'
            role='group'
            aria-label='Sort CTF placements'
          >
            <button
              type='button'
              aria-pressed={sortBy === 'date'}
              onClick={() => setSortBy('date')}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                sortBy === 'date'
                  ? 'bg-dark-gray-4 text-white'
                  : 'text-light-gray-2 hover:text-light-gray-4'
              }`}
            >
              <CalendarDays size={15} />
              Date
            </button>
            <button
              type='button'
              aria-pressed={sortBy === 'placement'}
              onClick={() => setSortBy('placement')}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                sortBy === 'placement'
                  ? 'bg-dark-gray-4 text-white'
                  : 'text-light-gray-2 hover:text-light-gray-4'
              }`}
            >
              <Trophy size={15} />
              Best placement
            </button>
          </div>
        </div>

        <div className='grid w-full grid-cols-1 gap-3 sm:grid-cols-2'>
          {sortedPlacements.map(({ place, date, dateLabel, event, description, href, Icon }) => (
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
                <time
                  dateTime={date}
                  className='text-light-gray-2 mb-2 flex items-center gap-2 text-xs font-semibold'
                >
                  <CalendarDays size={13} />
                  {dateLabel}
                </time>
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
