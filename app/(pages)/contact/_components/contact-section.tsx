'use client';

import { Disc3, Gamepad2, Mail } from 'lucide-react';

import { emailIcon, emailIconLight } from '@/app/assets/assets';
import ContactForm from '@/components/ContactForm/ContactForm';
import SectionHeading from '@/components/SectionHeading';

const email = 'linjonathan1222@gmail.com';

export default function ContactSection() {
  return (
    <>
      <SectionHeading
        darkImage={emailIcon}
        lightImage={emailIconLight}
        title='Contact'
        description='Feel free to reach out to me about any inquiries.'
      />

      <div className='grid w-full grid-cols-1 gap-3 sm:grid-cols-3'>
        <a
          href={`mailto:${email}`}
          className='bg-very-dark-gray border-dark-gray-3 hover:bg-almost-black flex min-h-28 flex-col justify-between rounded-xl border p-5'
        >
          <Mail
            className='text-light-gray-3'
            size={24}
          />
          <p className='text-light-gray-4 text-lg font-semibold break-all'>{email}</p>
        </a>

        <a
          href='https://discord.com/users/716340333792854017'
          target='_blank'
          rel='noopener noreferrer'
          className='bg-very-dark-gray border-dark-gray-3 hover:bg-almost-black flex min-h-28 flex-col justify-between rounded-xl border p-5'
        >
          <Disc3
            className='text-light-gray-3'
            size={24}
          />
          <p className='text-light-gray-4 text-lg font-semibold'>Discord</p>
        </a>

        <a
          href='https://guns.lol/1_void'
          target='_blank'
          rel='noopener noreferrer'
          className='bg-very-dark-gray border-dark-gray-3 hover:bg-almost-black flex min-h-28 flex-col justify-between rounded-xl border p-5'
        >
          <Gamepad2
            className='text-light-gray-3'
            size={24}
          />
          <p className='text-light-gray-4 text-lg font-semibold'>guns.lol</p>
        </a>
      </div>

      <ContactForm />
    </>
  );
}
