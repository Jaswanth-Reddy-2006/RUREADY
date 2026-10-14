import React from 'react';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, ExternalLink } from 'lucide-react';
import { ResumeData } from '../../../utils/atsEngine';

interface TemplateProps {
  data: ResumeData;
  highlightKeywords?: string[];
}

export default function GraduateLaunchTemplate({ data, highlightKeywords = [] }: TemplateProps) {
  return (
    <div className="resume-paper graduate-launch bg-white text-slate-900 p-8 sm:p-10 shadow-lg rounded-2xl max-w-4xl mx-auto border border-sky-100 font-sans text-xs leading-relaxed print:p-0 print:border-0 print:shadow-none print:max-w-none print:rounded-none">
      
      {/* Friendly, Professional Header */}
      <header className="border-b-2 border-sky-700 pb-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 uppercase">
              {data.personalInfo.fullName}
            </h1>
            <p className="text-xs font-bold text-sky-700 uppercase tracking-wider mt-0.5">
              {data.personalInfo.title}
            </p>
          </div>

          <div className="text-left sm:text-right text-[11px] text-slate-600 space-y-0.5">
            {data.personalInfo.location && <div>{data.personalInfo.location}</div>}
            <div>
              {data.personalInfo.email && (
                <a href={`mailto:${data.personalInfo.email}`} className="text-sky-800 font-medium hover:underline">
                  {data.personalInfo.email}
                </a>
              )}
              {data.personalInfo.phone && <span className="ml-1.5">• {data.personalInfo.phone}</span>}
            </div>
            <div className="flex flex-wrap sm:justify-end gap-2 text-[10.5px] pt-0.5">
              {data.personalInfo.github && (
                <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="text-sky-700 hover:underline">
                  GitHub
                </a>
              )}
              {data.personalInfo.linkedin && (
                <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-sky-700 hover:underline">
                  LinkedIn
                </a>
              )}
              {data.personalInfo.portfolio && (
                <a href={data.personalInfo.portfolio} target="_blank" rel="noreferrer" className="text-sky-700 hover:underline">
                  Portfolio
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Summary / Ambition Statement */}
      {data.summary && (
        <section className="mb-4">
          <p className="text-[11.5px] text-slate-700 leading-relaxed bg-sky-50/50 p-2.5 rounded-lg border border-sky-100">
            {data.summary}
          </p>
        </section>
      )}

      {/* Education First (Top Section) */}
      {data.education?.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-sky-900 border-b border-sky-200 pb-0.5 mb-2 flex items-center justify-between">
            <span>Education & Academic Distinctions</span>
          </h2>
          <div className="space-y-2.5">
            {data.education.map((edu) => (
              <div key={edu.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span className="text-[12px]">{edu.school}</span>
                  <span className="text-[10.5px] font-normal text-slate-500">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="flex justify-between items-baseline text-slate-800">
                  <span className="font-semibold text-sky-800">{edu.degree}{edu.location ? ` — ${edu.location}` : ''}</span>
                  {edu.gpa && <span className="text-[10.5px] font-mono text-slate-700">GPA: {edu.gpa}</span>}
                </div>
                {edu.coursework && (
                  <p className="text-[10.5px] text-slate-600">
                    <strong>Coursework:</strong> {edu.coursework}
                  </p>
                )}
                {edu.highlights && (
                  <p className="text-[10.5px] text-slate-600">
                    <strong>Academic Honors:</strong> {edu.highlights}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Technical Skills Matrix */}
      <section className="mb-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-sky-900 border-b border-sky-200 pb-0.5 mb-2">
          Technical Competencies
        </h2>
        <div className="space-y-1 text-[11px]">
          {data.skills.languages?.length > 0 && (
            <div>
              <strong className="text-slate-900">Languages: </strong>
              <span className="text-slate-700">{data.skills.languages.join(', ')}</span>
            </div>
          )}
          {data.skills.frameworks?.length > 0 && (
            <div>
              <strong className="text-slate-900">Frameworks & Libraries: </strong>
              <span className="text-slate-700">{data.skills.frameworks.join(', ')}</span>
            </div>
          )}
          {data.skills.databases?.length > 0 && (
            <div>
              <strong className="text-slate-900">Databases: </strong>
              <span className="text-slate-700">{data.skills.databases.join(', ')}</span>
            </div>
          )}
          {data.skills.tools?.length > 0 && (
            <div>
              <strong className="text-slate-900">Developer Tools: </strong>
              <span className="text-slate-700">{data.skills.tools.join(', ')}</span>
            </div>
          )}
        </div>
      </section>

      {/* Capstone & Academic Projects */}
      {data.projects?.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-sky-900 border-b border-sky-200 pb-0.5 mb-2.5">
            Technical & Capstone Projects
          </h2>
          <div className="space-y-3">
            {data.projects.map((proj) => (
              <div key={proj.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 text-[11.5px]">{proj.name}</strong>
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-[10px] text-sky-700 hover:underline inline-flex items-center gap-0.5">
                        <ExternalLink size={9} /> Demo
                      </a>
                    )}
                  </div>
                  {proj.techStack?.length > 0 && (
                    <span className="text-[10px] text-slate-500 font-mono">
                      {proj.techStack.join(', ')}
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

      {/* Internships & Professional Experience */}
      {data.experience?.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-sky-900 border-b border-sky-200 pb-0.5 mb-2.5">
            Internships & Work Experience
          </h2>
          <div className="space-y-3">
            {data.experience.map((exp) => (
              <div key={exp.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{exp.title}</h3>
                    <p className="text-[11px] text-slate-700 font-medium">{exp.company}{exp.location ? ` — ${exp.location}` : ''}</p>
                  </div>
                  <span className="text-[10.5px] text-slate-500 shrink-0 font-medium">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>

                {exp.bullets?.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11px] text-slate-700">
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

      {/* Certifications & Leadership */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        {data.certifications?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-900 border-b border-sky-200 pb-0.5 mb-1.5">
              Certifications
            </h2>
            <div className="space-y-1 text-[11px]">
              {data.certifications.map((c) => (
                <div key={c.id}>
                  <strong className="text-slate-900">{c.title}</strong>
                  <span className="text-slate-600 block text-[10.5px]">{c.issuer} {c.date ? `(${c.date})` : ''}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {(Boolean(data.achievements?.length) || Boolean(data.languages?.length)) && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-900 border-b border-sky-200 pb-0.5 mb-1.5">
              Leadership & Honors
            </h2>
            <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11px] text-slate-700">
              {data.achievements?.map((ach, idx) => (
                <li key={idx}>{ach}</li>
              ))}
              {data.languages && data.languages.length > 0 && (
                <li>Languages: {data.languages.join(', ')}</li>
              )}
            </ul>
          </section>
        )}
      </div>

      {/* Custom Sections */}
      {data.customSections && data.customSections.length > 0 && (
        <div className="space-y-2">
          {data.customSections.map((sec) => (
            <section key={sec.id}>
              <h2 className="text-xs font-bold uppercase tracking-wider text-sky-900 border-b border-sky-200 pb-0.5 mb-1">
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
