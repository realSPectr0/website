'use client';
import { motion } from 'motion/react';
import Link from 'next/link';
import React from 'react';

import { myExperience } from '@/data';

import DynamicIcon from '../dynamic-icon';

export default function ExperienceItem() {
  return (
    <div className='w-full'>
      <motion.ul
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className='relative flex h-min w-full flex-none flex-col flex-nowrap items-start justify-start gap-2.5 overflow-visible p-0'
      >
        {myExperience?.map((exp, index) => (
          <motion.li
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{
              once: true,
            }}
            key={exp.id}
            className='bg-very-dark-gray border-dark-gray-3 relative flex h-min w-full flex-col flex-nowrap justify-start gap-5 overflow-visible rounded-xl border p-4 sm:p-6'
          >
            <div className='relative flex h-min w-full flex-none flex-col justify-between gap-4 overflow-visible p-0 sm:flex-row'>
              <div className='relative flex h-min flex-1 items-start justify-start gap-3 overflow-visible p-0'>
                <div className='bg-dark-gray-4 border-border-color relative float-none flex h-min w-min items-center justify-center gap-2.5 overflow-visible rounded-lg border p-2.5'>
                  <div className='relative aspect-square h-auto w-[30px] flex-none overflow-visible'>
                    <figure className='absolute inset-0 block'>
                      <DynamicIcon
                        width={30}
                        height={30}
                        darkImage={exp.logo}
                        lightImage={exp.logoLight}
                        altText={`${exp.company} logo`}
                        className='block h-full w-full rounded-[inherit] object-cover object-center'
                      />
                    </figure>
                  </div>
                </div>
                <div className='relative flex h-min flex-1 flex-col items-start justify-center gap-2 overflow-visible p-0'>
                  <div className='flex h-min flex-col flex-nowrap items-start justify-start gap-1 overflow-visible'>
                    <div className='relative flex h-auto w-full flex-none shrink-0 flex-col justify-start wrap-break-word whitespace-pre-wrap'>
                      <p className='text-light-gray-4 text-[20px] font-bold'>{exp.title}</p>
                    </div>
                    <div className='relative flex h-auto w-full flex-none shrink-0 flex-col justify-start wrap-break-word whitespace-pre-wrap'>
                      <p className='text-light-gray-2 text-[15px] font-medium'>{exp.company}</p>
                    </div>
                  </div>

                  <div className='flex flex-wrap gap-2'>
                    <span className='bg-dark-gray-2 border-dark-gray-3 text-light-gray-2 rounded-3xl border px-2.5 py-1 text-xs font-medium sm:text-[14px]'>
                      {exp.label}
                    </span>
                    {exp.location && (
                      <span className='bg-dark-gray-2 border-dark-gray-3 text-light-gray-2 rounded-3xl border px-2.5 py-1 text-xs font-medium sm:text-[14px]'>
                        {exp.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className='h-min w-full flex-none flex-nowrap items-center gap-2.5 overflow-visible p-0 whitespace-pre sm:flex sm:w-min'>
                <h3 className='text-light-gray-2 text-base leading-[1.2em] font-bold sm:text-lg'>
                  {exp.year}
                </h3>
              </div>
            </div>
            <div className='border-dark-gray-3 bg-darkest-gray relative flex h-min w-full flex-none flex-col flex-nowrap justify-start gap-1 overflow-visible rounded-xl border p-4'>
              <div className='relative flex w-full flex-none shrink-0 flex-col justify-start wrap-break-word whitespace-pre-wrap'>
                <p className='text-light-gray-2 text-[15px] font-medium'>{exp.description}</p>
              </div>
              {exp.bullets && exp.bullets.length > 0 && (
                <ul className='text-light-gray-2 mt-2 flex list-disc flex-col gap-2 pl-5 text-[15px] font-medium'>
                  {exp.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
              {exp.links && exp.links.length > 0 && (
                <div className='mt-3 flex flex-wrap gap-2'>
                  {exp.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='bg-dark-gray-2 border-dark-gray-3 text-light-gray-3 hover:bg-dark-gray-4 rounded-3xl border px-3 py-1.5 text-sm font-medium'
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
