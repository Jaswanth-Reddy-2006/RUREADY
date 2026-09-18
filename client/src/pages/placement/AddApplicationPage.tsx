import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Building2, Briefcase, DollarSign, MapPin, Calendar, 
  FileText, Sparkles, AlertCircle, CheckCircle2, ShieldAlert, Rocket
} from 'lucide-react';
import { usePlacementStore, ApplicationStage, DriveType, RiskLevel } from '../../store/usePlacementStore';

export default function AddApplicationPage() {
  const navigate = useNavigate();
  const { addApplication } = usePlacementStore();

  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [ctc, setCtc] = useState('');
  const [location, setLocation] = useState('');
  const [driveType, setDriveType] = useState<DriveType>('CAMPUS');
  const [stage, setStage] = useState<ApplicationStage>('APPLIED');
  const [nextDeadlineDate, setNextDeadlineDate] = useState('2026-09-25');
  const [nextDeadlineTitle, setNextDeadlineTitle] = useState('');
  const [resumeTitle, setResumeTitle] = useState('Software_Engineer_ATS_V2.pdf');
  const [jobDescription, setJobDescription] = useState('');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('ON_TRACK');
  const [riskFactorInput, setRiskFactorInput] = useState('');
  const [riskFactors, setRiskFactors] = useState<string[]>(['Strict CS Cutoff']);

  const handleAddRiskFactor = () => {
    if (riskFactorInput.trim() && !riskFactors.includes(riskFactorInput.trim())) {
      setRiskFactors([...riskFactors, riskFactorInput.trim()]);
      setRiskFactorInput('');
    }
  };

  const handleRemoveRiskFactor = (item: string) => {
    setRiskFactors(riskFactors.filter((f) => f !== item));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!company.trim() || !role.trim()) {
      return;
    }

    addApplication({
      company: company.trim(),
      role: role.trim(),
      ctc: ctc.trim() || '12 LPA',
      location: location.trim() || 'Bengaluru / Hybrid',
      driveType,
      stage,
      nextDeadlineDate: nextDeadlineDate ? `${nextDeadlineDate}T18:00:00Z` : undefined,
      nextDeadlineTitle: nextDeadlineTitle.trim() || (stage === 'OA' ? 'Online Assessment' : 'Interview Round'),
      resumeTitle,
      jobDescription: jobDescription.trim(),
      riskLevel,
      riskFactors,
    });

    navigate('/placement-crm');
  };

  return (
    <div className="min-h-screen bg-[#EFFAFD]/30 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Breadcrumb & Back Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/placement-crm')}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#2459A8] hover:text-[#1a4380] bg-white border border-[#DCE7F2] px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-2xs hover:shadow-xs"
          >
            <ArrowLeft size={16} />
            <span>Back to Placement Command Center</span>
          </button>

          <span className="text-xs font-bold font-mono text-[#526078]">
            Placement CRM / New Application
          </span>
        </div>

        {/* Title Header Card */}
        <div className="bg-gradient-to-br from-[#11183D] via-[#1c2759] to-[#2459A8] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-[#4A8BDF] border border-white/10">
              <Rocket size={14} className="text-[#4A8BDF]" />
              Placement Application Tracker
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
              Add New Placement Drive
            </h1>
            <p className="text-xs sm:text-sm text-[#DCE7F2] max-w-2xl font-normal">
              Track company applications, test schedules, cutoffs, and tailored ATS resume attachments in one central location.
            </p>
          </div>

          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#4A8BDF]/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Company & Role Info */}
          <div className="bg-white border border-[#DCE7F2] rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 border-b border-[#DCE7F2] pb-3">
              <Building2 className="text-[#2459A8]" size={20} />
              <h3 className="text-base font-black font-display text-[#11183D]">
                Company & Drive Overview
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#11183D] mb-1.5">
                  Company Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-3 text-[#7B8799]" size={16} />
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Google, Microsoft, Atlassian"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#DCE7F2] text-xs font-semibold text-[#11183D] focus:outline-none focus:border-[#2459A8] focus:ring-1 focus:ring-[#2459A8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#11183D] mb-1.5">
                  Job Role / Title <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-3 text-[#7B8799]" size={16} />
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Software Development Engineer 1"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#DCE7F2] text-xs font-semibold text-[#11183D] focus:outline-none focus:border-[#2459A8] focus:ring-1 focus:ring-[#2459A8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#11183D] mb-1.5">
                  Offered Package (CTC)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-3 text-[#7B8799]" size={16} />
                  <input
                    type="text"
                    value={ctc}
                    onChange={(e) => setCtc(e.target.value)}
                    placeholder="e.g. 18.5 LPA"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#DCE7F2] text-xs font-semibold text-[#11183D] focus:outline-none focus:border-[#2459A8] focus:ring-1 focus:ring-[#2459A8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#11183D] mb-1.5">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 text-[#7B8799]" size={16} />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bengaluru / Remote"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#DCE7F2] text-xs font-semibold text-[#11183D] focus:outline-none focus:border-[#2459A8] focus:ring-1 focus:ring-[#2459A8]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#11183D] mb-1.5">
                Drive Channel Type
              </label>
              <div className="flex flex-wrap gap-2">
                {(['CAMPUS', 'OFF_CAMPUS', 'REFERRAL'] as DriveType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setDriveType(t)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      driveType === t
                        ? 'bg-[#2459A8] text-white border-[#2459A8] shadow-xs'
                        : 'bg-[#EFFAFD]/50 text-[#11183D] border-[#DCE7F2] hover:bg-[#EFFAFD]'
                    }`}
                  >
                    {t === 'CAMPUS' ? '🎓 On-Campus Drive' : t === 'OFF_CAMPUS' ? '🌐 Off-Campus' : '🤝 Employee Referral'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Stage & Schedule */}
          <div className="bg-white border border-[#DCE7F2] rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 border-b border-[#DCE7F2] pb-3">
              <Calendar className="text-[#2459A8]" size={20} />
              <h3 className="text-base font-black font-display text-[#11183D]">
                Current Stage & Key Deadlines
              </h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#11183D] mb-2">
                Select Initial Pipeline Stage
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'APPLIED', label: 'Applied' },
                  { id: 'SHORTLISTED', label: 'Shortlisted' },
                  { id: 'OA', label: 'OA Stage' },
                  { id: 'TECHNICAL_1', label: 'Tech Round 1' },
                  { id: 'TECHNICAL_2', label: 'Tech Round 2' },
                  { id: 'HR', label: 'HR Round' },
                  { id: 'OFFERED', label: 'Offered 🎉' },
                  { id: 'REJECTED', label: 'Rejected' },
                ].map((stg) => (
                  <button
                    key={stg.id}
                    type="button"
                    onClick={() => setStage(stg.id as ApplicationStage)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      stage === stg.id
                        ? 'bg-[#11183D] text-white border-[#11183D] shadow-xs'
                        : 'bg-white text-[#526078] border-[#DCE7F2] hover:bg-slate-50'
                    }`}
                  >
                    {stg.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#11183D] mb-1.5">
                  Upcoming Assessment Date
                </label>
                <input
                  type="date"
                  value={nextDeadlineDate}
                  onChange={(e) => setNextDeadlineDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE7F2] text-xs font-semibold text-[#11183D] focus:outline-none focus:border-[#2459A8] focus:ring-1 focus:ring-[#2459A8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#11183D] mb-1.5">
                  Assessment / Interview Event Title
                </label>
                <input
                  type="text"
                  value={nextDeadlineTitle}
                  onChange={(e) => setNextDeadlineTitle(e.target.value)}
                  placeholder="e.g. HackerRank OA test (90 mins)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE7F2] text-xs font-semibold text-[#11183D] focus:outline-none focus:border-[#2459A8] focus:ring-1 focus:ring-[#2459A8]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Resume & Risk Factors */}
          <div className="bg-white border border-[#DCE7F2] rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 border-b border-[#DCE7F2] pb-3">
              <FileText className="text-[#2459A8]" size={20} />
              <h3 className="text-base font-black font-display text-[#11183D]">
                Resume Attachment & Risk Diagnostic
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#11183D] mb-1.5">
                  Tailored Resume Title
                </label>
                <input
                  type="text"
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                  placeholder="e.g. SDE_Backend_Resume_V3.pdf"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE7F2] text-xs font-semibold text-[#11183D] focus:outline-none focus:border-[#2459A8] focus:ring-1 focus:ring-[#2459A8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#11183D] mb-1.5">
                  Self-Assessed Risk Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'ON_TRACK', label: 'On Track', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
                    { id: 'AT_RISK', label: 'At Risk', color: 'bg-amber-50 text-amber-800 border-amber-200' },
                    { id: 'CRITICAL', label: 'Critical', color: 'bg-rose-50 text-rose-800 border-rose-200' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRiskLevel(r.id as RiskLevel)}
                      className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                        riskLevel === r.id
                          ? `${r.color} ring-2 ring-[#2459A8]/30 font-black`
                          : 'bg-white text-[#7B8799] border-[#DCE7F2]'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#11183D] mb-1.5">
                Key Concern Tags / Cutoff Flags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={riskFactorInput}
                  onChange={(e) => setRiskFactorInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddRiskFactor();
                    }
                  }}
                  placeholder="Add custom concern (e.g. Graph DP algorithms, System Design)"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-[#DCE7F2] text-xs font-semibold text-[#11183D] focus:outline-none focus:border-[#2459A8]"
                />
                <button
                  type="button"
                  onClick={handleAddRiskFactor}
                  className="px-4 py-2 bg-[#2459A8] text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-[#1a4380]"
                >
                  Add Tag
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {riskFactors.map((rf) => (
                  <span
                    key={rf}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFFAFD] text-[#2459A8] border border-[#DCE7F2] text-xs font-bold"
                  >
                    <span>{rf}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRiskFactor(rf)}
                      className="text-[#7B8799] hover:text-rose-600 font-bold ml-1 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#11183D] mb-1.5">
                Job Description / Skills Checklist
              </label>
              <textarea
                rows={4}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste job description text here to automatically match skills and generate personalized AI practice plans..."
                className="w-full p-3 rounded-xl border border-[#DCE7F2] text-xs font-mono text-[#11183D] focus:outline-none focus:border-[#2459A8]"
              />
            </div>
          </div>

          {/* Form Controls Footer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/placement-crm')}
              className="px-5 py-2.5 rounded-xl border border-[#DCE7F2] bg-white text-xs font-bold text-[#526078] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#2459A8] hover:bg-[#1a4380] text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              <Sparkles size={16} />
              <span>Save Application & Launch AI Prep</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
