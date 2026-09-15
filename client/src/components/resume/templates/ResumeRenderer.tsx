import React from 'react';
import { ResumeData } from '../../../utils/atsEngine';
import { ResumeTemplateId } from '../../../store/useResumeStore';
import ModernTechTemplate from './ModernTechTemplate';
import HarvardClassicTemplate from './HarvardClassicTemplate';
import MinimalExecutiveTemplate from './MinimalExecutiveTemplate';
import CreativeFullstackTemplate from './CreativeFullstackTemplate';
import FaangCompactTemplate from './FaangCompactTemplate';
import StanfordAcademicTemplate from './StanfordAcademicTemplate';
import StartupInnovatorTemplate from './StartupInnovatorTemplate';
import ExecutiveSuiteTemplate from './ExecutiveSuiteTemplate';

interface ResumeRendererProps {
  templateId: ResumeTemplateId;
  data: ResumeData;
  highlightKeywords?: string[];
  className?: string;
}

export default function ResumeRenderer({
  templateId,
  data,
  highlightKeywords = [],
  className = ''
}: ResumeRendererProps) {
  return (
    <div className={`resume-print-wrapper ${className}`}>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .resume-print-wrapper, .resume-print-wrapper * {
            visibility: visible;
          }
          .resume-print-wrapper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            background: white !important;
          }
          .resume-paper {
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            max-width: 100% !important;
            padding: 0 !important;
          }
          @page {
            margin: 1.2cm;
            size: letter;
          }
        }
      `}</style>

      {templateId === 'modern-tech' && (
        <ModernTechTemplate data={data} highlightKeywords={highlightKeywords} />
      )}
      {templateId === 'harvard-classic' && (
        <HarvardClassicTemplate data={data} highlightKeywords={highlightKeywords} />
      )}
      {templateId === 'minimal-executive' && (
        <MinimalExecutiveTemplate data={data} highlightKeywords={highlightKeywords} />
      )}
      {templateId === 'creative-fullstack' && (
        <CreativeFullstackTemplate data={data} highlightKeywords={highlightKeywords} />
      )}
      {templateId === 'faang-compact' && (
        <FaangCompactTemplate data={data} highlightKeywords={highlightKeywords} />
      )}
      {templateId === 'stanford-academic' && (
        <StanfordAcademicTemplate data={data} highlightKeywords={highlightKeywords} />
      )}
      {templateId === 'startup-innovator' && (
        <StartupInnovatorTemplate data={data} highlightKeywords={highlightKeywords} />
      )}
      {templateId === 'executive-suite' && (
        <ExecutiveSuiteTemplate data={data} highlightKeywords={highlightKeywords} />
      )}
    </div>
  );
}
