// All real portfolio content lives here — one source of truth the sections read from.

export const SITE = {
  firstName: 'Samuel',
  lastName: 'Tan',
  brandMark: 'SAMUEL · TAN',
  domain: '// SAMUELTAN.DEV',
  status: 'Incoming AI/ML @ HTX',
  tagline: 'Full-Stack & AI/ML Engineer',
  intro:
    'I build production systems with real engineering depth — from a Rank-Order-Centroid recommendation engine to a hybrid-search RAG pipeline. CS @ NTU. Incoming AI/ML Engineer @ HTX.',
  resumeHref: '/resume.pdf',
} as const

export const LINKS = {
  github: 'https://github.com/SAMTAN444',
  linkedin: 'https://linkedin.com/in/samueltann',
  email: 'tanj0336@e.ntu.edu.sg',
} as const

export const NAV_LINKS = [
  { label: 'PROJECTS', href: '#projects' },
  { label: 'EXPERIENCE', href: '#experience' },
  { label: 'ABOUT', href: '#about' },
  { label: 'CHAT', href: '#chat' },
  { label: 'CONTACT', href: '#contact' },
] as const

export const TICKER_SEGMENTS = [
  { label: 'TARGETING', value: 'AI/ML & Backend roles · 2027' },
  { label: 'LOCATION', value: 'Singapore' },
  { label: 'BUILDING', value: 'Production RAG system' },
] as const

export type Project = {
  title: string
  description: string
  stack: string[]
  inProgress?: boolean
}

export const PROJECTS: Project[] = [
  {
    title: 'Optima',
    description:
      'Secondary-school recommendation platform with a Rank-Order-Centroid weighted scoring engine, live OneMap transit routing with 30-day PostgreSQL caching, and a constraint-relaxation pipeline with bottleneck detection.',
    stack: ['React', 'TypeScript', 'Node', 'PostgreSQL', 'Prisma', 'Docker'],
  },
  {
    title: 'Trackly',
    description:
      'Full-stack internship tracker (50+ users) with stateless JWT auth, full CRUD, search/filter/pagination, and a responsive dashboard.',
    stack: ['React', 'Node', 'Express', 'MongoDB'],
  },
  {
    title: 'This site / Personal RAG system',
    description:
      'A production RAG system over my own corpus: hybrid search + reranking, source-cited grounded answers, out-of-scope refusal, and an evaluation harness. Deployed on AWS.',
    stack: ['FastAPI', 'pgvector', 'Amazon Bedrock', 'React', 'Docker'],
    inProgress: true,
  },
]

export type Experience = {
  org: string
  role: string
  dates: string
  description: string
}

export const EXPERIENCE: Experience[] = [
  {
    org: 'HTX (Home Team Science & Technology Agency)',
    role: 'Incoming AI Engineer Intern',
    dates: 'Aug–Dec 2026',
    description:
      'Multimodal AI prototyping (LLMs, vision-language models, transcription, TTS); cloud ML on AWS/SageMaker.',
  },
  {
    org: 'Singtel',
    role: 'Software Engineer Intern',
    dates: 'May–Jul 2026',
    description:
      'Refactored a Spring Boot service for runtime-configurable batch retrieval; CloudWatch Log Insights; CI/CD with Bamboo/Bitbucket.',
  },
  {
    org: 'YouthTechSG',
    role: 'Open-Source Contributor',
    dates: '2026',
    description:
      'Migrated FormSG (Singapore gov platform) pages to the i18n system with typed translation interfaces.',
  },
]

export const ABOUT_BIO =
  'Computer Science (+ Business) at NTU, NTU School Scholarship. I like building measured, production-grade systems and I’m going deep on applied AI and AWS. Currently studying for the AWS Solutions Architect – Associate cert.'

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
