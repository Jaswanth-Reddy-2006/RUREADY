import React from 'react';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, ExternalLink, Target } from 'lucide-react';
import { ResumeData } from '../../../utils/atsEngine';

interface TemplateProps {
  data: ResumeData;
  highlightKeywords?: string[];
}

export default function ProductManagerTemplate({ data, highlightKeywords = [] }: TemplateProps) {
  return (
    <div className="resume-paper product-manager bg-white text-slate-900 p-8 sm:p-10 shadow-lg rounded-2xl max-w-4xl mx-auto border border-blue-100 font-sans text-xs leading-relaxed print:p-0 print:border-0 print:shadow-none print:max-w-none print:rounded-none">
      
      {/* Product Leadership Header */}
      <header className="border-b-2 border-blue-700 pb-4 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-blue-700">
                <Target size={16} />
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 uppercase">
                {data.personalInfo.fullName}
              </h1>
            </div>
            <p className="text-xs sm:text-sm font-bold text-blue-700 uppercase tracking-wider mt-0.5">
              {data.personalInfo.title}
            </p>
          </div>

          <div className="text-left sm:text-right text-[11px] text-slate-600 space-y-0.5 font-mono">
            {data.personalInfo.location && <div>{data.personalInfo.location}</div>}
            <div>
              <a href={`mailto:${data.personalInfo.email}`} className="text-blue-900 font-bold hover:underline">
                {data.personalInfo.email}
              </a>
              {data.personalInfo.phone && <span> • {data.personalInfo.phone}</span>}
            </div>
            <div className="flex flex-wrap sm:justify-end gap-2 text-[10.5px] pt-0.5">
              {data.personalInfo.portfolio && (
                <a href={data.personalInfo.portfolio} target="_blank" rel="noreferrer" className="text-blue-800 hover:underline">
                  Product Portfolio
                </a>
              )}
              {data.personalInfo.linkedin && (
                <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-blue-800 hover:underline">
                  LinkedIn
                </a>
              )}
              {data.personalInfo.github && (
                <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="text-blue-800 hover:underline">
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Product Philosophy & Track Record */}
      {data.summary && (
        <section className="mb-5 bg-blue-50/60 border border-blue-200 p-3.5 rounded-xl">
          <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-950 font-bold mb-1">
            Product Vision & Verified Business Outcomes
          </h2>
          <p className="text-[11.5px] text-slate-800 leading-relaxed font-sans">
            {data.summary}
          </p>
        </section>
      )}

      {/* Product Disciplines & Methodologies */}
      <section className="mb-5 border border-slate-200 rounded-xl p-3.5 bg-slate-50/70">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-mono">
          Product Competencies & Methodologies
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
          {data.skills.languages?.length > 0 && (
            <div>
              <strong className="text-slate-900 block font-mono text-[10.5px]">Technical Vocabulary & Querying:</strong>
              <span className="text-slate-700">{data.skills.languages.join(', ')}</span>
            </div>
          )}
          {data.skills.tools?.length > 0 && (
            <div>
              <strong className="text-slate-900 block font-mono text-[10.5px]">Analytics, Tracking & Roadmapping:</strong>
              <span className="text-slate-700">{data.skills.tools.join(', ')}</span>
            </div>
          )}
          {data.skills.frameworks?.length > 0 && (
            <div>
              <strong className="text-slate-900 block font-mono text-[10.5px]">Product Frameworks & Methodologies:</strong>
              <span className="text-slate-700">{data.skills.frameworks.join(', ')}</span>
            </div>
          )}
          {data.skills.cloudDevOps?.length > 0 && (
            <div>
              <strong className="text-slate-900 block font-mono text-[10.5px]">Delivery Operations & Agile:</strong>
              <span className="text-slate-700">{data.skills.cloudDevOps.join(', ')}</span>
            </div>
          )}
        </div>
      </section>

      {/* Product Management Experience */}
      {data.experience?.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-blue-900 pb-1 mb-3">
            Product Management & Ownership History
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{exp.title}</h3>
                    <p className="text-[11px] text-blue-900 font-medium">{exp.company}{exp.location ? ` — ${exp.location}` : ''}</p>
                  </div>
                  <span className="text-[10.5px] font-mono text-slate-500 shrink-0">
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

      {/* Flagship Product Launches & Projects */}
      {data.projects?.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b-2 border-blue-800 pb-1 mb-3">
            Key Product Launches & Initiatives
          </h2>
          <div className="space-y-3.5">
            {data.projects.map((proj) => (
              <div key={proj.id} className="border-l-2 border-blue-600 pl-3 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-950 text-xs">{proj.name}</strong>
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-[10px] text-blue-800 hover:underline inline-flex items-center gap-0.5">
                        <ExternalLink size={9} /> Case Study
                      </a>
                    )}
                  </div>
                  {proj.techStack?.length > 0 && (
                    <span className="text-[10.5px] font-mono text-slate-500">
                      [{proj.techStack.join(', ')}]
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

      {/* Education & Certifications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {data.education?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Education
            </h2>
            <div className="space-y-1.5 text-[11px]">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <strong className="text-slate-900 block">{edu.degree}</strong>
                  <span className="text-slate-700">{edu.school}</span>
                  <span className="text-slate-500 text-[10px] block font-mono">{edu.startDate} – {edu.endDate}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.certifications?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Certifications
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
