import React from 'react';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, ExternalLink } from 'lucide-react';
import { ResumeData } from '../../../utils/atsEngine';

interface TemplateProps {
  data: ResumeData;
  highlightKeywords?: string[];
}

export default function AcademicResearcherTemplate({ data, highlightKeywords = [] }: TemplateProps) {
  return (
    <div className="resume-paper academic-researcher bg-white text-neutral-900 p-8 sm:p-12 shadow-md rounded-2xl max-w-4xl mx-auto border border-neutral-300 font-serif text-[11.5px] leading-relaxed print:p-0 print:border-0 print:shadow-none print:max-w-none print:rounded-none">
      
      {/* Formal Academic CV Nameplate */}
      <header className="text-center border-b-2 border-neutral-800 pb-4 mb-5 space-y-1">
        <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-neutral-600 block">
          Curriculum Vitae
        </span>
        <h1 className="text-2xl sm:text-3xl font-normal tracking-wide uppercase text-neutral-950">
          {data.personalInfo.fullName}
        </h1>
        <p className="text-xs font-medium text-neutral-800 tracking-wider font-sans">
          {data.personalInfo.title}
        </p>

        {/* Academic Coordinates */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[11px] text-neutral-700 font-sans pt-1">
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
          {data.personalInfo.email && (
            <span>
              • <a href={`mailto:${data.personalInfo.email}`} className="text-neutral-900 hover:underline">{data.personalInfo.email}</a>
            </span>
          )}
          {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
          {data.personalInfo.portfolio && (
            <span>
              • <a href={data.personalInfo.portfolio} target="_blank" rel="noreferrer" className="text-neutral-900 hover:underline">Lab Website</a>
            </span>
          )}
          {data.personalInfo.github && (
            <span>
              • <a href={data.personalInfo.github} target="_blank" rel="noreferrer" className="text-neutral-900 hover:underline">GitHub</a>
            </span>
          )}
          {data.personalInfo.linkedin && (
            <span>
              • <a href={data.personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-neutral-900 hover:underline">LinkedIn</a>
            </span>
          )}
        </div>
      </header>

      {/* Research Statement */}
      {data.summary && (
        <section className="mb-5">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-800 pb-0.5 mb-1.5 font-sans">
            Research Specialization
          </h2>
          <p className="text-[11.5px] text-neutral-800 leading-relaxed text-justify">
            {data.summary}
          </p>
        </section>
      )}

      {/* Education & Degrees (Top CV Hierarchy) */}
      {data.education?.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-800 pb-0.5 mb-2 font-sans">
            Education & Academic Credentials
          </h2>
          <div className="space-y-2.5">
            {data.education.map((edu) => (
              <div key={edu.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-neutral-950">{edu.degree}</span>
                  <span className="text-[10.5px] font-sans text-neutral-600">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="text-neutral-800 italic">
                  {edu.school}{edu.location ? `, ${edu.location}` : ''}
                  {edu.gpa && <span className="not-italic text-[10.5px] font-sans ml-2">(GPA: {edu.gpa})</span>}
                </div>
                {edu.highlights && (
                  <p className="text-[11px] text-neutral-700 pl-2">
                    {edu.highlights}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Peer-Reviewed Publications (Essential CV Component) */}
      {data.publications && data.publications.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-800 pb-0.5 mb-2 font-sans">
            Peer-Reviewed Publications & Working Papers
          </h2>
          <ol className="list-decimal list-outside ml-4 space-y-2 text-[11px] text-neutral-900">
            {data.publications.map((pub) => (
              <li key={pub.id} className="leading-snug">
                <span className="font-bold">"{pub.title}"</span>
                {pub.venue && <span className="italic"> — {pub.venue}</span>}
                {pub.date && <span className="text-neutral-600 font-sans ml-1.5">({pub.date})</span>}
                {pub.url && (
                  <a href={pub.url} target="_blank" rel="noreferrer" className="text-neutral-700 hover:underline font-sans text-[10px] ml-1.5 inline-flex items-center gap-0.5">
                    <ExternalLink size={9} /> DOI
                  </a>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Research Appointments & Academic Positions */}
      {data.experience?.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-800 pb-0.5 mb-2.5 font-sans">
            Research & Teaching Appointments
          </h2>
          <div className="space-y-3.5">
            {data.experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-neutral-950">{exp.title}</span>
                    <span className="text-neutral-800 italic"> — {exp.company}{exp.location ? `, ${exp.location}` : ''}</span>
                  </div>
                  <span className="text-[10.5px] font-sans text-neutral-600 shrink-0">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>

                {exp.bullets?.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-neutral-800">
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

      {/* Grants, Patents & Fellowships */}
      {(Boolean(data.patents?.length) || Boolean(data.achievements?.length) || Boolean(data.certifications?.length)) && (
        <section className="mb-5">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-800 pb-0.5 mb-2 font-sans">
            Grants, Fellowships & Honors
          </h2>
          <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-neutral-800">
            {data.patents?.map((pat) => (
              <li key={pat.id}>
                <strong>Patent:</strong> {pat.title}{pat.number ? ` (No. ${pat.number})` : ''} {pat.date ? `[${pat.date}]` : ''}
              </li>
            ))}
            {data.achievements?.map((ach, idx) => (
              <li key={idx}>{ach}</li>
            ))}
            {data.certifications?.map((c) => (
              <li key={c.id}>
                <strong>Certification:</strong> {c.title} — {c.issuer}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Applied Research Projects & Artifacts */}
      {data.projects?.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-800 pb-0.5 mb-2 font-sans">
            Computational Projects & Open Research Datasets
          </h2>
          <div className="space-y-2">
            {data.projects.map((proj) => (
              <div key={proj.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-neutral-950">{proj.name}</span>
                  {proj.techStack?.length > 0 && (
                    <span className="text-[10px] font-sans text-neutral-600">
                      [{proj.techStack.join(', ')}]
                    </span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-[11px] text-neutral-700 italic">{proj.description}</p>
                )}
                {proj.bullets?.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-neutral-800">
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

      {/* Methodological & Technical Competencies */}
      <section className="mb-4">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-800 pb-0.5 mb-1.5 font-sans">
          Methodological & Technical Skills
        </h2>
        <div className="space-y-1 text-[11px]">
          {data.skills.languages?.length > 0 && (
            <div>
              <strong className="font-sans text-[10.5px]">Languages & Computation: </strong>
              <span>{data.skills.languages.join(', ')}</span>
            </div>
          )}
          {data.skills.frameworks?.length > 0 && (
            <div>
              <strong className="font-sans text-[10.5px]">Libraries & Simulation: </strong>
              <span>{data.skills.frameworks.join(', ')}</span>
            </div>
          )}
          {data.languages && data.languages.length > 0 && (
            <div>
              <strong className="font-sans text-[10.5px]">Languages: </strong>
              <span>{data.languages.join('; ')}</span>
            </div>
          )}
        </div>
      </section>

      {/* Custom Sections */}
      {data.customSections && data.customSections.length > 0 && (
        <div className="space-y-3">
          {data.customSections.map((sec) => (
            <section key={sec.id}>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-800 pb-0.5 mb-1.5 font-sans">
                {sec.title}
              </h2>
              <ul className="list-disc list-outside ml-4 space-y-0.5 text-neutral-800 text-[11px]">
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
