import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { Activity, User, Target, Clock, MapPin, Utensils, Calendar, Dumbbell, Pill, Wallet } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: UserProfile) => void;
  isGenerating: boolean;
  initialName?: string;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isGenerating, initialName = '' }) => {
  const [formData, setFormData] = useState<UserProfile>({
    name: initialName,
    gender: 'Male',
    age: 25,
    height: 175,
    weight: 75,
    bodyFat: 18,
    fitnessLevel: 'Intermediate',
    goal: 'Fat Loss',
    location: 'Gym',
    timeAvailable: 60,
    dietaryPreference: 'Non-Veg',
    allergies: '',
    gymDays: 5,
    includeSupplements: 'Yes',
    preferredSplit: 'AI Recommended',
    budget: 'Medium',
  });

  useEffect(() => {
    if (initialName) {
        setFormData(prev => ({...prev, name: initialName}));
    }
  }, [initialName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'height' || name === 'weight' || name === 'bodyFat' || name === 'timeAvailable' || name === 'gymDays'
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
      <div className="bg-blue-600 p-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Activity className="w-6 h-6" />
          Generate New Plan
        </h2>
        <p className="text-blue-100 mt-2">Enter your stats to generate your AI-powered premium plan.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Personal Stats */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
            <User className="w-5 h-5" /> Biometrics
          </h3>
          
          <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
              <input type="text" name="name" required value={formData.name} placeholder="Suraj Sharma" onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Height (cm)</label>
              <input type="number" name="height" value={formData.height} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Weight (kg)</label>
              <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-300 mb-1">Body Fat % (Estimate)</label>
             <input type="number" name="bodyFat" value={formData.bodyFat} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>

        {/* Goals & Preferences */}
        <div className="space-y-6">
           <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
            <Target className="w-5 h-5" /> Goals & Training
          </h3>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Main Goal</label>
            <select name="goal" value={formData.goal} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="Fat Loss">Fat Loss</option>
              <option value="Lean Muscle">Lean Muscle</option>
              <option value="Bulk">Bulk</option>
              <option value="Recomposition">Body Recomposition</option>
              <option value="Six-Pack Abs">Six-Pack Abs Focus</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Fitness Level</label>
              <select name="fitnessLevel" value={formData.fitnessLevel} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-1"><MapPin size={14}/> Location</label>
              <select name="location" value={formData.location} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="Gym">Gym</option>
                <option value="Home">Home</option>
              </select>
            </div>
          </div>

           <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-1"><Clock size={14}/> Daily Time (min)</label>
              <input type="number" name="timeAvailable" value={formData.timeAvailable} min={30} max={120} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-1"><Utensils size={14}/> Diet Type</label>
              <select name="dietaryPreference" value={formData.dietaryPreference} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="Non-Veg">Non-Veg</option>
                <option value="Veg">Veg</option>
                <option value="Eggetarian">Eggetarian</option>
                <option value="Vegan">Vegan</option>
              </select>
            </div>
          </div>
          
           <div>
             <label className="block text-sm font-medium text-slate-300 mb-1">Allergies (Optional)</label>
             <input type="text" name="allergies" value={formData.allergies} placeholder="e.g. Peanuts, Lactose" onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>

        {/* Training Frequency & Style */}
         <div className="md:col-span-2 space-y-6 pt-2 border-t border-slate-700">
           <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
            <Dumbbell className="w-5 h-5" /> Training & Budget
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
               <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-1"><Calendar size={14}/> Training Days / Week</label>
               <select name="gymDays" value={formData.gymDays} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none">
                 {[3, 4, 5, 6, 7].map(num => (
                   <option key={num} value={num}>{num} Days</option>
                 ))}
               </select>
            </div>

             <div>
               <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-1"><Activity size={14}/> Preferred Split</label>
               <select name="preferredSplit" value={formData.preferredSplit} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none">
                 <option value="AI Recommended">AI Recommended</option>
                 <option value="Full Body">Full Body</option>
                 <option value="Upper/Lower">Upper / Lower</option>
                 <option value="Push/Pull/Legs">Push / Pull / Legs</option>
                 <option value="Bro Split">Bro Split (Body Part)</option>
               </select>
            </div>

            <div>
               <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-1"><Pill size={14}/> Include Supplements</label>
               <select name="includeSupplements" value={formData.includeSupplements} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none">
                 <option value="Yes">Yes, include them</option>
                 <option value="No">No, whole foods only</option>
               </select>
            </div>

             <div>
               <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-1"><Wallet size={14}/> Diet Budget</label>
               <select name="budget" value={formData.budget} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none">
                 <option value="Low">Low (Budget Friendly)</option>
                 <option value="Medium">Medium (Balanced)</option>
                 <option value="High">High (Premium)</option>
               </select>
            </div>
          </div>
         </div>

        <div className="md:col-span-2 mt-4">
          <button 
            type="submit" 
            disabled={isGenerating}
            className={`w-full py-4 px-6 rounded-xl text-lg font-bold text-white transition-all transform hover:scale-[1.02] ${
              isGenerating 
              ? 'bg-slate-600 cursor-not-allowed opacity-75' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/30'
            }`}
          >
            {isGenerating ? 'Analyzing & Generating Plan...' : 'Generate My Premium Plan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;