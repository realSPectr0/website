import { ArrowUpRight, FlaskConical } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { labWriteups } from '@/data/lab-writeups';

function MetaPill({ children }: { children: React.ReactNode }) {
  return (
    <span className='bg-dark-gray-4 border-border-color text-light-gray-3 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase'>
      {children}
    </span>
  );
}

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
              Machine notes, attack paths, categories, and difficulty ratings.
            </p>
          </div>
        </div>

        <div className='grid w-full grid-cols-1 gap-5 md:grid-cols-2'>
          {labWriteups.map((writeup) => (
            <Link
              key={writeup.slug}
              href={`/lab-writeups/${writeup.slug}`}
              className='group bg-very-dark-gray border-dark-gray-3 block overflow-hidden rounded-2xl border transition-colors hover:border-light-gray-3'
            >
              <article className='flex h-full flex-col'>
                <div className='bg-dark-gray-3 relative aspect-[16/8] w-full overflow-hidden'>
                  <Image
                    src={writeup.thumbnail}
                    alt={`${writeup.title} lab thumbnail`}
                    fill
                    className='object-cover'
                    sizes='(min-width: 1024px) 450px, 100vw'
                  />
                </div>

                <div className='flex flex-1 flex-col gap-4 p-5'>
                  <div className='flex items-start justify-between gap-4'>
                    <div>
                      <h2 className='text-xl font-bold text-white'>{writeup.title}</h2>
                      <p className='text-light-gray-2 mt-1 text-sm font-medium'>
                        {writeup.source} · {writeup.difficulty}
                      </p>
                    </div>
                    <div className='bg-dark-gray-4 border-border-color text-light-gray-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border'>
                      <ArrowUpRight
                        size={19}
                        className='transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5'
                      />
                    </div>
                  </div>

                  <div className='flex flex-wrap gap-2'>
                    {writeup.categories.map((category) => (
                      <MetaPill key={category}>{category}</MetaPill>
                    ))}
                  </div>

                  <p className='text-light-gray-2 text-[15px] leading-7'>{writeup.summary}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
