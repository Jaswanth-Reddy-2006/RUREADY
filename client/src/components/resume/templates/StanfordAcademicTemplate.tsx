import React from 'react';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Award, BookOpen } from 'lucide-react';
import { ResumeData } from '../../../utils/atsEngine';

interface TemplateProps {
  data: ResumeData;
  highlightKeywords?: string[];
}

export default function StanfordAcademicTemplate({ data, highlightKeywords = [] }: TemplateProps) {
  const isKeyword = (word: string) => {
    if (!highlightKeywords || highlightKeywords.length === 0) return false;
    return highlightKeywords.some((kw) => word.toLowerCase().includes(kw.toLowerCase()));
  };

  return (
    <div className="resume-paper stanford-academic bg-[#fdfdfd] text-[#1c1917] p-8 sm:p-10 shadow-lg rounded-2xl max-w-4xl mx-auto border border-[#e7e5e4] font-serif text-[11.5px] leading-relaxed print:p-0 print:border-0 print:shadow-none print:max-w-none print:rounded-none">
      
      {/* Formal Scholarly Header */}
      <header className="text-center pb-4 mb-4 border-b border-[#78716c] space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-normal tracking-wide text-[#1c1917] uppercase">
          {data.personalInfo.fullName}
        </h1>
        <p className="text-[12px] italic text-[#44403c]">
          {data.personalInfo.title}
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-[#57534e]">
          <span>{data.personalInfo.location}</span>
          <span>•</span>
          <a href={`mailto:${data.personalInfo.email}`} className="text-[#1c1917] hover:underline">
            {data.personalInfo.email}
          </a>
          <span>•</span>
          <span>{data.personalInfo.phone}</span>
          {data.personalInfo.portfolio && (
            <>
              <span>•</span>
              <a href={data.personalInfo.portfolio} target="_blank" rel="noreferrer" className="hover:underline">
                Website
              </a>
            </>
          )}
          {data.personalInfo.github && (
            <>
              <span>•</span>
              <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="hover:underline">
                GitHub
              </a>
            </>
          )}
          {data.personalInfo.linkedin && (
            <>
              <span>•</span>
              <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:underline">
                LinkedIn
              </a>
            </>
          )}
        </div>
      </header>

      {/* Abstract / Research Focus */}
      {data.summary && (
        <section className="mb-4">
          <h2 className="text-[12px] font-bold uppercase tracking-wider text-[#1c1917] border-b border-[#a8a29e] pb-0.5 mb-1.5 font-sans">
            Research & Professional Summary
          </h2>
          <p className="text-[11.5px] text-[#292524] text-justify leading-relaxed">
            {data.summary}
          </p>
        </section>
      )}

      {/* Education First (Scholarly Hierarchy) */}
      {data.education?.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[12px] font-bold uppercase tracking-wider text-[#1c1917] border-b border-[#a8a29e] pb-0.5 mb-2 font-sans">
            Education
          </h2>
          <div className="space-y-2">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-[12px] text-[#1c1917]">{edu.school}</span>
                  <span className="text-[10.5px] italic text-[#57534e]">
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-[11px] text-[#44403c] italic">
                  <span>{edu.degree}</span>
                  {edu.gpa && <span className="font-sans text-[10.5px] font-semibold">GPA: {edu.gpa}</span>}
                </div>
                {edu.highlights && (
                  <p className="text-[11px] text-[#57534e] mt-0.5">
                    {edu.highlights}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Research & Technical Projects */}
      {data.projects?.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[12px] font-bold uppercase tracking-wider text-[#1c1917] border-b border-[#a8a29e] pb-0.5 mb-2 font-sans">
            Research Systems & Publications
          </h2>
          <div className="space-y-2.5">
            {data.projects.map((proj) => (
              <div key={proj.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-[#1c1917]">{proj.name}</span>
                  {proj.techStack?.length > 0 && (
                    <span className="text-[10px] font-sans text-[#78716c]">
                      [{proj.techStack.join(', ')}]
                    </span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-[11px] text-[#44403c] italic">{proj.description}</p>
                )}
                {proj.bullets?.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-[#292524] text-[11px]">
                    {proj.bullets.map((b, idx) => (
                      <li key={idx} className={isKeyword(b) ? 'bg-amber-50 rounded px-1 -mx-1' : ''}>
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

      {/* Professional Appointments / Experience */}
      {data.experience?.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[12px] font-bold uppercase tracking-wider text-[#1c1917] border-b border-[#a8a29e] pb-0.5 mb-2 font-sans">
            Professional Experience & Appointments
          </h2>
          <div className="space-y-3">
            {data.experience.map((exp) => (
              <div key={exp.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-[#1c1917]">{exp.title}</span>
                  <span className="text-[10.5px] italic text-[#57534e]">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-[11px] italic text-[#44403c] mb-0.5">
                  {exp.company} {exp.location && `— ${exp.location}`}
                </div>
                <ul className="list-disc list-outside ml-4 space-y-0.5 text-[#292524] text-[11px]">
                  {exp.bullets.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Technical & Methodological Competencies */}
      <section className="mb-3">
        <h2 className="text-[12px] font-bold uppercase tracking-wider text-[#1c1917] border-b border-[#a8a29e] pb-0.5 mb-1.5 font-sans">
          Technical & Computational Proficiencies
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
          {data.skills.languages?.length > 0 && (
            <div>
              <span className="font-bold text-[#1c1917]">Languages: </span>
              <span className="text-[#44403c]">{data.skills.languages.join(', ')}</span>
            </div>
          )}
          {data.skills.frameworks?.length > 0 && (
            <div>
              <span className="font-bold text-[#1c1917]">Frameworks: </span>
              <span className="text-[#44403c]">{data.skills.frameworks.join(', ')}</span>
            </div>
          )}
          {data.skills.databases?.length > 0 && (
            <div>
              <span className="font-bold text-[#1c1917]">Databases: </span>
              <span className="text-[#44403c]">{data.skills.databases.join(', ')}</span>
            </div>
          )}
          {data.skills.cloudDevOps?.length > 0 && (
            <div>
              <span className="font-bold text-[#1c1917]">Cloud & Infra: </span>
              <span className="text-[#44403c]">{data.skills.cloudDevOps.join(', ')}</span>
            </div>
          )}
        </div>
      </section>

      {/* Honors & Certifications */}
      {data.certifications?.length > 0 && (
        <section>
          <h2 className="text-[12px] font-bold uppercase tracking-wider text-[#1c1917] border-b border-[#a8a29e] pb-0.5 mb-1.5 font-sans">
            Honors, Grants & Certifications
          </h2>
          <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11px] text-[#44403c]">
            {data.certifications.map((cert) => (
              <li key={cert.id}>
                <span className="font-semibold text-[#1c1917]">{cert.title}</span> — {cert.issuer} ({cert.date})
              </li>
            ))}
          </ul>
        </section>
      )}

    </div>
  );
}
