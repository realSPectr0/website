declare module '*.css';

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  import type { StaticImageData } from 'next/image';

  const src: StaticImageData;
  export default src;
}

declare module '*.jpg' {
  import type { StaticImageData } from 'next/image';

  const src: StaticImageData;
  export default src;
}

declare module '*.jpeg' {
  import type { StaticImageData } from 'next/image';

  const src: StaticImageData;
  export default src;
}

declare module '*.webp' {
  import type { StaticImageData } from 'next/image';

  const src: StaticImageData;
  export default src;
}
