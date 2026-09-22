import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserCheck, Upload, FileCode2, ArrowRight, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { parseResumeFile } from '../../utils/resumeParser';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface NewResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewResumeModal({ isOpen, onClose }: NewResumeModalProps) {
  const navigate = useNavigate();
  const { createResumeVersion, extractAndLoadResume, masterResume } = useResumeStore();

  const [mode, setMode] = useState<'SELECT' | 'UPLOAD_REVIEW'>('SELECT');
  const [targetRole, setTargetRole] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [versionTitle, setVersionTitle] = useState('');

  // Upload state
  const [isParsing, setIsParsing] = useState(false);
  const [parsedPreview, setParsedPreview] = useState<any>(null);
  const [uploadedFileName, setUploadedFileName] = useState('');

  if (!isOpen) return null;

  const handleCreateFromProfile = () => {
    const title = versionTitle.trim() || `${targetRole || 'Software Engineer'} Resume`;
    const newId = createResumeVersion(
      title,
      targetRole || 'Full Stack Engineer',
      targetCompany || 'General Applications',
      undefined,
      masterResume
    );
    toast.success('Created new resume version from profile!');
    onClose();
    navigate(`/resume/edit/${newId}`);
  };

  const handleStartFromScratch = () => {
    const title = versionTitle.trim() || 'New Standard Resume';
    const newId = createResumeVersion(
      title,
      targetRole || 'Software Engineer',
      targetCompany || 'General',
      undefined,
      {
        personalInfo: {
          fullName: 'Your Name',
          title: targetRole || 'Software Engineer',
          email: 'your.email@example.com',
          phone: '',
          location: '',
          linkedin: '',
          github: '',
          portfolio: ''
        },
        summary: '',
        experience: [],
        education: [],
        projects: [],
        skills: { languages: [], frameworks: [], databases: [], cloudDevOps: [], tools: [] },
        certifications: []
      }
    );
    toast.success('Initialized blank resume version!');
    onClose();
    navigate(`/resume/edit/${newId}`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsParsing(true);

    try {
      const parsed = await parseResumeFile(file);
      setParsedPreview(parsed);
      setMode('UPLOAD_REVIEW');
      toast.success('Resume parsed successfully! Review extracted data below.');
    } catch (err: any) {
      toast.error('Failed to parse file. Using fallback extractor.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleConfirmParsed = () => {
    if (!parsedPreview) return;
    const title = versionTitle.trim() || `Uploaded - ${uploadedFileName}`;
    const newId = createResumeVersion(
      title,
      targetRole || parsedPreview.personalInfo?.title || 'Software Engineer',
      targetCompany || 'Imported Version',
      undefined,
      parsedPreview
    );
    extractAndLoadResume(parsedPreview);
    toast.success('Loaded parsed resume into version manager!');
    onClose();
    navigate(`/resume/edit/${newId}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl border border-[#DCE7F2] shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Modal Header */}
          <div className="p-6 border-b border-[#DCE7F2] bg-[#EFFAFD] flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 bg-white rounded-xl text-[#2459A8] border border-[#DCE7F2] shadow-2xs">
                  <Sparkles size={18} />
                </span>
                <h3 className="text-xl font-bold font-display text-[#11183D]">
                  {mode === 'SELECT' ? 'Create New Resume Version' : 'Review Extracted Resume Data'}
                </h3>
              </div>
              <p className="text-xs text-[#526078] mt-1">
                {mode === 'SELECT'
                  ? 'Choose how you want to construct your resume version'
                  : 'Verify parsed details before importing into builder'}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-[#7B8799] hover:text-[#11183D] rounded-xl hover:bg-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6">
            {mode === 'SELECT' ? (
              <>
                {/* Optional Metadata Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-[#DCE7F2]">
                  <div>
                    <label className="block text-xs font-bold text-[#11183D] mb-1">
                      Version Title (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Amazon Senior SWE Resume"
                      value={versionTitle}
                      onChange={(e) => setVersionTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#DCE7F2] rounded-xl text-xs text-[#11183D] focus:outline-none focus:border-[#2459A8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#11183D] mb-1">
                      Target Role / Company
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Role (e.g. Backend)"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#DCE7F2] rounded-xl text-xs text-[#11183D] focus:outline-none focus:border-[#2459A8]"
                      />
                      <input
                        type="text"
                        placeholder="Company (e.g. Meta)"
                        value={targetCompany}
                        onChange={(e) => setTargetCompany(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#DCE7F2] rounded-xl text-xs text-[#11183D] focus:outline-none focus:border-[#2459A8]"
                      />
                    </div>
                  </div>
                </div>

                {/* 3 Pathway Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Choice 1: From Profile */}
                  <div
                    onClick={handleCreateFromProfile}
                    className="p-5 rounded-2xl border border-[#DCE7F2] bg-white hover:border-[#2459A8] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2459A8] border border-blue-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                        <UserCheck size={20} />
                      </div>
                      <h4 className="text-sm font-bold text-[#11183D] group-hover:text-[#2459A8] transition-colors">
                        Build from Profile
                      </h4>
                      <p className="text-xs text-[#526078] mt-1.5 leading-relaxed">
                        Populate with your verified candidate profile, experience & master skills.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#2459A8]">
                      <span>Instant setup</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Choice 2: Upload File */}
                  <div className="p-5 rounded-2xl border border-[#DCE7F2] bg-white hover:border-[#2459A8] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden">
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                        <Upload size={20} />
                      </div>
                      <h4 className="text-sm font-bold text-[#11183D] group-hover:text-[#2459A8] transition-colors">
                        Upload Existing Resume
                      </h4>
                      <p className="text-xs text-[#526078] mt-1.5 leading-relaxed">
                        Parse PDF or DOCX file to extract structured fields & STAR metrics.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
                      <span>{isParsing ? 'Parsing PDF...' : 'Select File (.pdf/.docx)'}</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Choice 3: Start from Scratch */}
                  <div
                    onClick={handleStartFromScratch}
                    className="p-5 rounded-2xl border border-[#DCE7F2] bg-white hover:border-[#2459A8] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                        <FileCode2 size={20} />
                      </div>
                      <h4 className="text-sm font-bold text-[#11183D] group-hover:text-[#2459A8] transition-colors">
                        Start from Scratch
                      </h4>
                      <p className="text-xs text-[#526078] mt-1.5 leading-relaxed">
                        Begin with a blank canvas and use AI suggestions to construct section by section.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Blank Canvas</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Review Extracted Data Mode */
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-emerald-600 mt-0.5 shrink-0" />
                  <div className="text-xs text-emerald-900">
                    <p className="font-bold">Parsing Completed for "{uploadedFileName}"</p>
                    <p className="mt-0.5 opacity-90">
                      Extracted contact details, {parsedPreview?.experience?.length || 0} work experiences, and{' '}
                      {Object.values(parsedPreview?.skills || {}).flat().length} key technical skills.
                    </p>
                  </div>
                </div>

                {/* Data Overview Summary */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-[#DCE7F2] space-y-3 text-xs">
                  <div>
                    <span className="font-bold text-[#11183D]">Name:</span> {parsedPreview?.personalInfo?.fullName || 'N/A'}
                  </div>
                  <div>
                    <span className="font-bold text-[#11183D]">Headline:</span> {parsedPreview?.personalInfo?.title || 'N/A'}
                  </div>
                  <div>
                    <span className="font-bold text-[#11183D]">Summary:</span> {parsedPreview?.summary || 'No summary extracted'}
                  </div>
                  <div>
                    <span className="font-bold text-[#11183D]">Skills Extracted:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.values(parsedPreview?.skills || {})
                        .flat()
                        .slice(0, 10)
                        .map((s: any, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-white border border-[#DCE7F2] rounded text-[10px] text-[#2459A8] font-mono">
                            {s}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setMode('SELECT')}
                    className="px-4 py-2 bg-white border border-[#DCE7F2] text-[#526078] hover:text-[#11183D] rounded-xl text-xs font-bold"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirmParsed}
                    className="px-5 py-2 bg-[#2459A8] hover:bg-[#1d4787] text-white rounded-xl text-xs font-bold font-display shadow-sm flex items-center gap-1.5"
                  >
                    <span>Import to Builder</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
