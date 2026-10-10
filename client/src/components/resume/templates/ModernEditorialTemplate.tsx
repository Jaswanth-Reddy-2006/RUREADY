import React from 'react';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, ExternalLink } from 'lucide-react';
import { ResumeData } from '../../../utils/atsEngine';

interface TemplateProps {
  data: ResumeData;
  highlightKeywords?: string[];
}

export default function ModernEditorialTemplate({ data, highlightKeywords = [] }: TemplateProps) {
  return (
    <div className="resume-paper modern-editorial bg-[#FCFCFD] text-[#1E293B] p-8 sm:p-12 shadow-lg rounded-2xl max-w-4xl mx-auto border border-slate-200 font-sans text-xs leading-relaxed print:p-0 print:border-0 print:shadow-none print:max-w-none print:rounded-none">
      
      {/* Editorial Nameplate */}
      <header className="border-b-2 border-slate-800 pb-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-semibold tracking-tight text-slate-900">
              {data.personalInfo.fullName}
            </h1>
            <p className="text-xs uppercase tracking-[0.2em] font-medium text-slate-600 mt-1 font-sans">
              {data.personalInfo.title}
            </p>
          </div>

          <div className="text-left sm:text-right text-[11px] text-slate-600 font-serif space-y-0.5">
            {data.personalInfo.location && <div>{data.personalInfo.location}</div>}
            <div>
              {data.personalInfo.email && (
                <a href={`mailto:${data.personalInfo.email}`} className="text-slate-900 hover:underline">
                  {data.personalInfo.email}
                </a>
              )}
              {data.personalInfo.phone && <span className="ml-1.5">• {data.personalInfo.phone}</span>}
            </div>
            <div className="flex flex-wrap sm:justify-end gap-2 text-[10.5px] font-sans pt-0.5">
              {data.personalInfo.portfolio && (
                <a href={data.personalInfo.portfolio} target="_blank" rel="noreferrer" className="text-slate-800 hover:underline">
                  portfolio
                </a>
              )}
              {data.personalInfo.linkedin && (
                <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-slate-800 hover:underline">
                  linkedin
                </a>
              )}
              {data.personalInfo.github && (
                <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="text-slate-800 hover:underline">
                  github
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Editorial Overview */}
      {data.summary && (
        <section className="mb-6">
          <h2 className="text-[10.5px] font-bold uppercase tracking-[0.25em] text-slate-900 mb-2 font-sans border-b border-slate-300 pb-1">
            Overview & Strategic Thesis
          </h2>
          <p className="text-[12px] font-serif text-slate-800 leading-relaxed italic max-w-3xl">
            "{data.summary}"
          </p>
        </section>
      )}

      {/* Areas of Practice & Technical Competencies */}
      <section className="mb-6">
        <h2 className="text-[10.5px] font-bold uppercase tracking-[0.25em] text-slate-900 mb-2 font-sans border-b border-slate-300 pb-1">
          Specializations & Technical Vocabulary
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
              <strong className="text-slate-900">Cloud & Platform: </strong>
              <span className="text-slate-700">{data.skills.cloudDevOps.join(', ')}</span>
            </div>
          )}
        </div>
      </section>

      {/* Chronological Narrative / Experience */}
      {data.experience?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[10.5px] font-bold uppercase tracking-[0.25em] text-slate-900 mb-3 font-sans border-b border-slate-300 pb-1">
            Professional Record
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                  <div>
                    <h3 className="text-[12.5px] font-serif font-semibold text-slate-900">
                      {exp.title}
                    </h3>
                    <span className="text-[11px] text-slate-600 font-sans">
                      {exp.company}{exp.location ? ` — ${exp.location}` : ''}
                    </span>
                  </div>
                  <span className="text-[10.5px] font-serif text-slate-500 italic shrink-0">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>

                {exp.bullets?.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-slate-700 font-sans">
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

      {/* Selected Initiatives & Projects */}
      {data.projects?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[10.5px] font-bold uppercase tracking-[0.25em] text-slate-900 mb-3 font-sans border-b border-slate-300 pb-1">
            Selected Works & Initiatives
          </h2>
          <div className="space-y-3">
            {data.projects.map((proj) => (
              <div key={proj.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <strong className="text-[11.5px] font-serif text-slate-900">{proj.name}</strong>
                  {proj.techStack?.length > 0 && (
                    <span className="text-[10px] text-slate-500 font-sans">
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

      {/* Education & Credentials */}
      {data.education?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[10.5px] font-bold uppercase tracking-[0.25em] text-slate-900 mb-2 font-sans border-b border-slate-300 pb-1">
            Academic Background
          </h2>
          <div className="space-y-2 text-[11px]">
            {data.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <strong className="text-slate-900 font-serif text-[11.5px]">{edu.degree}</strong>
                  <span className="text-slate-700">, {edu.school}{edu.location ? ` (${edu.location})` : ''}</span>
                  {edu.highlights && <p className="text-[10.5px] text-slate-600 italic mt-0.5">{edu.highlights}</p>}
                </div>
                <span className="text-slate-500 font-serif text-[10.5px] italic shrink-0">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications, Honors, Publications */}
      {(Boolean(data.certifications?.length) || Boolean(data.publications?.length) || Boolean(data.achievements?.length)) && (
        <section className="mb-5">
          <h2 className="text-[10.5px] font-bold uppercase tracking-[0.25em] text-slate-900 mb-2 font-sans border-b border-slate-300 pb-1">
            Accreditations & Publications
          </h2>
          <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-slate-700">
            {data.certifications?.map((c) => (
              <li key={c.id}>
                <strong>{c.title}</strong> — {c.issuer} {c.date ? `(${c.date})` : ''}
              </li>
            ))}
            {data.publications?.map((pub) => (
              <li key={pub.id}>
                <em>"{pub.title}"</em> — {pub.venue || 'Research Article'} {pub.date ? `(${pub.date})` : ''}
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
        <div className="space-y-3">
          {data.customSections.map((sec) => (
            <section key={sec.id}>
              <h2 className="text-[10.5px] font-bold uppercase tracking-[0.25em] text-slate-900 mb-1.5 font-sans border-b border-slate-300 pb-1">
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
