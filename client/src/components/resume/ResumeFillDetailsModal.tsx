import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Save, Sparkles, User, Briefcase, GraduationCap, Code, 
  Plus, Trash2, CheckCircle2, RotateCcw, Link2, 
  MapPin, Mail, Phone, Globe, Github, Linkedin, Award, FileText
} from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { useProfileStore } from '../../store/useProfileStore';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import toast from 'react-hot-toast';

interface ResumeFillDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'contact' | 'summary' | 'experience' | 'education' | 'projects' | 'skills';

export default function ResumeFillDetailsModal({ isOpen, onClose }: ResumeFillDetailsModalProps) {
  const { 
    masterResume, 
    updatePersonalInfo, 
    updateSummary,
    addExperience,
    updateExperience,
    removeExperience,
    addExperienceBullet,
    updateExperienceBullet,
    removeExperienceBullet,
    addEducation,
    updateEducation,
    removeEducation,
    addProject,
    updateProject,
    removeProject,
    addProjectBullet,
    updateProjectBullet,
    removeProjectBullet,
    updateSkillsCategory,
    addCertification,
    removeCertification,
    syncFromProfile
  } = useResumeStore();

  const { profile } = useProfileStore();

  const [activeTab, setActiveTab] = useState<TabType>('contact');

  // Local draft state for quick skill additions
  const [newSkillTag, setNewSkillTag] = useState('');
  const [skillCategoryToAdd, setSkillCategoryToAdd] = useState<'languages' | 'frameworks' | 'databases' | 'cloudDevOps' | 'tools'>('languages');

  // Certification input draft
  const [newCertTitle, setNewCertTitle] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');
  const [newCertDate, setNewCertDate] = useState('');

  if (!isOpen) return null;

  // Calculate completion percentage
  const calcCompletion = () => {
    let score = 0;
    if (masterResume.personalInfo.fullName && masterResume.personalInfo.email) score += 20;
    if (masterResume.summary && masterResume.summary.length > 30) score += 20;
    if (masterResume.experience.length > 0) score += 20;
    if (masterResume.education.length > 0) score += 15;
    if (masterResume.projects.length > 0) score += 15;
    const totalSkills = Object.values(masterResume.skills).flat().length;
    if (totalSkills >= 5) score += 10;
    return Math.min(100, score);
  };

  const completionScore = calcCompletion();

  const handleSyncProfile = () => {
    syncFromProfile(profile);
    toast.success('Synced details from Candidate Profile!');
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillTag.trim()) return;
    const currentList = masterResume.skills[skillCategoryToAdd];
    if (!currentList.includes(newSkillTag.trim())) {
      updateSkillsCategory(skillCategoryToAdd, [...currentList, newSkillTag.trim()]);
      toast.success(`Added "${newSkillTag.trim()}" to ${skillCategoryToAdd}`);
    }
    setNewSkillTag('');
  };

  const handleRemoveSkill = (category: keyof typeof masterResume.skills, skill: string) => {
    const updated = masterResume.skills[category].filter(s => s !== skill);
    updateSkillsCategory(category, updated);
  };

  const handleAddCertification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertTitle.trim() || !newCertIssuer.trim()) {
      toast.error('Title and Issuer required for certification');
      return;
    }
    addCertification({
      title: newCertTitle.trim(),
      issuer: newCertIssuer.trim(),
      date: newCertDate.trim() || '2024'
    });
    setNewCertTitle('');
    setNewCertIssuer('');
    setNewCertDate('');
    toast.success('Added certification');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="w-full max-w-4xl bg-white border border-[#DCE7F2] rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-[#11183D]"
      >
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#DCE7F2] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#EFFAFD]/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-[#F8EAF4] text-[#A0006D]">
                <FileText size={18} />
              </span>
              <h2 className="text-xl font-extrabold font-display text-[#11183D]">
                Master Resume & Profile Data
              </h2>
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                completionScore >= 80 ? 'bg-[#E8F5F0] text-[#168A62]' : 'bg-[#EFFAFD] text-[#4A8BDF]'
              }`}>
                {completionScore}% Complete
              </span>
            </div>
            <p className="text-xs text-[#526078] mt-1 font-body">
              Fill your details once. Automatically builds your resumes across all templates and powers ATS keyword scoring.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSyncProfile}
              icon={<RotateCcw size={13} />}
              className="bg-white text-xs"
            >
              Sync from Profile
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#7B8799] hover:bg-gray-100 hover:text-[#11183D] transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-[#DCE7F2] bg-white flex items-center gap-1 overflow-x-auto py-2 text-xs font-bold font-display">
          {[
            { id: 'contact', label: '1. Personal & Contact', icon: User },
            { id: 'summary', label: '2. Summary', icon: Sparkles },
            { id: 'experience', label: '3. Experience', icon: Briefcase },
            { id: 'projects', label: '4. Projects', icon: Code },
            { id: 'skills', label: '5. Skills & Certs', icon: Award },
            { id: 'education', label: '6. Education', icon: GraduationCap },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                  active
                    ? 'bg-[#2459A8] text-white shadow-xs'
                    : 'text-[#526078] hover:bg-[#EFFAFD] hover:text-[#11183D]'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-6">
          
          {/* TAB 1: PERSONAL & CONTACT */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  value={masterResume.personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  icon={<User className="h-4 w-4" />}
                />
                <Input
                  label="Professional Title *"
                  value={masterResume.personalInfo.title}
                  onChange={(e) => updatePersonalInfo({ title: e.target.value })}
                  placeholder="e.g. Senior Full Stack Engineer"
                  icon={<Briefcase className="h-4 w-4" />}
                />
                <Input
                  label="Email Address *"
                  type="email"
                  value={masterResume.personalInfo.email}
                  onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                  placeholder="name@domain.com"
                  icon={<Mail className="h-4 w-4" />}
                />
                <Input
                  label="Phone Number *"
                  value={masterResume.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  icon={<Phone className="h-4 w-4" />}
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Location (City, State/Country) *"
                    value={masterResume.personalInfo.location}
                    onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                    placeholder="e.g. San Francisco, CA / Remote"
                    icon={<MapPin className="h-4 w-4" />}
                  />
                </div>
                <Input
                  label="LinkedIn URL"
                  value={masterResume.personalInfo.linkedin}
                  onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                  icon={<Linkedin className="h-4 w-4" />}
                />
                <Input
                  label="GitHub URL"
                  value={masterResume.personalInfo.github}
                  onChange={(e) => updatePersonalInfo({ github: e.target.value })}
                  placeholder="https://github.com/username"
                  icon={<Github className="h-4 w-4" />}
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Portfolio / Website URL"
                    value={masterResume.personalInfo.portfolio}
                    onChange={(e) => updatePersonalInfo({ portfolio: e.target.value })}
                    placeholder="https://yourportfolio.com"
                    icon={<Globe className="h-4 w-4" />}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXECUTIVE SUMMARY */}
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display">
                    Executive Summary / Professional Bio
                  </label>
                  <p className="text-[11px] text-[#526078] mt-0.5">
                    Recommended length: 40–80 words. Highlight your specialization, scale, and domain results.
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    updateSummary(
                      'Architecturally driven Senior Full Stack Engineer with 4+ years of expertise designing high-throughput distributed microservices, scalable React/TypeScript web apps, and low-latency PostgreSQL/Redis caching tiers. Proven track record scaling applications to 250,000+ daily active users with 99.95% uptime.'
                    );
                    toast.success('Inserted optimized engineering summary template!');
                  }}
                  icon={<Sparkles size={13} className="text-[#A0006D]" />}
                  className="text-xs"
                >
                  Generate Strong Draft
                </Button>
              </div>

              <textarea
                rows={6}
                value={masterResume.summary}
                onChange={(e) => updateSummary(e.target.value)}
                placeholder="Write your high-impact executive summary..."
                className="w-full p-4 text-xs font-body bg-[#EFFAFD]/40 border border-[#DCE7F2] rounded-2xl text-[#11183D] focus:outline-none focus:border-[#4A8BDF] leading-relaxed"
              />

              <div className="flex justify-between text-[11px] text-[#526078] font-mono">
                <span>Word count: {masterResume.summary.trim().split(/\s+/).filter(Boolean).length} words</span>
                <span>Characters: {masterResume.summary.length}</span>
              </div>
            </div>
          )}

          {/* TAB 3: EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold font-display text-[#11183D]">Work History & Impact</h3>
                  <p className="text-[11px] text-[#526078]">Use STAR methodology (Situation, Task, Action, Result) with numbers & metrics.</p>
                </div>
                <Button
                  variant="royal"
                  size="sm"
                  onClick={() => {
                    addExperience({
                      title: 'Software Engineer',
                      company: 'New Company Inc',
                      location: 'Remote',
                      startDate: '2023-01',
                      endDate: 'Present',
                      current: true,
                      bullets: [
                        'Architected high-throughput microservice handling 50k+ daily transactions with 99.9% uptime.',
                        'Engineered modular React & TypeScript UI components reducing page load time by 30%.'
                      ]
                    });
                    toast.success('Added new role');
                  }}
                  icon={<Plus size={14} />}
                >
                  Add Role
                </Button>
              </div>

              <div className="space-y-6">
                {masterResume.experience.map((exp, expIdx) => (
                  <Card key={exp.id} className="p-5 border-[#DCE7F2] bg-white rounded-2xl space-y-4 shadow-xs">
                    <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-3">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#2459A8] font-mono">
                        Role #{expIdx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeExperience(exp.id)}
                        className="text-[#A0006D] hover:bg-[#F8EAF4] p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Delete Role"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-[#526078] block mb-1">Job Title</label>
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => updateExperience(exp.id, { title: e.target.value })}
                          className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-3 py-1.5 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#526078] block mb-1">Company Name</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                          className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-3 py-1.5 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#526078] block mb-1">Location</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                          className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-3 py-1.5 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-[#526078] block mb-1">Start Date</label>
                          <input
                            type="text"
                            placeholder="YYYY-MM"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                            className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-2 py-1.5 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-[#526078] block mb-1">End Date</label>
                          <input
                            type="text"
                            disabled={exp.current}
                            placeholder={exp.current ? 'Present' : 'YYYY-MM'}
                            value={exp.current ? 'Present' : exp.endDate}
                            onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                            className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-2 py-1.5 text-xs text-[#11183D] disabled:opacity-60 focus:outline-none focus:border-[#4A8BDF]"
                          />
                        </div>
                      </div>
                    </div>

                    <label className="flex items-center gap-2 text-xs font-semibold text-[#11183D] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => updateExperience(exp.id, { current: e.target.checked, endDate: e.target.checked ? 'Present' : '' })}
                        className="rounded text-[#2459A8]"
                      />
                      <span>I currently work in this role</span>
                    </label>

                    {/* Bullet Points */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#11183D]">
                          STAR Impact Bullets
                        </label>
                        <button
                          type="button"
                          onClick={() => addExperienceBullet(exp.id, 'Spearheaded implementation of core feature improving throughput by 25%.')}
                          className="text-[11px] text-[#2459A8] hover:underline flex items-center gap-1 font-bold cursor-pointer"
                        >
                          <Plus size={12} /> Add Bullet
                        </button>
                      </div>

                      {exp.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2">
                          <span className="text-[#2459A8] font-bold mt-1.5">•</span>
                          <textarea
                            rows={2}
                            value={bullet}
                            onChange={(e) => updateExperienceBullet(exp.id, bIdx, e.target.value)}
                            className="flex-1 p-2 text-xs bg-[#EFFAFD]/20 border border-[#DCE7F2] rounded-xl text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                          />
                          <button
                            type="button"
                            onClick={() => removeExperienceBullet(exp.id, bIdx)}
                            className="text-[#7B8799] hover:text-[#A0006D] p-1.5 mt-1 transition-colors cursor-pointer"
                            title="Remove Bullet"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold font-display text-[#11183D]">Engineering Projects</h3>
                  <p className="text-[11px] text-[#526078]">Showcase production systems, open-source repos, or standout architectures.</p>
                </div>
                <Button
                  variant="royal"
                  size="sm"
                  onClick={() => {
                    addProject({
                      name: 'CloudSync Distributed File System',
                      description: 'Distributed synchronization engine with Paxos consensus.',
                      techStack: ['Go', 'Docker', 'gRPC'],
                      liveUrl: 'https://cloudsync.io',
                      repoUrl: 'https://github.com/user/cloudsync',
                      bullets: [
                        'Designed Raft replication protocol handling 10,000 IOPS with sub-10ms synchronization latency.'
                      ]
                    });
                    toast.success('Added new project');
                  }}
                  icon={<Plus size={14} />}
                >
                  Add Project
                </Button>
              </div>

              <div className="space-y-6">
                {masterResume.projects.map((proj, pIdx) => (
                  <Card key={proj.id} className="p-5 border-[#DCE7F2] bg-white rounded-2xl space-y-4 shadow-xs">
                    <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-3">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#2459A8] font-mono">
                        Project #{pIdx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeProject(proj.id)}
                        className="text-[#A0006D] hover:bg-[#F8EAF4] p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-[#526078] block mb-1">Project Name</label>
                        <input
                          type="text"
                          value={proj.name}
                          onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                          className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-3 py-1.5 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#526078] block mb-1">Tech Stack (comma-separated)</label>
                        <input
                          type="text"
                          value={proj.techStack.join(', ')}
                          onChange={(e) => updateProject(proj.id, { techStack: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                          className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-3 py-1.5 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#526078] block mb-1">GitHub / Code URL</label>
                        <input
                          type="text"
                          value={proj.repoUrl || ''}
                          onChange={(e) => updateProject(proj.id, { repoUrl: e.target.value })}
                          className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-3 py-1.5 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#526078] block mb-1">Live Demo URL</label>
                        <input
                          type="text"
                          value={proj.liveUrl || ''}
                          onChange={(e) => updateProject(proj.id, { liveUrl: e.target.value })}
                          className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-3 py-1.5 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-bold text-[#526078] block mb-1">Short Description</label>
                        <input
                          type="text"
                          value={proj.description}
                          onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                          className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-3 py-1.5 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                        />
                      </div>
                    </div>

                    {/* Project Bullets */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#11183D]">
                          Project Key Outcomes
                        </label>
                        <button
                          type="button"
                          onClick={() => addProjectBullet(proj.id, 'Architected core algorithm reducing compute overhead by 40%.')}
                          className="text-[11px] text-[#2459A8] hover:underline flex items-center gap-1 font-bold cursor-pointer"
                        >
                          <Plus size={12} /> Add Outcome
                        </button>
                      </div>

                      {proj.bullets.map((b, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2">
                          <span className="text-[#2459A8] font-bold">•</span>
                          <input
                            type="text"
                            value={b}
                            onChange={(e) => updateProjectBullet(proj.id, bIdx, e.target.value)}
                            className="flex-1 px-3 py-1.5 text-xs bg-[#EFFAFD]/20 border border-[#DCE7F2] rounded-xl text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                          />
                          <button
                            type="button"
                            onClick={() => removeProjectBullet(proj.id, bIdx)}
                            className="text-[#7B8799] hover:text-[#A0006D] p-1.5 transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SKILLS & CERTIFICATIONS */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              
              {/* Quick Add Form */}
              <form onSubmit={handleAddSkill} className="p-4 rounded-2xl bg-[#EFFAFD]/60 border border-[#DCE7F2] flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-[200px]">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#526078] block mb-1">
                    Add New Technical Skill
                  </label>
                  <input
                    type="text"
                    value={newSkillTag}
                    onChange={(e) => setNewSkillTag(e.target.value)}
                    placeholder="e.g. Kubernetes, Rust, GraphQL"
                    className="w-full bg-white border border-[#DCE7F2] rounded-xl px-3 py-1.5 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#526078] block mb-1">
                    Category
                  </label>
                  <select
                    value={skillCategoryToAdd}
                    onChange={(e) => setSkillCategoryToAdd(e.target.value as any)}
                    className="bg-white border border-[#DCE7F2] rounded-xl px-3 py-1.5 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                  >
                    <option value="languages">Languages</option>
                    <option value="frameworks">Frameworks</option>
                    <option value="databases">Databases & Caching</option>
                    <option value="cloudDevOps">Cloud & DevOps</option>
                    <option value="tools">Tools & Architecture</option>
                  </select>
                </div>

                <div className="pt-4">
                  <Button type="submit" variant="royal" size="sm" icon={<Plus size={13} />}>
                    Add Skill
                  </Button>
                </div>
              </form>

              {/* Categorized Display */}
              {(['languages', 'frameworks', 'databases', 'cloudDevOps', 'tools'] as const).map((cat) => (
                <div key={cat} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display capitalize">
                      {cat === 'cloudDevOps' ? 'Cloud & DevOps' : cat} ({masterResume.skills[cat].length})
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-white border border-[#DCE7F2]">
                    {masterResume.skills[cat].map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EFFAFD] text-[#2459A8] text-xs font-mono font-medium border border-[#DCE7F2]"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(cat, skill)}
                          className="text-[#7B8799] hover:text-[#A0006D] transition-colors cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    {masterResume.skills[cat].length === 0 && (
                      <span className="text-xs text-[#7B8799] italic">No skills listed in this category yet.</span>
                    )}
                  </div>
                </div>
              ))}

              {/* Certifications Section */}
              <div className="pt-4 border-t border-[#DCE7F2] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#11183D] font-display">
                      Accreditations & Certifications
                    </h4>
                    <p className="text-[11px] text-[#526078]">AWS, GCP, CKA, or specialized technical degrees.</p>
                  </div>
                </div>

                <form onSubmit={handleAddCertification} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Certification Title (e.g. AWS Solutions Architect)"
                      value={newCertTitle}
                      onChange={(e) => setNewCertTitle(e.target.value)}
                      className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-3 py-1.5 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Issuer (e.g. Amazon)"
                      value={newCertIssuer}
                      onChange={(e) => setNewCertIssuer(e.target.value)}
                      className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-3 py-1.5 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Date (YYYY)"
                      value={newCertDate}
                      onChange={(e) => setNewCertDate(e.target.value)}
                      className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-3 py-1.5 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                    />
                    <Button type="submit" variant="secondary" size="sm" icon={<Plus size={13} />}>
                      Add
                    </Button>
                  </div>
                </form>

                <div className="space-y-2">
                  {masterResume.certifications.map((cert) => (
                    <div key={cert.id} className="flex items-center justify-between p-3 rounded-xl bg-[#EFFAFD]/30 border border-[#DCE7F2]">
                      <div>
                        <strong className="text-xs font-bold text-[#11183D]">{cert.title}</strong>
                        <span className="text-xs text-[#526078] ml-2">— {cert.issuer} ({cert.date})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCertification(cert.id)}
                        className="text-[#7B8799] hover:text-[#A0006D] p-1 transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          )}

          {/* TAB 6: EDUCATION */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold font-display text-[#11183D]">Educational Background</h3>
                  <p className="text-[11px] text-[#526078]">Collegiate degrees, graduation honors, and academic distinctions.</p>
                </div>
                <Button
                  variant="royal"
                  size="sm"
                  onClick={() => {
                    addEducation({
                      degree: 'B.S. in Computer Science',
                      school: 'State University',
                      location: 'City, Country',
                      startDate: '2019',
                      endDate: '2023',
                      gpa: '3.8',
                      highlights: 'Dean List, Distributed Systems & Cloud Computing'
                    });
                    toast.success('Added education entry');
                  }}
                  icon={<Plus size={14} />}
                >
                  Add Degree
                </Button>
              </div>

              <div className="space-y-4">
                {masterResume.education.map((edu, idx) => (
                  <Card key={edu.id} className="p-5 border-[#DCE7F2] bg-white rounded-2xl space-y-3 shadow-xs">
                    <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-3">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#2459A8] font-mono">
                        Degree #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeEducation(edu.id)}
                        className="text-[#A0006D] hover:bg-[#F8EAF4] p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Delete Degree"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-[#526078] block mb-1">Degree & Major</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                          className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-3 py-1.5 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#526078] block mb-1">School / University</label>
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                          className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-3 py-1.5 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#526078] block mb-1">Location</label>
                        <input
                          type="text"
                          value={edu.location}
                          onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                          className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-3 py-1.5 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-[#526078] block mb-1">Start Year</label>
                          <input
                            type="text"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                            className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-2 py-1.5 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-[#526078] block mb-1">Grad Year</label>
                          <input
                            type="text"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                            className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-2 py-1.5 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#526078] block mb-1">GPA / Honors (Optional)</label>
                        <input
                          type="text"
                          value={edu.gpa || ''}
                          onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                          placeholder="e.g. 3.8 / 4.0"
                          className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-3 py-1.5 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#526078] block mb-1">Highlights / Coursework</label>
                        <input
                          type="text"
                          value={edu.highlights || ''}
                          onChange={(e) => updateEducation(edu.id, { highlights: e.target.value })}
                          placeholder="e.g. Distinctions, Relevant coursework"
                          className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-3 py-1.5 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#DCE7F2] bg-[#EFFAFD]/40 flex items-center justify-between">
          <span className="text-xs text-[#526078]">
            Changes persist automatically in local master store.
          </span>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="royal"
              size="md"
              onClick={() => {
                toast.success('Master Resume details saved!');
                onClose();
              }}
              icon={<Save size={15} />}
            >
              Save & Apply to Templates
            </Button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
