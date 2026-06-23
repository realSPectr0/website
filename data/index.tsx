import {
  Disc3,
  Flag,
  FlaskConical,
  FolderOpen,
  Gamepad2,
  Github,
  Mail,
  User,
  Zap,
} from 'lucide-react';

import {
  archLinuxIcon,
  awardIcon,
  bashIcon,
  campIcon,
  ctfFlagIcon,
  discord,
  gitIcon,
  hyprlandIcon,
  leaderIcon,
  neovimIcon,
  notionIcon,
  obsidianIcon,
  oscpIcon,
  powershellIcon,
  pythonIcon,
  securityLabIcon,
  securityPlusIcon,
  tutoringIcon,
  unityIcon,
  webmasterIcon,
} from '@/app/assets/assets';
import type {
  counterListsType,
  FAQ,
  FollowerData,
  myExperienceTypes,
  myServicesPlansTypes,
  myServicesTypes,
  myShowCasesTypes,
  myStackTypes,
  socialBrandsTypes,
  testimonialsTypes,
} from '@/types';
import type { socialListsTypes } from '@/types';
import type { pagesListsType } from '@/types';

export const pagesLists: pagesListsType[] = [
  {
    id: 1,
    title: 'Home',
    href: '/',
    icon: <User />,
  },
  {
    id: 2,
    title: 'Achievements & Certifications',
    href: '/services',
    icon: <Zap />,
  },
  {
    id: 3,
    title: 'Projects',
    href: '/projects',
    icon: <FolderOpen />,
  },
  {
    id: 5,
    title: 'CTF Placements',
    href: '/ctf-placements',
    icon: <Flag />,
  },
  {
    id: 6,
    title: 'Lab Writeups',
    href: '/lab-writeups',
    icon: <FlaskConical />,
  },
  {
    id: 7,
    title: 'Contact',
    href: '/contact',
    icon: <Mail />,
  },
];

export const socialLists: socialListsTypes[] = [
  {
    id: 1,
    title: 'Discord',
    icon: <Disc3 size={22} />,
    link: 'https://discord.com/users/716340333792854017',
  },
  {
    id: 2,
    title: 'guns.lol',
    icon: <Gamepad2 size={22} />,
    link: 'https://guns.lol/1_void',
  },
  {
    id: 3,
    title: 'GitHub',
    icon: <Github size={22} />,
    link: 'https://github.com/realSPectr0',
  },
  {
    id: 4,
    title: 'Spotify',
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width={22}
        height={22}
        viewBox='0 0 24 24'
        fill='none'
        aria-hidden='true'
      >
        <circle
          cx='12'
          cy='12'
          r='9'
          stroke='currentColor'
          strokeWidth='2'
        />
        <path
          d='M7.8 9.7c2.9-.8 6.2-.5 8.5 1'
          stroke='currentColor'
          strokeWidth='1.8'
          strokeLinecap='round'
        />
        <path
          d='M8.4 12.4c2.2-.6 4.8-.4 6.6.8'
          stroke='currentColor'
          strokeWidth='1.6'
          strokeLinecap='round'
        />
        <path
          d='M9 15c1.6-.4 3.4-.3 4.8.6'
          stroke='currentColor'
          strokeWidth='1.4'
          strokeLinecap='round'
        />
      </svg>
    ),
    link: 'https://open.spotify.com/user/7d52phjgrytj4wzj463622xn1?si=f2eb18698b0b4575',
  },
];

export const socialBrands: socialBrandsTypes[] = [
];

export const counterLists: counterListsType[] = [
  {
    id: 1,
    title: 'Years of Cyber Security Experience',
    value: '3+',
  },
  {
    id: 2,
    title: 'Machines Rooted',
    value: '200+',
  },
  {
    id: 3,
    title: 'Place National CTF Team',
    value: '12th',
  },
  {
    id: 4,
    title: 'Cyber Projects',
    value: '4+',
  },
];

