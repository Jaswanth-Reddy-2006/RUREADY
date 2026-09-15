import React from 'react';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, ExternalLink } from 'lucide-react';
import { ResumeData } from '../../../utils/atsEngine';

interface TemplateProps {
  data: ResumeData;
  highlightKeywords?: string[];
}

export default function FaangCompactTemplate({ data, highlightKeywords = [] }: TemplateProps) {
  const isKeyword = (word: string) => {
    if (!highlightKeywords || highlightKeywords.length === 0) return false;
    return highlightKeywords.some((kw) => word.toLowerCase().includes(kw.toLowerCase()));
  };

  return (
    <div className="resume-paper faang-compact bg-white text-[#0f172a] p-7 sm:p-9 shadow-lg rounded-2xl max-w-4xl mx-auto border border-slate-200 font-sans text-[11px] leading-[1.38] print:p-0 print:border-0 print:shadow-none print:max-w-none print:rounded-none">
      
      {/* Compact Top Header */}
      <header className="text-center border-b border-slate-300 pb-3 mb-3.5 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 uppercase">
          {data.personalInfo.fullName}
        </h1>
        <p className="text-[12px] font-semibold text-slate-700 tracking-wide">
          {data.personalInfo.title}
        </p>
        
        {/* Inline One-Line Contact Bar */}
        <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[10.5px] text-slate-600 font-mono">
          <span>{data.personalInfo.location}</span>
          <span>•</span>
          <a href={`mailto:${data.personalInfo.email}`} className="text-slate-800 hover:underline">
            {data.personalInfo.email}
          </a>
          <span>•</span>
          <span>{data.personalInfo.phone}</span>
          {data.personalInfo.github && (
            <>
              <span>•</span>
              <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="text-slate-800 hover:underline">
                {data.personalInfo.github.replace(/^https?:\/\/(?:www\.)?/, '')}
              </a>
            </>
          )}
          {data.personalInfo.linkedin && (
            <>
              <span>•</span>
              <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-slate-800 hover:underline">
                {data.personalInfo.linkedin.replace(/^https?:\/\/(?:www\.)?/, '')}
              </a>
            </>
          )}
          {data.personalInfo.portfolio && (
            <>
              <span>•</span>
              <a href={data.personalInfo.portfolio} target="_blank" rel="noreferrer" className="text-slate-800 hover:underline">
                {data.personalInfo.portfolio.replace(/^https?:\/\/(?:www\.)?/, '')}
              </a>
            </>
          )}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mb-3">
          <p className="text-[11px] text-slate-700 leading-snug">
            {data.summary}
          </p>
        </section>
      )}

      {/* Technical Skills - Dense Inline Grid */}
      <section className="mb-3.5">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
          Technical Skills
        </h2>
        <div className="space-y-1 text-[11px]">
          {data.skills.languages?.length > 0 && (
            <div>
              <strong className="text-slate-900 font-semibold">Languages: </strong>
              <span className="text-slate-700">{data.skills.languages.join(', ')}</span>
            </div>
          )}
          {data.skills.frameworks?.length > 0 && (
            <div>
              <strong className="text-slate-900 font-semibold">Frameworks & Libraries: </strong>
              <span className="text-slate-700">{data.skills.frameworks.join(', ')}</span>
            </div>
          )}
          {data.skills.databases?.length > 0 && (
            <div>
              <strong className="text-slate-900 font-semibold">Databases & Caching: </strong>
              <span className="text-slate-700">{data.skills.databases.join(', ')}</span>
            </div>
          )}
          {data.skills.cloudDevOps?.length > 0 && (
            <div>
              <strong className="text-slate-900 font-semibold">Cloud & Infrastructure: </strong>
              <span className="text-slate-700">{data.skills.cloudDevOps.join(', ')}</span>
            </div>
          )}
          {data.skills.tools?.length > 0 && (
            <div>
              <strong className="text-slate-900 font-semibold">Developer Tools: </strong>
              <span className="text-slate-700">{data.skills.tools.join(', ')}</span>
            </div>
          )}
        </div>
      </section>

      {/* Experience */}
      {data.experience?.length > 0 && (
        <section className="mb-3.5">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
            Professional Experience
          </h2>
          <div className="space-y-2.5">
            {data.experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-0.5">
                  <div>
                    <span className="font-bold text-slate-950 text-[11.5px]">{exp.title}</span>
                    <span className="text-slate-500 mx-1.5">|</span>
                    <span className="font-semibold text-slate-800">{exp.company}</span>
                    {exp.location && <span className="text-slate-500 text-[10px] ml-1">({exp.location})</span>}
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 shrink-0">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-700">
                  {exp.bullets.map((b, idx) => (
                    <li key={idx} className={isKeyword(b) ? 'bg-amber-50 rounded px-1 -mx-1' : ''}>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects?.length > 0 && (
        <section className="mb-3.5">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
            Engineering Projects
          </h2>
          <div className="space-y-2">
            {data.projects.map((proj) => (
              <div key={proj.id} className="space-y-0.5">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-950 text-[11.5px]">{proj.name}</span>
                    {proj.techStack?.length > 0 && (
                      <span className="text-[10px] font-mono text-slate-500">
                        [{proj.techStack.join(', ')}]
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-600 font-mono">
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-0.5 text-blue-700">
                        Demo <ExternalLink size={9} />
                      </a>
                    )}
                    {proj.repoUrl && (
                      <a href={proj.repoUrl} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-0.5 text-blue-700">
                        Code <ExternalLink size={9} />
                      </a>
                    )}
                  </div>
                </div>
                {proj.description && (
                  <p className="text-slate-600 text-[10.5px]">{proj.description}</p>
                )}
                {proj.bullets?.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-700 mt-0.5">
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
        <section className="mb-3">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
            Education
          </h2>
          <div className="space-y-1.5">
            {data.education.map((edu) => (
              <div key={edu.id} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-0.5">
                <div>
                  <span className="font-bold text-slate-950">{edu.degree}</span>
                  <span className="text-slate-500 mx-1.5">|</span>
                  <span className="text-slate-800">{edu.school}</span>
                  {edu.gpa && <span className="text-slate-600 text-[10.5px] ml-1.5 font-mono">GPA: {edu.gpa}</span>}
                </div>
                <span className="text-[10px] font-mono text-slate-600 shrink-0">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {data.certifications?.length > 0 && (
        <section>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1">
            Certifications
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10.5px] text-slate-700">
            {data.certifications.map((cert) => (
              <div key={cert.id} className="flex items-center gap-1">
                <span className="font-semibold text-slate-900">{cert.title}</span>
                <span className="text-slate-500">({cert.issuer}, {cert.date})</span>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
