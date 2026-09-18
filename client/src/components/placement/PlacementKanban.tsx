import React from 'react';
import { motion } from 'framer-motion';
import { 
  MoreHorizontal, Clock, CheckCircle2, ChevronRight
} from 'lucide-react';
import { JobApplication, ApplicationStage, usePlacementStore } from '../../store/usePlacementStore';

const KANBAN_COLUMNS: { 
  id: ApplicationStage; 
  title: string; 
  headerBg: string; 
  headerText: string; 
  badgeBg: string;
  badgeText: string;
  borderColor: string;
}[] = [
  { 
    id: 'APPLIED', 
    title: 'Applied', 
    headerBg: 'bg-[#EFFAFD]', 
    headerText: 'text-[#2459A8]', 
    badgeBg: 'bg-[#DCE7F2]', 
    badgeText: 'text-[#2459A8]',
    borderColor: 'border-[#DCE7F2]',
  },
  { 
    id: 'OA', 
    title: 'OA Stage', 
    headerBg: 'bg-amber-50', 
    headerText: 'text-amber-800', 
    badgeBg: 'bg-amber-100', 
    badgeText: 'text-amber-900',
    borderColor: 'border-amber-200',
  },
  { 
    id: 'TECHNICAL_1', 
    title: 'Technical Interview', 
    headerBg: 'bg-indigo-50', 
    headerText: 'text-indigo-800', 
    badgeBg: 'bg-indigo-100', 
    badgeText: 'text-indigo-900',
    borderColor: 'border-indigo-200',
  },
  { 
    id: 'HR', 
    title: 'HR Round', 
    headerBg: 'bg-[#F8EAF4]', 
    headerText: 'text-[#A0006D]', 
    badgeBg: 'bg-[#F8EAF4]', 
    badgeText: 'text-[#A0006D]',
    borderColor: 'border-[#A0006D]/30',
  },
  { 
    id: 'OFFERED', 
    title: 'Offers', 
    headerBg: 'bg-[#E8F5F0]', 
    headerText: 'text-[#168A62]', 
    badgeBg: 'bg-emerald-100', 
    badgeText: 'text-[#168A62]',
    borderColor: 'border-[#168A62]/30',
  },
  { 
    id: 'REJECTED', 
    title: 'Rejected', 
    headerBg: 'bg-rose-50', 
    headerText: 'text-rose-800', 
    badgeBg: 'bg-rose-100', 
    badgeText: 'text-rose-900',
    borderColor: 'border-rose-200',
  },
];

// Custom company SVG / logo rendering helper
const getCompanyLogo = (company: string, logoUrl?: string) => {
  const name = company.toLowerCase();
  
  if (logoUrl) {
    return <img src={logoUrl} alt={company} className="h-5 w-5 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />;
  }

  if (name.includes('google')) {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
      </svg>
    );
  }
  if (name.includes('microsoft')) {
    return (
      <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
        <div className="bg-[#F25022] w-2 h-2" />
        <div className="bg-[#7FBA00] w-2 h-2" />
        <div className="bg-[#00A4EF] w-2 h-2" />
        <div className="bg-[#FFB900] w-2 h-2" />
      </div>
    );
  }
  if (name.includes('amazon')) {
    return <span className="font-black text-sm text-[#FF9900] font-serif">a</span>;
  }
  if (name.includes('adobe')) {
    return <span className="font-black text-sm text-[#ED2224]">A</span>;
  }
  if (name.includes('wipro')) {
    return <span className="font-bold text-xs text-[#005B94]">wipro</span>;
  }
  if (name.includes('capgemini')) {
    return <span className="text-xs text-[#0076AD]">♠</span>;
  }
  if (name.includes('tcs')) {
    return <span className="font-bold text-[10px] text-[#2459A8]">tcs</span>;
  }
  if (name.includes('accenture')) {
    return <span className="font-bold text-sm text-[#A100FF]">&gt;</span>;
  }
  if (name.includes('cognizant')) {
    return <span className="font-bold text-xs text-[#0033A0]">C</span>;
  }
  if (name.includes('deloitte')) {
    return <span className="font-bold text-sm text-[#86BC25]">D.</span>;
  }
  if (name.includes('ibm')) {
    return <span className="font-mono font-bold text-xs text-[#052FAD]">IBM</span>;
  }

  return <span className="font-bold text-xs text-[#2459A8]">{company.charAt(0)}</span>;
};

