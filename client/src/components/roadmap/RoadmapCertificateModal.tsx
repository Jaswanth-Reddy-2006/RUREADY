import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Award, ShieldCheck, Share2, Download, 
  CheckCircle2, Sparkles, Building2
} from 'lucide-react';
import { Roadmap } from '../../store/useRoadmapStore';
import { useAuthStore } from '../../store/authStore';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

interface RoadmapCertificateModalProps {
  roadmap: Roadmap;
  isOpen: boolean;
  onClose: () => void;
}

export default function RoadmapCertificateModal({
  roadmap,
  isOpen,
  onClose,
}: RoadmapCertificateModalProps) {
  const { user } = useAuthStore();

  if (!isOpen) return null;

  const candidateName = user?.name || 'Jaswanth Reddy';
  const verificationHash = `RU-${roadmap.id.slice(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleCopyVerification = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/verify/${verificationHash}`);
      toast.success('Certificate verification link copied!');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-body text-[#11183D]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white border border-[#DCE7F2] rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden"
        >
          {/* Top Bar */}
          <div className="p-4 bg-[#EFFAFD] border-b border-[#DCE7F2] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-[#A0006D]" />
              <span className="text-xs font-bold font-display uppercase tracking-wider text-[#11183D]">
                Verified Career Milestone Credential
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#526078] hover:bg-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Certificate Body Container */}
          <div className="p-8 space-y-6">
            <div className="p-8 rounded-3xl border-4 border-[#DCE7F2] bg-gradient-to-b from-[#EFFAFD]/70 via-white to-[#EFFAFD]/40 relative text-center space-y-5 shadow-sm">
              {/* Corner Watermark */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#DCE7F2] text-[10px] font-bold font-mono text-[#2459A8] shadow-2xs">
                <ShieldCheck size={12} className="text-[#4A8BDF]" />
                VERIFIED RU READY CREDENTIAL
              </div>

              {/* Logo / Badge */}
              <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-[#2459A8] via-[#4A8BDF] to-[#A0006D] text-white flex items-center justify-center shadow-lg">
                <Award size={32} />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#A0006D] font-mono">
                  Certificate of Competency Mastery
                </span>
                <h2 className="text-2xl sm:text-3xl font-black font-display text-[#11183D] tracking-tight">
                  {candidateName}
                </h2>
                <p className="text-xs text-[#526078] max-w-md mx-auto">
                  Has successfully satisfied the architectural challenges, practical sandbox drills, and Ava Socratic defenses for:
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#DCE7F2] inline-block max-w-lg shadow-2xs">
                <h3 className="text-base font-bold font-display text-[#2459A8]">
                  {roadmap.title}
                </h3>
                <span className="text-[11px] font-semibold text-[#526078]">
                  Calibrated to {roadmap.targetCompanyTier} Engineering Standards
                </span>
              </div>

              <div className="pt-4 border-t border-[#DCE7F2] flex flex-wrap items-center justify-between gap-4 text-xs text-[#526078] font-mono">
                <div>
                  <span className="block text-[9px] uppercase text-[#7B8799]">Issued On</span>
                  <strong>{currentDate}</strong>
                </div>
                <div>
                  <span className="block text-[9px] uppercase text-[#7B8799]">Credential ID</span>
                  <strong>{verificationHash}</strong>
                </div>
                <div>
                  <span className="block text-[9px] uppercase text-[#7B8799]">Curriculum Board</span>
                  <strong className="text-[#168A62]">RU Ready Certified</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-[#EFFAFD] border-t border-[#DCE7F2] flex items-center justify-between">
            <span className="text-xs text-[#526078]">
              Share this certificate on LinkedIn, GitHub, or your portfolio.
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopyVerification}
                icon={<Share2 size={13} />}
              >
                Copy Link
              </Button>
              <Button
                variant="royal"
                size="sm"
                onClick={() => {
                  window.print();
                }}
                icon={<Download size={13} />}
              >
                Download PDF
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
