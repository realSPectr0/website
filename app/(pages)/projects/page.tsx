import {
  ExternalLink,
  FolderOpen,
  Github,
  MonitorCog,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

const projects = [
  {
    title: 'My website',
    description:
      'The source code for this portfolio site, built to showcase projects, CTF results, lab writeups, and contact details.',
    href: 'https://github.com/realSPectr0/website',
    Icon: Github,
  },
  {
    title: 'Linux Environment Configuration Optimization',
    description:
      'Personal Arch Linux dotfiles and workflow configuration for a faster, cleaner desktop and terminal environment.',
    href: 'https://github.com/realSPectr0/arch-dots',
    Icon: MonitorCog,
  },
  {
    title: 'Startpage',
    description:
      'A custom browser start page designed for quick navigation, useful links, and a focused daily browsing setup.',
    href: 'https://github.com/realSPectr0/start.page',
    Icon: FolderOpen,
  },
  {
    title: 'Cyber Security Lessons',
    description:
      'Security learning material covering core concepts, practical techniques, and notes from hands-on research.',
    Icon: ShieldCheck,
  },
];

export default function ProjectsPage() {
  return (
    <main className='relative flex h-min w-full flex-1 flex-col flex-nowrap items-center justify-start overflow-hidden p-0'>
      <section className='relative flex h-min w-full max-w-full flex-none flex-col flex-nowrap items-start justify-center gap-6 overflow-visible p-[80px_0px] sm:px-5 lg:w-[80%] lg:max-w-[750px] lg:px-0'>
        <div className='border-dark-gray-4 flex w-full items-center gap-3 border-b border-dashed pb-6'>
          <div className='bg-dark-gray-3 border-border-color flex h-11 w-11 items-center justify-center rounded-lg border'>
            <FolderOpen
              className='text-light-gray-3'
              size={24}
            />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-white'>Projects</h1>
            <p className='text-light-gray-2 text-[15px] font-medium'>
              A collection of my work and builds.
            </p>
          </div>
        </div>

        <div className='grid w-full grid-cols-1 gap-3 sm:grid-cols-2'>
          {projects.map(({ title, description, href, Icon }) => {
            const content = (
              <>
                <div className='flex items-start justify-between gap-4'>
                  <div className='min-w-0'>
                    <h2 className='text-light-gray-4 text-lg leading-snug font-semibold'>
                      {title}
                    </h2>
                  </div>
                  <div className='bg-dark-gray-4 border-border-color text-light-gray-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border'>
                    <Icon size={22} />
                  </div>
                </div>

                <p className='text-light-gray-2 mt-5 text-[15px] font-medium'>{description}</p>

                {href && (
                  <div className='text-light-gray-3 mt-5 flex items-center gap-2 text-sm font-semibold'>
                    <span>View project</span>
                    <ExternalLink size={16} />
                  </div>
                )}
              </>
            );

            if (href) {
              return (
                <Link
                  key={title}
                  href={href}
                  target='_blank'
                  rel='noreferrer'
                  className='bg-very-dark-gray border-dark-gray-3 group flex min-h-56 flex-col justify-between rounded-xl border p-5 transition-colors hover:border-border-color'
                >
                  {content}
                </Link>
              );
            }

            return (
              <article
                key={title}
                className='bg-very-dark-gray border-dark-gray-3 flex min-h-56 flex-col justify-between rounded-xl border p-5'
              >
                {content}
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
