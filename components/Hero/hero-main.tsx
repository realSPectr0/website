'use client';
import { motion } from 'motion/react';
import Image from 'next/image';

import { AvatarMe, handGif } from '@/app/assets/assets';

import AnimatedImageGrid from '../ui/AnimatedImageGrid';

export default function HeroMain() {
  return (
    <section className='relative flex h-min w-full flex-none flex-col flex-nowrap items-center justify-start gap-5 overflow-visible p-0 lg:flex-row'>
      {/* Left side */}
      <div className='relative flex h-min w-full flex-none flex-col flex-nowrap items-start justify-center gap-2.5 self-start overflow-hidden p-0 md:w-min md:items-center'>
        <AnimatedImageGrid image={AvatarMe} />
      </div>
      {/* Right side */}
      <div className='relative flex h-auto w-full flex-col items-start gap-2 p-0'>
        <div className='flex flex-col gap-1'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              type: 'spring',
              stiffness: 100,
              delay: 0.1,
            }}
            viewport={{ once: true }}
            className='flex items-center gap-1'
          >
            <span>
              <Image
                src={handGif}
                alt='Hand Gesture'
                width={25}
                height={25}
              />
            </span>
            <p className='text-light-gray-2 text-[20px] leading-[1.2em] font-bold'>Hello, I Am</p>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              type: 'spring',
              stiffness: 100,
              delay: 0.2,
            }}
            viewport={{ once: true }}
            className='text-3xl leading-[1.2em] font-bold text-white sm:text-4xl'
          >
            Jonathan Lin
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            type: 'spring',
            stiffness: 100,
            delay: 0.3,
          }}
          viewport={{ once: true }}
          className='text-light-gray-2 mb-4 leading-[150%] font-medium sm:text-[18px]'
        >
          I&apos;m a highschooler from the Bay Area who loves all things related to cyber security. I
          enjoys doing security research and participating in CTFs. I also spend my free time ricing
          my arch linux hyprland.
        </motion.p>
      </div>
    </section>
  );
}
