export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Stored in plain text for this demo (In real app, hash this)
}

export interface UserProfile {
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  height: number; // cm
  weight: number; // kg
  bodyFat: number; // percentage
  fitnessLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  goal: 'Fat Loss' | 'Lean Muscle' | 'Bulk' | 'Recomposition' | 'Six-Pack Abs';
  location: 'Gym' | 'Home';
  timeAvailable: number; // minutes
  dietaryPreference: 'Veg' | 'Non-Veg' | 'Eggetarian' | 'Vegan';
  allergies: string;
  gymDays: number;
  includeSupplements: 'Yes' | 'No';
  preferredSplit: 'AI Recommended' | 'Full Body' | 'Upper/Lower' | 'Push/Pull/Legs' | 'Bro Split';
  budget: 'Low' | 'Medium' | 'High';
}

export interface AdminRecord {
  id: string;
  userId?: string; // Link record to a specific user
  timestamp: string;
  user: UserProfile;
  plan: FitnessPlan; // Store full plan to allow re-opening
  planSummary: string;
}

export interface MacroNutrients {
  protein: number;
  carbs: number;
  fats: number;
}

export interface MealItem {
  name: string;
  quantity: string;
}

export interface Meal {
  timing: string;
  name: string;
  items: MealItem[];
  alternatives: string[];
}

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  notes: string;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  warmup: string;
  exercises: Exercise[];
  cardio: string | null;
  abs: string | null;
}

export interface FitnessPlan {
  weekNumber: number;
  stats: {
    bmr: number;
    tdee: number;
    targetCalories: number;
    goalDescription: string;
    estimatedMonthlyCost: string;
  };
  macros: MacroNutrients;
  hydration: string;
  supplements: Array<{ name: string; timing: string }>;
  dietPlan: Meal[];
  workoutSplit: WorkoutDay[];
  recovery: {
    sleep: string;
    stress: string;
    progressTracking: string;
  };
}