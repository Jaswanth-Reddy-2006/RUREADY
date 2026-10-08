import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResumeStore, ResumeTemplateId, TEMPLATE_METADATA } from '../../store/useResumeStore';
import ResumeRenderer from '../../components/resume/templates/ResumeRenderer';
import ResumeCopilotDrawer from '../../components/resume/ResumeCopilotDrawer';
import TemplateOverviewModal from '../../components/resume/TemplateOverviewModal';
import { calculateAtsScore, mapBackendAtsResultToUi, normalizeResumeData, resumeToPlainText, ResumeData, AtsScoreResult } from '../../utils/atsEngine';
import { parseResumeFile } from '../../utils/resumeParser';
import apiClient from '../../api/client';
import { 
  User, FileText, Briefcase, GraduationCap, FolderGit2, Wrench, Award, Layout, 
  Sparkles, Download, ArrowLeft, Plus, Trash2, Check, ShieldCheck, ExternalLink,
  BookOpen, Lightbulb, Trophy, Languages, Layers, Target, UploadCloud, RefreshCw,
  CheckCircle2, XCircle, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

type SectionId = 
  | 'PERSONAL' 
  | 'SUMMARY' 
  | 'EXPERIENCE' 
  | 'EDUCATION' 
  | 'PROJECTS' 
  | 'SKILLS' 
  | 'CERTS' 
  | 'PUBLICATIONS'
  | 'PATENTS'
  | 'ACHIEVEMENTS'
  | 'LANGUAGES'
  | 'CUSTOM'
  | 'ATS_DIAGNOSTICS'
  | 'COMPETITIVE_MATCH'
  | 'TEMPLATES';

interface CompetitiveMatchData {
  status: 'MATCHED' | 'NOT_RELEVANT';
  score: number | null;
  semanticSimilarity: number;
  skillOverlap: number;
  experienceRelevance: number;
  terminologyMatch: number;
  matchedSkills: string[];
  missingSkills: string[];
  relevanceGate: {
    passed: boolean;
    reason?: string;
  };
}

export default function ResumeBuilderPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    updateCertification,
    removeCertification,
    addPublication,
    updatePublication,
    removePublication,
    addPatent,
    updatePatent,
    removePatent,
    addAchievement,
    updateAchievement,
    removeAchievement,
    addLanguage,
    updateLanguage,
    removeLanguage,
    addCustomSection,
    updateCustomSection,
    removeCustomSection,
    addCustomSectionItem,
    removeCustomSectionItem,
    updateResumeVersion,
    createResumeVersion,
    extractAndLoadResume
  } = useResumeStore();

  const [activeSection, setActiveSection] = useState<SectionId>('PERSONAL');
  const [mobileTab, setMobileTab] = useState<'EDITOR' | 'PREVIEW'>('EDITOR');
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Competitive matching state
  const [targetJdText, setTargetJdText] = useState(
    `Responsibilities:
• Architect, build, and maintain high-throughput backend services in Node.js, TypeScript, and Go.
• Build performant web client interfaces in React, TypeScript, and modern CSS.
• Design and optimize database schemas in PostgreSQL and Redis distributed caching.
• Own end-to-end reliability, CI/CD pipelines, and observability.

Requirements:
• 3+ years of professional full stack engineering experience.
• Proficiency with TypeScript/JavaScript, React, Node.js, and SQL.
• Hands-on experience with Docker, microservices, and automated testing.`
  );
  const [targetJobRole, setTargetJobRole] = useState('Senior Full Stack Engineer');
  const [targetCompanyName, setTargetCompanyName] = useState('Stripe');
  const [isMatching, setIsMatching] = useState(false);
  const [competitiveResult, setCompetitiveResult] = useState<CompetitiveMatchData | null>(null);

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

  // Authoritative Backend ATS evaluation state
  const [backendAtsResult, setBackendAtsResult] = useState<AtsScoreResult | null>(null);
  const prevPlainTextRef = useRef<string>('');

  useEffect(() => {
    let isMounted = true;
    const plainText = resumeToPlainText(activeResumeData);
    if (!plainText.trim() || plainText === prevPlainTextRef.current) return;
    prevPlainTextRef.current = plainText;

    const timer = setTimeout(async () => {
      try {
        const res = await apiClient.post('/resume-parser/score', {
          resumeText: plainText,
        });
        if (isMounted && res.data?.data) {
          const mapped = mapBackendAtsResultToUi(res.data.data, activeResumeData);
          setBackendAtsResult(mapped);
        }
      } catch (err) {
        // Backend unavailable, fallback seamlessly to client evaluation
      }
    }, 400);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [activeResumeData]);

  // Realtime ATS Audit for Copilot & Diagnostics (Role-Independent 6-Pillar Model)
  const currentAtsAnalysis: AtsScoreResult = useMemo(() => {
    if (backendAtsResult) return backendAtsResult;
    return calculateAtsScore(activeResumeData);
  }, [backendAtsResult, activeResumeData]);

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

  const handleUpdateCertification = (certId: string, updates: Partial<ResumeData['certifications'][0]>) => {
    if (currentVersion) {
      updateResumeVersion(currentVersion.id, {
        resumeData: {
          ...activeResumeData,
          certifications: (activeResumeData.certifications || []).map((c) => (c.id === certId ? { ...c, ...updates } : c))
        }
      });
    } else {
      updateCertification(certId, updates);
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

  // Publications
  const handleAddPublication = (pub: Omit<NonNullable<ResumeData['publications']>[0], 'id'>) => {
    const newPub = { ...pub, id: `pub-${Date.now()}` };
    if (currentVersion) {
      updateResumeVersion(currentVersion.id, {
        resumeData: {
          ...activeResumeData,
          publications: [newPub, ...(activeResumeData.publications || [])]
        }
      });
    } else {
      addPublication(pub);
    }
  };

  const handleUpdatePublication = (id: string, updates: Partial<NonNullable<ResumeData['publications']>[0]>) => {
    if (currentVersion) {
      updateResumeVersion(currentVersion.id, {
        resumeData: {
          ...activeResumeData,
          publications: (activeResumeData.publications || []).map((p) => (p.id === id ? { ...p, ...updates } : p))
        }
      });
    } else {
      updatePublication(id, updates);
    }
  };

  const handleRemovePublication = (id: string) => {
    if (currentVersion) {
      updateResumeVersion(currentVersion.id, {
        resumeData: {
          ...activeResumeData,
          publications: (activeResumeData.publications || []).filter((p) => p.id !== id)
        }
      });
    } else {
      removePublication(id);
    }
  };

  // Patents
  const handleAddPatent = (pat: Omit<NonNullable<ResumeData['patents']>[0], 'id'>) => {
    const newPat = { ...pat, id: `pat-${Date.now()}` };
    if (currentVersion) {
      updateResumeVersion(currentVersion.id, {
        resumeData: {
          ...activeResumeData,
          patents: [newPat, ...(activeResumeData.patents || [])]
        }
      });
    } else {
      addPatent(pat);
    }
  };

  const handleUpdatePatent = (id: string, updates: Partial<NonNullable<ResumeData['patents']>[0]>) => {
    if (currentVersion) {
      updateResumeVersion(currentVersion.id, {
        resumeData: {
          ...activeResumeData,
          patents: (activeResumeData.patents || []).map((p) => (p.id === id ? { ...p, ...updates } : p))
        }
      });
    } else {
      updatePatent(id, updates);
    }
  };

  const handleRemovePatent = (id: string) => {
    if (currentVersion) {
      updateResumeVersion(currentVersion.id, {
        resumeData: {
          ...activeResumeData,
          patents: (activeResumeData.patents || []).filter((p) => p.id !== id)
        }
      });
    } else {
      removePatent(id);
    }
  };

  // Achievements
  const handleAddAchievement = (ach: string) => {
    if (!ach.trim()) return;
    if (currentVersion) {
      updateResumeVersion(currentVersion.id, {
        resumeData: {
          ...activeResumeData,
          achievements: [...(activeResumeData.achievements || []), ach.trim()]
        }
      });
    } else {
      addAchievement(ach);
    }
  };

  const handleUpdateAchievement = (idx: number, val: string) => {
    const next = [...(activeResumeData.achievements || [])];
    next[idx] = val;
    if (currentVersion) {
      updateResumeVersion(currentVersion.id, {
        resumeData: { ...activeResumeData, achievements: next }
      });
    } else {
      updateAchievement(idx, val);
    }
  };

  const handleRemoveAchievement = (idx: number) => {
    const next = (activeResumeData.achievements || []).filter((_, i) => i !== idx);
    if (currentVersion) {
      updateResumeVersion(currentVersion.id, {
        resumeData: { ...activeResumeData, achievements: next }
      });
    } else {
      removeAchievement(idx);
    }
  };

  // Languages
  const handleAddLanguage = (lang: string) => {
    if (!lang.trim()) return;
    if (currentVersion) {
      updateResumeVersion(currentVersion.id, {
        resumeData: {
          ...activeResumeData,
          languages: [...(activeResumeData.languages || []), lang.trim()]
        }
      });
    } else {
      addLanguage(lang);
    }
  };

  const handleUpdateLanguage = (idx: number, val: string) => {
    const next = [...(activeResumeData.languages || [])];
    next[idx] = val;
    if (currentVersion) {
      updateResumeVersion(currentVersion.id, {
        resumeData: { ...activeResumeData, languages: next }
      });
    } else {
      updateLanguage(idx, val);
    }
  };

  const handleRemoveLanguage = (idx: number) => {
    const next = (activeResumeData.languages || []).filter((_, i) => i !== idx);
    if (currentVersion) {
      updateResumeVersion(currentVersion.id, {
        resumeData: { ...activeResumeData, languages: next }
      });
    } else {
      removeLanguage(idx);
    }
  };

  // Custom Sections
  const handleAddCustomSection = (title: string) => {
    const newSec = { id: `custom-${Date.now()}`, title: title.trim() || 'Additional Section', items: [] };
    if (currentVersion) {
      updateResumeVersion(currentVersion.id, {
        resumeData: {
          ...activeResumeData,
          customSections: [...(activeResumeData.customSections || []), newSec]
        }
      });
    } else {
      addCustomSection(title);
    }
  };

  const handleUpdateCustomSection = (id: string, title: string, items: string[]) => {
    if (currentVersion) {
      updateResumeVersion(currentVersion.id, {
        resumeData: {
          ...activeResumeData,
          customSections: (activeResumeData.customSections || []).map((s) => (s.id === id ? { ...s, title, items } : s))
        }
      });
    } else {
      updateCustomSection(id, title, items);
    }
  };

  const handleRemoveCustomSection = (id: string) => {
    if (currentVersion) {
      updateResumeVersion(currentVersion.id, {
        resumeData: {
          ...activeResumeData,
          customSections: (activeResumeData.customSections || []).filter((s) => s.id !== id)
        }
      });
    } else {
      removeCustomSection(id);
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading(`Extracting resume with Docling: ${file.name}...`);

    try {
      const parsedData = await parseResumeFile(file);
      const normalized = normalizeResumeData(parsedData);

      if ((parsedData as any)._atsScore) {
        setBackendAtsResult(mapBackendAtsResultToUi((parsedData as any)._atsScore, normalized));
      }
      
      if (currentVersion) {
        updateResumeVersion(currentVersion.id, {
          resumeData: normalized,
          lastUpdated: new Date().toISOString()
        });
      } else {
        extractAndLoadResume(normalized);
      }

      toast.success(`Successfully extracted resume! (${normalized.experience.length} experiences, ${normalized.education.length} degrees)`, { id: toastId });
    } catch (err: any) {
      toast.error(`Extraction failed: ${err.message || 'Unknown error'}`, { id: toastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRunCompetitiveMatch = async () => {
    if (!targetJdText.trim()) {
      toast.error('Please enter a target Job Description to run competitive analysis.');
      return;
    }

    setIsMatching(true);
    const toastId = toast.loading('Running BGE Semantic Competitive Matching...');

    try {
      const resumeText = resumeToPlainText(activeResumeData);
      const res = await apiClient.post('/resume-parser/evaluate', {
        resumeText,
        jobDescription: targetJdText,
        role: targetJobRole || undefined,
      });

      if (res.data?.data?.competitive) {
        const comp = res.data.data.competitive;
        setCompetitiveResult({
          status: comp.status || 'MATCHED',
          score: comp.score !== undefined ? comp.score : null,
          semanticSimilarity: comp.matchSignals?.semanticSimilarity ?? comp.semanticSimilarity ?? 0,
          skillOverlap: comp.matchSignals?.skillOverlap ?? comp.skillOverlap ?? 0,
          experienceRelevance: comp.matchSignals?.experienceRelevance ?? comp.experienceRelevance ?? 0,
          terminologyMatch: comp.matchSignals?.terminologyMatch ?? comp.terminologyMatch ?? 0,
          matchedSkills: comp.signalsDetail?.matchedSkills ?? comp.matchedSkills ?? [],
          missingSkills: comp.signalsDetail?.missingSkills ?? comp.missingSkills ?? [],
          relevanceGate: comp.relevanceGate || { passed: comp.status === 'MATCHED' },
        });
        toast.success(
          comp.status === 'MATCHED'
            ? `Competitive Match Score: ${comp.score}/100`
            : 'Evaluation complete: Role not relevant (Score: N/A)',
          { id: toastId }
        );
      } else {
        throw new Error('Invalid response from competitive evaluation service.');
      }
    } catch (err: any) {
      toast.error(`Competitive matching error: ${err.message || 'Check connection to resume service.'}`, { id: toastId });
    } finally {
      setIsMatching(false);
    }
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

  const sectionsList: Array<{ id: SectionId; label: string; icon: React.ReactNode; count?: number }> = [
    { id: 'PERSONAL', label: 'Personal Info', icon: <User size={16} /> },
    { id: 'SUMMARY', label: 'Executive Summary', icon: <FileText size={16} /> },
    { id: 'EXPERIENCE', label: 'Work Experience', icon: <Briefcase size={16} />, count: activeResumeData.experience.length },
    { id: 'PROJECTS', label: 'Key Projects', icon: <FolderGit2 size={16} />, count: activeResumeData.projects.length },
    { id: 'EDUCATION', label: 'Education', icon: <GraduationCap size={16} />, count: activeResumeData.education.length },
    { id: 'SKILLS', label: 'Technical Skills', icon: <Wrench size={16} />, count: Object.values(activeResumeData.skills).flat().length },
    { id: 'CERTS', label: 'Certifications', icon: <Award size={16} />, count: activeResumeData.certifications.length },
    { id: 'PUBLICATIONS', label: 'Publications', icon: <BookOpen size={16} />, count: activeResumeData.publications?.length || 0 },
    { id: 'PATENTS', label: 'Patents', icon: <Lightbulb size={16} />, count: activeResumeData.patents?.length || 0 },
    { id: 'ACHIEVEMENTS', label: 'Achievements / Awards', icon: <Trophy size={16} />, count: activeResumeData.achievements?.length || 0 },
    { id: 'LANGUAGES', label: 'Languages', icon: <Languages size={16} />, count: activeResumeData.languages?.length || 0 },
    { id: 'CUSTOM', label: 'Additional Sections', icon: <Layers size={16} />, count: activeResumeData.customSections?.length || 0 },
    { id: 'ATS_DIAGNOSTICS', label: 'ATS Quality Score', icon: <ShieldCheck size={16} /> },
    { id: 'COMPETITIVE_MATCH', label: 'Competitive Job Match', icon: <Target size={16} /> },
    { id: 'TEMPLATES', label: 'Design Layouts', icon: <Layout size={16} /> },
  ];

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-4rem)] font-sans bg-slate-100 overflow-hidden">
      {/* Hidden File Input for PDF/DOCX Docling Extraction */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.docx"
        className="hidden"
      />

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
              {currentVersion ? `Target: ${currentVersion.targetRole} (${currentVersion.targetCompany || 'General'})` : 'Canonical Resume Workspace'}
            </p>
          </div>

          {/* Top ATS Score Badge */}
          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-[#DCE7F2]">
            <button
              onClick={() => setActiveSection('ATS_DIAGNOSTICS')}
              className="flex items-center gap-1.5 bg-[#EFFAFD] hover:bg-blue-100 px-2.5 py-1 rounded-xl border border-[#DCE7F2] cursor-pointer transition-colors"
              title="Click to view full ATS breakdown"
            >
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
            </button>
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
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-3 py-2 bg-white hover:bg-slate-50 text-[#11183D] border border-[#DCE7F2] rounded-xl text-xs font-bold font-display flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            title="Upload PDF or DOCX directly into this workspace"
          >
            <UploadCloud size={14} className={isUploading ? 'animate-bounce text-[#2459A8]' : 'text-[#2459A8]'} />
            <span>{isUploading ? 'Extracting...' : 'Upload PDF/DOCX'}</span>
          </button>

          <button
            onClick={() => setActiveSection('COMPETITIVE_MATCH')}
            className="px-3 py-2 bg-white hover:bg-slate-50 text-[#2459A8] border border-[#DCE7F2] rounded-xl text-xs font-bold font-display flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            title="Match resume against specific Job Description"
          >
            <Target size={14} />
            <span className="hidden sm:inline">Job Match</span>
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
        <div className={`w-60 lg:w-64 bg-white border-r border-[#DCE7F2] p-4 flex flex-col justify-between shrink-0 overflow-y-auto ${
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
                className={`w-full px-3 py-2 rounded-xl text-xs font-bold font-display flex items-center justify-between transition-all cursor-pointer ${
                  activeSection === sec.id
                    ? 'bg-[#EFFAFD] text-[#2459A8] border border-[#DCE7F2] shadow-2xs'
                    : 'text-[#526078] hover:text-[#11183D] hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className={activeSection === sec.id ? 'text-[#2459A8]' : 'text-[#7B8799]'}>
                    {sec.icon}
                  </span>
                  <span className="truncate">{sec.label}</span>
                </div>
                {sec.count !== undefined && sec.count > 0 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-[#526078]">
                    {sec.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={() => setIsTemplateModalOpen(true)}
              className="w-full p-2.5 rounded-2xl bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 text-xs text-[#2459A8] font-bold flex items-center justify-between group cursor-pointer"
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

        {/* PANE 2: Form Editor / Analysis (Center Column) */}
        <div className={`flex-1 min-w-0 bg-white p-4 sm:p-6 lg:p-7 overflow-y-auto ${
          mobileTab === 'EDITOR' ? 'block' : 'hidden lg:block'
        }`}>
          <div className="max-w-3xl mx-auto space-y-6 w-full">

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
                        company: 'Company Name',
                        location: 'Location',
                        startDate: '2023-01',
                        endDate: 'Present',
                        current: true,
                        bullets: ['Engineered scalable microservices and customer-facing features.']
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
                        degree: 'Degree / Major',
                        school: 'University Name',
                        location: 'City, State',
                        startDate: '2019-08',
                        endDate: '2023-05',
                        gpa: '',
                        highlights: ''
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
                          placeholder="e.g. Coursework: Distributed Systems, Algorithms, Machine Learning"
                          value={edu.highlights || edu.coursework || ''}
                          onChange={(e) => handleUpdateEducation(edu.id, { highlights: e.target.value, coursework: e.target.value })}
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
                        description: 'High-performance scalable application.',
                        techStack: ['TypeScript', 'React', 'PostgreSQL'],
                        bullets: ['Designed responsive architecture with automated CI/CD.']
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
                      <div>
                        <label className="block text-[11px] font-bold text-[#526078] mb-1">Live Demo URL</label>
                        <input
                          type="text"
                          placeholder="https://demo.app"
                          value={proj.liveUrl || ''}
                          onChange={(e) => handleUpdateProject(proj.id, { liveUrl: e.target.value })}
                          className="w-full p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#526078] mb-1">GitHub / Repo URL</label>
                        <input
                          type="text"
                          placeholder="https://github.com/username/repo"
                          value={proj.repoUrl || ''}
                          onChange={(e) => handleUpdateProject(proj.id, { repoUrl: e.target.value })}
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

            {/* 6. Technical Skills Section */}
            {activeSection === 'SKILLS' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-display text-[#11183D]">Technical Skills</h3>
                <p className="text-xs text-[#526078]">
                  Categorized technical skills recognized by ATS. Separate items with commas.
                </p>

                {(['languages', 'frameworks', 'libraries', 'databases', 'cloudDevOps', 'security', 'tools', 'other'] as const).map((cat) => (
                  <div key={cat} className="p-4 bg-slate-50 rounded-2xl border border-[#DCE7F2] space-y-2">
                    <label className="block text-xs font-bold text-[#11183D] capitalize">
                      {cat === 'cloudDevOps' ? 'Cloud & DevOps' : cat.replace(/([A-Z])/g, ' $1')}
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
                      placeholder={`Comma-separated ${cat} (e.g. Python, SQL, Docker)`}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 7. Certifications Section */}
            {activeSection === 'CERTS' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-display text-[#11183D]">Certifications</h3>
                  <button
                    onClick={() =>
                      handleAddCertification({
                        title: 'Certification Title',
                        issuer: 'Issuing Body',
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
                        <label className="block text-[11px] font-bold text-[#526078] mb-1">Title</label>
                        <input
                          type="text"
                          value={cert.title}
                          onChange={(e) => handleUpdateCertification(cert.id, { title: e.target.value })}
                          className="w-full p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#526078] mb-1">Issuer</label>
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => handleUpdateCertification(cert.id, { issuer: e.target.value })}
                          className="w-full p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#526078] mb-1">Date</label>
                        <input
                          type="text"
                          value={cert.date}
                          onChange={(e) => handleUpdateCertification(cert.id, { date: e.target.value })}
                          className="w-full p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#526078] mb-1">Credential URL (Optional)</label>
                        <input
                          type="text"
                          value={cert.credentialUrl || ''}
                          onChange={(e) => handleUpdateCertification(cert.id, { credentialUrl: e.target.value })}
                          className="w-full p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 8. Publications Section */}
            {activeSection === 'PUBLICATIONS' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-display text-[#11183D]">Publications</h3>
                  <button
                    onClick={() =>
                      handleAddPublication({
                        title: 'Paper / Article Title',
                        venue: 'Conference / Journal / Publisher',
                        date: '2023-05'
                      })
                    }
                    className="px-3 py-1.5 bg-[#EFFAFD] border border-[#DCE7F2] text-[#2459A8] rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-blue-100 transition-colors"
                  >
                    <Plus size={14} />
                    <span>Add Publication</span>
                  </button>
                </div>

                {(activeResumeData.publications || []).map((pub, idx) => (
                  <div key={pub.id} className="p-4 bg-slate-50 rounded-2xl border border-[#DCE7F2] space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold font-mono text-[#2459A8]"># {idx + 1} Publication</span>
                      <button
                        onClick={() => handleRemovePublication(pub.id)}
                        className="text-rose-600 hover:text-rose-800 text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-[#526078] mb-1">Title</label>
                        <input
                          type="text"
                          value={pub.title}
                          onChange={(e) => handleUpdatePublication(pub.id, { title: e.target.value })}
                          className="w-full p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#526078] mb-1">Venue / Publisher</label>
                        <input
                          type="text"
                          value={pub.venue || ''}
                          onChange={(e) => handleUpdatePublication(pub.id, { venue: e.target.value })}
                          className="w-full p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#526078] mb-1">Date</label>
                        <input
                          type="text"
                          value={pub.date || ''}
                          onChange={(e) => handleUpdatePublication(pub.id, { date: e.target.value })}
                          className="w-full p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-[#526078] mb-1">URL (Optional)</label>
                        <input
                          type="text"
                          value={pub.url || ''}
                          onChange={(e) => handleUpdatePublication(pub.id, { url: e.target.value })}
                          className="w-full p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 9. Patents Section */}
            {activeSection === 'PATENTS' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-display text-[#11183D]">Patents</h3>
                  <button
                    onClick={() =>
                      handleAddPatent({
                        title: 'Patent Title',
                        number: 'US12345678',
                        date: '2023-01'
                      })
                    }
                    className="px-3 py-1.5 bg-[#EFFAFD] border border-[#DCE7F2] text-[#2459A8] rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-blue-100 transition-colors"
                  >
                    <Plus size={14} />
                    <span>Add Patent</span>
                  </button>
                </div>

                {(activeResumeData.patents || []).map((pat, idx) => (
                  <div key={pat.id} className="p-4 bg-slate-50 rounded-2xl border border-[#DCE7F2] space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold font-mono text-[#2459A8]"># {idx + 1} Patent</span>
                      <button
                        onClick={() => handleRemovePatent(pat.id)}
                        className="text-rose-600 hover:text-rose-800 text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-[#526078] mb-1">Title</label>
                        <input
                          type="text"
                          value={pat.title}
                          onChange={(e) => handleUpdatePatent(pat.id, { title: e.target.value })}
                          className="w-full p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#526078] mb-1">Patent Number</label>
                        <input
                          type="text"
                          value={pat.number || ''}
                          onChange={(e) => handleUpdatePatent(pat.id, { number: e.target.value })}
                          className="w-full p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#526078] mb-1">Filing / Issue Date</label>
                        <input
                          type="text"
                          value={pat.date || ''}
                          onChange={(e) => handleUpdatePatent(pat.id, { date: e.target.value })}
                          className="w-full p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 10. Achievements / Awards Section */}
            {activeSection === 'ACHIEVEMENTS' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-display text-[#11183D]">Achievements & Awards</h3>
                  <button
                    onClick={() => handleAddAchievement('1st Place - National Hackathon 2023')}
                    className="px-3 py-1.5 bg-[#EFFAFD] border border-[#DCE7F2] text-[#2459A8] rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-blue-100 transition-colors"
                  >
                    <Plus size={14} />
                    <span>Add Achievement</span>
                  </button>
                </div>

                {(activeResumeData.achievements || []).map((ach, idx) => (
                  <div key={idx} className="flex gap-2 items-center p-2.5 bg-slate-50 rounded-xl border border-[#DCE7F2]">
                    <input
                      type="text"
                      value={ach}
                      onChange={(e) => handleUpdateAchievement(idx, e.target.value)}
                      className="flex-1 p-2 bg-white border border-[#DCE7F2] rounded-lg text-xs"
                    />
                    <button
                      onClick={() => handleRemoveAchievement(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 11. Languages Section */}
            {activeSection === 'LANGUAGES' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-display text-[#11183D]">Languages</h3>
                  <button
                    onClick={() => handleAddLanguage('English (Fluent)')}
                    className="px-3 py-1.5 bg-[#EFFAFD] border border-[#DCE7F2] text-[#2459A8] rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-blue-100 transition-colors"
                  >
                    <Plus size={14} />
                    <span>Add Language</span>
                  </button>
                </div>

                {(activeResumeData.languages || []).map((lang, idx) => (
                  <div key={idx} className="flex gap-2 items-center p-2.5 bg-slate-50 rounded-xl border border-[#DCE7F2]">
                    <input
                      type="text"
                      value={lang}
                      onChange={(e) => handleUpdateLanguage(idx, e.target.value)}
                      className="flex-1 p-2 bg-white border border-[#DCE7F2] rounded-lg text-xs"
                      placeholder="e.g. English (Fluent), Spanish (Conversational)"
                    />
                    <button
                      onClick={() => handleRemoveLanguage(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 12. Additional / Custom Sections */}
            {activeSection === 'CUSTOM' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-display text-[#11183D]">Custom Sections</h3>
                  <button
                    onClick={() => handleAddCustomSection('Leadership & Volunteering')}
                    className="px-3 py-1.5 bg-[#EFFAFD] border border-[#DCE7F2] text-[#2459A8] rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-blue-100 transition-colors"
                  >
                    <Plus size={14} />
                    <span>Add Custom Section</span>
                  </button>
                </div>

                {(activeResumeData.customSections || []).map((sec) => (
                  <div key={sec.id} className="p-4 bg-slate-50 rounded-2xl border border-[#DCE7F2] space-y-3">
                    <div className="flex justify-between items-center">
                      <input
                        type="text"
                        value={sec.title}
                        onChange={(e) => handleUpdateCustomSection(sec.id, e.target.value, sec.items)}
                        className="font-bold text-xs p-1.5 bg-white border border-[#DCE7F2] rounded-lg"
                        placeholder="Section Title"
                      />
                      <button
                        onClick={() => handleRemoveCustomSection(sec.id)}
                        className="text-rose-600 hover:text-rose-800 text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={13} /> Remove Section
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#526078]">Section Items</label>
                        <button
                          onClick={() => {
                            const next = [...sec.items, 'New item description'];
                            handleUpdateCustomSection(sec.id, sec.title, next);
                          }}
                          className="text-[11px] font-bold text-[#2459A8] hover:underline flex items-center gap-0.5 cursor-pointer"
                        >
                          <Plus size={12} /> Add Item
                        </button>
                      </div>

                      {sec.items.map((item, iIdx) => (
                        <div key={iIdx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const next = [...sec.items];
                              next[iIdx] = e.target.value;
                              handleUpdateCustomSection(sec.id, sec.title, next);
                            }}
                            className="flex-1 p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                          />
                          <button
                            onClick={() => {
                              const next = sec.items.filter((_, i) => i !== iIdx);
                              handleUpdateCustomSection(sec.id, sec.title, next);
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

            {/* ATS QUALITY ANALYSIS VIEW (Role-Independent 6-Pillar Model) */}
            {activeSection === 'ATS_DIAGNOSTICS' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#DCE7F2]">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2459A8] font-mono">
                      Role-Independent ATS Engine
                    </span>
                    <h3 className="text-xl font-bold font-display text-[#11183D]">
                      6-Pillar ATS Compatibility Audit
                    </h3>
                  </div>
                  <div className="bg-[#EFFAFD] border border-[#DCE7F2] p-3 rounded-2xl flex items-center gap-3">
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

                {/* 6 Pillars Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-[#DCE7F2] space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#11183D]">Structure</span>
                      <span className="font-mono text-[#2459A8] font-bold">{currentAtsAnalysis.breakdown.structureScore} / 20</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#2459A8]" style={{ width: `${(currentAtsAnalysis.breakdown.structureScore / 20) * 100}%` }} />
                    </div>
                    <p className="text-[10.5px] text-[#526078]">Header, contact info, standard section headers</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-[#DCE7F2] space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#11183D]">Content Completeness</span>
                      <span className="font-mono text-emerald-700 font-bold">{currentAtsAnalysis.breakdown.completenessScore} / 20</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${(currentAtsAnalysis.breakdown.completenessScore / 20) * 100}%` }} />
                    </div>
                    <p className="text-[10.5px] text-[#526078]">Education, experience, summary, skills populated</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-[#DCE7F2] space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#11183D]">ATS Extractability</span>
                      <span className="font-mono text-indigo-700 font-bold">{currentAtsAnalysis.breakdown.extractabilityScore} / 20</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${(currentAtsAnalysis.breakdown.extractabilityScore / 20) * 100}%` }} />
                    </div>
                    <p className="text-[10.5px] text-[#526078]">Clean plain-text parsing with Docling alignment</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-[#DCE7F2] space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#11183D]">Skills & Technical</span>
                      <span className="font-mono text-blue-700 font-bold">{currentAtsAnalysis.breakdown.skillsScore} / 15</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${(currentAtsAnalysis.breakdown.skillsScore / 15) * 100}%` }} />
                    </div>
                    <p className="text-[10.5px] text-[#526078]">Explicit technical skills categorization</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-[#DCE7F2] space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#11183D]">Experience Quality</span>
                      <span className="font-mono text-amber-700 font-bold">{currentAtsAnalysis.breakdown.experienceQualityScore} / 15</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: `${(currentAtsAnalysis.breakdown.experienceQualityScore / 15) * 100}%` }} />
                    </div>
                    <p className="text-[10.5px] text-[#526078]">Action verbs and measurable outcome metrics</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-[#DCE7F2] space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#11183D]">ATS Formatting</span>
                      <span className="font-mono text-purple-700 font-bold">{currentAtsAnalysis.breakdown.formattingScore} / 10</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: `${(currentAtsAnalysis.breakdown.formattingScore / 10) * 100}%` }} />
                    </div>
                    <p className="text-[10.5px] text-[#526078]">Single column hierarchy and clean typography</p>
                  </div>
                </div>

                {/* Bullet Audits */}
                {currentAtsAnalysis.bulletsAudit.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-[#11183D]">Bullet Point Quality Diagnostics</h4>
                    <div className="space-y-2">
                      {currentAtsAnalysis.bulletsAudit.slice(0, 5).map((bullet, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-[#DCE7F2] text-xs space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={bullet.hasStrongVerb ? 'text-emerald-600 font-bold' : 'text-amber-600'}>
                              {bullet.hasStrongVerb ? `✓ Verb: ${bullet.detectedVerb || 'Strong'}` : '⚠ Weak verb'}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className={bullet.hasMetrics ? 'text-emerald-600 font-bold' : 'text-amber-600'}>
                              {bullet.hasMetrics ? '✓ Metric detected' : '⚠ Missing metric'}
                            </span>
                          </div>
                          <p className="text-[#334155] italic">"{bullet.original}"</p>
                          {bullet.suggestedRewrite && (
                            <p className="text-[#2459A8] font-medium text-[11.5px]">
                              💡 Suggestion: {bullet.suggestedRewrite}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* COMPETITIVE JOB ANALYSIS VIEW (BGE Matcher + Target JD) */}
            {activeSection === 'COMPETITIVE_MATCH' && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2459A8] font-mono">
                    BAAI/bge-large-en-v1.5 Neural Matcher
                  </span>
                  <h3 className="text-xl font-bold font-display text-[#11183D]">
                    Competitive Job Description Matching
                  </h3>
                  <p className="text-xs text-[#526078] mt-1">
                    Evaluates resume semantic similarity, explicit skill overlap, experience relevance, and terminology alignment.
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-[#DCE7F2] space-y-4 shadow-2xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#11183D] mb-1">Target Company</label>
                      <input
                        type="text"
                        value={targetCompanyName}
                        onChange={(e) => setTargetCompanyName(e.target.value)}
                        placeholder="e.g. Stripe, Amazon"
                        className="w-full p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#11183D] mb-1">Target Job Title</label>
                      <input
                        type="text"
                        value={targetJobRole}
                        onChange={(e) => setTargetJobRole(e.target.value)}
                        placeholder="e.g. Senior Full Stack Software Engineer"
                        className="w-full p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#11183D] mb-1">Target Job Description (JD)</label>
                    <textarea
                      rows={6}
                      value={targetJdText}
                      onChange={(e) => setTargetJdText(e.target.value)}
                      placeholder="Paste target job responsibilities and qualifications..."
                      className="w-full p-3 bg-white border border-[#DCE7F2] rounded-xl text-xs font-sans leading-relaxed"
                    />
                  </div>

                  <button
                    onClick={handleRunCompetitiveMatch}
                    disabled={isMatching}
                    className="w-full py-2.5 bg-[#2459A8] hover:bg-[#1d4787] text-white rounded-xl text-xs font-bold font-display flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                  >
                    <RefreshCw size={14} className={isMatching ? 'animate-spin' : ''} />
                    <span>{isMatching ? 'Evaluating Neural Embeddings...' : 'Run Competitive Match Analysis'}</span>
                  </button>
                </div>

                {/* Competitive Match Results Display */}
                {competitiveResult && (
                  <div className="p-6 bg-white rounded-3xl border border-[#DCE7F2] space-y-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#DCE7F2]">
                      <div>
                        <span className="text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono bg-blue-50 text-[#2459A8] border border-blue-200">
                          Competitive Score Verdict
                        </span>
                        <h4 className="text-lg font-bold text-[#11183D] mt-1">
                          {competitiveResult.status === 'MATCHED' ? 'Job Match Established' : 'Role Relevancy Warning'}
                        </h4>
                      </div>

                      <div className="flex items-center gap-3">
                        {competitiveResult.status === 'MATCHED' ? (
                          <div className="px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                            <span className="text-2xl font-black font-mono text-emerald-700">
                              {competitiveResult.score}%
                            </span>
                            <p className="text-[10px] text-emerald-800 font-bold uppercase">Competitive Match</p>
                          </div>
                        ) : (
                          <div className="px-4 py-2 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                            <span className="text-2xl font-black font-mono text-amber-700">N/A</span>
                            <p className="text-[10px] text-amber-800 font-bold uppercase">Not Relevant</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Formula Component Breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-[#DCE7F2] space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-[#11183D]">Semantic Match (45%)</span>
                          <span className="font-mono text-[#2459A8]">{Math.round(competitiveResult.semanticSimilarity * 100)}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-[#2459A8]" style={{ width: `${competitiveResult.semanticSimilarity * 100}%` }} />
                        </div>
                      </div>

                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-[#DCE7F2] space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-[#11183D]">Skill Overlap (25%)</span>
                          <span className="font-mono text-emerald-700">{Math.round(competitiveResult.skillOverlap * 100)}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${competitiveResult.skillOverlap * 100}%` }} />
                        </div>
                      </div>

                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-[#DCE7F2] space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-[#11183D]">Experience Relevance (15%)</span>
                          <span className="font-mono text-purple-700">{Math.round(competitiveResult.experienceRelevance * 100)}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-600" style={{ width: `${competitiveResult.experienceRelevance * 100}%` }} />
                        </div>
                      </div>

                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-[#DCE7F2] space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-[#11183D]">Terminology Match (15%)</span>
                          <span className="font-mono text-amber-700">{Math.round(competitiveResult.terminologyMatch * 100)}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500" style={{ width: `${competitiveResult.terminologyMatch * 100}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Matched and Missing Skills */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-2">
                        <h5 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                          <CheckCircle2 size={14} className="text-emerald-600" />
                          <span>Matched Skills ({competitiveResult.matchedSkills.length})</span>
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {competitiveResult.matchedSkills.map((s, i) => (
                            <span key={i} className="text-[10px] font-mono bg-white text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-2">
                        <h5 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                          <XCircle size={14} className="text-rose-600" />
                          <span>Missing Keywords ({competitiveResult.missingSkills.length})</span>
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {competitiveResult.missingSkills.map((s, i) => (
                            <span key={i} className="text-[10px] font-mono bg-white text-rose-800 px-2 py-0.5 rounded border border-rose-200">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* DESIGN TEMPLATES SECTION */}
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
