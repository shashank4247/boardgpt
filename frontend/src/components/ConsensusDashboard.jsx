import React from 'react';
import {
    CheckCircle2,
    AlertCircle,
    XCircle,
    FileText,
    Share2
} from 'lucide-react';

const ConsensusDashboard = ({ consensus = {}, onGenerateReport, onShare }) => {
    const {
        final_verdict = 'Conditional',
        average_confidence = 0,
        agent_analyses = [],
        explanation = 'No analysis available.'
    } = consensus;

    const getVerdictConfig = () => {
        switch (final_verdict) {
            case 'Approve':
                return {
                    icon: CheckCircle2,
                    color: 'text-emerald-600',
                    bg: 'bg-emerald-50',
                    border: 'border-emerald-200',
                    title: 'Approved by Consensus'
                };
            case 'Reject':
                return {
                    icon: XCircle,
                    color: 'text-rose-600',
                    bg: 'bg-rose-50',
                    border: 'border-rose-200',
                    title: 'Rejected by Consensus'
                };
            default:
                return {
                    icon: AlertCircle,
                    color: 'text-amber-600',
                    bg: 'bg-amber-50',
                    border: 'border-amber-200',
                    title: 'Approved with Conditions'
                };
        }
    };

    const config = getVerdictConfig();
    const Icon = config.icon;

    const analyses = Array.isArray(agent_analyses) ? agent_analyses : [];
    const approvals = analyses.filter(a => a && a.verdict === 'Approve').length;
    const rejections = analyses.filter(a => a && a.verdict === 'Reject').length;
    const total = analyses.length || 5;

    const approvePercent = total > 0 ? (approvals / total) * 100 : 0;

    return (
        <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest text-left">Consensus Summary</h3>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                            <span className="text-xs font-bold text-slate-600">Approve ({approvals}/{total})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                            <span className="text-xs font-bold text-slate-600">Reject/Cond ({total - approvals}/{total})</span>
                        </div>
                    </div>
                </div>
                <div className="h-8 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                        className="h-full bg-indigo-600 transition-all duration-1000 flex items-center px-4"
                        style={{ width: `${approvePercent}%` }}
                    >
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">{approvePercent}% Approve</span>
                    </div>
                    <div className="flex-1 flex items-center justify-end px-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{100 - approvePercent}% Reject/Cond</span>
                    </div>
                </div>
            </div>

            <div className={`p-8 rounded-3xl border-2 ${config.bg} ${config.border} relative overflow-hidden`}>
                <div className="flex items-start gap-6 relative z-10">
                    <div className={`p-4 rounded-2xl bg-white shadow-sm ${config.color}`}>
                        <Icon size={32} />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">{config.title}</h2>
                        <p className="text-slate-600 leading-relaxed font-medium max-w-4xl text-left">
                            {explanation}
                        </p>
                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={onGenerateReport}
                                className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                            >
                                Generate Full Report <FileText size={16} />
                            </button>
                            <button
                                onClick={onShare}
                                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2"
                            >
                                Share with Stakeholders <Share2 size={16} />
                            </button>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="inline-flex flex-col items-center justify-center w-24 h-24 rounded-full border-4 border-white bg-indigo-50">
                            <span className="text-2xl font-black text-indigo-600 leading-none">{average_confidence}%</span>
                            <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest mt-1">Confidence</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsensusDashboard;
