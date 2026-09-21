// All portfolio content lives here, so editing the site never means touching markup.

export interface Project {
  id: string;
  name: string;
  tagline: string;
  problem: string;
  highlights: string[];
  stack: string[];
  live?: string;
  liveNote?: string;
  repo?: string;
  status?: string;
  accent: string;
}

export interface Role {
  title: string;
  company: string;
  place: string;
  period: string;
  points: string[];
}

export const profile = {
  name: "Vruttant Patoliya",
  handle: "Vru008",
  role: "React Developer · Full-Stack",
  location: "Jersey City, NJ",
  email: "vruttantpatel007@gmail.com",
  github: "https://github.com/Vru008",
  resume: "resume.pdf",
  headline: "React.js specialist with 2+ years of production experience. I build fast, accessible interfaces, and the Node APIs and LLM features behind them.",
  rotating: ["React interfaces", "reusable component systems", "AI-powered features", "full-stack MERN apps"],
  summary:
    "React developer with 2+ years shipping production web apps for client teams in Ahmedabad, and an MS in Information Technology (Sep 2026) from the US. " +
    "I like taking a product from blank repo to deployed: component-driven React front ends, REST APIs with auth and RBAC, MongoDB models, CI jobs, " +
    "and AI features that do real work. I also use AI assistants daily to build faster without lowering the bar.",
};

