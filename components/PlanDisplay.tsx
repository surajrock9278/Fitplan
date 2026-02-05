import React, { useState } from 'react';
import { FitnessPlan, UserProfile } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Dumbbell, Utensils, Moon, Droplets, Trophy, CheckCircle2, Repeat, Flame, Wallet, ArrowRight, RefreshCw, Clock } from 'lucide-react';

interface PlanDisplayProps {
  plan: FitnessPlan;
  userProfile: UserProfile;
  onReset: () => void;
  onNextWeek: () => void;
  isGeneratingNextWeek: boolean;
}

const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, userProfile, onReset, onNextWeek, isGeneratingNextWeek }) => {
  const [activeTab, setActiveTab] = useState<'diet' | 'workout' | 'recovery'>('diet');

  const macroData = [
    { name: 'Protein', value: plan.macros.protein, color: '#3b82f6' }, // Blue
    { name: 'Carbs', value: plan.macros.carbs, color: '#10b981' }, // Emerald
    { name: 'Fats', value: plan.macros.fats, color: '#f59e0b' }, // Amber
  ];

  return (
    <div className="w-full max-w-6xl mx-auto pb-20">
      {/* Header Stats */}
      <div className="bg-slate-800 rounded-2xl p-6 mb-8 border border-slate-700 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Dumbbell size={150} />
        </div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">Week {plan.weekNumber}</span>
                    <h1 className="text-3xl font-bold text-white capitalize">{userProfile.name}'s Fitplan <span className="text-blue-500">Premium</span></h1>
                </div>
                <p className="text-slate-400 max-w-2xl">{plan.stats.goalDescription}</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
                <div className="text-center px-4 py-3 bg-slate-900 rounded-xl border border-slate-700">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Calories</p>
                    <p className="text-xl font-bold text-white">{plan.stats.targetCalories}</p>
                </div>
                <div className="text-center px-4 py-3 bg-slate-900 rounded-xl border border-slate-700">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Monthly Cost</p>
                    <p className="text-lg font-semibold text-emerald-400">{plan.stats.estimatedMonthlyCost}</p>
                </div>
                
                <div className="flex flex-col gap-2">
                    <button 
                        onClick={onNextWeek} 
                        disabled={isGeneratingNextWeek}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-sm transition-all shadow-lg ${isGeneratingNextWeek ? 'bg-slate-600 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white'}`}
                    >
                       {isGeneratingNextWeek ? <RefreshCw className="animate-spin w-4 h-4"/> : <ArrowRight className="w-4 h-4"/>}
                       {isGeneratingNextWeek ? 'Generating...' : `Get Week ${plan.weekNumber + 1} Plan`}
                    </button>
                    <button onClick={onReset} className="text-xs text-slate-400 hover:text-white underline text-center">
                        Edit Profile / Reset
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar - Macros */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500"/> Daily Macros
                </h3>
                <div className="h-48 w-full relative">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                        <Pie
                            data={macroData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={60}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {macroData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                         <Tooltip 
                            contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}}
                            itemStyle={{color: '#fff'}}
                         />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-xs font-bold text-slate-500">KCAL</span>
                    </div>
                </div>
                <div className="space-y-3 mt-2">
                    <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Protein</div>
                        <span className="font-bold text-white">{plan.macros.protein}g</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Carbs</div>
                        <span className="font-bold text-white">{plan.macros.carbs}g</span>
                    </div>
                     <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div> Fats</div>
                        <span className="font-bold text-white">{plan.macros.fats}g</span>
                    </div>
                </div>
            </div>

             <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-blue-400"/> Hydration
                </h3>
                <p className="text-blue-100">{plan.hydration}</p>
             </div>

             <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400"/> Supplements
                </h3>
                <ul className="space-y-3">
                    {plan.supplements.length > 0 ? plan.supplements.map((supp, i) => (
                        <li key={i} className="text-sm">
                            <span className="block font-semibold text-white">{supp.name}</span>
                            <span className="text-slate-400">{supp.timing}</span>
                        </li>
                    )) : (
                        <li className="text-sm text-slate-400 italic">No supplements recommended for this plan.</li>
                    )}
                </ul>
             </div>
        </div>

        {/* Right Content - Tabs */}
        <div className="lg:col-span-3">
            <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
                {[
                    { id: 'diet', label: 'Daily Diet', icon: Utensils },
                    { id: 'workout', label: 'Workout Split', icon: Dumbbell },
                    { id: 'recovery', label: 'Recovery & Lifestyle', icon: Moon },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                            activeTab === tab.id 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* DIET TAB */}
            {activeTab === 'diet' && (
                <div className="space-y-4">
                    <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-xl mb-4 flex items-start gap-3">
                        <Wallet className="text-emerald-400 w-5 h-5 mt-1 shrink-0" />
                        <div>
                             <h4 className="text-emerald-400 font-bold text-sm">Estimated Monthly Budget</h4>
                             <p className="text-slate-300 text-sm">
                                Based on Nepali market rates: <span className="font-semibold text-white">{plan.stats.estimatedMonthlyCost}</span>
                             </p>
                        </div>
                    </div>

                    {plan.dietPlan.map((meal, idx) => (
                        <div key={idx} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{meal.timing}</span>
                                    <h3 className="text-xl font-bold text-white mt-1">{meal.name}</h3>
                                </div>
                            </div>
                            
                            <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
                                <ul className="space-y-2">
                                    {meal.items.map((item, i) => (
                                        <li key={i} className="flex justify-between items-center text-slate-200">
                                            <span>{item.name}</span>
                                            <span className="font-mono text-blue-300 bg-blue-900/30 px-2 py-1 rounded">{item.quantity}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                             {meal.alternatives.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-slate-700">
                                    <strong className="text-blue-300 flex items-center gap-2 mb-3 text-sm">
                                        <Repeat size={14} /> You can swap this meal with:
                                    </strong>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {meal.alternatives.map((alt, i) => (
                                            <div key={i} className="bg-slate-700/30 p-3 rounded-lg border border-slate-600/50 hover:bg-slate-700/50 transition-colors">
                                                 <span className="text-slate-300 text-sm block">Option {i + 1}</span>
                                                 <p className="text-white text-sm font-medium">{alt}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* WORKOUT TAB */}
            {activeTab === 'workout' && (
                <div className="space-y-4">
                    {plan.workoutSplit.map((day, idx) => (
                        <div key={idx} className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
                            <div className="bg-slate-700/50 px-6 py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{day.day}: {day.focus}</h3>
                                    <p className="text-sm text-blue-300">Warmup: {day.warmup}</p>
                                </div>
                                {(day.cardio || day.abs) && (
                                    <div className="flex gap-2 text-xs font-bold">
                                        {day.cardio && <span className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full">Cardio</span>}
                                        {day.abs && <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">Abs</span>}
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-0">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-900/50 text-slate-400 font-medium">
                                        <tr>
                                            <th className="px-6 py-3">Exercise</th>
                                            <th className="px-6 py-3">Sets x Reps</th>
                                            <th className="px-6 py-3 hidden sm:table-cell">Rest</th>
                                            <th className="px-6 py-3 hidden md:table-cell">Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700">
                                        {day.exercises.map((ex, i) => (
                                            <tr key={i} className="hover:bg-slate-700/30 transition-colors">
                                                <td className="px-6 py-4 font-medium text-white">{ex.name}</td>
                                                <td className="px-6 py-4 text-blue-300 font-mono">{ex.sets} x {ex.reps}</td>
                                                <td className="px-6 py-4 text-slate-400 hidden sm:table-cell">
                                                    <div className="flex items-center gap-1">
                                                        <Clock size={14} /> {ex.rest}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-400 italic hidden md:table-cell">{ex.notes}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {(day.cardio || day.abs) && (
                                <div className="p-6 bg-slate-900/30 border-t border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                                     {day.cardio && (
                                        <div>
                                            <h4 className="text-red-400 font-bold text-xs uppercase tracking-wider mb-1">Cardio Session</h4>
                                            <p className="text-slate-300 text-sm">{day.cardio}</p>
                                        </div>
                                     )}
                                     {day.abs && (
                                        <div>
                                            <h4 className="text-purple-400 font-bold text-xs uppercase tracking-wider mb-1">Core Finisher</h4>
                                            <p className="text-slate-300 text-sm">{day.abs}</p>
                                        </div>
                                     )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* RECOVERY TAB */}
            {activeTab === 'recovery' && (
                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                             <Moon className="w-6 h-6 text-indigo-400"/> Sleep Hygiene
                        </h3>
                        <p className="text-slate-300 leading-relaxed whitespace-pre-line">{plan.recovery.sleep}</p>
                    </div>

                     <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                             <CheckCircle2 className="w-6 h-6 text-emerald-400"/> Progress Tracking
                        </h3>
                        <p className="text-slate-300 leading-relaxed whitespace-pre-line">{plan.recovery.progressTracking}</p>
                    </div>

                     <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                             <Activity className="w-6 h-6 text-rose-400"/> Stress Management
                        </h3>
                         <p className="text-slate-300 leading-relaxed whitespace-pre-line">{plan.recovery.stress}</p>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

// Simple Icon component wrapper for lucide-react used in tabs
const Activity: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
)

export default PlanDisplay;