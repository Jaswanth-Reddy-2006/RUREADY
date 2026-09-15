import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Sparkles, ShieldCheck, ArrowRight, Eye, LayoutTemplate } from 'lucide-react';
import { TemplateMetadata, ResumeTemplateId } from '../../store/useResumeStore';
import ResumeRenderer from './templates/ResumeRenderer';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface TemplateOverviewModalProps {
  template: TemplateMetadata | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (templateId: ResumeTemplateId) => void;
  isSelected?: boolean;
}

export default function TemplateOverviewModal({
  template,
  isOpen,
  onClose,
  onSelect,
  isSelected = false,
}: TemplateOverviewModalProps) {
  if (!isOpen || !template) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col z-10 overflow-hidden"
        >
          {/* Top Bar Header */}
          <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <LayoutTemplate size={18} />
                </span>
                <h2 className="text-xl font-black text-slate-900 font-display">
                  {template.name}
                </h2>
                <Badge variant="teal" size="sm">
                  {template.tag}
                </Badge>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-mono">
                  <ShieldCheck size={13} /> ATS {template.atsRating}%
                </span>
              </div>
              <p className="text-xs text-slate-600 max-w-2xl">
                {template.desc}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant={isSelected ? 'secondary' : 'royal'}
                size="md"
                onClick={() => {
                  onSelect(template.id);
                  onClose();
                }}
                icon={isSelected ? <Check size={16} /> : <Sparkles size={16} />}
              >
                {isSelected ? 'Active Template' : 'Use This Template'}
              </Button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                aria-label="Close overview"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Specifications Ribbon */}
          <div className="px-4 sm:px-6 py-2.5 bg-indigo-50/50 border-b border-indigo-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="text-slate-700">
              <strong className="text-slate-900 font-semibold">Recommended for: </strong>
              <span>{template.recommendedFor}</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {template.highlights.map((h, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-indigo-900 border border-indigo-200 shadow-xs"
                >
                  ✓ {h}
                </span>
              ))}
            </div>
          </div>

          {/* Scrollable Live Document Preview Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100/70">
            <div className="max-w-3xl mx-auto shadow-xl rounded-2xl overflow-hidden bg-white">
              <ResumeRenderer
                templateId={template.id}
                data={template.samplePersona}
              />
            </div>
          </div>

          {/* Bottom Footer Bar */}
          <div className="p-3 sm:p-4 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500 shrink-0">
            <span className="italic">
              * Displayed with sample candidate profile ({template.samplePersona.personalInfo.fullName}). Your own details will render here when applied.
            </span>
            <Button
              variant="royal"
              size="sm"
              onClick={() => {
                onSelect(template.id);
                onClose();
              }}
              icon={<Sparkles size={14} />}
            >
              Apply {template.name}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
