
import React, { useState, useEffect, useRef } from 'react';
import { ResumeData, ResumeTemplate, AtsAnalysis } from './types';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import AtsScoreCard from './components/AtsScoreCard';
import AtsFeedbackDetails from './components/AtsFeedbackDetails';
import { FileText, Download, Save, RotateCcw, Upload } from 'lucide-react';
import { analyzeAtsScore } from './services/geminiService';

const initialData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    jobTitle: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: []
};

const App: React.FC = () => {
  const [data, setData] = useState<ResumeData>(initialData);
  const [template, setTemplate] = useState<ResumeTemplate>(ResumeTemplate.MODERN);
  const [isScrolled, setIsScrolled] = useState(false);
  const [atsAnalysis, setAtsAnalysis] = useState<AtsAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedData = localStorage.getItem('careerpro_resume_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setData(parsed);
        setLastSaved(new Date().toLocaleTimeString());
      } catch (e) {
        console.error("Failed to load saved data");
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('careerpro_resume_data', JSON.stringify(data));
      setLastSaved(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearTimeout(timer);
  }, [data]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUpdateData = (newData: Partial<ResumeData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    if (confirm("Reset everything? This will clear all your progress.")) {
      setData(initialData);
      setAtsAnalysis(null);
      localStorage.removeItem('careerpro_resume_data');
    }
  };

  const handleRunAtsAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeAtsScore(data);
      setAtsAnalysis(result);
      // Scroll to analysis results
      setTimeout(() => {
        document.getElementById('ats-analysis-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const exportToJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume_${(data.personalInfo.fullName || 'builder').replace(/\s+/g, '_').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importFromJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          setData(json);
        } catch (e) {
          alert("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all no-print ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b' : 'bg-transparent'}`}>
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-100 group-hover:rotate-3 transition-transform">
              <FileText size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-none">CareerPro</h1>
              {lastSaved && <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-1">Autosaved {lastSaved}</p>}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {atsAnalysis && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ATS Score:</span>
                <span className={`text-sm font-bold ${atsAnalysis.score >= 80 ? 'text-green-600' : 'text-amber-500'}`}>{atsAnalysis.score}%</span>
              </div>
            )}
            
            <div className="flex items-center bg-slate-100 p-1 rounded-lg">
              <button onClick={() => fileInputRef.current?.click()} className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-md transition-all" title="Import JSON">
                <Upload size={18} />
              </button>
              <button onClick={exportToJson} className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-md transition-all" title="Export JSON">
                <Save size={18} />
              </button>
              <button onClick={handleReset} className="p-1.5 text-slate-500 hover:text-red-500 hover:bg-white rounded-md transition-all" title="Reset">
                <RotateCcw size={18} />
              </button>
            </div>

            <button 
              onClick={handlePrint}
              className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-bold text-sm transition-all shadow-md shadow-indigo-100 active:scale-95"
            >
              <Download size={18} /> Export PDF
            </button>
          </div>
        </div>
      </header>

      <input type="file" ref={fileInputRef} onChange={importFromJson} className="hidden" accept=".json" />

      {/* Main Workspace */}
      <main className="max-w-[1600px] mx-auto px-6 pt-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
          
          {/* Editor Column */}
          <div className="space-y-6 no-print">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                Resume Content
              </h2>
              <div className="flex gap-1">
                {['MODERN', 'CLASSIC', 'MINIMAL'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTemplate(t as ResumeTemplate)}
                    className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all border ${
                      template === t ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <ResumeForm data={data} updateData={handleUpdateData} />
          </div>

          {/* Preview Column */}
          <div className="xl:sticky xl:top-24 space-y-4">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest no-print">
              Live Preview
            </h2>
            <div id="resume-container" className="shadow-2xl rounded-xl overflow-hidden border border-slate-200 bg-white min-h-[800px]">
               <ResumePreview data={data} template={template} />
            </div>
          </div>
        </div>

        {/* Bottom ATS Section */}
        <section id="ats-analysis-section" className="mt-12 no-print border-t pt-12">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">ATS Performance Dashboard</h2>
              <p className="text-slate-500">Analyze how well your resume is optimized for applicant tracking systems.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <AtsScoreCard analysis={atsAnalysis} loading={isAnalyzing} onAnalyze={handleRunAtsAnalysis} />
              </div>
              <div className="md:col-span-2">
                <AtsFeedbackDetails analysis={atsAnalysis} loading={isAnalyzing} />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Simplified Footer */}
      <footer className="no-print border-t border-slate-200 mt-20 py-8 bg-white">
        <div className="max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
            <FileText size={16} /> CareerPro 2024
          </div>
          <p className="text-slate-300 text-xs">ATS-Optimized Resume Builder</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
