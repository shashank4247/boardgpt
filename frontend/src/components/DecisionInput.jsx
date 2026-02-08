import React, { useState } from 'react';
import { Paperclip, Globe, Layout, Sparkles } from 'lucide-react';

const DecisionInput = ({ onAnalyze, isLoading }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.length >= 10) {
            onAnalyze(text);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
                <textarea
                    className="w-full h-40 p-6 bg-slate-50 border-none rounded-2xl text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600/20 transition-all resize-none font-medium leading-relaxed"
                    placeholder="Enter a strategic business decision (e.g., 'Should we invest $20M in a new R&D center for AI in Berlin?')"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={isLoading}
                />
                <div className="absolute bottom-4 left-6 flex items-center gap-4 text-slate-400">
                    <button type="button" className="hover:text-indigo-600 transition-colors"><Paperclip size={20} /></button>
                    <button type="button" className="hover:text-indigo-600 transition-colors"><Globe size={20} /></button>
                    <button type="button" className="hover:text-indigo-600 transition-colors"><Layout size={20} /></button>
                </div>
                <div className="absolute bottom-4 right-6 uppercase text-[10px] font-bold tracking-widest text-slate-400">
                    {text.length} / 500
                </div>
            </div>
            <div className="flex justify-end pt-2">
                <button
                    type="submit"
                    className={`px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg flex items-center gap-2 active:scale-95 ${isLoading || text.length < 10
                        ? 'bg-slate-300 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
                        }`}
                    disabled={isLoading || text.length < 10}
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Assembling Board...
                        </>
                    ) : (
                        <>
                            <Sparkles size={18} />
                            Analyze with BoardGPT
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default DecisionInput;
