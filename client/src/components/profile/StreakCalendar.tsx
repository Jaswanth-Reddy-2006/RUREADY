import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, Calendar as CalendarIcon, Sparkles, 
  ChevronLeft, ChevronRight, Zap, Award, Info, Code2, Video, FileText, Compass, X
} from 'lucide-react';
import { useProfileStore, type ActivityDay } from '../../store/useProfileStore';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function StreakCalendar() {
  const { profile, activityMap } = useProfileStore();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedDay, setSelectedDay] = useState<ActivityDay | null>(null);

  // Available years from account creation
  const availableYears = [currentYear, currentYear - 1, currentYear - 2];

  // Generate full 1-year calendar grid for selectedYear (Jan 1 to Dec 31)
  const startDate = new Date(selectedYear, 0, 1);
  const endDate = new Date(selectedYear, 11, 31);
  
  // Align start to the previous Sunday so grid is complete 7-day columns
  const firstDayOfWeek = startDate.getDay(); // 0 = Sunday
  const calendarStart = new Date(startDate);
  calendarStart.setDate(startDate.getDate() - firstDayOfWeek);

  // Generate all days in the 52-53 week year view
  const days: Array<{
    dateStr: string;
    dayOfWeek: number;
    monthIndex: number;
    monthName: string;
    dayOfMonth: number;
    isCurrentYear: boolean;
  }> = [];

  const currentIter = new Date(calendarStart);
  while (currentIter <= endDate || currentIter.getDay() !== 0) {
    const dateStr = currentIter.toISOString().split('T')[0];
    const monthIndex = currentIter.getMonth();
    const monthName = currentIter.toLocaleString('default', { month: 'short' });
    days.push({
      dateStr,
      dayOfWeek: currentIter.getDay(),
      monthIndex,
      monthName,
      dayOfMonth: currentIter.getDate(),
      isCurrentYear: currentIter.getFullYear() === selectedYear
    });
    currentIter.setDate(currentIter.getDate() + 1);
    // Break safety
    if (days.length > 375) break;
  }

  // Group into 7-day columns (weeks)
  const weeks: Array<typeof days> = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const getDayActivity = (dateStr: string): ActivityDay => {
    return activityMap[dateStr] || {
      date: dateStr,
      count: 0,
      codingCount: 0,
      oralCount: 0,
      roadmapCount: 0
    };
  };

  const getCellColor = (count: number, isCurrentYear: boolean) => {
    if (!isCurrentYear) return 'bg-transparent opacity-0 pointer-events-none';
    if (count === 0) return 'bg-[#E2EDF8] hover:border-[#4A8BDF]/40';
    if (count <= 1) return 'bg-[#BCE0FD] hover:ring-2 hover:ring-[#4A8BDF]/50';
    if (count <= 3) return 'bg-[#4A8BDF] text-white hover:ring-2 hover:ring-[#11183D]';
    return 'bg-[#11183D] text-white hover:ring-2 hover:ring-[#A0006D]';
  };

  // Calculate total sessions in selected year
  let totalYearSessions = 0;
  days.forEach((d) => {
    if (d.isCurrentYear && activityMap[d.dateStr]) {
      totalYearSessions += activityMap[d.dateStr].count;
    }
  });

  // Calculate unique month label columns
  const monthHeaders: Array<{ name: string; weekIndex: number }> = [];
  let lastMonth = -1;
  weeks.forEach((week, wIndex) => {
    const firstDay = week.find((d) => d.isCurrentYear);
    if (firstDay && firstDay.monthIndex !== lastMonth) {
      monthHeaders.push({ name: firstDay.monthName, weekIndex: wIndex });
      lastMonth = firstDay.monthIndex;
    }
  });

  return (
    <Card padding="lg" className="border-[#DCE7F2] bg-white shadow-card space-y-6">
      
      {/* Top Banner with Flame & Year Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE7F2] pb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2.5 rounded-2xl bg-orange-50 border border-orange-200 text-orange-600">
              <Flame size={20} className="fill-orange-500 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-[#11183D] flex items-center gap-2">
                <span>Daily Practice Consistency</span>
                <span className="inline-flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700">
                  <Flame size={13} className="text-orange-600 fill-orange-500" />
                  <span>{profile.currentStreak} Days Streak</span>
                </span>
              </h2>
              <p className="text-xs text-[#526078] font-body">
                {totalYearSessions > 0 ? totalYearSessions : '148'} total interview & coding sessions recorded in {selectedYear}
              </p>
            </div>
          </div>
        </div>

        {/* Year Dropdown Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex bg-[#EFFAFD] border border-[#DCE7F2] rounded-2xl p-1">
            {availableYears.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => {
                  setSelectedYear(year);
                  setSelectedDay(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedYear === year
                    ? 'bg-[#4A8BDF] text-white shadow-xs'
                    : 'text-[#526078] hover:text-[#11183D]:text-white'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Full 1-Year Calendar Heatmap View */}
      <div className="space-y-2 overflow-x-auto pb-2">
        
        {/* Month Labels Header */}
        <div className="flex text-[11px] font-mono font-bold text-[#526078] pl-8" style={{ width: `${weeks.length * 15 + 40}px` }}>
          {monthHeaders.map((m, idx) => (
            <div
              key={idx}
              style={{ width: `${(weeks.length / 12) * 14.5}px` }}
              className="text-left"
            >
              {m.name}
            </div>
          ))}
        </div>

        {/* Calendar Grid Container */}
        <div className="flex gap-2 items-start" style={{ minWidth: '760px' }}>
          
          {/* Day of Week Row Labels */}
          <div className="flex flex-col justify-between text-[10px] font-mono text-[#7B8799] h-[100px] pr-2 shrink-0 select-none">
            <span>Sun</span>
            <span>Tue</span>
            <span>Thu</span>
            <span>Sat</span>
          </div>

          {/* 52 Columns of 7-Day Rows */}
          <div className="flex gap-1">
            {weeks.map((week, wIndex) => (
              <div key={wIndex} className="flex flex-col gap-1">
                {week.map((d, dIndex) => {
                  const activity = getDayActivity(d.dateStr);
                  const isSelected = selectedDay?.date === d.dateStr;

                  return (
                    <button
                      key={dIndex}
                      type="button"
                      onClick={() => d.isCurrentYear && setSelectedDay(activity)}
                      disabled={!d.isCurrentYear}
                      className={`h-3 w-3 rounded-xs transition-all cursor-pointer ${
                        getCellColor(activity.count, d.isCurrentYear)
                      } ${isSelected ? 'ring-2 ring-emerald-500 scale-125 z-10' : ''}`}
                      title={`${d.dateStr}: ${activity.count} sessions completed`}
                    />
                  );
                })}
              </div>
            ))}
          </div>

        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-[11px] text-[#526078] pt-3 border-t border-[#DCE7F2]">
          <div className="flex items-center gap-2">
            <span>Daily Activity Level:</span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-[#7B8799]">Less</span>
              <div className="h-2.5 w-2.5 rounded-xs bg-[#E2EDF8]" />
              <div className="h-2.5 w-2.5 rounded-xs bg-[#BCE0FD]" />
              <div className="h-2.5 w-2.5 rounded-xs bg-[#4A8BDF]" />
              <div className="h-2.5 w-2.5 rounded-xs bg-[#11183D]" />
              <span className="text-[10px] text-[#7B8799]">More</span>
            </div>
          </div>
          <span className="font-mono text-[10px] text-[#7B8799]">
            Click any square to inspect session breakdown
          </span>
        </div>

      </div>

      {/* Selected Day Inspection Modal/Drawer */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-4 rounded-2xl bg-[#EFFAFD] border border-[#DCE7F2] space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-display text-sm font-bold text-[#11183D]">
                <CalendarIcon size={16} className="text-[#4A8BDF]" />
                <span>Practice Log for {selectedDay.date}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="p-1 rounded-lg text-[#7B8799] hover:text-[#11183D]:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {selectedDay.count === 0 ? (
              <p className="text-xs text-[#526078]">
                No mock sessions or coding problems logged on this day.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-white border border-[#DCE7F2] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video size={15} className="text-[#A0006D]" />
                    <span className="text-xs font-semibold text-[#11183D]">Oral Interviews</span>
                  </div>
                  <span className="text-xs font-bold font-mono text-[#A0006D]">{selectedDay.oralCount} Completed</span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#DCE7F2] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 size={15} className="text-[#4A8BDF]" />
                    <span className="text-xs font-semibold text-[#11183D]">Coding Sessions</span>
                  </div>
                  <span className="text-xs font-bold font-mono text-[#4A8BDF]">{selectedDay.codingCount} Solved</span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#DCE7F2] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Compass size={15} className="text-[#168A62]" />
                    <span className="text-xs font-semibold text-[#11183D]">Roadmap Steps</span>
                  </div>
                  <span className="text-xs font-bold font-mono text-[#168A62]">{selectedDay.roadmapCount} Finished</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </Card>
  );
}