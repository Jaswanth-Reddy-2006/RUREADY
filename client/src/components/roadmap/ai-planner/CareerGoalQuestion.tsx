import React, { useState, useMemo } from 'react';
import { Search, Check } from 'lucide-react';
import { POPULAR_CAREER_ROLES } from './mockData';
import { CareerRoleOption } from './types';

interface CareerGoalQuestionProps {
  selectedRole: { id: string; name: string };
  onSelectRole: (role: { id: string; name: string }) => void;
}

export default function CareerGoalQuestion({ selectedRole, onSelectRole }: CareerGoalQuestionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [customRoleInput, setCustomRoleInput] = useState('');

  const filteredRoles = useMemo(() => {
    if (!searchQuery.trim()) return POPULAR_CAREER_ROLES;
    const q = searchQuery.toLowerCase();
    return POPULAR_CAREER_ROLES.filter(r => r.name.toLowerCase().includes(q));
  }, [searchQuery]);

  const isOtherSelected = selectedRole.id === 'other';

  const handleSelect = (role: CareerRoleOption) => {
    if (role.id === 'other') {
      onSelectRole({ id: 'other', name: customRoleInput || 'Custom Role' });
    } else {
      onSelectRole({ id: role.id, name: role.name });
    }
  };

  const handleCustomTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomRoleInput(val);
    onSelectRole({ id: 'other', name: val || '' });
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto animate-fadeIn font-body">
      {/* Question Header */}
      <div className="space-y-1 text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#11183D] tracking-tight">
          What's your career goal?
        </h2>
        <p className="text-xs sm:text-sm text-[#526078] font-medium">
          Choose the role you're working toward.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search a career or role..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-[#DCE7F2] rounded-2xl text-xs sm:text-sm text-[#11183D] placeholder:text-slate-400 focus:outline-none focus:border-[#2459A8] shadow-xs"
        />
      </div>

      {/* Role Options List / Grid */}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filteredRoles.map((role) => {
            const isSelected = selectedRole.id === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => handleSelect(role)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-blue-50/80 border-[#2459A8] text-[#2459A8] shadow-xs'
                    : 'bg-white border-[#DCE7F2] hover:border-slate-300 text-[#11183D]'
                }`}
              >
                <span className="text-xs font-bold font-display">{role.name}</span>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-[#2459A8] text-white flex items-center justify-center shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Role input if "Other" selected */}
      {isOtherSelected && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 animate-fadeIn">
          <label className="text-xs font-bold text-slate-700 block">Specify your role title:</label>
          <input
            type="text"
            value={customRoleInput}
            onChange={handleCustomTextChange}
            placeholder="e.g., Quantum Computing Specialist"
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-[#2459A8]"
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
