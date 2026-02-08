import React from 'react';
import {
    TrendingUp,
    ShieldAlert,
    Compass,
    Scale,
    Settings,
    ChevronRight,
    Cpu
} from 'lucide-react';

const agentsData = [
    {
        id: 'Finance',
        role: 'Chief Financial Officer (CFO)',
        description: 'Analyzes fiscal impact, ROI, and long-term financial viability of strategic initiatives.',
        icon: TrendingUp,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        model: 'Gemini 2.0 Flash',
        status: 'Active'
    },
    {
        id: 'Risk',
        role: 'Chief Risk Officer (CRO)',
        description: 'Evaluates market, legal, and operational risks to ensure compliance and stability.',
        icon: ShieldAlert,
        color: 'text-orange-600',
        bg: 'bg-orange-50',
        model: 'Llama 3.3 70B',
        status: 'Active'
    },
    {
        id: 'Strategy',
        role: 'Chief Strategy Officer (CSO)',
        description: 'Focuses on competitive advantage, market positioning, and growth scalability.',
        icon: Compass,
        color: 'text-purple-600',
        bg: 'bg-purple-50',
        model: 'Mistral Large',
        status: 'Active'
    },
    {
        id: 'Ethics',
        role: 'Ethics & Governance Officer',
        description: 'Safeguards brand reputation through ESG, ethical trade-offs, and social impact analysis.',
        icon: Scale,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        model: 'Llama 3.1 8B',
        status: 'Active'
    },
    {
        id: 'Operations',
        role: 'Chief Operating Officer (COO)',
        description: 'Optimizes execution, resource allocation, and supply chain efficiency.',
        icon: Settings,
        color: 'text-slate-600',
        bg: 'bg-slate-50',
        model: 'Gemini 2.0 Pro',
        status: 'Active'
    }
];

const AgentsOverview = ({ onSelectAgent }) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {agentsData.map((agent) => {
                    const Icon = agent.icon;
                    return (
                        <div
                            key={agent.id}
                            onClick={() => onSelectAgent(agent)}
                            className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group cursor-pointer relative overflow-hidden text-left"
                        >
                            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
                                <Icon size={80} />
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className={`p-3 rounded-2xl ${agent.bg} ${agent.color}`}>
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{agent.id} Agent</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{agent.role}</p>
                                </div>
                            </div>

                            <p className="text-sm text-slate-600 leading-relaxed mb-8">
                                {agent.description}
                            </p>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500">
                                        <Cpu size={14} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">{agent.model}</span>
                                </div>
                                <div className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ChevronRight size={20} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AgentsOverview;
