
import React from 'react';
import { ResumeData, ResumeTemplate } from '../types';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
  template: ResumeTemplate;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, template }) => {
  const { personalInfo, summary, experience, education, skills, projects } = data;

  // Modern Template Rendering
  const renderModern = () => (
    <div className="bg-white min-h-[1100px] p-10 font-sans shadow-inner">
      <header className="border-b-4 border-indigo-600 pb-6 mb-8">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">{personalInfo.fullName || 'YOUR NAME'}</h1>
        <p className="text-xl text-indigo-600 font-medium mt-1">{personalInfo.jobTitle || 'JOB TITLE'}</p>
        
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-slate-500 text-sm">
          {personalInfo.email && <div className="flex items-center gap-1.5"><Mail size={14} /> {personalInfo.email}</div>}
          {personalInfo.phone && <div className="flex items-center gap-1.5"><Phone size={14} /> {personalInfo.phone}</div>}
          {personalInfo.location && <div className="flex items-center gap-1.5"><MapPin size={14} /> {personalInfo.location}</div>}
          {personalInfo.linkedin && <div className="flex items-center gap-1.5"><Linkedin size={14} /> LinkedIn</div>}
        </div>
      </header>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-8 space-y-8">
          {summary && (
            <section>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Professional Summary</h2>
              <p className="text-slate-700 leading-relaxed text-[0.95rem]">{summary}</p>
            </section>
          )}

          {experience.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Work Experience</h2>
              <div className="space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">{exp.position}</h3>
                        <p className="text-indigo-600 font-semibold">{exp.company}</p>
                      </div>
                      <p className="text-sm text-slate-500 font-medium">{exp.startDate} — {exp.endDate || 'Present'}</p>
                    </div>
                    <p className="mt-2 text-slate-600 text-[0.9rem] leading-relaxed whitespace-pre-line">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Selected Projects</h2>
              <div className="space-y-4">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
                      {proj.title} 
                      {proj.link && <span className="text-xs text-indigo-500 font-normal underline">{proj.link}</span>}
                    </h3>
                    <p className="text-slate-600 text-sm mt-1">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="col-span-4 space-y-8">
          {skills.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Core Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill.id} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Education</h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="text-sm font-bold text-slate-800 leading-tight">{edu.degree}</h3>
                    <p className="text-xs text-indigo-600 font-semibold mt-0.5">{edu.school}</p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wider">{edu.graduationDate}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );

  // Minimal Template Rendering
  const renderMinimal = () => (
    <div className="bg-white min-h-[1100px] p-12 font-sans text-slate-800">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-light text-slate-900 mb-2">{personalInfo.fullName || 'YOUR NAME'}</h1>
        <div className="flex justify-center flex-wrap gap-x-4 text-xs text-slate-500">
          <span>{personalInfo.email}</span>
          <span>•</span>
          <span>{personalInfo.phone}</span>
          <span>•</span>
          <span>{personalInfo.location}</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-10">
        <section>
          <h2 className="text-[11px] font-bold text-slate-900 border-b border-slate-200 pb-1 mb-4 uppercase tracking-widest">About</h2>
          <p className="text-sm leading-relaxed text-slate-600">{summary}</p>
        </section>

        <section>
          <h2 className="text-[11px] font-bold text-slate-900 border-b border-slate-200 pb-1 mb-4 uppercase tracking-widest">Experience</h2>
          <div className="space-y-8">
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-sm font-bold">{exp.position} — <span className="font-normal italic text-slate-500">{exp.company}</span></h3>
                  <span className="text-[10px] text-slate-400">{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-10">
          <section>
            <h2 className="text-[11px] font-bold text-slate-900 border-b border-slate-200 pb-1 mb-4 uppercase tracking-widest">Education</h2>
            <div className="space-y-3">
              {education.map(edu => (
                <div key={edu.id}>
                  <p className="text-xs font-bold">{edu.school}</p>
                  <p className="text-xs text-slate-500">{edu.degree}</p>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-[11px] font-bold text-slate-900 border-b border-slate-200 pb-1 mb-4 uppercase tracking-widest">Skills</h2>
            <p className="text-xs text-slate-600 leading-relaxed">{skills.map(s => s.name).join(', ')}</p>
          </section>
        </div>
      </div>
    </div>
  );

  // Classic Template Rendering (High ATS compatibility)
  const renderClassic = () => (
    <div className="bg-white min-h-[1100px] p-12 font-serif text-black leading-tight">
       <div className="text-center border-b border-black pb-4 mb-6">
        <h1 className="text-3xl font-bold uppercase">{personalInfo.fullName || 'YOUR NAME'}</h1>
        <div className="mt-1 text-sm space-x-2">
          <span>{personalInfo.location}</span>
          <span>|</span>
          <span>{personalInfo.phone}</span>
          <span>|</span>
          <span>{personalInfo.email}</span>
        </div>
        {personalInfo.linkedin && <div className="text-sm mt-1">{personalInfo.linkedin}</div>}
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-bold border-b border-black mb-2 uppercase">Professional Summary</h2>
          <p className="text-[13px] text-justify">{summary}</p>
        </section>

        <section>
          <h2 className="text-lg font-bold border-b border-black mb-3 uppercase">Experience</h2>
          <div className="space-y-4">
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between font-bold text-[14px]">
                  <span>{exp.company}</span>
                  <span>{exp.location || ''}</span>
                </div>
                <div className="flex justify-between text-[13px] italic mb-1">
                  <span>{exp.position}</span>
                  <span>{exp.startDate} – {exp.endDate || 'Present'}</span>
                </div>
                <div className="text-[13px] pl-4 whitespace-pre-line">
                  {exp.description.split('\n').map((line, i) => (
                    <div key={i} className="relative before:content-['•'] before:absolute before:-left-4">
                      {line.replace(/^•\s*/, '')}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold border-b border-black mb-3 uppercase">Education</h2>
          {education.map(edu => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between font-bold text-[14px]">
                <span>{edu.school}</span>
                <span>{edu.location || ''}</span>
              </div>
              <div className="flex justify-between text-[13px] italic">
                <span>{edu.degree} in {edu.field}</span>
                <span>{edu.graduationDate}</span>
              </div>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-lg font-bold border-b border-black mb-2 uppercase">Skills</h2>
          <p className="text-[13px]"><span className="font-bold">Technical Skills:</span> {skills.map(s => s.name).join(', ')}</p>
        </section>
      </div>
    </div>
  );

  switch (template) {
    case ResumeTemplate.MINIMAL: return renderMinimal();
    case ResumeTemplate.CLASSIC: return renderClassic();
    default: return renderModern();
  }
};

export default ResumePreview;
