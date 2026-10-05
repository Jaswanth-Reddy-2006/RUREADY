import React from 'react';
import { 
  BookOpen, Video, FileText, Code2, Award, ExternalLink,
  DollarSign, Clock, ShieldCheck, Layers
} from 'lucide-react';

export interface ResourceItem {
  id: string;
  title: string;
  type: 'DOCS' | 'VIDEO' | 'ARTICLE' | 'PRACTICE' | 'COURSE' | 'ASSESSMENT';
  isFree: boolean;
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  source: string;
  url?: string;
}

interface ResourcesListSectionProps {
  resources?: ResourceItem[];
}

export default function ResourcesListSection({ resources }: ResourcesListSectionProps) {
  const defaultResources: ResourceItem[] = [
    {
      id: 'res-1',
      title: 'Official Java Collections Framework & Memory Specification',
      type: 'DOCS',
      isFree: true,
      estimatedTime: '45 mins',
      difficulty: 'Intermediate',
      source: 'Oracle JDK Docs',
      url: 'https://docs.oracle.com/en/java/',
    },
    {
      id: 'res-2',
      title: 'PostgreSQL B-Tree Indexing & Execution Planner Masterclass',
      type: 'VIDEO',
      isFree: true,
      estimatedTime: '60 mins',
      difficulty: 'Advanced',
      source: 'Postgres Official Engineering',
      url: 'https://www.postgresql.org',
    },
    {
      id: 'res-3',
      title: 'High-Throughput Redis Lua Rate Limiting Sandbox Drill',
      type: 'PRACTICE',
      isFree: true,
      estimatedTime: '30 mins',
      difficulty: 'Advanced',
      source: 'Rennetus Sandbox',
    },
    {
      id: 'res-4',
      title: 'Concurrent React 19 Fiber Reconciler Deep Dive',
      type: 'ARTICLE',
      isFree: true,
      estimatedTime: '25 mins',
      difficulty: 'Intermediate',
      source: 'React Core Team',
    },
  ];

  const list = resources && resources.length > 0 ? resources : defaultResources;

  const getIcon = (type: ResourceItem['type']) => {
    switch (type) {
      case 'VIDEO': return <Video size={16} className="text-[#A0006D]" />;
      case 'PRACTICE': return <Code2 size={16} className="text-[#4A8BDF]" />;
      case 'ASSESSMENT': return <Award size={16} className="text-[#168A62]" />;
      case 'DOCS':
      case 'ARTICLE':
      default: return <BookOpen size={16} className="text-[#2459A8]" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#DCE7F2] p-6 md:p-8 shadow-xs space-y-4 font-body text-[#11183D]">
      <div className="flex items-center justify-between pb-3 border-b border-[#DCE7F2]">
        <h3 className="text-base font-bold font-display text-[#11183D] flex items-center gap-2">
          <BookOpen size={16} className="text-[#4A8BDF]" />
          Curated Skill Learning Resources
        </h3>
        <span className="text-xs font-semibold text-[#7B8799]">
          {list.length} Verified Sources
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {list.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl border border-[#DCE7F2] bg-[#EFFAFD]/40 hover:bg-white hover:border-[#4A8BDF]/40 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-white border border-[#DCE7F2] shadow-2xs">
                  {getIcon(item.type)}
                </span>
                <div>
                  <span className="text-[10px] font-bold font-mono text-[#7B8799] uppercase block">
                    {item.type} • {item.source}
                  </span>
                  <h4 className="text-xs font-bold font-display text-[#11183D] leading-snug">
                    {item.title}
                  </h4>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#DCE7F2]/60 text-[11px]">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full font-bold font-mono ${
                  item.isFree ? 'bg-[#E8F5F0] text-[#168A62]' : 'bg-[#FEF3C7] text-[#B45309]'
                }`}>
                  {item.isFree ? 'Free Resource' : 'Paid'}
                </span>
                <span className="text-[#7B8799] font-mono flex items-center gap-1">
                  <Clock size={12} />
                  {item.estimatedTime}
                </span>
              </div>

              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4A8BDF] hover:text-[#2459A8] font-bold font-display flex items-center gap-1 cursor-pointer"
                >
                  Open <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
