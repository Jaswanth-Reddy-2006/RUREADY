import { useRef, useState, useEffect, useMemo, forwardRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useInView, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  Brain,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Check,
  Star,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Code2,
  Activity,
  FileText,
  Compass,
  Users,
  Award,
  Terminal,
  Cpu,
  Layers,
  ThumbsUp,
  Zap,
  Target,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Plus,
  Mic,
  Clock,
  Bot,
  Crosshair,
  Scan,
  Gauge,
  Eye,
  BarChart3,
  Sliders,
  Grid,
  Search,
  ThumbsDown,
  Database,
  Server,
  Smartphone,
  Network,
  Lock,
  X,
  Copy,
  MessageSquare,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

// ─── Company Brand Logo SVGs for Orbital Hero Rings ──────────────

function GoogleLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.27v3.13C3.26 21.3 7.31 24 12 24z" />
      <path fill="#FBBC05" d="M5.28 14.22c-.25-.72-.38-1.49-.38-2.22s.13-1.5.38-2.22V6.65H1.27C.46 8.26 0 10.07 0 12s.46 3.74 1.27 5.35l4.01-3.13z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.27 6.65l4.01 3.13c.95-2.85 3.6-4.96 6.72-4.96z" />
    </svg>
  );
}

function MetaLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#0668E1">
      <path d="M16.78 3.01c-1.89 0-3.66.9-4.78 2.37-1.12-1.47-2.89-2.37-4.78-2.37-3.47 0-6.22 2.78-6.22 6.25 0 4.19 3.64 8.01 9.94 11.45l1.06.58 1.06-.58c6.3-3.44 9.94-7.26 9.94-11.45 0-3.47-2.75-6.25-6.22-6.25z" />
    </svg>
  );
}

function AWSLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#FF9900">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function MicrosoftLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <rect x="1" y="1" width="10" height="10" fill="#F25022" />
      <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
      <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
      <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
    </svg>
  );
}

function AppleLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#0F172A">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.7-0.93 2.73 1 .08 2.01-.48 2.63-1.23z" />
    </svg>
  );
}

function NetflixLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#E50914">
      <path d="M4 2h4.5l5.5 15.5V2H18v20h-4.5L8 6.5V22H4V2z" />
    </svg>
  );
}

function StripeLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#635BFF">
      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-4.116C17.72 2.148 15.228 1.5 12.35 1.5 7.42 1.5 4.09 3.99 4.09 7.962c0 4.707 4.908 5.626 8.358 6.892 2.457.9 3.284 1.65 3.284 2.614 0 .997-.936 1.558-2.385 1.558-2.614 0-5.32-1.157-7.234-2.19l-.92 4.195c2.052 1.053 4.937 1.768 8.017 1.768 5.253 0 8.793-2.392 8.793-6.619 0-4.887-4.757-5.836-8.027-7.022z" />
    </svg>
  );
}

function UberLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <div className={`${className} rounded-full bg-[#0F172A] flex items-center justify-center text-[8px] font-bold text-white font-mono`}>
      UBER
    </div>
  );
}

function OpenAILogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#10A37F">
      <path d="M22.28 10.37a5.97 5.97 0 0 0-.52-4.9 6.04 6.04 0 0 0-6.52-2.8 6.04 6.04 0 0 0-4.74-2.34 6.07 6.07 0 0 0-5.8 4.23 6.04 6.04 0 0 0-3.9 2.84 6.07 6.07 0 0 0 .74 7.12 5.97 5.97 0 0 0 .52 4.9 6.04 6.04 0 0 0 6.52 2.8 6.04 6.04 0 0 0 4.74 2.34 6.07 6.07 0 0 0 5.8-4.23 6.04 6.04 0 0 0 3.9-2.84 6.07 6.07 0 0 0-.74-7.12zm-8.86 10.42a4.57 4.57 0 0 1-2.92-1.05l.15-.08 4.83-2.79a.77.77 0 0 0 .39-.67v-6.8l2.05 1.18a.07.07 0 0 1 .04.05v5.6a4.58 4.58 0 0 1-4.54 4.56z" />
    </svg>
  );
}

function SpotifyLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#1ED760">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.308a.747.747 0 0 1-1.028.248c-2.813-1.718-6.353-2.107-10.523-1.155a.75.75 0 0 1-.336-1.462c4.565-1.043 8.49-.604 11.64 1.341a.748.748 0 0 1 .247 1.028zm1.47-3.268a.936.936 0 0 1-1.287.308c-3.22-1.98-8.13-2.553-11.938-1.396a.937.937 0 0 1-.548-1.792c4.357-1.323 9.775-.684 13.466 1.593a.937.937 0 0 1 .307 1.287zm.126-3.411c-3.86-2.293-10.228-2.505-13.903-1.39a1.124 1.124 0 1 1-.65-2.152c4.227-1.283 11.26-1.036 15.698 1.598a1.125 1.125 0 0 1-1.145 1.944z" />
    </svg>
  );
}

function GitHubLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#0F172A">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedInLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#0A66C2">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function AirbnbLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#FF5A5F">
      <path d="M12 0c-4.1 0-7.3 3.1-7.3 7.3 0 4.9 5.8 11.9 7.3 16.7 1.5-4.8 7.3-11.8 7.3-16.7 0-4.2-3.2-7.3-7.3-7.3zm0 10.4c-1.7 0-3.1-1.4-3.1-3.1s1.4-3.1 3.1-3.1 3.1 1.4 3.1 3.1-1.4 3.1-3.1 3.1z" />
    </svg>
  );
}

function NvidiaLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#76B900">
      <path d="M12.01 6.8c3.08 0 5.48 2.05 6.07 5.03-.43-.27-.92-.45-1.45-.51-.62-1.98-2.42-3.41-4.62-3.41-2.65 0-4.8 2.15-4.8 4.8s2.15 4.8 4.8 4.8c1.78 0 3.32-.97 4.15-2.42.5.15 1.02.26 1.57.29-.98 2.62-3.47 4.49-6.39 4.49-3.96 0-7.18-3.22-7.18-7.16s3.22-7.16 7.85-5.91z" />
    </svg>
  );
}

function FigmaLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#0ACF83" d="M8 24c2.2 0 4-1.8 4-4v-4H8c-2.2 0-4 1.8-4 4s1.8 4 4 4z" />
      <path fill="#A259FF" d="M4 12c0-2.2 1.8-4 4-4h4v8H8c-2.2 0-4-1.8-4-4z" />
      <path fill="#F24E1E" d="M4 4c0-2.2 1.8-4 4-4h4v8H8C5.8 8 4 6.2 4 4z" />
      <path fill="#FF7262" d="M12 0h4c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4V0z" />
      <path fill="#1ABCFE" d="M20 12c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4z" />
    </svg>
  );
}

function SalesforceLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#00A1E0">
      <path d="M19.4 9.1c-.6-2.7-3-4.7-5.9-4.7-1.8 0-3.4.8-4.5 2.1-1-.4-2.1-.6-3.2-.6-3.2 0-5.8 2.6-5.8 5.8 0 1.2.4 2.3 1 3.2C.4 15.6 0 16.7 0 18c0 2.8 2.2 5 5 5h14c2.8 0 5-2.2 5-5 0-2.3-1.6-4.3-3.8-4.8.1-.7.2-1.4.2-2.1 0-1-.3-1.9-.8-2z" />
    </svg>
  );
}

function CompanyMark({ name = '', className = "w-5 h-5" }: { name?: string; className?: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <span className={`${className} rounded-full bg-[#0F172A] flex items-center justify-center text-[8px] font-bold text-white font-mono`}>
      {initials}
    </span>
  );
}

// ─── Frequently Asked Questions Categorized Data ─────────────

interface FaqItem {
  q: string;
  a: string;
}

interface FaqCategory {
  id: string;
  name: string;
  icon: any;
  items: FaqItem[];
  colorTheme?: 'blue' | 'violet';
}

