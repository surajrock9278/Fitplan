import React, { useState } from 'react';
import InputForm from './components/InputForm';
import PlanDisplay from './components/PlanDisplay';
import LoadingScreen from './components/LoadingScreen';
import AdminPanel from './components/AdminPanel';
import AuthScreen from './components/AuthScreen';
import UserDashboard from './components/UserDashboard';
import { UserProfile, FitnessPlan, AdminRecord, User } from './types';
import { generatePlan } from './services/geminiService';
import { Dumbbell, Shield, LogOut, LayoutDashboard, X, Lock } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPlan, setCurrentPlan] = useState<FitnessPlan | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Views
  const [view, setView] = useState<'auth' | 'dashboard' | 'generator' | 'plan' | 'admin'>('auth');
  
  // Admin Login Modal State
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  const saveToHistory = (user: UserProfile, plan: FitnessPlan) => {
    const newRecord: AdminRecord = {
      id: Date.now().toString(),
      userId: currentUser?.id,
      timestamp: new Date().toISOString(),
      user: user,
      plan: plan,
      planSummary: plan.stats.goalDescription,
    };

    const existingRecords = JSON.parse(localStorage.getItem('fitplan_records') || '[]');
    const updatedRecords = [newRecord, ...existingRecords];
    localStorage.setItem('fitplan_records', JSON.stringify(updatedRecords));
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPlan(null);
    setUserProfile(null);
    setView('auth');
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'admin123') {
        setShowAdminLogin(false);
        setAdminPassword('');
        setAdminError('');
        setView('admin');
    } else {
        setAdminError('Incorrect Password');
    }
  };

  const handleFormSubmit = async (data: UserProfile) => {
    setIsLoading(true);
    setError(null);
    try {
      const plan = await generatePlan(data, 1); // Generate Week 1
      setCurrentPlan(plan);
      setUserProfile(data);
      saveToHistory(data, plan);
      setView('plan');
    } catch (err) {
      setError("Failed to generate plan. Please verify your internet connection and API Key, then try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextWeek = async () => {
    if (!userProfile || !currentPlan) return;

    setIsLoading(true);
    setError(null);
    try {
      const nextWeekNum = currentPlan.weekNumber + 1;
      const plan = await generatePlan(userProfile, nextWeekNum);
      setCurrentPlan(plan);
      saveToHistory(userProfile, plan);
    } catch (err) {
      setError("Failed to generate next week's plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewHistoryRecord = (record: AdminRecord) => {
    setCurrentPlan(record.plan);
    setUserProfile(record.user);
    setView('plan');
  };

  const renderContent = () => {
    if (view === 'auth') {
        return <AuthScreen onLogin={handleLogin} onAdminLogin={() => {
            // Deprecated standard login route for admin, now handled via footer
            setShowAdminLogin(true);
        }} />;
    }

    if (view === 'admin') {
        return <AdminPanel onBack={() => setView('auth')} />;
    }

    if (isLoading) {
        return <div className="max-w-4xl mx-auto"><LoadingScreen /></div>;
    }

    if (view === 'dashboard' && currentUser) {
        return (
            <UserDashboard 
                user={currentUser} 
                onGenerateNew={() => setView('generator')}
                onViewPlan={handleViewHistoryRecord}
            />
        );
    }

    if (view === 'generator') {
        return (
             <div className="animate-fade-in-up">
                <button 
                    onClick={() => setView('dashboard')}
                    className="mb-6 text-slate-400 hover:text-white flex items-center gap-2"
                >
                    &larr; Back to Dashboard
                </button>
                <InputForm 
                    onSubmit={handleFormSubmit} 
                    isGenerating={isLoading} 
                    initialName={currentUser?.name}
                />
            </div>
        );
    }

    if (view === 'plan' && currentPlan && userProfile) {
        return (
             <div className="animate-fade-in">
                <button 
                    onClick={() => setView('dashboard')}
                    className="mb-6 text-slate-400 hover:text-white flex items-center gap-2"
                >
                    &larr; Back to Dashboard
                </button>
                <PlanDisplay 
                    plan={currentPlan} 
                    userProfile={userProfile}
                    onReset={() => setView('generator')} 
                    onNextWeek={handleNextWeek}
                    isGeneratingNextWeek={isLoading}
                />
            </div>
        );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-blue-500 selection:text-white flex flex-col relative">
      
      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl w-full max-w-sm shadow-2xl animate-fade-in-up">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Shield className="text-blue-500" size={20}/> Admin Access
                    </h3>
                    <button onClick={() => setShowAdminLogin(false)} className="text-slate-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleAdminLoginSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-400 mb-1">Enter Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-slate-500" size={16} />
                            <input 
                                type="password" 
                                autoFocus
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                        {adminError && <p className="text-red-400 text-xs mt-2">{adminError}</p>}
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg transition-colors">
                        Unlock Panel
                    </button>
                </form>
            </div>
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="border-b border-slate-800 bg-slate-900/95 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => currentUser ? setView('dashboard') : setView('auth')}>
              <div className="bg-blue-600 p-2 rounded-lg">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Suraj Fitplan</span>
            </div>
            
            {currentUser && view !== 'admin' && (
                <div className="flex items-center gap-4">
                     <button 
                        onClick={() => setView('dashboard')}
                        className={`text-sm font-medium transition-colors flex items-center gap-1 ${view === 'dashboard' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        <LayoutDashboard size={16}/> Dashboard
                    </button>
                    <button 
                        onClick={handleLogout}
                        className="text-sm font-medium text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1"
                    >
                        <LogOut size={16}/> Logout
                    </button>
                </div>
            )}
             {view === 'admin' && (
                 <button 
                    onClick={() => setView('auth')}
                    className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                    Exit Admin
                </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex-grow w-full flex flex-col items-center">
        {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl mb-8 max-w-4xl mx-auto w-full">
                <strong>Error:</strong> {error}
            </div>
        )}

        {renderContent()}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Suraj Fitplan. All rights reserved.</p>
          
          {view === 'auth' && (
              <button 
                onClick={() => setShowAdminLogin(true)}
                className="text-xs flex items-center gap-1 mx-auto mt-4 text-slate-600 hover:text-slate-400 transition-colors"
            >
                <Shield size={12} /> Admin Access
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default App;