export const projects: Project[] = [
  {
    id: "jobmate",
    name: "JobMate",
    tagline: "AI-powered job marketplace for seekers, recruiters and admins",
    problem: "Job seekers juggle spreadsheets and tabs while recruiters track applicants in email. JobMate puts both sides on one platform.",
    highlights: [
      "Built and deployed a 3-role marketplace (seeker, recruiter, admin); hosted on Vercel + Render",
      "Role-based access control and resource-ownership checks across every API",
      "AI résumé ↔ job match score (0–100) with strengths, gaps and suggested edits",
      "AI cover-letter writer, job-description generator and a career chatbot",
      "JWT auth with bcrypt hashing and automatic session expiry",
      "Backend being migrated to TypeScript with shared domain and API types",
    ],
    stack: ["React", "React Router", "Framer Motion", "TypeScript", "Node.js", "Express", "MongoDB", "Gemini API"],
    live: "https://job-mate-nu.vercel.app",
    repo: "https://github.com/Vru008/job-mate",
    accent: "#7c9cff",
  },
  {
    id: "jobpulse",
    name: "JobPulse",
    tagline: "Serverless job aggregator that sweeps ~90 company boards three times a day",
    problem: "Good junior roles are spread across dozens of applicant-tracking systems and disappear fast.",
    highlights: [
      "Aggregates Greenhouse, Lever, Ashby and remote job APIs with a bounded-concurrency fetcher (keeps 100+ requests inside a 30 s serverless budget)",
      "Deduplication, fit scoring and daily non-overlapping rotation of results",
      "GitHub Actions cron hits a secured serverless endpoint 3× a day; nothing to run locally",
      "Cross-device sync through MongoDB Atlas; AI tailored résumé + cover letter exported to PDF",
    ],
    stack: ["JavaScript", "Vercel Functions", "MongoDB", "GitHub Actions", "Python", "Gemini API"],
    live: "https://job-pulse-plum.vercel.app",
    liveNote: "passcode-protected personal tool",
    repo: "https://github.com/Vru008/JobPulse",
    accent: "#3ddc97",
  },
  {
    id: "healthkeeper",
    name: "HealthKeeper",
    tagline: "Appointment scheduling for patients and doctors, with an AI assistant",
    problem: "Booking, reminders and follow-up questions usually live in three different places.",
    highlights: [
      "Full MERN rebuild of an earlier static site: JWT auth, patient and doctor portals",
      "Booking with .ics, Google Calendar and browser-notification reminders",
      "Floating Gemini chat assistant for health-admin questions",
      "Real-time form validation and a responsive component system",
    ],
    stack: ["React", "React Router", "Node.js", "Express", "MongoDB", "Gemini API"],
    repo: "https://github.com/Vru008/HealthKeeper",
    accent: "#ff8fab",
  },
  {
    id: "bharatpulse",
    name: "BharatPulse",
    tagline: "Indian stock-signal dashboard with an honest paper-trading scoreboard",
    problem: "Most retail “signal” apps never show whether their signals actually worked.",
    highlights: [
      "Next.js 16 App Router with strict TypeScript and Tailwind v4",
      "Pure, unit-tested indicator maths (23 Vitest tests) kept apart from the UI",
      "Server-side market data with a 5-minute cache and interactive candlestick charts",
      "Paper-trade scoreboard that grades every signal: educational, not advice",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Vitest"],
    status: "Code available on request",
    accent: "#ffb454",
  },
  {
    id: "growpath",
    name: "GrowPath",
    tagline: "Mobile financial planner for India: salary, goals and 30-year projections",
    problem: "Finance apps show you the past. GrowPath shows where today's choices take you, with ranges instead of one made-up number.",
    highlights: [
      "Monorepo: pure TypeScript engine (57 tests) consumed by a React Native / Expo app",
      "Monte-Carlo simulation for goal probability; old vs new tax-regime calculator",
      "Data script pulls real mutual-fund NAV history and computes rolling-return bands",
      "English, Hindi and Gujarati UI; PDF report export",
    ],
    stack: ["React Native", "Expo", "TypeScript", "Vitest", "Node.js"],
    status: "In active development",
    accent: "#b18cff",
  },
];

export const experience: Role[] = [
  {
    title: "Software Developer (Frontend)",
    company: "iCliQ Solution",
    place: "Ahmedabad, India",
    period: "May 2023 – Jul 2024",
    points: [
      "Built and maintained responsive web apps in React, JavaScript, HTML/CSS and Bootstrap for several client projects",
      "Improved page-load performance and UI responsiveness by optimising JavaScript and CSS",
      "Built reusable React components that standardised UI patterns and cut duplication",
      "Worked with designers and backend developers through Git/GitHub to ship on schedule",
    ],
  },
  {
    title: "Software Developer (Frontend)",
    company: "Hornbook Technologies Pvt. Ltd.",
    place: "Ahmedabad, India",
    period: "Feb 2022 – May 2023",
    points: [
      "Developed mobile-friendly, cross-browser web applications with React, JavaScript and Bootstrap",
      "Designed reusable UI components that made new features faster to build and easier to maintain",
    ],
  },
];

export const education = [
  { school: "Washington University of Science and Technology", degree: "MS, Information Technology", period: "Sep 2026" },
  { school: "Gujarat Technological University", degree: "B.E., Computer Engineering", period: "2023 · CGPA 7.5" },
];

export const skills: Record<string, string[]> = {
  React: ["React.js", "Hooks & custom hooks", "Context API", "React Router", "Component architecture", "Framer Motion", "React Testing Library"],
  "Frontend & languages": ["JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3", "Next.js", "Bootstrap", "Responsive design", "Accessibility"],
  "Backend & data": ["Node.js", "Express", "REST APIs", "JWT / bcrypt", "Role-based access control", "MongoDB / Mongoose", "Axios"],
  "AI": ["Claude / Claude Code", "ChatGPT", "Gemini API", "LLM API integration", "Structured outputs", "Prompt design"],
  "Tools & deployment": ["Git / GitHub", "GitHub Actions", "Vercel", "Render", "Vite", "Vitest", "VS Code", "Python (scripting)"],
};

export interface AITool {
  id: "claude" | "chatgpt" | "gemini";
  name: string;
  role: string;
  points: string[];
}

export const aiTools: AITool[] = [
  {
    id: "claude",
    name: "Claude",
    role: "Agentic pair-programmer",
    points: [
      "Claude Code in the terminal to explore codebases, plan changes and refactor across many files",
      "Drove JobMate's phased JavaScript → TypeScript migration (setup → shared types → backend)",
      "Writing and reviewing tests, then code review before I commit",
    ],
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    role: "Thinking partner",
    points: [
      "Rubber-duck debugging and explaining unfamiliar APIs or error traces",
      "Comparing approaches and trade-offs before I write code",
      "Drafting docs, READMEs and edge-case test lists",
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    role: "In production, via API",
    points: [
      "gemini-2.5-flash with JSON response schemas behind JobMate's match score, cover letters, JD generator and chatbot",
      "Health-admin assistant in HealthKeeper; résumé tailoring in JobPulse",
      "API keys stay server-side, and every response is validated before React renders it",
    ],
  },
];

export const aiPrinciples = [
  "I read and understand every line AI writes before it ships",
  "Typed schemas so model output can't break the UI",
  "Keys and prompts live on the server, never in the bundle",
];
