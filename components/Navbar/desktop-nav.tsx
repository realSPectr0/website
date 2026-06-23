import React from 'react';

import LocalTime from '../local-time';

export default function DesktopNav() {
  return (
    <div className='hidden w-full items-center justify-end sm:flex'>
      <LocalTime />
    </div>
  );
}