const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: 'ai-interviews',
    name: 'AI Mock Interviews & Ava',
    icon: Brain,
    colorTheme: 'blue',
    items: [
      {
        q: 'How does Ava evaluate my verbal interview answers?',
        a: 'Ava is powered by our calibrated Socratic LLM engine. She listens to your technical explanations, analyzes STAR framework depth (Situation, Task, Action, Result), tracks communication clarity, and asks intelligent non-repeating follow-up questions just like a senior FAANG hiring manager.',
      },
      {
        q: 'What happens if I don’t know the answer to a question?',
        a: 'You can naturally say "Sorry, I don’t know this answer" or "I haven’t learned this yet". Ava responds with human empathy, skips the question without recording it as an answer or penalizing your overall readiness, and smoothly transitions to the next topic.',
      },
      {
        q: 'Can I ask Ava to repeat a question during the call?',
        a: 'Yes! Simply say "Can you repeat the question?" or "Pardon me". Ava will immediately re-read the question clearly with synchronized 3D lip sync without counting it as an answer submission or deducting time.',
      },
      {
        q: 'How does the 3D Avatar lip-sync and facial expression work?',
        a: 'Ava’s 3D avatar features real-time phonetic viseme mapping. As the speech engine synthesizes voice output, viseme morph targets dynamically drive Ava’s jaw, mouth openness, and natural eye blinks for a fluid, human-like conversational experience.',
      },
      {
        q: 'Are the interview questions repetitive or pre-recorded?',
        a: 'Never. Each question is dynamically formulated based on your selected target role, experience level, and the specific claims and tech stack listed on your resume. Follow-up questions adapt to your actual answers in real time.',
      },
    ],
  },
  {
    id: 'coding-sandbox',
    name: 'Technical Coding Sandbox',
    icon: Code2,
    colorTheme: 'blue',
    items: [
      {
        q: 'What programming languages are supported in coding assessments?',
        a: 'Our Monaco editor sandbox supports 6 major languages: JavaScript (Node.js), TypeScript, Python 3, Java 17, C++ (GCC), and Go. Starter code, test suites, and canonical solutions are provided in all 6 languages.',
      },
      {
        q: 'How are unit tests evaluated, and can I test custom inputs?',
        a: 'Your code executes in a sandboxed runtime against both visible unit test cases and hidden edge cases (e.g. boundary values, duplicates, empty arrays). You can also switch to the "Custom Test Case" console tab to input custom JSON arguments and inspect runtime execution in milliseconds.',
      },
      {
        q: 'Where can I find the optimal solution and editorial walkthrough?',
        a: 'Every problem includes an "Ideal Solution" panel in the studio left pane. It provides Big-O time and space complexity targets, key algorithmic intuition, a brute-force vs. optimal comparison, handled edge cases, and copyable canonical reference code.',
      },
      {
        q: 'What algorithmic patterns are covered in the catalog?',
        a: 'The curated catalog covers 15+ top interview patterns including Arrays & Hashing, Two Pointers, Sliding Window, Stack, Dynamic Programming, Intervals, Linked Lists, Graphs, Binary Search, and Heaps.',
      },
      {
        q: 'Does Ava give hints if I get stuck while writing code?',
        a: 'Yes. Ava offers a 3-level progressive Socratic hint protocol. Level 1 clarifies the algorithmic pattern, Level 2 suggests optimal data structures, and Level 3 guides pseudo-code formulation without spoiling the final implementation.',
      },
    ],
  },
  {
    id: 'ats-resume',
    name: 'ATS Resume Scanner & JD Match',
    icon: FileText,
    colorTheme: 'violet',
    items: [
      {
        q: 'How does the ATS resume scanner analyze my CV?',
        a: 'Our parser extracts technical proficiencies, project impact, and work history from your PDF or DOCX resume. It matches keywords against target job descriptions, flags high-value missing technologies (such as Kafka, Redis, Docker, or Kubernetes), and calculates an uninflated ATS match score.',
      },
      {
        q: 'Does the system suggest bullet point improvements?',
        a: 'Yes. The ATS engine flags passive phrasing and converts weak bullet points into quantifiable STAR statements (Situation, Task, Action, Measurable Result) with impact metrics tailored to high-tier hiring standards.',
      },
      {
        q: 'Can I generate a customized interview based on my resume?',
        a: 'Absolutely. Rennetus synthesizes the tech stack, libraries, and experience claims on your resume to generate targeted Socratic questions specifically testing what you listed.',
      },
      {
        q: 'How does the job description keyword comparison work?',
        a: 'Paste any target job description from LinkedIn, Indeed, or company career pages. The system highlights hard skills, system design expectations, and qualification thresholds you match, along with critical gaps to bridge before applying.',
      },
    ],
  },
  {
    id: 'privacy-proctoring',
    name: 'Privacy, Security & Proctoring',
    icon: ShieldCheck,
    colorTheme: 'blue',
    items: [
      {
        q: 'Does Rennetus record or store my webcam video?',
        a: 'Absolutely not. We maintain a strict Zero Video Recording guarantee. No video files or streams are ever saved to disk or transmitted to our servers. All visual telemetry (face centering, posture stability, and eye gaze tracking) is computed in real-time, on-device in memory, and immediately discarded.',
      },
      {
        q: 'How does the anti-cheat and proctoring engine work?',
        a: 'During assessments, our client-side proctoring engine monitors tab switching, fullscreen deviations, and eye gaze alignment to verify test integrity. A verified presence score is generated for your technical hiring report.',
      },
      {
        q: 'Is my personal data and resume information private?',
        a: 'Yes. All user data, interview transcripts, and uploaded documents are encrypted in transit via TLS 1.3 and at rest with AES-256 encryption. We never share or sell candidate data to third-party advertisers.',
      },
      {
        q: 'Can I disable the camera and microphone during practice?',
        a: 'While camera and mic are required for proctored benchmarks and live lip-synced mock interviews, you can practice coding problems independently without camera permissions.',
      },
    ],
  },
  {
    id: 'readiness-reports',
    name: 'Readiness Score & Reports',
    icon: TrendingUp,
    colorTheme: 'violet',
    items: [
      {
        q: 'What is the Rennetus Readiness Score?',
        a: 'The Readiness Score is a calibrated 0-100 composite index calculated across technical correctness, algorithmic efficiency, STAR communication depth, eye contact confidence, and speech pacing. It gives you an uninflated assessment of whether you meet Tier-1 tech standards.',
      },
      {
        q: 'What is included in the post-interview analysis dashboard?',
        a: 'Your comprehensive dashboard breaks down per-question STAR scores, eye-gaze and speech pace charts, algorithmic time/space analysis, strong points, red flags, and a hiring board decision (Strong Hire, Lean Hire, or Needs Work).',
      },
      {
        q: 'Can I share or download my assessment reports?',
        a: 'Yes, candidates can download a complete PDF assessment report with granular metrics and editorial recommendations to track progress or share with recruiters.',
      },
      {
        q: 'How are hiring board recommendations determined?',
        a: 'Recommendations are computed against calibrated rubrics from Tier-1 tech firms (Amazon Bar Raiser, Google Senior SWE, Meta E5/E6 benchmarks), evaluating both technical ownership and soft-skill execution without sugarcoating.',
      },
    ],
  },
  {
    id: 'subscriptions-access',
    name: 'Subscriptions, Credits & Access',
    icon: Zap,
    colorTheme: 'violet',
    items: [
      {
        q: 'Is there a free trial or free tier available?',
        a: 'Yes! Every new candidate receives complimentary starter credits to experience AI mock interviews, the Monaco coding playground, and ATS resume scans without entering credit card details.',
      },
      {
        q: 'What happens when my subscription or credits expire?',
        a: 'All your past interview reports, resume audit history progress remain accessible in your dashboard indefinitely. You only need active credits to launch new live mock interviews or advanced ATS audits.',
      },
      {
        q: 'Can two learners share an account?',
        a: 'Each account is calibrated to an individual candidate’s voice profile, resume history, and personalized skill gap matrix. We recommend separate accounts so your Readiness Score accurately reflect your individual capabilities.',
      },
      {
        q: 'Will I get access to newly released interview problems and features?',
        a: 'Yes! All active subscribers automatically receive access to new algorithmic problems, updated company-specific question tracks, and upgraded AI models as soon as they are deployed.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept UPI, all major credit/debit cards (Visa, MasterCard, RuPay), Net Banking, and digital wallets via our secure PCI-DSS certified payment gateway.',
      },
    ],
  },
];

// ─── Most Popular Tech Roles Data ─────────────────────────────

interface PopularTechRole {
  title: string;
  category: string;
  stack: string[];
  interviewsCount: string;
  accent: string;
  badgeColor: string;
  roleRoute: string;
}

const POPULAR_TECH_ROLES: PopularTechRole[] = [
  {
    title: 'Full Stack Engineer',
    category: 'Web & Systems',
    stack: ['React', 'Node.js', 'TypeScript', 'Next.js'],
    interviewsCount: '14.2k+ prepped',
    accent: '#4A8BDF',
    badgeColor: 'bg-[#EFFAFD] text-[#2459A8] border-[#DCE7F2] dark:bg-[#1E293B] dark:text-[#93C5FD] dark:border-[#334155]',
    roleRoute: '/interview/new',
  },
  {
    title: 'Backend Systems Engineer',
    category: 'Distributed Infra',
    stack: ['Go', 'Java', 'Kafka', 'Redis', 'PostgreSQL'],
    interviewsCount: '18.9k+ prepped',
    accent: '#047857',
    badgeColor: 'bg-[#E8F5F0] text-[#047857] border-[#A7E3CF] dark:bg-[#064E3B]/30 dark:text-[#34D399] dark:border-[#047857]',
    roleRoute: '/interview/new',
  },
  {
    title: 'AI / Machine Learning Engineer',
    category: 'GenAI & Modeling',
    stack: ['Python', 'PyTorch', 'RAG', 'LLMs', 'Vector DB'],
    interviewsCount: '16.5k+ prepped',
    accent: '#7C3AED',
    badgeColor: 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE] dark:bg-[#4C1D95]/30 dark:text-[#C4B5FD] dark:border-[#7C3AED]',
    roleRoute: '/interview/new',
  },
  {
    title: 'Frontend Architect',
    category: 'Client Platform',
    stack: ['React', 'Next.js', 'Web Vitals', 'Tailwind', 'TS'],
    interviewsCount: '9.8k+ prepped',
    accent: '#A0006D',
    badgeColor: 'bg-[#F8EAF4] text-[#A0006D] border-[#F4B4D6] dark:bg-[#701A75]/30 dark:text-[#F472B6] dark:border-[#A0006D]',
    roleRoute: '/interview/new',
  },
  {
    title: 'DevOps & Cloud SRE',
    category: 'Cloud Infrastructure',
    stack: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD'],
    interviewsCount: '11.3k+ prepped',
    accent: '#D97706',
    badgeColor: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A] dark:bg-[#78350F]/30 dark:text-[#FCD34D] dark:border-[#D97706]',
    roleRoute: '/interview/new',
  },
  {
    title: 'System Design Lead',
    category: 'Staff & Principal SWE',
    stack: ['CAP Theorem', 'Sharding', 'Rate Limiting', 'Microservices'],
    interviewsCount: '21.4k+ prepped',
    accent: '#E11D48',
    badgeColor: 'bg-[#FFF1F2] text-[#E11D48] border-[#FECDD3] dark:bg-[#881337]/30 dark:text-[#FDA4AF] dark:border-[#E11D48]',
    roleRoute: '/interview/new',
  },
  {
    title: 'Mobile App Developer',
    category: 'iOS & Android Native',
    stack: ['Swift', 'SwiftUI', 'Kotlin', 'React Native'],
    interviewsCount: '7.6k+ prepped',
    accent: '#0284C7',
    badgeColor: 'bg-[#F0F9FF] text-[#0284C7] border-[#BAE6FD] dark:bg-[#0C4A6E]/30 dark:text-[#7DD3FC] dark:border-[#0284C7]',
    roleRoute: '/interview/new',
  },
  {
    title: 'Data Platform Engineer',
    category: 'Big Data Pipeline',
    stack: ['Apache Spark', 'Snowflake', 'dbt', 'Airflow', 'SQL'],
    interviewsCount: '8.4k+ prepped',
    accent: '#059669',
    badgeColor: 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0] dark:bg-[#064E3B]/30 dark:text-[#6EE7B7] dark:border-[#059669]',
    roleRoute: '/interview/new',
  },
];

// ─── Interactive Feature Showcase Cards Data ─────────────────

interface FeatureCardTheme {
  border: string;
  bg: string;
  badge: string;
  accentText: string;
  btn: string;
  ring: string;
  glow: string;
}

interface FeatureCardData {
  id: string;
  step: string;
  badge: string;
  title: string;
  description: string;
  keyPoints: string[];
  ctaText: string;
  ctaLink: string;
  accent: string;
  theme: FeatureCardTheme;
}

