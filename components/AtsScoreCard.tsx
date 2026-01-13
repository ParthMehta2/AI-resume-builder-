
import React from 'react';
import { AtsAnalysis } from '../types';
import { CheckCircle2, AlertCircle, XCircle, TrendingUp, Zap } from 'lucide-react';

interface AtsScoreCardProps {
  analysis: AtsAnalysis | null;
  loading: boolean;
  onAnalyze: () => void;
}

const AtsScoreCard: React.FC<AtsScoreCardProps> = ({ analysis, loading, onAnalyze }) => {
  if (!analysis && !loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100 text-center">
        <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-3 text-indigo-600">
          <TrendingUp size={24} />
        </div>
        <h3 className="font-bold text-slate-800 mb-1">Check your ATS Score</h3>
        <p className="text-sm text-slate-500 mb-4">See how well your resume performs against top recruiting systems.</p>
        <button 
          onClick={onAnalyze}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
        >
          <Zap size={16} /> Run AI Analysis
        </button>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle2 className="text-green-500" size={16} />;
      case 'warning': return <AlertCircle className="text-amber-500" size={16} />;
      case 'critical': return <XCircle className="text-red-500" size={16} />;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-50">
      <div className="bg-slate-50 p-6 flex items-center justify-between border-b">
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">ATS Readiness</h3>
          <div className={`text-4xl font-black mt-1 ${loading ? 'animate-pulse text-slate-300' : getScoreColor(analysis?.score || 0)}`}>
            {loading ? '--' : analysis?.score}%
          </div>
        </div>
        <button 
          onClick={onAnalyze}
          disabled={loading}
          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50"
          title="Re-run analysis"
        >
          <TrendingUp size={20} />
        </button>
      </div>

      <div className="p-4 max-h-[400px] overflow-y-auto space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-slate-50 rounded-lg animate-pulse" />
          ))
        ) : (
          analysis?.feedbacks.map((item, idx) => (
            <div key={idx} className="flex gap-3 p-3 bg-slate-50/50 rounded-lg border border-slate-100 items-start">
              <div className="mt-0.5">{getStatusIcon(item.status)}</div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">{item.category}</p>
                <p className="text-xs text-slate-700 leading-snug">{item.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
      
      {!loading && (
        <div className="p-4 bg-indigo-50/50 text-[10px] text-indigo-700 italic border-t border-indigo-100">
          Pro tip: Target a score above 85% for high-volume roles.
        </div>
      )}
    </div>
  );
};

export default AtsScoreCard;
