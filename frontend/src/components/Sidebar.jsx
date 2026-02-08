import React from 'react';
import {
    LayoutDashboard,
    History,
    Users,
    FileText,
    Settings,
    PlusCircle,
    TrendingUp,
    LogOut
} from 'lucide-react';

const Sidebar = ({ activeView, onViewChange, onNewDecision }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'history', label: 'Decision History', icon: History },
        { id: 'agents', label: 'Agents', icon: Users },
        { id: 'reports', label: 'Reports', icon: FileText },
    ];

    return (
        <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0 border-r border-slate-800">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-xl italic">B</div>
                    <div>
                        <h1 className="text-lg font-bold leading-none">BoardGPT</h1>
                        <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-1">Enterprise AI</p>
                    </div>
                </div>

                <button
                    onClick={onNewDecision}
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center gap-2 text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20 mb-8"
                >
                    <PlusCircle size={18} />
                    New Decision
                </button>

                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onViewChange(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? 'bg-indigo-600/10 text-indigo-400'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? 'text-indigo-500' : 'text-slate-400'} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto p-6 space-y-6">
                <div className="pt-6 border-t border-slate-800">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                        <Settings size={20} />
                        Settings
                    </button>
                </div>

                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">Alex Rivera</p>
                        <p className="text-[10px] text-slate-500 font-medium truncate uppercase">Board Member</p>
                    </div>
                    <LogOut size={16} className="text-slate-500 cursor-pointer hover:text-white" />
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
