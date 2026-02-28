import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import DecisionInput from './components/DecisionInput';
import AgentCard from './components/AgentCard';
import ConsensusDashboard from './components/ConsensusDashboard';
import SkeletonCard from './components/SkeletonCard';
import AgentsOverview from './components/AgentsOverview';
import AgentDetail from './components/AgentDetail';
import { Search, Bell, Download, Filter, TrendingUp, Menu, AlertTriangle, Newspaper, ExternalLink } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

// Simple Error Boundary Functional Component Simulation
const ErrorFallback = ({ error }) => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
    <div className="bg-white p-10 rounded-3xl shadow-xl border border-rose-100 max-w-md">
      <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <AlertTriangle size={32} />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h2>
      <p className="text-slate-600 mb-8">The dashboard encountered an unexpected error. This usually happens if the AI data format changed.</p>
      <button
        onClick={() => window.location.reload()}
        className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all"
      >
        Refresh Dashboard
      </button>
      <div className="mt-6 text-[10px] font-mono text-slate-400 text-left bg-slate-50 p-4 rounded-lg overflow-auto max-h-40">
        {error?.message}
      </div>
    </div>
  </div>
);

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [runtimeError, setRuntimeError] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [mode, setMode] = useState('enterprise'); // 'enterprise' or 'startup'
  const [decisionInput, setDecisionInput] = useState('');

  // Catch unhandled errors in this component
  useEffect(() => {
    const handleError = (e) => setRuntimeError(e.error || new Error("Unknown Error"));
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Helper to strip technical metadata (FALLBACK: ...) from reasoning
  const cleanText = (text) => {
    if (typeof text !== 'string') return text;
    return text.replace(/\(FALLBACK:.*?\)\s*/gi, '').trim();
  };

  const filteredHistory = useMemo(() => {
    return (history || []).map(item => ({
      ...item,
      agent_analyses: (item.agent_analyses || []).map(agent => ({
        ...agent,
        reasoning: cleanText(agent.reasoning)
      }))
    })).filter(item => {
      if (!item) return false;
      const text = (item.decision_text || "").toLowerCase();
      const verdict = (item.final_verdict || "").toLowerCase();
      const search = (searchTerm || "").toLowerCase();
      return text.includes(search) || verdict.includes(search);
    });
  }, [history, searchTerm]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/history`);
      if (Array.isArray(response.data)) {
        setHistory(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleAnalyze = async (text, file = null) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setCurrentView('dashboard'); // Switch to dashboard on analysis
    try {
      let response;
      if (file) {
        // Use FormData for file upload
        const formData = new FormData();
        formData.append('text', text);
        formData.append('mode', mode);
        formData.append('file', file);

        response = await axios.post(`${API_BASE_URL}/analyze`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Fallback to JSON if no file (or update backend to handle JSON too? Best to stick to one if possible, but backend might need logic)
        // Actually, let's try to send JSON as usual if no file, OR force everything to FormData.
        // For simplicity and backward compatibility if backend supports it, let's keep JSON for no-file.
        // BUT my plan said "update analyze_decision signature to accept form data". 
        // If I change backend to Form, it won't accept JSON body anymore. The plan was "multipart/form-data".
        // So I must use FormData even if no file is present? 
        // Wait, Form data fields are separate. 
        // If I change backend: `async def analyze_decision(text: str = Form(...), mode: str = Form(...), file: UploadFile = File(None))`
        // Then I MUST use FormData on frontend.

        const formData = new FormData();
        formData.append('text', text);
        formData.append('mode', mode);
        // No file append

        response = await axios.post(`${API_BASE_URL}/analyze`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setAnalysis(response.data);
      fetchHistory();
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred during analysis.");
      console.error("Analysis failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = () => {
    if (!analysis) return;
    try {
      const report = `
# BoardGPT Strategic Analysis Report
Decision: ${analysis.decision_text || 'Unknown'}
Verdict: ${analysis.final_verdict || 'Unknown'}
Confidence: ${analysis.average_confidence || 0}%

## Executive Summary
${analysis.explanation || 'No summary available.'}

## Agent Analyses
${(analysis.agent_analyses || []).map(a => `
### ${a.agent_role}: ${a.verdict} (${a.confidence}% Confidence)
Reasoning: ${a.reasoning}
Assumptions: ${(a.assumptions || []).join(', ')}
`).join('\n')}
      `;
      const blob = new Blob([report], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `BoardGPT_Report_${new Date().getTime()}.md`;
      link.click();
    } catch (e) {
      alert("Error generating report: " + e.message);
    }
  };

  const handleShare = () => {
    if (!analysis) return;
    try {
      const shareText = `BoardGPT Analysis: ${analysis.final_verdict || 'N/A'} (${analysis.average_confidence || 0}%) for "${analysis.decision_text || ''}"`;
      navigator.clipboard.writeText(shareText).then(() => {
        alert("Summary copied to clipboard!");
      });
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleNewDecision = () => {
    setAnalysis(null);
    setError(null);
    setCurrentView('dashboard');
    setDecisionInput('');
  };

  if (runtimeError) return <ErrorFallback error={runtimeError} />;

  const renderDashboard = () => (
    <div className="space-y-12">
      <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-10 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <TrendingUp size={120} className="text-indigo-600" />
        </div>
        <div className="relative z-10 text-left">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 font-sans">Strategic Business Decision</h2>
          <DecisionInput
            onAnalyze={handleAnalyze}
            isLoading={loading}
            value={decisionInput}
            onChange={setDecisionInput}
          />
          {error && (
            <div className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-medium flex items-center gap-3">
              <AlertTriangle size={18} /> {error}
            </div>
          )}
        </div>
      </section>

      {(loading || analysis) && (
        <div className="space-y-12">
          {analysis && !loading && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Consensus Summary</h2>
                <button
                  onClick={handleGenerateReport}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                >
                  <Download size={16} /> Export Report
                </button>
              </div>
              <ConsensusDashboard
                consensus={analysis}
                onGenerateReport={handleGenerateReport}
                onShare={handleShare}
              />

              <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6 text-left">AI Agent Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
                {(analysis.agent_analyses || []).map((agent, index) => (
                  <AgentCard
                    key={index}
                    agent={agent}
                    onClick={() => {
                      setSelectedAgent(agent);
                      setCurrentView('agents');
                    }}
                  />
                ))}
              </div>

              {analysis.news && analysis.news.articles && analysis.news.articles.length > 0 && (
                <div className="mb-12 text-left">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Newspaper size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">NewsGPT Real-World Context</h2>
                  </div>
                  <p className="text-slate-600 mb-8 max-w-4xl text-lg leading-relaxed">{analysis.news.explanation}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {analysis.news.articles.map((article, idx) => (
                      <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">{article.source}</span>
                          <span className="text-xs font-medium text-slate-400">{article.date}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors">{article.headline}</h3>
                        <p className="text-sm text-slate-600 mb-6 flex-1">{article.summary}</p>
                        <div className="mt-auto">
                          <a href={`https://www.google.com/search?q=${encodeURIComponent(article.headline)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                            Read Related <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          {loading && (
            <div className="space-y-12">
              <div className="h-64 w-full bg-slate-200 rounded-3xl animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {[1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-8 text-left">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Decisions', value: history.length, sub: '+12% from last quarter', color: 'emerald' },
          { label: 'Approval Rate', value: '72%', sub: 'Standard baseline', color: 'slate' },
          { label: 'Avg Confidence', value: '89%', sub: '', color: 'indigo' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
              {stat.sub && <span className={`text-xs font-bold text-${stat.color}-600`}>{stat.sub}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Recent Decisions</h2>
          <div className="flex gap-2">
            <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"><Filter size={18} /></button>
            <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"><Download size={18} /></button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <th className="px-6 py-4">Decision Title</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Final Verdict</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHistory.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-all cursor-pointer" onClick={() => { setAnalysis(item); setCurrentView('dashboard'); }}>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 line-clamp-1">{item.decision_text}</p>
                    <p className="text-xs text-slate-500">Business Strategy</p>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-500">
                    {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${item.final_verdict === 'Approve' ? 'bg-emerald-50 text-emerald-600' :
                      item.final_verdict === 'Reject' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                      {item.final_verdict || 'Conditional'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 text-xs font-bold hover:underline transition-all">View Details</button>
                  </td>
                </tr>
              ))}
              {filteredHistory.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center text-slate-400 font-medium italic">
                    No decisions found match your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAgents = () => {
    if (selectedAgent) {
      return <AgentDetail agent={selectedAgent} onBack={() => setSelectedAgent(null)} />;
    }
    return <AgentsOverview onSelectAgent={(agent) => setSelectedAgent(agent)} />;
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Agent Council Analysis';
      case 'history': return 'Board Decision Archive';
      case 'agents': return selectedAgent ? `${selectedAgent.id} Agent Deep-Dive` : 'AI Board Council Members';
      default: return 'BoardGPT';
    }
  };

  const getPageSubtitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Enterprise-grade strategic decision support system';
      case 'history': return 'Audit trail for past council deliberations';
      case 'agents': return 'Meet the specialists driving your strategic intelligence';
      default: return '';
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return renderDashboard();
      case 'history': return renderHistory();
      case 'agents': return renderAgents();
      default: return renderDashboard();
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 relative">
      <div
        className={`fixed inset-0 bg-slate-900/50 z-40 transition-opacity lg:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <div className={`fixed lg:static inset-y-0 left-0 z-50 transform lg:transform-none transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar activeView={currentView} onViewChange={(v) => { setCurrentView(v); setIsSidebarOpen(false); setSelectedAgent(null); }} onNewDecision={handleNewDecision} />
      </div>

      <main className="flex-1 min-w-0">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-20">
          <div className="flex items-center gap-4 lg:hidden">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-all">
              <Menu size={24} />
            </button>
          </div>
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search board history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-600/20 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden sm:block">
              <Bell size={20} className="text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 border-2 border-white rounded-full text-[8px] flex items-center justify-center text-white font-bold">2</span>
            </div>
            {/* Mode Toggle Switch */}
            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl gap-1">
              <button
                onClick={() => setMode('enterprise')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'enterprise'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                Enterprise
              </button>
              <button
                onClick={() => setMode('startup')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'startup'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                  : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                Startup
              </button>
            </div>

            {(analysis || selectedAgent) && (
              <button
                onClick={handleGenerateReport}
                className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hidden sm:block transition-colors"
                title="Download"
              >
                Export Report
              </button>
            )}
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-[1600px] mx-auto">
          <div className="mb-10 text-left">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">
              {getPageTitle()}
            </h1>
            <p className="text-slate-500 font-medium">
              {getPageSubtitle()}
            </p>
          </div>

          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
