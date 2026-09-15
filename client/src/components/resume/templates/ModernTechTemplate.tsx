import React from 'react';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, ExternalLink } from 'lucide-react';
import { ResumeData } from '../../../utils/atsEngine';

interface TemplateProps {
  data: ResumeData;
  highlightKeywords?: string[];
}

export default function ModernTechTemplate({ data, highlightKeywords = [] }: TemplateProps) {
  const isKeyword = (word: string) => {
    if (!highlightKeywords || highlightKeywords.length === 0) return false;
    return highlightKeywords.some(kw => word.toLowerCase().includes(kw.toLowerCase()));
  };

  return (
    <div className="resume-paper modern-tech bg-white text-[#11183D] p-8 sm:p-10 shadow-lg rounded-2xl max-w-4xl mx-auto border border-[#DCE7F2] font-sans text-xs leading-relaxed print:p-0 print:border-0 print:shadow-none print:max-w-none print:rounded-none">
      
      {/* Header */}
      <header className="border-b-2 border-[#2459A8] pb-5 mb-5 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#11183D] uppercase">
              {data.personalInfo.fullName}
            </h1>
            <p className="text-sm font-bold text-[#2459A8] mt-0.5">
              {data.personalInfo.title}
            </p>
          </div>
          <div className="text-right text-[11px] text-[#526078] flex flex-wrap sm:flex-col gap-1 sm:gap-0.5">
            <span className="flex items-center sm:justify-end gap-1">
              <MapPin size={11} className="text-[#2459A8]" /> {data.personalInfo.location}
            </span>
            <span className="flex items-center sm:justify-end gap-1">
              <Mail size={11} className="text-[#2459A8]" /> {data.personalInfo.email}
            </span>
            <span className="flex items-center sm:justify-end gap-1">
              <Phone size={11} className="text-[#2459A8]" /> {data.personalInfo.phone}
            </span>
          </div>
        </div>

        {/* Links Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] font-medium text-[#526078]">
          {data.personalInfo.portfolio && (
            <a href={data.personalInfo.portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#2459A8] hover:underline">
              <Globe size={11} /> {data.personalInfo.portfolio.replace(/^https?:\/\//, '')}
            </a>
          )}
          {data.personalInfo.github && (
            <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#2459A8] hover:underline">
              <Github size={11} /> {data.personalInfo.github.replace(/^https?:\/\//, '')}
            </a>
          )}
          {data.personalInfo.linkedin && (
            <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#2459A8] hover:underline">
              <Linkedin size={11} /> {data.personalInfo.linkedin.replace(/^https?:\/\//, '')}
            </a>
          )}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mb-5">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#2459A8] mb-1.5 flex items-center gap-2">
            <span>Executive Summary</span>
            <div className="h-[1px] bg-[#DCE7F2] flex-1" />
          </h2>
          <p className="text-[11.5px] text-[#334155] leading-relaxed">
            {data.summary}
          </p>
        </section>
      )}

      {/* Technical Skills Badges */}
      <section className="mb-5">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#2459A8] mb-2 flex items-center gap-2">
          <span>Technical Competencies</span>
          <div className="h-[1px] bg-[#DCE7F2] flex-1" />
        </h2>
        
        <div className="space-y-1.5 text-[11px]">
          {data.skills.languages.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <strong className="text-[#11183D] w-24 shrink-0">Languages:</strong>
              <div className="flex flex-wrap gap-1">
                {data.skills.languages.map((s, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-0.5 rounded text-[10.5px] font-mono ${
                      isKeyword(s)
                        ? 'bg-[#E8F5F0] text-[#168A62] font-bold border border-[#168A62]/30'
                        : 'bg-[#EFFAFD] text-[#2459A8] border border-[#DCE7F2]'
                    }`}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.skills.frameworks.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <strong className="text-[#11183D] w-24 shrink-0">Frameworks:</strong>
              <div className="flex flex-wrap gap-1">
                {data.skills.frameworks.map((s, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-0.5 rounded text-[10.5px] font-mono ${
                      isKeyword(s)
                        ? 'bg-[#E8F5F0] text-[#168A62] font-bold border border-[#168A62]/30'
                        : 'bg-[#EFFAFD] text-[#2459A8] border border-[#DCE7F2]'
                    }`}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.skills.databases.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <strong className="text-[#11183D] w-24 shrink-0">Databases:</strong>
              <div className="flex flex-wrap gap-1">
                {data.skills.databases.map((s, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-0.5 rounded text-[10.5px] font-mono ${
                      isKeyword(s)
                        ? 'bg-[#E8F5F0] text-[#168A62] font-bold border border-[#168A62]/30'
                        : 'bg-[#EFFAFD] text-[#2459A8] border border-[#DCE7F2]'
                    }`}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.skills.cloudDevOps.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <strong className="text-[#11183D] w-24 shrink-0">Cloud & DevOps:</strong>
              <div className="flex flex-wrap gap-1">
                {data.skills.cloudDevOps.map((s, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-0.5 rounded text-[10.5px] font-mono ${
                      isKeyword(s)
                        ? 'bg-[#E8F5F0] text-[#168A62] font-bold border border-[#168A62]/30'
                        : 'bg-[#EFFAFD] text-[#2459A8] border border-[#DCE7F2]'
                    }`}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.skills.tools.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <strong className="text-[#11183D] w-24 shrink-0">Tools & Arch:</strong>
              <div className="flex flex-wrap gap-1">
                {data.skills.tools.map((s, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-0.5 rounded text-[10.5px] font-mono ${
                      isKeyword(s)
                        ? 'bg-[#E8F5F0] text-[#168A62] font-bold border border-[#168A62]/30'
                        : 'bg-gray-100 text-[#526078] border border-gray-200'
                    }`}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Experience */}
      <section className="mb-5">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#2459A8] mb-3 flex items-center gap-2">
          <span>Professional Experience</span>
          <div className="h-[1px] bg-[#DCE7F2] flex-1" />
        </h2>

        <div className="space-y-4">
          {data.experience.map((exp) => (
            <div key={exp.id} className="space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <h3 className="text-[12.5px] font-extrabold text-[#11183D]">
                    {exp.title}
                  </h3>
                  <span className="text-[11.5px] font-bold text-[#2459A8]">
                    {exp.company}
                  </span>
                  <span className="text-[11px] text-[#526078] ml-2">
                    • {exp.location}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#526078]">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>

              <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-[#334155] leading-relaxed">
                {exp.bullets.map((bullet, bIdx) => (
                  <li key={bIdx}>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      {data.projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#2459A8] mb-3 flex items-center gap-2">
            <span>Engineering Projects</span>
            <div className="h-[1px] bg-[#DCE7F2] flex-1" />
          </h2>

          <div className="space-y-3">
            {data.projects.map((proj) => (
              <div key={proj.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[12px] font-bold text-[#11183D]">
                      {proj.name}
                    </h3>
                    {proj.repoUrl && (
                      <a href={proj.repoUrl} target="_blank" rel="noreferrer" className="text-[10px] text-[#2459A8] hover:underline flex items-center gap-0.5">
                        <ExternalLink size={10} /> Link
                      </a>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {proj.techStack.map((tech, tIdx) => (
                      <span key={tIdx} className="text-[9.5px] font-mono bg-gray-100 text-[#526078] px-1.5 py-0.5 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-[#334155]">
                  {proj.bullets.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Certifications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Education */}
        <section>
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#2459A8] mb-2 flex items-center gap-2">
            <span>Education</span>
            <div className="h-[1px] bg-[#DCE7F2] flex-1" />
          </h2>

          <div className="space-y-2">
            {data.education.map((edu) => (
              <div key={edu.id} className="text-[11px]">
                <div className="font-bold text-[#11183D]">{edu.degree}</div>
                <div className="text-[#2459A8] font-medium">{edu.school}</div>
                <div className="text-[10.5px] text-[#526078] flex justify-between">
                  <span>{edu.location}</span>
                  <span>{edu.startDate} – {edu.endDate}</span>
                </div>
                {edu.gpa && <div className="text-[10px] font-mono text-[#168A62]">GPA: {edu.gpa}</div>}
              </div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <section>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#2459A8] mb-2 flex items-center gap-2">
              <span>Certifications</span>
              <div className="h-[1px] bg-[#DCE7F2] flex-1" />
            </h2>

            <div className="space-y-1.5">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="text-[11px]">
                  <div className="font-bold text-[#11183D]">{cert.title}</div>
                  <div className="text-[10.5px] text-[#526078] flex justify-between">
                    <span>{cert.issuer}</span>
                    <span>{cert.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

    </div>
  );
}