const FEATURE_CARDS: FeatureCardData[] = [
  {
    id: 'voice-mock',
    step: '01',
    badge: 'Live Socratic AI Mock',
    title: '3D AI Voice Interviewer with Dynamic Lip-Sync',
    description: 'Experience verbal technical interviews with Ava. Dynamic phonetic lip-sync, speech cadence telemetry, and adaptive Socratic follow-ups tailored to your claims.',
    keyPoints: [
      'Speech cadence analysis (140–160 WPM optimal pacing)',
      'STAR framework scoring & verbal filler metric audit',
      'Phonetic morph targets with real-time natural eye contact',
    ],
    ctaText: 'Start Voice Mock',
    ctaLink: '/interview/new',
    accent: '#2563EB',
    theme: {
      border: 'border-blue-500/40 dark:border-blue-500/30',
      bg: 'bg-gradient-to-b from-blue-50/70 via-white to-blue-50/30 dark:from-[#131B2E] dark:via-[#111318] dark:to-[#0D0E12]',
      badge: 'bg-blue-100/80 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/50',
      accentText: 'text-blue-600 dark:text-blue-400',
      btn: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25',
      ring: 'ring-1 ring-blue-500/20',
      glow: 'from-blue-500/20 via-blue-400/5 to-transparent',
    },
  },
  {
    id: 'code-sandbox',
    step: '02',
    badge: 'Monaco Sandbox • 6 Languages',
    title: 'Live In-Browser Code Runner & Editorial Hints',
    description: 'Solve algorithmic challenges with immediate compilation across 6 languages. Test custom edge-case inputs and unlock progressive hints with zero penalty.',
    keyPoints: [
      'Languages: TypeScript, Python, Java, C++, Go, JS',
      'Progressive 3-Tier editorial hints with 0 spoiler penalty',
      'O(1) auxiliary space benchmarks & boundary test coverage',
    ],
    ctaText: 'Open Code Sandbox',
    ctaLink: '/interview/coding',
    accent: '#059669',
    theme: {
      border: 'border-emerald-500/40 dark:border-emerald-500/30',
      bg: 'bg-gradient-to-b from-emerald-50/70 via-white to-emerald-50/30 dark:from-[#0F241C] dark:via-[#111318] dark:to-[#0D0E12]',
      badge: 'bg-emerald-100/80 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/50',
      accentText: 'text-emerald-600 dark:text-emerald-400',
      btn: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/25',
      ring: 'ring-1 ring-emerald-500/20',
      glow: 'from-emerald-500/20 via-emerald-400/5 to-transparent',
    },
  },
  {
    id: 'ats-audit',
    step: '03',
    badge: 'ATS Scanner 2.4 • High Yield',
    title: 'Calibrate Your Resume to Tier-1 Standards',
    description: 'Upload your PDF resume to detect critical technical keyword gaps, flag passive verbs, and generate quantified STAR bullet points benchmarked to top hiring thresholds.',
    keyPoints: [
      'Instant JD keyword extraction & gap highlighting',
      'Automated conversion into quantified STAR statements',
      'Uninflated ATS match score without fake praise',
    ],
    ctaText: 'Scan My Resume',
    ctaLink: '/ats',
    accent: '#9333EA',
    theme: {
      border: 'border-purple-500/40 dark:border-purple-500/30',
      bg: 'bg-gradient-to-b from-purple-50/70 via-white to-purple-50/30 dark:from-[#21122E] dark:via-[#111318] dark:to-[#0D0E12]',
      badge: 'bg-purple-100/80 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/50',
      accentText: 'text-purple-600 dark:text-purple-400',
      btn: 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/25',
      ring: 'ring-1 ring-purple-500/20',
      glow: 'from-purple-500/20 via-purple-400/5 to-transparent',
    },
  },
  {
    id: 'system-design',
    step: '05',
    badge: 'Staff & Principal Systems',
    title: 'System Design Architectural Probes',
    description: 'Design distributed rate limiters, consensus clusters, and multi-region sharded databases. Ava grills you on CAP trade-offs, failover, and zero-downtime rollbacks.',
    keyPoints: [
      'Real-world distributed systems failure scenarios',
      'CAP theorem, cache invalidation & split-brain probes',
      'Latency & throughput scalability benchmarks',
    ],
    ctaText: 'Practice System Design',
    ctaLink: '/interview/new',
    accent: '#D97706',
    theme: {
      border: 'border-amber-500/40 dark:border-amber-500/30',
      bg: 'bg-gradient-to-b from-amber-50/70 via-white to-amber-50/30 dark:from-[#241A0E] dark:via-[#111318] dark:to-[#0D0E12]',
      badge: 'bg-amber-100/80 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/50',
      accentText: 'text-amber-600 dark:text-amber-400',
      btn: 'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-500/25',
      ring: 'ring-1 ring-amber-500/20',
      glow: 'from-amber-500/20 via-amber-400/5 to-transparent',
    },
  },
  {
    id: 'bar-raiser',
    step: '06',
    badge: 'Tier-1 Hiring Committee',
    title: 'Behavioral Rounds & Bar-Raiser Calibration',
    description: 'Simulate high-stakes behavioral rounds evaluated against Amazon 16 LP and Google Googliness benchmarks to communicate ownership and business impact.',
    keyPoints: [
      'Amazon LP & Google E5/E6 behavioral rubrics',
      'Identifies weak accountability or vague impact metrics',
      'Detailed Board Decision report with Hire/No-Hire verdict',
    ],
    ctaText: 'Try Behavioral Mock',
    ctaLink: '/interview/new',
    accent: '#E11D48',
    theme: {
      border: 'border-rose-500/40 dark:border-rose-500/30',
      bg: 'bg-gradient-to-b from-rose-50/70 via-white to-rose-50/30 dark:from-[#291118] dark:via-[#111318] dark:to-[#0D0E12]',
      badge: 'bg-rose-100/80 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/50',
      accentText: 'text-rose-600 dark:text-rose-400',
      btn: 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/25',
      ring: 'ring-1 ring-rose-500/20',
      glow: 'from-rose-500/20 via-rose-400/5 to-transparent',
    },
  },
];

// ─── Diary Entry Testimonials (Analog Physical Notes Style) ───────────────

interface DiaryTestimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  date: string;
  tilt: string;
  accent: string;
  badgeBg: string;
  offerPackage: string;
  readinessScore: number;
  scoreGain: string;
  roundsCleared: string[];
  metrics: {
    label: string;
    value: string;
  }[];
}

const DIARY_TESTIMONIALS: DiaryTestimonial[] = [
  {
    quote: "I failed Google L5 system design twice because I rushed my explanations without clear trade-offs. Ava grilled me relentlessly on CAP theorem nuances, split-brain consensus, and filler words until my pacing became razor sharp.",
    author: "Aarav Sharma",
    role: "Placed at Google L5 (Bengaluru)",
    company: "Google",
    date: "Session #07 • Calibrated",
    tilt: "-rotate-1",
    accent: "#2459A8",
    badgeBg: "bg-[#EFFAFD] text-[#2459A8] border-[#DCE7F2] dark:bg-[#1E293B] dark:text-[#93C5FD] dark:border-[#334155]",
    offerPackage: "$185,000 + Equity",
    readinessScore: 94,
    scoreGain: "+26 pts",
    roundsCleared: ["L5 System Design", "Coding Bar-Raiser", "Google Leadership"],
    metrics: [
      { label: "Speech Cadence", value: "152 WPM (Optimal)" },
      { label: "Verbal Fillers", value: "-78% reduction" },
      { label: "STAR Depth", value: "95% alignment" },
    ],
  },
  {
    quote: "The ATS resume scanner pinpointed 7 missing distributed systems keywords that were silently getting my application filtered out. Fixed them, ran 3 oral mock sessions, and cleared Stripe with zero surprises.",
    author: "Priya Nair",
    role: "Placed at Stripe Backend SDE II",
    company: "Stripe",
    date: "Session #04 • Calibrated",
    tilt: "rotate-1",
    accent: "#A0006D",
    badgeBg: "bg-[#F8EAF4] text-[#A0006D] border-[#F4B4D6] dark:bg-[#701A75]/30 dark:text-[#F472B6] dark:border-[#A0006D]",
    offerPackage: "$210,000 Total Comp",
    readinessScore: 96,
    scoreGain: "+31 pts",
    roundsCleared: ["Distributed Systems", "Concurrency Probes", "Architecture"],
    metrics: [
      { label: "ATS Match", value: "94% target JD" },
      { label: "Keywords Added", value: "7 high-yield" },
      { label: "Oral Score", value: "9.6 / 10" },
    ],
  },
  {
    quote: "Most mock platforms give fake 9/10 praise. Rennetus flagged my Big-O auxiliary space inefficiency immediately in the Monaco editor and forced me to optimize to O(1) in-place before my Amazon bar-raiser.",
    author: "Vikram Sen",
    role: "Placed at Amazon AWS (Hyderabad)",
    company: "Amazon AWS",
    date: "Session #11 • Calibrated",
    tilt: "rotate-1",
    accent: "#047857",
    badgeBg: "bg-[#E8F5F0] text-[#047857] border-[#A7E3CF] dark:bg-[#064E3B]/30 dark:text-[#34D399] dark:border-[#047857]",
    offerPackage: "$145,000 Base Equivalent",
    readinessScore: 92,
    scoreGain: "+22 pts",
    roundsCleared: ["Amazon LP Bar-Raiser", "Monaco DSA Sandbox", "System Design"],
    metrics: [
      { label: "DSA Speed", value: "O(1) in-place" },
      { label: "Test Cases", value: "100% boundary pass" },
      { label: "Decision", value: "Strong Hire" },
    ],
  },
  {
    quote: "The Socratic follow-up questions felt 100% like talking to a real Principal Engineer. No canned scripts — Ava picked up on my exact edge-case assumptions and grilled me on zero-downtime rollback strategies.",
    author: "Sneha Mukherjee",
    role: "Placed at Microsoft Core Platform",
    company: "Microsoft",
    date: "Session #06 • Calibrated",
    tilt: "-rotate-1",
    accent: "#E11D48",
    badgeBg: "bg-[#FFF1F2] text-[#E11D48] border-[#FECDD3] dark:bg-[#881337]/30 dark:text-[#FDA4AF] dark:border-[#E11D48]",
    offerPackage: "$178,000 + Sign-on",
    readinessScore: 95,
    scoreGain: "+28 pts",
    roundsCleared: ["Core Cloud Infra", "Resilience & Rollback", "Culture Alignment"],
    metrics: [
      { label: "Follow-up Handling", value: "96% unscripted" },
      { label: "Eye Gaze Focus", value: "94% confident" },
      { label: "Board Decision", value: "Consensus Hire" },
    ],
  },
];

// ─── Hiring Companies Marquee Data ───────────────────────────

const HIRING_COMPANIES = [
  { name: 'Google', Logo: GoogleLogo },
  { name: 'Stripe', Logo: StripeLogo },
  { name: 'Amazon AWS', Logo: AWSLogo },
  { name: 'Microsoft', Logo: MicrosoftLogo },
  { name: 'Meta', Logo: MetaLogo },
  { name: 'Apple', Logo: AppleLogo },
  { name: 'Uber', Logo: UberLogo },
  { name: 'OpenAI', Logo: OpenAILogo },
  { name: 'Netflix', Logo: NetflixLogo },
  { name: 'Nvidia', Logo: NvidiaLogo },
  { name: 'GitHub', Logo: GitHubLogo },
  { name: 'Figma', Logo: FigmaLogo },
  { name: 'Salesforce', Logo: SalesforceLogo },
  { name: 'Adobe', Logo: CompanyMark },
  { name: 'Atlassian', Logo: CompanyMark },
  { name: 'Shopify', Logo: CompanyMark },
  { name: 'LinkedIn', Logo: LinkedInLogo },
  { name: 'Airbnb', Logo: AirbnbLogo },
  { name: 'Spotify', Logo: SpotifyLogo },
  { name: 'X', Logo: CompanyMark },
  { name: 'Reddit', Logo: CompanyMark },
  { name: 'Slack', Logo: CompanyMark },
  { name: 'Twilio', Logo: CompanyMark },
  { name: 'Cloudflare', Logo: CompanyMark },
  { name: 'Snowflake', Logo: CompanyMark },
  { name: 'Datadog', Logo: CompanyMark },
  { name: 'MongoDB', Logo: CompanyMark },
  { name: 'Oracle', Logo: CompanyMark },
  { name: 'IBM', Logo: CompanyMark },
  { name: 'Cisco', Logo: CompanyMark },
  { name: 'Intel', Logo: CompanyMark },
  { name: 'Qualcomm', Logo: CompanyMark },
  { name: 'Samsung', Logo: CompanyMark },
  { name: 'Walmart Global Tech', Logo: CompanyMark },
  { name: 'JPMorgan Chase', Logo: CompanyMark },
  { name: 'Goldman Sachs', Logo: CompanyMark },
  { name: 'Morgan Stanley', Logo: CompanyMark },
  { name: 'PayPal', Logo: CompanyMark },
  { name: 'Block', Logo: CompanyMark },
  { name: 'Coinbase', Logo: CompanyMark },
  { name: 'Razorpay', Logo: CompanyMark },
  { name: 'PhonePe', Logo: CompanyMark },
  { name: 'Swiggy', Logo: CompanyMark },
  { name: 'Zomato', Logo: CompanyMark },
  { name: 'Flipkart', Logo: CompanyMark },
  { name: 'Meesho', Logo: CompanyMark },
  { name: 'Zoho', Logo: CompanyMark },
  { name: 'Freshworks', Logo: CompanyMark },
  { name: 'Postman', Logo: CompanyMark },
  { name: 'BrowserStack', Logo: CompanyMark },
  { name: 'CRED', Logo: CompanyMark },
  { name: 'Deloitte', Logo: CompanyMark },
  { name: 'Accenture', Logo: CompanyMark },
  { name: 'TCS', Logo: CompanyMark },
  { name: 'Infosys', Logo: CompanyMark },
  { name: 'Wipro', Logo: CompanyMark },
  { name: 'Capgemini', Logo: CompanyMark },
  { name: 'ServiceNow', Logo: CompanyMark },
  { name: 'SAP', Logo: CompanyMark },
  { name: 'ARM', Logo: CompanyMark },
];

