'use client';

import {
  ExternalLink,
  Github,
} from 'lucide-react';

import { emailIcon, emailIconLight } from '@/app/assets/assets';
import ContactForm from '@/components/ContactForm/ContactForm';
import SectionHeading from '@/components/SectionHeading';

export default function ContactSection() {
  return (
    <>
      <SectionHeading
        darkImage={emailIcon}
        lightImage={emailIconLight}
        title='Contact'
        description='Feel free to reach out to me about any inquiries.'
      />

      <div className='flex w-full justify-end'>
        <a
          href='https://github.com/realSPectr0'
          target='_blank'
          rel='noopener noreferrer'
          className='bg-very-dark-gray border-dark-gray-3 hover:bg-almost-black text-light-gray-4 flex items-center gap-3 rounded-xl border px-4 py-3 text-[15px] font-semibold transition-colors'
        >
          <Github
            className='text-light-gray-3'
            size={20}
          />
          <span>GitHub Profile</span>
          <ExternalLink
            className='text-light-gray-3'
            size={16}
          />
        </a>
      </div>

      <ContactForm />
    </>
  );
}
