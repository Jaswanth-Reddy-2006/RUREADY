import React from 'react';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, ExternalLink } from 'lucide-react';
import { ResumeData } from '../../../utils/atsEngine';

interface TemplateProps {
  data: ResumeData;
  highlightKeywords?: string[];
}

export default function PrincipalEngineerTemplate({ data, highlightKeywords = [] }: TemplateProps) {
  return (
    <div className="resume-paper principal-engineer bg-white text-slate-900 p-8 sm:p-10 shadow-xl rounded-2xl max-w-4xl mx-auto border border-slate-300 font-sans text-xs leading-relaxed print:p-0 print:border-0 print:shadow-none print:max-w-none print:rounded-none">
      
      {/* High-Impact Header */}
      <header className="border-b-2 border-blue-900 pb-4 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 uppercase">
              {data.personalInfo.fullName}
            </h1>
            <p className="text-xs sm:text-sm font-bold text-blue-900 uppercase tracking-wider mt-0.5">
              {data.personalInfo.title}
            </p>
          </div>

          <div className="text-left sm:text-right text-[11px] text-slate-600 space-y-0.5 font-mono">
            {data.personalInfo.location && <div>{data.personalInfo.location}</div>}
            <div>
              <a href={`mailto:${data.personalInfo.email}`} className="text-slate-900 font-semibold hover:underline">
                {data.personalInfo.email}
              </a>
              {data.personalInfo.phone && <span> • {data.personalInfo.phone}</span>}
            </div>
            <div className="flex flex-wrap sm:justify-end gap-2 text-[10.5px]">
              {data.personalInfo.github && (
                <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="text-blue-900 hover:underline">
                  GitHub
                </a>
              )}
              {data.personalInfo.linkedin && (
                <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-blue-900 hover:underline">
                  LinkedIn
                </a>
              )}
              {data.personalInfo.portfolio && (
                <a href={data.personalInfo.portfolio} target="_blank" rel="noreferrer" className="text-blue-900 hover:underline">
                  Systems Portfolio
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Systems Architecture Philosophy */}
      {data.summary && (
        <section className="mb-5 bg-slate-900 text-slate-100 p-4 rounded-xl">
          <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-300 mb-1">
            Technical Leadership & Architectural Scope
          </h2>
          <p className="text-[11.5px] text-slate-200 leading-relaxed font-sans">
            {data.summary}
          </p>
        </section>
      )}

      {/* Distributed Systems & Tech Competencies */}
      <section className="mb-5 border-b border-slate-200 pb-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 mb-2 border-b-2 border-slate-900 pb-0.5">
          Core Systems & Architecture Competencies
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-[11px]">
          {data.skills.languages?.length > 0 && (
            <div>
              <strong className="text-slate-900 font-mono text-[10.5px]">Core Languages: </strong>
              <span className="text-slate-700">{data.skills.languages.join(', ')}</span>
            </div>
          )}
          {data.skills.frameworks?.length > 0 && (
            <div>
              <strong className="text-slate-900 font-mono text-[10.5px]">Frameworks & Runtimes: </strong>
              <span className="text-slate-700">{data.skills.frameworks.join(', ')}</span>
            </div>
          )}
          {data.skills.databases?.length > 0 && (
            <div>
              <strong className="text-slate-900 font-mono text-[10.5px]">Distributed Storage & Caching: </strong>
              <span className="text-slate-700">{data.skills.databases.join(', ')}</span>
            </div>
          )}
          {data.skills.cloudDevOps?.length > 0 && (
            <div>
              <strong className="text-slate-900 font-mono text-[10.5px]">Cloud Infrastructure & Mesh: </strong>
              <span className="text-slate-700">{data.skills.cloudDevOps.join(', ')}</span>
            </div>
          )}
          {data.skills.tools?.length > 0 && (
            <div className="sm:col-span-2">
              <strong className="text-slate-900 font-mono text-[10.5px]">Observability & Telemetry: </strong>
              <span className="text-slate-700">{data.skills.tools.join(', ')}</span>
            </div>
          )}
        </div>
      </section>

      {/* Engineering Leadership & Architectural Experience */}
      {data.experience?.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 mb-3 border-b-2 border-slate-900 pb-0.5">
            Architectural Leadership & Engineering History
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id} className="space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate-200 pb-1">
                  <div>
                    <h3 className="text-xs font-bold text-slate-950 uppercase tracking-tight text-[12px]">
                      {exp.title}
                    </h3>
                    <span className="text-[11px] font-semibold text-blue-950">
                      {exp.company}{exp.location ? ` | ${exp.location}` : ''}
                    </span>
                  </div>
                  <span className="text-[10.5px] font-mono text-slate-500 shrink-0">
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

      {/* Flagship Systems & Production Platforms */}
      {data.projects?.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 mb-3 border-b-2 border-slate-900 pb-0.5">
            Key Systems Architecture & Production Deliveries
          </h2>
          <div className="space-y-3">
            {data.projects.map((proj) => (
              <div key={proj.id} className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                <div className="flex justify-between items-baseline">
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-950 text-xs">{proj.name}</strong>
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-[10px] text-blue-800 hover:underline inline-flex items-center gap-0.5">
                        <ExternalLink size={9} /> Architecture Link
                      </a>
                    )}
                  </div>
                  {proj.techStack?.length > 0 && (
                    <span className="text-[10px] font-mono text-slate-600">
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

      {/* Education & Patents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {data.education?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 mb-2 border-b-2 border-slate-900 pb-0.5">
              Education
            </h2>
            <div className="space-y-2 text-[11px]">
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

        {(Boolean(data.patents?.length) || Boolean(data.certifications?.length)) && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 mb-2 border-b-2 border-slate-900 pb-0.5">
              Patents & Certifications
            </h2>
            <div className="space-y-1.5 text-[11px]">
              {data.patents?.map((pat) => (
                <div key={pat.id}>
                  <strong className="text-slate-900">Patent: {pat.title}</strong>
                  {pat.number && <span className="text-slate-600 block text-[10.5px]">#{pat.number}</span>}
                </div>
              ))}
              {data.certifications?.map((c) => (
                <div key={c.id}>
                  <strong className="text-slate-900">{c.title}</strong>
                  <span className="text-slate-600 text-[10.5px] block">{c.issuer}</span>
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
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 mb-1.5 border-b-2 border-slate-900 pb-0.5">
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
