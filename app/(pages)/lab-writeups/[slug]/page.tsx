import fs from 'node:fs';
import path from 'node:path';

import { ArrowLeft, FlaskConical } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import MarkdownArticle from '@/components/LabWriteups/MarkdownArticle';
import { getLabWriteup, labWriteups } from '@/data/lab-writeups';

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function MetaPill({ children }: { children: React.ReactNode }) {
  return (
    <span className='bg-dark-gray-4 border-border-color text-light-gray-3 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase'>
      {children}
    </span>
  );
}

export function generateStaticParams() {
  return labWriteups.map((writeup) => ({
    slug: writeup.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const writeup = getLabWriteup(slug);

  if (!writeup) {
    return {};
  }

  return {
    title: `${writeup.title} Writeup`,
    description: writeup.summary,
  };
}

export default async function LabWriteupDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const writeup = getLabWriteup(slug);

  if (!writeup) {
    notFound();
  }

  const markdownPath = path.join(process.cwd(), 'content/lab-writeups', writeup.file);
  const markdown = fs.readFileSync(markdownPath, 'utf8');

  return (
    <main className='relative flex h-min w-full flex-1 flex-col flex-nowrap items-center justify-start overflow-hidden p-0'>
      <article className='relative flex h-min w-full max-w-full flex-none flex-col flex-nowrap items-start justify-center gap-6 overflow-visible p-[80px_0px] sm:px-5 lg:w-[80%] lg:max-w-[980px] lg:px-0'>
        <Link
          href='/lab-writeups'
          className='text-light-gray-2 hover:text-white inline-flex items-center gap-2 text-sm font-semibold'
        >
          <ArrowLeft size={16} />
          Lab Writeups
        </Link>

        <header className='border-dark-gray-4 flex w-full flex-col gap-6 border-b border-dashed pb-8'>
          <div className='bg-dark-gray-3 border-dark-gray-3 relative aspect-[16/7] w-full overflow-hidden rounded-2xl border'>
            <Image
              src={writeup.thumbnail}
              alt={`${writeup.title} lab thumbnail`}
              fill
              priority
              className='object-cover'
              sizes='(min-width: 1024px) 980px, 100vw'
            />
          </div>

          <div className='flex flex-col gap-4'>
            <div className='flex flex-wrap gap-2'>
              <MetaPill>{writeup.source}</MetaPill>
              <MetaPill>{writeup.difficulty}</MetaPill>
              {writeup.categories.map((category) => (
                <MetaPill key={category}>{category}</MetaPill>
              ))}
            </div>

            <div className='flex items-start gap-3'>
              <div className='bg-dark-gray-3 border-border-color mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border'>
                <FlaskConical
                  className='text-light-gray-3'
                  size={24}
                />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-white'>{writeup.title}</h1>
                <p className='text-light-gray-2 mt-2 text-[15px] leading-7'>{writeup.summary}</p>
              </div>
            </div>
          </div>
        </header>

        <MarkdownArticle markdown={markdown} />
      </article>
    </main>
  );
}
