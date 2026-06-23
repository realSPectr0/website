import { FlaskConical } from 'lucide-react';

export default function LabWriteupsPage() {
  return (
    <main className='relative flex h-min w-full flex-1 flex-col flex-nowrap items-center justify-start overflow-hidden p-0'>
      <section className='relative flex h-min w-full max-w-full flex-none flex-col flex-nowrap items-start justify-center gap-6 overflow-visible p-[80px_0px] sm:px-5 lg:w-[80%] lg:max-w-[750px] lg:px-0'>
        <div className='border-dark-gray-4 flex w-full items-center gap-3 border-b border-dashed pb-6'>
          <div className='bg-dark-gray-3 border-border-color flex h-11 w-11 items-center justify-center rounded-lg border'>
            <FlaskConical
              className='text-light-gray-3'
              size={24}
            />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-white'>Lab Writeups</h1>
            <p className='text-light-gray-2 text-[15px] font-medium'>
              Add lab notes, exploitation paths, and remediation summaries here.
            </p>
          </div>
        </div>

        <div className='bg-very-dark-gray border-dark-gray-3 w-full rounded-xl border p-5'>
          <p className='text-light-gray-2 text-[15px] font-medium'>No writeups added yet.</p>
        </div>
      </section>
    </main>
  );
}
