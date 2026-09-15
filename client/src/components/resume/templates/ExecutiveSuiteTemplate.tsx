import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, ShieldCheck } from 'lucide-react';
import { ResumeData } from '../../../utils/atsEngine';

interface TemplateProps {
  data: ResumeData;
  highlightKeywords?: string[];
}

export default function ExecutiveSuiteTemplate({ data, highlightKeywords = [] }: TemplateProps) {
  const isKeyword = (word: string) => {
    if (!highlightKeywords || highlightKeywords.length === 0) return false;
    return highlightKeywords.some((kw) => word.toLowerCase().includes(kw.toLowerCase()));
  };

  return (
    <div className="resume-paper executive-suite bg-[#fcfcfd] text-slate-900 p-8 sm:p-10 shadow-lg rounded-2xl max-w-4xl mx-auto border border-slate-300 font-sans text-xs leading-relaxed print:p-0 print:border-0 print:shadow-none print:max-w-none print:rounded-none">
      
      {/* Executive Centered Header */}
      <header className="text-center pb-5 mb-5 border-b-2 border-slate-900 space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-widest text-slate-950 uppercase font-serif">
          {data.personalInfo.fullName}
        </h1>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
          {data.personalInfo.title}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-slate-600 font-medium">
          <span className="flex items-center gap-1">
            <MapPin size={11} className="text-slate-800" /> {data.personalInfo.location}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Mail size={11} className="text-slate-800" /> {data.personalInfo.email}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Phone size={11} className="text-slate-800" /> {data.personalInfo.phone}
          </span>
          {data.personalInfo.linkedin && (
            <>
              <span>•</span>
              <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-800 hover:underline">
                <Linkedin size={11} /> {data.personalInfo.linkedin.replace(/^https?:\/\//, '')}
              </a>
            </>
          )}
        </div>
      </header>

      {/* Executive Summary Callout */}
      {data.summary && (
        <section className="mb-5 bg-slate-100/70 border-l-4 border-slate-900 p-4 rounded-r-xl">
          <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-800 mb-1 font-mono">
            Executive Leadership & Strategy Overview
          </h2>
          <p className="text-[11.5px] text-slate-800 leading-relaxed font-serif">
            {data.summary}
          </p>
        </section>
      )}

      {/* Areas of Core Expertise & Governance */}
      <section className="mb-5">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-950 border-b border-slate-300 pb-1 mb-2 font-mono">
          Strategic & Technical Governance
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
          {data.skills.languages?.length > 0 && (
            <div>
              <strong className="text-slate-950">Languages: </strong>
              <span className="text-slate-700">{data.skills.languages.join(' • ')}</span>
            </div>
          )}
          {data.skills.frameworks?.length > 0 && (
            <div>
              <strong className="text-slate-950">Architecture: </strong>
              <span className="text-slate-700">{data.skills.frameworks.join(' • ')}</span>
            </div>
          )}
          {data.skills.cloudDevOps?.length > 0 && (
            <div>
              <strong className="text-slate-950">Cloud & Scale: </strong>
              <span className="text-slate-700">{data.skills.cloudDevOps.join(' • ')}</span>
            </div>
          )}
          {data.skills.databases?.length > 0 && (
            <div>
              <strong className="text-slate-950">Data Infrastructure: </strong>
              <span className="text-slate-700">{data.skills.databases.join(' • ')}</span>
            </div>
          )}
        </div>
      </section>

      {/* Leadership & Professional Experience */}
      {data.experience?.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-950 border-b border-slate-300 pb-1 mb-3 font-mono">
            Executive & Engineering Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <div>
                    <span className="font-extrabold text-slate-950 text-[12px]">{exp.title}</span>
                    <span className="text-slate-500 mx-1.5">—</span>
                    <span className="font-bold text-slate-800">{exp.company}</span>
                    {exp.location && <span className="text-slate-500 text-[10.5px] ml-1">({exp.location})</span>}
                  </div>
                  <span className="text-[10.5px] font-mono text-slate-600 font-semibold">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-slate-800">
                  {exp.bullets.map((b, idx) => (
                    <li key={idx} className={isKeyword(b) ? 'bg-amber-50 rounded px-1 -mx-1' : ''}>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Strategic Initiatives & Projects */}
      {data.projects?.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-950 border-b border-slate-300 pb-1 mb-3 font-mono">
            Strategic Programs & Systems
          </h2>
          <div className="space-y-3">
            {data.projects.map((proj) => (
              <div key={proj.id} className="space-y-0.5">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <span className="font-bold text-slate-950 text-[11.5px]">{proj.name}</span>
                  {proj.techStack?.length > 0 && (
                    <span className="text-[10px] font-mono text-slate-600">
                      {proj.techStack.join(' • ')}
                    </span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-[11px] text-slate-600 italic">{proj.description}</p>
                )}
                {proj.bullets?.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11px] text-slate-700">
                    {proj.bullets.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Credentials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-300">
        {data.education?.length > 0 && (
          <div>
            <h3 className="text-[10.5px] font-bold uppercase tracking-widest text-slate-950 mb-1 font-mono">
              Academic Background
            </h3>
            {data.education.map((edu) => (
              <div key={edu.id} className="text-[11px]">
                <div className="font-bold text-slate-900">{edu.degree}</div>
                <div className="text-slate-600">{edu.school} ({edu.startDate}–{edu.endDate})</div>
              </div>
            ))}
          </div>
        )}

        {data.certifications?.length > 0 && (
          <div>
            <h3 className="text-[10.5px] font-bold uppercase tracking-widest text-slate-950 mb-1 font-mono">
              Professional Credentials
            </h3>
            {data.certifications.map((c) => (
              <div key={c.id} className="text-[11px]">
                <span className="font-bold text-slate-900">{c.title}</span>
                <span className="text-slate-500 text-[10.5px] ml-1">({c.issuer})</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
