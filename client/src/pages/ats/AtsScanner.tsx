import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, Upload, Sparkles, AlertCircle, CheckCircle2, 
  ArrowRight, Briefcase, Building2, Cpu, ShieldCheck
} from 'lucide-react';
import apiClient from '../../api/client';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function AtsScanner() {
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');

  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  const scanSteps = [
    'Parsing resume structure & layout integrity...',
    'Extracting technical skill keywords & experience metrics...',
    'Analyzing target job description requirements & ATS score...',
    'Generating high-impact STAR bullet point rewrites...',
    'Synthesizing tailored mock interview questions...'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      // Read text if plaintext file
      if (selected.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (evt) => {
          setResumeText(evt.target?.result as string || '');
        };
        reader.readAsText(selected);
      }
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !resumeText.trim()) {
      toast.error('Please upload a resume file or paste your resume text.');
      return;
    }
    if (!jobDescription.trim()) {
      toast.error('Please paste the target Job Description.');
      return;
    }

    setIsScanning(true);
    setScanStep(0);

    const stepInterval = setInterval(() => {
      setScanStep((prev) => (prev < scanSteps.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const formData = new FormData();
      if (file) {
        formData.append('resumeFile', file);
      }
      formData.append('resumeText', resumeText);
      formData.append('jobDescription', jobDescription);
      formData.append('jobTitle', jobTitle);
      formData.append('companyName', companyName);

      const res = await apiClient.post('/ats/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      clearInterval(stepInterval);
      const result = res.data.data;
      toast.success('ATS Analysis & Tailored Suite generated!');
      navigate(`/ats/report/${result.id}`);
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsScanning(false);
      const msg = err.response?.data?.message || err.message || 'ATS analysis failed';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-[#EFFAFD] py-12 px-4 sm:px-6 lg:px-8 font-body text-[#11183D]">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8EAF4] border border-[#A0006D]/30 text-[#A0006D] text-xs font-bold font-display uppercase tracking-wider">
            <Sparkles size={14} /> AI ATS Match & Resume Tailor
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-[#11183D] tracking-tight">
            Optimize Your Resume & Unlock Tailored Interviews
          </h1>
          <p className="text-sm text-[#526078] max-w-2xl mx-auto font-body leading-relaxed">
            Upload your resume and paste your target job description. Our AI ATS Engine calculates your keyword match score, identifies critical skill gaps, rewrites your bullet points with STAR methodology, and builds a custom mock interview loop.
          </p>
        </div>

        {/* Scan Progress State overlay */}
        {isScanning ? (
          <Card className="p-8 sm:p-12 text-center space-y-6 bg-white border-[#DCE7F2] shadow-xl rounded-3xl">
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-[#EFFAFD] border-t-[#4A8BDF] animate-spin" />
              <Cpu size={36} className="text-[#A0006D] animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold font-display text-[#11183D]">
                Analyzing Candidate Alignment
              </h3>
              <p className="text-xs text-[#526078] font-mono min-h-[20px] transition-all">
                {scanSteps[scanStep]}
              </p>
            </div>

            {/* Progress Step Badges */}
            <div className="flex justify-center items-center gap-2 pt-4">
              {scanSteps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx <= scanStep ? 'w-8 bg-[#4A8BDF]' : 'w-2 bg-[#DCE7F2]'
                  }`}
                />
              ))}
            </div>
          </Card>
        ) : (
          <form onSubmit={handleAnalyze} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* LEFT COLUMN: Resume Upload / Text */}
              <Card className="p-6 space-y-4 bg-white border-[#DCE7F2] shadow-sm rounded-3xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#11183D] font-display">
                    <FileText size={18} className="text-[#4A8BDF]" />
                    <span>1. Candidate Resume</span>
                  </div>

                  {/* Drag and Drop Zone */}
                  <label className="border-2 border-dashed border-[#DCE7F2] hover:border-[#4A8BDF] bg-[#EFFAFD]/50 rounded-2xl p-6 text-center block cursor-pointer transition-all">
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Upload size={28} className="mx-auto text-[#4A8BDF] mb-2" />
                    <span className="text-xs font-bold text-[#11183D] block font-display">
                      {file ? file.name : 'Click or Drag & Drop Resume File'}
                    </span>
                    <span className="text-[11px] text-[#526078] mt-1 block">
                      Supports PDF, DOCX, or TXT
                    </span>
                  </label>

                  <div className="relative text-center my-2">
                    <span className="text-[10px] uppercase font-bold text-[#7B8799] bg-white px-2">
                      or paste text directly
                    </span>
                  </div>

                  <textarea
                    rows={6}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste resume content here if file upload is unavailable..."
                    className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl p-3 text-xs text-[#11183D] placeholder:text-[#7B8799] focus:outline-none focus:border-[#4A8BDF] font-mono leading-relaxed"
                  />
                </div>
              </Card>

              {/* RIGHT COLUMN: Target Job Description */}
              <Card className="p-6 space-y-4 bg-white border-[#DCE7F2] shadow-sm rounded-3xl">
                <div className="flex items-center gap-2 font-bold text-sm text-[#11183D] font-display">
                  <Briefcase size={18} className="text-[#A0006D]" />
                  <span>2. Target Job Description</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#526078] uppercase font-display block mb-1">
                      Job Title (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Frontend Engineer"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#526078] uppercase font-display block mb-1">
                      Company (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Stripe / Google"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl px-3 py-2 text-xs text-[#11183D] focus:outline-none focus:border-[#4A8BDF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#526078] uppercase font-display block mb-1">
                    Job Description Text *
                  </label>
                  <textarea
                    rows={8}
                    required
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job posting requirements, responsibilities, and qualifications..."
                    className="w-full bg-[#EFFAFD]/30 border border-[#DCE7F2] rounded-xl p-3 text-xs text-[#11183D] placeholder:text-[#7B8799] focus:outline-none focus:border-[#4A8BDF] font-body leading-relaxed"
                  />
                </div>
              </Card>

            </div>

            {/* Action Bar */}
            <div className="flex justify-center pt-2">
              <Button
                type="submit"
                size="lg"
                variant="eggplant"
                icon={<Sparkles size={18} />}
                iconRight={<ArrowRight size={18} />}
                className="w-full sm:w-auto px-10 py-3.5 shadow-lg hover:shadow-xl transition-all"
              >
                Run AI ATS Audit & Generate Mock Loop
              </Button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
