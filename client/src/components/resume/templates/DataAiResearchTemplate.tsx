import React from 'react';
import { ExternalLink } from 'lucide-react';
import { ResumeData } from '../../../utils/atsEngine';

interface TemplateProps {
  data: ResumeData;
  highlightKeywords?: string[];
}

export default function DataAiResearchTemplate({ data, highlightKeywords = [] }: TemplateProps) {
  return (
    <div className="resume-paper data-ai-research bg-white text-slate-900 p-8 sm:p-10 shadow-lg rounded-2xl max-w-4xl mx-auto border border-slate-200 font-sans text-xs leading-relaxed print:p-0 print:border-0 print:shadow-none print:max-w-none print:rounded-none">
      
      {/* Header */}
      <header className="border-b border-slate-900 pb-4 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 uppercase font-sans">
              {data.personalInfo.fullName}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-700 uppercase tracking-wider mt-1 font-sans">
              {data.personalInfo.title}
            </p>
          </div>

          <div className="text-left sm:text-right text-[11px] text-slate-600 space-y-0.5 font-sans">
            {data.personalInfo.location && <div>{data.personalInfo.location}</div>}
            <div>
              <a href={`mailto:${data.personalInfo.email}`} className="text-slate-900 font-semibold hover:underline">
                {data.personalInfo.email}
              </a>
              {data.personalInfo.phone && <span> • {data.personalInfo.phone}</span>}
            </div>
            <div className="flex flex-wrap sm:justify-end gap-2 text-[10.5px] pt-0.5">
              {data.personalInfo.portfolio && (
                <a href={data.personalInfo.portfolio} target="_blank" rel="noreferrer" className="text-slate-700 hover:text-slate-950 hover:underline">
                  Portfolio
                </a>
              )}
              {data.personalInfo.github && (
                <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="text-slate-700 hover:text-slate-950 hover:underline">
                  GitHub
                </a>
              )}
              {data.personalInfo.linkedin && (
                <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-slate-700 hover:text-slate-950 hover:underline">
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Summary / Research Statement */}
      {data.summary && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-1 mb-2.5 font-sans">
            Research Statement & Focus
          </h2>
          <p className="text-[11.5px] text-slate-700 leading-relaxed font-sans">
            {data.summary}
          </p>
        </section>
      )}

      {/* Peer-Reviewed Publications & Proceedings */}
      {data.publications && data.publications.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-1 mb-2.5 font-sans">
            Peer-Reviewed Publications & Proceedings
          </h2>
          <div className="space-y-2 text-[11.5px]">
            {data.publications.map((pub) => (
              <div key={pub.id} className="border-l-2 border-slate-300 pl-3">
                <div className="font-semibold text-slate-900 font-sans">
                  "{pub.title}"
                  {pub.url && (
                    <a href={pub.url} target="_blank" rel="noreferrer" className="text-slate-700 hover:text-slate-950 hover:underline ml-2 text-[10px] inline-flex items-center gap-0.5">
                      <ExternalLink size={9} /> DOI / Paper
                    </a>
                  )}
                </div>
                <div className="text-[11px] text-slate-600 font-sans">
                  {pub.venue && <span className="italic">{pub.venue}</span>}
                  {pub.date && <span className="ml-2 font-mono text-[10px]">[{pub.date}]</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Technical Skills */}
      <section className="mb-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-1 mb-2.5 font-sans">
          Machine Learning, Architectures & Data Tooling
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] bg-slate-50 border border-slate-200 p-3.5 rounded-lg">
          {data.skills.languages?.length > 0 && (
            <div>
              <strong className="text-slate-900 block font-semibold text-[10.5px]">Languages:</strong>
              <span className="text-slate-700">{data.skills.languages.join(', ')}</span>
            </div>
          )}
          {data.skills.frameworks?.length > 0 && (
            <div>
              <strong className="text-slate-900 block font-semibold text-[10.5px]">Deep Learning & ML Frameworks:</strong>
              <span className="text-slate-700">{data.skills.frameworks.join(', ')}</span>
            </div>
          )}
          {data.skills.databases?.length > 0 && (
            <div>
              <strong className="text-slate-900 block font-semibold text-[10.5px]">Vector DBs & Feature Stores:</strong>
              <span className="text-slate-700">{data.skills.databases.join(', ')}</span>
            </div>
          )}
          {data.skills.cloudDevOps?.length > 0 && (
            <div>
              <strong className="text-slate-900 block font-semibold text-[10.5px]">GPU Clusters & Distributed Training:</strong>
              <span className="text-slate-700">{data.skills.cloudDevOps.join(', ')}</span>
            </div>
          )}
          {data.skills.tools?.length > 0 && (
            <div>
              <strong className="text-slate-900 block font-semibold text-[10.5px]">Developer Tooling & Libraries:</strong>
              <span className="text-slate-700">{data.skills.tools.join(', ')}</span>
            </div>
          )}
        </div>
      </section>

      {/* Professional & Research Experience */}
      {data.experience?.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-1 mb-2.5 font-sans">
            Research Appointments & Professional Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 font-sans">{exp.title}</h3>
                    <p className="text-[11px] text-slate-700 font-medium font-sans">{exp.company}{exp.location ? ` | ${exp.location}` : ''}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>

                {exp.bullets?.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-slate-700 leading-relaxed">
                    {exp.bullets.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experimental Models & Projects */}
      {data.projects?.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-1 mb-2.5 font-sans">
            Experimental Models & Applied Projects
          </h2>
          <div className="space-y-3">
            {data.projects.map((proj) => (
              <div key={proj.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 text-xs font-semibold">{proj.name}</strong>
                    {proj.repoUrl && (
                      <a href={proj.repoUrl} target="_blank" rel="noreferrer" className="text-[10px] text-slate-700 hover:text-slate-950 hover:underline inline-flex items-center gap-0.5">
                        <ExternalLink size={9} /> Artifact
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
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11px] text-slate-700 leading-relaxed">
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

      {/* Education */}
      {data.education?.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-1 mb-2.5 font-sans">
            Education
          </h2>
          <div className="space-y-2 text-[11px]">
            {data.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <strong className="text-slate-900 font-semibold">{edu.degree}</strong>
                  <span className="text-slate-700"> — {edu.school}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 shrink-0">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Accreditations */}
      {(Boolean(data.patents?.length) || Boolean(data.certifications?.length)) && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-1 mb-2.5 font-sans">
            Certifications & Accreditations
          </h2>
          <div className="flex flex-wrap gap-2 text-[11px]">
            {data.patents?.map((pat) => (
              <span key={pat.id} className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded border border-slate-200 font-sans text-[10.5px] font-medium">
                Patent: {pat.title} {pat.number ? <span className="text-slate-500">(#{pat.number})</span> : null}
              </span>
            ))}
            {data.certifications?.map((c) => (
              <span key={c.id} className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded border border-slate-200 font-sans text-[10.5px] font-medium">
                {c.title} <span className="text-slate-500">({c.issuer})</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Custom Sections */}
      {data.customSections && data.customSections.length > 0 && (
        <div className="space-y-4">
          {data.customSections.map((sec) => (
            <section key={sec.id} className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-900 pb-1 mb-2.5 font-sans">
                {sec.title}
              </h2>
              <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11px] text-slate-700 leading-relaxed">
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
