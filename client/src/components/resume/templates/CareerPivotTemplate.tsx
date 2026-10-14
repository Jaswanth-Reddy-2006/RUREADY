import React from 'react';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, ExternalLink } from 'lucide-react';
import { ResumeData } from '../../../utils/atsEngine';

interface TemplateProps {
  data: ResumeData;
  highlightKeywords?: string[];
}

export default function CareerPivotTemplate({ data, highlightKeywords = [] }: TemplateProps) {
  return (
    <div className="resume-paper career-pivot bg-white text-slate-900 p-8 sm:p-10 shadow-lg rounded-2xl max-w-4xl mx-auto border border-emerald-100 font-sans text-xs leading-relaxed print:p-0 print:border-0 print:shadow-none print:max-w-none print:rounded-none">
      
      {/* Header with Clear Career Focus */}
      <header className="border-b-2 border-emerald-800 pb-4 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 uppercase">
              {data.personalInfo.fullName}
            </h1>
            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mt-0.5">
              {data.personalInfo.title}
            </p>
          </div>

          <div className="text-left sm:text-right text-[11px] text-slate-600 space-y-0.5">
            {data.personalInfo.location && <div>{data.personalInfo.location}</div>}
            <div className="flex flex-wrap sm:justify-end gap-2 text-slate-700">
              {data.personalInfo.email && (
                <a href={`mailto:${data.personalInfo.email}`} className="text-emerald-900 font-medium hover:underline">
                  {data.personalInfo.email}
                </a>
              )}
              {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
            </div>
            <div className="flex flex-wrap sm:justify-end gap-2 text-[10.5px] text-slate-500 pt-0.5">
              {data.personalInfo.portfolio && (
                <a href={data.personalInfo.portfolio} target="_blank" rel="noreferrer" className="text-emerald-800 hover:underline">
                  Portfolio
                </a>
              )}
              {data.personalInfo.github && (
                <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="text-emerald-800 hover:underline">
                  GitHub
                </a>
              )}
              {data.personalInfo.linkedin && (
                <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-emerald-800 hover:underline">
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Transition Summary / Narrative */}
      {data.summary && (
        <section className="mb-5 bg-emerald-50/60 border border-emerald-200 p-4 rounded-xl">
          <h2 className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-950 mb-1">
            Career Objective & Transferable Value
          </h2>
          <p className="text-[11.5px] text-slate-800 leading-relaxed">
            {data.summary}
          </p>
        </section>
      )}

      {/* Core Transferable Competencies (Prominent) */}
      <section className="mb-5 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5">
          Transferable Competencies & Technical Skills
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
          {data.skills.languages?.length > 0 && (
            <div>
              <strong className="text-slate-900 block mb-0.5">Programming Languages & Syntax:</strong>
              <div className="flex flex-wrap gap-1">
                {data.skills.languages.map((s, idx) => (
                  <span key={idx} className="bg-white text-emerald-900 px-2 py-0.5 rounded border border-emerald-200 text-[10.5px] font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
          {data.skills.frameworks?.length > 0 && (
            <div>
              <strong className="text-slate-900 block mb-0.5">Modern Frameworks & Libraries:</strong>
              <div className="flex flex-wrap gap-1">
                {data.skills.frameworks.map((s, idx) => (
                  <span key={idx} className="bg-white text-emerald-900 px-2 py-0.5 rounded border border-emerald-200 text-[10.5px] font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
          {data.skills.databases?.length > 0 && (
            <div>
              <strong className="text-slate-900 block mb-0.5">Data Persistence & Caching:</strong>
              <span className="text-slate-700">{data.skills.databases.join(', ')}</span>
            </div>
          )}
          {data.skills.cloudDevOps?.length > 0 && (
            <div>
              <strong className="text-slate-900 block mb-0.5">Cloud & Deployment Workflows:</strong>
              <span className="text-slate-700">{data.skills.cloudDevOps.join(', ')}</span>
            </div>
          )}
        </div>
      </section>

      {/* Transition Projects & Proof of Work (Before Work History) */}
      {data.projects?.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 border-b border-emerald-800 pb-1 mb-3">
            Selected Applied Projects & Technical Proof of Work
          </h2>
          <div className="space-y-3.5">
            {data.projects.map((proj) => (
              <div key={proj.id} className="border-l-2 border-emerald-600 pl-3 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-950 text-xs">{proj.name}</strong>
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-[10px] text-emerald-700 hover:underline inline-flex items-center gap-0.5">
                        <ExternalLink size={9} /> Live Demo
                      </a>
                    )}
                  </div>
                  {proj.techStack?.length > 0 && (
                    <span className="text-[10.5px] font-mono text-slate-500">
                      {proj.techStack.join(' • ')}
                    </span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-[11px] text-slate-700">{proj.description}</p>
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

      {/* Relevant & Cross-Functional Work History */}
      {data.experience?.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
            Professional Experience & Cross-Functional Achievements
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{exp.title}</h3>
                    <p className="text-[11px] text-slate-700 font-medium">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                  </div>
                  <span className="text-[10.5px] text-slate-500 shrink-0 font-medium">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>

                {exp.bullets?.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-slate-700">
                    {exp.bullets.map((b, idx) => (
                      <li key={idx} className="leading-relaxed">{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Certifications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {data.education?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Education
            </h2>
            <div className="space-y-2 text-[11px]">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <strong className="text-slate-900 block">{edu.degree}</strong>
                  <span className="text-slate-700">{edu.school}</span>
                  <span className="text-slate-500 text-[10.5px] block">{edu.startDate} – {edu.endDate}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.certifications?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Certifications & Upskilling
            </h2>
            <div className="space-y-1.5 text-[11px]">
              {data.certifications.map((c) => (
                <div key={c.id}>
                  <strong className="text-slate-900 block">{c.title}</strong>
                  <span className="text-slate-600">{c.issuer} {c.date ? `(${c.date})` : ''}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Custom Sections / Achievements */}
      {data.customSections && data.customSections.length > 0 && (
        <div className="space-y-3">
          {data.customSections.map((sec) => (
            <section key={sec.id}>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-1.5">
                {sec.title}
              </h2>
              <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11px] text-slate-700">
                {sec.items.map((it, idx) => (
                  <li key={idx}>{it}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

    </div>
  );
}
