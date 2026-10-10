import React from 'react';
import { ResumeData } from '../../../utils/atsEngine';

interface TemplateProps {
  data: ResumeData;
  highlightKeywords?: string[];
}

export default function HarvardProfessionalTemplate({ data, highlightKeywords = [] }: TemplateProps) {
  return (
    <div className="resume-paper harvard-professional bg-white text-black p-8 sm:p-12 shadow-md rounded-2xl max-w-4xl mx-auto border border-neutral-300 font-serif text-[11.5px] leading-relaxed print:p-0 print:border-0 print:shadow-none print:max-w-none print:rounded-none">
      
      {/* Traditional Centered Header */}
      <header className="text-center border-b-2 border-black pb-3 mb-4 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-normal tracking-wide uppercase text-black">
          {data.personalInfo.fullName}
        </h1>
        {data.personalInfo.title && (
          <p className="text-xs font-semibold text-neutral-800 tracking-wider uppercase font-sans">
            {data.personalInfo.title}
          </p>
        )}

        {/* Contact Coordinates */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[11px] text-neutral-800 font-sans">
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
          {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
          {data.personalInfo.email && (
            <span>
              • <a href={`mailto:${data.personalInfo.email}`} className="text-black hover:underline">{data.personalInfo.email}</a>
            </span>
          )}
          {data.personalInfo.linkedin && (
            <span>
              • <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-black hover:underline">LinkedIn</a>
            </span>
          )}
          {data.personalInfo.github && (
            <span>
              • <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="text-black hover:underline">GitHub</a>
            </span>
          )}
          {data.personalInfo.portfolio && (
            <span>
              • <a href={data.personalInfo.portfolio} target="_blank" rel="noreferrer" className="text-black hover:underline">Portfolio</a>
            </span>
          )}
        </div>
      </header>

      {/* Summary / Profile */}
      {data.summary && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5 font-sans">
            Professional Profile
          </h2>
          <p className="text-[11.5px] text-neutral-900 leading-normal text-justify">
            {data.summary}
          </p>
        </section>
      )}

      {/* Education (Prominent for Academic/Consulting) */}
      {data.education?.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2 font-sans">
            Education
          </h2>
          <div className="space-y-2">
            {data.education.map((edu) => (
              <div key={edu.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline font-bold">
                  <span>{edu.school}{edu.location ? `, ${edu.location}` : ''}</span>
                  <span className="font-normal font-sans text-[10.5px] text-neutral-700">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="flex justify-between items-baseline italic text-neutral-900">
                  <span>{edu.degree}</span>
                  {edu.gpa && <span className="font-sans text-[10px] not-italic font-medium">GPA: {edu.gpa}</span>}
                </div>
                {edu.highlights && (
                  <p className="text-[11px] text-neutral-800 pl-2">
                    {edu.highlights}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Professional Experience */}
      {data.experience?.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2.5 font-sans">
            Professional Experience
          </h2>
          <div className="space-y-3.5">
            {data.experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-black">{exp.company}</span>
                    {exp.location && <span className="text-neutral-700 font-normal"> — {exp.location}</span>}
                  </div>
                  <span className="font-sans text-[10.5px] text-neutral-700 shrink-0">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="italic text-neutral-900">
                  {exp.title}
                </div>

                {exp.bullets?.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-neutral-900 leading-snug">
                    {exp.bullets.map((b, idx) => (
                      <li key={idx} className="text-justify">{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Selected Projects */}
      {data.projects?.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2 font-sans">
            Selected Projects & Initiatives
          </h2>
          <div className="space-y-2.5">
            {data.projects.map((proj) => (
              <div key={proj.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-black">{proj.name}</span>
                  {proj.techStack?.length > 0 && (
                    <span className="font-sans text-[10px] text-neutral-700">
                      [{proj.techStack.join(', ')}]
                    </span>
                  )}
                </div>
                {proj.description && (
                  <p className="italic text-neutral-800 text-[11px]">{proj.description}</p>
                )}
                {proj.bullets?.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-neutral-900">
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

      {/* Skills & Accreditations */}
      <section className="mb-4">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5 font-sans">
          Skills & Certifications
        </h2>
        <div className="space-y-1 text-[11px] leading-snug">
          {data.skills.languages?.length > 0 && (
            <div>
              <strong className="font-sans text-[10.5px]">Technical & Analytical: </strong>
              <span>{data.skills.languages.join(', ')}</span>
            </div>
          )}
          {data.skills.frameworks?.length > 0 && (
            <div>
              <strong className="font-sans text-[10.5px]">Frameworks & Tools: </strong>
              <span>{data.skills.frameworks.join(', ')}</span>
            </div>
          )}
          {data.skills.databases?.length > 0 && (
            <div>
              <strong className="font-sans text-[10.5px]">Databases & Infrastructure: </strong>
              <span>{[...(data.skills.databases || []), ...(data.skills.cloudDevOps || [])].join(', ')}</span>
            </div>
          )}
          {data.certifications?.length > 0 && (
            <div className="pt-0.5">
              <strong className="font-sans text-[10.5px]">Certifications: </strong>
              <span>{data.certifications.map(c => `${c.title} (${c.issuer})`).join('; ')}</span>
            </div>
          )}
        </div>
      </section>

      {/* Publications, Patents, Honors */}
      {(Boolean(data.publications?.length) || Boolean(data.patents?.length) || Boolean(data.achievements?.length) || Boolean(data.languages?.length)) && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5 font-sans">
            Publications, Honors & Languages
          </h2>
          <ul className="list-disc list-outside ml-4 space-y-0.5 text-neutral-900 text-[11px]">
            {data.publications?.map((pub) => (
              <li key={pub.id}>
                <strong>Publication:</strong> {pub.title}{pub.venue ? `, ${pub.venue}` : ''}{pub.date ? ` (${pub.date})` : ''}
              </li>
            ))}
            {data.patents?.map((pat) => (
              <li key={pat.id}>
                <strong>Patent:</strong> {pat.title}{pat.number ? ` (No. ${pat.number})` : ''}
              </li>
            ))}
            {data.achievements?.map((ach, idx) => (
              <li key={idx}>{ach}</li>
            ))}
            {data.languages && data.languages.length > 0 && (
              <li>
                <strong>Languages:</strong> {data.languages.join(', ')}
              </li>
            )}
          </ul>
        </section>
      )}

      {/* Custom Sections */}
      {data.customSections && data.customSections.length > 0 && (
        <div className="space-y-3">
          {data.customSections.map((sec) => (
            <section key={sec.id}>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5 font-sans">
                {sec.title}
              </h2>
              <ul className="list-disc list-outside ml-4 space-y-0.5 text-neutral-900 text-[11px]">
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
