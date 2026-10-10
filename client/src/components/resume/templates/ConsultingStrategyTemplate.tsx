import React from 'react';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, ExternalLink, Briefcase } from 'lucide-react';
import { ResumeData } from '../../../utils/atsEngine';

interface TemplateProps {
  data: ResumeData;
  highlightKeywords?: string[];
}

export default function ConsultingStrategyTemplate({ data, highlightKeywords = [] }: TemplateProps) {
  return (
    <div className="resume-paper consulting-strategy bg-white text-slate-900 p-8 sm:p-11 shadow-lg rounded-2xl max-w-4xl mx-auto border border-slate-300 font-sans text-xs leading-relaxed print:p-0 print:border-0 print:shadow-none print:max-w-none print:rounded-none">
      
      {/* Consulting Advisory Header */}
      <header className="border-b-2 border-slate-900 pb-4 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-slate-900 text-white">
                <Briefcase size={14} />
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-slate-950 uppercase">
                {data.personalInfo.fullName}
              </h1>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-700 tracking-wider mt-1 uppercase font-sans">
              {data.personalInfo.title}
            </p>
          </div>

          <div className="text-left sm:text-right text-[11px] text-slate-600 space-y-0.5 font-sans">
            {data.personalInfo.location && <div>{data.personalInfo.location}</div>}
            <div>
              <a href={`mailto:${data.personalInfo.email}`} className="text-slate-900 font-bold hover:underline">
                {data.personalInfo.email}
              </a>
              {data.personalInfo.phone && <span> • {data.personalInfo.phone}</span>}
            </div>
            <div className="flex flex-wrap sm:justify-end gap-2 text-[10.5px] pt-0.5">
              {data.personalInfo.linkedin && (
                <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-slate-800 hover:underline">
                  LinkedIn
                </a>
              )}
              {data.personalInfo.portfolio && (
                <a href={data.personalInfo.portfolio} target="_blank" rel="noreferrer" className="text-slate-800 hover:underline">
                  Advisory Dossier
                </a>
              )}
              {data.personalInfo.github && (
                <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="text-slate-800 hover:underline">
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Structured Executive Summary */}
      {data.summary && (
        <section className="mb-5 bg-slate-50 border-l-4 border-slate-900 p-4 rounded-r-xl">
          <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-950 font-bold mb-1">
            Executive Summary & Advisory Practice Focus
          </h2>
          <p className="text-[11.5px] text-slate-800 leading-relaxed font-sans">
            {data.summary}
          </p>
        </section>
      )}

      {/* Practice Areas & Functional Competencies */}
      <section className="mb-5 border-b border-slate-200 pb-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 mb-2 border-b-2 border-slate-900 pb-0.5 font-serif">
          Core Practice Areas & Functional Expertise
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-[11px]">
          {data.skills.languages?.length > 0 && (
            <div>
              <strong className="text-slate-900">Quantitative Modeling & Tools: </strong>
              <span className="text-slate-700">{data.skills.languages.join(', ')}</span>
            </div>
          )}
          {data.skills.tools?.length > 0 && (
            <div>
              <strong className="text-slate-900">Advisory Frameworks & Analysis: </strong>
              <span className="text-slate-700">{data.skills.tools.join(', ')}</span>
            </div>
          )}
          {data.skills.frameworks?.length > 0 && (
            <div>
              <strong className="text-slate-900">Transformation Methodologies: </strong>
              <span className="text-slate-700">{data.skills.frameworks.join(', ')}</span>
            </div>
          )}
          {data.skills.databases?.length > 0 && (
            <div>
              <strong className="text-slate-900">Enterprise Systems & Data: </strong>
              <span className="text-slate-700">{data.skills.databases.join(', ')}</span>
            </div>
          )}
        </div>
      </section>

      {/* Client Engagements & Consulting Experience */}
      {data.experience?.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 mb-3 border-b-2 border-slate-900 pb-0.5 font-serif">
            Client Engagements & Professional Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline border-b border-slate-100 pb-0.5">
                  <div>
                    <h3 className="text-xs font-bold text-slate-950 font-serif text-[12px]">{exp.title}</h3>
                    <p className="text-[11px] text-slate-800 font-medium">{exp.company}{exp.location ? ` | ${exp.location}` : ''}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">
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

      {/* Analytical Engagements & Strategic Projects */}
      {data.projects?.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 mb-3 border-b-2 border-slate-900 pb-0.5 font-serif">
            Selected Strategic Initiatives & Diligence Engagements
          </h2>
          <div className="space-y-3">
            {data.projects.map((proj) => (
              <div key={proj.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-950 text-xs font-serif">{proj.name}</strong>
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-[10px] text-slate-700 hover:underline inline-flex items-center gap-0.5">
                        <ExternalLink size={9} /> Overview
                      </a>
                    )}
                  </div>
                  {proj.techStack?.length > 0 && (
                    <span className="text-[10px] font-mono text-slate-500">
                      [{proj.techStack.join(', ')}]
                    </span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-[11px] text-slate-600">{proj.description}</p>
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

      {/* Education & Certifications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {data.education?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 mb-2 border-b-2 border-slate-900 pb-0.5 font-serif">
              Education & Honors
            </h2>
            <div className="space-y-1.5 text-[11px]">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <strong className="text-slate-900 block font-serif">{edu.degree}</strong>
                  <span className="text-slate-700">{edu.school}</span>
                  <span className="text-slate-500 text-[10px] block font-mono">{edu.startDate} – {edu.endDate}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.certifications?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 mb-2 border-b-2 border-slate-900 pb-0.5 font-serif">
              Accreditations & Honors
            </h2>
            <div className="space-y-1.5 text-[11px]">
              {data.certifications.map((c) => (
                <div key={c.id}>
                  <strong className="text-slate-900 block">{c.title}</strong>
                  <span className="text-slate-600 text-[10.5px]">{c.issuer}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Custom Sections */}
      {data.customSections && data.customSections.length > 0 && (
        <div className="space-y-3">
          {data.customSections.map((sec) => (
            <section key={sec.id}>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 mb-1.5 border-b-2 border-slate-900 pb-0.5 font-serif">
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
