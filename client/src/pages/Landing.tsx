import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useInView, useScroll, animate } from 'framer-motion';
import {
  Brain,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Check,
  Star,
  ChevronRight,
  ChevronDown,
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
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import FeaturesCarousel from '@/components/landing/FeaturesCarousel';

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
        a: 'Absolutely. R U Ready? synthesizes the tech stack, libraries, and experience claims on your resume to generate targeted Socratic questions specifically testing what you listed.',
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
        q: 'Does R U Ready? record or store my webcam video?',
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
        a: 'While camera and mic are required for proctored benchmarks and live lip-synced mock interviews, you can practice coding problems and explore roadmaps completely independently without camera permissions.',
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
        q: 'What is the R U Ready? Readiness Score?',
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
        a: 'All your past interview reports, resume audit history, and roadmap progress remain accessible in your dashboard indefinitely. You only need active credits to launch new live mock interviews or advanced ATS audits.',
      },
      {
        q: 'Can two learners share an account?',
        a: 'Each account is calibrated to an individual candidate’s voice profile, resume history, and personalized skill gap matrix. We recommend separate accounts so your Readiness Score and custom roadmaps accurately reflect your individual capabilities.',
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

// ─── Dynamic Animated Number Counter Component ───────────────

function AnimatedCounter({
  target,
  duration = 2,
  decimals = 0,
  prefix = '',
  suffix = '',
}: {
  target: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, target, {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate: (latest) => setValue(latest),
    });
    return () => controls.stop();
  }, [isInView, target, duration]);

  const formatted =
    decimals > 0
      ? value.toFixed(decimals)
      : Math.floor(value).toLocaleString('en-US');

  return (
    <span ref={ref}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

// ─── Section Helper Component ─────────────────────────────────

function Section({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function Landing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuthStore();

  const [activeFaqCategory, setActiveFaqCategory] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#EFFAFD] text-[#0F172A] overflow-hidden selection:bg-[#4A8BDF]/20 selection:text-[#2459A8] font-sans"
    >
      <Helmet>
        <title>R U Ready? — Check Your Standards & Upgrade Yourself to Get Placed</title>
        <meta
          name="description"
          content="Calibrated AI Mock Interviews, ATS Resume Alignment, Live In-Browser Coding Sandbox, and Custom Tech Career Roadmaps."
        />
      </Helmet>



      {/* ════════════════════════════════════════════════════════ */}
      {/* 1. HERO SECTION WITH PERFECT CONCENTRIC ORBITING LOGOS   */}
      {/* ════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[96vh] flex flex-col items-center justify-center pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-gradient-to-b from-[#EFFAFD] via-white to-[#EFFAFD]"
      >
        {/* Ambient Radial Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-[#4A8BDF]/10 rounded-full blur-[140px] pointer-events-none z-0" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-[#A0006D]/8 rounded-full blur-[120px] pointer-events-none z-0" />

        {/* ─── Concentric Circular Orbit Rings with Smooth Rotating Logos ─── */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-10">
          
          {/* ORBIT RING 1: Inner Perimeter (Radius 360px => Diameter 720px) */}
          <div className="absolute w-[720px] h-[720px] rounded-full border border-[#DCE7F2]/90 hidden md:block">
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
                  className="p-3 rounded-full bg-white border border-[#DCE7F2] shadow-md hover:scale-120 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
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
                  className="p-3 rounded-full bg-white border border-[#DCE7F2] shadow-md hover:scale-120 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
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
                  className="p-3 rounded-full bg-white border border-[#DCE7F2] shadow-md hover:scale-120 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
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
                  className="p-3 rounded-full bg-white border border-[#DCE7F2] shadow-md hover:scale-120 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
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
                  className="p-3 rounded-full bg-white border border-[#DCE7F2] shadow-md hover:scale-120 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
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
                  className="p-3 rounded-full bg-white border border-[#DCE7F2] shadow-md hover:scale-120 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
                  title="GitHub"
                >
                  <GitHubLogo className="w-5 h-5" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* ORBIT RING 2: Middle Perimeter (Radius 520px => Diameter 1040px) */}
          <div className="absolute w-[1040px] h-[1040px] rounded-full border border-[#DCE7F2]/60 hidden lg:block">
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
                  className="p-3 rounded-full bg-white border border-[#DCE7F2] shadow-md hover:scale-120 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
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
                  className="p-3 rounded-full bg-white border border-[#DCE7F2] shadow-md hover:scale-120 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
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
                  className="p-3 rounded-full bg-white border border-[#DCE7F2] shadow-md hover:scale-120 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
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
                  className="p-3 rounded-full bg-white border border-[#DCE7F2] shadow-md hover:scale-120 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
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
                  className="p-3 rounded-full bg-white border border-[#DCE7F2] shadow-md hover:scale-120 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
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
                  className="p-3 rounded-full bg-white border border-[#DCE7F2] shadow-md hover:scale-120 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
                  title="LinkedIn"
                >
                  <LinkedInLogo className="w-5 h-5" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* ORBIT RING 3: Outer Perimeter (Radius 680px => Diameter 1360px) */}
          <div className="absolute w-[1360px] h-[1360px] rounded-full border border-[#DCE7F2]/40 hidden xl:block">
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
                  className="p-3 rounded-full bg-white border border-[#DCE7F2] shadow-md hover:scale-120 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
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
                  className="p-3 rounded-full bg-white border border-[#DCE7F2] shadow-md hover:scale-120 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
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
                  className="p-3 rounded-full bg-white border border-[#DCE7F2] shadow-md hover:scale-120 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
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
                  className="p-3 rounded-full bg-white border border-[#DCE7F2] shadow-md hover:scale-120 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center"
                  title="Salesforce"
                >
                  <SalesforceLogo className="w-5 h-5" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ─── Hero Center Content Box ─── */}
        <div className="relative z-20 mx-auto max-w-3xl px-4 sm:px-6 text-center space-y-7">
          
          {/* Main Hero Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-sans font-black text-4xl sm:text-5xl lg:text-6xl text-[#0F172A] leading-[1.14] tracking-tight"
          >
            Check Your Standards &{' '}
            <span className="text-[#4A8BDF] underline decoration-[#4A8BDF]/40 underline-offset-8">
              Upgrade Yourself
            </span>{' '}
            to Get Placed
          </motion.h1>

          {/* Hero Subheadline with High Contrast Font Color */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="font-sans text-base sm:text-lg text-black font-semibold max-w-2xl mx-auto leading-relaxed"
          >
            From ATS resume alignment and live browser coding to Socratic mock interviews and custom career roadmaps — benchmark your real readiness against Tier-1 tech hiring bars.
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
                className="inline-flex items-center gap-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-sans font-bold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <span>{isAuthenticated ? 'Go to Dashboard' : 'Start Free Practice'}</span>
                <ArrowRight className="h-4 w-4 text-white" />
              </motion.button>
            </Link>

            <Link to="/roadmap">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 bg-white hover:bg-[#EFFAFD] text-[#0F172A] hover:text-[#4A8BDF] font-sans font-bold text-sm sm:text-base px-7 py-3.5 rounded-full border-2 border-[#DCE7F2] hover:border-[#4A8BDF] shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <Compass className="w-4.5 h-4.5 text-[#4A8BDF]" />
                <span className="text-[#0F172A]">Explore Roadmaps</span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* 2. SEQUENTIAL SCROLLING FEATURE CARDS WITH LIVE SIMULATIONS */}
      {/* ════════════════════════════════════════════════════════ */}
      <section id="features" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
            Four Core Pillars to Power Your Placement
          </h2>
          <p className="text-base sm:text-lg text-black font-medium leading-relaxed">
            Experience our calibrated interview intelligence suite — designed with real-time telemetry, live code execution, and uninflated rubrics.
          </p>
        </div>

        {/* Interactive Feature Showcase Carousel (Simple, Understandable & Engaging) */}
        <FeaturesCarousel />
      </section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* 3. WHAT YOU GAIN WITH R U READY? (TRANSFORMATION VALUE) */}
      {/* ════════════════════════════════════════════════════════ */}
      <Section id="benefits" className="py-20 sm:py-28 bg-white border-y border-[#DCE7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
              What You Gain With R U Ready?
            </h2>
            <p className="text-base sm:text-lg text-black font-medium leading-relaxed">
              From your first diagnostic session to clearing strict Tier-1 hiring loops — here is what happens when you prepare with calibrated intelligence.
            </p>
          </div>

          {/* 4 Outcome Transformation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Gain 1 */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-[#DCE7F2] shadow-sm flex flex-col justify-between space-y-4 group hover:border-[#4A8BDF]/60 hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EFFAFD] text-[#4A8BDF] flex items-center justify-center border border-[#DCE7F2] shadow-xs group-hover:scale-105 transition-transform">
                  <Target className="w-6 h-6 text-[#4A8BDF]" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#4A8BDF] transition-colors">
                  1. Zero Hidden Blind Spots
                </h3>
                <p className="text-xs sm:text-sm text-[#334155] font-medium leading-relaxed">
                  Uncover the exact technical and architectural gaps that cause silent rejections at top tech firms, with zero polite praise.
                </p>
              </div>
              <Link
                to="/interview/new"
                className="pt-4 border-t border-[#DCE7F2] flex items-center justify-between text-xs font-bold text-[#4A8BDF] hover:text-[#2459A8] transition-colors group/btn"
              >
                <span>Strict Tier-1 Scoring Rubrics</span>
                <span className="w-7 h-7 rounded-full bg-[#EFFAFD] flex items-center justify-center group-hover/btn:bg-[#4A8BDF] group-hover/btn:text-white transition-all shadow-xs shrink-0">
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </motion.div>

            {/* Gain 2 */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-[#DCE7F2] shadow-sm flex flex-col justify-between space-y-4 group hover:border-[#047857]/60 hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F5F0] text-[#047857] flex items-center justify-center border border-[#A7E3CF] shadow-xs group-hover:scale-105 transition-transform">
                  <Activity className="w-6 h-6 text-[#047857]" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#047857] transition-colors">
                  2. Flawless STAR & Code Delivery
                </h3>
                <p className="text-xs sm:text-sm text-[#334155] font-medium leading-relaxed">
                  Eliminate filler words, manage speech pacing (140-160 WPM), and explain algorithmic trade-offs with structured conviction.
                </p>
              </div>
              <Link
                to="/interview/coding"
                className="pt-4 border-t border-[#DCE7F2] flex items-center justify-between text-xs font-bold text-[#047857] hover:text-[#065F46] transition-colors group/btn"
              >
                <span>Live Audio & IDE Telemetry</span>
                <span className="w-7 h-7 rounded-full bg-[#E8F5F0] flex items-center justify-center group-hover/btn:bg-[#047857] group-hover/btn:text-white transition-all shadow-xs shrink-0">
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </motion.div>

            {/* Gain 3 */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-[#DCE7F2] shadow-sm flex flex-col justify-between space-y-4 group hover:border-[#A0006D]/60 hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F8EAF4] text-[#A0006D] flex items-center justify-center border border-[#F4B4D6] shadow-xs group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6 text-[#A0006D]" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#A0006D] transition-colors">
                  3. 90%+ ATS Screening Conversion
                </h3>
                <p className="text-xs sm:text-sm text-[#334155] font-medium leading-relaxed">
                  Ensure your resume gets past ATS screening algorithms with matched keywords and quantified achievement bullet points.
                </p>
              </div>
              <Link
                to="/ats"
                className="pt-4 border-t border-[#DCE7F2] flex items-center justify-between text-xs font-bold text-[#A0006D] hover:text-[#780052] transition-colors group/btn"
              >
                <span>Automated STAR Rewrites</span>
                <span className="w-7 h-7 rounded-full bg-[#F8EAF4] flex items-center justify-center group-hover/btn:bg-[#A0006D] group-hover/btn:text-white transition-all shadow-xs shrink-0">
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </motion.div>

            {/* Gain 4 */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-[#DCE7F2] shadow-sm flex flex-col justify-between space-y-4 group hover:border-[#4A8BDF]/60 hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EFFAFD] text-[#0F172A] flex items-center justify-center border border-[#DCE7F2] shadow-xs group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-6 h-6 text-[#4A8BDF]" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#4A8BDF] transition-colors">
                  4. Accelerated Placement & Pay
                </h3>
                <p className="text-xs sm:text-sm text-[#334155] font-medium leading-relaxed">
                  Cut months off trial-and-error prep. Benchmark your readiness before real interviews and negotiate top compensation packages.
                </p>
              </div>
              <Link
                to="/roadmap"
                className="pt-4 border-t border-[#DCE7F2] flex items-center justify-between text-xs font-bold text-[#4A8BDF] hover:text-[#2459A8] transition-colors group/btn"
              >
                <span>Higher Offer Confidence</span>
                <span className="w-7 h-7 rounded-full bg-[#EFFAFD] flex items-center justify-center group-hover/btn:bg-[#4A8BDF] group-hover/btn:text-white transition-all shadow-xs shrink-0">
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* 4. PRICING BUNDLES SECTION                              */}
      {/* ════════════════════════════════════════════════════════ */}
      <Section id="pricing" className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
            Flexible Practice That Fits Your Budget
          </h2>
          <p className="text-sm sm:text-base text-black font-medium leading-relaxed">
            Zero lock-in subscriptions. Pay only for the calibrated interview sessions you need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          
          {/* Plan 1: Free */}
          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-3xl bg-white border border-[#DCE7F2] p-6 sm:p-7 shadow-sm flex flex-col justify-between transition-all"
          >
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-[#EFFAFD] text-[#0F172A] text-[10px] font-bold font-mono uppercase tracking-wider mb-4 border border-[#DCE7F2]">
                Starter
              </div>
              <h3 className="font-sans font-bold text-xl text-[#0F172A] mb-1">Free Tier</h3>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="font-sans font-black text-4xl text-[#0F172A]">₹0</span>
                <span className="text-xs font-mono text-[#64748B]">/ forever free</span>
              </div>
              <ul className="space-y-3 text-xs font-sans text-[#1E293B] font-medium mb-8 border-t border-[#DCE7F2] pt-6">
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#10B981] shrink-0" /> 2 Practice Sessions / month (Oral or Code)</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#10B981] shrink-0" /> Standard Behavioral STAR Evaluation</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#10B981] shrink-0" /> Basic ATS Resume Keyword Match Overview</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#10B981] shrink-0" /> In-Browser Monaco Code Runner (6 Languages)</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#10B981] shrink-0" /> Web & Mobile Responsive Studio Access</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#10B981] shrink-0" /> Forever Free — No Credit Card Required</li>
              </ul>
            </div>
            <Link to="/register">
              <button className="w-full py-3 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs shadow-sm transition-all cursor-pointer">
                Start Free — ₹0
              </button>
            </Link>
          </motion.div>

          {/* Plan 2: ₹69 */}
          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-3xl bg-white border border-[#DCE7F2] p-6 sm:p-7 shadow-sm flex flex-col justify-between transition-all"
          >
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-[#EFFAFD] text-[#4A8BDF] border border-[#DCE7F2] text-[10px] font-bold font-mono uppercase tracking-wider mb-4">
                Quick Sprint
              </div>
              <h3 className="font-sans font-bold text-xl text-[#0F172A] mb-1">Single Pass</h3>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="font-sans font-black text-4xl text-[#0F172A]">₹69</span>
                <span className="text-xs font-mono text-[#64748B]">/ single session</span>
              </div>
              <ul className="space-y-3 text-xs font-sans text-[#1E293B] font-medium mb-8 border-t border-[#DCE7F2] pt-6">
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#4A8BDF] shrink-0" /> 1 Full Adaptive Mock Session (Oral or Code)</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#4A8BDF] shrink-0" /> Real-Time Viseme & Speech Telemetry (WPM + Fillers)</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#4A8BDF] shrink-0" /> Detailed ATS Resume Match Diagnostic with Gap Analysis</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#4A8BDF] shrink-0" /> Instant PDF Feedback & Benchmark Report Download</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#4A8BDF] shrink-0" /> Ideal Solutions & Editorial Hints for Algorithmic Questions</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#4A8BDF] shrink-0" /> 30-Day Full Session Replay & Telemetry History</li>
              </ul>
            </div>
            <Link to="/register">
              <button className="w-full py-3 rounded-full bg-[#4A8BDF] text-white font-bold text-xs shadow-sm hover:bg-[#2459A8] transition-all cursor-pointer">
                Get Pass — ₹69
              </button>
            </Link>
          </motion.div>

          {/* Plan 3: ₹159 Pro */}
          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-3xl bg-white border-2 border-[#4A8BDF] p-6 sm:p-7 shadow-xl relative flex flex-col justify-between transition-all"
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#4A8BDF] text-white text-[10px] font-bold font-mono uppercase tracking-widest shadow-sm">
              Most Popular
            </div>
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-[#F8EAF4] text-[#A0006D] text-[10px] font-bold font-mono uppercase tracking-wider mb-4 mt-2">
                AI Career Pro
              </div>
              <h3 className="font-sans font-bold text-xl text-[#0F172A] mb-1">5-Session Bundle</h3>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="font-sans font-black text-4xl text-[#4A8BDF]">₹159</span>
                <span className="text-xs font-mono text-[#64748B]">/ 5 sessions</span>
              </div>
              <ul className="space-y-3 text-xs font-sans text-[#1E293B] font-medium mb-8 border-t border-[#DCE7F2] pt-6">
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#4A8BDF] shrink-0" /> 5 Full-Length Mock Sessions (Mix Oral + Code)</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#4A8BDF] shrink-0" /> Socratic AI Interviewer with Dynamic Lip-Sync & Emotion</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#4A8BDF] shrink-0" /> Unlimited ATS Resume & STAR Bullet Point Rewrites</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#4A8BDF] shrink-0" /> Custom Role Roadmaps & Candidate Discussion Hub</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#4A8BDF] shrink-0" /> Algorithmic Sandbox with 6 Languages & Boundary Tests</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#4A8BDF] shrink-0" /> Detailed Readiness Score & Longitudinal Trend Analysis</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#4A8BDF] shrink-0" /> High Priority Execution Queue & Progressive Hints</li>
              </ul>
            </div>
            <Link to="/register">
              <button className="w-full py-3.5 rounded-full bg-[#4A8BDF] hover:bg-[#2459A8] text-white font-bold text-xs shadow-md transition-all cursor-pointer">
                Unlock Pro Pack — ₹159
              </button>
            </Link>
          </motion.div>

          {/* Plan 4: ₹249 Elite */}
          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-3xl bg-white border border-[#DCE7F2] p-6 sm:p-7 shadow-sm flex flex-col justify-between transition-all"
          >
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-[#F8EAF4] text-[#A0006D] text-[10px] font-bold font-mono uppercase tracking-wider mb-4">
                Full AI Mastery
              </div>
              <h3 className="font-sans font-bold text-xl text-[#0F172A] mb-1">15-Session Elite</h3>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="font-sans font-black text-4xl text-[#0F172A]">₹249</span>
                <span className="text-xs font-mono text-[#64748B]">/ 15 sessions</span>
              </div>
              <ul className="space-y-3 text-xs font-sans text-[#1E293B] font-medium mb-8 border-t border-[#DCE7F2] pt-6">
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#A0006D] shrink-0" /> 15 Full-Length Multi-Modal Mock Sessions</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#A0006D] shrink-0" /> Socratic Oral + Real-Time Monaco Coding Assessment</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#A0006D] shrink-0" /> Priority ATS Match Parsing with Target JD Alignment</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#A0006D] shrink-0" /> Complete Career Blueprint Mastery with Milestones</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#A0006D] shrink-0" /> VIP Access to Role Discussion Forums & Solutions</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#A0006D] shrink-0" /> Full Diagnostic Analytics with Shareable Portfolio Report</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[#A0006D] shrink-0" /> Personalized Socratic Rubrics Calibrated for Tier-1 FAANG</li>
              </ul>
            </div>
            <Link to="/register">
              <button className="w-full py-3 rounded-full bg-[#A0006D] hover:bg-[#780052] text-white font-bold text-xs transition-all cursor-pointer">
                Get Ultimate — ₹249
              </button>
            </Link>
          </motion.div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* 5. FREQUENTLY ASKED QUESTIONS (TAKEUFORWARD STYLE)       */}
      {/* ════════════════════════════════════════════════════════ */}
      <Section id="faq" className="py-20 sm:py-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 sm:mb-12 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight font-display">
            Frequently Asked <span className="text-[#4A8BDF]">Questions</span>
          </h2>
          <p className="text-sm sm:text-base text-[#475569] font-medium font-body max-w-2xl leading-relaxed">
            Everything you need to know about our interview benchmarking engine, coding sandbox, ATS parser, and privacy standards.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
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
                  buttonClasses = 'bg-white text-[#0F172A] hover:text-[#A0006D] hover:bg-[#F8EAF4] hover:border-[#A0006D]/40 border border-[#DCE7F2]';
                  iconClasses = 'bg-[#F8EAF4] text-[#A0006D]';
                }
              } else {
                // Royal Blue Theme
                if (isActive) {
                  buttonClasses = 'bg-[#4A8BDF] text-white shadow-lg shadow-[#4A8BDF]/25 border border-[#4A8BDF]';
                  iconClasses = 'bg-white/20 text-white';
                } else {
                  buttonClasses = 'bg-white text-[#0F172A] hover:text-[#4A8BDF] hover:bg-[#EFF7FD] hover:border-[#4A8BDF]/40 border border-[#DCE7F2]';
                  iconClasses = 'bg-[#EFFAFD] text-[#4A8BDF]';
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
            <div className="rounded-3xl bg-white border border-[#DCE7F2] overflow-hidden shadow-xs divide-y divide-[#DCE7F2]">
              {FAQ_CATEGORIES[activeFaqCategory].items.map((faq, i) => {
                const isOpen = openFaq === i;
                const isCurrentViolet = activeFaqCategory % 2 === 1;
                return (
                  <div key={i} className="transition-colors">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className={`w-full flex items-center justify-between p-5 sm:p-6 text-left font-display font-bold text-sm sm:text-base text-black transition-colors cursor-pointer gap-4 ${
                        isCurrentViolet ? 'hover:text-[#A0006D]' : 'hover:text-[#4A8BDF]'
                      }`}
                    >
                      <span className="leading-snug text-black">{faq.q}</span>
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? isCurrentViolet
                            ? 'rotate-180 bg-[#F8EAF4] text-[#A0006D]'
                            : 'rotate-180 bg-[#EFF7FD] text-[#4A8BDF]'
                          : 'bg-[#EFFAFD] text-[#526078]'
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
                          <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-[#334155] font-body leading-relaxed border-t border-[#DCE7F2]/40 bg-[#FAFDFE]">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      {/* ════════════════════════════════════════════════════════ */}
      {/* 6. CALL TO ACTION BANNER                                */}
      {/* ════════════════════════════════════════════════════════ */}
      <Section className="pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl overflow-hidden relative shadow-2xl bg-gradient-to-br from-[#5E0040] via-[#A0006D] to-[#780052] border border-[#A0006D]/40 p-8 sm:p-14 text-center text-white space-y-6 shadow-[#A0006D]/20">
          {/* Subtle static ambient glow */}
          <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 bg-[#4A8BDF]/25 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-2xl mx-auto leading-tight">
              Ready to Check Your Standards & Get Placed?
            </h2>
            <p className="text-pink-100 text-sm sm:text-base font-medium leading-relaxed max-w-xl mx-auto">
              Join thousands of candidates using R U Ready? for ATS alignment, live coding benchmarks, and multi-agent mock interviews.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-white hover:bg-[#EFFAFD] text-[#A0006D] hover:text-[#780052] font-sans font-bold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-lg shadow-black/15 transition-all cursor-pointer"
                >
                  <span>Start Free Assessment</span>
                  <ArrowRight className="h-4 w-4 text-[#A0006D]" />
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