export const myExperience: myExperienceTypes[] = [
  {
    id: 1,
    year: 'Aug. 2025 - Present',
    title: 'Capture-the-Flag',
    company: 'Team:idktheflag',
    label: 'United States',
    description: 'Specialize in web exploitation for the team.',
    bullets: [
      'Ranked peaked Top 20 in the US on CTFtime (Current National Ranking: 20).',
      'Specialize in Web exploitation for the team.',
      'Team placed 14th in PicoCTF 2026 out of 8747 teams that participated.',
      'Placed 8th in MetaCTF (solo) for the team.',
    ],
    links: [
      {
        label: 'CTF team',
        href: 'https://ctftime.org/team/000000',
      },
      {
        label: 'Team home-page',
        href: 'https://example.com',
      },
    ],
    link: 'https://example.com',
    logo: ctfFlagIcon,
    logoLight: ctfFlagIcon,
  },
  {
    id: 2,
    year: 'Sept. 2023 - Present',
    title: 'Offensive Security Lab Research | Independent',
    company: 'Cybersecurity Research and Training',
    label: 'Cupertino, CA',
    description: 'Independent offensive security lab research and training.',
    bullets: [
      'Completed 30+ virtual labs across TryHackMe and HTB. Practicing advanced methodology in alignment with the OSCP curriculum to master manual exploitation and reporting.',
      'Active Directory: Practiced Kerberoasting, PtH, ASREP-roasting, password spraying, and related attack paths.',
    ],
    link: 'https://example.com',
    logo: securityLabIcon,
    logoLight: securityLabIcon,
  },
  {
    id: 3,
    year: 'Sept. 2024 - June 2025',
    title: 'ROLCC Tutoring',
    company: 'Tutored kids from low-income families',
    label: 'Santa Clara, CA',
    description: 'Tutored students and adapted lessons to individual learning needs.',
    bullets: [
      'Supported students in improving understanding of core concepts and completing assignments.',
      'Adapted teaching strategies to meet individual learning needs and skill levels.',
      'Designed personalized lesson approaches to address gaps in understanding and reinforce core skills.',
    ],
    links: [
      {
        label: 'ROLCC Tutoring',
        href: 'https://example.com',
      },
    ],
    link: 'https://example.com',
    logo: tutoringIcon,
    logoLight: tutoringIcon,
  },
  {
    id: 4,
    year: 'Jan. 2023 - June 2023',
    title: 'Webmaster',
    company: 'Managed the Troop website',
    label: 'Los Altos, CA',
    description: 'Maintained and improved a troop website for members and families.',
    bullets: [
      'Maintained and updated the troop website, publishing announcements, schedules, and resources.',
      'Diagnosed and resolved website issues, including broken links, formatting errors, and content inconsistencies.',
      'Reorganized site structure and content to improve usability and navigation for troop members and families.',
    ],
    links: [
      {
        label: 'Troop Website',
        href: 'https://example.com',
      },
    ],
    link: 'https://example.com',
    logo: webmasterIcon,
    logoLight: webmasterIcon,
  },
  {
    id: 5,
    year: 'Jan. 2023 - June 2023',
    title: 'Senior Patrol Leader',
    company: 'Attained the highest position in the Troop',
    label: 'Los Altos, CA',
    description: 'Led troop operations and supported planning for members and families.',
    bullets: [
      'Maintained and updated the troop website, publishing announcements, schedules, and resources.',
      'Diagnosed and resolved website issues, including broken links, formatting errors, and content inconsistencies.',
      'Reorganized site structure and content to improve usability and navigation for troop members and families.',
    ],
    links: [
      {
        label: 'Troop Website',
        href: 'https://example.com',
      },
    ],
    link: 'https://example.com',
    logo: leaderIcon,
    logoLight: leaderIcon,
  },
  {
    id: 6,
    year: 'Summer 2026',
    title: 'Assistant Group Leader',
    company: 'Shine Character Camp',
    label: 'Camp Leadership',
    description: 'Led activities and lessons for campers.',
    bullets: [
      'Led and supported group activities for campers, fostering character development, teamwork, and engagement.',
      'Designed interactive lessons and games to teach values-based concepts in an accessible and engaging way.',
      'Adapted activities to keep students involved, encourage participation, and create a positive camp environment.',
    ],
    link: 'https://example.com',
    logo: campIcon,
    logoLight: campIcon,
  },
];

export const myStack: myStackTypes[] = [
  {
    id: 1,
    title: 'Arch Linux',
    description: 'Daily Driver',
    logo: archLinuxIcon,
    lightLogo: archLinuxIcon,
    link: 'https://archlinux.org',
  },
  {
    id: 2,
    title: 'Hyprland',
    description: 'Wayland Compositor',
    logo: hyprlandIcon,
    lightLogo: hyprlandIcon,
    link: 'https://hyprland.org',
  },
  {
    id: 3,
    title: 'Git',
    description: 'Version Control',
    logo: gitIcon,
    lightLogo: gitIcon,
    link: 'https://git-scm.com',
  },
  {
    id: 4,
    title: 'Obsidian',
    description: 'Research Notes',
    logo: obsidianIcon,
    lightLogo: obsidianIcon,
    link: 'https://obsidian.md',
  },
  {
    id: 5,
    title: 'Notion',
    description: 'Project Tracking',
    logo: notionIcon,
    lightLogo: notionIcon,
    link: 'https://www.notion.so',
  },
  {
    id: 6,
    title: 'Bash',
    description: 'Shell Scripting',
    logo: bashIcon,
    lightLogo: bashIcon,
    link: 'https://www.gnu.org/software/bash',
  },
  {
    id: 7,
    title: 'PowerShell',
    description: 'Windows Automation',
    logo: powershellIcon,
    lightLogo: powershellIcon,
    link: 'https://learn.microsoft.com/powershell',
  },
  {
    id: 8,
    title: 'Python',
    description: 'Security Tooling',
    logo: pythonIcon,
    lightLogo: pythonIcon,
    link: 'https://www.python.org',
  },
  {
    id: 9,
    title: 'Neovim',
    description: 'Editor',
    logo: neovimIcon,
    lightLogo: neovimIcon,
    link: 'https://neovim.io',
  },
  {
    id: 10,
    title: 'Discord',
    description: 'Team Comms',
    logo: discord,
    lightLogo: discord,
    link: 'https://discord.com',
  },
];

