import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResumeStore, ResumeTemplateId, TEMPLATE_METADATA, TemplateMetadata } from '../../store/useResumeStore';
import { useProfileStore } from '../../store/useProfileStore';
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
  CheckCircle2, XCircle, AlertCircle, BookmarkCheck, ChevronDown, ChevronUp,
  UserCheck, AlertTriangle, ArrowRight, HelpCircle, Search, Eye, Filter
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

export const STANDARD_ROLE_SUGGESTIONS = [
  'Frontend Developer',
  'Full Stack Developer',
  'Backend Developer',
  'Cybersecurity Analyst',
  'Data Scientist',
  'DevOps Engineer',
  'Mobile App Developer',
  'Data Engineer'
];

export interface RoleMatchData {
  role: string;
  matchedRoleProfileTitle?: string;
  status: 'MATCHED' | 'NOT_RELEVANT' | 'UNKNOWN_ROLE';
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
  explanation?: string;
  availableStandardRoles?: string[];
}

export interface CompetitiveMatchData {
  status: 'MATCHED' | 'NOT_RELEVANT' | 'INSUFFICIENT_JD';
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

  const { profile } = useProfileStore();

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

  const [workspaceMode, setWorkspaceMode] = useState<'ANALYSIS' | 'EDITOR'>('ANALYSIS');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<SectionId>('PERSONAL');
  const [mobileTab, setMobileTab] = useState<'EDITOR' | 'PREVIEW'>('EDITOR');
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [previewingTemplate, setPreviewingTemplate] = useState<TemplateMetadata | null>(null);
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState<string>('ALL');
  const [isUploading, setIsUploading] = useState(false);

  // 1. Entered Target Role Matching State (Standardized Role Profile)
  const [targetRoleInput, setTargetRoleInput] = useState('Frontend Developer');
  const [enteredRoleResult, setEnteredRoleResult] = useState<RoleMatchData | null>(null);
  const [isMatchingEnteredRole, setIsMatchingEnteredRole] = useState(false);

  // 2. Saved Account Target Role Matching State
  const [savedRoleResult, setSavedRoleResult] = useState<RoleMatchData | null>(null);
  const [isMatchingSavedRole, setIsMatchingSavedRole] = useState(false);

  // 3. Optional Custom Job Description Comparison (Advanced Option)
  const [isCustomJdOpen, setIsCustomJdOpen] = useState(false);
  const [customJdText, setCustomJdText] = useState('');
  const [customCompanyName, setCustomCompanyName] = useState('');
  const [customJobRole, setCustomJobRole] = useState('');
  const [isMatchingCustomJd, setIsMatchingCustomJd] = useState(false);
  const [customJdResult, setCustomJdResult] = useState<CompetitiveMatchData | null>(null);

  // Legacy compatibility bindings for targetJdText if referenced
  const [targetJdTextLegacy, setTargetJdTextLegacy] = useState('');
  const [isMatchingLegacy, setIsMatchingLegacy] = useState(false);
  const [competitiveResultLegacy, setCompetitiveResultLegacy] = useState<CompetitiveMatchData | null>(null);

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
    if (isUploading) {
      return;
    }
    const plainText = resumeToPlainText(activeResumeData);
    if (!plainText.trim() || plainText === prevPlainTextRef.current) return;
    prevPlainTextRef.current = plainText;

