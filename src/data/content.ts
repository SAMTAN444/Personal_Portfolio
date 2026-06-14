// All real portfolio content lives here — one source of truth the sections read from.

export const SITE = {
  firstName: 'Samuel',
  lastName: 'Tan',
  brandMark: 'SAMUEL · TAN',
  domain: '// SAMUELTAN.DEV',
  status: 'SWE intern @ Singtel',
  tagline: 'Software Engineer',
  intro:
    'Hello there! I am a Penultimate Computer Science student at NTU, looking for 2027 spring and summer internships in AI/ML and backend software engineering. Feel free to reach out if you have any opportunities or just want to chat about tech!',
  resumeHref: '/resume.pdf',
} as const

export const LINKS = {
  github: 'https://github.com/SAMTAN444',
  linkedin: 'https://linkedin.com/in/samueltann',
  email: 'samueltjy13@gmail.com',
} as const

export const NAV_LINKS = [
  { label: 'EXPERIENCE', href: '#experience' },
  { label: 'PROJECTS', href: '#projects' },
  { label: 'ABOUT', href: '#about' },
  { label: 'CHAT', href: '#chat' },
  { label: 'CONTACT', href: '#contact' },
] as const

export type Project = {
  title: string
  description: string
  stack: string[]
  inProgress?: boolean
  repo?: string
  demo?: string
}

export const PROJECTS: Project[] = [
  {
    title: 'My Personal Portfolio Website',
    description:
      'Improving frontend design while building a RAG chatbot that answers questions from my own documents, cites sources, and avoids making up answers using the Anthropic API and embeddings.',
    stack: ['FastAPI', 'fastembed', 'Anthropic API', 'React', 'TypeScript'],
    inProgress: true,
  },
  {
    title: 'Trackly',
    description:
      'Full-stack internship tracking platform with 50+ users, built with React, Node, Express, and MongoDB. Features include deadline and interview reminders, a secure authentication system and a internship tracking table with sorting and filtering capabilities.',
    stack: ['React', 'Node', 'Express', 'MongoDB'],
    repo: 'https://github.com/SAMTAN444/Internship-Tracker',
    demo: 'https://internship-tracker-beta.vercel.app/',
  },
  {
    title: 'Optima',
    description:
      'Developed an A-grade project for NTUs Software Engineering (SC2002) module, creating a platform that helps students evaluate and compare secondary schools using personalized rankings, travel-time analysis, and smart recommendation features.',
    stack: ['React', 'TypeScript', 'Node', 'PostgreSQL', 'Prisma', 'Docker'],
    repo: 'https://github.com/SAMTAN444/Optima',
  },
]

export type Experience = {
  org: string
  role: string
  dates: string
  description: string
  link?: string
  linkLabel?: string
  logo?: string
}

export const EXPERIENCE: Experience[] = [
  {
    org: 'HTX (Home Team Science & Technology Agency)',
    role: 'Incoming AI Engineer Intern',
    dates: 'Aug–Dec 2026',
    description:
      'Will be working on multimodal prototypes using LLMs, vision-language models, speech-to-text, and text-to-speech systems, deployed on AWS SageMaker for testing and evaluation.',
    logo: '/logos/htx-trim.png',
  },
  {
    org: 'Singtel',
    role: 'Software Engineer Intern',
    dates: 'May–Jul 2026',
    description:
      'Part of Singtel’s Sales Channel team, working on Java/Spring Boot applications for non-production feature development, with CI/CD via Bitbucket and Bamboo and AWS-based deployment and monitoring.',
    logo: '/logos/singtel-trim.png',
  },
  {
    org: 'YouthTechSG',
    role: 'Open-Source Contributor',
    dates: 'May-Nov 2026',
    description:
      'Selected for a 6-month YouthTech open-source program contributing to FormSG (Singapore government platform), currently working on internationalization (i18n) enhancements.',
    link: 'https://github.com/opengovsg/FormSG/pull/9497',
    linkLabel: 'FormSG PR #9497',
    logo: '/logos/youthtech-trim.png',
  },
  {
    org: 'Fleur Capital',
    role: 'Investment Analyst Intern',
    dates: 'Mar–May 2024',
    description:
      'Created investor decks on Singapore’s VCC framework for multi-family office stakeholders, supporting fundraising and client mandates. Built Power BI dashboards and Excel VBA tools that improved turnaround time by ~30%, and supported evaluation of deals up to SGD 8M through DCF modeling and three-statement analysis for investment decisions.',
    link: '/recommendation-letter.pdf',
    linkLabel: 'Recommendation letter',
  },
]

export const ABOUT_BIO =
  'I am a Computer Science student with a second major in Business at NTU, currently on a school scholarship. I focus on consistently improving my skills through hands-on building and learning, while preparing for the AWS Solutions Architect – Associate certification. Outside of work, I enjoy hiking and scuba diving, which keeps me healthy and active outside of work.'

export const SKILLS = [
  'TypeScript',
  'React',
  'Node',
  'Python',
  'Java/Spring Boot',
  'PostgreSQL',
  'pgvector',
  'MongoDB',
  'Docker',
  'AWS',
]
