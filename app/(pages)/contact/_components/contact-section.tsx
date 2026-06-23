'use client';

import {
  Disc3,
  Gamepad2,
  Github,
  Mail,
} from 'lucide-react';

import { emailIcon, emailIconLight } from '@/app/assets/assets';
import ContactForm from '@/components/ContactForm/ContactForm';
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
    href: 'https://guns.lol/1_void',
    label: 'guns.lol',
    value: '1_void',
    Icon: Gamepad2,
  },
  {
    href: 'https://github.com/realSPectr0',
    label: 'GitHub',
    value: 'realSPectr0',
    Icon: Github,
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

      <div className='grid w-full grid-cols-1 gap-3 sm:grid-cols-2'>
        {contactLinks.map(({ href, label, value, Icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('mailto:') ? undefined : '_blank'}
            rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
            className='bg-very-dark-gray border-dark-gray-3 hover:bg-almost-black flex min-h-32 items-start gap-4 rounded-xl border p-5 transition-colors'
          >
            <div className='bg-dark-gray-4 border-border-color flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border'>
              <Icon
                className='text-light-gray-3'
                size={23}
              />
            </div>

            <div className='min-w-0 pt-0.5'>
              <p className='text-light-gray-4 text-lg leading-tight font-semibold'>{label}</p>
              <p className='text-light-gray-2 mt-2 text-[15px] leading-snug font-medium break-words'>
                {value}
              </p>
            </div>
          </a>
        ))}
      </div>

      <ContactForm />
    </>
  );
}
