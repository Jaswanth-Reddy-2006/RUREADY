import React from 'react';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, ExternalLink } from 'lucide-react';
import { ResumeData } from '../../../utils/atsEngine';

interface TemplateProps {
  data: ResumeData;
  highlightKeywords?: string[];
}

export default function ExecutiveBlacklineTemplate({ data, highlightKeywords = [] }: TemplateProps) {
  return (
    <div className="resume-paper executive-blackline bg-white text-slate-900 p-8 sm:p-10 shadow-xl rounded-2xl max-w-4xl mx-auto border border-slate-300 font-sans text-xs leading-relaxed print:p-0 print:border-0 print:shadow-none print:max-w-none print:rounded-none">
      
      {/* Heavy Blackline Nameplate */}
      <header className="bg-slate-950 text-white -mx-8 -mt-8 sm:-mx-10 sm:-mt-10 p-7 sm:p-8 rounded-t-2xl print:rounded-none print:mx-0 print:mt-0 print:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase text-white font-serif">
              {data.personalInfo.fullName}
            </h1>
            <p className="text-xs sm:text-sm font-semibold tracking-wider text-slate-300 uppercase">
              {data.personalInfo.title}
            </p>
          </div>

          <div className="text-left sm:text-right text-[11px] text-slate-300 space-y-0.5">
            {data.personalInfo.location && <div>{data.personalInfo.location}</div>}
            <div className="flex flex-wrap sm:justify-end gap-2 text-slate-300">
              {data.personalInfo.email && (
                <a href={`mailto:${data.personalInfo.email}`} className="text-white hover:underline">
                  {data.personalInfo.email}
                </a>
              )}
              {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
            </div>
            <div className="flex flex-wrap sm:justify-end gap-2 text-[10.5px] text-slate-400 pt-0.5">
              {data.personalInfo.linkedin && (
                <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:text-white">
                  LinkedIn
                </a>
              )}
              {data.personalInfo.portfolio && (
                <a href={data.personalInfo.portfolio} target="_blank" rel="noreferrer" className="hover:text-white">
                  Portfolio
                </a>
              )}
              {data.personalInfo.github && (
                <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="hover:text-white">
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Executive Summary Callout */}
      {data.summary && (
        <section className="mb-6 bg-slate-50 border-l-4 border-slate-900 p-4 rounded-r-lg">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-950 mb-1.5 font-serif">
            Executive Leadership Profile
          </h2>
          <p className="text-[11.5px] text-slate-700 leading-relaxed font-sans">
            {data.summary}
          </p>
        </section>
      )}

      {/* Core Competencies Matrix */}
      <section className="mb-6 border-b border-slate-200 pb-5">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-950 mb-2 font-serif border-b border-slate-900 pb-1">
          Areas of Strategic & Technical Expertise
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-[11px]">
          {data.skills.languages?.length > 0 && (
            <div>
              <strong className="text-slate-900">Languages & Core: </strong>
              <span className="text-slate-700">{data.skills.languages.join(', ')}</span>
            </div>
          )}
          {data.skills.frameworks?.length > 0 && (
            <div>
              <strong className="text-slate-900">Frameworks & Architecture: </strong>
              <span className="text-slate-700">{data.skills.frameworks.join(', ')}</span>
            </div>
          )}
          {data.skills.databases?.length > 0 && (
            <div>
              <strong className="text-slate-900">Data Stores & In-Memory: </strong>
              <span className="text-slate-700">{data.skills.databases.join(', ')}</span>
            </div>
          )}
          {data.skills.cloudDevOps?.length > 0 && (
            <div>
              <strong className="text-slate-900">Cloud Infrastructure & Operations: </strong>
              <span className="text-slate-700">{data.skills.cloudDevOps.join(', ')}</span>
            </div>
          )}
          {data.skills.tools?.length > 0 && (
            <div className="sm:col-span-2">
              <strong className="text-slate-900">Operational Tools & Governance: </strong>
              <span className="text-slate-700">{data.skills.tools.join(', ')}</span>
            </div>
          )}
        </div>
      </section>

      {/* Executive Experience Hierarchy */}
      {data.experience?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-950 mb-4 font-serif border-b border-slate-900 pb-1">
            Executive & Professional Experience
          </h2>
          <div className="space-y-5">
            {data.experience.map((exp) => (
              <div key={exp.id} className="space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-950 font-serif text-[12.5px]">
                      {exp.title}
                    </h3>
                    <p className="text-[11px] font-semibold text-slate-800">
                      {exp.company}{exp.location ? ` | ${exp.location}` : ''}
                    </p>
                  </div>
                  <span className="text-[11px] font-medium text-slate-600 sm:text-right shrink-0">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>

                {exp.bullets?.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-slate-700">
                    {exp.bullets.map((b, idx) => (
                      <li key={idx} className="leading-relaxed">
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

      {/* Flagship Production Projects / Engagements */}
      {data.projects?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-950 mb-3 font-serif border-b border-slate-900 pb-1">
            Selected Strategic Initiatives & Deliveries
          </h2>
          <div className="space-y-3.5">
            {data.projects.map((proj) => (
              <div key={proj.id} className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-950 text-[11.5px] font-serif">{proj.name}</strong>
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-[10px] text-slate-600 hover:text-slate-900 inline-flex items-center gap-0.5">
                        <ExternalLink size={9} /> Link
                      </a>
                    )}
                  </div>
                  {proj.techStack?.length > 0 && (
                    <span className="text-[10.5px] text-slate-600">
                      [{proj.techStack.join(', ')}]
                    </span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-[11px] text-slate-700 italic">{proj.description}</p>
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

      {/* Education & Academic Honors */}
      {data.education?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-950 mb-2 font-serif border-b border-slate-900 pb-1">
            Education & Executive Credentials
          </h2>
          <div className="space-y-2.5">
            {data.education.map((edu) => (
              <div key={edu.id} className="flex flex-col sm:flex-row sm:items-baseline justify-between text-[11px]">
                <div>
                  <strong className="text-slate-950">{edu.degree}</strong>
                  <span className="text-slate-700"> — {edu.school}{edu.location ? `, ${edu.location}` : ''}</span>
                  {edu.highlights && <p className="text-[10.5px] text-slate-600 mt-0.5">{edu.highlights}</p>}
                </div>
                <span className="text-slate-600 shrink-0 font-medium">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Governance */}
      {data.certifications?.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-950 mb-1.5 font-serif border-b border-slate-900 pb-1">
            Certifications & Governance Accreditations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            {data.certifications.map((c) => (
              <div key={c.id} className="flex justify-between items-baseline">
                <span><strong className="text-slate-900">{c.title}</strong> — {c.issuer}</span>
                {c.date && <span className="text-slate-500 text-[10.5px]">{c.date}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Publications, Patents, Honors */}
      {(Boolean(data.publications?.length) || Boolean(data.patents?.length) || Boolean(data.achievements?.length)) && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-950 mb-2 font-serif border-b border-slate-900 pb-1">
            Governance, Patents & Distinctions
          </h2>
          <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-slate-700">
            {data.patents?.map((pat) => (
              <li key={pat.id}>
                <strong>Patent:</strong> {pat.title} {pat.number ? `(${pat.number})` : ''} {pat.date ? `[${pat.date}]` : ''}
              </li>
            ))}
            {data.publications?.map((pub) => (
              <li key={pub.id}>
                <strong>Publication:</strong> {pub.title} {pub.venue ? `— ${pub.venue}` : ''} {pub.date ? `(${pub.date})` : ''}
              </li>
            ))}
            {data.achievements?.map((ach, idx) => (
              <li key={idx}>{ach}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Custom Sections */}
      {data.customSections && data.customSections.length > 0 && (
        <div className="space-y-4">
          {data.customSections.map((sec) => (
            <section key={sec.id}>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-950 mb-1.5 font-serif border-b border-slate-900 pb-1">
                {sec.title}
              </h2>
              <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-slate-700">
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
