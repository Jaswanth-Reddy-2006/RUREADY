import React from 'react';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Award, Briefcase, Code, GraduationCap } from 'lucide-react';
import { ResumeData } from '../../../utils/atsEngine';

interface TemplateProps {
  data: ResumeData;
  highlightKeywords?: string[];
}

export default function CreativeFullstackTemplate({ data, highlightKeywords = [] }: TemplateProps) {
  const isKeyword = (word: string) => {
    if (!highlightKeywords || highlightKeywords.length === 0) return false;
    return highlightKeywords.some(kw => word.toLowerCase().includes(kw.toLowerCase()));
  };

  return (
    <div className="resume-paper creative-fullstack bg-white text-[#11183D] shadow-xl rounded-2xl max-w-4xl mx-auto border border-[#DCE7F2] overflow-hidden font-sans text-xs print:shadow-none print:border-0 print:max-w-none print:rounded-none">
      
      {/* 2-Column Split Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[1050px]">
        
        {/* LEFT SIDEBAR (4 cols) */}
        <aside className="md:col-span-4 bg-[#EFFAFD] p-6 sm:p-7 border-r border-[#DCE7F2] space-y-6">
          
          {/* Candidate Initials Avatar & Title */}
          <div className="space-y-1">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#2459A8] to-[#A0006D] text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
              {data.personalInfo.fullName.charAt(0)}
            </div>
            <h2 className="text-base font-extrabold text-[#11183D] pt-2">
              {data.personalInfo.fullName}
            </h2>
            <p className="text-[11px] font-bold text-[#A0006D]">
              {data.personalInfo.title}
            </p>
          </div>

          {/* Contact Details */}
          <div className="space-y-2 text-[11px] text-[#526078] border-t border-[#DCE7F2] pt-4">
            <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-[#11183D]">
              Contact Info
            </h3>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin size={12} className="text-[#2459A8] shrink-0" />
                <span className="truncate">{data.personalInfo.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={12} className="text-[#2459A8] shrink-0" />
                <a href={`mailto:${data.personalInfo.email}`} className="truncate hover:text-[#2459A8]">
                  {data.personalInfo.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={12} className="text-[#2459A8] shrink-0" />
                <span>{data.personalInfo.phone}</span>
              </div>
              {data.personalInfo.portfolio && (
                <div className="flex items-center gap-2">
                  <Globe size={12} className="text-[#2459A8] shrink-0" />
                  <a href={data.personalInfo.portfolio} target="_blank" rel="noreferrer" className="truncate hover:text-[#2459A8]">
                    {data.personalInfo.portfolio.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              {data.personalInfo.github && (
                <div className="flex items-center gap-2">
                  <Github size={12} className="text-[#2459A8] shrink-0" />
                  <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="truncate hover:text-[#2459A8]">
                    {data.personalInfo.github.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              {data.personalInfo.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin size={12} className="text-[#2459A8] shrink-0" />
                  <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="truncate hover:text-[#2459A8]">
                    {data.personalInfo.linkedin.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="space-y-3 border-t border-[#DCE7F2] pt-4">
            <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-[#11183D] flex items-center gap-1.5">
              <Code size={12} className="text-[#A0006D]" />
              <span>Skills Matrix</span>
            </h3>

            <div className="space-y-2 text-[10.5px]">
              <div>
                <strong className="block text-[#11183D] text-[10px] uppercase font-bold mb-1">Languages</strong>
                <div className="flex flex-wrap gap-1">
                  {data.skills.languages.map((s, i) => (
                    <span
                      key={i}
                      className={`px-1.5 py-0.5 rounded text-[10px] ${
                        isKeyword(s)
                          ? 'bg-[#E8F5F0] text-[#168A62] font-bold'
                          : 'bg-white text-[#2459A8] border border-[#DCE7F2]'
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <strong className="block text-[#11183D] text-[10px] uppercase font-bold mb-1">Frameworks</strong>
                <div className="flex flex-wrap gap-1">
                  {data.skills.frameworks.map((s, i) => (
                    <span
                      key={i}
                      className={`px-1.5 py-0.5 rounded text-[10px] ${
                        isKeyword(s)
                          ? 'bg-[#E8F5F0] text-[#168A62] font-bold'
                          : 'bg-white text-[#2459A8] border border-[#DCE7F2]'
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <strong className="block text-[#11183D] text-[10px] uppercase font-bold mb-1">Databases</strong>
                <div className="flex flex-wrap gap-1">
                  {data.skills.databases.map((s, i) => (
                    <span
                      key={i}
                      className={`px-1.5 py-0.5 rounded text-[10px] ${
                        isKeyword(s)
                          ? 'bg-[#E8F5F0] text-[#168A62] font-bold'
                          : 'bg-white text-[#2459A8] border border-[#DCE7F2]'
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <strong className="block text-[#11183D] text-[10px] uppercase font-bold mb-1">DevOps & Cloud</strong>
                <div className="flex flex-wrap gap-1">
                  {data.skills.cloudDevOps.map((s, i) => (
                    <span
                      key={i}
                      className={`px-1.5 py-0.5 rounded text-[10px] ${
                        isKeyword(s)
                          ? 'bg-[#E8F5F0] text-[#168A62] font-bold'
                          : 'bg-white text-[#2459A8] border border-[#DCE7F2]'
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Education Sidebar */}
          <div className="space-y-2 border-t border-[#DCE7F2] pt-4">
            <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-[#11183D] flex items-center gap-1.5">
              <GraduationCap size={12} className="text-[#2459A8]" />
              <span>Education</span>
            </h3>

            {data.education.map((edu) => (
              <div key={edu.id} className="text-[10.5px]">
                <div className="font-bold text-[#11183D] leading-tight">{edu.degree}</div>
                <div className="text-[#2459A8]">{edu.school}</div>
                <div className="text-[10px] text-[#526078]">{edu.startDate} – {edu.endDate}</div>
                {edu.gpa && <div className="text-[10px] font-mono text-[#168A62]">GPA: {edu.gpa}</div>}
              </div>
            ))}
          </div>

          {/* Certifications Sidebar */}
          {data.certifications.length > 0 && (
            <div className="space-y-2 border-t border-[#DCE7F2] pt-4">
              <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-[#11183D] flex items-center gap-1.5">
                <Award size={12} className="text-[#A0006D]" />
                <span>Certifications</span>
              </h3>

              {data.certifications.map((c) => (
                <div key={c.id} className="text-[10.5px]">
                  <div className="font-bold text-[#11183D]">{c.title}</div>
                  <div className="text-[10px] text-[#526078]">{c.issuer} • {c.date}</div>
                </div>
              ))}
            </div>
          )}

        </aside>

        {/* RIGHT MAIN CONTENT (8 cols) */}
        <main className="md:col-span-8 p-6 sm:p-8 space-y-6">
          
          {/* Header Banner */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#F8EAF4] text-[#A0006D] font-mono inline-block mb-1">
              Curated Candidate Profile
            </span>
            <h1 className="text-2xl font-extrabold text-[#11183D] tracking-tight">
              {data.personalInfo.fullName}
            </h1>
            <p className="text-xs font-bold text-[#2459A8]">
              {data.personalInfo.title}
            </p>
          </div>

          {/* Executive Summary */}
          {data.summary && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#2459A8] flex items-center gap-2">
                <span>About & Philosophy</span>
                <div className="h-[1px] bg-[#DCE7F2] flex-1" />
              </h3>
              <p className="text-[11px] text-[#334155] leading-relaxed">
                {data.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#2459A8] flex items-center gap-2">
              <Briefcase size={13} className="text-[#2459A8]" />
              <span>Experience & Track Record</span>
              <div className="h-[1px] bg-[#DCE7F2] flex-1" />
            </h3>

            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                    <div>
                      <span className="font-extrabold text-[#11183D] text-[12px]">{exp.title}</span>
                      <span className="text-[#A0006D] font-bold ml-1.5">@ {exp.company}</span>
                    </div>
                    <span className="text-[10.5px] font-mono text-[#526078] font-semibold">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>

                  <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-[#334155] leading-relaxed">
                    {exp.bullets.map((b, idx) => (
                      <li key={idx}>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          {data.projects.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#2459A8] flex items-center gap-2">
                <span>Featured Architectures & Open Source</span>
                <div className="h-[1px] bg-[#DCE7F2] flex-1" />
              </h3>

              <div className="space-y-3">
                {data.projects.map((proj) => (
                  <div key={proj.id} className="p-3 rounded-xl bg-[#EFFAFD]/40 border border-[#DCE7F2] space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-[#11183D] text-[11.5px]">{proj.name}</strong>
                      <div className="flex flex-wrap gap-1">
                        {proj.techStack.map((tech, i) => (
                          <span key={i} className="text-[9px] font-mono bg-white text-[#2459A8] px-1.5 py-0.2 rounded border border-[#DCE7F2]">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-[10.5px] text-[#526078]">{proj.description}</p>
                    <ul className="list-disc list-outside ml-4 space-y-0.5 text-[10.5px] text-[#334155]">
                      {proj.bullets.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>

      </div>

    </div>
  );
}
