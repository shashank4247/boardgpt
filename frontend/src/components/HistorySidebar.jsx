import React from 'react';

const HistorySidebar = ({ history, onSelect }) => {
    return (
        <aside className="w-80 bg-slate-900 text-slate-400 p-6 flex flex-col border-r border-slate-800 hidden lg:flex">
            <div className="mb-10">
                <div className="bg-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Board Room</h3>
                <p className="text-xs text-slate-500 font-medium">Strategic Archive</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">Previous Decisions</h4>
                {history.length === 0 ? (
                    <p className="text-sm text-slate-600 italic">No historical data available.</p>
                ) : (
                    history.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => onSelect(item)}
                            className="w-full text-left p-4 rounded-xl hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700 group ring-0 outline-none"
                        >
                            <p className="text-sm font-semibold text-slate-200 line-clamp-2 group-hover:text-indigo-400 transition-colors mb-2">
                                {item.decision_text}
                            </p>
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tighter">
                                <span className={`px-2 py-0.5 rounded ${item.final_verdict === 'Approve' ? 'text-emerald-500 bg-emerald-500/10' :
                                        item.final_verdict === 'Reject' ? 'text-rose-500 bg-rose-500/10' :
                                            'text-amber-500 bg-amber-500/10'
                                    }`}>
                                    {item.final_verdict}
                                </span>
                                <span className="text-slate-600">{item.average_confidence}% Confidence</span>
                            </div>
                        </button>
                    ))
                )}
            </div>

            <div className="mt-auto pt-8 border-t border-slate-800 text-[10px] uppercase font-bold text-slate-600 tracking-widest text-center">
                Project Zenith | Final Evaluation
            </div>
        </aside>
    );
};

export default HistorySidebar;
