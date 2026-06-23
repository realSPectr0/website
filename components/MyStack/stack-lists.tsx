'use client';
import {
  BookOpen,
  Braces,
  Code2,
  GitBranch,
  LayoutDashboard,
  MessageCircle,
  NotebookText,
  PencilLine,
  SquareTerminal,
  Terminal,
} from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import React from 'react';

import { rightArrow as rightArrowDark, rightArrowLight } from '@/app/assets/assets';
import { myStack } from '@/data';

import DynamicIcon from '../dynamic-icon';

const stackIcons: Record<string, React.ReactNode> = {
  'Arch Linux': <Terminal size={26} />,
  Hyprland: <LayoutDashboard size={26} />,
  Git: <GitBranch size={26} />,
  Obsidian: <NotebookText size={26} />,
  Notion: <BookOpen size={26} />,
  Bash: <SquareTerminal size={26} />,
  PowerShell: <Code2 size={26} />,
  Python: <Braces size={26} />,
  Neovim: <PencilLine size={26} />,
  Discord: <MessageCircle size={26} />,
};

export default function StackLists() {
  return (
    <div className='w-full'>
      <motion.ul
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className='relative grid h-min w-full flex-none auto-rows-min grid-cols-1 justify-center gap-2.5 overflow-visible p-0 lg:grid-cols-[repeat(2,minmax(50px,1fr))] lg:grid-rows-[repeat(2,min-content)]'
      >
        {myStack?.map((stack, index) => (
          <motion.li
            key={stack.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{
              once: true,
            }}
            className='w-full'
          >
            <Link
              href={stack.link}
              aria-label={`View more about ${stack.title}`}
              className='bg-very-dark-gray border-dark-gray-3 group hover:bg-almost-black relative flex h-min w-full cursor-pointer flex-nowrap items-center justify-start gap-2.5 overflow-visible rounded-xl border p-[14px_24px_14px_14px] transition-all duration-500'
            >
              <div className='bg-dark-gray-4 border-border-color text-light-gray-3 flex h-12 w-12 flex-none items-center justify-center rounded-[7px] border'>
                {stackIcons[stack.title] ?? <Terminal size={26} />}
              </div>
              {/* text  */}
              <div className='relative flex h-min flex-1 flex-col flex-nowrap items-start justify-start gap-0 overflow-visible p-0'>
                <div className='relative flex h-auto w-full flex-none shrink-0 flex-col wrap-break-word whitespace-pre-wrap'>
                  <p className='text-light-gray-4 text-[18px] font-semibold'>{stack.title}</p>
                </div>
                <div className='relative flex h-auto w-full flex-none shrink-0 flex-col wrap-break-word whitespace-pre-wrap'>
                  <p className='text-light-gray-2 text-[15px] font-medium'>{stack.description}</p>
                </div>
              </div>
              {/* arrow  */}
              <div className='relative aspect-square h-auto w-6 flex-none overflow-hidden opacity-50 group-hover:opacity-100'>
                <div className='absolute inset-0 flex h-full w-full items-center justify-center rounded-full'>
                  <DynamicIcon
                    lightImage={rightArrowLight}
                    darkImage={rightArrowDark}
                    width={24}
                    height={24}
                    altText='Right arrow icon'
                    className='block h-full w-full rounded-full object-cover object-center transition-all duration-500 group-hover:-rotate-45'
                  />
                </div>
              </div>
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
