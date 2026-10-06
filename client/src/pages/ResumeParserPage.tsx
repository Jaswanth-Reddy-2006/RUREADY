import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Copy, 
  Check, 
  AlertCircle, 
  Loader2, 
  RotateCcw,
  FileCode,
  ListTree,
  Table as TableIcon,
  Sparkles,
  Target,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Layers,
  BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../api/client';

interface BgeAtsResult {
  model: string;
  overallScore: number;
  breakdown: {
    structure: number;
    completeness: number;
    extractability: number;
    skills: number;
    experienceQuality: number;
    formatting: number;
  };
  maxBreakdown: {
    structure: number;
    completeness: number;
    extractability: number;
    skills: number;
    experienceQuality: number;
    formatting: number;
  };
  extractedSkills: string[];
  quantification: {
    densityPercentage: number;
    actionVerbRatio: number;
    quantifiedCount: number;
    totalBullets: number;
  };
  bulletAudits: Array<{
    id: string;
    original: string;
    hasMetric: boolean;
    hasActionVerb: boolean;
    category?: string;
    feedback: string;
  }>;
  strengths: string[];
  improvements: string[];
}

interface ParsedResumeData {
  filename: string;
  fileType: string;
  mimeType: string;
  fileSizeBytes: number;
  pageCount: number;
  characterCount: number;
  plainText: string;
  markdown: string;
  sections: Array<{
    title: string;
    level: number;
    page_no?: number;
  }>;
  tables: Array<{
    index: number;
    markdown: string;
    html: string;
    rows: number;
    cols: number;
  }>;
  structuredContent: Array<{
    type: string;
    label: string;
    text?: string;
    markdown?: string;
    html?: string;
    level?: number;
    page_no?: number;
  }>;
}

const RESUME_PARSER_STORAGE_KEY = 'rennetus_docling_resume_parsed_data';

