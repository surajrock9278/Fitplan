import React, { useEffect, useState } from 'react';
import { AdminRecord, User } from '../types';
import { Calendar, Target, ChevronRight, PlusCircle, History } from 'lucide-react';

interface UserDashboardProps {
  user: User;
  onGenerateNew: () => void;
  onViewPlan: (record: AdminRecord) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, onGenerateNew, onViewPlan }) => {
  const [history, setHistory] = useState<AdminRecord[]>([]);

  useEffect(() => {
    const allRecords = JSON.parse(localStorage.getItem('fitplan_records') || '[]');
    const userRecords = allRecords.filter((r: AdminRecord) => r.userId === user.id);
    setHistory(userRecords);
  }, [user.id]);

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Hello, {user.name}!</h2>
          <p className="text-slate-400">Manage your fitness journey.</p>
        </div>
        <button
          onClick={onGenerateNew}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-500/20"
        >
          <PlusCircle size={18} /> New Plan
        </button>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
            <History className="text-blue-400" size={20}/> Your Plan History
        </h3>
        
        {history.length === 0 ? (
          <div className="bg-slate-800 rounded-2xl p-8 text-center border border-slate-700">
            <div className="bg-slate-700/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-slate-400" size={32} />
            </div>
            <h4 className="text-lg font-medium text-white mb-2">No Plans Yet</h4>
            <p className="text-slate-400 mb-6">Create your first AI-generated diet and workout plan today.</p>
            <button
              onClick={onGenerateNew}
              className="text-blue-400 hover:text-blue-300 font-medium underline"
            >
              Start Now
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {history.map((record) => (
              <div
                key={record.id}
                onClick={() => onViewPlan(record)}
                className="bg-slate-800 p-5 rounded-xl border border-slate-700 hover:border-blue-500/50 cursor-pointer transition-all group hover:bg-slate-750"
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                         <span className="bg-blue-900/50 text-blue-300 text-xs font-bold px-2 py-0.5 rounded border border-blue-500/20">
                            Week {record.plan.weekNumber}
                         </span>
                         <span className="text-slate-400 text-xs flex items-center gap-1">
                             <Calendar size={12}/> {new Date(record.timestamp).toLocaleDateString()}
                         </span>
                    </div>
                    <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      {record.user.goal} Protocol
                    </h4>
                    <p className="text-slate-400 text-sm line-clamp-1">{record.planSummary}</p>
                  </div>
                  <ChevronRight className="text-slate-600 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;