import React from 'react';

import { counterLists } from '@/data/index';
export default function CounterContainer() {
  return (
    <div
      className='border-dark-gray-4 relative flex h-min w-full flex-none flex-nowrap items-start justify-start gap-5 overflow-visible border-t border-b border-dashed px-0 py-5'
    >
      <CounterListsItem />
    </div>
  );
}

const CounterListsItem = () => {
  return (
    <ul className='grid w-full grid-cols-2 items-center justify-between gap-2 sm:flex'>
      {counterLists.map((list) => (
        <li
          key={list.id}
          className='w-full'
        >
          <div className='relative flex h-min flex-1 flex-nowrap items-center justify-center gap-1 overflow-visible p-0'>
            <div className='relative h-auto w-auto flex-none'>
              <div className='font-IBM_Plex_Mono! text-very-light-gray items-start justify-start text-[28px] font-bold'>
                {list.value}
              </div>
            </div>
          </div>
          <div className='relative flex w-full flex-none shrink-0 flex-col justify-start wrap-break-word whitespace-pre-wrap'>
            <p className='text-light-gray-2 text-center text-[15px] font-medium'>{list.title}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};
