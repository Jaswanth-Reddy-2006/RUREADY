import React from 'react';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, ExternalLink, Rocket, Sparkles } from 'lucide-react';
import { ResumeData } from '../../../utils/atsEngine';

interface TemplateProps {
  data: ResumeData;
  highlightKeywords?: string[];
}

export default function StartupInnovatorTemplate({ data, highlightKeywords = [] }: TemplateProps) {
  const isKeyword = (word: string) => {
    if (!highlightKeywords || highlightKeywords.length === 0) return false;
    return highlightKeywords.some((kw) => word.toLowerCase().includes(kw.toLowerCase()));
  };

  return (
    <div className="resume-paper startup-innovator bg-white text-slate-900 p-8 sm:p-10 shadow-lg rounded-2xl max-w-4xl mx-auto border border-indigo-100 font-sans text-xs leading-relaxed print:p-0 print:border-0 print:shadow-none print:max-w-none print:rounded-none">
      
      {/* Dynamic Modern Header */}
      <header className="border-b-2 border-indigo-600 pb-5 mb-5 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 uppercase">
                {data.personalInfo.fullName}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Rocket size={10} /> Builder
              </span>
            </div>
            <p className="text-sm font-bold text-indigo-600 mt-0.5">
              {data.personalInfo.title}
            </p>
          </div>
          <div className="text-right text-[11px] text-slate-500 flex flex-wrap sm:flex-col gap-1 sm:gap-0.5 font-medium">
            <span>{data.personalInfo.location}</span>
            <a href={`mailto:${data.personalInfo.email}`} className="text-indigo-600 hover:underline">
              {data.personalInfo.email}
            </a>
            <span>{data.personalInfo.phone}</span>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-medium">
          {data.personalInfo.portfolio && (
            <a href={data.personalInfo.portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-indigo-600 hover:underline">
              <Globe size={12} /> {data.personalInfo.portfolio.replace(/^https?:\/\//, '')}
            </a>
          )}
          {data.personalInfo.github && (
            <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-700 hover:text-indigo-600">
              <Github size={12} /> {data.personalInfo.github.replace(/^https?:\/\//, '')}
            </a>
          )}
          {data.personalInfo.linkedin && (
            <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-700 hover:text-indigo-600">
              <Linkedin size={12} /> {data.personalInfo.linkedin.replace(/^https?:\/\//, '')}
            </a>
          )}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mb-5">
          <p className="text-[11.5px] text-slate-700 leading-relaxed bg-slate-50/80 p-3 rounded-xl border border-slate-100">
            {data.summary}
          </p>
        </section>
      )}

      {/* Core Tech Stack Badges */}
      <section className="mb-5">
        <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 mb-2 flex items-center gap-2">
          <span>Core Tech Stack</span>
          <div className="h-[1px] bg-indigo-100 flex-1" />
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {[
            ...(data.skills.languages || []),
            ...(data.skills.frameworks || []),
            ...(data.skills.databases || []),
            ...(data.skills.cloudDevOps || [])
          ].map((skill, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-indigo-50/70 text-indigo-950 border border-indigo-200/80"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Highlighted Projects */}
      {data.projects?.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 mb-3 flex items-center gap-2">
            <span>Featured Production Builds</span>
            <div className="h-[1px] bg-indigo-100 flex-1" />
          </h2>
          <div className="space-y-3">
            {data.projects.map((proj) => (
              <div key={proj.id} className="p-3 rounded-xl border border-slate-200/80 hover:border-indigo-200 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[12px] text-slate-900">{proj.name}</span>
                    {proj.techStack?.length > 0 && (
                      <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
                        {proj.techStack.join(' • ')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10.5px]">
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-0.5 text-indigo-600 font-bold hover:underline">
                        Live App <ExternalLink size={10} />
                      </a>
                    )}
                    {proj.repoUrl && (
                      <a href={proj.repoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-0.5 text-slate-600 hover:underline">
                        Repo <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>
                {proj.description && (
                  <p className="text-[11px] text-slate-600 mb-1">{proj.description}</p>
                )}
                {proj.bullets?.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11px] text-slate-700">
                    {proj.bullets.map((b, idx) => (
                      <li key={idx} className={isKeyword(b) ? 'bg-amber-50 rounded px-1 -mx-1' : ''}>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 mb-3 flex items-center gap-2">
            <span>Career Milestones</span>
            <div className="h-[1px] bg-indigo-100 flex-1" />
          </h2>
          <div className="space-y-3">
            {data.experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <div>
                    <span className="font-extrabold text-[12px] text-slate-900">{exp.title}</span>
                    <span className="text-slate-400 mx-1.5">@</span>
                    <span className="font-bold text-indigo-600">{exp.company}</span>
                    {exp.location && <span className="text-slate-400 text-[10.5px] ml-1">({exp.location})</span>}
                  </div>
                  <span className="text-[10.5px] font-mono font-medium text-slate-500">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11px] text-slate-700">
                  {exp.bullets.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Certs Inline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
        {data.education?.length > 0 && (
          <div>
            <h3 className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-900 mb-1">
              Education
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
            <h3 className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-900 mb-1">
              Credentials
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
