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
          {data.skills.libraries && data.skills.libraries.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <strong className="text-[#11183D] w-24 shrink-0">Libraries:</strong>
              <div className="flex flex-wrap gap-1">
                {data.skills.libraries.map((s, idx) => (
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

          {data.skills.security && data.skills.security.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <strong className="text-[#11183D] w-24 shrink-0">Security:</strong>
              <div className="flex flex-wrap gap-1">
                {data.skills.security.map((s, idx) => (
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

          {data.skills.other && data.skills.other.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <strong className="text-[#11183D] w-24 shrink-0">Other Skills:</strong>
              <div className="flex flex-wrap gap-1">
                {data.skills.other.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[10.5px] font-mono bg-gray-100 text-[#526078] border border-gray-200"
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
      {data.experience.length > 0 && (
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
                    {exp.location && (
                      <span className="text-[11px] text-[#526078] ml-2">
                        • {exp.location}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#526078]">
                    {exp.startDate} {exp.startDate || exp.endDate ? '–' : ''} {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>

                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-[#334155] leading-relaxed">
                    {exp.bullets.map((bullet, bIdx) => (
                      <li key={bIdx}>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

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
                    {(proj.repoUrl || proj.liveUrl) && (
                      <a href={proj.repoUrl || proj.liveUrl} target="_blank" rel="noreferrer" className="text-[10px] text-[#2459A8] hover:underline flex items-center gap-0.5">
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

                {proj.description && (
                  <p className="text-[11px] text-[#334155]">{proj.description}</p>
                )}

                {proj.bullets && proj.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-[#334155]">
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

      {/* Education & Certifications */}
      {((data.education && data.education.length > 0) || (data.certifications && data.certifications.length > 0)) && (
        <div className={`grid ${data.education?.length && data.certifications?.length ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'} gap-4 mb-5`}>
        {/* Education */}
        {data.education.length > 0 && (
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
                    <span>{edu.startDate} {edu.startDate || edu.endDate ? '–' : ''} {edu.endDate}</span>
                  </div>
                  {edu.gpa && <div className="text-[10px] font-mono text-[#168A62]">GPA: {edu.gpa}</div>}
                  {edu.coursework && <div className="text-[10px] text-[#526078]">Coursework: {edu.coursework}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

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
    )}

      {/* Publications */}
      {data.publications && data.publications.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#2459A8] mb-2 flex items-center gap-2">
            <span>Publications</span>
            <div className="h-[1px] bg-[#DCE7F2] flex-1" />
          </h2>
          <div className="space-y-1.5 text-[11px]">
            {data.publications.map((pub) => (
              <div key={pub.id} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  <strong className="text-[#11183D]">{pub.title}</strong>
                  {pub.venue && <span className="text-[#526078] ml-2">— {pub.venue}</span>}
                  {pub.url && (
                    <a href={pub.url} target="_blank" rel="noreferrer" className="text-[#2459A8] hover:underline ml-2 inline-flex items-center gap-0.5">
                      <ExternalLink size={9} /> Link
                    </a>
                  )}
                </div>
                {pub.date && <span className="text-[#526078] font-mono text-[10px] shrink-0">{pub.date}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Patents */}
      {data.patents && data.patents.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#2459A8] mb-2 flex items-center gap-2">
            <span>Patents</span>
            <div className="h-[1px] bg-[#DCE7F2] flex-1" />
          </h2>
          <div className="space-y-1.5 text-[11px]">
            {data.patents.map((pat) => (
              <div key={pat.id} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  <strong className="text-[#11183D]">{pat.title}</strong>
                  {pat.number && <span className="text-[#526078] ml-2">({pat.number})</span>}
                </div>
                {pat.date && <span className="text-[#526078] font-mono text-[10px] shrink-0">{pat.date}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements / Awards */}
      {data.achievements && data.achievements.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#2459A8] mb-2 flex items-center gap-2">
            <span>Achievements & Awards</span>
            <div className="h-[1px] bg-[#DCE7F2] flex-1" />
          </h2>
          <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-[#334155]">
            {data.achievements.map((ach, idx) => (
              <li key={idx}>{ach}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Languages & Interests */}
      {(Boolean(data.languages && data.languages.length > 0) || Boolean(data.hobbies && data.hobbies.length > 0)) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {data.languages && data.languages.length > 0 && (
            <section>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#2459A8] mb-1.5 flex items-center gap-2">
                <span>Languages</span>
                <div className="h-[1px] bg-[#DCE7F2] flex-1" />
              </h2>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {data.languages.map((lang, idx) => (
                  <span key={idx} className="bg-slate-100 text-[#11183D] px-2 py-0.5 rounded text-[10.5px]">
                    {lang}
                  </span>
                ))}
              </div>
            </section>
          )}
          {data.hobbies && data.hobbies.length > 0 && (
            <section>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#2459A8] mb-1.5 flex items-center gap-2">
                <span>Interests</span>
                <div className="h-[1px] bg-[#DCE7F2] flex-1" />
              </h2>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {data.hobbies.map((h, idx) => (
                  <span key={idx} className="bg-slate-100 text-[#526078] px-2 py-0.5 rounded text-[10.5px]">
                    {h}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Custom / Additional Sections */}
      {data.customSections && data.customSections.length > 0 && (
        <div className="space-y-4">
          {data.customSections.map((sec) => (
            <section key={sec.id} className="mb-4">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#2459A8] mb-2 flex items-center gap-2">
                <span>{sec.title}</span>
                <div className="h-[1px] bg-[#DCE7F2] flex-1" />
              </h2>
              <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-[#334155]">
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
