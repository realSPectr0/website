import {
  Flag,
  Trophy,
} from 'lucide-react';

const placements = [
  {
    place: '20th',
    event: 'DEF CON 34 CTF Qualifier',
    description: 'Qualified through a competitive global CTF qualifier.',
    Icon: Flag,
  },
  {
    place: '1st',
    event: 'THEM?!CTF 2026',
    description: 'First place finish at THEM?!CTF 2026.',
    Icon: Trophy,
  },
  {
    place: '7th',
    event: 'MetaCTF February 2026',
    description: 'Strong finish in a monthly MetaCTF event.',
    Icon: Flag,
  },
  {
    place: '8th',
    event: 'boroCTF 2026 HS Bracket',
    description: 'Top 10 result in the high school bracket.',
    Icon: Flag,
  },
  {
    place: '9th',
    event: 'GPN CTF 2026 HS Bracket',
    description: 'Another top 10 high school bracket placement.',
    Icon: Flag,
  },
  {
    place: '5th',
    event: 'TJCTF 2026',
    description: 'Top five placement at TJCTF 2026.',
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
          {placements.map(({ place, event, description, Icon }) => (
            <article
              key={`${place}-${event}`}
              className='bg-very-dark-gray border-dark-gray-3 flex min-h-40 flex-col justify-between rounded-xl border p-5'
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

              <p className='text-light-gray-2 mt-5 text-[15px] font-medium'>{description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
