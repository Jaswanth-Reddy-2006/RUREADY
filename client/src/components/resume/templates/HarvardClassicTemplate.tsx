import React from 'react';
import { ResumeData } from '../../../utils/atsEngine';

interface TemplateProps {
  data: ResumeData;
  highlightKeywords?: string[];
}

export default function HarvardClassicTemplate({ data }: TemplateProps) {
  return (
    <div className="resume-paper harvard-classic bg-white text-black p-8 sm:p-12 shadow-lg rounded-2xl max-w-4xl mx-auto border border-gray-300 font-serif text-[11.5px] leading-normal print:p-0 print:border-0 print:shadow-none print:max-w-none print:rounded-none">
      
      {/* Centered Name & Contact Header */}
      <header className="text-center pb-3 border-b border-black mb-4 space-y-1">
        <h1 className="text-2xl font-bold uppercase tracking-wider text-black">
          {data.personalInfo.fullName}
        </h1>
        {data.personalInfo.title && (
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-800 font-sans">
            {data.personalInfo.title}
          </p>
        )}

        <div className="text-[11px] text-gray-800 flex flex-wrap justify-center items-center gap-x-2 gap-y-0.5">
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
          {data.personalInfo.location && (data.personalInfo.phone || data.personalInfo.email) && <span>•</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.phone && data.personalInfo.email && <span>•</span>}
          {data.personalInfo.email && (
            <a href={`mailto:${data.personalInfo.email}`} className="text-black hover:underline">
              {data.personalInfo.email}
            </a>
          )}
          {data.personalInfo.linkedin && (
            <>
              <span>•</span>
              <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-black hover:underline">
                LinkedIn
              </a>
            </>
          )}
          {data.personalInfo.github && (
            <>
              <span>•</span>
              <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="text-black hover:underline">
                GitHub
              </a>
            </>
          )}
          {data.personalInfo.portfolio && (
            <>
              <span>•</span>
              <a href={data.personalInfo.portfolio} target="_blank" rel="noreferrer" className="text-black hover:underline">
                Portfolio
              </a>
            </>
          )}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-black pb-0.5 mb-1.5">
            Professional Summary
          </h2>
          <p className="text-justify text-[11px] text-gray-900 leading-relaxed font-sans">
            {data.summary}
          </p>
        </section>
      )}

      {/* Education (Harvard standard puts Education high or after Summary) */}
      <section className="mb-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-black pb-0.5 mb-2">
          Education
        </h2>

        <div className="space-y-2">
          {data.education.map((edu) => (
            <div key={edu.id}>
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-black">{edu.school}</span>
                <span className="text-gray-700 italic">{edu.location}</span>
              </div>
              <div className="flex justify-between items-baseline text-[11px]">
                <span className="italic text-gray-900">{edu.degree}</span>
                <span className="text-gray-700">{edu.startDate} – {edu.endDate}</span>
              </div>
              {edu.gpa && (
                <div className="text-[10.5px] text-gray-800">
                  Cumulative GPA: <strong>{edu.gpa}</strong>
                </div>
              )}
              {edu.highlights && (
                <div className="text-[10.5px] text-gray-700 italic mt-0.5">
                  {edu.highlights}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Professional Experience */}
      <section className="mb-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-black pb-0.5 mb-2">
          Professional Experience
        </h2>

        <div className="space-y-3.5">
          {data.experience.map((exp) => (
            <div key={exp.id} className="space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-black text-[12px]">{exp.company}</span>
                <span className="text-gray-700 italic text-[11px]">{exp.location}</span>
              </div>
              <div className="flex justify-between items-baseline text-[11px]">
                <span className="italic font-semibold text-gray-900">{exp.title}</span>
                <span className="text-gray-700">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
              </div>

              <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-gray-900 leading-relaxed font-sans">
                {exp.bullets.map((bullet, idx) => (
                  <li key={idx}>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      {data.projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-black pb-0.5 mb-2">
            Technical Projects & Initiatives
          </h2>

          <div className="space-y-2.5">
            {data.projects.map((proj) => (
              <div key={proj.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-black">{proj.name}</span>
                    <span className="text-gray-600 text-[10px]">
                      ({proj.techStack.join(', ')})
                    </span>
                  </div>
                  {proj.repoUrl && (
                    <a href={proj.repoUrl} target="_blank" rel="noreferrer" className="text-[10px] text-gray-600 hover:underline">
                      View Code
                    </a>
                  )}
                </div>

                <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11px] text-gray-900 font-sans">
                  {proj.bullets.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Technical Skills & Certifications */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-black pb-0.5 mb-1.5">
          {data.certifications && data.certifications.length > 0 ? 'Skills & Certifications' : 'Skills'}
        </h2>

        <div className="space-y-1 text-[11px] font-sans">
          {data.skills.languages.length > 0 && (
            <div>
              <strong className="font-serif font-bold">Programming Languages: </strong>
              <span>{data.skills.languages.join(', ')}</span>
            </div>
          )}
          {((data.skills.frameworks && data.skills.frameworks.length > 0) || (data.skills.libraries && data.skills.libraries.length > 0)) && (
            <div>
              <strong className="font-serif font-bold">Frameworks & Libraries: </strong>
              <span>{[...(data.skills.frameworks || []), ...(data.skills.libraries || [])].join(', ')}</span>
            </div>
          )}
          {data.skills.databases.length > 0 && (
            <div>
              <strong className="font-serif font-bold">Databases & Caching: </strong>
              <span>{data.skills.databases.join(', ')}</span>
            </div>
          )}
          {data.skills.cloudDevOps.length > 0 && (
            <div>
              <strong className="font-serif font-bold">Cloud & DevOps: </strong>
              <span>{data.skills.cloudDevOps.join(', ')}</span>
            </div>
          )}
          {data.skills.tools && data.skills.tools.length > 0 && (
            <div>
              <strong className="font-serif font-bold">Developer Tools: </strong>
              <span>{data.skills.tools.join(', ')}</span>
            </div>
          )}
          {data.skills.security && data.skills.security.length > 0 && (
            <div>
              <strong className="font-serif font-bold">Security & Compliance: </strong>
              <span>{data.skills.security.join(', ')}</span>
            </div>
          )}
          {data.skills.other && data.skills.other.length > 0 && (
            <div>
              <strong className="font-serif font-bold">Other Skills: </strong>
              <span>{data.skills.other.join(', ')}</span>
            </div>
          )}
          {data.certifications.length > 0 && (
            <div>
              <strong className="font-serif font-bold">Certifications: </strong>
              <span>{data.certifications.map(c => `${c.title}${c.issuer ? ` (${c.issuer})` : ''}${c.date ? ` [${c.date}]` : ''}`).join('; ')}</span>
            </div>
          )}
          {data.languages && data.languages.length > 0 && (
            <div>
              <strong className="font-serif font-bold">Languages: </strong>
              <span>{data.languages.join(', ')}</span>
            </div>
          )}
        </div>
      </section>

      {/* Publications */}
      {data.publications && data.publications.length > 0 && (
        <section className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-black pb-0.5 mb-2">
            Publications
          </h2>
          <div className="space-y-1.5 text-[11px] font-sans">
            {data.publications.map((pub) => (
              <div key={pub.id} className="flex justify-between items-baseline">
                <div>
                  <strong className="font-serif font-bold">{pub.title}</strong>
                  {pub.venue && <span className="text-gray-700 italic ml-2">— {pub.venue}</span>}
                </div>
                {pub.date && <span className="text-gray-700 text-[10.5px] shrink-0">{pub.date}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Patents */}
      {data.patents && data.patents.length > 0 && (
        <section className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-black pb-0.5 mb-2">
            Patents
          </h2>
          <div className="space-y-1.5 text-[11px] font-sans">
            {data.patents.map((pat) => (
              <div key={pat.id} className="flex justify-between items-baseline">
                <div>
                  <strong className="font-serif font-bold">{pat.title}</strong>
                  {pat.number && <span className="text-gray-700 ml-2">({pat.number})</span>}
                </div>
                {pat.date && <span className="text-gray-700 text-[10.5px] shrink-0">{pat.date}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements / Honors */}
      {data.achievements && data.achievements.length > 0 && (
        <section className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-black pb-0.5 mb-1.5">
            Honors & Achievements
          </h2>
          <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11px] text-gray-900 font-sans">
            {data.achievements.map((ach, idx) => (
              <li key={idx}>{ach}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Custom Sections */}
      {data.customSections && data.customSections.length > 0 && (
        <div className="mt-4 space-y-4">
          {data.customSections.map((sec) => (
            <section key={sec.id}>
              <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-black pb-0.5 mb-1.5">
                {sec.title}
              </h2>
              <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11px] text-gray-900 font-sans">
                {sec.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

    </div>
  );
}
