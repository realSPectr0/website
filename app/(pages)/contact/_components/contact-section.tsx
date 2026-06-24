import {
  Disc3,
  Gamepad2,
  Github,
  Mail,
} from 'lucide-react';
import Link from 'next/link';

import { emailIcon, emailIconLight } from '@/app/assets/assets';
import SectionHeading from '@/components/SectionHeading';

const email = 'linjonathan1222@gmail.com';

const contactLinks = [
  {
    href: `mailto:${email}`,
    label: 'Email',
    value: email,
    Icon: Mail,
  },
  {
    href: 'https://discord.com/users/716340333792854017',
    label: 'Discord',
    value: '716340333792854017',
    Icon: Disc3,
  },
  {
    href: 'https://github.com/realSPectr0',
    label: 'GitHub',
    value: 'realSPectr0',
    Icon: Github,
  },
  {
    href: 'https://guns.lol/1_void',
    label: 'guns.lol',
    value: '1_void',
    Icon: Gamepad2,
  },
];

export default function ContactSection() {
  return (
    <>
      <SectionHeading
        darkImage={emailIcon}
        lightImage={emailIconLight}
        title='Contact'
        description='Feel free to reach out to me about any inquiries.'
      />

      <div className='bg-very-dark-gray border-dark-gray-3 flex w-full flex-col gap-5 rounded-xl border p-5'>
        <div className='flex flex-col gap-2'>
          <h2 className='text-light-gray-4 text-lg font-semibold'>Contact info</h2>
          <p className='text-light-gray-2 text-[15px] font-medium'>
            Use one of these links if you want to reach me directly.
          </p>
        </div>

        <div className='grid w-full grid-cols-1 gap-3 sm:grid-cols-2'>
          {contactLinks.map(({ href, label, value, Icon }) => (
            <Link
              key={label}
              href={href}
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              className='bg-darkest-gray border-dark-gray-3 hover:bg-almost-black flex min-h-24 items-start gap-4 rounded-xl border p-4 transition-colors'
            >
              <div className='bg-dark-gray-4 border-border-color flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border'>
                <Icon
                  className='text-light-gray-3'
                  size={20}
                />
              </div>

              <div className='min-w-0 pt-0.5'>
                <p className='text-light-gray-4 text-[15px] leading-tight font-semibold'>
                  {label}
                </p>
                <p className='text-light-gray-2 mt-1 text-[14px] font-medium break-words'>
                  {value}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
