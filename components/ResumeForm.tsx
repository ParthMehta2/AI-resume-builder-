
import React, { useState } from 'react';
import { ResumeData, PersonalInfo, Experience, Education, Skill, Project } from '../types';
import { Plus, Trash2, Wand2, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import { rewriteProfessionalSummary, optimizeExperienceBullet } from '../services/geminiService';

interface ResumeFormProps {
  data: ResumeData;
  updateData: (data: Partial<ResumeData>) => void;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ data, updateData }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loadingAI, setLoadingAI] = useState<string | null>(null);

  const steps = [
    { title: 'Basics', id: 'basics' },
    { title: 'Experience', id: 'experience' },
    { title: 'Education', id: 'education' },
    { title: 'Skills', id: 'skills' },
    { title: 'Projects', id: 'projects' },
  ];

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateData({
      personalInfo: { ...data.personalInfo, [name]: value }
    });
  };

  const handleSummaryAI = async () => {
    setLoadingAI('summary');
    try {
      const newSummary = await rewriteProfessionalSummary(data);
      updateData({ summary: newSummary });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAI(null);
    }
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: crypto.randomUUID(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    updateData({ experience: [...data.experience, newExp] });
  };

  const removeExperience = (id: string) => {
    updateData({ experience: data.experience.filter(e => e.id !== id) });
  };

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    updateData({
      experience: data.experience.map(e => e.id === id ? { ...e, ...updates } : e)
    });
  };

  const handleOptimizeExp = async (id: string, description: string) => {
    setLoadingAI(id);
    try {
      const optimized = await optimizeExperienceBullet(description, data.personalInfo.jobTitle);
      updateExperience(id, { description: optimized });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAI(null);
    }
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: crypto.randomUUID(),
      school: '',
      degree: '',
      field: '',
      graduationDate: '',
      location: ''
    };
    updateData({ education: [...data.education, newEdu] });
  };

  const addSkill = () => {
    updateData({ skills: [...data.skills, { id: crypto.randomUUID(), name: '', level: 'Intermediate' }] });
  };

  const addProject = () => {
    updateData({ projects: [...data.projects, { id: crypto.randomUUID(), title: '', link: '', description: '' }] });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-8">
      {/* Step Indicator */}
      <div className="flex items-center justify-between border-b pb-4 overflow-x-auto">
        {steps.map((step, idx) => (
          <button
            key={step.id}
            onClick={() => setActiveStep(idx)}
            className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeStep === idx 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {idx + 1}. {step.title}
          </button>
        ))}
      </div>

      {/* Basic Info */}
      {activeStep === 0 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
              <input 
                name="fullName" 
                value={data.personalInfo.fullName} 
                onChange={handlePersonalInfoChange} 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Target Job Title</label>
              <input 
                name="jobTitle" 
                value={data.personalInfo.jobTitle} 
                onChange={handlePersonalInfoChange} 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                placeholder="Senior Software Engineer"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email</label>
              <input 
                name="email" 
                value={data.personalInfo.email} 
                onChange={handlePersonalInfoChange} 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Phone</label>
              <input 
                name="phone" 
                value={data.personalInfo.phone} 
                onChange={handlePersonalInfoChange} 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                placeholder="+1 234 567 890"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Location</label>
              <input 
                name="location" 
                value={data.personalInfo.location} 
                onChange={handlePersonalInfoChange} 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                placeholder="San Francisco, CA"
              />
            </div>
          </div>

          <div className="relative">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Professional Summary</label>
              <button 
                onClick={handleSummaryAI}
                disabled={loadingAI === 'summary'}
                className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold hover:bg-indigo-100 transition-colors disabled:opacity-50"
              >
                <Sparkles size={14} />
                {loadingAI === 'summary' ? 'Writing...' : 'AI Generate'}
              </button>
            </div>
            <textarea 
              rows={4}
              value={data.summary}
              onChange={(e) => updateData({ summary: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              placeholder="Briefly describe your professional background and key achievements..."
            />
          </div>
        </div>
      )}

      {/* Experience */}
      {activeStep === 1 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {data.experience.map((exp) => (
            <div key={exp.id} className="p-4 border border-slate-100 bg-slate-50 rounded-xl relative">
              <button 
                onClick={() => removeExperience(exp.id)}
                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Company</label>
                  <input 
                    value={exp.company} 
                    onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Position</label>
                  <input 
                    value={exp.position} 
                    onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Start Date</label>
                  <input 
                    value={exp.startDate} 
                    onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">End Date</label>
                  <input 
                    value={exp.endDate} 
                    onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder={exp.current ? 'Present' : ''}
                  />
                </div>
                <div className="col-span-2">
                   <div className="flex justify-between items-center mb-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Achievements & Responsibilities</label>
                    <button 
                      onClick={() => handleOptimizeExp(exp.id, exp.description)}
                      disabled={loadingAI === exp.id || !exp.description}
                      className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                    >
                      <Wand2 size={12} />
                      {loadingAI === exp.id ? 'Optimizing...' : 'AI Rewrite'}
                    </button>
                  </div>
                  <textarea 
                    rows={3}
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded focus:ring-2 focus:ring-indigo-500 outline-none resize-none" 
                    placeholder="Describe your impact..."
                  />
                </div>
              </div>
            </div>
          ))}
          <button 
            onClick={addExperience}
            className="w-full py-3 border-2 border-dashed border-slate-200 text-slate-400 rounded-xl hover:border-indigo-300 hover:text-indigo-500 flex items-center justify-center gap-2 transition-all"
          >
            <Plus size={20} /> Add Experience
          </button>
        </div>
      )}

      {/* Education */}
      {activeStep === 2 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {data.education.map((edu) => (
            <div key={edu.id} className="p-4 border border-slate-100 bg-slate-50 rounded-xl relative">
               <button 
                onClick={() => updateData({ education: data.education.filter(e => e.id !== edu.id) })}
                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">School</label>
                  <input 
                    value={edu.school} 
                    onChange={(e) => updateData({ education: data.education.map(ed => ed.id === edu.id ? { ...ed, school: e.target.value } : ed) })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Degree</label>
                  <input 
                    value={edu.degree} 
                    onChange={(e) => updateData({ education: data.education.map(ed => ed.id === edu.id ? { ...ed, degree: e.target.value } : ed) })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Graduation Date</label>
                  <input 
                    value={edu.graduationDate} 
                    onChange={(e) => updateData({ education: data.education.map(ed => ed.id === edu.id ? { ...ed, graduationDate: e.target.value } : ed) })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
                </div>
              </div>
            </div>
          ))}
          <button 
            onClick={addEducation}
            className="w-full py-3 border-2 border-dashed border-slate-200 text-slate-400 rounded-xl hover:border-indigo-300 hover:text-indigo-500 flex items-center justify-center gap-2 transition-all"
          >
            <Plus size={20} /> Add Education
          </button>
        </div>
      )}

      {/* Skills */}
      {activeStep === 3 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-2 gap-3">
            {data.skills.map((skill) => (
              <div key={skill.id} className="flex gap-2">
                <input 
                  value={skill.name} 
                  onChange={(e) => updateData({ skills: data.skills.map(s => s.id === skill.id ? { ...s, name: e.target.value } : s) })}
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  placeholder="e.g. React.js"
                />
                <button 
                  onClick={() => updateData({ skills: data.skills.filter(s => s.id !== skill.id) })}
                  className="text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <button 
            onClick={addSkill}
            className="w-full py-2 border border-slate-200 text-slate-400 rounded hover:bg-slate-50 flex items-center justify-center gap-2 transition-all text-sm"
          >
            <Plus size={16} /> Add Skill
          </button>
        </div>
      )}

      {/* Projects */}
      {activeStep === 4 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {data.projects.map((project) => (
            <div key={project.id} className="p-4 border border-slate-100 bg-slate-50 rounded-xl relative">
               <button 
                onClick={() => updateData({ projects: data.projects.filter(p => p.id !== project.id) })}
                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
              <div className="space-y-3">
                <input 
                  value={project.title} 
                  onChange={(e) => updateData({ projects: data.projects.map(p => p.id === project.id ? { ...p, title: e.target.value } : p) })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold"
                  placeholder="Project Title"
                />
                <input 
                  value={project.link} 
                  onChange={(e) => updateData({ projects: data.projects.map(p => p.id === project.id ? { ...p, link: e.target.value } : p) })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  placeholder="Link (GitHub, Portfolio, etc.)"
                />
                <textarea 
                  rows={2}
                  value={project.description}
                  onChange={(e) => updateData({ projects: data.projects.map(p => p.id === project.id ? { ...p, description: e.target.value } : p) })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-sm" 
                  placeholder="Briefly describe the project and tech stack used..."
                />
              </div>
            </div>
          ))}
          <button 
            onClick={addProject}
            className="w-full py-3 border-2 border-dashed border-slate-200 text-slate-400 rounded-xl hover:border-indigo-300 hover:text-indigo-500 flex items-center justify-center gap-2 transition-all"
          >
            <Plus size={20} /> Add Project
          </button>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex justify-between pt-6 border-t">
        <button 
          onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
          disabled={activeStep === 0}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 disabled:opacity-30 transition-colors"
        >
          <ChevronLeft size={20} /> Previous
        </button>
        <button 
          onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
          disabled={activeStep === steps.length - 1}
          className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-30 transition-colors shadow-lg shadow-indigo-200"
        >
          Next <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default ResumeForm;
