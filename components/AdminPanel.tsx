import React, { useEffect, useState } from 'react';
import { AdminRecord } from '../types';
import { Shield, Trash2, Calendar, User, Target, Wallet } from 'lucide-react';

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [records, setRecords] = useState<AdminRecord[]>([]);

  useEffect(() => {
    const storedRecords = localStorage.getItem('fitplan_records');
    if (storedRecords) {
      setRecords(JSON.parse(storedRecords));
    }
  }, []);

  const handleClearRecords = () => {
    if (window.confirm('Are you sure you want to delete all records?')) {
      localStorage.removeItem('fitplan_records');
      setRecords([]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Shield className="text-blue-500 w-8 h-8" /> Admin Dashboard
          </h2>
          <p className="text-slate-400 mt-1">View all generated plan records.</p>
        </div>
        <div className="flex gap-4">
             <button 
                onClick={handleClearRecords}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/50 flex items-center gap-2 transition-colors"
            >
                <Trash2 size={16} /> Clear Records
            </button>
            <button 
                onClick={onBack}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
                Back to App
            </button>
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">User Name</th>
                <th className="px-6 py-4">Goal</th>
                 <th className="px-6 py-4">Stats</th>
                <th className="px-6 py-4">Budget</th>
                <th className="px-6 py-4">Plan Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {records.length > 0 ? (
                records.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 text-slate-300 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-slate-500"/>
                            {new Date(record.timestamp).toLocaleDateString()}
                        </div>
                         <div className="text-xs text-slate-500 pl-6">
                            {new Date(record.timestamp).toLocaleTimeString()}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-white font-medium">
                            <User size={16} className="text-blue-400"/>
                            {record.user.name}
                        </div>
                        <div className="text-xs text-slate-500 pl-6">
                            {record.user.gender}, {record.user.age}y
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-emerald-400">
                            <Target size={16}/>
                            {record.user.goal}
                        </div>
                    </td>
                     <td className="px-6 py-4 text-slate-300">
                        {record.user.weight}kg / {record.user.height}cm
                    </td>
                     <td className="px-6 py-4">
                         <div className="flex items-center gap-1 text-slate-300">
                             <Wallet size={14} className="text-yellow-500"/>
                             {record.user.budget}
                         </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 max-w-xs truncate" title={record.planSummary}>
                      {record.planSummary}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 italic">
                    No records found. Generate a plan to see it here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;