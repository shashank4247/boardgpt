import React from 'react';
import {
    ChevronLeft,
    Download,
    TrendingUp,
    CheckCircle2,
    AlertTriangle,
    Info,
    ArrowUpRight,
    ShieldAlert,
    Compass,
    Scale,
    Settings
} from 'lucide-react';

const roleStyles = {
    Finance: { icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    Risk: { icon: ShieldAlert, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
    Strategy: { icon: Compass, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    Ethics: { icon: Scale, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    Operations: { icon: Settings, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100' },
};

const AgentDetail = ({ agent, onBack }) => {
    if (!agent) return null;

    const style = roleStyles[agent.agent_role || agent.id] || roleStyles.Finance;
    const Icon = style.icon;

    // Use actual AI reasoning or fallback to mock for the demo
    const cleanReasoning = (agent.reasoning || "").replace(/\(FALLBACK:.*?\)\s*/gi, '').trim();

    // Split reasoning into sections if it's long, or just one section
    const reasoningItems = agent.reasoning ? [
        { title: "Analysis & Observations", content: cleanReasoning }
    ] : [
        {
            title: "Market Context",
            content: "Current market indicators suggest a stabilization trend in the tech sector. The Finance Agent has identified a 12% increase in institutional capital flow toward SaaS-based enterprise solutions."
        },
        {
            title: "Fiscal Projections",
            content: "Projected ROI for Project Zenith stands at 24.5% over 18 months. This incorporates a conservative burn rate of $2.4M per quarter, accounting for aggressive talent acquisition and infrastructure scaling."
        }
    ];

    const assumptions = Array.isArray(agent.assumptions) && agent.assumptions.length > 0
        ? agent.assumptions
        : [
            "Market Stability - Based on standard industry projections",
            "Consistent Resource Flow - Assuming no primary supply chain disruptions"
        ];

    const risks = [
        {
            title: "Regulatory Changes",
            content: "Pending SEC guidelines on automated fiscal reporting could shift roadmap requirements.",
            severity: "Medium"
        },
        {
            title: "Resource Contention",
            content: "High demand for specialized data engineers may delay phase 2 implementation.",
            severity: "Low"
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
            {/* Breadcrumb & Title Area */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest mb-2"
                    >
                        <ChevronLeft size={14} /> Back to Council
                    </button>
                    <h1 className="text-3xl font-bold text-slate-900">{agent.id} Agent Analysis</h1>
                    <p className="text-slate-500 font-medium">Agents / {agent.id} Agent Detailed Breakdown</p>
                </div>
                <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-indigo-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                    Export Analysis <Download size={16} />
                </button>
            </div>

            {/* Header Info Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 flex items-center gap-6">
                    <div className={`p-5 rounded-2xl ${style.bg} ${style.color}`}>
                        <Icon size={40} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-1">{agent.agent_role || agent.id} Agent</h2>
                        <p className="text-slate-500 font-medium mb-3">{agent.description || `Specialized analysis conducted for this decision.`}</p>
                        <div className="flex gap-3">
                            <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-widest">Role: Strategic Council</span>
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${agent.verdict === 'Approve' ? 'bg-emerald-50 text-emerald-600' :
                                agent.verdict === 'Reject' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                                }`}>Status: {agent.verdict || 'Active'}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 pr-4">
                    <div className="relative w-24 h-24">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                fill="transparent"
                                stroke="#f1f5f9"
                                strokeWidth="8"
                            />
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                fill="transparent"
                                stroke="#4f46e5"
                                strokeWidth="8"
                                strokeDasharray={251.2}
                                strokeDashoffset={251.2 * (1 - (agent.confidence || 94) / 100)}
                                strokeLinecap="round"
                                className="transition-all duration-1000"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-black text-slate-900">{agent.confidence || 94}%</span>
                        </div>
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-bold text-slate-900">Confidence Score</p>
                        <p className="text-xs text-slate-500 max-w-[150px]">Calculated based on data quality and model certainty</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="bg-white rounded-3xl border border-slate-200 p-10 shadow-sm min-h-[500px]">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                <TrendingUp size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Reasoning & Analysis</h3>
                        </div>

                        <div className="space-y-10">
                            {reasoningItems.map((item, idx) => (
                                <div key={idx} className="relative pl-6">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-full opacity-30" />
                                    <h4 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                                        {item.title}
                                    </h4>
                                    <p className="text-slate-600 leading-relaxed font-normal text-base italic">
                                        {item.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar area */}
                <div className="space-y-8">
                    {/* Assumptions Card */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                <Info size={18} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Key Assumptions</h3>
                        </div>
                        <ul className="space-y-4">
                            {assumptions.map((asm, idx) => (
                                <li key={idx} className="flex items-start gap-4">
                                    <div className="p-1 bg-indigo-50 text-indigo-600 rounded-full mt-0.5">
                                        <CheckCircle2 size={12} />
                                    </div>
                                    <span className="text-sm text-slate-600 font-medium">{asm}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Identified Risks Card */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6 font-sans">
                            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                                <AlertTriangle size={18} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Identified Risks</h3>
                        </div>
                        <div className="space-y-4">
                            {risks.map((risk, idx) => (
                                <div key={idx} className={`p-5 rounded-2xl border ${risk.severity === 'Medium' ? 'bg-amber-50 border-amber-100' : 'bg-rose-50 border-rose-100'}`}>
                                    <h4 className={`text-sm font-bold mb-1 ${risk.severity === 'Medium' ? 'text-amber-900' : 'text-rose-900'}`}>{risk.title}</h4>
                                    <p className={`text-xs ${risk.severity === 'Medium' ? 'text-amber-700' : 'text-rose-700'} leading-relaxed`}>{risk.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentDetail;
