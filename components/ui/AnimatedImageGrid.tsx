'use client';

import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import type React from 'react';

interface AnimatedImageGridProps {
  image: string | StaticImageData;
}

const AnimatedImageGrid: React.FC<AnimatedImageGridProps> = ({ image }) => {
  return (
    <div className='bg-image-bg relative aspect-square w-44 flex-none overflow-hidden rounded-full sm:w-[260px]'>
      <figure className='h-full w-full rounded-full'>
        <Image
          src={image}
          alt='Profile image'
          width={300}
          height={300}
          className='h-full w-full rounded-full object-cover'
          fetchPriority='high'
        />
      </figure>
    </div>
  );
};

export default AnimatedImageGrid;