// ─── Section Helper Component with Fluid Scroll Trigger ────────

const Section = forwardRef<HTMLElement, {
  children: React.ReactNode;
  className?: string;
  id?: string;
  once?: boolean;
}>(function Section({ children, className = '', id, once = false }, forwardedRef) {
  const internalRef = useRef<HTMLElement>(null);
  const targetRef = (forwardedRef as React.RefObject<HTMLElement>) || internalRef;
  const isInView = useInView(targetRef, { once, margin: '-60px' });

  return (
    <motion.section
      ref={targetRef}
      id={id}
      initial={{ opacity: 0, y: 35 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`scroll-mt-28 ${className}`}
    >
      {children}
    </motion.section>
  );
});

// ─── Technical Blueprint & Drafting Grid Overlays ────────────

function TechnicalGridOverlay({
  className = '',
}: {
  pattern?: string;
  className?: string;
}) {
  return (
    <div className={`absolute inset-0 pointer-events-none z-0 overflow-hidden ${className}`}>
      {/* Dull, subtle small-box grid lines (24px x 24px) */}
      <div
        className="w-full h-full opacity-40 dark:opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(100, 116, 139, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(100, 116, 139, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse 95% 85% at 50% 50%, black 50%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 95% 85% at 50% 50%, black 50%, transparent 100%)',
        }}
      />
    </div>
  );
}

