import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, FitnessPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fitnessPlanSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    weekNumber: { type: Type.INTEGER, description: "The week number of this plan (e.g., 1, 2, 3)" },
    stats: {
      type: Type.OBJECT,
      properties: {
        bmr: { type: Type.NUMBER, description: "Basal Metabolic Rate" },
        tdee: { type: Type.NUMBER, description: "Total Daily Energy Expenditure" },
        targetCalories: { type: Type.NUMBER, description: "Daily caloric intake goal" },
        goalDescription: { type: Type.STRING, description: "Short summary of the strategy (e.g., 'Caloric deficit of 500 kcal')" },
        estimatedMonthlyCost: { type: Type.STRING, description: "Estimated monthly cost for the diet plan in NPR (Nepalese Rupees)" },
      },
      required: ["bmr", "tdee", "targetCalories", "goalDescription", "estimatedMonthlyCost"],
    },
    macros: {
      type: Type.OBJECT,
      properties: {
        protein: { type: Type.NUMBER, description: "Grams of protein" },
        carbs: { type: Type.NUMBER, description: "Grams of carbohydrates" },
        fats: { type: Type.NUMBER, description: "Grams of fats" },
      },
      required: ["protein", "carbs", "fats"],
    },
    hydration: { type: Type.STRING, description: "Daily water intake recommendation" },
    supplements: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          timing: { type: Type.STRING },
        },
        required: ["name", "timing"],
      },
    },
    dietPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          timing: { type: Type.STRING, description: "e.g., Breakfast, Pre-workout" },
          name: { type: Type.STRING, description: "Name of the meal" },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                quantity: { type: Type.STRING },
              },
              required: ["name", "quantity"],
            },
          },
          alternatives: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Exactly 2 distinct alternative meal options. Each string should describe the full alternative meal." },
        },
        required: ["timing", "name", "items", "alternatives"],
      },
    },
    workoutSplit: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.STRING, description: "Day of the week (Sunday, Monday, etc.)" },
          focus: { type: Type.STRING, description: "e.g., Push, Pull, Legs" },
          warmup: { type: Type.STRING, description: "5-10 min warmup routine" },
          exercises: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                sets: { type: Type.STRING },
                reps: { type: Type.STRING },
                rest: { type: Type.STRING },
                notes: { type: Type.STRING, description: "Form cue or tempo" },
              },
              required: ["name", "sets", "reps", "rest", "notes"],
            },
          },
          cardio: { type: Type.STRING, nullable: true },
          abs: { type: Type.STRING, nullable: true },
        },
        required: ["day", "focus", "warmup", "exercises"],
      },
    },
    recovery: {
      type: Type.OBJECT,
      properties: {
        sleep: { type: Type.STRING },
        stress: { type: Type.STRING },
        progressTracking: { type: Type.STRING },
      },
      required: ["sleep", "stress", "progressTracking"],
    },
  },
  required: ["weekNumber", "stats", "macros", "dietPlan", "workoutSplit", "recovery", "hydration", "supplements"],
};

export const generatePlan = async (user: UserProfile, weekNumber: number = 1): Promise<FitnessPlan> => {
  const prompt = `
    Act as an elite sports nutritionist and strength coach. Create a premium, highly personalized daily diet and workout plan for:
    
    PROFILE:
    - Name: ${user.name}
    - Gender: ${user.gender}
    - Age: ${user.age}
    - Height: ${user.height} cm
    - Weight: ${user.weight} kg
    - Body Fat: ${user.bodyFat}%
    - Fitness Level: ${user.fitnessLevel}
    - Goal: ${user.goal}
    - Location: ${user.location}
    - Time Available: ${user.timeAvailable} minutes
    - Diet Preference: ${user.dietaryPreference}
    - Allergies/Notes: ${user.allergies || "None"}
    - Training Days Per Week: ${user.gymDays}
    - Preferred Workout Split: ${user.preferredSplit}
    - Include Supplements: ${user.includeSupplements}
    - Budget: ${user.budget}

    CURRENT PHASE:
    This plan is for **Week ${weekNumber}**.
    ${weekNumber > 1 ? "This is a progression from the previous week. Increase intensity, adjust volume, or modify exercises slightly to ensure progressive overload." : "This is the starting foundation week."}

    REQUIREMENTS:
    1. Calculate BMR (Mifflin-St Jeor) and TDEE accurately. Set specific calorie targets based on the goal (e.g., -500 for fat loss).
    2. Protein should be high (1.6g-2.2g per kg).
    3. **CRITICAL: NEPALI MARKET CONTEXT**: The diet plan must strictly use foods available in local Nepali markets.
    4. **BUDGET ADJUSTMENT**: 
       ${user.budget === 'Low' 
         ? "Since the budget is LOW, you MUST prioritize the most affordable protein sources: Soya Chunks (Nutrela), Lentils (Dal), Chickpeas (Chana), Eggs, and seasonal vegetables. Minimize expensive meats. Use rice/oats as primary carb sources." 
         : "Balance high-quality ingredients with standard staple foods."}
    5. **STRICT EXCLUSION**: Do NOT include 'Buff', 'Buffalo', or 'Buffalo Meat'. Use Chicken, Goat (Mutton), Fish, or Eggs instead for non-veg.
    6. **ALTERNATIVES**: For every meal, provide exactly 2 distinct alternative options.
    7. **WORKOUT SCHEDULE**: 
       - Start on Sunday.
       - Day 1 = Sunday, Day 2 = Monday, etc.
    8. **WORKOUT VOLUME & DURATION**: 
       - You MUST scale the number of exercises based on the 'Time Available' (${user.timeAvailable} minutes).
       - **30-45 mins**: Provide 3-4 composite/heavy compound exercises. Focus on intensity.
       - **45-75 mins**: Provide 5-6 exercises. Balanced compound and isolation.
       - **75+ mins**: Provide 7-9 exercises. High volume including accessories and isolation work.
    9. Calculate and return an **Estimated Monthly Cost** for this specific diet plan in Nepalese Rupees (NPR).
    
    Ensure the tone is motivating, professional, and results-oriented.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: fitnessPlanSchema,
      },
    });

    if (!response.text) {
      throw new Error("No response generated");
    }

    return JSON.parse(response.text) as FitnessPlan;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};