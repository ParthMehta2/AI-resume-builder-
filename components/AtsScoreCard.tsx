
import React from 'react';
import { AtsAnalysis } from '../types';
import { TrendingUp, Zap } from 'lucide-react';

interface AtsScoreCardProps {
  analysis: AtsAnalysis | null;
  loading: boolean;
  onAnalyze: () => void;
}

const AtsScoreCard: React.FC<AtsScoreCardProps> = ({ analysis, loading, onAnalyze }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-50';
    if (score >= 50) return 'bg-amber-50';
    return 'bg-red-50';
  };

  if (!analysis && !loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200 text-center h-full flex flex-col justify-center items-center">
        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 text-indigo-600 rotate-3">
          <TrendingUp size={32} />
        </div>
        <h3 className="font-bold text-slate-800 text-lg mb-2">Check Readiness</h3>
        <p className="text-sm text-slate-500 mb-6">Validate your resume formatting and keyword density.</p>
        <button 
          onClick={onAnalyze}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
        >
          <Zap size={18} fill="currentColor" /> Analyze Now
        </button>
      </div>
    );
  }

  const score = analysis?.score || 0;

  return (
    <div className={`rounded-2xl shadow-lg p-8 border border-slate-200 text-center h-full flex flex-col justify-center ${getScoreBg(score)} transition-colors duration-500`}>
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Composite Score</h3>
      <div className={`text-7xl font-black mb-4 ${loading ? 'animate-pulse text-slate-300' : getScoreColor(score)}`}>
        {loading ? '--' : score}<span className="text-2xl ml-1 opacity-50">%</span>
      </div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
        {score >= 80 ? 'Highly Optimized' : score >= 50 ? 'Requires Refinement' : 'Action Required'}
      </p>
      
      {loading && (
        <div className="mt-6 flex justify-center gap-1">
          <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" />
        </div>
      )}
      
      {!loading && (
        <button 
          onClick={onAnalyze}
          className="mt-8 text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline"
        >
          Re-Scan Content
        </button>
      )}
    </div>
  );
};

export default AtsScoreCard;
