import React, { useState } from 'react';
import { Paperclip, Globe, Layout, Sparkles } from 'lucide-react';

const DecisionInput = ({ onAnalyze, isLoading, value, onChange }) => {

    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = React.useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (value.length >= 10) {
            onAnalyze(value, selectedFile);
            setSelectedFile(null); // Reset after submit
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
                <textarea
                    className="w-full h-40 p-6 bg-slate-50 border-none rounded-2xl text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600/20 transition-all resize-none font-medium leading-relaxed"
                    placeholder="Enter a strategic business decision (e.g., 'Should we invest $20M in a new R&D center for AI in Berlin?')"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={isLoading}
                />

                {/* File Preview */}
                {selectedFile && (
                    <div className="absolute top-4 right-6 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-2">
                        <Paperclip size={14} />
                        <span className="max-w-[150px] truncate">{selectedFile.name}</span>
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedFile(null);
                                if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="hover:text-indigo-900"
                        >
                            ×
                        </button>
                    </div>
                )}

                <div className="absolute bottom-4 left-6 flex items-center gap-4 text-slate-400">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".txt,.md,.csv,.json,.py,.js,.java,.c,.cpp"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`transition-colors ${selectedFile ? 'text-indigo-600' : 'hover:text-indigo-600'}`}
                        title="Attach context file (Text, Markdown, CSV, JSON, Code)"
                    >
                        <Paperclip size={20} />
                    </button>
                    <button type="button" className="hover:text-indigo-600 transition-colors"><Globe size={20} /></button>
                    <button type="button" className="hover:text-indigo-600 transition-colors"><Layout size={20} /></button>
                </div>
                <div className="absolute bottom-4 right-6 uppercase text-[10px] font-bold tracking-widest text-slate-400">
                    {value.length} / 500
                </div>
            </div>
            <div className="flex justify-end pt-2">
                <button
                    type="submit"
                    className={`px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg flex items-center gap-2 active:scale-95 ${isLoading || value.length < 10
                        ? 'bg-slate-300 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
                        }`}
                    disabled={isLoading || value.length < 10}
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
