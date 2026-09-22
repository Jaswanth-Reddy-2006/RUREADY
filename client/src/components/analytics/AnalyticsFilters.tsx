import React from 'react';
import { Calendar, Filter, Video, Code2, Layers } from 'lucide-react';
import { TimeRangeFilter, InterviewTypeFilter } from '../../utils/careerAnalyticsAggregator';

interface AnalyticsFiltersProps {
  timeRange: TimeRangeFilter;
  interviewType: InterviewTypeFilter;
  onTimeRangeChange: (range: TimeRangeFilter) => void;
  onInterviewTypeChange: (type: InterviewTypeFilter) => void;
}

export default function AnalyticsFilters({
  timeRange,
  interviewType,
  onTimeRangeChange,
  onInterviewTypeChange,
}: AnalyticsFiltersProps) {
  return (
    <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#DCE7F2] shadow-2xs flex flex-wrap items-center justify-between gap-3 font-sans">
      <div className="flex items-center gap-2 text-xs font-bold text-[#11183D]">
        <Filter size={15} className="text-[#2459A8]" />
        <span>Analytics Filter:</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        {/* Time Range Selector */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-[#DCE7F2] rounded-xl px-2.5 py-1.5">
          <Calendar size={13} className="text-[#526078]" />
          <select
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value as TimeRangeFilter)}
            className="bg-transparent font-bold text-[#11183D] focus:outline-none cursor-pointer"
          >
            <option value="all">All Time</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>

        {/* Interview Type Selector */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-[#DCE7F2] rounded-xl px-2.5 py-1.5">
          <Layers size={13} className="text-[#526078]" />
          <select
            value={interviewType}
            onChange={(e) => onInterviewTypeChange(e.target.value as InterviewTypeFilter)}
            className="bg-transparent font-bold text-[#11183D] focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Interviews (Oral & Coding)</option>
            <option value="ORAL">Oral Interviews Only</option>
            <option value="CODING">Coding Interviews Only</option>
          </select>
        </div>

        {/* Roles Filter Badge */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 border border-[#DCE7F2] rounded-xl px-3 py-1.5 text-[#526078] font-medium">
          <span>Role:</span>
          <strong className="text-[#11183D]">All Target Roles</strong>
        </div>
      </div>
    </div>
  );
}
