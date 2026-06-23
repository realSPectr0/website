'use client';
import type React from 'react';
import { useState } from 'react';

import { multiplyIcon, multiplyIconLight } from '@/app/assets/assets';
import type { FAQ as FAQType } from '@/types';

import DynamicIcon from '../dynamic-icon';

type FAQProps = {
  data: FAQType[];
};

const FAQ: React.FC<FAQProps> = ({ data }) => {
  const [openIndices, setOpenIndices] = useState<number[]>([]);

  const handleToggle = (index: number) => {
    setOpenIndices((prevIndices) =>
      prevIndices.includes(index) ? prevIndices.filter((i) => i !== index) : [...prevIndices, index]
    );
  };

  return (
    <div className='w-full'>
      <div className='grid w-full grid-cols-1 gap-5 lg:grid-cols-2'>
        {data.map((faq, index) => (
          <div
            key={index}
            className={`flex w-full select-none`}
          >
            <div className='w-full'>
              <div
                onClick={() => handleToggle(index)}
                className='bg-very-dark-gray border-dark-gray-3 cursor-pointer rounded-[14px] border p-6 text-white hover:bg-[#fff]/3'
              >
                <div className='flex items-center justify-between gap-2'>
                  <div className='flex flex-col'>
                    <p
                      className={`text-[17px] font-medium ${
                        openIndices.includes(index) ? 'text-white' : 'text-light-gray-2'
                      }`}
                    >
                      {faq.question}
                    </p>
                  </div>
                  <div
                    className='bg-dark-gray-2 border-dark-gray-4 flex shrink-0 items-center justify-center rounded-[10px] border p-2'
                  >
                    <DynamicIcon
                      darkImage={multiplyIcon}
                      lightImage={multiplyIconLight}
                      altText='toggle icon'
                      className='rotate-45'
                      style={{
                        opacity: openIndices.includes(index) ? 1 : 0.6,
                      }}
                      width={20}
                      height={20}
                    />
                  </div>
                </div>

                {openIndices.includes(index) && (
                  <div>
                    <div className='bg-dark-gray-3 my-4 h-px w-full' />
                    <p className='text-light-gray-2 text-[16px] font-medium'>{faq.answer}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
