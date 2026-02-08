import React from 'react';

const SkeletonCard = () => (
    <div className="bg-white rounded-3xl p-6 border-l-4 border-slate-100 shadow-sm animate-pulse flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-slate-100 rounded-xl"></div>
            <div className="h-6 w-20 bg-slate-100 rounded-full"></div>
        </div>
        <div className="h-6 w-3/4 bg-slate-200 rounded mb-4"></div>
        <div className="space-y-3 flex-1">
            <div className="h-3 w-full bg-slate-100 rounded"></div>
            <div className="h-3 w-full bg-slate-100 rounded"></div>
            <div className="h-3 w-4/5 bg-slate-100 rounded"></div>
        </div>
        <div className="mt-6 pt-6 border-t border-slate-50">
            <div className="h-2 w-16 bg-slate-100 rounded mb-3"></div>
            <div className="space-y-2">
                <div className="h-2 w-full bg-slate-50 rounded"></div>
                <div className="h-2 w-full bg-slate-50 rounded"></div>
            </div>
        </div>
    </div>
);

export default SkeletonCard;
