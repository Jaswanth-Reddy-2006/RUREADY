import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResumeStore, ResumeTemplateId, TEMPLATE_METADATA } from '../../store/useResumeStore';
import ResumeRenderer from '../../components/resume/templates/ResumeRenderer';
import ResumeCopilotDrawer from '../../components/resume/ResumeCopilotDrawer';
import TemplateOverviewModal from '../../components/resume/TemplateOverviewModal';
import { calculateAtsScore } from '../../utils/atsEngine';
import { 
  User, FileText, Briefcase, GraduationCap, FolderGit2, Wrench, Award, Layout, 
  Sparkles, Download, ArrowLeft, Plus, Trash2, Check, Eye, Smartphone, Monitor, Edit3
} from 'lucide-react';
import toast from 'react-hot-toast';

type SectionId = 'PERSONAL' | 'SUMMARY' | 'EXPERIENCE' | 'EDUCATION' | 'PROJECTS' | 'SKILLS' | 'CERTS' | 'TEMPLATES';

export default function ResumeBuilderPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const {
    masterResume,
    resumeVersions,
    activeTemplate,
    setTemplate,
    updatePersonalInfo,
    updateSummary,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addProject,
    updateProject,
    removeProject,
    updateSkillsCategory,
    addCertification,
    removeCertification,
    updateResumeVersion,
    createResumeVersion
  } = useResumeStore();

  const [activeSection, setActiveSection] = useState<SectionId>('PERSONAL');
  const [mobileTab, setMobileTab] = useState<'EDITOR' | 'PREVIEW'>('EDITOR');
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  // Find target version or default to master
  const currentVersion = resumeVersions.find((v) => v.id === id);
  const activeResumeData = currentVersion ? currentVersion.resumeData : masterResume;
  const currentTemplate = currentVersion ? currentVersion.templateId : activeTemplate;

  // Realtime ATS Audit for Copilot
  const currentAtsAnalysis = calculateAtsScore(activeResumeData);

  const handlePrintDownload = () => {
    window.print();
  };

  const handleSaveAsVersion = () => {
    if (currentVersion) {
      updateResumeVersion(currentVersion.id, {
        resumeData: activeResumeData,
        lastUpdated: new Date().toISOString()
      });
      toast.success('Resume version changes saved!');
    } else {
      const title = `${activeResumeData.personalInfo.fullName || 'Standard'} Resume`;
      const newId = createResumeVersion(
        title,
        activeResumeData.personalInfo.title || 'Software Engineer',
        'General Applications',
        undefined,
        activeResumeData
      );
      toast.success('Saved as new version!');
      navigate(`/resume/edit/${newId}`);
    }
  };

  const sectionsList: Array<{ id: SectionId; label: string; icon: React.ReactNode }> = [
    { id: 'PERSONAL', label: 'Personal Info', icon: <User size={16} /> },
    { id: 'SUMMARY', label: 'Executive Summary', icon: <FileText size={16} /> },
    { id: 'EXPERIENCE', label: 'Work Experience', icon: <Briefcase size={16} /> },
    { id: 'EDUCATION', label: 'Education', icon: <GraduationCap size={16} /> },
    { id: 'PROJECTS', label: 'Key Projects', icon: <FolderGit2 size={16} /> },
    { id: 'SKILLS', label: 'Technical Skills', icon: <Wrench size={16} /> },
    { id: 'CERTS', label: 'Certifications', icon: <Award size={16} /> },
    { id: 'TEMPLATES', label: 'Design Layouts', icon: <Layout size={16} /> },
  ];

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col font-sans bg-slate-100 -m-6 sm:-m-8 overflow-hidden">
      {/* Top Builder Control Bar */}
      <div className="bg-white border-b border-[#DCE7F2] px-6 py-3 flex items-center justify-between gap-4 shrink-0 shadow-2xs z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/resume')}
            className="p-2 text-[#7B8799] hover:text-[#11183D] rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            title="Back to Resume Dashboard"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h3 className="text-base font-bold font-display text-[#11183D] truncate max-w-xs sm:max-w-md">
              {currentVersion ? currentVersion.name : 'Master Candidate Resume'}
            </h3>
            <p className="text-xs text-[#526078]">
              {currentVersion ? `Target: ${currentVersion.targetRole}` : 'Master Profile Canvas'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Mobile View Toggle */}
          <div className="flex lg:hidden bg-slate-100 p-1 rounded-xl border border-[#DCE7F2] text-xs font-bold">
            <button
              onClick={() => setMobileTab('EDITOR')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                mobileTab === 'EDITOR' ? 'bg-white text-[#2459A8] shadow-2xs' : 'text-[#526078]'
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => setMobileTab('PREVIEW')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                mobileTab === 'PREVIEW' ? 'bg-white text-[#2459A8] shadow-2xs' : 'text-[#526078]'
              }`}
            >
              Preview
            </button>
          </div>

          <button
            onClick={() => setIsCopilotOpen(true)}
            className="px-3.5 py-2 bg-[#EFFAFD] hover:bg-blue-100 text-[#2459A8] border border-[#DCE7F2] rounded-xl text-xs font-bold font-display flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
          >
            <Sparkles size={14} />
            <span className="hidden sm:inline">AI Copilot</span>
          </button>

          <button
            onClick={handleSaveAsVersion}
            className="px-3.5 py-2 bg-[#2459A8] hover:bg-[#1d4787] text-white rounded-xl text-xs font-bold font-display flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
          >
            <Check size={14} />
            <span className="hidden sm:inline">Save Version</span>
          </button>

          <button
            onClick={handlePrintDownload}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold font-display flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>

      {/* Main 3-Pane Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* PANE 1: Section Navigation (Left Column) */}
        <div className={`w-64 bg-white border-r border-[#DCE7F2] p-4 flex-col justify-between shrink-0 overflow-y-auto ${
          mobileTab === 'EDITOR' ? 'hidden md:flex' : 'hidden md:flex'
        }`}>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#526078] px-3 mb-2 block">
              Resume Sections
            </span>
            {sectionsList.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold font-display flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeSection === sec.id
                    ? 'bg-[#EFFAFD] text-[#2459A8] border border-[#DCE7F2] shadow-2xs'
                    : 'text-[#526078] hover:text-[#11183D] hover:bg-slate-50'
                }`}
              >
                <span className={activeSection === sec.id ? 'text-[#2459A8]' : 'text-[#7B8799]'}>
                  {sec.icon}
                </span>
                <span>{sec.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => setIsTemplateModalOpen(true)}
              className="w-full p-3 rounded-2xl bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 text-xs text-[#2459A8] font-bold flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Layout size={15} />
                <span>Switch Template</span>
              </div>
              <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-blue-200 font-mono">
                {currentTemplate.replace('-', ' ')}
              </span>
            </button>
          </div>
        </div>

        {/* PANE 2: Form Editor (Center Column) */}
        <div className={`flex-1 bg-white p-6 overflow-y-auto ${
          mobileTab === 'EDITOR' ? 'block' : 'hidden lg:block'
        }`}>
          <div className="max-w-2xl mx-auto space-y-6">
            {/* 1. Personal Info */}
            {activeSection === 'PERSONAL' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-display text-[#11183D]">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#11183D] mb-1">Full Name</label>
                    <input
                      type="text"
                      value={activeResumeData.personalInfo.fullName}
                      onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-[#DCE7F2] rounded-xl text-xs focus:outline-none focus:border-[#2459A8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#11183D] mb-1">Professional Title</label>
                    <input
                      type="text"
                      value={activeResumeData.personalInfo.title}
                      onChange={(e) => updatePersonalInfo({ title: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-[#DCE7F2] rounded-xl text-xs focus:outline-none focus:border-[#2459A8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#11183D] mb-1">Email</label>
                    <input
                      type="email"
                      value={activeResumeData.personalInfo.email}
                      onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-[#DCE7F2] rounded-xl text-xs focus:outline-none focus:border-[#2459A8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#11183D] mb-1">Phone</label>
                    <input
                      type="text"
                      value={activeResumeData.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-[#DCE7F2] rounded-xl text-xs focus:outline-none focus:border-[#2459A8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#11183D] mb-1">Location</label>
                    <input
                      type="text"
                      value={activeResumeData.personalInfo.location}
                      onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-[#DCE7F2] rounded-xl text-xs focus:outline-none focus:border-[#2459A8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#11183D] mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      value={activeResumeData.personalInfo.linkedin}
                      onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-[#DCE7F2] rounded-xl text-xs focus:outline-none focus:border-[#2459A8]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. Executive Summary */}
            {activeSection === 'SUMMARY' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-display text-[#11183D]">Executive Summary</h3>
                  <button
                    onClick={() => setIsCopilotOpen(true)}
                    className="text-xs font-bold text-[#2459A8] flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles size={13} />
                    <span>AI Rewrite Assistant</span>
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={activeResumeData.summary}
                  onChange={(e) => updateSummary(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-[#DCE7F2] rounded-2xl text-xs text-[#11183D] focus:outline-none focus:border-[#2459A8]"
                  placeholder="Provide a concise 3-4 sentence professional summary highlighting your key technical strengths, engineering achievements, and scale."
                />
              </div>
            )}

            {/* 3. Work Experience */}
            {activeSection === 'EXPERIENCE' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-display text-[#11183D]">Work Experience</h3>
                  <button
                    onClick={() =>
                      addExperience({
                        title: 'Software Engineer',
                        company: 'New Company',
                        location: 'City, State',
                        startDate: '2023-01',
                        endDate: 'Present',
                        current: true,
                        bullets: ['Designed high-throughput APIs handling daily user volume.']
                      })
                    }
                    className="px-3 py-1.5 bg-[#EFFAFD] border border-[#DCE7F2] text-[#2459A8] rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Position</span>
                  </button>
                </div>

                {activeResumeData.experience.map((exp, idx) => (
                  <div key={exp.id} className="p-4 bg-slate-50 rounded-2xl border border-[#DCE7F2] space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold font-mono text-[#2459A8]"># {idx + 1} Position</span>
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="text-rose-600 hover:text-rose-800 text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Job Title"
                        value={exp.title}
                        onChange={(e) => updateExperience(exp.id, { title: e.target.value })}
                        className="p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                        className="p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-[#11183D]">STAR Bullets</label>
                      {exp.bullets.map((b, bIdx) => (
                        <div key={bIdx} className="flex gap-2">
                          <input
                            type="text"
                            value={b}
                            onChange={(e) => {
                              const newBullets = [...exp.bullets];
                              newBullets[bIdx] = e.target.value;
                              updateExperience(exp.id, { bullets: newBullets });
                            }}
                            className="flex-1 p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. Technical Skills */}
            {activeSection === 'SKILLS' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-display text-[#11183D]">Technical Skills</h3>

                {(['languages', 'frameworks', 'databases', 'cloudDevOps', 'tools'] as const).map((cat) => (
                  <div key={cat} className="p-4 bg-slate-50 rounded-2xl border border-[#DCE7F2] space-y-2">
                    <label className="block text-xs font-bold text-[#11183D] capitalize">
                      {cat.replace(/([AZ])/g, ' $1')}
                    </label>
                    <input
                      type="text"
                      value={activeResumeData.skills[cat].join(', ')}
                      onChange={(e) =>
                        updateSkillsCategory(
                          cat,
                          e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                        )
                      }
                      className="w-full p-2.5 bg-white border border-[#DCE7F2] rounded-xl text-xs text-[#11183D]"
                      placeholder="Comma-separated skills (e.g. TypeScript, React, Node.js)"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Default fallback for other sections */}
            {['EDUCATION', 'PROJECTS', 'CERTS', 'TEMPLATES'].includes(activeSection) && (
              <div className="p-8 text-center bg-slate-50 border border-[#DCE7F2] rounded-2xl text-xs text-[#526078] space-y-2">
                <p className="font-bold text-[#11183D]">Configuring {activeSection} Section</p>
                <p>Edit fields or use templates tab to switch visualization engines.</p>
              </div>
            )}
          </div>
        </div>

        {/* PANE 3: Live Preview (Right Column) */}
        <div className={`w-full lg:w-[50%] bg-slate-200 border-l border-[#DCE7F2] p-6 overflow-y-auto ${
          mobileTab === 'PREVIEW' ? 'block' : 'hidden lg:block'
        }`}>
          <div className="max-w-[800px] mx-auto bg-white shadow-xl rounded-xl overflow-hidden border border-slate-300">
            <ResumeRenderer templateId={currentTemplate} data={activeResumeData} />
          </div>
        </div>
      </div>

      {/* Copilot Drawer */}
      <ResumeCopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        bulletsAudit={currentAtsAnalysis.bulletsAudit}
      />

      {/* Template Selection Modal */}
      <TemplateOverviewModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        template={TEMPLATE_METADATA.find(t => t.id === currentTemplate) || TEMPLATE_METADATA[0]}
        onSelect={(templateId: ResumeTemplateId) => {
          setTemplate(templateId);
          setIsTemplateModalOpen(false);
          toast.success(`Switched to template layout: ${templateId}`);
        }}
        isSelected={true}
      />
    </div>
  );
}
