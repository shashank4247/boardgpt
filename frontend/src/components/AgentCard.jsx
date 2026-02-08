import React from 'react';
import {
    TrendingUp,
    ShieldAlert,
    Compass,
    Scale,
    Settings,
    CheckCircle2,
    XCircle,
    AlertCircle
} from 'lucide-react';

const roleIcons = {
    Finance: TrendingUp,
    Risk: ShieldAlert,
    Strategy: Compass,
    Ethics: Scale,
    Operations: Settings,
};

const roleColors = {
    Finance: 'border-blue-500 text-blue-600',
    Risk: 'border-orange-500 text-orange-600',
    Strategy: 'border-purple-500 text-purple-600',
    Ethics: 'border-emerald-500 text-emerald-600',
    Operations: 'border-slate-500 text-slate-600',
};

const AgentCard = ({ agent = {}, onClick }) => {
    const {
        agent_role = 'Advisor',
        verdict = 'Conditional',
        confidence = 0,
        reasoning = 'No reasoning provided.',
        assumptions = []
    } = agent;

    const cleanReasoning = reasoning.replace(/\(FALLBACK:.*?\)\s*/gi, '').trim();

    const Icon = roleIcons[agent_role] || Settings;
    const colorClass = roleColors[agent_role] || 'border-slate-500';

    const getVerdictStyles = (v) => {
        switch (v) {
            case 'Approve': return { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 };
            case 'Reject': return { color: 'text-rose-600', bg: 'bg-rose-50', icon: XCircle };
            default: return { color: 'text-amber-600', bg: 'bg-amber-50', icon: AlertCircle };
        }
    };

    const verdictStyle = getVerdictStyles(verdict);
    const VerdictIcon = verdictStyle.icon;

    const assumptionsList = Array.isArray(assumptions) ? assumptions : [];

    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-3xl border-l-4 ${colorClass} shadow-sm p-6 hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col h-full text-left cursor-pointer group`}
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-xl bg-slate-50 opacity-80 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors`}>
                    <Icon size={20} />
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${verdictStyle.bg} ${verdictStyle.color}`}>
                    <VerdictIcon size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{verdict} - {confidence}%</span>
                </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">{agent_role}</h3>
            <p className="text-sm text-slate-600 leading-relaxed line-clamp-4 flex-1">
                {cleanReasoning}
            </p>

            {assumptionsList.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Key Assumptions</p>
                    <ul className="space-y-2">
                        {assumptionsList.slice(0, 2).map((asm, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-500">
                                <CheckCircle2 size={12} className="mt-0.5 text-indigo-400 shrink-0" />
                                <span className="truncate">{asm}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AgentCard;
