import React from 'react';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, ExternalLink, Layers, Palette } from 'lucide-react';
import { ResumeData } from '../../../utils/atsEngine';

interface TemplateProps {
  data: ResumeData;
  highlightKeywords?: string[];
}

export default function UxCaseStudyTemplate({ data, highlightKeywords = [] }: TemplateProps) {
  return (
    <div className="resume-paper ux-case-study bg-white text-slate-900 p-8 sm:p-10 shadow-lg rounded-2xl max-w-4xl mx-auto border border-purple-100 font-sans text-xs leading-relaxed print:p-0 print:border-0 print:shadow-none print:max-w-none print:rounded-none">
      
      {/* Visual Design Header */}
      <header className="border-b-2 border-purple-900 pb-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-purple-100 text-purple-900">
                <Palette size={16} />
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 uppercase">
                {data.personalInfo.fullName}
              </h1>
            </div>
            <p className="text-xs sm:text-sm font-bold text-purple-900 uppercase tracking-widest mt-1">
              {data.personalInfo.title}
            </p>
          </div>

          <div className="text-left sm:text-right text-[11px] text-slate-600 space-y-0.5">
            {data.personalInfo.location && <div>{data.personalInfo.location}</div>}
            <div>
              <a href={`mailto:${data.personalInfo.email}`} className="text-purple-950 font-bold hover:underline">
                {data.personalInfo.email}
              </a>
              {data.personalInfo.phone && <span> • {data.personalInfo.phone}</span>}
            </div>
            <div className="flex flex-wrap sm:justify-end gap-2 text-[10.5px] pt-0.5 font-medium">
              {data.personalInfo.portfolio && (
                <a href={data.personalInfo.portfolio} target="_blank" rel="noreferrer" className="text-purple-900 hover:underline">
                  Design Portfolio
                </a>
              )}
              {data.personalInfo.linkedin && (
                <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-purple-900 hover:underline">
                  LinkedIn
                </a>
              )}
              {data.personalInfo.github && (
                <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="text-purple-900 hover:underline">
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Controlled Two-Column Body */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Sidebar: Design Toolkit, Accreditations & Education (4 cols) */}
        <aside className="md:col-span-4 space-y-5 bg-purple-50/50 p-4 rounded-xl border border-purple-100">
          
          {/* Design Toolkit */}
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-950 border-b border-purple-200 pb-1 mb-2 font-mono">
              Design & Prototyping
            </h2>
            <div className="space-y-2 text-[11px]">
              {data.skills.tools?.length > 0 && (
                <div>
                  <strong className="text-slate-900 block text-[10.5px]">UI & Design Systems:</strong>
                  <span className="text-slate-700">{data.skills.tools.join(', ')}</span>
                </div>
              )}
              {data.skills.frameworks?.length > 0 && (
                <div>
                  <strong className="text-slate-900 block text-[10.5px]">Design Frameworks & Web:</strong>
                  <span className="text-slate-700">{data.skills.frameworks.join(', ')}</span>
                </div>
              )}
              {data.skills.languages?.length > 0 && (
                <div>
                  <strong className="text-slate-900 block text-[10.5px]">Design Engineering:</strong>
                  <span className="text-slate-700">{data.skills.languages.join(', ')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Education */}
          {data.education?.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-950 border-b border-purple-200 pb-1 mb-2 font-mono">
                Education
              </h2>
              <div className="space-y-2 text-[11px]">
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <strong className="text-slate-900 block text-[11px]">{edu.degree}</strong>
                    <span className="text-slate-700">{edu.school}</span>
                    <span className="text-slate-500 text-[10px] block font-mono">{edu.startDate} – {edu.endDate}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications & Design Accreditations */}
          {data.certifications?.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-950 border-b border-purple-200 pb-1 mb-2 font-mono">
                Certifications
              </h2>
              <div className="space-y-1.5 text-[11px]">
                {data.certifications.map((c) => (
                  <div key={c.id}>
                    <strong className="text-slate-900 block">{c.title}</strong>
                    <span className="text-slate-600 text-[10px]">{c.issuer}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-950 border-b border-purple-200 pb-1 mb-1 font-mono">
                Languages
              </h2>
              <span className="text-slate-700 text-[11px]">{data.languages.join(' • ')}</span>
            </div>
          )}
        </aside>

        {/* Right Main Column: Philosophy, Case Studies, Experience (8 cols) */}
        <div className="md:col-span-8 space-y-5">
          
          {/* Design Philosophy */}
          {data.summary && (
            <section className="bg-white border-l-2 border-purple-800 pl-3.5 py-0.5">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-950 mb-1 font-mono">
                Design Philosophy & User Research Focus
              </h2>
              <p className="text-[11.5px] text-slate-700 leading-relaxed">
                {data.summary}
              </p>
            </section>
          )}

          {/* Case Studies & Design Projects */}
          {data.projects?.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-purple-950 border-b-2 border-purple-900 pb-1 mb-3">
                Selected Case Studies & Design Systems
              </h2>
              <div className="space-y-3.5">
                {data.projects.map((proj) => (
                  <div key={proj.id} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-950 text-xs">{proj.name}</strong>
                        {proj.liveUrl && (
                          <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-[10px] text-purple-800 hover:underline inline-flex items-center gap-0.5 font-medium">
                            <ExternalLink size={9} /> Case Study
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
                      <p className="text-[11px] text-slate-600 italic">{proj.description}</p>
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

          {/* Product Design Experience */}
          {data.experience?.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-3">
                Product Design & Systems Experience
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <div>
                        <h3 className="text-xs font-bold text-slate-900">{exp.title}</h3>
                        <p className="text-[11px] text-purple-950 font-medium">{exp.company}{exp.location ? ` — ${exp.location}` : ''}</p>
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

          {/* Custom Sections */}
          {data.customSections && data.customSections.length > 0 && (
            <div className="space-y-3 pt-2">
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
      </div>

    </div>
  );
}
