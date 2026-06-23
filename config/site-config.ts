import { env } from '../env.mjs';

const siteUrl = env.SITE_URL || 'https://temp3st.vercel.app';
const ogImageUrl = `${siteUrl}/opengraph-image.jpg`;

export const siteConfig = {
  title: 'Jonathan Lin • Cyber Security Portfolio',
  name: 'Jonathan Lin',
  description:
    'The personal portfolio of Jonathan Lin, a Bay Area highschooler interested in cyber security, security research, CTFs, and Arch Linux.',
  keywords: [
    'Jonathan Lin',
    'Jonathan Lin Portfolio',
    'Portfolio Website',
    'Personal Portfolio',
    'Cyber Security Portfolio',
    'Security Research',
    'Capture The Flag',
    'CTF Team',
    'OSCP',
    'CompTIA Security+',
    'Arch Linux',
    'Hyprland',
    'Linux Ricing',
    'Python',
    'Bash',
    'Neovim',
  ],

  icons: {
    icon: '/favicon/darkmclaren.jpg',
    shortcut: '/favicon/darkmclaren.jpg',
    apple: '/favicon/apple-touch-icon.png',
  },

  url: siteUrl,
  ogImage: ogImageUrl,
  twitterHandle: '@jonathanlin',
  locale: 'en_US',
  author: {
    name: 'Jonathan Lin',
    url: 'https://example.com/',
    email: process.env.CONTACT_EMAIL,
  },
  themeColor: '#0f172a',
  googleSiteVerificationId: '', // TODO

  //  <Metadata>
  metadata: {
    title: 'Jonathan Lin • Cyber Security Portfolio',
    description:
      'Explore the projects, achievements, and security research interests of Jonathan Lin.',
    openGraph: {
      type: 'website',
      url: siteUrl,
      title: 'Jonathan Lin • Cyber Security Portfolio',
      description:
        'Explore the projects, achievements, and security research interests of Jonathan Lin.',
      siteName: 'Jonathan Lin',

      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: 'Jonathan Lin Portfolio Preview',
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@jonathanlin',
      creator: '@jonathanlin',
      title: 'Jonathan Lin • Cyber Security Portfolio',
      description:
        'Cyber security portfolio covering security research, CTFs, and Linux workflow projects.',
      images: [ogImageUrl],
    },
  },
};