export const myServices: myServicesTypes[] = [
  {
    id: 1,
    title: 'OSCP',
    description: 'Offensive Security Certified Professional certification preparation.',
    icon: oscpIcon,
    lightIcon: oscpIcon,
    link: '/services',
  },
  {
    id: 2,
    title: 'CompTIA Sec+',
    description: 'Security+ certification covering core security concepts and practices.',
    icon: securityPlusIcon,
    lightIcon: securityPlusIcon,
    link: '/services',
  },
  {
    id: 3,
    title: 'Unity Certified User',
    description: 'Unity Certified User credential.',
    icon: unityIcon,
    lightIcon: unityIcon,
    link: '/services',
  },
  {
    id: 4,
    title: 'Scout of the Year',
    description: 'Scout of the Year award recognition.',
    icon: awardIcon,
    lightIcon: awardIcon,
    link: '/services',
  },
];

export const myShowCases: myShowCasesTypes[] = [];

export const testimonials: testimonialsTypes[] = [];

export const myServicesPlans: myServicesPlansTypes[] = [
  {
    id: 1,
    service: 'OSCP',
    price: 'In Progress',
    description: 'Offensive Security Certified Professional certification preparation.',
    completedWorks: '',
    experience: '',
    totalHoursWorked: '',
    icon: oscpIcon,
    lightIcon: oscpIcon,
  },
  {
    id: 2,
    service: 'CompTIA Sec+',
    price: 'Completed',
    description: 'Security+ certification covering core security concepts and practices.',
    completedWorks: '',
    experience: '',
    totalHoursWorked: '',
    icon: securityPlusIcon,
    lightIcon: securityPlusIcon,
  },
  {
    id: 3,
    service: 'Unity Certified User',
    price: 'Completed',
    description: 'Unity Certified User credential.',
    completedWorks: '',
    experience: '',
    totalHoursWorked: '',
    icon: unityIcon,
    lightIcon: unityIcon,
  },
  {
    id: 4,
    service: 'Scout of the Year',
    price: 'Award',
    description: 'Scout of the Year award recognition.',
    completedWorks: '',
    experience: '',
    totalHoursWorked: '',
    icon: awardIcon,
    lightIcon: awardIcon,
  },
];

export const faqData: FAQ[] = [
  {
    question: 'Can you work with clients remotely?',
    answer:
      'Absolutely! I have experience working with clients from all around the world. Through effective communication channels such as email, video calls, and project management tools, I ensure seamless collaboration regardless of geographical location.',
  },
  {
    question: 'Will my website be mobile-friendly?',
    answer:
      "Absolutely! Mobile responsiveness is a top priority in today's digital landscape. I design and develop websites that are fully responsive and adaptable to various devices and screen sizes. Your website will provide an optimal user experience whether accessed via desktops, smartphones, or tablets.",
  },
  {
    question: 'How long does it typically take to complete a project?',
    answer:
      'The timeline for each project varies depending on its scope and complexity. Factors such as the number of pages, functionalities, and the client feedback process can impact the timeline. Upon discussing your project requirements, I will provide you with a realistic timeline and keep you updated throughout the process.',
  },
  {
    question: 'Can you integrate third-party tools into my website?',
    answer:
      'Yes, I have experience integrating various third-party tools, plugins, and platforms into websites. Whether you need to integrate e-commerce functionalities, social media integration, email marketing services, or anything else, I can recommend and help ensure smooth integration.',
  },
  {
    question: 'Do you offer website maintenance?',
    answer:
      'Yes, I offer website maintenance services to ensure your website remains up to date, secure, and optimized. From performance updates to adding new features and content, I can provide ongoing support to keep your website running smoothly.',
  },
  {
    question: 'How do you handle website revisions?',
    answer:
      'I value your input and collaboration throughout the design process. Upon completing an initial design, I encourage you to provide feedback. I incorporate your suggestions and revisions to ensure the final product aligns with your vision.',
  },
  {
    question: 'Can you optimize my website?',
    answer:
      'Certainly! I incorporate search engine optimization (SEO) best practices into my development process. This includes using relevant keywords, optimizing meta tags, creating search-engine-friendly URLs, and ensuring your website has a solid foundation for better search engine visibility.',
  },
  {
    question: 'What are your payment terms?',
    answer:
      'Payment terms may vary depending on the project scope and duration. Generally, I request an initial deposit before commencing work.',
  },
];

export const followerData: FollowerData[] = [
  {
    platform: 'Discord',
    followers: '716340333792854017',
    url: 'https://discord.com/users/716340333792854017',
    icon: discord,
    lightIcon: discord,
  },
  {
    platform: 'guns.lol',
    followers: '1_void',
    url: 'https://guns.lol/1_void',
    icon: discord,
    lightIcon: discord,
  },
];
