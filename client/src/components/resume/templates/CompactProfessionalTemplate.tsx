import React from 'react';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, ExternalLink } from 'lucide-react';
import { ResumeData } from '../../../utils/atsEngine';

interface TemplateProps {
  data: ResumeData;
  highlightKeywords?: string[];
}

export default function CompactProfessionalTemplate({ data, highlightKeywords = [] }: TemplateProps) {
  return (
    <div className="resume-paper compact-professional bg-white text-slate-900 p-6 sm:p-8 shadow-lg rounded-2xl max-w-4xl mx-auto border border-slate-300 font-sans text-[11px] leading-snug print:p-0 print:border-0 print:shadow-none print:max-w-none print:rounded-none">
      
      {/* Super Compact Header */}
      <header className="border-b-2 border-slate-800 pb-2 mb-2.5">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950">
              {data.personalInfo.fullName}
            </h1>
            <p className="text-[11.5px] font-bold text-slate-700 tracking-wide">
              {data.personalInfo.title}
            </p>
          </div>

          <div className="text-left sm:text-right text-[10.5px] text-slate-600 space-y-0.5">
            <div>
              {data.personalInfo.location && <span>{data.personalInfo.location} • </span>}
              <a href={`mailto:${data.personalInfo.email}`} className="text-slate-900 hover:underline">{data.personalInfo.email}</a>
              {data.personalInfo.phone && <span> • {data.personalInfo.phone}</span>}
            </div>
            <div className="flex flex-wrap sm:justify-end gap-2 text-[10px] text-slate-700">
              {data.personalInfo.linkedin && (
                <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>
              )}
              {data.personalInfo.github && (
                <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
              )}
              {data.personalInfo.portfolio && (
                <a href={data.personalInfo.portfolio} target="_blank" rel="noreferrer" className="hover:underline">Portfolio</a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mb-2">
          <p className="text-[10.5px] text-slate-700 leading-tight">
            {data.summary}
          </p>
        </section>
      )}

      {/* Compact Skills Grid */}
      <section className="mb-2.5">
        <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-1">
          Core Competencies & Technical Skills
        </h2>
        <div className="space-y-0.5 text-[10.5px]">
          {data.skills.languages?.length > 0 && (
            <div>
              <strong className="text-slate-900">Languages: </strong>
              <span className="text-slate-700">{data.skills.languages.join(', ')}</span>
            </div>
          )}
          {data.skills.frameworks?.length > 0 && (
            <div>
              <strong className="text-slate-900">Frameworks: </strong>
              <span className="text-slate-700">{data.skills.frameworks.join(', ')}</span>
            </div>
          )}
          {data.skills.databases?.length > 0 && (
            <div>
              <strong className="text-slate-900">Databases: </strong>
              <span className="text-slate-700">{data.skills.databases.join(', ')}</span>
            </div>
          )}
          {data.skills.cloudDevOps?.length > 0 && (
            <div>
              <strong className="text-slate-900">Cloud / DevOps: </strong>
              <span className="text-slate-700">{data.skills.cloudDevOps.join(', ')}</span>
            </div>
          )}
        </div>
      </section>

      {/* Work History (Dense, Space-Efficient) */}
      {data.experience?.length > 0 && (
        <section className="mb-2.5">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-1.5">
            Professional Experience
          </h2>
          <div className="space-y-2">
            {data.experience.map((exp) => (
              <div key={exp.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <div>
                    <strong className="text-[11px] text-slate-950">{exp.title}</strong>
                    <span className="text-slate-700 font-medium"> — {exp.company}{exp.location ? `, ${exp.location}` : ''}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>

                {exp.bullets?.length > 0 && (
                  <ul className="list-disc list-outside ml-3.5 space-y-0.5 text-[10.5px] text-slate-700">
                    {exp.bullets.map((b, idx) => (
                      <li key={idx} className="leading-snug">{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects?.length > 0 && (
        <section className="mb-2.5">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-1">
            Projects
          </h2>
          <div className="space-y-1.5">
            {data.projects.map((proj) => (
              <div key={proj.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <div className="flex items-center gap-1.5">
                    <strong className="text-[11px] text-slate-950">{proj.name}</strong>
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-[9.5px] text-slate-600 hover:underline">
                        [Link]
                      </a>
                    )}
                  </div>
                  {proj.techStack?.length > 0 && (
                    <span className="text-[10px] text-slate-500 font-mono">
                      {proj.techStack.join(', ')}
                    </span>
                  )}
                </div>
                {proj.bullets?.length > 0 && (
                  <ul className="list-disc list-outside ml-3.5 space-y-0.5 text-[10.5px] text-slate-700">
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

      {/* Education & Certifications Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
        {data.education?.length > 0 && (
          <section>
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-1">
              Education
            </h2>
            <div className="space-y-1 text-[10.5px]">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline">
                  <div>
                    <strong className="text-slate-900">{edu.degree}</strong>
                    <div className="text-slate-700">{edu.school}</div>
                  </div>
                  <span className="text-[9.5px] text-slate-500 shrink-0 font-mono">{edu.startDate} – {edu.endDate}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.certifications?.length > 0 && (
          <section>
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-1">
              Certifications
            </h2>
            <div className="space-y-0.5 text-[10.5px]">
              {data.certifications.map((c) => (
                <div key={c.id}>
                  <strong className="text-slate-900">{c.title}</strong>
                  <span className="text-slate-600 text-[10px]"> — {c.issuer}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Additional / Custom */}
      {data.customSections && data.customSections.length > 0 && (
        <div className="space-y-1.5">
          {data.customSections.map((sec) => (
            <section key={sec.id}>
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 mb-1">
                {sec.title}
              </h2>
              <ul className="list-disc list-outside ml-3.5 space-y-0.5 text-[10.5px] text-slate-700">
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
