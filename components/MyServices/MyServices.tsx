import { zapIcon, zapIconLight } from '@/app/assets/assets';

import SectionHeading from '../SectionHeading';
import ServiceItemLists from './service-item-lists';

export default function MyServices() {
  return (
    <section
      aria-labelledby='my-services'
      className='relative flex h-min w-full flex-none flex-col flex-nowrap items-start justify-start gap-[30px] overflow-visible'
    >
      <div className='relative h-auto w-full flex-none'>
        <SectionHeading
          darkImage={zapIcon}
          lightImage={zapIconLight}
          title='Achievements & Certifications'
          description='A short list of security milestones and credentials to customize.'
        />
      </div>
      <ServiceItemLists />
    </section>
  );
}
