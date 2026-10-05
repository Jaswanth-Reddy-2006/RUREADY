import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResumeStore, ResumeTemplateId, TEMPLATE_METADATA } from '../../store/useResumeStore';
import ResumeRenderer from '../../components/resume/templates/ResumeRenderer';
import ResumeCopilotDrawer from '../../components/resume/ResumeCopilotDrawer';
import TemplateOverviewModal from '../../components/resume/TemplateOverviewModal';
import { calculateAtsScore, normalizeResumeData, ResumeData } from '../../utils/atsEngine';
import { 
  User, FileText, Briefcase, GraduationCap, FolderGit2, Wrench, Award, Layout, 
  Sparkles, Download, ArrowLeft, Plus, Trash2, Check, ShieldCheck, ExternalLink
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
  const currentVersion = id ? resumeVersions.find((v) => v.id === id) : null;

  // Render proper error state if specified version ID is missing
  if (id && !currentVersion) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-8 text-center space-y-4 font-sans bg-slate-50">
        <div className="p-4 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 shadow-2xs">
          <FileText size={36} />
        </div>
        <h2 className="text-xl font-bold font-display text-[#11183D]">Resume version not found</h2>
        <p className="text-xs text-[#526078] max-w-sm">
          The requested resume version does not exist or may have been deleted.
        </p>
        <button
          onClick={() => navigate('/resume')}
          className="px-5 py-2.5 bg-[#2459A8] hover:bg-[#1d4787] text-white rounded-xl text-xs font-bold font-display flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
        >
          <ArrowLeft size={15} />
          <span>Back to Resume Dashboard</span>
        </button>
      </div>
    );
  }

  const rawResumeData = currentVersion ? currentVersion.resumeData : masterResume;
  const activeResumeData = normalizeResumeData(rawResumeData);
  const currentTemplate = currentVersion ? currentVersion.templateId : activeTemplate;

  const hasTargetJd = Boolean(currentVersion?.targetJd && currentVersion.targetJd.trim().length > 0);

  // Realtime ATS Audit for Copilot & Diagnostics
  const currentAtsAnalysis = useMemo(() => {
    const jd = currentVersion?.targetJd || '';
    const role = currentVersion?.targetRole || '';
    return calculateAtsScore(activeResumeData, jd, role);
  }, [activeResumeData, currentVersion?.targetJd, currentVersion?.targetRole]);

  // Version-aware updaters
  const handleUpdatePersonalInfo = (info: Partial<ResumeData['personalInfo']>) => {
    if (currentVersion) {
      updateResumeVersion(currentVersion.id, {
        resumeData: {
          ...activeResumeData,
          personalInfo: { ...activeResumeData.personalInfo, ...info }
        }
      });
    } else {
      updatePersonalInfo(info);
    }
  };

  const handleUpdateSummary = (summary: string) => {
    if (currentVersion) {
      updateResumeVersion(currentVersion.id, {
        resumeData: { ...activeResumeData, summary }
      });
    } else {
      updateSummary(summary);
    }
  };

  const handleAddExperience = (exp: Omit<ResumeData['experience'][0], 'id'>) => {
    const newExp = { ...exp, id: `exp-${Date.now()}` };
    if (currentVersion) {
      updateResumeVersion(currentVersion.id, {
        resumeData: {
          ...activeResumeData,
          experience: [newExp, ...(activeResumeData.experience || [])]
        }
      });
    } else {
      addExperience(exp);
    }
  };

  const handleUpdateExperience = (expId: string, updates: Partial<ResumeData['experience'][0]>) => {
    if (currentVersion) {
      updateResumeVersion(currentVersion.id, {
        resumeData: {
          ...activeResumeData,
          experience: (activeResumeData.experience || []).map((e) => (e.id === expId ? { ...e, ...updates } : e))
        }
      });
    } else {
      updateExperience(expId, updates);
    }
  };

  const handleRemoveExperience = (expId: string) => {
    if (currentVersion) {
      updateResumeVersion(currentVersion.id, {
        resumeData: {
          ...activeResumeData,
          experience: (activeResumeData.experience || []).filter((e) => e.id !== expId)
        }
      });
    } else {
      removeExperience(expId);
    }
  };

  const handleAddEducation = (edu: Omit<ResumeData['education'][0], 'id'>) => {
    const newEdu = { ...edu, id: `edu-${Date.now()}` };
    if (currentVersion) {
      updateResumeVersion(currentVersion.id, {
        resumeData: {
          ...activeResumeData,
          education: [newEdu, ...(activeResumeData.education || [])]
        }
      });
    } else {
      addEducation(edu);
    }
  };

  const handleUpdateEducation = (eduId: string, updates: Partial<ResumeData['education'][0]>) => {
    if (currentVersion) {
      updateResumeVersion(currentVersion.id, {
        resumeData: {
          ...activeResumeData,
          education: (activeResumeData.education || []).map((e) => (e.id === eduId ? { ...e, ...updates } : e))
        }
      });
    } else {
      updateEducation(eduId, updates);
    }
  };

  const handleRemoveEducation = (eduId: string) => {
    if (currentVersion) {
      updateResumeVersion(currentVersion.id, {
        resumeData: {
          ...activeResumeData,
          education: (activeResumeData.education || []).filter((e) => e.id !== eduId)
        }
      });
    } else {
      removeEducation(eduId);
    }
  };

  const handleAddProject = (proj: Omit<ResumeData['projects'][0], 'id'>) => {
    const newProj = { ...proj, id: `proj-${Date.now()}` };
    if (currentVersion) {
      updateResumeVersion(currentVersion.id, {
        resumeData: {
          ...activeResumeData,
          projects: [newProj, ...(activeResumeData.projects || [])]
        }
      });
    } else {
      addProject(proj);
    }
  };

  const handleUpdateProject = (projId: string, updates: Partial<ResumeData['projects'][0]>) => {
    if (currentVersion) {
      updateResumeVersion(currentVersion.id, {
        resumeData: {
          ...activeResumeData,
          projects: (activeResumeData.projects || []).map((p) => (p.id === projId ? { ...p, ...updates } : p))
        }
      });
    } else {
      updateProject(projId, updates);
    }
  };

  const handleRemoveProject = (projId: string) => {
    if (currentVersion) {
      updateResumeVersion(currentVersion.id, {
        resumeData: {
          ...activeResumeData,
          projects: (activeResumeData.projects || []).filter((p) => p.id !== projId)
        }
      });
    } else {
      removeProject(projId);
    }
  };

  const handleUpdateSkillsCategory = (cat: keyof ResumeData['skills'], skills: string[]) => {
    if (currentVersion) {
      updateResumeVersion(currentVersion.id, {
        resumeData: {
          ...activeResumeData,
          skills: {
            ...activeResumeData.skills,
            [cat]: skills
          }
        }
      });
    } else {
      updateSkillsCategory(cat, skills);
    }
  };

  const handleAddCertification = (cert: Omit<ResumeData['certifications'][0], 'id'>) => {
    const newCert = { ...cert, id: `cert-${Date.now()}` };
    if (currentVersion) {
      updateResumeVersion(currentVersion.id, {
        resumeData: {
          ...activeResumeData,
          certifications: [newCert, ...(activeResumeData.certifications || [])]
        }
      });
    } else {
      addCertification(cert);
    }
  };

  const handleRemoveCertification = (certId: string) => {
    if (currentVersion) {
      updateResumeVersion(currentVersion.id, {
        resumeData: {
          ...activeResumeData,
          certifications: (activeResumeData.certifications || []).filter((c) => c.id !== certId)
        }
      });
    } else {
      removeCertification(certId);
    }
  };

  const handleSelectTemplate = (templateId: ResumeTemplateId) => {
    if (currentVersion) {
      updateResumeVersion(currentVersion.id, { templateId });
    } else {
      setTemplate(templateId);
    }
    setIsTemplateModalOpen(false);
    toast.success(`Switched to template layout: ${templateId}`);
  };

  const handlePrintDownload = () => {
    window.print();
  };

  const handleSaveAsVersion = () => {
    if (currentVersion) {
      updateResumeVersion(currentVersion.id, {
        resumeData: activeResumeData,
        atsScore: currentAtsAnalysis.totalScore,
        atsAnalysis: currentAtsAnalysis,
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
    <div className="flex flex-col h-full min-h-[calc(100vh-4rem)] font-sans bg-slate-100 overflow-hidden">
      {/* Top Builder Control Bar */}
      <header className="bg-white border-b border-[#DCE7F2] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-2xs z-20 sticky top-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate('/resume')}
            className="p-2 text-[#7B8799] hover:text-[#11183D] rounded-xl hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            title="Back to Resume Dashboard"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-bold font-display text-[#11183D] truncate max-w-[200px] sm:max-w-xs md:max-w-md">
              {currentVersion ? currentVersion.name : 'Master Candidate Resume'}
            </h3>
            <p className="text-[11px] sm:text-xs text-[#526078] truncate">
              {currentVersion ? `Target: ${currentVersion.targetRole} (${currentVersion.targetCompany || 'General'})` : 'Master Profile Canvas'}
            </p>
          </div>

          {/* Top ATS Score Badge */}
          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-[#DCE7F2]">
            <div className="flex items-center gap-1.5 bg-[#EFFAFD] px-2.5 py-1 rounded-xl border border-[#DCE7F2]">
              <ShieldCheck size={14} className="text-[#2459A8]" />
              <span className="text-xs font-bold font-mono text-[#11183D]">
                ATS: {currentAtsAnalysis.totalScore}%
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  currentAtsAnalysis.totalScore >= 80
                    ? 'bg-emerald-100 text-emerald-800'
                    : currentAtsAnalysis.totalScore >= 65
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {currentAtsAnalysis.grade}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
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
            onClick={() => navigate(`/resume/analyze?versionId=${currentVersion?.id || 'master'}`)}
            className="px-3 py-2 bg-white hover:bg-slate-50 text-[#2459A8] border border-[#DCE7F2] rounded-xl text-xs font-bold font-display flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            title="Open comprehensive ATS gap report"
          >
            <ShieldCheck size={14} />
            <span className="hidden sm:inline">ATS Scan</span>
          </button>

          <button
            onClick={() => setIsCopilotOpen(true)}
            className="px-3 py-2 bg-[#EFFAFD] hover:bg-blue-100 text-[#2459A8] border border-[#DCE7F2] rounded-xl text-xs font-bold font-display flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
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
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold font-display flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </header>

      {/* Main 3-Pane Body */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* PANE 1: Section Navigation (Left Column) */}
        <div className={`w-56 lg:w-60 bg-white border-r border-[#DCE7F2] p-4 flex flex-col justify-between shrink-0 overflow-y-auto ${
          mobileTab === 'EDITOR' ? 'hidden md:flex' : 'hidden md:flex'
        }`}>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#526078] px-3 mb-2 block font-mono">
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

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={() => setIsTemplateModalOpen(true)}
              className="w-full p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-xs text-[#2459A8] font-bold flex items-center justify-between group cursor-pointer"
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
        <div className={`flex-1 min-w-0 bg-white p-4 sm:p-6 lg:p-7 overflow-y-auto ${
          mobileTab === 'EDITOR' ? 'block' : 'hidden lg:block'
        }`}>
          <div className="max-w-3xl mx-auto space-y-6 w-full">

            {/* REFINED ATS COMPATIBILITY DIAGNOSTIC PANEL */}
            <div className="rounded-2xl bg-slate-50 border border-[#DCE7F2] p-4 sm:p-5 space-y-4 shadow-2xs">
              
              {/* Header Row: Title on Left, Score on Right */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#DCE7F2]">
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2459A8] font-mono">
                      ATS Compatibility
                    </span>
                    {hasTargetJd && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                        Target JD Linked
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-[#11183D] font-display">
                    Resume ATS Readiness & Diagnostics
                  </h4>
                  <p className="text-xs text-[#526078]">
                    Your current resume ATS compatibility score and section audit
                  </p>
                </div>

                {/* Score & Grade Display */}
                <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                  <div className="bg-white px-4 py-2 rounded-xl border border-[#DCE7F2] flex items-center gap-2.5 shadow-2xs">
                    <span className="text-2xl font-black font-mono text-[#11183D]">
                      {currentAtsAnalysis.totalScore}
                      <span className="text-xs text-[#526078] font-normal"> / 100</span>
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                        currentAtsAnalysis.totalScore >= 80
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : currentAtsAnalysis.totalScore >= 65
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {currentAtsAnalysis.grade}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Link Row */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-[#526078] font-medium">
                  {hasTargetJd
                    ? `Benchmarked against ${currentAtsAnalysis.matchedKeywords.length + currentAtsAnalysis.missingKeywords.length} target job requirements`
                    : `Evaluated for ${currentAtsAnalysis.detectedDomain || 'Professional'} domain competencies`}
                </span>
                <button
                  onClick={() => navigate(`/resume/analyze?versionId=${currentVersion?.id || 'master'}`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-blue-50 text-[#2459A8] border border-[#DCE7F2] hover:border-blue-300 rounded-xl text-xs font-bold font-display transition-colors cursor-pointer shadow-2xs shrink-0"
                >
                  <span>View Full ATS Analysis</span>
                  <ExternalLink size={13} />
                </button>
              </div>

              {/* 5 Factor Breakdown Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                
                {/* 1. Keyword Match Card */}
                <div className="bg-white p-3.5 rounded-xl border border-[#DCE7F2] flex flex-col justify-between space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-[#11183D] truncate">
                      {hasTargetJd ? 'Keyword Match' : 'Domain Skills'}
                    </span>
                    <span className="font-mono font-bold text-xs text-[#2459A8] shrink-0">
                      {Math.round((currentAtsAnalysis.breakdown.keywordScore / 40) * 100)}% ({currentAtsAnalysis.breakdown.keywordScore}/40)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2459A8] rounded-full transition-all duration-300"
                      style={{ width: `${(currentAtsAnalysis.breakdown.keywordScore / 40) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#526078] leading-tight break-words">
                    {hasTargetJd
                      ? `${currentAtsAnalysis.matchedKeywords.length} JD keywords matched`
                      : `${currentAtsAnalysis.matchedKeywords.length} professional skills recognized`}
                  </p>
                </div>

                {/* 2. Semantic Match Card */}
                <div className="bg-white p-3.5 rounded-xl border border-[#DCE7F2] flex flex-col justify-between space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-[#11183D] truncate">Semantic Match</span>
                    {hasTargetJd ? (
                      <span className="font-mono font-bold text-xs text-indigo-700 shrink-0">
                        {currentAtsAnalysis.semanticScore}%
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                        No JD attached
                      </span>
                    )}
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                      style={{ width: hasTargetJd ? `${currentAtsAnalysis.semanticScore}%` : '0%' }}
                    />
                  </div>
                  <p className="text-[11px] text-[#526078] leading-tight break-words">
                    {hasTargetJd
                      ? 'AI vector contextual relevance to job'
                      : 'Add a target job description to calculate semantic similarity.'}
                  </p>
                </div>

                {/* 3. Section Completeness Card */}
                <div className="bg-white p-3.5 rounded-xl border border-[#DCE7F2] flex flex-col justify-between space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-[#11183D] truncate">Completeness</span>
                    <span className="font-mono font-bold text-xs text-emerald-700 shrink-0">
                      {Math.round((currentAtsAnalysis.breakdown.completenessScore / 20) * 100)}% ({currentAtsAnalysis.breakdown.completenessScore}/20)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${(currentAtsAnalysis.breakdown.completenessScore / 20) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#526078] leading-tight break-words">
                    Contact, summary, experience & skills sections
                  </p>
                </div>

                {/* 4. Action Verbs Card */}
                <div className="bg-white p-3.5 rounded-xl border border-[#DCE7F2] flex flex-col justify-between space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-[#11183D] truncate">Action Verbs</span>
                    <span className="font-mono font-bold text-xs text-amber-700 shrink-0">
                      {Math.round((currentAtsAnalysis.breakdown.actionVerbScore / 15) * 100)}% ({currentAtsAnalysis.breakdown.actionVerbScore}/15)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-300"
                      style={{ width: `${(currentAtsAnalysis.breakdown.actionVerbScore / 15) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#526078] leading-tight break-words">
                    Strong active verbs vs passive phrasing
                  </p>
                </div>

                {/* 5. Quantified Impact (STAR Metrics) Card */}
                <div className="bg-white p-3.5 rounded-xl border border-[#DCE7F2] flex flex-col justify-between space-y-2 shadow-2xs sm:col-span-2 lg:col-span-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-[#11183D] truncate">Quantified Impact (STAR Metrics)</span>
                    <span className="font-mono font-bold text-xs text-purple-700 shrink-0">
                      {Math.round((currentAtsAnalysis.breakdown.metricsScore / 25) * 100)}% ({currentAtsAnalysis.breakdown.metricsScore}/25)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600 rounded-full transition-all duration-300"
                      style={{ width: `${(currentAtsAnalysis.breakdown.metricsScore / 25) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#526078] leading-tight break-words">
                    Bullets containing %, $, numbers, or measurable scale outcomes
                  </p>
                </div>

              </div>
            </div>

            {/* 1. Personal Info Section */}
            {activeSection === 'PERSONAL' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-display text-[#11183D]">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#11183D] mb-1">Full Name</label>
                    <input
                      type="text"
                      value={activeResumeData.personalInfo.fullName}
                      onChange={(e) => handleUpdatePersonalInfo({ fullName: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-[#DCE7F2] rounded-xl text-xs focus:outline-none focus:border-[#2459A8]"
                      placeholder="e.g. Alex Morgan"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#11183D] mb-1">Professional Title</label>
                    <input
                      type="text"
                      value={activeResumeData.personalInfo.title}
                      onChange={(e) => handleUpdatePersonalInfo({ title: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-[#DCE7F2] rounded-xl text-xs focus:outline-none focus:border-[#2459A8]"
                      placeholder="e.g. Senior Software Engineer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#11183D] mb-1">Email</label>
                    <input
                      type="email"
                      value={activeResumeData.personalInfo.email}
                      onChange={(e) => handleUpdatePersonalInfo({ email: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-[#DCE7F2] rounded-xl text-xs focus:outline-none focus:border-[#2459A8]"
                      placeholder="e.g. alex@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#11183D] mb-1">Phone</label>
                    <input
                      type="text"
                      value={activeResumeData.personalInfo.phone}
                      onChange={(e) => handleUpdatePersonalInfo({ phone: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-[#DCE7F2] rounded-xl text-xs focus:outline-none focus:border-[#2459A8]"
                      placeholder="e.g. +1 (555) 019-2834"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#11183D] mb-1">Location</label>
                    <input
                      type="text"
                      value={activeResumeData.personalInfo.location}
                      onChange={(e) => handleUpdatePersonalInfo({ location: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-[#DCE7F2] rounded-xl text-xs focus:outline-none focus:border-[#2459A8]"
                      placeholder="e.g. San Francisco, CA"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#11183D] mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      value={activeResumeData.personalInfo.linkedin}
                      onChange={(e) => handleUpdatePersonalInfo({ linkedin: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-[#DCE7F2] rounded-xl text-xs focus:outline-none focus:border-[#2459A8]"
                      placeholder="e.g. linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#11183D] mb-1">GitHub URL</label>
                    <input
                      type="text"
                      value={activeResumeData.personalInfo.github}
                      onChange={(e) => handleUpdatePersonalInfo({ github: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-[#DCE7F2] rounded-xl text-xs focus:outline-none focus:border-[#2459A8]"
                      placeholder="e.g. github.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#11183D] mb-1">Portfolio URL</label>
                    <input
                      type="text"
                      value={activeResumeData.personalInfo.portfolio}
                      onChange={(e) => handleUpdatePersonalInfo({ portfolio: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-[#DCE7F2] rounded-xl text-xs focus:outline-none focus:border-[#2459A8]"
                      placeholder="e.g. alexmorgan.dev"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. Executive Summary Section */}
            {activeSection === 'SUMMARY' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-display text-[#11183D]">Executive Summary</h3>
                  <button
                    onClick={() => setIsCopilotOpen(true)}
                    className="text-xs font-bold text-[#2459A8] flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <Sparkles size={13} />
                    <span>AI Rewrite Assistant</span>
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={activeResumeData.summary}
                  onChange={(e) => handleUpdateSummary(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-[#DCE7F2] rounded-2xl text-xs text-[#11183D] focus:outline-none focus:border-[#2459A8] leading-relaxed"
                  placeholder="Provide a concise 3-4 sentence professional summary highlighting your key technical strengths, engineering achievements, and scale."
                />
              </div>
            )}

            {/* 3. Work Experience Section */}
            {activeSection === 'EXPERIENCE' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-display text-[#11183D]">Work Experience</h3>
                  <button
                    onClick={() =>
                      handleAddExperience({
                        title: 'Software Engineer',
                        company: 'New Company',
                        location: 'City, State',
                        startDate: '2023-01',
                        endDate: 'Present',
                        current: true,
                        bullets: ['Designed high-throughput APIs handling daily user volume with 99.9% uptime.']
                      })
                    }
                    className="px-3 py-1.5 bg-[#EFFAFD] border border-[#DCE7F2] text-[#2459A8] rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-blue-100 transition-colors"
                  >
                    <Plus size={14} />
                    <span>Add Position</span>
                  </button>
                </div>

                {(activeResumeData.experience || []).map((exp, idx) => (
                  <div key={exp.id} className="p-4 bg-slate-50 rounded-2xl border border-[#DCE7F2] space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold font-mono text-[#2459A8]"># {idx + 1} Position</span>
                      <button
                        onClick={() => handleRemoveExperience(exp.id)}
                        className="text-rose-600 hover:text-rose-800 text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#526078] mb-1">Job Title</label>
                        <input
                          type="text"
                          placeholder="Job Title"
                          value={exp.title}
                          onChange={(e) => handleUpdateExperience(exp.id, { title: e.target.value })}
                          className="w-full p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#526078] mb-1">Company Name</label>
                        <input
                          type="text"
                          placeholder="Company Name"
                          value={exp.company}
                          onChange={(e) => handleUpdateExperience(exp.id, { company: e.target.value })}
                          className="w-full p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#526078] mb-1">Location</label>
                        <input
                          type="text"
                          placeholder="City, State / Remote"
                          value={exp.location}
                          onChange={(e) => handleUpdateExperience(exp.id, { location: e.target.value })}
                          className="w-full p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-[#526078] mb-1">Start Date</label>
                          <input
                            type="text"
                            placeholder="2022-01"
                            value={exp.startDate}
                            onChange={(e) => handleUpdateExperience(exp.id, { startDate: e.target.value })}
                            className="w-full p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-[#526078] mb-1">End Date</label>
                          <input
                            type="text"
                            placeholder="Present"
                            value={exp.endDate}
                            onChange={(e) => handleUpdateExperience(exp.id, { endDate: e.target.value })}
                            className="w-full p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-[#11183D]">STAR Impact Bullets</label>
                        <button
                          onClick={() => {
                            const nextBullets = [...(exp.bullets || []), ''];
                            handleUpdateExperience(exp.id, { bullets: nextBullets });
                          }}
                          className="text-[11px] font-bold text-[#2459A8] hover:underline flex items-center gap-0.5 cursor-pointer"
                        >
                          <Plus size={12} /> Add Bullet
                        </button>
                      </div>

                      {(exp.bullets || []).map((b, bIdx) => (
                        <div key={bIdx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={b}
                            onChange={(e) => {
                              const newBullets = [...(exp.bullets || [])];
                              newBullets[bIdx] = e.target.value;
                              handleUpdateExperience(exp.id, { bullets: newBullets });
                            }}
                            className="flex-1 p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                            placeholder="STAR bullet point with action verb & measurable result..."
                          />
                          <button
                            onClick={() => {
                              const nextBullets = (exp.bullets || []).filter((_, i) => i !== bIdx);
                              handleUpdateExperience(exp.id, { bullets: nextBullets });
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                            title="Remove bullet"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. Education Section */}
            {activeSection === 'EDUCATION' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-display text-[#11183D]">Education</h3>
                  <button
                    onClick={() =>
                      handleAddEducation({
                        degree: 'B.S. in Computer Science',
                        school: 'University Name',
                        location: 'City, State',
                        startDate: '2019-08',
                        endDate: '2023-05',
                        gpa: '3.8 / 4.0',
                        highlights: 'Coursework: Algorithms, Operating Systems, Database Systems'
                      })
                    }
                    className="px-3 py-1.5 bg-[#EFFAFD] border border-[#DCE7F2] text-[#2459A8] rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-blue-100 transition-colors"
                  >
                    <Plus size={14} />
                    <span>Add Degree</span>
                  </button>
                </div>

                {(activeResumeData.education || []).map((edu, idx) => (
                  <div key={edu.id} className="p-4 bg-slate-50 rounded-2xl border border-[#DCE7F2] space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold font-mono text-[#2459A8]"># {idx + 1} Degree</span>
                      <button
                        onClick={() => handleRemoveEducation(edu.id)}
                        className="text-rose-600 hover:text-rose-800 text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#526078] mb-1">Degree & Major</label>
                        <input
                          type="text"
                          placeholder="e.g. B.Tech in Computer Science"
                          value={edu.degree}
                          onChange={(e) => handleUpdateEducation(edu.id, { degree: e.target.value })}
                          className="w-full p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#526078] mb-1">School / University</label>
                        <input
                          type="text"
                          placeholder="e.g. Stanford University"
                          value={edu.school}
                          onChange={(e) => handleUpdateEducation(edu.id, { school: e.target.value })}
                          className="w-full p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#526078] mb-1">Location</label>
                        <input
                          type="text"
                          placeholder="e.g. Stanford, CA"
                          value={edu.location}
                          onChange={(e) => handleUpdateEducation(edu.id, { location: e.target.value })}
                          className="w-full p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#526078] mb-1">GPA (Optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. 3.9 / 4.0"
                          value={edu.gpa || ''}
                          onChange={(e) => handleUpdateEducation(edu.id, { gpa: e.target.value })}
                          className="w-full p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-[#526078] mb-1">Academic Highlights / Coursework</label>
                        <input
                          type="text"
                          placeholder="e.g. Honors in Distributed Systems, Algorithms, Machine Learning"
                          value={edu.highlights || ''}
                          onChange={(e) => handleUpdateEducation(edu.id, { highlights: e.target.value })}
                          className="w-full p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 5. Key Projects Section */}
            {activeSection === 'PROJECTS' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-display text-[#11183D]">Key Projects</h3>
                  <button
                    onClick={() =>
                      handleAddProject({
                        name: 'New Project',
                        description: 'High-performance scalable web application.',
                        techStack: ['TypeScript', 'React', 'Node.js'],
                        bullets: ['Engineered responsive user interface with automated test coverage.']
                      })
                    }
                    className="px-3 py-1.5 bg-[#EFFAFD] border border-[#DCE7F2] text-[#2459A8] rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-blue-100 transition-colors"
                  >
                    <Plus size={14} />
                    <span>Add Project</span>
                  </button>
                </div>

                {(activeResumeData.projects || []).map((proj, idx) => (
                  <div key={proj.id} className="p-4 bg-slate-50 rounded-2xl border border-[#DCE7F2] space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold font-mono text-[#2459A8]"># {idx + 1} Project</span>
                      <button
                        onClick={() => handleRemoveProject(proj.id)}
                        className="text-rose-600 hover:text-rose-800 text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#526078] mb-1">Project Name</label>
                        <input
                          type="text"
                          placeholder="Project Name"
                          value={proj.name}
                          onChange={(e) => handleUpdateProject(proj.id, { name: e.target.value })}
                          className="w-full p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#526078] mb-1">Tech Stack (comma separated)</label>
                        <input
                          type="text"
                          placeholder="e.g. TypeScript, React, PostgreSQL"
                          value={(proj.techStack || []).join(', ')}
                          onChange={(e) =>
                            handleUpdateProject(proj.id, {
                              techStack: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                            })
                          }
                          className="w-full p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-[#526078] mb-1">Short Description</label>
                        <input
                          type="text"
                          placeholder="One-line summary of project architecture and purpose"
                          value={proj.description}
                          onChange={(e) => handleUpdateProject(proj.id, { description: e.target.value })}
                          className="w-full p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-[#11183D]">Project Highlights</label>
                        <button
                          onClick={() => {
                            const nextBullets = [...(proj.bullets || []), ''];
                            handleUpdateProject(proj.id, { bullets: nextBullets });
                          }}
                          className="text-[11px] font-bold text-[#2459A8] hover:underline flex items-center gap-0.5 cursor-pointer"
                        >
                          <Plus size={12} /> Add Highlight
                        </button>
                      </div>

                      {(proj.bullets || []).map((b, bIdx) => (
                        <div key={bIdx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={b}
                            onChange={(e) => {
                              const newBullets = [...(proj.bullets || [])];
                              newBullets[bIdx] = e.target.value;
                              handleUpdateProject(proj.id, { bullets: newBullets });
                            }}
                            className="flex-1 p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                            placeholder="Architectural achievement or performance outcome..."
                          />
                          <button
                            onClick={() => {
                              const nextBullets = (proj.bullets || []).filter((_, i) => i !== bIdx);
                              handleUpdateProject(proj.id, { bullets: nextBullets });
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 6. Technical Skills Section */}
            {activeSection === 'SKILLS' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-display text-[#11183D]">Technical Skills</h3>
                <p className="text-xs text-[#526078]">
                  Categorized skills are prioritized by modern ATS parsers. Separate multiple items with commas.
                </p>

                {(['languages', 'frameworks', 'databases', 'cloudDevOps', 'tools'] as const).map((cat) => (
                  <div key={cat} className="p-4 bg-slate-50 rounded-2xl border border-[#DCE7F2] space-y-2">
                    <label className="block text-xs font-bold text-[#11183D] capitalize">
                      {cat.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <input
                      type="text"
                      value={(activeResumeData.skills?.[cat] || []).join(', ')}
                      onChange={(e) =>
                        handleUpdateSkillsCategory(
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

            {/* 7. Certifications Section */}
            {activeSection === 'CERTS' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-display text-[#11183D]">Certifications & Licenses</h3>
                  <button
                    onClick={() =>
                      handleAddCertification({
                        title: 'AWS Certified Solutions Architect',
                        issuer: 'Amazon Web Services',
                        date: '2023-09'
                      })
                    }
                    className="px-3 py-1.5 bg-[#EFFAFD] border border-[#DCE7F2] text-[#2459A8] rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-blue-100 transition-colors"
                  >
                    <Plus size={14} />
                    <span>Add Certification</span>
                  </button>
                </div>

                {(activeResumeData.certifications || []).map((cert, idx) => (
                  <div key={cert.id} className="p-4 bg-slate-50 rounded-2xl border border-[#DCE7F2] space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold font-mono text-[#2459A8]"># {idx + 1} Certification</span>
                      <button
                        onClick={() => handleRemoveCertification(cert.id)}
                        className="text-rose-600 hover:text-rose-800 text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#526078] mb-1">Certification Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Certified Kubernetes Administrator"
                          value={cert.title}
                          onChange={(e) => {
                            if (currentVersion) {
                              updateResumeVersion(currentVersion.id, {
                                resumeData: {
                                  ...activeResumeData,
                                  certifications: (activeResumeData.certifications || []).map((c) =>
                                    c.id === cert.id ? { ...c, title: e.target.value } : c
                                  )
                                }
                              });
                            }
                          }}
                          className="w-full p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#526078] mb-1">Issuing Organization</label>
                        <input
                          type="text"
                          placeholder="e.g. Linux Foundation"
                          value={cert.issuer}
                          onChange={(e) => {
                            if (currentVersion) {
                              updateResumeVersion(currentVersion.id, {
                                resumeData: {
                                  ...activeResumeData,
                                  certifications: (activeResumeData.certifications || []).map((c) =>
                                    c.id === cert.id ? { ...c, issuer: e.target.value } : c
                                  )
                                }
                              });
                            }
                          }}
                          className="w-full p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 8. Design Templates Section */}
            {activeSection === 'TEMPLATES' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-display text-[#11183D]">Select ATS Design Layout</h3>
                  <span className="text-xs font-mono text-[#526078]">8 ATS Layouts Available</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TEMPLATE_METADATA.map((tmpl) => (
                    <div
                      key={tmpl.id}
                      onClick={() => handleSelectTemplate(tmpl.id)}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                        currentTemplate === tmpl.id
                          ? 'border-[#2459A8] bg-[#EFFAFD] shadow-xs ring-2 ring-[#2459A8]/20'
                          : 'border-[#DCE7F2] bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-[#11183D]">{tmpl.name}</span>
                        <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-[#DCE7F2]">
                          ATS {tmpl.atsRating}%
                        </span>
                      </div>
                      <p className="text-[11px] text-[#526078] line-clamp-2">{tmpl.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PANE 3: Live Preview (Right Column) */}
        <div className={`w-full lg:w-[48%] xl:w-[50%] bg-slate-200 border-l border-[#DCE7F2] p-4 sm:p-6 lg:p-7 overflow-y-auto shrink-0 ${
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
        onSelect={handleSelectTemplate}
        isSelected={true}
      />
    </div>
  );
}
