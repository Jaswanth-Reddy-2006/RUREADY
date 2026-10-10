import React from 'react';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, ExternalLink } from 'lucide-react';
import { ResumeData } from '../../../utils/atsEngine';

interface TemplateProps {
  data: ResumeData;
  highlightKeywords?: string[];
}

export default function SwissPrecisionTemplate({ data, highlightKeywords = [] }: TemplateProps) {
  const isKeyword = (word: string) => {
    if (!highlightKeywords || highlightKeywords.length === 0) return false;
    return highlightKeywords.some((kw) => word.toLowerCase().includes(kw.toLowerCase()));
  };

  return (
    <div className="resume-paper swiss-precision bg-white text-slate-900 p-8 sm:p-11 shadow-lg rounded-2xl max-w-4xl mx-auto border border-slate-200 font-sans text-xs leading-relaxed print:p-0 print:border-0 print:shadow-none print:max-w-none print:rounded-none">
      
      {/* Swiss Architectural Header */}
      <header className="border-b-2 border-slate-900 pb-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 block">
              Curriculum Vitae
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 uppercase">
              {data.personalInfo.fullName}
            </h1>
            <p className="text-sm font-semibold tracking-wide text-slate-700">
              {data.personalInfo.title}
            </p>
          </div>

          <div className="text-left sm:text-right text-[11px] text-slate-600 space-y-0.5 font-mono">
            {data.personalInfo.location && (
              <div className="flex items-center sm:justify-end gap-1">
                <span>{data.personalInfo.location}</span>
              </div>
            )}
            {data.personalInfo.email && (
              <div>
                <a href={`mailto:${data.personalInfo.email}`} className="text-slate-900 hover:underline">
                  {data.personalInfo.email}
                </a>
              </div>
            )}
            {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
            
            <div className="flex flex-wrap sm:justify-end gap-2 pt-1 text-[10.5px]">
              {data.personalInfo.portfolio && (
                <a href={data.personalInfo.portfolio} target="_blank" rel="noreferrer" className="text-slate-900 hover:underline font-semibold">
                  {data.personalInfo.portfolio.replace(/^https?:\/\//, '')}
                </a>
              )}
              {data.personalInfo.github && (
                <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="text-slate-900 hover:underline">
                  gh/{data.personalInfo.github.replace(/^https?:\/\/(?:www\.)?github\.com\//, '')}
                </a>
              )}
              {data.personalInfo.linkedin && (
                <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-slate-900 hover:underline">
                  in/{data.personalInfo.linkedin.replace(/^https?:\/\/(?:www\.)?linkedin\.com\/in\//, '')}
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Professional Summary */}
      {data.summary && (
        <section className="mb-6 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-start">
          <div className="sm:col-span-3">
            <h2 className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-900">
              Profile
            </h2>
          </div>
          <div className="sm:col-span-9">
            <p className="text-[11.5px] text-slate-700 leading-relaxed">
              {data.summary}
            </p>
          </div>
        </section>
      )}

      {/* Disciplined Skills Grid */}
      <section className="mb-6 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-start">
        <div className="sm:col-span-3">
          <h2 className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-900">
            Competencies
          </h2>
        </div>
        <div className="sm:col-span-9 space-y-2 text-[11px]">
          {data.skills.languages?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-1">
              <span className="font-bold text-slate-900 sm:col-span-1">Languages:</span>
              <span className="text-slate-700 sm:col-span-3">{data.skills.languages.join('  •  ')}</span>
            </div>
          )}
          {data.skills.frameworks?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-1">
              <span className="font-bold text-slate-900 sm:col-span-1">Frameworks:</span>
              <span className="text-slate-700 sm:col-span-3">{data.skills.frameworks.join('  •  ')}</span>
            </div>
          )}
          {data.skills.databases?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-1">
              <span className="font-bold text-slate-900 sm:col-span-1">Databases:</span>
              <span className="text-slate-700 sm:col-span-3">{data.skills.databases.join('  •  ')}</span>
            </div>
          )}
          {data.skills.cloudDevOps?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-1">
              <span className="font-bold text-slate-900 sm:col-span-1">Cloud / Infra:</span>
              <span className="text-slate-700 sm:col-span-3">{data.skills.cloudDevOps.join('  •  ')}</span>
            </div>
          )}
          {data.skills.tools?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-1">
              <span className="font-bold text-slate-900 sm:col-span-1">Tools & Platforms:</span>
              <span className="text-slate-700 sm:col-span-3">{data.skills.tools.join('  •  ')}</span>
            </div>
          )}
        </div>
      </section>

      {/* Experience */}
      {data.experience?.length > 0 && (
        <section className="mb-6 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-start">
          <div className="sm:col-span-3">
            <h2 className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-900">
              Experience
            </h2>
          </div>
          <div className="sm:col-span-9 space-y-5">
            {data.experience.map((exp) => (
              <div key={exp.id} className="space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate-200 pb-1">
                  <div>
                    <h3 className="text-xs font-bold text-slate-950 uppercase tracking-tight">
                      {exp.title}
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-700">
                      {exp.company}{exp.location ? ` — ${exp.location}` : ''}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-medium text-slate-500 shrink-0">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>

                {exp.bullets?.length > 0 && (
                  <ul className="space-y-1 text-[11px] text-slate-700 mt-1 pl-3 border-l-2 border-slate-300">
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

      {/* Projects */}
      {data.projects?.length > 0 && (
        <section className="mb-6 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-start">
          <div className="sm:col-span-3">
            <h2 className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-900">
              Projects
            </h2>
          </div>
          <div className="sm:col-span-9 space-y-4">
            {data.projects.map((proj) => (
              <div key={proj.id} className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate-200 pb-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-950 uppercase">
                      {proj.name}
                    </h3>
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-[10px] font-mono text-slate-600 hover:text-slate-900 inline-flex items-center gap-0.5">
                        <ExternalLink size={9} /> Live
                      </a>
                    )}
                  </div>
                  {proj.techStack?.length > 0 && (
                    <span className="text-[10px] font-mono text-slate-500">
                      {proj.techStack.join(', ')}
                    </span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-[11px] text-slate-600">{proj.description}</p>
                )}
                {proj.bullets?.length > 0 && (
                  <ul className="space-y-0.5 text-[11px] text-slate-700 pl-3 border-l border-slate-300">
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
        <section className="mb-6 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-start">
          <div className="sm:col-span-3">
            <h2 className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-900">
              Education
            </h2>
          </div>
          <div className="sm:col-span-9 space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id} className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate-200 pb-1">
                <div>
                  <h3 className="text-xs font-bold text-slate-950 uppercase">{edu.degree}</h3>
                  <p className="text-[11px] text-slate-700">{edu.school}{edu.location ? ` — ${edu.location}` : ''}</p>
                  {edu.gpa && <span className="text-[10px] font-mono text-slate-600 block">GPA: {edu.gpa}</span>}
                  {edu.highlights && <p className="text-[10.5px] text-slate-600 mt-0.5">{edu.highlights}</p>}
                </div>
                <span className="text-[10px] font-mono text-slate-500 shrink-0">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {data.certifications?.length > 0 && (
        <section className="mb-6 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-start">
          <div className="sm:col-span-3">
            <h2 className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-900">
              Certifications
            </h2>
          </div>
          <div className="sm:col-span-9 space-y-1.5 text-[11px]">
            {data.certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-baseline border-b border-slate-100 pb-0.5">
                <div>
                  <strong className="text-slate-900">{cert.title}</strong>
                  <span className="text-slate-600 ml-1.5">— {cert.issuer}</span>
                </div>
                {cert.date && <span className="text-[10px] font-mono text-slate-500">{cert.date}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Publications & Patents */}
      {((data.publications && data.publications.length > 0) || (data.patents && data.patents.length > 0)) && (
        <section className="mb-6 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-start">
          <div className="sm:col-span-3">
            <h2 className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-900">
              Publications
            </h2>
          </div>
          <div className="sm:col-span-9 space-y-2 text-[11px]">
            {data.publications?.map((pub) => (
              <div key={pub.id} className="flex justify-between items-baseline">
                <div>
                  <strong className="text-slate-900">{pub.title}</strong>
                  {pub.venue && <span className="text-slate-600 ml-1.5">({pub.venue})</span>}
                </div>
                {pub.date && <span className="text-[10px] font-mono text-slate-500">{pub.date}</span>}
              </div>
            ))}
            {data.patents?.map((pat) => (
              <div key={pat.id} className="flex justify-between items-baseline">
                <div>
                  <strong className="text-slate-900">{pat.title}</strong>
                  {pat.number && <span className="text-slate-600 ml-1.5">Patent: {pat.number}</span>}
                </div>
                {pat.date && <span className="text-[10px] font-mono text-slate-500">{pat.date}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements / Honors */}
      {data.achievements && data.achievements.length > 0 && (
        <section className="mb-6 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-start">
          <div className="sm:col-span-3">
            <h2 className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-900">
              Honors
            </h2>
          </div>
          <div className="sm:col-span-9">
            <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-slate-700">
              {data.achievements.map((ach, idx) => (
                <li key={idx}>{ach}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Languages & Custom */}
      {(Boolean(data.languages?.length) || Boolean(data.customSections?.length)) && (
        <section className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6 items-start">
          <div className="sm:col-span-3">
            <h2 className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-900">
              Additional
            </h2>
          </div>
          <div className="sm:col-span-9 space-y-3 text-[11px]">
            {data.languages && data.languages.length > 0 && (
              <div>
                <strong className="text-slate-900 mr-2">Languages:</strong>
                <span className="text-slate-700">{data.languages.join('  •  ')}</span>
              </div>
            )}
            {data.customSections?.map((sec) => (
              <div key={sec.id}>
                <strong className="text-slate-900 block mb-1">{sec.title}</strong>
                <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-700">
                  {sec.items.map((it, idx) => (
                    <li key={idx}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
