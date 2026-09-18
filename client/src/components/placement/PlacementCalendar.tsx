import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight,
  AlertTriangle, Sparkles, Building2, CheckCircle2, ArrowRight,
  Filter, Tag, CalendarDays, ExternalLink, Zap
} from 'lucide-react';
import { usePlacementStore, JobApplication } from '../../store/usePlacementStore';

export default function PlacementCalendar({ onSelectApplication }: { onSelectApplication: (id: string) => void }) {
  const { applications } = usePlacementStore();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 1)); // September 2026
  const [selectedDayNum, setSelectedDayNum] = useState<number>(18); // Default to 18th

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Map dates to events
  const getEventsForDay = (day: number) => {
    const targetStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    return applications.filter((app) => {
      if (!app.nextDeadlineDate) return false;
      const appDate = app.nextDeadlineDate.split('T')[0];
      return appDate === targetStr;
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDayNum(1);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDayNum(1);
  };

  const selectedDayEvents = getEventsForDay(selectedDayNum);
  const formattedSelectedDate = `${monthNames[month]} ${selectedDayNum}, ${year}`;

  // Find overall month summary metrics
  const monthEventsCount = Array.from({ length: daysInMonth }).reduce<number>((acc, _, idx) => {
    return acc + getEventsForDay(idx + 1).length;
  }, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 select-none font-sans">
      {/* Main Calendar View (8 cols) */}
      <div className="lg:col-span-8 bg-white border border-[#DCE7F2] rounded-3xl p-6 shadow-sm space-y-6">
        {/* Calendar Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#DCE7F2] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#EFFAFD] text-[#2459A8] border border-[#DCE7F2]">
              <CalendarIcon size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black font-display text-[#11183D]">
                Placement Assessment & Interview Schedule
              </h3>
              <p className="text-xs text-[#526078] flex items-center gap-2">
                <span>{monthNames[month]} {year}</span>
                <span>•</span>
                <span className="font-semibold text-[#2459A8]">{monthEventsCount} Key Deadlines Scheduled</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl bg-slate-100 hover:bg-[#EFFAFD] hover:text-[#2459A8] text-[#11183D] border border-[#DCE7F2] transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-black font-display px-3 py-1.5 rounded-xl bg-[#EFFAFD] text-[#2459A8] border border-[#DCE7F2] min-w-[130px] text-center">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl bg-slate-100 hover:bg-[#EFFAFD] hover:text-[#2459A8] text-[#11183D] border border-[#DCE7F2] transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Weekday Grid */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-black font-mono text-[#7B8799] uppercase tracking-wider py-1">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-28 bg-slate-50/50 rounded-2xl border border-dashed border-[#DCE7F2]/40" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dayEvents = getEventsForDay(dayNum);
            const isToday = dayNum === 18 && month === 8 && year === 2026; // Sep 18, 2026
            const isSelected = selectedDayNum === dayNum;

            return (
              <div
                key={dayNum}
                onClick={() => setSelectedDayNum(dayNum)}
                className={`h-28 p-2 rounded-2xl border flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'border-[#2459A8] bg-[#EFFAFD] ring-2 ring-[#2459A8]/40 shadow-sm'
                    : isToday
                    ? 'border-[#4A8BDF] bg-blue-50/50'
                    : dayEvents.length > 0
                    ? 'border-[#DCE7F2] bg-white shadow-2xs hover:border-[#4A8BDF] hover:bg-slate-50/80'
                    : 'border-[#DCE7F2]/60 bg-white/60 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md ${
                    isSelected
                      ? 'bg-[#2459A8] text-white'
                      : isToday
                      ? 'bg-[#4A8BDF] text-white'
                      : 'text-[#11183D]'
                  }`}>
                    {dayNum}
                  </span>

                  {dayEvents.length > 0 && (
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-[#2459A8]/10 text-[#2459A8] border border-[#2459A8]/20 font-mono">
                      {dayEvents.length}
                    </span>
                  )}
                </div>

                {/* Day events badge previews */}
                <div className="space-y-1 overflow-y-auto max-h-16 no-scrollbar">
                  {dayEvents.map((ev) => (
                    <button
                      key={ev.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectApplication(ev.id);
                      }}
                      className={`w-full text-left p-1 rounded-lg text-[10px] font-bold font-sans truncate flex items-center gap-1 transition-transform hover:scale-102 cursor-pointer ${
                        ev.riskLevel === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-900 border border-rose-200'
                          : ev.riskLevel === 'AT_RISK'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-white/80 text-[#2459A8] border border-[#DCE7F2]'
                      }`}
                    >
                      <Building2 size={10} className="shrink-0" />
                      <span className="truncate">{ev.company}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Event Drawer Panel (4 cols) */}
      <div className="lg:col-span-4 bg-white border border-[#DCE7F2] rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-4">
            <div className="flex items-center gap-2.5">
              <CalendarDays className="text-[#2459A8]" size={18} />
              <div>
                <h4 className="text-base font-black font-display text-[#11183D]">
                  {formattedSelectedDate}
                </h4>
                <p className="text-xs text-[#526078]">
                  {selectedDayEvents.length} {selectedDayEvents.length === 1 ? 'Drive / Assessment' : 'Drives / Assessments'}
                </p>
              </div>
            </div>
            {selectedDayNum === 18 && month === 8 && year === 2026 && (
              <span className="px-2.5 py-0.5 bg-[#2459A8] text-white rounded-full text-[10px] font-bold font-mono">
                Today
              </span>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDayNum}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="space-y-3"
            >
              {selectedDayEvents.length === 0 ? (
                <div className="p-8 text-center bg-[#EFFAFD]/40 border border-dashed border-[#DCE7F2] rounded-2xl space-y-3">
                  <div className="w-10 h-10 rounded-full bg-[#EFFAFD] text-[#2459A8] flex items-center justify-center mx-auto border border-[#DCE7F2]">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#11183D]">No Deadlines on this Date</h5>
                    <p className="text-[11px] text-[#526078] max-w-[200px] mx-auto mt-1">
                      Use this time to review practice mock interviews, refine code solutions, or update your ATS resume.
                    </p>
                  </div>
                </div>
              ) : (
                selectedDayEvents.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-2xl border border-[#DCE7F2] bg-white hover:border-[#2459A8] hover:shadow-sm transition-all space-y-3 group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-[#11183D]">{app.company}</span>
                          <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                            app.riskLevel === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-800'
                              : app.riskLevel === 'AT_RISK'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {app.riskLevel}
                          </span>
                        </div>
                        <p className="text-xs text-[#526078] font-medium">{app.role}</p>
                      </div>

                      <span className="text-xs font-black font-mono text-[#2459A8] bg-[#EFFAFD] px-2 py-1 rounded-lg border border-[#DCE7F2]">
                        {app.ctc}
                      </span>
                    </div>

                    <div className="p-2.5 bg-[#EFFAFD]/60 rounded-xl border border-[#DCE7F2]/80 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#526078] font-medium">Stage:</span>
                        <span className="font-bold text-[#11183D]">{app.stage}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#526078] font-medium">Scheduled Event:</span>
                        <span className="font-bold text-[#2459A8] truncate max-w-[140px]">
                          {app.nextDeadlineTitle || app.stage}
                        </span>
                      </div>
                      {app.prepScore !== undefined && (
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#DCE7F2]/60">
                          <span className="text-[#526078] font-medium flex items-center gap-1">
                            <Zap size={12} className="text-amber-500 fill-amber-500" />
                            AI Prep Score:
                          </span>
                          <span className="font-bold text-emerald-600">{app.prepScore}%</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => onSelectApplication(app.id)}
                      className="w-full py-2 px-3 rounded-xl bg-[#2459A8] hover:bg-[#1a4380] text-white text-xs font-bold font-sans flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                    >
                      <span>Launch Command & Prep</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer tip */}
        <div className="p-3 bg-[#EFFAFD] border border-[#DCE7F2] rounded-2xl flex items-center gap-2.5">
          <Sparkles className="text-[#2459A8] shrink-0" size={16} />
          <p className="text-[11px] text-[#526078] leading-tight">
            Clicking on any date in the calendar highlights all scheduled placement drives, online assessments, and interview slots for that day.
          </p>
        </div>
      </div>
    </div>
  );
}

