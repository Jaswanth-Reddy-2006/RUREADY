import React from 'react';
import { ShieldCheck, Award, CheckCircle2, Star, Building2, UserCheck } from 'lucide-react';

export type VerificationType = 'RENNETUS_VERIFIED' | 'INDUSTRY_VERIFIED' | 'COMPANY_VERIFIED' | 'EXPERT_VERIFIED';

interface VerifiedExpertBadgeProps {
  type?: VerificationType;
  expertName?: string;
  expertRole?: string;
  companyName?: string;
  experienceYears?: string;
  learnersCount?: number;
  showCard?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function VerifiedExpertBadge({
  type = 'INDUSTRY_VERIFIED',
  expertName,
  expertRole,
  companyName,
  experienceYears,
  learnersCount,
  showCard = false,
  size = 'md',
}: VerifiedExpertBadgeProps) {
  const getBadgeConfig = () => {
    switch (type) {
      case 'RENNETUS_VERIFIED':
        return {
          label: 'Rennetus Verified',
          icon: <ShieldCheck className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
          bg: 'bg-[#EFFAFD]',
          text: 'text-[#2459A8]',
          border: 'border-[#4A8BDF]/40',
        };
      case 'COMPANY_VERIFIED':
        return {
          label: companyName ? `${companyName} Verified` : 'Company Verified',
          icon: <Building2 className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
          bg: 'bg-[#F0FDF4]',
          text: 'text-[#15803D]',
          border: 'border-[#168A62]/30',
        };
      case 'EXPERT_VERIFIED':
        return {
          label: 'Expert Verified',
          icon: <UserCheck className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
          bg: 'bg-[#FEF3C7]',
          text: 'text-[#B45309]',
          border: 'border-[#F59E0B]/40',
        };
      case 'INDUSTRY_VERIFIED':
      default:
        return {
          label: 'Industry Verified',
          icon: <Award className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />,
          bg: 'bg-[#F8EAF4]',
          text: 'text-[#A0006D]',
          border: 'border-[#A0006D]/30',
        };
    }
  };

  const config = getBadgeConfig();

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-[11px]',
    lg: 'px-3 py-1.5 text-xs',
  }[size];

  if (!showCard) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-bold font-display border shadow-xs transition-all ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
      >
        {config.icon}
        {config.label}
      </span>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#DCE7F2] p-4 shadow-xs hover:border-[#4A8BDF]/40 transition-all">
      <div className="flex items-start justify-between gap-3 mb-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-bold font-display border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
        >
          {config.icon}
          {config.label}
        </span>
        {learnersCount && (
          <span className="text-[11px] font-medium text-[#7B8799]">
            {learnersCount.toLocaleString()} learners
          </span>
        )}
      </div>

      {expertName && (
        <div className="mt-2 space-y-1">
          <p className="text-sm font-bold font-display text-[#11183D] flex items-center gap-1.5">
            {expertName}
            <CheckCircle2 className="w-3.5 h-3.5 text-[#4A8BDF]" />
          </p>
          <p className="text-xs text-[#526078]">
            {expertRole || 'Senior Software Engineer'} {companyName ? `@ ${companyName}` : ''}
          </p>
          {experienceYears && (
            <p className="text-[11px] font-mono text-[#7B8799]">
              {experienceYears} experience
            </p>
          )}
        </div>
      )}
    </div>
  );
}
