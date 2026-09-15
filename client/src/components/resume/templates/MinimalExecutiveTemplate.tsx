import React from 'react';
import { Mail, Phone, MapPin, Globe, Github, Linkedin } from 'lucide-react';
import { ResumeData } from '../../../utils/atsEngine';

interface TemplateProps {
  data: ResumeData;
  highlightKeywords?: string[];
}

export default function MinimalExecutiveTemplate({ data }: TemplateProps) {
  return (
    <div className="resume-paper minimal-executive bg-white text-[#0f172a] p-8 sm:p-10 shadow-lg rounded-2xl max-w-4xl mx-auto border border-slate-200 font-sans text-xs leading-relaxed print:p-0 print:border-0 print:shadow-none print:max-w-none print:rounded-none">
      
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-800 pb-4 mb-5 gap-3">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            {data.personalInfo.fullName}
          </h1>
          <p className="text-xs font-bold tracking-wider text-slate-600 uppercase mt-0.5">
            {data.personalInfo.title}
          </p>
        </div>

        <div className="text-right text-[10.5px] text-slate-600 space-y-0.5 font-mono">
          <div>{data.personalInfo.location} • {data.personalInfo.phone}</div>
          <div className="text-slate-900 font-semibold">{data.personalInfo.email}</div>
          <div className="flex flex-wrap sm:justify-end gap-2 text-[10px]">
            {data.personalInfo.linkedin && (
              <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:underline text-slate-800">
                LinkedIn
              </a>
            )}
            {data.personalInfo.github && (
              <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="hover:underline text-slate-800">
                GitHub
              </a>
            )}
            {data.personalInfo.portfolio && (
              <a href={data.personalInfo.portfolio} target="_blank" rel="noreferrer" className="hover:underline text-slate-800">
                Portfolio
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mb-5">
          <h2 className="text-[11px] font-black uppercase tracking-wider text-slate-900 mb-1 border-b border-slate-200 pb-0.5">
            Overview
          </h2>
          <p className="text-[11px] text-slate-700 leading-relaxed">
            {data.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      <section className="mb-5">
        <h2 className="text-[11px] font-black uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-0.5">
          Experience
        </h2>

        <div className="space-y-4">
          {data.experience.map((exp) => (
            <div key={exp.id} className="space-y-1">
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-extrabold text-slate-900 text-[12px]">{exp.title}</span>
                  <span className="text-slate-600 font-medium ml-1.5">— {exp.company}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 font-semibold">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>

              <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-slate-700">
                {exp.bullets.map((b, idx) => (
                  <li key={idx}>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Core Competencies Matrix */}
      <section className="mb-5">
        <h2 className="text-[11px] font-black uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-0.5">
          Core Competencies
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-[11px]">
          <div>
            <span className="font-bold text-slate-900">Languages: </span>
            <span className="text-slate-700">{data.skills.languages.join(', ')}</span>
          </div>
          <div>
            <span className="font-bold text-slate-900">Frameworks: </span>
            <span className="text-slate-700">{data.skills.frameworks.join(', ')}</span>
          </div>
          <div>
            <span className="font-bold text-slate-900">Databases: </span>
            <span className="text-slate-700">{data.skills.databases.join(', ')}</span>
          </div>
          <div>
            <span className="font-bold text-slate-900">Cloud & DevOps: </span>
            <span className="text-slate-700">{data.skills.cloudDevOps.join(', ')}</span>
          </div>
          <div>
            <span className="font-bold text-slate-900">Tools: </span>
            <span className="text-slate-700">{data.skills.tools.join(', ')}</span>
          </div>
        </div>
      </section>

      {/* Selected Engineering Projects */}
      {data.projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[11px] font-black uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-0.5">
            Key Projects
          </h2>

          <div className="space-y-2.5">
            {data.projects.map((proj) => (
              <div key={proj.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <div className="font-bold text-slate-900 text-[11.5px]">
                    {proj.name} <span className="text-slate-500 font-normal text-[10.5px]">({proj.techStack.join(', ')})</span>
                  </div>
                  {proj.repoUrl && (
                    <a href={proj.repoUrl} target="_blank" rel="noreferrer" className="text-[10px] text-slate-500 hover:underline">
                      GitHub
                    </a>
                  )}
                </div>
                <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11px] text-slate-700">
                  {proj.bullets.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      <section>
        <h2 className="text-[11px] font-black uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-0.5">
          Education & Credentials
        </h2>

        <div className="space-y-1.5">
          {data.education.map((edu) => (
            <div key={edu.id} className="flex justify-between items-baseline text-[11px]">
              <div>
                <strong className="text-slate-900">{edu.degree}</strong>
                <span className="text-slate-600 ml-1.5">— {edu.school}</span>
                {edu.gpa && <span className="text-slate-500 ml-2 font-mono">(GPA: {edu.gpa})</span>}
              </div>
              <span className="text-[10px] font-mono text-slate-500">{edu.startDate} – {edu.endDate}</span>
            </div>
          ))}

          {data.certifications.map((c) => (
            <div key={c.id} className="flex justify-between items-baseline text-[11px]">
              <div>
                <strong className="text-slate-900">{c.title}</strong>
                <span className="text-slate-600 ml-1.5">— {c.issuer}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">{c.date}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
