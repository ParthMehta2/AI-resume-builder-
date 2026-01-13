
import React, { useState, useEffect, useRef } from 'react';
import { ResumeData, ResumeTemplate, AtsAnalysis } from './types';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import AtsScoreCard from './components/AtsScoreCard';
import { FileText, Download, Layout, Github, Sparkles, Save, RotateCcw, Upload } from 'lucide-react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persistence
  useEffect(() => {
    const savedData = localStorage.getItem('careerpro_resume_data');
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to load saved data");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('careerpro_resume_data', JSON.stringify(data));
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
    }
  };

  const handleRunAtsAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeAtsScore(data);
      setAtsAnalysis(result);
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
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all no-print ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <FileText size={22} strokeWidth={2.5} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">
              CareerPro AI
            </h1>
          </div>

          <div className="flex items-center gap-3">
             <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-500 hover:text-indigo-600 transition-colors"
              title="Import Data"
            >
              <Upload size={20} />
            </button>
            <input type="file" ref={fileInputRef} onChange={importFromJson} className="hidden" accept=".json" />
            
            <button 
              onClick={exportToJson}
              className="p-2 text-slate-500 hover:text-indigo-600 transition-colors"
              title="Export Data"
            >
              <Save size={20} />
            </button>

            <button 
              onClick={handleReset}
              className="p-2 text-slate-500 hover:text-red-500 transition-colors"
              title="Reset Form"
            >
              <RotateCcw size={20} />
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1" />

            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-bold text-sm transition-all shadow-md shadow-indigo-100"
            >
              <Download size={18} /> Download PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Form Section */}
          <div className="lg:col-span-7 no-print space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 text-white shadow-xl">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Sparkles /> AI Resume Builder
              </h2>
              <p className="text-indigo-100 text-sm opacity-90">
                Craft a professional, ATS-optimized resume in minutes. Changes are saved automatically.
              </p>
            </div>

            <ResumeForm data={data} updateData={handleUpdateData} />
            
            {/* Template Selector */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Layout size={16} /> Choose Template
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: ResumeTemplate.MODERN, name: 'Modern', color: 'bg-indigo-600' },
                  { id: ResumeTemplate.CLASSIC, name: 'Classic', color: 'bg-slate-800' },
                  { id: ResumeTemplate.MINIMAL, name: 'Minimal', color: 'bg-slate-400' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      template === t.id 
                        ? 'border-indigo-600 bg-indigo-50 shadow-md' 
                        : 'border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-full h-2 rounded-full mb-2 ${t.color}`} />
                    <span className={`text-xs font-bold ${template === t.id ? 'text-indigo-600' : 'text-slate-500'}`}>
                      {t.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Section (Preview & ATS) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            
            {/* ATS Score Card */}
            <AtsScoreCard analysis={atsAnalysis} loading={isAnalyzing} onAnalyze={handleRunAtsAnalysis} />

             <div className="flex justify-between items-center no-print px-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Preview</span>
              <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                SYNCED TO STORAGE
              </div>
            </div>
            
            <div id="resume-container" className="shadow-2xl rounded-lg overflow-hidden border border-slate-200 bg-white origin-top transition-transform duration-500 scale-[0.98] hover:scale-[1.0]">
               <ResumePreview data={data} template={template} />
            </div>

            <p className="text-center text-slate-400 text-xs no-print italic">
              Pro tip: For best results, use "Print to PDF" in your browser.
            </p>
          </div>

        </div>
      </main>

      {/* Footer Branding */}
      <footer className="no-print border-t border-slate-200 mt-20 py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            © 2024 AI CareerPro. Built for high-growth careers.
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="#" className="text-slate-400 hover:text-indigo-600 text-xs font-medium">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 text-xs font-medium">ATS Guidelines</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 text-xs font-medium">Job Switcher Tips</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