export default function Landing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [conversionEmail, setConversionEmail] = useState('');

  const [activeFaqCategory, setActiveFaqCategory] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [pricingCycle, setPricingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [activeFeatureIndex, setActiveFeatureIndex] = useState<number>(0);

  // ─── 1. Global Page Scroll Progress Hook ─────────────────────
  const { scrollYProgress: globalScroll } = useScroll();
  const scaleX = useSpring(globalScroll, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  // ─── 2. Hero Section Parallax Scroll Hooks ───────────────────
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroContentY = useTransform(heroScroll, [0, 1], [0, 130]);
  const heroOpacity = useTransform(heroScroll, [0, 0.75], [1, 0.15]);
  const heroOrbitScale = useTransform(heroScroll, [0, 1], [1, 0.86]);
  const heroOrbitRotate = useTransform(heroScroll, [0, 1], [0, 24]);
  const heroBlobsY = useTransform(heroScroll, [0, 1], [0, -80]);

  // ─── 3. Cascading Mockups Scroll Depth Parallax ─────────────
  const { scrollYProgress: previewScroll } = useScroll({
    target: previewRef,
    offset: ['start end', 'end start'],
  });
  const leftMockupY = useTransform(previewScroll, [0, 1], [80, -30]);
  const rightMockupY = useTransform(previewScroll, [0, 1], [130, -50]);
  const centerMockupScale = useTransform(previewScroll, [0, 0.5, 1], [0.94, 1.03, 0.96]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#EFFAFD] dark:bg-[#000000] text-[#0F172A] dark:text-[#FFFFFF] overflow-hidden selection:bg-[#4A8BDF]/20 selection:text-[#2459A8] font-sans"
    >
      <Helmet>
        <title>Rennetus — Recognize • Rebuild • Rise | AI Interview Platform</title>
        <meta
          name="description"
          content="Rennetus — Calibrated AI Mock Interviews, ATS Resume Alignment, Live In-Browser Coding Sandbox, and Calibrated AI Interview Practice and ATS Resume Alignment."
        />
      </Helmet>

      {/* ─── Global Top Smooth Scroll Progress Bar ─── */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#4A8BDF] via-[#2459A8] to-[#E11D48] origin-left z-50 pointer-events-none shadow-sm shadow-[#4A8BDF]/40"
      />

      {/* ─── Global Background Architectural Grid Lines (Dull color, small boxes) ─── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="w-full h-full opacity-35 dark:opacity-15"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(100, 116, 139, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(100, 116, 139, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* ─── Global Tactile Analog Paper Grain Overlay ─── */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.24] dark:opacity-[0.14] mix-blend-overlay">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="rennetus-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#rennetus-grain)" />
        </svg>
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/* 1. HERO SECTION WITH PERFECT CONCENTRIC ORBITING LOGOS   */}
      {/* ════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[96vh] flex flex-col items-center justify-center pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-gradient-to-b from-[#EFFAFD] via-white to-[#EFFAFD] dark:from-[#000000] dark:via-[#1A1A1A] dark:to-[#000000]"
      >
        {/* Technical Blueprint Grid Backdrop + Horizon Grid Floor */}
        <TechnicalGridOverlay pattern="perspective" />

        {/* Ambient Radial Background Glows with Scroll Parallax + Floating Motion */}
        <motion.div style={{ y: heroBlobsY }} className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ y: [-10, 10, -10], x: [-6, 6, -6] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-[#4A8BDF]/12 dark:bg-white/5 rounded-full blur-[140px] pointer-events-none z-0"
          />
          <motion.div
            animate={{ y: [10, -10, 10], x: [6, -6, 6] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[480px] h-[480px] bg-[#E11D48]/8 dark:bg-white/5 rounded-full blur-[120px] pointer-events-none z-0"
          />
        </motion.div>

        {/* ─── Concentric Circular Orbit Rings with Smooth Rotating Logos & Scroll Scale ─── */}
        <motion.div
          style={{ scale: heroOrbitScale, rotate: heroOrbitRotate }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-10"
        >
          {/* ORBIT RING 1: Inner Perimeter (Radius 360px => Diameter 720px) */}
          <div className="absolute w-[720px] h-[720px] rounded-full border border-[#DCE7F2]/90 dark:border-[#262626] hidden md:block">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0"
            >
              {/* 0 deg (Top) - Google */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
                  className="p-3 rounded-full bg-white dark:bg-[#1C1C1C] border border-[#DCE7F2] dark:border-[#262626] shadow-md hover:scale-120 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
                  title="Google"
                >
                  <GoogleLogo className="w-5 h-5" />
                </motion.div>
              </div>

              {/* 60 deg - AWS */}
              <div className="absolute top-[25%] right-[6.7%] translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
                  className="p-3 rounded-full bg-white dark:bg-[#1C1C1C] border border-[#DCE7F2] dark:border-[#262626] shadow-md hover:scale-120 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
                  title="AWS"
                >
                  <AWSLogo className="w-5 h-5" />
                </motion.div>
              </div>

              {/* 120 deg - Stripe */}
              <div className="absolute bottom-[25%] right-[6.7%] translate-x-1/2 translate-y-1/2 pointer-events-auto">
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
                  className="p-3 rounded-full bg-white dark:bg-[#1C1C1C] border border-[#DCE7F2] dark:border-[#262626] shadow-md hover:scale-120 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
                  title="Stripe"
                >
                  <StripeLogo className="w-5 h-5" />
                </motion.div>
              </div>

              {/* 180 deg (Bottom) - Uber */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-auto">
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
                  className="p-3 rounded-full bg-white dark:bg-[#1C1C1C] border border-[#DCE7F2] dark:border-[#262626] shadow-md hover:scale-120 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
                  title="Uber"
                >
                  <UberLogo className="w-5 h-5" />
                </motion.div>
              </div>

              {/* 240 deg - OpenAI */}
              <div className="absolute bottom-[25%] left-[6.7%] -translate-x-1/2 translate-y-1/2 pointer-events-auto">
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
                  className="p-3 rounded-full bg-white dark:bg-[#1C1C1C] border border-[#DCE7F2] dark:border-[#262626] shadow-md hover:scale-120 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
                  title="OpenAI"
                >
                  <OpenAILogo className="w-5 h-5" />
                </motion.div>
              </div>

              {/* 300 deg - GitHub */}
              <div className="absolute top-[25%] left-[6.7%] -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
                  className="p-3 rounded-full bg-white dark:bg-[#1C1C1C] border border-[#DCE7F2] dark:border-[#262626] shadow-md hover:scale-120 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
                  title="GitHub"
                >
                  <GitHubLogo className="w-5 h-5" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* ORBIT RING 2: Middle Perimeter (Radius 520px => Diameter 1040px) */}
          <div className="absolute w-[1040px] h-[1040px] rounded-full border border-[#DCE7F2]/60 dark:border-[#262626]/70 hidden lg:block">
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 68, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0"
            >
              {/* 30 deg - Meta */}
              <div className="absolute top-[6.7%] right-[25%] translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 68, repeat: Infinity, ease: 'linear' }}
                  className="p-3 rounded-full bg-white dark:bg-[#1C1C1C] border border-[#DCE7F2] dark:border-[#262626] shadow-md hover:scale-120 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
                  title="Meta"
                >
                  <MetaLogo className="w-5 h-5" />
                </motion.div>
              </div>

              {/* 90 deg (Right) - Microsoft */}
              <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 68, repeat: Infinity, ease: 'linear' }}
                  className="p-3 rounded-full bg-white dark:bg-[#1C1C1C] border border-[#DCE7F2] dark:border-[#262626] shadow-md hover:scale-120 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
                  title="Microsoft"
                >
                  <MicrosoftLogo className="w-5 h-5" />
                </motion.div>
              </div>

              {/* 150 deg - Apple */}
              <div className="absolute bottom-[6.7%] right-[25%] translate-x-1/2 translate-y-1/2 pointer-events-auto">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 68, repeat: Infinity, ease: 'linear' }}
                  className="p-3 rounded-full bg-white dark:bg-[#1C1C1C] border border-[#DCE7F2] dark:border-[#262626] shadow-md hover:scale-120 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
                  title="Apple"
                >
                  <AppleLogo className="w-5 h-5" />
                </motion.div>
              </div>

              {/* 210 deg - Netflix */}
              <div className="absolute bottom-[6.7%] left-[25%] -translate-x-1/2 translate-y-1/2 pointer-events-auto">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 68, repeat: Infinity, ease: 'linear' }}
                  className="p-3 rounded-full bg-white dark:bg-[#1C1C1C] border border-[#DCE7F2] dark:border-[#262626] shadow-md hover:scale-120 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
                  title="Netflix"
                >
                  <NetflixLogo className="w-5 h-5" />
                </motion.div>
              </div>

              {/* 270 deg (Left) - Spotify */}
              <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 68, repeat: Infinity, ease: 'linear' }}
                  className="p-3 rounded-full bg-white dark:bg-[#1C1C1C] border border-[#DCE7F2] dark:border-[#262626] shadow-md hover:scale-120 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
                  title="Spotify"
                >
                  <SpotifyLogo className="w-5 h-5" />
                </motion.div>
              </div>

              {/* 330 deg - LinkedIn */}
              <div className="absolute top-[6.7%] left-[25%] -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 68, repeat: Infinity, ease: 'linear' }}
                  className="p-3 rounded-full bg-white dark:bg-[#1C1C1C] border border-[#DCE7F2] dark:border-[#262626] shadow-md hover:scale-120 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
                  title="LinkedIn"
                >
                  <LinkedInLogo className="w-5 h-5" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* ORBIT RING 3: Outer Perimeter (Radius 680px => Diameter 1360px) */}
          <div className="absolute w-[1360px] h-[1360px] rounded-full border border-[#DCE7F2]/40 dark:border-[#262626]/50 hidden xl:block">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 92, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0"
            >
              {/* 45 deg - Airbnb */}
              <div className="absolute top-[14.6%] right-[14.6%] translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 92, repeat: Infinity, ease: 'linear' }}
                  className="p-3 rounded-full bg-white dark:bg-[#1C1C1C] border border-[#DCE7F2] dark:border-[#262626] shadow-md hover:scale-120 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
                  title="Airbnb"
                >
                  <AirbnbLogo className="w-5 h-5" />
                </motion.div>
              </div>

              {/* 135 deg - Nvidia */}
              <div className="absolute bottom-[14.6%] right-[14.6%] translate-x-1/2 translate-y-1/2 pointer-events-auto">
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 92, repeat: Infinity, ease: 'linear' }}
                  className="p-3 rounded-full bg-white dark:bg-[#1C1C1C] border border-[#DCE7F2] dark:border-[#262626] shadow-md hover:scale-120 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
                  title="Nvidia"
                >
                  <NvidiaLogo className="w-5 h-5" />
                </motion.div>
              </div>

              {/* 225 deg - Figma */}
              <div className="absolute bottom-[14.6%] left-[14.6%] -translate-x-1/2 translate-y-1/2 pointer-events-auto">
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 92, repeat: Infinity, ease: 'linear' }}
                  className="p-3 rounded-full bg-white dark:bg-[#1C1C1C] border border-[#DCE7F2] dark:border-[#262626] shadow-md hover:scale-120 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
                  title="Figma"
                >
                  <FigmaLogo className="w-5 h-5" />
                </motion.div>
              </div>

              {/* 315 deg - Salesforce */}
              <div className="absolute top-[14.6%] left-[14.6%] -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 92, repeat: Infinity, ease: 'linear' }}
                  className="p-3 rounded-full bg-white dark:bg-[#1C1C1C] border border-[#DCE7F2] dark:border-[#262626] shadow-md hover:scale-120 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
                  title="Salesforce"
                >
                  <SalesforceLogo className="w-5 h-5" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ─── Hero Center Content Box with Scroll Parallax Dissipation ─── */}
        <motion.div
          style={{ y: heroContentY, opacity: heroOpacity }}
          className="relative z-20 mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-7"
        >
          {/* Main Hero Headline with Reenie Beanie Tactile Cursive Emphasis */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-sans font-black text-4xl sm:text-6xl lg:text-7xl text-[#0F172A] dark:text-white leading-[1.12] tracking-tight max-w-4xl mx-auto"
          >
            Check Your Standards &{' '}
            <span className="font-cursive text-5xl sm:text-7xl lg:text-8xl text-[#E11D48] -rotate-2 inline-block px-1 font-normal tracking-normal select-none">
              authentically
            </span>{' '}
            <span className="text-[#4A8BDF] underline decoration-[#4A8BDF]/30 underline-offset-8">
              Upgrade
            </span>{' '}
            to Get Placed
          </motion.h1>

          {/* Hero Subheadline with High Contrast Font Color */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="font-sans text-base sm:text-lg text-[#374151] dark:text-gray-300 font-semibold max-w-2xl mx-auto leading-relaxed"
          >
            From ATS resume alignment and live browser coding to Socratic mock interviews and — benchmark your real readiness against Tier-1 tech hiring bars.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white dark:bg-white dark:text-black dark:hover:bg-[#EBEBF5] font-sans font-bold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <span>{isAuthenticated ? 'Go to Dashboard' : 'Start Free Practice'}</span>
                <ArrowRight className="h-4 w-4 text-white dark:text-black" />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── MOST POPULAR TECH ROLES & HIRING COMPANIES MARQUEE ─── */}
      <section className="relative w-full py-6 space-y-4 overflow-hidden border-y border-[#DCE7F2] dark:border-[#262626] bg-white/40 dark:bg-black/30 backdrop-blur-xs">
        <TechnicalGridOverlay />

        {/* Roles Marquee Row */}
        <div className="relative w-full overflow-hidden py-2 bg-white/40 dark:bg-black/40 backdrop-blur-xs border-y border-[#DCE7F2]/60 dark:border-[#262626]/80">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#EFFAFD] dark:from-[#000000] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#EFFAFD] dark:from-[#000000] to-transparent z-10 pointer-events-none" />
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
            className="flex items-center gap-4 whitespace-nowrap w-max"
          >
            {[...POPULAR_TECH_ROLES, ...POPULAR_TECH_ROLES].map((role, idx) => (
              <Link
                key={idx}
                to={role.roleRoute}
                className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-[#DCE7F2] dark:border-[#262626] shadow-2xs hover:shadow-card hover:border-[#4A8BDF]/60 transition-all cursor-pointer group"
              >
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-[#0F172A] dark:text-white group-hover:text-[#4A8BDF] transition-colors font-sans">
                    {role.title}
                  </span>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Tier-1 Hiring Companies Marquee Row */}
        <div className="relative w-full overflow-hidden py-2 bg-transparent">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#EFFAFD] dark:from-[#000000] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#EFFAFD] dark:from-[#000000] to-transparent z-10 pointer-events-none" />
          <motion.div
            animate={{ x: ['-50%', '0%'] }}
            transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
            className="flex items-center gap-12 whitespace-nowrap w-max"
          >
            {[...HIRING_COMPANIES, ...HIRING_COMPANIES].map((comp, idx) => {
              const CompLogo = comp.Logo;
              return (
                <div key={idx} className="flex items-center gap-2.5 opacity-70 hover:opacity-100 transition-opacity cursor-default">
                  <span className="p-1.5 rounded-full bg-white dark:bg-[#1E1E1E] shadow-2xs border border-[#DCE7F2] dark:border-[#303030]">
                    {CompLogo === CompanyMark ? <CompanyMark name={comp.name} className="w-4 h-4" /> : <CompLogo className="w-4 h-4" />}
                  </span>
                  <span className="text-xs font-bold text-[#0F172A] dark:text-white font-sans">{comp.name}</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* 3. INTERACTIVE 3-CARD COVER FLOW FEATURES CAROUSEL       */}
      {/* ════════════════════════════════════════════════════════ */}
      <Section id="features" ref={previewRef} className="relative py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-x border-[#DCE7F2]/60 dark:border-[#262626]/70">
        {/* Technical Blueprint Grid Background */}
        <TechnicalGridOverlay pattern="blueprint" />

        {/* Section Header - Compact */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 relative z-10 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] dark:text-white tracking-tight">
            Everything you need to turn <span className="text-[#4A8BDF]">practice into proof.</span>
          </h2>
          <p className="landing-copy text-sm sm:text-base text-[#334155] dark:text-[#A8A8A8] font-medium leading-relaxed max-w-2xl mx-auto">
            Explore every part of the Rennetus loop—from finding a gap to rehearsing it under pressure, then tracking the evidence that you are ready.
          </p>
        </div>

        {/* 3-Card Staging Layout: Left, Center (Enlarged with Curves & Grey Font), Right */}
        <div className="relative z-10">
          {(() => {
            const total = FEATURE_CARDS.length;
            const prevIdx = (activeFeatureIndex - 1 + total) % total;
            const currIdx = activeFeatureIndex;
            const nextIdx = (activeFeatureIndex + 1) % total;

            const prevCard = FEATURE_CARDS[prevIdx];
            const currCard = FEATURE_CARDS[currIdx];
            const nextCard = FEATURE_CARDS[nextIdx];

            return (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6 items-center">
                
                {/* ─── LEFT CARD (Click / < to view) ─── */}
                <motion.div
                  key={`prev-${prevIdx}`}
                  initial={{ opacity: 0, x: -20, scale: 0.92 }}
                  animate={{ opacity: 0.82, x: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ opacity: 1, scale: 0.98 }}
                  onClick={() => setActiveFeatureIndex(prevIdx)}
                  className={`hidden lg:flex lg:col-span-3 min-h-[340px] sm:min-h-[360px] rounded-[24px] border ${prevCard.theme.border} ${prevCard.theme.bg} p-4 sm:p-5 shadow-sm hover:shadow-md cursor-pointer flex-col justify-between transition-all select-none group backdrop-blur-xs`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${prevCard.theme.badge}`}>
                        Pillar {prevCard.step}
                      </span>
                      <span className="text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8]">
                        0{prevIdx + 1} / 0{total}
                      </span>
                    </div>

                    <h3 className={`text-base sm:text-lg font-bold font-sans leading-snug transition-colors ${prevCard.theme.accentText}`}>
                      {prevCard.title}
                    </h3>

                    <p className="text-xs text-[#475569] dark:text-[#94A3B8] font-medium leading-relaxed line-clamp-3">
                      {prevCard.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveFeatureIndex(prevIdx);
                      }}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${prevCard.theme.btn} shadow-xs cursor-pointer`}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Prev</span>
                    </button>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] font-bold">
                      Click to view
                    </span>
                  </div>
                </motion.div>

                {/* ─── CENTER CARD (Curved, Refined Colors, Grey Font, Fits Full Screen) ─── */}
                <motion.div
                  key={`curr-${currIdx}`}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1.02 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className={`md:col-span-12 lg:col-span-6 min-h-[375px] sm:min-h-[395px] rounded-[30px] sm:rounded-[36px] border-2 ${currCard.theme.border} ${currCard.theme.bg} p-5 sm:p-6 shadow-xl ${currCard.theme.ring} relative flex flex-col justify-between z-30 group backdrop-blur-sm overflow-hidden`}
                >
                  {/* Curved Ambient Lighting Orbs */}
                  <div className={`pointer-events-none absolute -top-14 -right-14 w-48 h-48 rounded-full bg-gradient-to-br ${currCard.theme.glow} blur-2xl opacity-60`} />
                  <div className={`pointer-events-none absolute -bottom-14 -left-14 w-48 h-48 rounded-full bg-gradient-to-tr ${currCard.theme.glow} blur-2xl opacity-40`} />

                  <div className="space-y-3 relative z-10">
                    {/* Header Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-mono font-black px-2.5 py-0.5 rounded-full border shadow-2xs ${currCard.theme.badge}`}>
                          Pillar {currCard.step}
                        </span>
                        <span className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8] font-sans">
                          {currCard.badge}
                        </span>
                      </div>
                      <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/70 dark:bg-black/40 border border-black/5 dark:border-white/10 ${currCard.theme.accentText}`}>
                        Active Focus
                      </span>
                    </div>

                    {/* Headline & Description - Grey Font in Dark Mode */}
                    <div className="space-y-1">
                      <h3 className="text-lg sm:text-xl font-black font-sans leading-snug text-[#0F172A] dark:text-[#CBD5E1]">
                        {currCard.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] font-medium leading-relaxed line-clamp-2">
                        {currCard.description}
                      </p>
                    </div>

                    {/* Key Technical Benefits - Curved Boxes & Grey Font */}
                    <div className="space-y-2 pt-1">
                      {currCard.keyPoints.map((pt, pidx) => (
                        <div
                          key={pidx}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-white/70 dark:bg-[#18191E]/80 border border-slate-200/60 dark:border-[#27272A] shadow-2xs"
                        >
                          <CheckCircle2 className={`w-4 h-4 shrink-0 ${currCard.theme.accentText}`} />
                          <span className="text-xs font-medium text-[#475569] dark:text-[#94A3B8] leading-tight truncate">
                            {pt}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Primary CTA Button */}
                  <div className="pt-2.5 border-t border-black/5 dark:border-white/10 relative z-10">
                    <Link to={currCard.ctaLink} className="block">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className={`w-full py-2.5 sm:py-3 rounded-full font-sans font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${currCard.theme.btn}`}
                      >
                        <span>{currCard.ctaText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>

                {/* ─── RIGHT CARD (Click / > to view) ─── */}
                <motion.div
                  key={`next-${nextIdx}`}
                  initial={{ opacity: 0, x: 20, scale: 0.92 }}
                  animate={{ opacity: 0.82, x: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ opacity: 1, scale: 0.98 }}
                  onClick={() => setActiveFeatureIndex(nextIdx)}
                  className={`hidden lg:flex lg:col-span-3 min-h-[340px] sm:min-h-[360px] rounded-[24px] border ${nextCard.theme.border} ${nextCard.theme.bg} p-4 sm:p-5 shadow-sm hover:shadow-md cursor-pointer flex-col justify-between transition-all select-none group backdrop-blur-xs`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${nextCard.theme.badge}`}>
                        Pillar {nextCard.step}
                      </span>
                      <span className="text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8]">
                        0{nextIdx + 1} / 0{total}
                      </span>
                    </div>

                    <h3 className={`text-base sm:text-lg font-bold font-sans leading-snug transition-colors ${nextCard.theme.accentText}`}>
                      {nextCard.title}
                    </h3>

                    <p className="text-xs text-[#475569] dark:text-[#94A3B8] font-medium leading-relaxed line-clamp-3">
                      {nextCard.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] font-bold">
                      Click to view
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveFeatureIndex(nextIdx);
                      }}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${nextCard.theme.btn} shadow-xs cursor-pointer`}
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              </div>
            );
          })()}

          {/* Carousel Controls: Arrows + Dots Navigator */}
          <div className="flex items-center justify-center gap-3 pt-4 sm:pt-5">
            <button
              onClick={() => setActiveFeatureIndex((prev) => (prev - 1 + FEATURE_CARDS.length) % FEATURE_CARDS.length)}
              className="p-2 rounded-full bg-white dark:bg-[#1E1E1E] border border-[#DCE7F2] dark:border-[#333] hover:bg-[#EFFAFD] dark:hover:bg-[#2A2A2A] text-[#0F172A] dark:text-[#CBD5E1] transition-all shadow-2xs cursor-pointer active:scale-95"
              title="Previous pillar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {FEATURE_CARDS.map((card, idx) => (
                <button
                  key={card.id}
                  onClick={() => setActiveFeatureIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    activeFeatureIndex === idx
                      ? 'w-6 bg-[#0F172A] dark:bg-[#CBD5E1]'
                      : 'w-2 bg-[#CBD5E1] dark:bg-[#404040] hover:bg-[#94A3B8]'
                  }`}
                  title={`Jump to ${card.title}`}
                />
              ))}
            </div>

            <button
              onClick={() => setActiveFeatureIndex((prev) => (prev + 1) % FEATURE_CARDS.length)}
              className="p-2 rounded-full bg-white dark:bg-[#1E1E1E] border border-[#DCE7F2] dark:border-[#333] hover:bg-[#EFFAFD] dark:hover:bg-[#2A2A2A] text-[#0F172A] dark:text-[#CBD5E1] transition-all shadow-2xs cursor-pointer active:scale-95"
              title="Next pillar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* 3. WHAT YOU GAIN WITH R U READY? (TRANSFORMATION VALUE) */}
      {/* ════════════════════════════════════════════════════════ */}
      <Section id="benefits" className="relative py-20 sm:py-28 bg-white/60 dark:bg-[#1A1A1A]/80 backdrop-blur-xs border-y border-[#DCE7F2] dark:border-[#262626] overflow-hidden">
        {/* Dense Technical Blueprint Grid */}
        <TechnicalGridOverlay pattern="dense" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 relative z-10 border-x border-[#DCE7F2]/60 dark:border-[#262626]/70">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] dark:text-white tracking-tight">
              <span className="text-[#4A8BDF]">Why Rennetus?</span> Stop guessing what to practice next.
            </h2>
            <p className="landing-copy text-base sm:text-lg text-[#334155] dark:text-[#A8A8A8] font-medium leading-relaxed">
              Rennetus connects the pieces most candidates prepare in isolation: communication, technical depth, resume signal, and a plan that adapts as you improve.
            </p>
          </div>

          {/* 4 Outcome Transformation Cards with Staggered Scroll Entrance */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Gain 1 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, scale: 1.01 }}
              className="bg-white dark:bg-[#1C1C1C] p-6 sm:p-7 rounded-3xl border border-[#DCE7F2] dark:border-[#262626] shadow-sm flex flex-col justify-between space-y-4 group hover:border-[#4A8BDF]/60 hover:shadow-card-hover transition-all"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EFFAFD] dark:bg-[#262626] text-[#4A8BDF] dark:text-[#64D2FF] flex items-center justify-center border border-[#DCE7F2] dark:border-[#303030] shadow-xs group-hover:scale-105 transition-transform">
                  <Target className="w-6 h-6 text-[#4A8BDF] dark:text-[#64D2FF]" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] dark:text-white group-hover:text-[#4A8BDF] transition-colors">
                  1. Zero Hidden Blind Spots
                </h3>
                <p className="text-xs sm:text-sm text-[#334155] dark:text-[#D2D2D7] font-medium leading-relaxed">
                  Uncover the exact technical and architectural gaps that cause silent rejections at top tech firms, with zero polite praise.
                </p>
              </div>
              <Link
                to="/interview/new"
                className="pt-4 border-t border-[#DCE7F2] dark:border-[#262626] flex items-center justify-between text-xs font-bold text-[#4A8BDF] dark:text-[#64D2FF] hover:text-[#2459A8] transition-colors group/btn"
              >
                <span>Strict Tier-1 Scoring Rubrics</span>
                <span className="w-7 h-7 rounded-full bg-[#EFFAFD] dark:bg-[#262626] flex items-center justify-center group-hover/btn:bg-[#4A8BDF] group-hover/btn:text-white transition-all shadow-xs shrink-0">
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </motion.div>

            {/* Gain 2 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, scale: 1.01 }}
              className="bg-white dark:bg-[#1C1C1C] p-6 sm:p-7 rounded-3xl border border-[#DCE7F2] dark:border-[#262626] shadow-sm flex flex-col justify-between space-y-4 group hover:border-[#047857]/60 hover:shadow-card-hover transition-all"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F5F0] dark:bg-[#262626] text-[#047857] dark:text-[#2CBB5D] flex items-center justify-center border border-[#A7E3CF] dark:border-[#303030] shadow-xs group-hover:scale-105 transition-transform">
                  <Activity className="w-6 h-6 text-[#047857] dark:text-[#2CBB5D]" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] dark:text-white group-hover:text-[#047857] transition-colors">
                  2. Flawless STAR & Code Delivery
                </h3>
                <p className="text-xs sm:text-sm text-[#334155] dark:text-[#D2D2D7] font-medium leading-relaxed">
                  Eliminate filler words, manage speech pacing (140-160 WPM), and explain algorithmic trade-offs with structured conviction.
                </p>
              </div>
              <Link
                to="/interview/coding"
                className="pt-4 border-t border-[#DCE7F2] dark:border-[#262626] flex items-center justify-between text-xs font-bold text-[#047857] dark:text-[#2CBB5D] hover:text-[#065F46] transition-colors group/btn"
              >
                <span>Live Audio & IDE Telemetry</span>
                <span className="w-7 h-7 rounded-full bg-[#E8F5F0] dark:bg-[#262626] flex items-center justify-center group-hover/btn:bg-[#047857] group-hover/btn:text-white transition-all shadow-xs shrink-0">
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </motion.div>

            {/* Gain 3 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, scale: 1.01 }}
              className="bg-white dark:bg-[#1C1C1C] p-6 sm:p-7 rounded-3xl border border-[#DCE7F2] dark:border-[#262626] shadow-sm flex flex-col justify-between space-y-4 group hover:border-[#A0006D]/60 hover:shadow-card-hover transition-all"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F8EAF4] dark:bg-[#262626] text-[#A0006D] dark:text-[#BF5AF2] flex items-center justify-center border border-[#F4B4D6] dark:border-[#303030] shadow-xs group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6 text-[#A0006D] dark:text-[#BF5AF2]" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] dark:text-white group-hover:text-[#A0006D] transition-colors">
                  3. 90%+ ATS Screening Conversion
                </h3>
                <p className="text-xs sm:text-sm text-[#334155] dark:text-[#D2D2D7] font-medium leading-relaxed">
                  Ensure your resume gets past ATS screening algorithms with matched keywords and quantified achievement bullet points.
                </p>
              </div>
              <Link
                to="/resume"
                className="pt-4 border-t border-[#DCE7F2] dark:border-[#262626] flex items-center justify-between text-xs font-bold text-[#A0006D] dark:text-[#BF5AF2] hover:text-[#780052] transition-colors group/btn"
              >
                <span>Automated STAR Rewrites</span>
                <span className="w-7 h-7 rounded-full bg-[#F8EAF4] dark:bg-[#262626] flex items-center justify-center group-hover/btn:bg-[#A0006D] group-hover/btn:text-white transition-all shadow-xs shrink-0">
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </motion.div>

            {/* Gain 4 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.36, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, scale: 1.01 }}
              className="bg-white dark:bg-[#1C1C1C] p-6 sm:p-7 rounded-3xl border border-[#DCE7F2] dark:border-[#262626] shadow-sm flex flex-col justify-between space-y-4 group hover:border-[#4A8BDF]/60 hover:shadow-card-hover transition-all"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EFFAFD] dark:bg-[#262626] text-[#0F172A] dark:text-[#64D2FF] flex items-center justify-center border border-[#DCE7F2] dark:border-[#303030] shadow-xs group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-6 h-6 text-[#4A8BDF] dark:text-[#64D2FF]" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] dark:text-white group-hover:text-[#4A8BDF] transition-colors">
                  4. Accelerated Placement & Pay
                </h3>
                <p className="text-xs sm:text-sm text-[#334155] dark:text-[#D2D2D7] font-medium leading-relaxed">
                  Cut months off trial-and-error prep. Benchmark your readiness before real interviews and negotiate top compensation packages.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      <Section id="testimonials" className="relative py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-x border-[#DCE7F2]/60 dark:border-[#262626]/70">
        {/* Technical Blueprint Grid Lines */}
        <TechnicalGridOverlay pattern="blueprint" />

        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] dark:text-white tracking-tight">
            Unfiltered Notes from Candidates Who Cleared
          </h2>
          <p className="landing-copy text-sm sm:text-base text-[#334155] dark:text-[#A8A8A8] font-medium leading-relaxed max-w-2xl mx-auto">
            Real interview reflections from engineers who calibrated with Rennetus and cracked Tier-1 offers.
          </p>
        </div>

        {/* Two-Column Grid on Desktop, Single-Column on Mobile with Tilted Physical Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 sm:gap-8 max-w-5xl mx-auto">
          {DIARY_TESTIMONIALS.map((item, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50, rotate: isLeft ? -4 : 4 }}
                whileInView={{ opacity: 1, y: 0, rotate: isLeft ? -1 : 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ rotate: 0, y: -8, scale: 1.02 }}
                className={`bg-white dark:bg-[#1A1A1A] p-7 sm:p-8 rounded-3xl border border-[#DCE7F2] dark:border-[#262626] shadow-sm hover:shadow-card-hover transition-all flex flex-col justify-between space-y-5 cursor-default`}
              >
                <div className="space-y-4">
                  {/* Top row: Company + Placed Offer Package */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full border ${item.badgeBg}`}>
                        {item.company}
                      </span>
                      <span className="text-[10px] font-mono text-[#78716C] dark:text-[#71717A]">
                        {item.date}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#047857] dark:text-[#34D399] border border-emerald-200 dark:border-emerald-800/60 shadow-2xs">
                      🎉 {item.offerPackage}
                    </span>
                  </div>

                  {/* Readiness Score Gain & Star Rating */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F8FAFC] dark:bg-[#202020] border border-[#E2E8F0] dark:border-[#2E2E2E]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#EFFAFD] dark:bg-[#1E293B] border border-[#DCE7F2] dark:border-[#334155] flex items-center justify-center text-[#2459A8] dark:text-[#64D2FF]">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
                          Readiness Score
                        </div>
                        <div className="text-sm font-black font-sans text-[#0F172A] dark:text-white">
                          {item.readinessScore}/100{' '}
                          <span className="text-[11px] font-bold text-[#047857] dark:text-[#34D399]">
                            ({item.scoreGain})
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 text-[#F59E0B]">
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-[#F59E0B]" />
                      ))}
                    </div>
                  </div>

                  {/* Quote */}
                  <p className="text-sm sm:text-base text-[#292524] dark:text-[#E2E8F0] font-sans leading-relaxed font-normal italic">
                    "{item.quote}"
                  </p>

                  {/* Rounds Cleared Badges */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] font-mono font-bold uppercase text-[#64748B] dark:text-[#A8A8A8] tracking-wider">
                      Rounds Cleared:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {item.roundsCleared.map((round, rIdx) => (
                        <span
                          key={rIdx}
                          className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#FAFDFE] dark:bg-[#252525] border border-[#DCE7F2] dark:border-[#333333] text-[#334155] dark:text-[#CBD5E1]"
                        >
                          ✓ {round}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Telemetry Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#DCE7F2]/60 dark:border-[#262626]">
                    {item.metrics.map((met, mIdx) => (
                      <div key={mIdx} className="p-2 rounded-xl bg-[#FAFDFE] dark:bg-[#1E1E1E] border border-[#DCE7F2]/50 dark:border-[#2E2E2E]">
                        <div className="text-[9px] font-mono text-[#64748B] dark:text-[#94A3B8] truncate">{met.label}</div>
                        <div className="text-xs font-bold font-sans text-[#0F172A] dark:text-white mt-0.5 truncate">{met.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  {/* 32px Horizontal tactile divider line */}
                  <div className="w-8 h-[2px] bg-[#DCE7F2] dark:bg-[#333333] mb-3.5" />

                  {/* Signature with expressive cursive font */}
                  <div className="font-cursive text-2xl sm:text-3xl text-[#2459A8] dark:text-[#64D2FF] font-normal tracking-wide">
                    {item.author}
                  </div>
                  <span className="text-xs font-semibold text-[#78716C] dark:text-[#A8A8A8] block mt-0.5 font-sans">
                    {item.role}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* 4. PRICING BUNDLES SECTION                              */}
      {/* ════════════════════════════════════════════════════════ */}
      <Section id="pricing" className="relative py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-x border-[#DCE7F2]/60 dark:border-[#262626]/70">
        {/* Technical Blueprint Grid Lines */}
        <TechnicalGridOverlay pattern="blueprint" />
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white dark:bg-[#1C1C1C] border border-[#DCE7F2] dark:border-[#262626] text-xs font-bold text-[#4A8BDF] dark:text-[#64D2FF] font-mono uppercase tracking-wider shadow-2xs">
            <Zap className="w-3.5 h-3.5 text-[#4A8BDF]" />
            <span>Calibrated Membership</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] dark:text-white tracking-tight">
            Flexible Practice in US Dollars
          </h2>
          <p className="landing-copy text-sm sm:text-base text-[#334155] dark:text-[#A8A8A8] font-medium leading-relaxed max-w-xl mx-auto">
            Choose monthly flexibility or save with yearly billing. Transparent pricing with calculated daily investment.
          </p>

          {/* Monthly / Yearly Billing Toggle Switch */}
          <div className="flex items-center justify-center pt-2">
            <div className="p-1 rounded-full bg-white dark:bg-[#1E1E1E] border border-[#DCE7F2] dark:border-[#303030] shadow-xs inline-flex items-center gap-1">
              <button
                onClick={() => setPricingCycle('monthly')}
                className={`px-5 py-2 rounded-full text-xs font-bold font-sans transition-all cursor-pointer ${
                  pricingCycle === 'monthly'
                    ? 'bg-[#0F172A] text-white dark:bg-white dark:text-black shadow-xs'
                    : 'text-[#64748B] dark:text-[#A0A0A0] hover:text-[#0F172A] dark:hover:text-white'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setPricingCycle('yearly')}
                className={`px-5 py-2 rounded-full text-xs font-bold font-sans transition-all cursor-pointer flex items-center gap-2 ${
                  pricingCycle === 'yearly'
                    ? 'bg-[#4A8BDF] text-white shadow-xs'
                    : 'text-[#64748B] dark:text-[#A0A0A0] hover:text-[#0F172A] dark:hover:text-white'
                }`}
              >
                <span>Yearly Billing</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#10B981] text-white shadow-2xs">
                  Save 20%+
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Plans Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch relative z-10">
          
          {/* Plan 1: Starter ($0) */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="rounded-3xl bg-white dark:bg-[#1A1A1A] border border-[#DCE7F2] dark:border-[#262626] p-7 sm:p-8 shadow-sm hover:shadow-card-hover flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-[#EFFAFD] dark:bg-[#262626] text-[#0F172A] dark:text-white text-[10px] font-bold font-mono uppercase tracking-wider border border-[#DCE7F2] dark:border-[#303030]">
                  Starter Tier
                </span>
                <span className="text-xs font-mono font-bold text-[#047857] dark:text-[#34D399] bg-[#E8F5F0] dark:bg-[#064E3B]/40 px-2.5 py-0.5 rounded-full border border-[#A7E3CF] dark:border-[#047857]/50">
                  $0 / day
                </span>
              </div>
              <h3 className="font-sans font-bold text-2xl text-[#0F172A] dark:text-white mb-1">Free Tier</h3>
              <p className="text-xs text-[#64748B] dark:text-[#A0A0A0] font-sans mb-5">
                Explore Ava's live speech engine, Monaco coding runner, and baseline ATS diagnostics.
              </p>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="font-sans font-black text-5xl text-[#0F172A] dark:text-white">$0</span>
                <span className="text-xs font-mono text-[#64748B] dark:text-[#A8A8A8]">/ forever free</span>
              </div>
              <ul className="space-y-3 text-xs font-sans text-[#1E293B] dark:text-[#D2D2D7] font-medium mb-8 border-t border-[#DCE7F2] dark:border-[#262626] pt-6">
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" /> 2 Practice Sessions / month (Voice or Code)</li>
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" /> Standard Behavioral STAR Evaluation</li>
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" /> Basic ATS Resume Keyword Match Overview</li>
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" /> In-Browser Monaco Code Runner (6 Languages)</li>
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" /> Curated Algorithmic Editorial Hints</li>
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" /> Forever Free — No Credit Card Required</li>
              </ul>
            </div>
            <Link to="/register">
              <button className="w-full py-3.5 rounded-full bg-[#0F172A] hover:bg-[#1E293B] dark:bg-white dark:text-black dark:hover:bg-[#EBEBF5] text-white font-bold text-xs shadow-sm transition-all cursor-pointer">
                Start Free — $0
              </button>
            </Link>
          </motion.div>

          {/* Plan 2: Pro ($19/mo or $15/mo yearly) */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="rounded-3xl bg-white dark:bg-[#1A1A1A] border-2 border-[#4A8BDF] dark:border-[#4A8BDF] p-7 sm:p-8 shadow-xl hover:shadow-card-hover relative flex flex-col justify-between transition-all"
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#4A8BDF] text-white text-[10px] font-bold font-mono uppercase tracking-widest shadow-sm">
              Most Popular • 85% of Offers
            </div>
            <div>
              <div className="flex items-center justify-between mb-4 mt-2">
                <span className="px-3 py-1 rounded-full bg-[#EFFAFD] dark:bg-[#1E293B] text-[#4A8BDF] dark:text-[#64D2FF] text-[10px] font-bold font-mono uppercase tracking-wider border border-[#DCE7F2] dark:border-[#334155]">
                  AI Career Pro
                </span>
                <span className="text-xs font-mono font-bold text-[#2459A8] dark:text-[#64D2FF] bg-[#EFFAFD] dark:bg-[#1E293B] px-2.5 py-0.5 rounded-full border border-[#DCE7F2] dark:border-[#334155]">
                  {pricingCycle === 'yearly' ? '~$0.49 / day' : '~$0.63 / day'}
                </span>
              </div>
              <h3 className="font-sans font-bold text-2xl text-[#0F172A] dark:text-white mb-1">Pro Calibration</h3>
              <p className="text-xs text-[#64748B] dark:text-[#A0A0A0] font-sans mb-5">
                Full interview readiness for active candidates targeting Tier-1 and FAANG engineering roles.
              </p>
              <div className="mb-2 flex items-baseline gap-1">
                <span className="font-sans font-black text-5xl text-[#4A8BDF] dark:text-[#64D2FF]">
                  {pricingCycle === 'yearly' ? '$15' : '$19'}
                </span>
                <span className="text-xs font-mono text-[#64748B] dark:text-[#A8A8A8]">/ month</span>
              </div>
              <div className="text-[11px] font-mono font-semibold text-[#047857] dark:text-[#34D399] mb-5">
                {pricingCycle === 'yearly' ? 'Billed $180 / year (save 21%)' : 'Billed monthly, cancel anytime'}
              </div>
              <ul className="space-y-3 text-xs font-sans text-[#1E293B] dark:text-[#D2D2D7] font-medium mb-8 border-t border-[#DCE7F2] dark:border-[#262626] pt-6">
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-[#4A8BDF] shrink-0 mt-0.5" /> Unlimited Monaco Code Sandbox & Boundary Edge Tests</li>
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-[#4A8BDF] shrink-0 mt-0.5" /> 8 Full Socratic Voice Mock Interviews / month</li>
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-[#4A8BDF] shrink-0 mt-0.5" /> Real-Time Phonetic Viseme & Speech Cadence Telemetry</li>
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-[#4A8BDF] shrink-0 mt-0.5" /> Unlimited ATS Resume Scans & STAR Bullet Rewrites</li>
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-[#4A8BDF] shrink-0 mt-0.5" /> Curated Company Question Tracks (Google, Meta, Amazon)</li>
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-[#4A8BDF] shrink-0 mt-0.5" /> Longitudinal Readiness Score & Skill Gap Radar</li>
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-[#4A8BDF] shrink-0 mt-0.5" /> High Priority Execution Queue & Progressive Hints</li>
              </ul>
            </div>
            <Link to="/register">
              <button className="w-full py-3.5 rounded-full bg-[#4A8BDF] hover:bg-[#2459A8] dark:bg-white dark:text-black dark:hover:bg-[#EBEBF5] text-white font-bold text-xs shadow-md transition-all cursor-pointer">
                Unlock Pro — {pricingCycle === 'yearly' ? '$15/mo' : '$19/mo'}
              </button>
            </Link>
          </motion.div>

          {/* Plan 3: Elite ($39/mo or $29/mo yearly) */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="rounded-3xl bg-white dark:bg-[#1A1A1A] border border-[#DCE7F2] dark:border-[#262626] p-7 sm:p-8 shadow-sm hover:shadow-card-hover flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-[#F8EAF4] dark:bg-[#262626] text-[#A0006D] dark:text-[#BF5AF2] text-[10px] font-bold font-mono uppercase tracking-wider border border-[#F4B4D6] dark:border-[#303030]">
                  Full AI Mastery
                </span>
                <span className="text-xs font-mono font-bold text-[#A0006D] dark:text-[#BF5AF2] bg-[#F8EAF4] dark:bg-[#701A75]/30 px-2.5 py-0.5 rounded-full border border-[#F4B4D6] dark:border-[#A0006D]/40">
                  {pricingCycle === 'yearly' ? '~$0.97 / day' : '~$1.30 / day'}
                </span>
              </div>
              <h3 className="font-sans font-bold text-2xl text-[#0F172A] dark:text-white mb-1">Elite Mastery</h3>
              <p className="text-xs text-[#64748B] dark:text-[#A0A0A0] font-sans mb-5">
                For Senior & Staff engineers aiming to dominate bar-raiser panels and system design rounds.
              </p>
              <div className="mb-2 flex items-baseline gap-1">
                <span className="font-sans font-black text-5xl text-[#0F172A] dark:text-white">
                  {pricingCycle === 'yearly' ? '$29' : '$39'}
                </span>
                <span className="text-xs font-mono text-[#64748B] dark:text-[#A8A8A8]">/ month</span>
              </div>
              <div className="text-[11px] font-mono font-semibold text-[#047857] dark:text-[#34D399] mb-5">
                {pricingCycle === 'yearly' ? 'Billed $348 / year (save 25%)' : 'Billed monthly, cancel anytime'}
              </div>
              <ul className="space-y-3 text-xs font-sans text-[#1E293B] dark:text-[#D2D2D7] font-medium mb-8 border-t border-[#DCE7F2] dark:border-[#262626] pt-6">
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-[#A0006D] shrink-0 mt-0.5" /> Unlimited Multi-Modal Mock Sessions (Oral + Code)</li>
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-[#A0006D] shrink-0 mt-0.5" /> System Design Architectural Probes (CAP, Sharding, Failovers)</li>
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-[#A0006D] shrink-0 mt-0.5" /> Amazon 16 LP & Google Bar-Raiser Committee Rubrics</li>
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-[#A0006D] shrink-0 mt-0.5" /> Live Socratic Grilling on Edge-Case System Assumptions</li>
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-[#A0006D] shrink-0 mt-0.5" /> Comprehensive Diagnostic PDF Reports & Portfolio Exports</li>
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-[#A0006D] shrink-0 mt-0.5" /> Personalized Rubrics Calibrated for L5/L6 Senior Benchmarks</li>
                <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-[#A0006D] shrink-0 mt-0.5" /> 24/7 Priority Support & 24/7 Priority Support</li>
              </ul>
            </div>
            <Link to="/register">
              <button className="w-full py-3.5 rounded-full bg-[#A0006D] hover:bg-[#780052] dark:bg-white dark:text-black dark:hover:bg-[#EBEBF5] text-white font-bold text-xs transition-all cursor-pointer">
                Unlock Elite — {pricingCycle === 'yearly' ? '$29/mo' : '$39/mo'}
              </button>
            </Link>
          </motion.div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* 5. FREQUENTLY ASKED QUESTIONS (INTERACTIVE ENGINE)       */}
      {/* ════════════════════════════════════════════════════════ */}
      <Section id="faq" className="relative py-20 sm:py-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-x border-[#DCE7F2]/60 dark:border-[#262626]/70">
        {/* Technical Blueprint Grid Lines */}
        <TechnicalGridOverlay pattern="blueprint" />

        <div className="mb-10 sm:mb-12 space-y-3 relative z-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white dark:bg-[#1C1C1C] border border-[#DCE7F2] dark:border-[#262626] text-xs font-bold text-[#4A8BDF] dark:text-[#64D2FF] font-mono uppercase tracking-wider shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-[#4A8BDF]" />
            <span>Platform FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] dark:text-white tracking-tight font-display">
            Frequently Asked <span className="text-[#4A8BDF]">Questions</span>
          </h2>
          <p className="landing-copy text-sm sm:text-base text-[#334155] dark:text-[#A8A8A8] font-medium font-body max-w-2xl leading-relaxed">
            Everything you need to know about our Socratic AI interviewer, Monaco coding runtime, uninflated ATS resume scores, and zero-storage privacy policies.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start relative z-10">
          {/* Left Column: Category Pills Alternating Blue and Pink */}
          <div className="w-full lg:w-80 shrink-0 flex lg:flex-col gap-2.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {FAQ_CATEGORIES.map((cat, idx) => {
              const isActive = activeFaqCategory === idx;
              const Icon = cat.icon;
              const isPink = idx % 2 === 1; // Alternating: 0: Blue, 1: Pink, 2: Blue, 3: Pink, 4: Blue, 5: Pink

              let buttonClasses = '';
              let iconClasses = '';

              if (isPink) {
                // Pink / Violet Theme
                if (isActive) {
                  buttonClasses = 'bg-[#A0006D] text-white shadow-lg shadow-[#A0006D]/25 border border-[#A0006D]';
                  iconClasses = 'bg-white/20 text-white';
                } else {
                  buttonClasses = 'bg-white dark:bg-[#1A1A1A] text-[#0F172A] dark:text-[#D2D2D7] hover:text-[#A0006D] dark:hover:text-[#BF5AF2] hover:bg-[#F8EAF4] dark:hover:bg-[#262626] hover:border-[#A0006D]/40 border border-[#DCE7F2] dark:border-[#262626]';
                  iconClasses = 'bg-[#F8EAF4] dark:bg-[#262626] text-[#A0006D] dark:text-[#BF5AF2]';
                }
              } else {
                // Royal Blue Theme
                if (isActive) {
                  buttonClasses = 'bg-[#4A8BDF] text-white shadow-lg shadow-[#4A8BDF]/25 border border-[#4A8BDF]';
                  iconClasses = 'bg-white/20 text-white';
                } else {
                  buttonClasses = 'bg-white dark:bg-[#1A1A1A] text-[#0F172A] dark:text-[#D2D2D7] hover:text-[#4A8BDF] dark:hover:text-[#64D2FF] hover:bg-[#EFF7FD] dark:hover:bg-[#262626] hover:border-[#4A8BDF]/40 border border-[#DCE7F2] dark:border-[#262626]';
                  iconClasses = 'bg-[#EFFAFD] dark:bg-[#262626] text-[#4A8BDF] dark:text-[#64D2FF]';
                }
              }

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveFaqCategory(idx);
                    setOpenFaq(0);
                  }}
                  className={`flex items-center gap-3 px-4 sm:px-5 py-3.5 rounded-full lg:rounded-2xl text-xs sm:text-sm font-bold font-display transition-all cursor-pointer whitespace-nowrap lg:whitespace-normal text-left ${buttonClasses}`}
                >
                  <div className={`p-1.5 rounded-xl shrink-0 ${iconClasses}`}>
                    <Icon size={16} />
                  </div>
                  <span className="flex-1 font-bold">{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Accordion Card */}
          <div className="flex-1 min-w-0 w-full">
            <div className="rounded-3xl bg-white dark:bg-[#1A1A1A] border border-[#DCE7F2] dark:border-[#262626] overflow-hidden shadow-xs divide-y divide-[#DCE7F2] dark:divide-[#262626]">
              {FAQ_CATEGORIES[activeFaqCategory]?.items.map((faq, i) => {
                const isOpen = openFaq === i;
                const isCurrentViolet = activeFaqCategory % 2 === 1;
                return (
                  <div key={i} className="transition-colors">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className={`w-full flex items-center justify-between p-5 sm:p-6 text-left font-display font-bold text-sm sm:text-base text-black dark:text-white transition-colors cursor-pointer gap-4 ${
                        isCurrentViolet ? 'hover:text-[#A0006D] dark:hover:text-[#BF5AF2]' : 'hover:text-[#4A8BDF] dark:hover:text-[#64D2FF]'
                      }`}
                    >
                      <span className="leading-snug text-black dark:text-white">{faq.q}</span>
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? isCurrentViolet
                            ? 'rotate-180 bg-[#F8EAF4] dark:bg-[#262626] text-[#A0006D] dark:text-[#BF5AF2]'
                            : 'rotate-180 bg-[#EFF7FD] dark:bg-[#262626] text-[#4A8BDF] dark:text-[#64D2FF]'
                          : 'bg-[#EFFAFD] dark:bg-[#262626] text-[#526078] dark:text-[#D2D2D7]'
                      }`}>
                        <ChevronDown size={16} />
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-[#334155] dark:text-[#D2D2D7] font-body leading-relaxed border-t border-[#DCE7F2]/40 dark:border-[#262626] bg-[#FAFDFE] dark:bg-[#1C1C1C]">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Still Have Questions? Help Card */}
            <div className="mt-8 rounded-3xl bg-gradient-to-r from-[#EFFAFD] via-white to-[#F8EAF4] dark:from-[#1E293B] dark:via-[#1A1A1A] dark:to-[#2D1B2D] border border-[#DCE7F2] dark:border-[#334155] p-6 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
                <div className="w-12 h-12 rounded-2xl bg-[#4A8BDF] text-white flex items-center justify-center shrink-0 shadow-md">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-[#0F172A] dark:text-white text-base">
                    Have a question we haven't covered?
                  </h4>
                  <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8]">
                    Ava is ready to walk you through a live diagnostic mock session or answer technical questions directly.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  to="/interview/new"
                  className="px-5 py-2.5 rounded-full bg-[#4A8BDF] hover:bg-[#2459A8] text-xs font-bold text-white shadow-sm transition-all"
                >
                  Ask Ava Live
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* 6. WAITLIST / QUICK START CONVERSION SECTION             */}
      {/* ════════════════════════════════════════════════════════ */}
      <Section className="pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl rounded-4xl overflow-hidden relative shadow-2xl bg-[#0F172A] border border-[#334155]/60 dark:border-[#303030] p-8 sm:p-14 text-center text-white space-y-7"
        >
          {/* High-blur floating background gradients */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 bg-[#4A8BDF]/25 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], rotate: [0, -45, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 bg-[#E11D48]/20 rounded-full blur-3xl"
          />

          {/* Cyber Blueprint Grid Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25 z-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(74, 139, 223, 0.25) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(74, 139, 223, 0.25) 1px, transparent 1px)
              `,
              backgroundSize: '36px 36px',
              maskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 35%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 35%, transparent 100%)',
            }}
          />

          {/* Center Dark Rounded-Square Icon with signature red dot */}
          <div className="relative z-10 mx-auto w-16 h-16 rounded-2xl bg-[#1E293B] border border-white/10 flex items-center justify-center shadow-lg">
            <Brain className="w-8 h-8 text-[#64D2FF]" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#E11D48] ring-2 ring-[#0F172A]" />
          </div>

          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight font-sans">
              Ready to Check Your Standards &{' '}
              <span className="font-cursive text-5xl sm:text-6xl text-[#FFB7B2] inline-block -rotate-2 font-normal">
                Rise
              </span>?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed">
              Start with complimentary diagnostic interview credits. Experience live Socratic feedback, Monaco problem solving, and ATS resume scans.
            </p>

            {/* Email Input & Hover-Scaling CTA */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (conversionEmail.trim()) {
                  navigate(`/register?email=${encodeURIComponent(conversionEmail.trim())}`);
                } else {
                  navigate('/register');
                }
              }}
              className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto"
            >
              <input
                type="email"
                value={conversionEmail}
                onChange={(e) => setConversionEmail(e.target.value)}
                placeholder="Enter your email to start..."
                className="w-full sm:flex-1 px-6 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#4A8BDF] focus:bg-white/15 transition-all shadow-inner font-sans"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#E11D48] hover:bg-[#BE123C] text-white font-sans font-bold text-sm px-8 py-3.5 rounded-full shadow-lg shadow-[#E11D48]/30 transition-all cursor-pointer shrink-0"
              >
                <span>Claim Credits</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </form>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium font-sans">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#10B981]" /> Zero credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#10B981]" /> Instant starter credits
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#10B981]" /> Tier-1 uninflated rubrics
              </span>
            </div>
          </div>
        </motion.div>
      </Section>
    </div>
  );
}