export default function ResumeParserPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(() => {
    try {
      const raw = localStorage.getItem(RESUME_PARSER_STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw);
        return stored.parsedData || null;
      }
    } catch {
      // ignore
    }
    return null;
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'structured' | 'raw' | 'ats'>(() => {
    try {
      const raw = localStorage.getItem(RESUME_PARSER_STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw);
        return stored.activeTab || 'structured';
      }
    } catch {
      // ignore
    }
    return 'structured';
  });
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // ATS Scoring States
  const [isScoring, setIsScoring] = useState(false);
  const [atsResult, setAtsResult] = useState<BgeAtsResult | null>(() => {
    try {
      const raw = localStorage.getItem(RESUME_PARSER_STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw);
        return stored.atsResult || null;
      }
    } catch {
      // ignore
    }
    return null;
  });
  const [atsError, setAtsError] = useState<string | null>(null);

  // Sync state to localStorage whenever parsedData, atsResult, or activeTab changes
  useEffect(() => {
    try {
      if (parsedData) {
        localStorage.setItem(
          RESUME_PARSER_STORAGE_KEY,
          JSON.stringify({
            parsedData,
            atsResult,
            activeTab,
          })
        );
      } else {
        localStorage.removeItem(RESUME_PARSER_STORAGE_KEY);
      }
    } catch (err) {
      console.warn('Unable to persist resume parser state to localStorage:', err);
    }
  }, [parsedData, atsResult, activeTab]);

  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleProcessFile = async (selectedFile: File) => {
    setErrorMsg(null);
    setParsedData(null);
    setFile(selectedFile);

    const ext = selectedFile.name.split('.').pop()?.toLowerCase();

    if (ext === 'doc') {
      const msg = 'DOC files are not supported. Please upload a DOCX file.';
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }

    if (ext !== 'pdf' && ext !== 'docx') {
      const msg = `Unsupported file format (.${ext}). Please upload a PDF or DOCX file.`;
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }

    setIsParsing(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await apiClient.post('/resume-parser/parse', formData, {
        timeout: 90000,
      });

      if (res.data?.success && res.data?.data) {
        const data = res.data.data;
        setParsedData(data);
        toast.success(`Successfully parsed ${selectedFile.name}`);

        // Automatically compute role-independent ATS score
        if (data.plainText) {
          handleScoreResume(data.plainText, data.structuredContent);
        }
      } else {
        throw new Error(res.data?.error || 'Extraction returned no data.');
      }
    } catch (err: any) {
      console.error('[Resume Parser Client Error]:', err);
      const serverMsg = err.response?.data?.error || err.message || 'Failed to parse resume document.';
      setErrorMsg(serverMsg);
      toast.error(serverMsg);
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleScoreResume = async (plainTextOverride?: string, structuredOverride?: any[]) => {
    const textToScore = plainTextOverride || parsedData?.plainText;
    if (!textToScore) {
      toast.error('Please upload and extract a resume first.');
      return;
    }

    setIsScoring(true);
    setAtsError(null);

    try {
      const res = await apiClient.post(
        '/resume-parser/score',
        {
          resumeText: textToScore,
          structuredElements: structuredOverride || parsedData?.structuredContent || null,
        },
        {
          timeout: 90000,
        }
      );

      if (res.data?.success && res.data?.data) {
        setAtsResult(res.data.data);
      } else {
        throw new Error(res.data?.error || 'ATS scoring failed.');
      }
    } catch (err: any) {
      console.error('[BGE ATS Error]:', err);
      const serverMsg = err.response?.data?.error || err.message || 'Failed to compute ATS score.';
      setAtsError(serverMsg);
      toast.error(serverMsg);
    } finally {
      setIsScoring(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      handleProcessFile(selected);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleProcessFile(droppedFile);
    }
  };

  const handleCopyAllText = () => {
    if (!parsedData?.plainText) return;
    navigator.clipboard.writeText(parsedData.plainText);
    setCopied(true);
    toast.success('Complete extracted text copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleReset = () => {
    setFile(null);
    setParsedData(null);
    setErrorMsg(null);
    setIsParsing(false);
    setAtsResult(null);
    setAtsError(null);
    try {
      localStorage.removeItem(RESUME_PARSER_STORAGE_KEY);
    } catch {
      // ignore
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-full bg-[#EFFAFD] dark:bg-[#080C1D] text-[#11183D] dark:text-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Banner */}
        <div className="bg-white dark:bg-[#11183D] border border-[#DCE7F2] dark:border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#EFFAFD] dark:bg-[#4A8BDF]/20 text-[#2459A8] dark:text-[#4A8BDF] rounded-2xl border border-[#DCE7F2] dark:border-[#1E293B]">
              <FileText size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black font-display text-[#11183D] dark:text-white tracking-tight">
                Resume Parser
              </h1>
              <p className="text-xs sm:text-sm text-[#526078] dark:text-[#94A3B8] mt-1">
                Upload a PDF or Word resume to test document extraction.
              </p>
            </div>
          </div>
        </div>

        {/* Upload Box Area */}
        <div className="bg-white dark:bg-[#11183D] border border-[#DCE7F2] dark:border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx,.doc"
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-3 ${
              isDragging
                ? 'border-[#2459A8] bg-blue-50/60 dark:bg-[#4A8BDF]/20'
                : 'border-[#CBD5E1] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0B0F28] hover:border-[#2459A8] dark:hover:border-[#4A8BDF] hover:bg-blue-50/30'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#11183D] border border-[#DCE7F2] dark:border-[#1E293B] shadow-xs flex items-center justify-center text-[#2459A8] dark:text-[#4A8BDF]">
              {isParsing ? (
                <Loader2 size={32} className="animate-spin text-[#2459A8] dark:text-[#4A8BDF]" />
              ) : (
                <UploadCloud size={32} />
              )}
            </div>

            <div>
              <p className="text-sm font-bold text-[#11183D] dark:text-white">
                {isDragging ? 'Drop your resume file here' : 'Drop your resume here'}
              </p>
              <p className="text-xs text-[#526078] dark:text-[#94A3B8] mt-1">
                or <span className="text-[#2459A8] dark:text-[#4A8BDF] font-semibold underline underline-offset-2">Choose File</span>
              </p>
            </div>

            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white dark:bg-[#11183D] border border-[#DCE7F2] dark:border-[#1E293B] text-[11px] font-mono text-[#526078] dark:text-[#94A3B8]">
              PDF / DOCX
            </div>
          </div>

          {/* Status & Error Display */}
          {errorMsg && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl flex items-start gap-3 text-xs text-rose-800 dark:text-rose-300">
              <AlertCircle size={18} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Extraction Error</p>
                <p className="mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          {file && (
            <div className="p-4 bg-slate-50 dark:bg-[#0B0F28] border border-[#DCE7F2] dark:border-[#1E293B] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#526078] dark:text-[#94A3B8]">File:</span>
                  <span className="font-semibold text-[#11183D] dark:text-white font-mono">{file.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#526078] dark:text-[#94A3B8]">Status:</span>
                  {isParsing ? (
                    <span className="text-[#2459A8] dark:text-[#4A8BDF] font-bold flex items-center gap-1.5">
                      <Loader2 size={13} className="animate-spin" /> Parsing document...
                    </span>
                  ) : parsedData ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                      Parsing complete
                    </span>
                  ) : errorMsg ? (
                    <span className="text-rose-600 dark:text-rose-400 font-bold">
                      Parsing failed
                    </span>
                  ) : (
                    <span className="text-[#526078] dark:text-[#94A3B8]">Ready</span>
                  )}
                </div>
              </div>

              {parsedData && (
                <button
                  onClick={handleReset}
                  className="self-start sm:self-auto px-3.5 py-1.5 bg-white dark:bg-[#11183D] border border-[#DCE7F2] dark:border-[#1E293B] hover:border-slate-300 text-xs font-bold text-[#526078] dark:text-[#94A3B8] hover:text-[#11183D] dark:hover:text-white rounded-xl flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>Parse Another File</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Extracted Content & Metadata Area */}
        {parsedData && (
          <div className="bg-white dark:bg-[#11183D] border border-[#DCE7F2] dark:border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            
            {/* Metadata Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3.5 bg-slate-50 dark:bg-[#0B0F28] border border-[#DCE7F2] dark:border-[#1E293B] rounded-2xl">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#526078] dark:text-[#94A3B8] font-mono">
                  Filename
                </span>
                <p className="text-xs font-bold text-[#11183D] dark:text-white truncate mt-1 font-mono" title={parsedData.filename}>
                  {parsedData.filename}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-[#0B0F28] border border-[#DCE7F2] dark:border-[#1E293B] rounded-2xl">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#526078] dark:text-[#94A3B8] font-mono">
                  File Type
                </span>
                <p className="text-xs font-bold text-[#11183D] dark:text-white mt-1 uppercase">
                  {parsedData.fileType}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-[#0B0F28] border border-[#DCE7F2] dark:border-[#1E293B] rounded-2xl">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#526078] dark:text-[#94A3B8] font-mono">
                  File Size
                </span>
                <p className="text-xs font-bold text-[#11183D] dark:text-white mt-1 font-mono">
                  {formatFileSize(parsedData.fileSizeBytes)}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-[#0B0F28] border border-[#DCE7F2] dark:border-[#1E293B] rounded-2xl">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#526078] dark:text-[#94A3B8] font-mono">
                  Page Count
                </span>
                <p className="text-xs font-bold text-[#11183D] dark:text-white mt-1 font-mono">
                  {parsedData.pageCount} {parsedData.pageCount === 1 ? 'page' : 'pages'}
                </p>
              </div>

              <div className="col-span-2 sm:col-span-1 p-3.5 bg-slate-50 dark:bg-[#0B0F28] border border-[#DCE7F2] dark:border-[#1E293B] rounded-2xl">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#526078] dark:text-[#94A3B8] font-mono">
                  Characters
                </span>
                <p className="text-xs font-bold text-[#2459A8] dark:text-[#4A8BDF] mt-1 font-mono">
                  {parsedData.characterCount.toLocaleString()} chars
                </p>
              </div>
            </div>

            {/* Navigation Tabs and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCE7F2] dark:border-[#1E293B] pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('structured')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-sans transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'structured'
                      ? 'bg-[#2459A8] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-[#0B0F28] text-[#526078] dark:text-[#94A3B8] hover:text-[#11183D] dark:hover:text-white'
                  }`}
                >
                  <ListTree size={14} />
                  <span>Structured View</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('raw')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-sans transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'raw'
                      ? 'bg-[#2459A8] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-[#0B0F28] text-[#526078] dark:text-[#94A3B8] hover:text-[#11183D] dark:hover:text-white'
                  }`}
                >
                  <FileCode size={14} />
                  <span>Raw Text</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('ats')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-sans transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'ats'
                      ? 'bg-gradient-to-r from-[#2459A8] to-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-[#0B0F28] text-[#526078] dark:text-[#94A3B8] hover:text-[#11183D] dark:hover:text-white'
                  }`}
                >
                  <Sparkles size={14} className="text-amber-300" />
                  <span>ATS Scoring (BGE-Large)</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopyAllText}
                className="px-4 py-2 bg-white dark:bg-[#0B0F28] border border-[#DCE7F2] dark:border-[#1E293B] hover:border-[#2459A8] dark:hover:border-[#4A8BDF] text-xs font-bold text-[#11183D] dark:text-white rounded-xl shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {copied ? <Check size={14} className="text-emerald-600 dark:text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy All Text'}</span>
              </button>
            </div>

            {/* TAB 1: Structured View */}
            {activeTab === 'structured' && (
              <div className="space-y-6">
                {/* Detected Sections Header Bar */}
                {parsedData.sections && parsedData.sections.length > 0 && (
                  <div className="p-4 bg-slate-50 dark:bg-[#0B0F28] border border-[#DCE7F2] dark:border-[#1E293B] rounded-2xl space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#526078] dark:text-[#94A3B8] font-mono">
                      Detected Document Sections ({parsedData.sections.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {parsedData.sections.map((sec, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-white dark:bg-[#11183D] border border-[#DCE7F2] dark:border-[#1E293B] rounded-lg text-xs font-semibold text-[#11183D] dark:text-[#F1F5F9]"
                        >
                          {sec.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Structured Document Flow Elements */}
                {parsedData.structuredContent && parsedData.structuredContent.length > 0 ? (
                  <div className="space-y-3 bg-slate-50/60 dark:bg-[#0B0F28]/60 p-5 rounded-2xl border border-[#DCE7F2] dark:border-[#1E293B]">
                    {parsedData.structuredContent.map((item, idx) => {
                      if (item.type === 'section_header' || item.label?.includes('header') || item.label?.includes('title')) {
                        return (
                          <div key={idx} className="pt-3 pb-1 border-b border-slate-200 dark:border-slate-800">
                            <h3 className="text-sm font-bold text-[#11183D] dark:text-white font-display uppercase tracking-wide">
                              {item.text}
                            </h3>
                          </div>
                        );
                      }

                      if (item.type === 'list_item' || item.label?.includes('list')) {
                        return (
                          <div key={idx} className="flex items-start gap-2 text-xs text-[#334155] dark:text-[#CBD5E1] pl-2">
                            <span className="text-[#2459A8] dark:text-[#4A8BDF] font-bold shrink-0">•</span>
                            <span className="leading-relaxed">{item.text}</span>
                          </div>
                        );
                      }

                      if (item.type === 'table') {
                        return (
                          <div key={idx} className="my-3 overflow-x-auto p-3 bg-white dark:bg-[#11183D] border border-[#DCE7F2] dark:border-[#1E293B] rounded-xl text-xs">
                            <div className="flex items-center gap-1.5 font-bold text-[#2459A8] dark:text-[#4A8BDF] mb-2">
                              <TableIcon size={14} />
                              <span>Extracted Table</span>
                            </div>
                            <pre className="font-mono text-[11px] whitespace-pre text-[#11183D] dark:text-white">
                              {item.markdown || item.text}
                            </pre>
                          </div>
                        );
                      }

                      return (
                        <p key={idx} className="text-xs text-[#334155] dark:text-[#CBD5E1] leading-relaxed">
                          {item.text}
                        </p>
                      );
                    })}
                  </div>
                ) : (
                  /* Fallback Markdown Structured Render */
                  <div className="p-5 bg-slate-50 dark:bg-[#0B0F28] rounded-2xl border border-[#DCE7F2] dark:border-[#1E293B]">
                    <pre className="whitespace-pre-wrap font-sans text-xs text-[#334155] dark:text-[#CBD5E1] leading-relaxed">
                      {parsedData.markdown || parsedData.plainText}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Raw Text (Complete Plain-Text Extraction) */}
            {activeTab === 'raw' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#526078] dark:text-[#94A3B8]">
                  <span>Unmodified direct plain text extracted by Docling</span>
                  <span className="font-mono font-semibold">{parsedData.plainText.length.toLocaleString()} characters</span>
                </div>

                <div className="relative">
                  <textarea
                    readOnly
                    value={parsedData.plainText}
                    rows={22}
                    className="w-full p-4 bg-slate-900 text-slate-100 font-mono text-xs rounded-2xl border border-slate-800 focus:outline-none select-text leading-relaxed resize-y"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: Role-Independent ATS Score */}
            {activeTab === 'ats' && (
              <div className="space-y-6">
                
                {/* Scoring Trigger / Loading State */}
                {isScoring && (
                  <div className="p-8 bg-slate-50 dark:bg-[#0B0F28] border border-[#DCE7F2] dark:border-[#1E293B] rounded-3xl text-center space-y-3">
                    <Loader2 size={32} className="animate-spin text-[#2459A8] dark:text-[#4A8BDF] mx-auto" />
                    <p className="text-sm font-bold text-[#11183D] dark:text-white">
                      Analyzing resume across 6 ATS scoring pillars...
                    </p>
                    <p className="text-xs text-[#526078] dark:text-[#94A3B8]">
                      Evaluating structure, completeness, extractability, technical skills, and experience quality.
                    </p>
                  </div>
                )}

                {/* Error Banner */}
                {atsError && (
                  <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl flex items-start gap-3 text-xs text-rose-800 dark:text-rose-300">
                    <AlertTriangle size={18} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Scoring Error</p>
                      <p className="mt-0.5">{atsError}</p>
                    </div>
                  </div>
                )}

                {/* Empty State / Trigger if not yet scored */}
                {!isScoring && !atsResult && (
                  <div className="p-8 bg-slate-50 dark:bg-[#0B0F28] border border-[#DCE7F2] dark:border-[#1E293B] rounded-3xl text-center space-y-4">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EFFAFD] dark:bg-[#4A8BDF]/20 text-[#2459A8] dark:text-[#4A8BDF] flex items-center justify-center">
                      <Sparkles size={28} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#11183D] dark:text-white">
                        Evaluate ATS Optimization Score
                      </h3>
                      <p className="text-xs text-[#526078] dark:text-[#94A3B8] max-w-md mx-auto mt-1">
                        Run the 100-point role-independent ATS audit to inspect structure, extractability, skills categorization, and experience quality.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleScoreResume()}
                      className="px-6 py-2.5 bg-gradient-to-r from-[#2459A8] to-indigo-600 hover:from-[#1d4786] hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles size={14} className="text-amber-300" />
                      <span>Calculate ATS Score</span>
                    </button>
                  </div>
                )}

                {/* Main ATS Score Dashboard */}
                {!isScoring && atsResult && (
                  <div className="space-y-6">
                    {/* Top Overall Score Card */}
                    <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-[#11183D] to-indigo-950 text-white rounded-3xl border border-indigo-900/50 shadow-md">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="space-y-2">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-[11px] font-mono text-indigo-300">
                            <Cpu size={13} />
                            <span>Role-Independent ATS System Audit</span>
                          </div>
                          <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
                            ATS Score
                          </h2>
                          <p className="text-xs text-indigo-200/80 max-w-lg">
                            Comprehensive evaluation across 6 core pillars totaling 100 points.
                          </p>
                        </div>

                        <div className="flex items-center gap-4 self-start sm:self-auto">
                          <div className="w-28 h-28 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center shadow-inner">
                            <span className="text-3xl sm:text-4xl font-black font-display text-white">
                              {atsResult.overallScore}
                            </span>
                            <span className="text-[11px] uppercase font-mono tracking-widest text-indigo-300 font-bold">
                              / 100
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 6 Category Breakdown Grid */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#526078] dark:text-[#94A3B8] font-mono">
                          Score Breakdown (100 Points Total)
                        </h3>
                        <span className="text-xs font-mono font-bold text-[#2459A8] dark:text-[#4A8BDF]">
                          {atsResult.overallScore} / 100
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        {/* 1. Structure */}
                        <div className="p-4 bg-white dark:bg-[#11183D] border border-[#DCE7F2] dark:border-[#1E293B] rounded-2xl shadow-2xs space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-[#11183D] dark:text-white">
                              Structure
                            </span>
                            <span className="text-xs font-bold font-mono text-[#2459A8] dark:text-[#4A8BDF]">
                              {atsResult.breakdown.structure} / 20
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-[#2459A8] dark:bg-[#4A8BDF] h-full rounded-full transition-all"
                              style={{ width: `${(atsResult.breakdown.structure / 20) * 100}%` }}
                            />
                          </div>
                          <p className="text-[11px] text-[#526078] dark:text-[#94A3B8]">
                            Header, Education, Skills, Projects, and Experience section presence.
                          </p>
                        </div>

                        {/* 2. Content Completeness */}
                        <div className="p-4 bg-white dark:bg-[#11183D] border border-[#DCE7F2] dark:border-[#1E293B] rounded-2xl shadow-2xs space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-[#11183D] dark:text-white">
                              Content Completeness
                            </span>
                            <span className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400">
                              {atsResult.breakdown.completeness} / 20
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-indigo-600 dark:bg-indigo-400 h-full rounded-full transition-all"
                              style={{ width: `${(atsResult.breakdown.completeness / 20) * 100}%` }}
                            />
                          </div>
                          <p className="text-[11px] text-[#526078] dark:text-[#94A3B8]">
                            Contact info, email, phone, links, degrees, and dates completeness.
                          </p>
                        </div>

                        {/* 3. Extractability */}
                        <div className="p-4 bg-white dark:bg-[#11183D] border border-[#DCE7F2] dark:border-[#1E293B] rounded-2xl shadow-2xs space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-[#11183D] dark:text-white">
                              Extractability
                            </span>
                            <span className="text-xs font-bold font-mono text-cyan-600 dark:text-cyan-400">
                              {atsResult.breakdown.extractability} / 20
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-cyan-600 dark:bg-cyan-400 h-full rounded-full transition-all"
                              style={{ width: `${(atsResult.breakdown.extractability / 20) * 100}%` }}
                            />
                          </div>
                          <p className="text-[11px] text-[#526078] dark:text-[#94A3B8]">
                            Clean text stream, parseable headers, linear bullet flow.
                          </p>
                        </div>

                        {/* 4. Skills & Technical Content */}
                        <div className="p-4 bg-white dark:bg-[#11183D] border border-[#DCE7F2] dark:border-[#1E293B] rounded-2xl shadow-2xs space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-[#11183D] dark:text-white">
                              Skills & Technical Content
                            </span>
                            <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">
                              {atsResult.breakdown.skills} / 15
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-600 dark:bg-emerald-400 h-full rounded-full transition-all"
                              style={{ width: `${(atsResult.breakdown.skills / 15) * 100}%` }}
                            />
                          </div>
                          <p className="text-[11px] text-[#526078] dark:text-[#94A3B8]">
                            Technical skill inventory, categorization, and standardized naming.
                          </p>
                        </div>

                        {/* 5. Experience Quality */}
                        <div className="p-4 bg-white dark:bg-[#11183D] border border-[#DCE7F2] dark:border-[#1E293B] rounded-2xl shadow-2xs space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-[#11183D] dark:text-white">
                              Experience Quality
                            </span>
                            <span className="text-xs font-bold font-mono text-amber-600 dark:text-amber-400">
                              {atsResult.breakdown.experienceQuality} / 15
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-amber-600 dark:bg-amber-400 h-full rounded-full transition-all"
                              style={{ width: `${(atsResult.breakdown.experienceQuality / 15) * 100}%` }}
                            />
                          </div>
                          <p className="text-[11px] text-[#526078] dark:text-[#94A3B8]">
                            Strong action verbs & quantified metric density in project/work bullets.
                          </p>
                        </div>

                        {/* 6. Formatting */}
                        <div className="p-4 bg-white dark:bg-[#11183D] border border-[#DCE7F2] dark:border-[#1E293B] rounded-2xl shadow-2xs space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-[#11183D] dark:text-white">
                              Formatting
                            </span>
                            <span className="text-xs font-bold font-mono text-blue-600 dark:text-blue-400">
                              {atsResult.breakdown.formatting} / 10
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-blue-600 dark:bg-blue-400 h-full rounded-full transition-all"
                              style={{ width: `${(atsResult.breakdown.formatting / 10) * 100}%` }}
                            />
                          </div>
                          <p className="text-[11px] text-[#526078] dark:text-[#94A3B8]">
                            Standard bullet points, consistent date conventions, clean symbols.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Strengths & Improvements Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Strengths */}
                      <div className="p-5 bg-white dark:bg-[#11183D] border border-emerald-200/70 dark:border-emerald-950/70 rounded-2xl shadow-2xs space-y-3">
                        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold font-mono uppercase tracking-wider">
                          <CheckCircle2 size={16} />
                          <span>Strengths ({atsResult.strengths.length})</span>
                        </div>
                        <div className="space-y-2">
                          {atsResult.strengths.length > 0 ? (
                            atsResult.strengths.map((str, idx) => (
                              <div key={idx} className="flex items-start gap-2.5 text-xs text-[#334155] dark:text-[#CBD5E1]">
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                                <span className="leading-relaxed">{str}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-slate-400 italic">No specific strengths recorded.</p>
                          )}
                        </div>
                      </div>

                      {/* Improvements */}
                      <div className="p-5 bg-white dark:bg-[#11183D] border border-amber-200/70 dark:border-amber-950/70 rounded-2xl shadow-2xs space-y-3">
                        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-bold font-mono uppercase tracking-wider">
                          <AlertTriangle size={16} />
                          <span>Improvements ({atsResult.improvements.length})</span>
                        </div>
                        <div className="space-y-2">
                          {atsResult.improvements.length > 0 ? (
                            atsResult.improvements.map((imp, idx) => (
                              <div key={idx} className="flex items-start gap-2.5 text-xs text-[#334155] dark:text-[#CBD5E1]">
                                <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0 mt-0.5">→</span>
                                <span className="leading-relaxed">{imp}</span>
                              </div>
                            ))
                          ) : (
                            <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                              <Check size={14} />
                              <span>Resume meets all core ATS baseline benchmarks!</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Normalized Extracted Technical Skills */}
                    {atsResult.extractedSkills && atsResult.extractedSkills.length > 0 && (
                      <div className="p-5 bg-white dark:bg-[#11183D] border border-[#DCE7F2] dark:border-[#1E293B] rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-[#11183D] dark:text-white">
                            <Cpu size={15} className="text-[#2459A8] dark:text-[#4A8BDF]" />
                            <span>Normalized Technical Skills Detected ({atsResult.extractedSkills.length})</span>
                          </div>
                          <span className="text-[11px] font-mono text-[#526078] dark:text-[#94A3B8]">
                            Canonical Tech Stack
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {atsResult.extractedSkills.map((sk, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 bg-slate-50 dark:bg-[#0B0F28] text-[#11183D] dark:text-white border border-[#DCE7F2] dark:border-[#1E293B] rounded-lg text-xs font-medium font-mono"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Targeted Experience & Project Bullet Point Audits */}
                    {atsResult.bulletAudits && atsResult.bulletAudits.length > 0 && (
                      <div className="p-5 bg-white dark:bg-[#11183D] border border-[#DCE7F2] dark:border-[#1E293B] rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[#11183D] dark:text-white text-xs font-bold font-mono uppercase tracking-wider">
                            <BarChart3 size={15} className="text-[#2459A8] dark:text-[#4A8BDF]" />
                            <span>Top Experience & Project Improvements ({atsResult.bulletAudits.length})</span>
                          </div>
                          <span className="text-[11px] font-mono text-[#526078] dark:text-[#94A3B8]">
                            High Impact Focus (Max 3–5)
                          </span>
                        </div>
                        <div className="space-y-3">
                          {atsResult.bulletAudits.slice(0, 5).map((item, idx) => {
                            const cat = item.category || 'Measurable Outcome';
                            const badgeColor =
                              cat === 'Vague Responsibility'
                                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                                : cat === 'Weak Action Verb' || cat === 'Action Verb'
                                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                                : cat === 'Measurable Outcome' || cat === 'Quantification'
                                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                                : cat === 'Technical Implementation' || cat === 'Technical Context'
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                : 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800';

                            return (
                              <div
                                key={idx}
                                className="p-4 bg-slate-50 dark:bg-[#0B0F28] border border-[#DCE7F2] dark:border-[#1E293B] rounded-xl space-y-2 text-xs"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className={`px-2 py-0.5 border rounded-md text-[10px] font-bold font-mono uppercase tracking-wider ${badgeColor}`}>
                                    [{cat}]
                                  </span>
                                </div>
                                <p className="text-[#334155] dark:text-[#CBD5E1] font-mono text-[11px] leading-relaxed bg-white/60 dark:bg-[#11183D]/60 p-2.5 rounded-lg border border-slate-200/50 dark:border-slate-800/50">
                                  "{item.original}"
                                </p>
                                <div className="flex items-start gap-1.5 pt-0.5">
                                  <span className="text-sm shrink-0">💡</span>
                                  <div>
                                    <span className="text-[11px] font-bold text-[#11183D] dark:text-white mr-1">
                                      Suggestion:
                                    </span>
                                    <span className="text-[#2459A8] dark:text-[#4A8BDF] font-medium text-[11px] leading-relaxed">
                                      {item.feedback}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </div>
                )}

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
