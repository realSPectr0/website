import Link from 'next/link';
import React from 'react';

import { socialBrands } from '@/data/index';

import DynamicIcon from '../dynamic-icon';

export default function Brandcontainer() {
  return (
    <section className='relative flex h-min w-full flex-none flex-nowrap gap-[30px] overflow-hidden p-[0px_0px_10px]'>
      <div className='maskImage flex max-h-full w-full max-w-full justify-between overflow-hidden p-2.5'>
        <MerqueeItems />
      </div>
    </section>
  );
}

const MerqueeItems = () => {
  return (
    <ul className='relative flex h-full max-h-full w-full max-w-full shrink-0 flex-wrap place-items-center justify-center gap-7 p-0'>
      {socialBrands.map((brand) => (
        <li
          key={brand.id}
          className='h-full w-auto'
        >
          <Link
            className='relative block h-[45px] w-20 shrink-0 cursor-pointer overflow-hidden'
            href={brand.link}
            target='_blank'
            rel='noopener noreferrer'
          >
            <div className='absolute top-0 right-0 bottom-0 left-0 shrink-0 rounded-[inherit]'>
              <DynamicIcon
                darkImage={brand.icon}
                lightImage={brand.lightIcon}
                className='block h-full w-full shrink-0 rounded-[inherit] object-contain'
                altText={brand.name}
                width={80}
                height={45}
              />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};
