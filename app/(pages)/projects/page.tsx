import { FolderOpen } from 'lucide-react';

export default function ProjectsPage() {
  return (
    <main className='relative flex h-min w-full flex-1 flex-col flex-nowrap items-center justify-start overflow-hidden p-0'>
      <section className='relative flex h-min w-full max-w-full flex-none flex-col flex-nowrap items-start justify-center gap-6 overflow-visible p-[80px_0px] sm:px-5 lg:w-[80%] lg:max-w-[750px] lg:px-0'>
        <div className='border-dark-gray-4 flex w-full items-center gap-3 border-b border-dashed pb-6'>
          <div className='bg-dark-gray-3 border-border-color flex h-11 w-11 items-center justify-center rounded-lg border'>
            <FolderOpen
              className='text-light-gray-3'
              size={24}
            />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-white'>Projects</h1>
            <p className='text-light-gray-2 text-[15px] font-medium'>
              A collection of my work and builds.
            </p>
          </div>
        </div>

        <div className='flex w-full items-center justify-center py-20'>
          <p className='text-light-gray-3 text-lg font-semibold'>Coming soon</p>
        </div>
      </section>
    </main>
  );
}
