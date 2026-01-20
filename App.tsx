
import React, { useState, useEffect, useRef } from 'react';
import { ResumeData, ResumeTemplate, AtsAnalysis } from './types';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import AtsScoreCard from './components/AtsScoreCard';
import AtsFeedbackDetails from './components/AtsFeedbackDetails';
import { FileText, Download, Layout, Github, Sparkles, Save, RotateCcw, Upload, CheckCircle } from 'lucide-react';
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

  // Persistence
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
      <header className={`sticky top-0 z-50 transition-all no-print ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
              <FileText size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800 leading-none">
                CareerPro AI
              </h1>
              {lastSaved && (
                <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                  <CheckCircle size={8} className="text-green-500" /> Saved at {lastSaved}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
              title="Import Data"
            >
              <Upload size={20} />
            </button>
            <input type="file" ref={fileInputRef} onChange={importFromJson} className="hidden" accept=".json" />
            
            <button 
              onClick={exportToJson}
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
              title="Export Data"
            >
              <Save size={20} />
            </button>

            <button 
              onClick={handleReset}
              className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
              title="Reset Form"
            >
              <RotateCcw size={20} />
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1" />

            <button 
              onClick={handlePrint}
              className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-bold text-sm transition-all shadow-md shadow-indigo-100 hover:shadow-lg active:scale-95"
            >
              <Download size={18} className="group-hover:translate-y-0.5 transition-transform" /> Download PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Form Section */}
          <div className="lg:col-span-7 no-print space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <Sparkles className="animate-pulse" /> AI Resume Studio
                </h2>
                <p className="text-indigo-100 text-sm opacity-90 max-w-md">
                  Professional ATS optimization in your browser. All your data stays private and local.
                </p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/20 rounded-full -ml-12 -mb-12 blur-xl" />
            </div>

            <ResumeForm data={data} updateData={handleUpdateData} />

            {/* ATS Feedback Details Section */}
            {(atsAnalysis || isAnalyzing) && (
              <AtsFeedbackDetails analysis={atsAnalysis} loading={isAnalyzing} />
            )}
            
            {/* Template Selector */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Layout size={14} /> Design Template
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: ResumeTemplate.MODERN, name: 'Modern', color: 'bg-indigo-600', desc: 'Standard & Tech' },
                  { id: ResumeTemplate.CLASSIC, name: 'Classic', color: 'bg-slate-800', desc: 'Law & Finance' },
                  { id: ResumeTemplate.MINIMAL, name: 'Minimal', color: 'bg-slate-400', desc: 'Creative' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    className={`group p-4 rounded-xl border-2 transition-all text-left ${
                      template === t.id 
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-sm' 
                        : 'border-slate-50 hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-8 h-1.5 rounded-full mb-3 ${t.color} group-hover:w-12 transition-all`} />
                    <span className={`block text-sm font-bold ${template === t.id ? 'text-indigo-600' : 'text-slate-800'}`}>
                      {t.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {t.desc}
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
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <div className="w-1 h-1 bg-slate-400 rounded-full" />
                Live Preview
              </span>
              <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100/50">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                Vercel Ready
              </div>
            </div>
            
            <div id="resume-container" className="shadow-2xl rounded-xl overflow-hidden border border-slate-200 bg-white origin-top transition-all duration-500 hover:shadow-indigo-100">
               <ResumePreview data={data} template={template} />
            </div>

            <div className="bg-slate-900 rounded-xl p-4 text-white/90 text-[11px] no-print">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                  <Download size={16} />
                </div>
                <div>
                  <p className="font-bold text-white">Export Hint</p>
                  <p className="opacity-70 leading-relaxed">For the perfect PDF, set <span className="text-indigo-400">Margins: None</span> and <span className="text-indigo-400">Scale: 100</span> in your browser's print settings.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer Branding */}
      <footer className="no-print border-t border-slate-200 mt-20 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                <FileText size={16} />
              </div>
              <span className="font-bold text-slate-400">CareerPro AI</span>
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-slate-400 hover:text-indigo-600 text-xs font-bold uppercase tracking-wider transition-colors">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-indigo-600 text-xs font-bold uppercase tracking-wider transition-colors">Terms</a>
              <a href="#" className="text-slate-400 hover:text-indigo-600 text-xs font-bold uppercase tracking-wider transition-colors">Support</a>
            </div>
            <p className="text-slate-300 text-xs">
              © 2024 AI Resume Studio. Powered by Gemini.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