    const timer = setTimeout(async () => {
      try {
        console.log(`[ATS Audit Sync] Debounced background scoring triggered (payload: ${plainText.length} chars, uploading: false)`);
        const res = await apiClient.post('/resume-parser/score', {
          resumeText: plainText,
        });
        if (isMounted && !isUploading && res.data?.data) {
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
  }, [activeResumeData, isUploading]);

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
    setUploadedFileName(file.name);
    // Immediately clear previous resume's displayed analysis to guarantee complete state isolation
    setBackendAtsResult(null);
    setEnteredRoleResult(null);
    setSavedRoleResult(null);
    setCustomJdResult(null);
    setCompetitiveResultLegacy(null);
    prevPlainTextRef.current = '';
    console.log(`[Upload Pipeline] Upload started for file (${file.size} bytes). Stale analysis state cleared.`);

    const toastId = toast.loading(`Extracting resume with Docling: ${file.name}...`);

    try {
      const parsedData = await parseResumeFile(file);
      const normalized = normalizeResumeData(parsedData);

      if ((parsedData as any)._atsScore) {
        console.log(`[Upload Pipeline] Received authoritative ATS score from parse response.`);
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

      setWorkspaceMode('ANALYSIS');
      toast.success(`Successfully extracted resume! Authoritative ATS quality score generated.`, { id: toastId });
    } catch (err: any) {
      toast.error(`Extraction failed: ${err.message || 'Unknown error'}`, { id: toastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRunEnteredRoleMatch = async (roleToMatch?: string) => {
    const role = (roleToMatch || targetRoleInput).trim();
    if (!role) {
      toast.error('Please enter or select a target role to evaluate.');
      return;
    }

    setIsMatchingEnteredRole(true);
    const toastId = toast.loading(`Evaluating against standardized ${role} profile...`);

    try {
      const resumeText = resumeToPlainText(activeResumeData);
      console.log(`[Role Match] Triggering match-role endpoint for role '${role}' (resume: ${resumeText.length} chars)`);
      const res = await apiClient.post('/resume-parser/match-role', {
        resumeText,
        role,
      });

      if (res.data?.data) {
        const data = res.data.data;
        const matchData: RoleMatchData = {
          role: data.role,
          matchedRoleProfileTitle: data.matchedRoleProfileTitle,
          status: data.status,
          score: data.score,
          semanticSimilarity: data.matchSignals?.semanticSimilarity ?? 0,
          skillOverlap: data.matchSignals?.skillOverlap ?? 0,
          experienceRelevance: data.matchSignals?.experienceRelevance ?? 0,
          terminologyMatch: data.matchSignals?.terminologyMatch ?? 0,
          matchedSkills: data.signalsDetail?.matchedSkills ?? [],
          missingSkills: data.signalsDetail?.missingSkills ?? [],
          relevanceGate: data.relevanceGate || { passed: data.status === 'MATCHED' },
          explanation: data.explanation,
          availableStandardRoles: data.availableStandardRoles,
        };
        setEnteredRoleResult(matchData);

        if (data.status === 'MATCHED') {
          toast.success(`Job Role Match: ${data.score}% for ${data.matchedRoleProfileTitle || role}`, { id: toastId });
        } else if (data.status === 'NOT_RELEVANT') {
          toast.success(`Evaluation complete: Not relevant to ${role} (Score: N/A)`, { id: toastId });
        } else {
          toast.error(`Role '${role}' not recognized in standard profiles.`, { id: toastId });
        }
      } else {
        throw new Error('Invalid response from role evaluation service.');
      }
    } catch (err: any) {
      toast.error(`Role matching error: ${err.message || 'Check connection to resume service.'}`, { id: toastId });
    } finally {
      setIsMatchingEnteredRole(false);
    }
  };

  const handleRunSavedRoleMatch = async () => {
    const savedRole = profile?.targetRole?.trim();
    if (!savedRole) {
      toast.error('No target role saved in your account profile. Please configure your target role.');
      return;
    }

    setIsMatchingSavedRole(true);
    const toastId = toast.loading(`Evaluating against your saved role (${savedRole})...`);

    try {
      const resumeText = resumeToPlainText(activeResumeData);
      console.log(`[Saved Role Match] Triggering match-role for saved role '${savedRole}' (resume: ${resumeText.length} chars)`);
      const res = await apiClient.post('/resume-parser/match-role', {
        resumeText,
        role: savedRole,
      });

      if (res.data?.data) {
        const data = res.data.data;
        const matchData: RoleMatchData = {
          role: data.role,
          matchedRoleProfileTitle: data.matchedRoleProfileTitle,
          status: data.status,
          score: data.score,
          semanticSimilarity: data.matchSignals?.semanticSimilarity ?? 0,
          skillOverlap: data.matchSignals?.skillOverlap ?? 0,
          experienceRelevance: data.matchSignals?.experienceRelevance ?? 0,
          terminologyMatch: data.matchSignals?.terminologyMatch ?? 0,
          matchedSkills: data.signalsDetail?.matchedSkills ?? [],
          missingSkills: data.signalsDetail?.missingSkills ?? [],
          relevanceGate: data.relevanceGate || { passed: data.status === 'MATCHED' },
          explanation: data.explanation,
          availableStandardRoles: data.availableStandardRoles,
        };
        setSavedRoleResult(matchData);

        if (data.status === 'MATCHED') {
          toast.success(`My Target Role Match: ${data.score}% (${data.matchedRoleProfileTitle || savedRole})`, { id: toastId });
        } else if (data.status === 'NOT_RELEVANT') {
          toast.success(`Evaluation complete: Not relevant to ${savedRole} (Score: N/A)`, { id: toastId });
        } else {
          toast.error(`Saved role '${savedRole}' not recognized in standard profiles.`, { id: toastId });
        }
      } else {
        throw new Error('Invalid response from role evaluation service.');
      }
    } catch (err: any) {
      toast.error(`Saved role matching error: ${err.message || 'Check connection to resume service.'}`, { id: toastId });
    } finally {
      setIsMatchingSavedRole(false);
    }
  };

  const handleRunCustomJdMatch = async () => {
    if (!customJdText.trim()) {
      toast.error('Please enter a target Job Description to run custom vacancy evaluation.');
      return;
    }

    setIsMatchingCustomJd(true);
    const toastId = toast.loading('Running BGE Semantic Matching on Custom JD...');

    try {
      const resumeText = resumeToPlainText(activeResumeData);
      console.log(`[Custom JD Match] Triggering evaluate endpoint with active canonical resume (${resumeText.length} chars)`);
      const res = await apiClient.post('/resume-parser/evaluate', {
        resumeText,
        jobDescription: customJdText,
        role: customJobRole || undefined,
      });

      if (res.data?.data?.competitive) {
        const comp = res.data.data.competitive;
        setCustomJdResult({
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
            ? `Custom JD Match Score: ${comp.score}/100`
            : comp.status === 'INSUFFICIENT_JD'
            ? 'Evaluation note: Job description is too short for reliable analysis'
            : 'Evaluation complete: Role not relevant (Score: N/A)',
          { id: toastId }
        );
      } else {
        throw new Error('Invalid response from competitive evaluation service.');
      }
    } catch (err: any) {
      setCustomJdResult(null);
      toast.error(`Custom JD matching error: ${err.message || 'Check connection to resume service.'}`, { id: toastId });
    } finally {
      setIsMatchingCustomJd(false);
    }
  };

  const handleRunCompetitiveMatch = async () => {
    await handleRunCustomJdMatch();
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
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold font-display text-[#11183D] truncate max-w-[180px] sm:max-w-xs md:max-w-md">
                {currentVersion ? currentVersion.name : 'Master Candidate Profile'}
              </h3>
              {uploadedFileName && (
                <span className="hidden md:inline-flex text-[10px] font-mono font-bold bg-blue-50 text-[#2459A8] px-2 py-0.5 rounded border border-blue-200 truncate max-w-[140px]">
                  {uploadedFileName}
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-[#526078] truncate">
              {currentVersion ? `Target: ${currentVersion.targetRole} (${currentVersion.targetCompany || 'General'})` : 'Authoritative Resume Workspace'}
            </p>
          </div>

          {/* Top ATS Score Badge */}
          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-[#DCE7F2]">
            <div
              className="flex items-center gap-1.5 bg-[#EFFAFD] px-2.5 py-1 rounded-xl border border-[#DCE7F2]"
              title="Authoritative ATS Compatibility Score"
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
            </div>
          </div>
        </div>

        {/* Mode Switcher Tabs & Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Analysis vs Editor View Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-[#DCE7F2] text-xs font-bold">
            <button
              onClick={() => setWorkspaceMode('ANALYSIS')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                workspaceMode === 'ANALYSIS' ? 'bg-white text-[#2459A8] shadow-2xs' : 'text-[#526078] hover:text-[#11183D]'
              }`}
            >
              <ShieldCheck size={14} />
              <span>ATS & Job Analysis</span>
            </button>
            <button
              onClick={() => setWorkspaceMode('EDITOR')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                workspaceMode === 'EDITOR' ? 'bg-white text-[#2459A8] shadow-2xs' : 'text-[#526078] hover:text-[#11183D]'
              }`}
            >
              <Layout size={14} />
              <span>Open Resume Builder</span>
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
            onClick={() => setIsCopilotOpen(true)}
            className="px-3 py-2 bg-[#EFFAFD] hover:bg-blue-100 text-[#2459A8] border border-[#DCE7F2] rounded-xl text-xs font-bold font-display flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
          >
            <Sparkles size={14} />
            <span className="hidden sm:inline">AI Copilot</span>
          </button>

          {workspaceMode === 'EDITOR' && (
            <>
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
            </>
          )}
        </div>
      </header>

      {/* ─── ANALYSIS DASHBOARD VIEW (Default on upload) ─── */}
      {workspaceMode === 'ANALYSIS' ? (
        <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header Status Banner */}
            <div className="p-6 rounded-3xl bg-linear-to-r from-[#EFFAFD] via-blue-50/60 to-indigo-50/40 border border-[#DCE7F2] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono bg-white text-[#2459A8] border border-[#DCE7F2]">
                    Authoritative Analysis Engine
                  </span>
                  {uploadedFileName && (
                    <span className="text-[10.5px] font-bold text-slate-700 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200">
                      📄 {uploadedFileName}
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-[#11183D]">
                  Resume Compatibility & Competency Audit
                </h2>
                <p className="text-xs text-[#526078] max-w-2xl">
                  Zero-fake-score evaluation featuring the authoritative 6-pillar ATS compatibility model and BGE neural job-match analysis.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 text-[#11183D] border border-[#DCE7F2] rounded-xl text-xs font-bold font-display flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                >
                  <UploadCloud size={15} className={isUploading ? 'animate-bounce text-[#2459A8]' : 'text-[#2459A8]'} />
                  <span>{isUploading ? 'Extracting...' : 'Upload New Resume'}</span>
                </button>
                <button
                  onClick={() => setWorkspaceMode('EDITOR')}
                  className="px-4 py-2.5 bg-[#2459A8] hover:bg-[#1d4787] text-white rounded-xl text-xs font-bold font-display flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Layout size={15} />
                  <span>Open Resume Builder</span>
                </button>
              </div>
            </div>

            {/* 1. High-Level Summary Score Cards (ATS Score + Job Match + Saved Target Role) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Score Card A: ATS Quality Score (Role-Independent) */}
              <div className="p-5 sm:p-6 bg-white rounded-3xl border border-[#DCE7F2] shadow-xs space-y-4 flex flex-col justify-between">
                {isUploading ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                    <RefreshCw size={26} className="animate-spin text-[#2459A8]" />
                    <h4 className="text-sm font-bold text-[#11183D]">Extracting Document...</h4>
                    <p className="text-xs text-[#526078]">Generating authoritative 6-pillar ATS score.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="p-1 bg-[#EFFAFD] text-[#2459A8] rounded-lg border border-[#DCE7F2]">
                            <ShieldCheck size={16} />
                          </span>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#2459A8] font-mono">
                            Independent Quality
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-[#11183D] mt-1">
                          ATS Quality Score
                        </h3>
                        <p className="text-[11px] text-[#526078] mt-0.5">
                          Role-independent 6-pillar authoritative benchmark.
                        </p>
                      </div>

                      <div className="flex flex-col items-end">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black font-mono text-[#11183D]">
                            {currentAtsAnalysis.totalScore}
                          </span>
                          <span className="text-xs text-[#7B8799] font-mono">/100</span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border mt-1 ${
                            currentAtsAnalysis.totalScore >= 80
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : currentAtsAnalysis.totalScore >= 65
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          {currentAtsAnalysis.grade}
                        </span>
                      </div>
                    </div>

                    {/* 6-Pillars Mini Meters */}
                    <div className="grid grid-cols-3 gap-1.5 pt-2.5 border-t border-slate-100 text-[10px]">
                      <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-200/80">
                        <div className="flex justify-between font-semibold text-slate-600">
                          <span>Struct</span>
                          <span className="font-mono text-[#2459A8]">{currentAtsAnalysis.breakdown.structureScore}</span>
                        </div>
                      </div>
                      <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-200/80">
                        <div className="flex justify-between font-semibold text-slate-600">
                          <span>Complete</span>
                          <span className="font-mono text-emerald-700">{currentAtsAnalysis.breakdown.completenessScore}</span>
                        </div>
                      </div>
                      <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-200/80">
                        <div className="flex justify-between font-semibold text-slate-600">
                          <span>Extract</span>
                          <span className="font-mono text-indigo-700">{currentAtsAnalysis.breakdown.extractabilityScore}</span>
                        </div>
                      </div>
                      <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-200/80">
                        <div className="flex justify-between font-semibold text-slate-600">
                          <span>Skills</span>
                          <span className="font-mono text-blue-700">{currentAtsAnalysis.breakdown.skillsScore}</span>
                        </div>
                      </div>
                      <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-200/80">
                        <div className="flex justify-between font-semibold text-slate-600">
                          <span>Exp</span>
                          <span className="font-mono text-amber-700">{currentAtsAnalysis.breakdown.experienceQualityScore}</span>
                        </div>
                      </div>
                      <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-200/80">
                        <div className="flex justify-between font-semibold text-slate-600">
                          <span>Format</span>
                          <span className="font-mono text-purple-700">{currentAtsAnalysis.breakdown.formattingScore}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Score Card B: Target Role Match */}
              <div className="p-5 sm:p-6 bg-white rounded-3xl border border-[#DCE7F2] shadow-xs space-y-4 flex flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="p-1 bg-[#EFFAFD] text-[#2459A8] rounded-lg border border-[#DCE7F2]">
                        <Target size={16} />
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#2459A8] font-mono">
                        Standard Role Match
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#11183D] mt-1">
                      {enteredRoleResult?.matchedRoleProfileTitle || targetRoleInput || 'Job Role Match'}
                    </h3>
                    <p className="text-[11px] text-[#526078] mt-0.5">
                      Against industry-standard benchmark profiles.
                    </p>
                  </div>

                  <div className="flex flex-col items-end">
                    {enteredRoleResult ? (
                      enteredRoleResult.status === 'MATCHED' ? (
                        <>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black font-mono text-emerald-700">
                              {enteredRoleResult.score}%
                            </span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg border bg-emerald-50 text-emerald-800 border-emerald-200 mt-1">
                            Role Matched
                          </span>
                        </>
                      ) : enteredRoleResult.status === 'NOT_RELEVANT' ? (
                        <>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black font-mono text-amber-700">
                              N/A
                            </span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg border bg-amber-50 text-amber-800 border-amber-200 mt-1">
                            Not Relevant
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black font-mono text-slate-400">
                              —
                            </span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg border bg-slate-100 text-slate-700 border-slate-200 mt-1">
                            Unknown Role
                          </span>
                        </>
                      )
                    ) : (
                      <>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black font-mono text-slate-400">
                            —
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg border bg-slate-100 text-slate-700 border-slate-200 mt-1">
                          Ready to Evaluate
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Sub-signals or Prompt */}
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px]">
                  {enteredRoleResult ? (
                    enteredRoleResult.status === 'MATCHED' ? (
                      <div className="grid grid-cols-2 gap-1.5 text-[10.5px]">
                        <div className="flex justify-between">
                          <span className="text-[#526078]">Semantic:</span>
                          <span className="font-mono font-bold text-[#2459A8]">{Math.round(enteredRoleResult.semanticSimilarity * 100)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#526078]">Skills:</span>
                          <span className="font-mono font-bold text-emerald-700">{Math.round(enteredRoleResult.skillOverlap * 100)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#526078]">Experience:</span>
                          <span className="font-mono font-bold text-purple-700">{Math.round(enteredRoleResult.experienceRelevance * 100)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#526078]">Terminology:</span>
                          <span className="font-mono font-bold text-amber-700">{Math.round(enteredRoleResult.terminologyMatch * 100)}%</span>
                        </div>
                      </div>
                    ) : enteredRoleResult.status === 'NOT_RELEVANT' ? (
                      <span className="text-amber-800 font-medium text-[11px] line-clamp-2">
                        ⚠ {enteredRoleResult.relevanceGate?.reason || 'Baseline domain gate not passed.'}
                      </span>
                    ) : (
                      <span className="text-slate-600 text-[11px]">
                        Role profile not found. Select from standard catalog below.
                      </span>
                    )
                  ) : (
                    <div className="flex items-center justify-between text-[#526078]">
                      <span>Role: {targetRoleInput}</span>
                      <button
                        onClick={() => handleRunEnteredRoleMatch()}
                        disabled={isMatchingEnteredRole}
                        className="text-[#2459A8] font-bold hover:underline cursor-pointer"
                      >
                        Evaluate now →
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Score Card C: My Saved Target Role Match */}
              <div className="p-5 sm:p-6 bg-white rounded-3xl border border-[#DCE7F2] shadow-xs space-y-4 flex flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="p-1 bg-[#EFFAFD] text-[#2459A8] rounded-lg border border-[#DCE7F2]">
                        <BookmarkCheck size={16} />
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#2459A8] font-mono">
                        Account Target Role
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#11183D] mt-1 truncate max-w-[180px]" title={profile?.targetRole || 'Not Configured'}>
                      {profile?.targetRole || 'Not Configured'}
                    </h3>
                    <p className="text-[11px] text-[#526078] mt-0.5">
                      Primary career target saved in account profile.
                    </p>
                  </div>

                  <div className="flex flex-col items-end">
                    {savedRoleResult ? (
                      savedRoleResult.status === 'MATCHED' ? (
                        <>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black font-mono text-emerald-700">
                              {savedRoleResult.score}%
                            </span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg border bg-emerald-50 text-emerald-800 border-emerald-200 mt-1">
                            Role Matched
                          </span>
                        </>
                      ) : savedRoleResult.status === 'NOT_RELEVANT' ? (
                        <>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black font-mono text-amber-700">
                              N/A
                            </span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg border bg-amber-50 text-amber-800 border-amber-200 mt-1">
                            Not Relevant
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black font-mono text-slate-400">
                              —
                            </span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg border bg-slate-100 text-slate-700 border-slate-200 mt-1">
                            Unknown Role
                          </span>
                        </>
                      )
                    ) : (
                      <>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black font-mono text-slate-400">
                            —
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg border bg-slate-100 text-slate-700 border-slate-200 mt-1">
                          {profile?.targetRole ? 'Unchecked' : 'No Saved Role'}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Sub-signals or Button */}
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px]">
                  {savedRoleResult ? (
                    savedRoleResult.status === 'MATCHED' ? (
                      <div className="grid grid-cols-2 gap-1.5 text-[10.5px]">
                        <div className="flex justify-between">
                          <span className="text-[#526078]">Semantic:</span>
                          <span className="font-mono font-bold text-[#2459A8]">{Math.round(savedRoleResult.semanticSimilarity * 100)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#526078]">Skills:</span>
                          <span className="font-mono font-bold text-emerald-700">{Math.round(savedRoleResult.skillOverlap * 100)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#526078]">Experience:</span>
                          <span className="font-mono font-bold text-purple-700">{Math.round(savedRoleResult.experienceRelevance * 100)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#526078]">Terminology:</span>
                          <span className="font-mono font-bold text-amber-700">{Math.round(savedRoleResult.terminologyMatch * 100)}%</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-amber-800 font-medium text-[11px]">
                        ⚠ {savedRoleResult.relevanceGate?.reason || 'Baseline relevance gate not passed.'}
                      </span>
                    )
                  ) : profile?.targetRole ? (
                    <button
                      onClick={handleRunSavedRoleMatch}
                      disabled={isMatchingSavedRole}
                      className="w-full text-center text-[#2459A8] font-bold hover:underline cursor-pointer flex items-center justify-center gap-1"
                    >
                      <RefreshCw size={12} className={isMatchingSavedRole ? 'animate-spin' : ''} />
                      <span>{isMatchingSavedRole ? 'Evaluating...' : `Evaluate Against "${profile.targetRole}" →`}</span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-between text-[#526078]">
                      <span>No saved target role</span>
                      <button
                        onClick={() => navigate('/settings')}
                        className="text-[#2459A8] font-bold hover:underline cursor-pointer"
                      >
                        Set in Settings →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. ATS 6-Pillars Detailed Quality Audit */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold font-display text-[#11183D]">
                  6-Pillar ATS Compatibility Breakdown
                </h3>
                <p className="text-xs text-[#526078]">
                  Authoritative scoring across all critical ATS parsing and screening criteria.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Pillar 1 */}
                <div className="p-5 bg-white rounded-2xl border border-[#DCE7F2] shadow-2xs space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-[#11183D]">1. Structure</span>
                    <span className="font-mono font-bold text-xs text-[#2459A8]">{currentAtsAnalysis.breakdown.structureScore} / 20</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#2459A8]" style={{ width: `${(currentAtsAnalysis.breakdown.structureScore / 20) * 100}%` }} />
                  </div>
                  <p className="text-xs text-[#526078]">
                    Validates standard section titles, contact positioning, and clear resume layout hierarchy.
                  </p>
                </div>

                {/* Pillar 2 */}
                <div className="p-5 bg-white rounded-2xl border border-[#DCE7F2] shadow-2xs space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-[#11183D]">2. Content Completeness</span>
                    <span className="font-mono font-bold text-xs text-emerald-700">{currentAtsAnalysis.breakdown.completenessScore} / 20</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${(currentAtsAnalysis.breakdown.completenessScore / 20) * 100}%` }} />
                  </div>
                  <p className="text-xs text-[#526078]">
                    Audits required sections: contact info, summary, work history, education, and technical skills.
                  </p>
                </div>

                {/* Pillar 3 */}
                <div className="p-5 bg-white rounded-2xl border border-[#DCE7F2] shadow-2xs space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-[#11183D]">3. ATS Extractability</span>
                    <span className="font-mono font-bold text-xs text-indigo-700">{currentAtsAnalysis.breakdown.extractabilityScore} / 20</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${(currentAtsAnalysis.breakdown.extractabilityScore / 20) * 100}%` }} />
                  </div>
                  <p className="text-xs text-[#526078]">
                    Ensures Docling clean plain-text parsing without OCR artifacts or corrupted characters.
                  </p>
                </div>

                {/* Pillar 4 */}
                <div className="p-5 bg-white rounded-2xl border border-[#DCE7F2] shadow-2xs space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-[#11183D]">4. Skills & Technical Content</span>
                    <span className="font-mono font-bold text-xs text-blue-700">{currentAtsAnalysis.breakdown.skillsScore} / 15</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${(currentAtsAnalysis.breakdown.skillsScore / 15) * 100}%` }} />
                  </div>
                  <p className="text-xs text-[#526078]">
                    Checks explicit categorization of languages, frameworks, developer tools, and libraries.
                  </p>
                </div>

                {/* Pillar 5 */}
                <div className="p-5 bg-white rounded-2xl border border-[#DCE7F2] shadow-2xs space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-[#11183D]">5. Experience & Achievement Quality</span>
                    <span className="font-mono font-bold text-xs text-amber-700">{currentAtsAnalysis.breakdown.experienceQualityScore} / 15</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${(currentAtsAnalysis.breakdown.experienceQualityScore / 15) * 100}%` }} />
                  </div>
                  <p className="text-xs text-[#526078]">
                    Evaluates presence of strong action verbs and quantified impact metrics in bullet points.
                  </p>
                </div>

                {/* Pillar 6 */}
                <div className="p-5 bg-white rounded-2xl border border-[#DCE7F2] shadow-2xs space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-[#11183D]">6. Basic ATS Formatting</span>
                    <span className="font-mono font-bold text-xs text-purple-700">{currentAtsAnalysis.breakdown.formattingScore} / 10</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${(currentAtsAnalysis.breakdown.formattingScore / 10) * 100}%` }} />
                  </div>
                  <p className="text-xs text-[#526078]">
                    Standard single-column flow, safe glyphs, standard fonts, and ATS-parseable dates.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Standardized Role Match Center */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2459A8] font-mono">
                    BGE Neural Role Match Engine
                  </span>
                </div>
                <h3 className="text-xl font-bold font-display text-[#11183D] mt-1">
                  Standardized Role Match Center
                </h3>
                <p className="text-xs text-[#526078]">
                  Evaluate your resume directly against curated industry role profiles (responsibilities, required skills, and domain terminology) without requiring a long job description.
                </p>
              </div>

              {/* Box 1: Role-Only Matching against Standardized Profile */}
              <div className="p-6 bg-white rounded-3xl border border-[#DCE7F2] shadow-xs space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-base font-bold text-[#11183D] flex items-center gap-2">
                      <Target size={18} className="text-[#2459A8]" />
                      <span>Target Role Evaluation</span>
                    </h4>
                    <p className="text-xs text-[#526078] mt-0.5">
                      Select or type a target role to benchmark against its standardized curriculum and expectations.
                    </p>
                  </div>
                </div>

                {/* Role Quick Selector Pills */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#11183D]">Popular Standard Roles</label>
                  <div className="flex flex-wrap gap-2">
                    {STANDARD_ROLE_SUGGESTIONS.map((role) => {
                      const isSelected = targetRoleInput.toLowerCase() === role.toLowerCase();
                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() => {
                            setTargetRoleInput(role);
                            if (enteredRoleResult && enteredRoleResult.role.toLowerCase() !== role.toLowerCase()) {
                              setEnteredRoleResult(null);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#2459A8] text-white border-[#2459A8] shadow-2xs font-semibold'
                              : 'bg-slate-50 text-slate-700 border-[#DCE7F2] hover:bg-slate-100 hover:border-slate-300'
                          }`}
                        >
                          {role}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Role Input and Action */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-[#11183D] mb-1">Target Role Title</label>
                    <input
                      type="text"
                      value={targetRoleInput}
                      onChange={(e) => {
                        setTargetRoleInput(e.target.value);
                        if (enteredRoleResult && enteredRoleResult.role.toLowerCase() !== e.target.value.toLowerCase()) {
                          setEnteredRoleResult(null);
                        }
                      }}
                      placeholder="e.g. Frontend Developer, Cybersecurity Analyst, Backend Developer..."
                      className="w-full p-2.5 bg-slate-50 border border-[#DCE7F2] rounded-xl text-xs focus:outline-none focus:border-[#2459A8]"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <button
                      onClick={() => handleRunEnteredRoleMatch()}
                      disabled={isMatchingEnteredRole || !targetRoleInput.trim()}
                      className="w-full py-2.5 bg-[#2459A8] hover:bg-[#1d4787] disabled:opacity-50 text-white rounded-xl text-xs font-bold font-display flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                    >
                      <RefreshCw size={14} className={isMatchingEnteredRole ? 'animate-spin' : ''} />
                      <span>{isMatchingEnteredRole ? 'Evaluating...' : 'Evaluate Role'}</span>
                    </button>
                  </div>
                </div>

                {/* Evaluated Role Details Display */}
                {enteredRoleResult && (
                  <div className="pt-4 border-t border-slate-100 space-y-4">
                    <div className="p-4 rounded-2xl border bg-slate-50 border-slate-200/80 space-y-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#2459A8] font-mono">
                              Evaluated Profile:
                            </span>
                            <span className="text-sm font-bold text-[#11183D]">
                              {enteredRoleResult.matchedRoleProfileTitle || enteredRoleResult.role}
                            </span>
                          </div>
                          {enteredRoleResult.explanation && (
                            <p className="text-xs text-[#526078] mt-1 leading-relaxed">
                              {enteredRoleResult.explanation}
                            </p>
                          )}
                        </div>

                        <div className="shrink-0">
                          {enteredRoleResult.status === 'MATCHED' ? (
                            <span className="inline-flex items-center gap-1 text-sm font-black font-mono text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-xl border border-emerald-300">
                              <CheckCircle2 size={16} className="text-emerald-600" />
                              <span>{enteredRoleResult.score}% Match</span>
                            </span>
                          ) : enteredRoleResult.status === 'NOT_RELEVANT' ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100/80 px-3 py-1 rounded-xl border border-amber-300">
                              <AlertTriangle size={15} className="text-amber-600" />
                              <span>Not Relevant (N/A)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-200/80 px-3 py-1 rounded-xl border border-slate-300">
                              <HelpCircle size={15} className="text-slate-500" />
                              <span>Unknown Role Profile</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Not Relevant Reason Notice */}
                      {enteredRoleResult.status === 'NOT_RELEVANT' && (
                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                          <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">Relevance Gate: </span>
                            <span>{enteredRoleResult.relevanceGate?.reason || 'The resume content does not have sufficient overlap with this role’s baseline domain requirements.'}</span>
                          </div>
                        </div>
                      )}

                      {/* Unknown Role Notice */}
                      {enteredRoleResult.status === 'UNKNOWN_ROLE' && (
                        <div className="p-3 bg-slate-100 rounded-xl border border-slate-300 text-xs text-slate-800 flex items-start gap-2">
                          <HelpCircle size={16} className="text-slate-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">Role not in standard catalog: </span>
                            <span>{enteredRoleResult.explanation || 'We do not have a curated profile for this exact title yet. Please select one of our standard roles above.'}</span>
                          </div>
                        </div>
                      )}

                      {/* Signal Breakdown if Matched */}
                      {enteredRoleResult.status === 'MATCHED' && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/60 text-xs">
                          <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                            <span className="text-[10.5px] text-[#526078] block">Semantic Match (45%)</span>
                            <span className="font-mono font-bold text-sm text-[#2459A8]">{Math.round(enteredRoleResult.semanticSimilarity * 100)}%</span>
                          </div>
                          <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                            <span className="text-[10.5px] text-[#526078] block">Skill Overlap (25%)</span>
                            <span className="font-mono font-bold text-sm text-emerald-700">{Math.round(enteredRoleResult.skillOverlap * 100)}%</span>
                          </div>
                          <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                            <span className="text-[10.5px] text-[#526078] block">Experience Match (15%)</span>
                            <span className="font-mono font-bold text-sm text-purple-700">{Math.round(enteredRoleResult.experienceRelevance * 100)}%</span>
                          </div>
                          <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                            <span className="text-[10.5px] text-[#526078] block">Terminology (15%)</span>
                            <span className="font-mono font-bold text-sm text-amber-700">{Math.round(enteredRoleResult.terminologyMatch * 100)}%</span>
                          </div>
                        </div>
                      )}

                      {/* Skills Breakdown */}
                      {(enteredRoleResult.matchedSkills.length > 0 || enteredRoleResult.missingSkills.length > 0) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1.5">
                            <h5 className="text-[11.5px] font-bold text-emerald-900 flex items-center gap-1.5">
                              <CheckCircle2 size={14} className="text-emerald-600" />
                              <span>Matching Skills ({enteredRoleResult.matchedSkills.length})</span>
                            </h5>
                            <div className="flex flex-wrap gap-1">
                              {enteredRoleResult.matchedSkills.length > 0 ? (
                                enteredRoleResult.matchedSkills.map((s, i) => (
                                  <span key={i} className="text-[10px] font-mono bg-white text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                                    {s}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[11px] text-slate-500 italic">No direct keyword overlap</span>
                              )}
                            </div>
                          </div>

                          <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 space-y-1.5">
                            <h5 className="text-[11.5px] font-bold text-rose-900 flex items-center gap-1.5">
                              <XCircle size={14} className="text-rose-600" />
                              <span>Missing Relevant Skills ({enteredRoleResult.missingSkills.length})</span>
                            </h5>
                            <div className="flex flex-wrap gap-1">
                              {enteredRoleResult.missingSkills.length > 0 ? (
                                enteredRoleResult.missingSkills.map((s, i) => (
                                  <span key={i} className="text-[10px] font-mono bg-white text-rose-800 px-2 py-0.5 rounded border border-rose-200">
                                    {s}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[11px] text-slate-500 italic">All key benchmark skills present</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Box 2: Evaluate Against My Target Role (Account Saved Profile) */}
              <div className="p-6 bg-white rounded-3xl border border-[#DCE7F2] shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-base font-bold text-[#11183D] flex items-center gap-2">
                      <BookmarkCheck size={18} className="text-[#2459A8]" />
                      <span>Evaluate Against My Saved Target Role</span>
                    </h4>
                    <p className="text-xs text-[#526078] mt-0.5">
                      Target role configured in your account profile: <strong className="text-[#11183D]">{profile?.targetRole || 'None configured'}</strong>
                    </p>
                  </div>

                  {profile?.targetRole ? (
                    <button
                      onClick={handleRunSavedRoleMatch}
                      disabled={isMatchingSavedRole}
                      className="px-4 py-2.5 bg-[#2459A8] hover:bg-[#1d4787] disabled:opacity-50 text-white rounded-xl text-xs font-bold font-display flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors shrink-0"
                    >
                      <RefreshCw size={14} className={isMatchingSavedRole ? 'animate-spin' : ''} />
                      <span>{isMatchingSavedRole ? 'Evaluating...' : `Evaluate Against "${profile.targetRole}"`}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/settings')}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                    >
                      <span>Set Target Role in Settings</span>
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>

                {/* Saved Role Result Card */}
                {savedRoleResult && (
                  <div className="p-4 rounded-2xl border bg-slate-50 border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#2459A8] font-mono">
                          Saved Account Target:
                        </span>
                        <h5 className="text-sm font-bold text-[#11183D] mt-0.5">
                          {savedRoleResult.matchedRoleProfileTitle || savedRoleResult.role}
                        </h5>
                      </div>

                      <div>
                        {savedRoleResult.status === 'MATCHED' ? (
                          <span className="inline-flex items-center gap-1 text-sm font-black font-mono text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-xl border border-emerald-300">
                            <CheckCircle2 size={16} className="text-emerald-600" />
                            <span>{savedRoleResult.score}% Match</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100/80 px-3 py-1 rounded-xl border border-amber-300">
                            <AlertTriangle size={15} className="text-amber-600" />
                            <span>Not Relevant (Score: N/A)</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {savedRoleResult.explanation && (
                      <p className="text-xs text-[#526078] leading-relaxed">
                        {savedRoleResult.explanation}
                      </p>
                    )}

                    {/* Skills Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1.5">
                        <span className="text-xs font-bold text-emerald-900 block">
                          Matching Skills ({savedRoleResult.matchedSkills.length})
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {savedRoleResult.matchedSkills.map((s, i) => (
                            <span key={i} className="text-[10px] font-mono bg-white text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 space-y-1.5">
                        <span className="text-xs font-bold text-rose-900 block">
                          Missing Relevant Skills ({savedRoleResult.missingSkills.length})
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {savedRoleResult.missingSkills.map((s, i) => (
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

              {/* Box 3: Advanced Option - Custom Job Description Evaluation (Collapsible) */}
              <div className="bg-white rounded-3xl border border-[#DCE7F2] shadow-xs overflow-hidden">
                <button
                  type="button"
                  onClick={() => setIsCustomJdOpen(!isCustomJdOpen)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-slate-100 text-slate-700 rounded-xl">
                      <FileText size={18} />
                    </span>
                    <div>
                      <h4 className="text-base font-bold text-[#11183D]">
                        Evaluate Against Custom Job Description (Advanced Option)
                      </h4>
                      <p className="text-xs text-[#526078] mt-0.5">
                        Optional: Match your resume against a specific employer vacancy posting instead of generic industry profiles.
                      </p>
                    </div>
                  </div>

                  <span className="text-slate-500 p-1">
                    {isCustomJdOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </span>
                </button>

                {isCustomJdOpen && (
                  <div className="p-6 pt-0 border-t border-slate-100 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                      <div>
                        <label className="block text-xs font-bold text-[#11183D] mb-1">Target Company (Optional)</label>
                        <input
                          type="text"
                          value={customCompanyName}
                          onChange={(e) => setCustomCompanyName(e.target.value)}
                          placeholder="e.g. Google, Stripe, Microsoft"
                          className="w-full p-2.5 bg-slate-50 border border-[#DCE7F2] rounded-xl text-xs focus:outline-none focus:border-[#2459A8]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#11183D] mb-1">Target Role Title (Optional)</label>
                        <input
                          type="text"
                          value={customJobRole}
                          onChange={(e) => setCustomJobRole(e.target.value)}
                          placeholder="e.g. Senior Software Engineer"
                          className="w-full p-2.5 bg-slate-50 border border-[#DCE7F2] rounded-xl text-xs focus:outline-none focus:border-[#2459A8]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#11183D] mb-1">Target Job Description (JD)</label>
                      <textarea
                        rows={5}
                        value={customJdText}
                        onChange={(e) => setCustomJdText(e.target.value)}
                        placeholder="Paste employer job description requirements, responsibilities, and qualifications..."
                        className="w-full p-3 bg-slate-50 border border-[#DCE7F2] rounded-xl text-xs font-sans leading-relaxed focus:outline-none focus:border-[#2459A8]"
                      />
                    </div>

                    <button
                      onClick={handleRunCustomJdMatch}
                      disabled={isMatchingCustomJd || !customJdText.trim()}
                      className="w-full py-3 bg-[#2459A8] hover:bg-[#1d4787] disabled:opacity-50 text-white rounded-xl text-xs font-bold font-display flex items-center justify-center gap-2 shadow-2xs cursor-pointer transition-colors"
                    >
                      <RefreshCw size={15} className={isMatchingCustomJd ? 'animate-spin' : ''} />
                      <span>{isMatchingCustomJd ? 'Evaluating Custom JD Embeddings...' : 'Calculate Custom JD Match Score'}</span>
                    </button>

                    {/* Custom JD Result Display */}
                    {customJdResult && (
                      <div className="pt-4 border-t border-slate-100 space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-[#2459A8] font-mono">
                              Custom Vacancy Evaluation
                            </span>
                            <h5 className="text-sm font-bold text-[#11183D] mt-0.5">
                              {customCompanyName ? `${customCompanyName} — ` : ''}{customJobRole || 'Job Description'}
                            </h5>
                          </div>

                          <div>
                            {customJdResult.status === 'MATCHED' ? (
                              <span className="inline-flex items-center gap-1 text-sm font-black font-mono text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-xl border border-emerald-300">
                                <CheckCircle2 size={16} className="text-emerald-600" />
                                <span>{customJdResult.score}% Match</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100/80 px-3 py-1 rounded-xl border border-amber-300">
                                <AlertTriangle size={15} className="text-amber-600" />
                                <span>Not Relevant (Score: N/A)</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {customJdResult.status === 'MATCHED' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
                              <h5 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                                <CheckCircle2 size={14} className="text-emerald-600" />
                                <span>Matched Keywords ({customJdResult.matchedSkills.length})</span>
                              </h5>
                              <div className="flex flex-wrap gap-1">
                                {customJdResult.matchedSkills.map((s, i) => (
                                  <span key={i} className="text-[10.5px] font-mono bg-white text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-200 space-y-2">
                              <h5 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                                <XCircle size={14} className="text-rose-600" />
                                <span>Missing Keywords ({customJdResult.missingSkills.length})</span>
                              </h5>
                              <div className="flex flex-wrap gap-1">
                                {customJdResult.missingSkills.length > 0 ? (
                                  customJdResult.missingSkills.map((s, i) => (
                                    <span key={i} className="text-[10.5px] font-mono bg-white text-rose-800 px-2 py-0.5 rounded border border-rose-200">
                                      {s}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-xs text-slate-500 italic">No critical keywords missing</span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 4. Actionable Improvement Recommendations */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold font-display text-[#11183D]">
                  Actionable Improvement Recommendations
                </h3>
                <p className="text-xs text-[#526078]">
                  Prioritized feedback derived strictly from extracted findings. No fabricated qualifications.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Definite Format Checks & Warnings */}
                <div className="p-5 bg-white rounded-3xl border border-[#DCE7F2] shadow-2xs space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#11183D] flex items-center gap-1.5">
                    <ShieldCheck size={15} className="text-[#2459A8]" />
                    <span>Definite Issues & Format Checks</span>
                  </h4>
                  <div className="space-y-2">
                    {currentAtsAnalysis.formatChecks.map((chk, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                          chk.passed
                            ? 'bg-emerald-50/40 border-emerald-200 text-emerald-900'
                            : 'bg-rose-50/40 border-rose-200 text-rose-900'
                        }`}
                      >
                        {chk.passed ? (
                          <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle size={15} className="text-rose-600 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className="font-bold">{chk.title}: </span>
                          <span className="text-slate-700">{chk.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bullet Points Quality & Metrics Optimization */}
                <div className="p-5 bg-white rounded-3xl border border-[#DCE7F2] shadow-2xs space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#11183D] flex items-center gap-1.5">
                      <Sparkles size={15} className="text-amber-600" />
                      <span>Bullet Point Quality & Metrics Optimization</span>
                    </h4>
                    {currentAtsAnalysis.recommendationSummary && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {currentAtsAnalysis.recommendationSummary.healthPercentage}% Clean Quality
                      </span>
                    )}
                  </div>

                  {/* Summary Stats */}
                  {currentAtsAnalysis.recommendationSummary && (
                    <div className="grid grid-cols-4 gap-2 p-2.5 bg-slate-50 border border-[#DCE7F2] rounded-2xl text-center">
                      <div>
                        <span className="text-[9.5px] uppercase font-bold text-[#526078] block">Evaluated</span>
                        <span className="text-xs font-bold text-[#11183D] font-mono">{currentAtsAnalysis.recommendationSummary.bulletsEvaluated}</span>
                      </div>
                      <div>
                        <span className="text-[9.5px] uppercase font-bold text-[#526078] block">With Issues</span>
                        <span className="text-xs font-bold text-amber-600 font-mono">{currentAtsAnalysis.recommendationSummary.bulletsWithIssues}</span>
                      </div>
                      <div>
                        <span className="text-[9.5px] uppercase font-bold text-[#526078] block">Unique Recs</span>
                        <span className="text-xs font-bold text-[#2459A8] font-mono">{currentAtsAnalysis.recommendationSummary.uniqueRecommendationsCount}</span>
                      </div>
                      <div>
                        <span className="text-[9.5px] uppercase font-bold text-[#526078] block">Issue Rate</span>
                        <span className="text-xs font-bold text-[#526078] font-mono">{currentAtsAnalysis.recommendationSummary.issuePercentage}%</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2.5">
                    {(currentAtsAnalysis.recommendationGroups && currentAtsAnalysis.recommendationGroups.length > 0) ? (
                      currentAtsAnalysis.recommendationGroups.map((group) => {
                        const isCorrupt = group.isFlaggedForReview || group.category === 'TEXT_CORRUPTION';
                        return (
                          <div
                            key={group.id}
                            className={`p-3 rounded-xl border text-xs space-y-2 ${
                              isCorrupt
                                ? 'bg-rose-50/70 border-rose-200'
                                : 'bg-slate-50 border-[#DCE7F2]'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-0.5">
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                                    isCorrupt
                                      ? 'bg-rose-100 text-rose-800'
                                      : group.category === 'VAGUE_OWNERSHIP'
                                      ? 'bg-amber-100 text-amber-800'
                                      : group.category === 'WEAK_ACTION_VERB'
                                      ? 'bg-blue-100 text-blue-800'
                                      : group.category === 'UNCLEAR_TECH'
                                      ? 'bg-purple-100 text-purple-800'
                                      : 'bg-indigo-100 text-indigo-800'
                                  }`}
                                >
                                  {group.title}
                                </span>
                                <p className="text-[#11183D] font-medium text-[11.5px] mt-1">
                                  {group.feedback}
                                </p>
                              </div>
                              <span className="text-[10px] font-bold text-[#526078] bg-white border border-[#DCE7F2] px-2 py-0.5 rounded-full shrink-0">
                                {group.affectedBullets.length} {group.affectedBullets.length === 1 ? 'bullet' : 'bullets'}
                              </span>
                            </div>

                            {isCorrupt && (
                              <div className="p-2 bg-rose-100/80 border border-rose-200 rounded-lg text-[10.5px] text-rose-900 flex items-start gap-1.5">
                                <AlertTriangle size={13} className="text-rose-600 shrink-0 mt-0.5" />
                                <span>Flagged for Review: Potential text corruption detected. Verify source text directly.</span>
                              </div>
                            )}

                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-[#526078] uppercase tracking-wider block">
                                Affected Entries:
                              </span>
                              <div className="space-y-1">
                                {group.affectedBullets.slice(0, 3).map((b) => (
                                  <div key={b.id} className="p-1.5 bg-white rounded-lg border border-slate-200 text-[11px]">
                                    <span className="font-mono text-[9.5px] text-[#526078] block">{b.context}</span>
                                    <p className="text-slate-700 italic truncate">"{b.original}"</p>
                                  </div>
                                ))}
                                {group.affectedBullets.length > 3 && (
                                  <p className="text-[10px] text-[#526078] italic">
                                    + {group.affectedBullets.length - 3} more affected bullets
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl">
                        {(currentAtsAnalysis.recommendationSummary?.bulletsEvaluated ?? 0) === 0
                          ? 'No experience or project bullets found in this resume version.'
                          : 'All analyzed bullet points feature strong action verbs, clear technical scope, and validated impact.'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Footer Transition CTA */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-base font-bold font-display">Ready to create or edit a resume from this analysis?</h4>
                <p className="text-xs text-slate-400">
                  Open the Resume Builder to customize sections, select from 8 ATS layouts, and export to PDF using retained canonical data.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsCopilotOpen(true)}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold font-display flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles size={14} />
                  <span>AI Copilot</span>
                </button>
                <button
                  onClick={() => setWorkspaceMode('EDITOR')}
                  className="px-4 py-2.5 bg-[#4A8BDF] hover:bg-blue-600 text-white rounded-xl text-xs font-bold font-display flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Layout size={14} />
                  <span>Create Resume / Open Builder</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ─── 3-PANE TEMPLATE STUDIO & RESUME EDITOR VIEW ─── */
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

          {/* PANE 2: Form Editor (Center Column) */}
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

                {/* Bullet Quality Diagnostics */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#11183D]">Bullet Point Quality Diagnostics</h4>
                    {currentAtsAnalysis.recommendationSummary && (
                      <span className="text-xs font-bold text-[#2459A8] font-mono">
                        {currentAtsAnalysis.recommendationSummary.bulletsEvaluated} Bullets Evaluated • {currentAtsAnalysis.recommendationSummary.healthPercentage}% Clean Health
                      </span>
                    )}
                  </div>

                  {/* Summary Bar */}
                  {currentAtsAnalysis.recommendationSummary && (
                    <div className="grid grid-cols-4 gap-2.5 p-3 bg-slate-50 border border-[#DCE7F2] rounded-2xl text-center">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#526078] block">Evaluated</span>
                        <span className="text-sm font-bold text-[#11183D] font-mono">{currentAtsAnalysis.recommendationSummary.bulletsEvaluated}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#526078] block">With Issues</span>
                        <span className="text-sm font-bold text-amber-600 font-mono">{currentAtsAnalysis.recommendationSummary.bulletsWithIssues}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#526078] block">Unique Actions</span>
                        <span className="text-sm font-bold text-[#2459A8] font-mono">{currentAtsAnalysis.recommendationSummary.uniqueRecommendationsCount}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#526078] block">Clean Quality</span>
                        <span className="text-sm font-bold text-emerald-600 font-mono">{currentAtsAnalysis.recommendationSummary.healthPercentage}%</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2.5">
                    {(currentAtsAnalysis.recommendationGroups && currentAtsAnalysis.recommendationGroups.length > 0) ? (
                      currentAtsAnalysis.recommendationGroups.map((group) => {
                        const isCorrupt = group.isFlaggedForReview || group.category === 'TEXT_CORRUPTION';
                        return (
                          <div
                            key={group.id}
                            className={`p-3.5 rounded-2xl border text-xs space-y-2.5 ${
                              isCorrupt
                                ? 'bg-rose-50/70 border-rose-200'
                                : 'bg-white border-[#DCE7F2] shadow-2xs'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-0.5">
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                                    isCorrupt
                                      ? 'bg-rose-100 text-rose-800'
                                      : group.category === 'VAGUE_OWNERSHIP'
                                      ? 'bg-amber-100 text-amber-800'
                                      : group.category === 'WEAK_ACTION_VERB'
                                      ? 'bg-blue-100 text-blue-800'
                                      : group.category === 'UNCLEAR_TECH'
                                      ? 'bg-purple-100 text-purple-800'
                                      : 'bg-indigo-100 text-indigo-800'
                                  }`}
                                >
                                  {group.title}
                                </span>
                                <p className="text-[#11183D] font-medium text-xs mt-1">
                                  {group.feedback}
                                </p>
                              </div>
                              <span className="text-[10px] font-bold text-[#526078] bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                                {group.affectedBullets.length} {group.affectedBullets.length === 1 ? 'bullet' : 'bullets'}
                              </span>
                            </div>

                            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-[#334155]">
                              <span className="font-bold text-[#2459A8] block mb-0.5">Actionable Guidance:</span>
                              <p>{group.actionableGuidance}</p>
                            </div>

                            {isCorrupt && (
                              <div className="p-2.5 bg-rose-100/80 border border-rose-200 rounded-xl text-[11px] text-rose-900 flex items-start gap-2">
                                <AlertTriangle size={14} className="text-rose-600 shrink-0 mt-0.5" />
                                <span>Flagged for Review: Potential text extraction corruption detected. Verify and correct source document.</span>
                              </div>
                            )}

                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-[#526078] uppercase tracking-wider block">
                                Affected Bullet Entries ({group.affectedBullets.length}):
                              </span>
                              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                                {group.affectedBullets.map((b) => (
                                  <div key={b.id} className="p-2 bg-slate-50/80 rounded-lg border border-slate-200 text-[11px]">
                                    <div className="flex items-center justify-between text-[10px] text-[#526078] font-mono">
                                      <span>{b.context}</span>
                                      <span>{b.id}</span>
                                    </div>
                                    <p className="text-slate-700 italic mt-0.5">"{b.original}"</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl">
                        {(currentAtsAnalysis.recommendationSummary?.bulletsEvaluated ?? 0) === 0
                          ? 'No experience or project bullets found in this resume version.'
                          : 'All analyzed bullet points feature strong action verbs, clear technical scope, and validated impact.'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ROLE MATCHING & BENCHMARKING VIEW (BGE Matcher + Standardized Profiles) */}
            {activeSection === 'COMPETITIVE_MATCH' && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2459A8] font-mono">
                    BGE Neural Match Engine
                  </span>
                  <h3 className="text-xl font-bold font-display text-[#11183D]">
                    Standardized Role Profile Matching
                  </h3>
                  <p className="text-xs text-[#526078] mt-1">
                    Evaluates resume semantic similarity, explicit skill overlap, experience relevance, and terminology against industry-standard role benchmarks.
                  </p>
                </div>

                {/* Role Selector Controls */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-[#DCE7F2] space-y-4 shadow-2xs">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#11183D]">Standard Role Profiles</label>
                    <div className="flex flex-wrap gap-1.5">
                      {STANDARD_ROLE_SUGGESTIONS.map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => {
                            setTargetRoleInput(role);
                            if (enteredRoleResult && enteredRoleResult.role.toLowerCase() !== role.toLowerCase()) {
                              setEnteredRoleResult(null);
                            }
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                            targetRoleInput.toLowerCase() === role.toLowerCase()
                              ? 'bg-[#2459A8] text-white border-[#2459A8]'
                              : 'bg-white text-slate-700 border-[#DCE7F2] hover:bg-slate-100'
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-bold text-[#11183D] mb-1">Target Role Title</label>
                      <input
                        type="text"
                        value={targetRoleInput}
                        onChange={(e) => {
                          setTargetRoleInput(e.target.value);
                          if (enteredRoleResult && enteredRoleResult.role.toLowerCase() !== e.target.value.toLowerCase()) {
                            setEnteredRoleResult(null);
                          }
                        }}
                        placeholder="e.g. Frontend Developer, Cybersecurity Analyst..."
                        className="w-full p-2 bg-white border border-[#DCE7F2] rounded-xl text-xs"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <button
                        onClick={() => handleRunEnteredRoleMatch()}
                        disabled={isMatchingEnteredRole || !targetRoleInput.trim()}
                        className="w-full py-2 bg-[#2459A8] hover:bg-[#1d4787] disabled:opacity-50 text-white rounded-xl text-xs font-bold font-display flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                      >
                        <RefreshCw size={13} className={isMatchingEnteredRole ? 'animate-spin' : ''} />
                        <span>{isMatchingEnteredRole ? 'Evaluating...' : 'Evaluate Role'}</span>
                      </button>
                    </div>
                  </div>

                  {profile?.targetRole && (
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      <span className="text-[#526078]">
                        Account Target Role: <strong className="text-[#11183D]">{profile.targetRole}</strong>
                      </span>
                      <button
                        onClick={handleRunSavedRoleMatch}
                        disabled={isMatchingSavedRole}
                        className="text-[#2459A8] font-bold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <RefreshCw size={12} className={isMatchingSavedRole ? 'animate-spin' : ''} />
                        <span>{isMatchingSavedRole ? 'Evaluating...' : 'Evaluate My Target Role →'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Role Match Results Display */}
                {enteredRoleResult && (
                  <div className="p-6 bg-white rounded-3xl border border-[#DCE7F2] space-y-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#DCE7F2]">
                      <div>
                        <span className="text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-mono bg-blue-50 text-[#2459A8] border border-blue-200">
                          Role Profile Evaluation
                        </span>
                        <h4 className="text-lg font-bold text-[#11183D] mt-1">
                          {enteredRoleResult.matchedRoleProfileTitle || enteredRoleResult.role}
                        </h4>
                        {enteredRoleResult.explanation && (
                          <p className="text-xs text-[#526078] mt-1">
                            {enteredRoleResult.explanation}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {enteredRoleResult.status === 'MATCHED' ? (
                          <div className="px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                            <span className="text-2xl font-black font-mono text-emerald-700">
                              {enteredRoleResult.score}%
                            </span>
                            <p className="text-[10px] text-emerald-800 font-bold uppercase">Role Matched</p>
                          </div>
                        ) : enteredRoleResult.status === 'NOT_RELEVANT' ? (
                          <div className="px-4 py-2 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                            <span className="text-2xl font-black font-mono text-amber-700">N/A</span>
                            <p className="text-[10px] text-amber-800 font-bold uppercase">Not Relevant</p>
                          </div>
                        ) : (
                          <div className="px-4 py-2 bg-slate-100 rounded-2xl border border-slate-300 text-center">
                            <span className="text-xl font-bold font-mono text-slate-700">Unknown</span>
                            <p className="text-[10px] text-slate-600 font-bold uppercase">Profile Missing</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Formula Component Breakdown if MATCHED */}
                    {enteredRoleResult.status === 'MATCHED' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="p-3.5 bg-slate-50 rounded-2xl border border-[#DCE7F2] space-y-1.5">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-[#11183D]">Semantic Match (45%)</span>
                            <span className="font-mono text-[#2459A8]">{Math.round(enteredRoleResult.semanticSimilarity * 100)}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-[#2459A8]" style={{ width: `${enteredRoleResult.semanticSimilarity * 100}%` }} />
                          </div>
                        </div>

                        <div className="p-3.5 bg-slate-50 rounded-2xl border border-[#DCE7F2] space-y-1.5">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-[#11183D]">Skill Overlap (25%)</span>
                            <span className="font-mono text-emerald-700">{Math.round(enteredRoleResult.skillOverlap * 100)}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${enteredRoleResult.skillOverlap * 100}%` }} />
                          </div>
                        </div>

                        <div className="p-3.5 bg-slate-50 rounded-2xl border border-[#DCE7F2] space-y-1.5">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-[#11183D]">Experience Relevance (15%)</span>
                            <span className="font-mono text-purple-700">{Math.round(enteredRoleResult.experienceRelevance * 100)}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-600" style={{ width: `${enteredRoleResult.experienceRelevance * 100}%` }} />
                          </div>
                        </div>

                        <div className="p-3.5 bg-slate-50 rounded-2xl border border-[#DCE7F2] space-y-1.5">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-[#11183D]">Terminology Match (15%)</span>
                            <span className="font-mono text-amber-700">{Math.round(enteredRoleResult.terminologyMatch * 100)}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500" style={{ width: `${enteredRoleResult.terminologyMatch * 100}%` }} />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Matched and Missing Skills */}
                    {(enteredRoleResult.matchedSkills.length > 0 || enteredRoleResult.missingSkills.length > 0) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-2">
                          <h5 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                            <CheckCircle2 size={14} className="text-emerald-600" />
                            <span>Matched Skills ({enteredRoleResult.matchedSkills.length})</span>
                          </h5>
                          <div className="flex flex-wrap gap-1">
                            {enteredRoleResult.matchedSkills.length > 0 ? (
                              enteredRoleResult.matchedSkills.map((s, i) => (
                                <span key={i} className="text-[10px] font-mono bg-white text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                                  {s}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-500 italic">No direct overlap</span>
                            )}
                          </div>
                        </div>

                        <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-2">
                          <h5 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                            <XCircle size={14} className="text-rose-600" />
                            <span>Missing Relevant Skills ({enteredRoleResult.missingSkills.length})</span>
                          </h5>
                          <div className="flex flex-wrap gap-1">
                            {enteredRoleResult.missingSkills.length > 0 ? (
                              enteredRoleResult.missingSkills.map((s, i) => (
                                <span key={i} className="text-[10px] font-mono bg-white text-rose-800 px-2 py-0.5 rounded border border-rose-200">
                                  {s}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-500 italic">All key benchmark skills present</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* DESIGN TEMPLATES SECTION */}
            {activeSection === 'TEMPLATES' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCE7F2] pb-3">
                  <div>
                    <h3 className="text-lg font-bold font-display text-[#11183D]">Select Resume Design Layout</h3>
                    <p className="text-xs text-[#526078]">
                      25 professional templates tailored for modern recruiters and ATS scanners
                    </p>
                  </div>
                  <span className="text-xs font-mono font-semibold text-[#2459A8] bg-[#EFFAFD] px-2.5 py-1 rounded-full border border-[#DCE7F2] shrink-0 self-start sm:self-auto">
                    {TEMPLATE_METADATA.filter(tmpl => {
                      const matchesSearch =
                        templateSearchQuery.trim() === '' ||
                        tmpl.name.toLowerCase().includes(templateSearchQuery.toLowerCase()) ||
                        tmpl.desc.toLowerCase().includes(templateSearchQuery.toLowerCase()) ||
                        tmpl.recommendedFor.toLowerCase().includes(templateSearchQuery.toLowerCase()) ||
                        tmpl.layoutStyle.toLowerCase().includes(templateSearchQuery.toLowerCase());
                      const matchesCategory =
                        templateCategoryFilter === 'ALL' || tmpl.category === templateCategoryFilter;
                      return matchesSearch && matchesCategory;
                    }).length} of {TEMPLATE_METADATA.length} Available
                  </span>
                </div>

                {/* Search & Category Filter Controls */}
                <div className="space-y-2.5">
                  <div className="relative">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={templateSearchQuery}
                      onChange={(e) => setTemplateSearchQuery(e.target.value)}
                      placeholder="Search templates by role, style, or industry..."
                      className="w-full pl-9 pr-8 py-2 bg-white rounded-xl border border-[#DCE7F2] text-xs text-[#11183D] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2459A8]/20 focus:border-[#2459A8]"
                    />
                    {templateSearchQuery && (
                      <button
                        onClick={() => setTemplateSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Category Filter Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                    {[
                      { id: 'ALL', label: `All (${TEMPLATE_METADATA.length})` },
                      { id: 'ATS-friendly', label: 'ATS-Friendly' },
                      { id: 'Modern professional', label: 'Modern Professional' },
                      { id: 'Technical specialist', label: 'Technical Specialist' },
                      { id: 'Academic and research', label: 'Academic & Research' },
                      { id: 'Creative and visual', label: 'Creative & Visual' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setTemplateCategoryFilter(cat.id)}
                        className={`px-3 py-1.5 rounded-xl font-medium text-xs whitespace-nowrap transition-colors cursor-pointer ${
                          templateCategoryFilter === cat.id
                            ? 'bg-[#2459A8] text-white shadow-2xs font-semibold'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-[#DCE7F2]'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 25 Templates Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-1">
                  {TEMPLATE_METADATA.filter(tmpl => {
                    const matchesSearch =
                      templateSearchQuery.trim() === '' ||
                      tmpl.name.toLowerCase().includes(templateSearchQuery.toLowerCase()) ||
                      tmpl.desc.toLowerCase().includes(templateSearchQuery.toLowerCase()) ||
                      tmpl.recommendedFor.toLowerCase().includes(templateSearchQuery.toLowerCase()) ||
                      tmpl.layoutStyle.toLowerCase().includes(templateSearchQuery.toLowerCase());
                    const matchesCategory =
                      templateCategoryFilter === 'ALL' || tmpl.category === templateCategoryFilter;
                    return matchesSearch && matchesCategory;
                  }).map((tmpl) => {
                    const isSelected = currentTemplate === tmpl.id;
                    return (
                      <div
                        key={tmpl.id}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2.5 ${
                          isSelected
                            ? 'border-[#2459A8] bg-[#EFFAFD] shadow-xs ring-2 ring-[#2459A8]/20'
                            : 'border-[#DCE7F2] bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-start justify-between gap-1.5">
                            <div>
                              <h4 className="font-bold text-xs text-[#11183D] flex items-center gap-1">
                                {tmpl.name}
                                {isSelected && (
                                  <span className="p-0.5 rounded-full bg-[#2459A8] text-white">
                                    <Check size={9} />
                                  </span>
                                )}
                              </h4>
                              <span className="text-[10px] text-slate-500 font-medium">
                                {tmpl.category}
                              </span>
                            </div>

                            <div className="flex flex-col items-end gap-0.5 shrink-0">
                              <span className={`text-[9.5px] font-semibold px-1.5 py-0.2 rounded-full border ${
                                tmpl.isAtsOptimized
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}>
                                {tmpl.isAtsOptimized ? 'ATS-Safe' : 'Visual'}
                              </span>
                              <span className="text-[9.5px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                                {tmpl.layoutStyle}
                              </span>
                            </div>
                          </div>

                          <p className="text-[11px] text-[#526078] line-clamp-2 leading-relaxed">
                            {tmpl.desc}
                          </p>

                          <p className="text-[10px] text-slate-600 line-clamp-1 pt-0.5">
                            <strong className="text-slate-800 font-semibold">Best for: </strong>
                            {tmpl.recommendedFor}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-2 border-t border-[#DCE7F2]/60">
                          <button
                            onClick={() => handleSelectTemplate(tmpl.id)}
                            className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                              isSelected
                                ? 'bg-[#2459A8] text-white shadow-2xs'
                                : 'bg-slate-100 text-[#11183D] hover:bg-slate-200'
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <Check size={12} />
                                <span>Active Layout</span>
                              </>
                            ) : (
                              <span>Use Template</span>
                            )}
                          </button>

                          <button
                            onClick={() => {
                              setPreviewingTemplate(tmpl);
                              setIsTemplateModalOpen(true);
                            }}
                            title="Full Document Preview"
                            className="p-1.5 rounded-xl border border-[#DCE7F2] bg-white text-[#526078] hover:text-[#11183D] hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
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
      )}

      {/* Copilot Drawer */}
      <ResumeCopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        bulletsAudit={currentAtsAnalysis.bulletsAudit}
        recommendationGroups={currentAtsAnalysis.recommendationGroups}
        recommendationSummary={currentAtsAnalysis.recommendationSummary}
      />

      {/* Template Selection Modal */}
      <TemplateOverviewModal
        isOpen={isTemplateModalOpen}
        onClose={() => {
          setIsTemplateModalOpen(false);
          setPreviewingTemplate(null);
        }}
        template={previewingTemplate || TEMPLATE_METADATA.find(t => t.id === currentTemplate) || TEMPLATE_METADATA[0]}
        onSelect={handleSelectTemplate}
        isSelected={previewingTemplate ? previewingTemplate.id === currentTemplate : true}
      />
    </div>
  );
}