interface PlacementKanbanProps {
  onSelectApplication: (id: string) => void;
}

export default function PlacementKanban({ onSelectApplication }: PlacementKanbanProps) {
  const { applications, searchQuery, filterRisk } = usePlacementStore();

  const filteredApps = applications.filter((app) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchComp = app.company.toLowerCase().includes(q);
      const matchRole = app.role.toLowerCase().includes(q);
      if (!matchComp && !matchRole) return false;
    }
    if (filterRisk !== 'ALL' && app.riskLevel !== filterRisk) return false;
    return true;
  });

  return (
    <div className="overflow-x-auto pb-6 select-none font-sans">
      <div className="flex items-start gap-4 min-w-[1340px]">
        {KANBAN_COLUMNS.map((col) => {
          const colApps = filteredApps.filter((a) => {
            if (col.id === 'TECHNICAL_1') {
              return a.stage === 'TECHNICAL_1' || a.stage === 'TECHNICAL_2';
            }
            return a.stage === col.id;
          });

          return (
            <div
              key={col.id}
              className="w-[215px] sm:w-[230px] shrink-0 bg-[#EFFAFD]/60 border border-[#DCE7F2] rounded-3xl p-3 flex flex-col min-h-[500px]"
            >
              {/* Column Header - Clean title with count badge */}
              <div className="flex items-center justify-between px-1 py-1.5 mb-3 border-b border-[#DCE7F2]/60 pb-2">
                <div className={`px-3 py-1 rounded-full text-xs font-bold font-display flex items-center gap-2 ${col.headerBg} ${col.headerText} border ${col.borderColor}`}>
                  <span>{col.title}</span>
                  <span className={`px-2 py-0.2 rounded-full text-[10px] font-mono font-bold ${col.badgeBg} ${col.badgeText}`}>
                    {colApps.length}
                  </span>
                </div>
              </div>

              {/* Cards List */}
              <div className="flex-1 space-y-3 overflow-y-auto">
                {colApps.length === 0 ? (
                  <div className="p-6 text-center border-2 border-dashed border-[#DCE7F2] rounded-2xl">
                    <p className="text-[11px] font-medium text-[#7B8799]">No applications</p>
                  </div>
                ) : (
                  colApps.map((app) => (
                    <motion.div
                      key={app.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -3 }}
                      onClick={() => onSelectApplication(app.id)}
                      className="p-3.5 bg-white border border-[#DCE7F2] hover:border-[#4A8BDF] rounded-2xl shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-2.5 relative group"
                    >
                      {/* Top Row: Logo, Company Name & Role */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-[#EFFAFD] border border-[#DCE7F2] flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                            {getCompanyLogo(app.company, app.companyLogo)}
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-[#11183D] truncate group-hover:text-[#2459A8] transition-colors leading-tight">
                              {app.company}
                            </h5>
                            <p className="text-[11px] font-medium text-[#526078] truncate leading-tight mt-0.5">
                              {app.role}
                            </p>
                          </div>
                        </div>

                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectApplication(app.id);
                          }}
                          className="p-1 text-[#7B8799] hover:text-[#11183D] rounded-md hover:bg-[#EFFAFD] transition-colors"
                        >
                          <MoreHorizontal size={14} />
                        </button>
                      </div>

                      {/* Package & Location */}
                      <div className="text-[11px] text-[#526078] font-medium truncate">
                        <span className="font-bold text-[#11183D] font-mono">{app.ctc}</span> • <span>{app.location}</span>
                      </div>

                      {/* Time Badge & Date row */}
                      <div className="flex items-center justify-between gap-1 pt-1 border-t border-[#DCE7F2]/60">
                        {app.stage === 'OFFERED' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5F0] text-[#168A62] border border-[#168A62]/30">
                            <CheckCircle2 size={10} />
                            <span>Offer</span>
                          </span>
                        ) : app.timeTag ? (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            app.timeTag.includes('hours') || app.timeTag.includes('Tomorrow') || app.timeTag.includes('2 days')
                              ? 'bg-rose-50 text-rose-800 border border-rose-200'
                              : 'bg-[#EFFAFD] text-[#526078] border border-[#DCE7F2]'
                          }`}>
                            <Clock size={10} />
                            <span>{app.timeTag}</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#7B8799] font-mono">—</span>
                        )}

                        <span className="text-[10px] font-medium text-[#7B8799] font-mono">
                          {app.appliedDate}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
