import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-slate-800/50 rounded-2xl border border-slate-700/50">
      <div className="relative w-24 h-24">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-600 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
      <h2 className="mt-8 text-2xl font-bold text-white">Crafting Your Plan</h2>
      <div className="mt-2 space-y-1 text-center">
         <p className="text-slate-400 text-sm animate-pulse">Analyzing metabolic rate...</p>
         <p className="text-slate-400 text-sm animate-pulse delay-75">Optimizing macro splits...</p>
         <p className="text-slate-400 text-sm animate-pulse delay-150">Designing hypertrophy vectors...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;