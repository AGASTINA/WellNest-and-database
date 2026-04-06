// Health Advice Knowledge Base - Intelligent fitness and health recommendations
// This knowledge base provides contextual advice based on symptoms, workout activity, and health metrics

export const symptomKeywords = {
  cramp: {
    keywords: ['cramp', 'cramping', 'cramps', 'muscle cramp'],
    advice: 'For muscle cramps, try these immediate solutions:\n1. **Stretch gently** - Extend the cramped muscle slowly\n2. **Walk** - Light movement helps relieve tension\n3. **Massage** - Gently rub the affected area\n4. **Stay hydrated** - Drink water immediately\n5. **Rest** - Stop intense activity and rest for 10-15 minutes\n\nPrevent future cramps by:\n- Warming up properly before exercise\n- Staying hydrated during workouts\n- Stretching after exercise\n- Eating foods rich in potassium (bananas, coconut water)',
    severity: 'low'
  },
  dizzy: {
    keywords: ['dizzy', 'dizziness', 'dizzy', 'lightheaded', 'lightheadedness', 'vertigo'],
    advice: 'Dizziness during/after exercise requires immediate attention:\n\n**Immediate Actions:**\n1. **Stop immediately** - Cease all activity\n2. **Sit down** - Find a safe place to sit\n3. **Hydrate** - Drink water or electrolyte drink\n4. **Breathe** - Take slow, deep breaths\n5. **Lie down if needed** - Elevate your legs above heart level\n\n**Check your metrics:**\n- Blood sugar (may indicate hypoglycemia)\n- Blood pressure (may indicate hypertension or hypotension)\n- Heart rate (should normalize within 5 minutes)\n\nIf dizziness persists > 15 minutes or worsens, **consult a doctor immediately**.',
    severity: 'high'
  },
  shortness_of_breath: {
    keywords: ['shortness of breath', 'breathless', 'gasping', 'can\'t breathe', 'breathing difficulty', 'winded'],
    advice: 'Shortness of breath during exercise is common but requires attention:\n\n**Immediate Response:**\n1. **Stop exercising** immediately\n2. **Sit down** and ensure good posture\n3. **Breathe slowly** - In for 4 seconds, hold for 4, out for 4\n4. **Cool down** - Move to a cooler environment if hot\n\n**Recovery Tips:**\n- Rest for 5-10 minutes\n- Monitor your heart rate\n- Hydrate gradually\n\n**Prevention:**\n- Warm up for 5-10 minutes before intense exercise\n- Increase intensity gradually\n- Don\'t exercise at maximum capacity without training\n- Stay aerobically fit (cardio 3-4x per week)\n\n**Seek medical advice if:**\n- Breathing doesn\'t normalize within 10 minutes\n- You experience chest pain\n- It happens even with light activity',
    severity: 'high'
  },
  pain: {
    keywords: ['pain', 'hurt', 'ache', 'sore', 'soreness', 'sharp pain', 'dull pain'],
    advice: 'If experiencing pain during or after exercise:\n\n**Immediate Care (RICE Protocol):**\n1. **Rest** - Stop the activity immediately\n2. **Ice** - Apply ice for 15-20 minutes (wrapped in cloth)\n3. **Compression** - Use an elastic bandage if swelling\n4. **Elevation** - Raise the injured area above heart level\n\n**Recovery Timeline:**\n- Mild soreness: Usually improves in 3-5 days with proper rest\n- Sharp pain: Indicates potential injury - rest for 7+ days\n\n**Next Steps:**\n- Avoid aggravating movements\n- Gentle stretching is beneficial after 48 hours\n- Consult a physical therapist for persistent pain\n- See a doctor if pain is severe or doesn\'t improve in 1 week',
    severity: 'medium'
  },
  fatigue: {
    keywords: ['fatigue', 'tired', 'exhausted', 'fatigued', 'no energy', 'very tired'],
    advice: 'Excessive fatigue may indicate overtraining or poor recovery:\n\n**Immediate Solutions:**\n1. **Rest immediately** - Stop your workout\n2. **Hydrate** - Drink water and electrolytes\n3. **Refuel** - Eat carbs + protein within 30 minutes\n4. **Cool down properly** - Spend 5-10 minutes cooling down\n\n**Recovery Optimization:**\n- Get 7-9 hours of quality sleep\n- Eat balanced meals (carbs, protein, fats)\n- Space intense workouts 48 hours apart\n- Include active recovery days (yoga, walking, stretching)\n\n**If Fatigue is Persistent:**\n- Check your blood sugar levels\n- Monitor sleep quality\n- Reduce workout intensity for 3-5 days\n- Consult a doctor if it lasts > 2 weeks',
    severity: 'medium'
  },
  nausea: {
    keywords: ['nausea', 'nauseous', 'queasy', 'sick', 'feeling sick'],
    advice: 'Nausea during exercise can be caused by several factors:\n\n**Immediate Actions:**\n1. **Stop exercising** - Rest in a cool, well-ventilated area\n2. **Focus on breathing** - Breathe slowly and deeply\n3. **Hydrate carefully** - Sip water slowly (not large amounts)\n4. **Don\'t eat immediately** - Wait 30-60 minutes\n\n**Common Causes & Prevention:**\n- **Dehydration** → Drink water before, during, after exercise\n- **Empty stomach** → Eat light meal 2-3 hours before\n- **Too much food before exercise** → Wait 3 hours after heavy meals\n- **High intensity too fast** → Warm up gradually\n- **Poor ventilation** → Exercise in well-ventilated areas\n\n**Recovery:**\n- Rest for 15-20 minutes\n- Once recovered, hydrate with electrolyte drink\n- Eat something bland (banana, toast) after 1 hour\n\n**Seek Medical Help if:**\n- Nausea persists for hours\n- Vomiting occurs\n- Accompanied by severe headache or chest pain',
    severity: 'medium'
  }
};

export const workoutRelatedAdvice = {
  'leg press': {
    keywords: ['leg press', 'leg-press'],
    muscleGroups: ['quadriceps', 'hamstrings', 'glutes', 'calves'],
    commonIssues: ['knee pain', 'lower back pain', 'quad soreness', 'cramps'],
    advice: 'Leg press exercise tips:\n\n**Proper Form:**\n- Feet shoulder-width apart\n- Lower until knees are ~90 degrees (don\'t lock at bottom)\n- Keep chest upright\n- Don\'t let knees go past toes\n\n**Recovery After High Reps:**\n- 3 sets of 15+ reps is intense - expect muscle soreness\n- Expect DOMS (Delayed Onset Muscle Soreness) for 24-48 hours\n- Light stretching helps recovery\n- Stay hydrated and eat protein for muscle recovery\n\n**If Experiencing Cramps:**\n- Stretch hamstrings and quads gently\n- Take a walk to ease tension\n- Stay hydrated\n- Rest for 24 hours before intense leg workout',
    sets: 3,
    reps: 15
  },
  'squats': {
    keywords: ['squat', 'squats'],
    muscleGroups: ['quadriceps', 'glutes', 'hamstrings', 'core'],
    commonIssues: ['knee pain', 'lower back pain', 'balance issues'],
    advice: 'Squat exercise guidance:\n\n**Form Checklist:**\n- Feet shoulder-width apart\n- Chest up, core engaged\n- Knees tracking over toes\n- Lower until thighs parallel to ground\n- Weight in heels, not toes\n\n**Recovery:**\n- Full-body compound exercise - requires more recovery\n- Rest 48 hours before intense leg training again\n- Foam roll quads and glutes\n- Protein intake is crucial (1.6-2.2g per kg body weight)',
    sets: 4,
    reps: 8
  },
  'bench press': {
    keywords: ['bench press', 'chest press'],
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    commonIssues: ['shoulder pain', 'elbow pain', 'chest soreness'],
    advice: 'Bench press training guide:\n\n**Proper Form:**\n- Full contact with bench (head, shoulders, glutes)\n- Hands slightly wider than shoulders\n- Lower bar to mid-chest\n- Don\'t bounce at bottom\n- Control the weight\n\n**Shoulder Health:**\n- Warm up with light cardio + shoulder mobility\n- Don\'t let elbows flare too far out (45-60 degrees)\n- Include shoulder blade retractions\n\n**Recovery:**\n- Upper body is less demanding than lower body\n- Can train chest 2x per week with 48 hours between sessions\n- Stretch afterwards for better blood flow'
  },
  'cardio': {
    keywords: ['cardio', 'running', 'cycling', 'elliptical', 'treadmill', 'jogging'],
    muscleGroups: ['heart', 'legs', 'full body'],
    commonIssues: ['breathlessness', 'cramping', 'knee pain', 'shin splints'],
    advice: 'Cardio exercise best practices:\n\n**Pre-Cardio:**\n- Warm up 5 minutes with dynamic stretches\n- Hydrate before starting\n- Eat a light snack if workout > 60 mins\n\n**During Cardio:**\n- Maintain steady breathing rhythm\n- Stay hydrated (sip water every 15-20 mins)\n- Monitor heart rate (220 - age = max HR)\n- Moderate intensity = you can talk but not sing\n\n**Post-Cardio:**\n- Cool down for 5-10 minutes gradually\n- Stretch major muscle groups\n- Rehydrate fully\n- Eat carbs + protein within 30 mins\n\n**Frequency:**\n- Aim for 150 minutes moderate or 75 minutes vigorous per week\n- Spread across 3-5 days\n- Include 1-2 rest days',
    caloriesBurn: '8-15 per minute'
  }
};

export const healthMetricsAdvice = {
  blood_pressure: {
    normal: { systolic: [90, 120], diastolic: [60, 80] },
    elevated: { systolic: [120, 130], diastolic: [60, 80] },
    high: { systolic: [130, 180], diastolic: [80, 120] },
    critical: { systolic: [180, Infinity], diastolic: [120, Infinity] },
    advice: {
      normal: '✅ Your blood pressure is healthy! Keep up your current lifestyle.',
      elevated: '⚠️ Your blood pressure is elevated. Reduce salt intake, exercise regularly, and manage stress.',
      high: '🔴 High blood pressure detected. Reduce workout intensity, consult your doctor, and monitor closely.',
      critical: '🚨 CRITICAL: Seek immediate medical attention. Do not exercise.'
    }
  },
  heart_rate: {
    resting_normal: [60, 100],
    exercise_zones: {
      easy: { percent: '50-60%', recovery: true },
      moderate: { percent: '60-70%', description: 'conversational pace' },
      hard: { percent: '70-85%', description: 'difficult but sustainable' },
      very_hard: { percent: '85-95%', description: 'near maximum' },
      maximum: { percent: '95-100%', description: 'all-out effort' }
    }
  },
  blood_sugar: {
    fasting_normal: [70, 100],
    postmeal_normal: [70, 140],
    fasting_prediabetic: [100, 126],
    fasting_diabetic: [126, Infinity],
    advice: {
      normal: '✅ Normal blood sugar. Maintain balanced diet with whole grains and proteins.',
      borderline: '⚠️ Pre-diabetic range. Reduce refined carbs, increase exercise, monitor regularly.',
      high: '🔴 High blood sugar. Avoid sugary foods and drinks. Consult endocrinologist.'
    }
  },
  oxygen_saturation: {
    normal: [95, 100],
    acceptable: [90, 95],
    low: [85, 90],
    critical: [0, 85],
    advice: {
      normal: '✅ Oxygen levels excellent. Continue current activity.',
      acceptable: '⚠️ Slightly low oxygen. Slow down, breathe deeply, rest if at altitude.',
      low: '🔴 Low oxygen. Stop exercise immediately and seek fresh air.',
      critical: '🚨 CRITICAL OXYGEN LEVEL: Seek emergency medical care immediately!'
    }
  }
};

export const recoveryAdvice = {
  postWorkout: (intensity, duration) => {
    let recovery = '';
    if (intensity > 80) {
      recovery = '🏋️ **Intense Workout Completed!**\n\n**Recovery Protocol:**\n1. Cool down for 10 minutes with light cardio\n2. Stretch all major muscle groups for 10 minutes\n3. Drink 500-1000ml of water with electrolytes\n4. Eat protein + carbs within 30 minutes\n5. Get adequate sleep (7-9 hours) for full recovery';
    } else if (intensity > 60) {
      recovery = '💪 **Moderate Workout Completed!**\n\n**Recovery:**\n1. Cool down for 5 minutes\n2. Static stretching for 5 minutes\n3. Hydrate well\n4. Light meal with protein\n5. Normal sleep schedule (7-9 hours)';
    } else {
      recovery = '🚶 **Light Workout Completed!**\n\n**Recovery:**\n1. Light cool down\n2. Gentle stretching\n3. Stay hydrated\n4. Normal routine';
    }
    return recovery;
  },
  soreness: '**Muscle Soreness (DOMS):**\n\nDelayed Onset Muscle Soreness typically occurs 24-48 hours after intense exercise.\n\n**Relief Methods:**\n1. Light movement (walking, yoga)\n2. Massage or foam rolling\n3. Warm baths\n4. Stretching\n5. Adequate protein (2g per kg body weight)\n\nExpect soreness to peak at 24-48 hours and improve by day 5-7.',
  overtraining: '**Signs of Overtraining:**\n\n- Persistent fatigue\n- Declining performance\n- Frequent injuries\n- Sleep disturbances\n- Elevated resting heart rate\n- Irritability or mood changes\n\n**Solution:**\n- Take 3-5 days complete rest\n- Reduce training volume by 50% for 1-2 weeks\n- Prioritize sleep (8-10 hours)\n- Include active recovery (yoga, swimming)\n- Consider working with a trainer'
};

export const nutritionForRecovery = {
  preWorkout: {
    timing: '2-3 hours before',
    examples: ['Oatmeal + banana', 'Rice + chicken', 'Pasta + lean meat', 'Sweet potato + egg'],
    macros: 'Carbs + Protein'
  },
  intraWorkout: {
    timing: 'During (if > 60 mins)',
    examples: ['Water', 'Sports drink', 'Coconut water', 'Energy gel'],
    macros: 'Simple carbs + electrolytes'
  },
  postWorkout: {
    timing: '0-30 minutes after',
    examples: ['Protein shake + banana', 'Chicken + rice', 'Greek yogurt + berries', 'Eggs + toast'],
    macros: 'Protein (20-30g) + Carbs (40-80g)',
    ratio: '1:2 or 1:3 (protein:carbs)'
  },
  daily: {
    protein: 'Target: 1.6-2.2g per kg body weight',
    carbs: '3-10g per kg body weight (varies by activity)',
    fats: '0.5-1.5g per kg body weight',
    hydration: '3-4 liters per day (more if exercising)'
  }
};

export const preventiveAdvice = {
  warmup: '**Importance of Warm-up:**\n\nA proper warm-up:\n- Increases core body temperature\n- Lubricates joints\n- Mentally prepares you\n- Reduces injury risk\n- Improves performance\n\n**Proper warm-up (5-10 mins):**\n1. 2-3 minutes light cardio (treadmill, cycling)\n2. Dynamic stretches (arm circles, leg swings, butterflies)\n3. Sport-specific movements (light versions of main exercise)',
  cooldown: '**Importance of Cool-down:**\n\nA proper cool-down:\n- Gradually lowers heart rate\n- Prevents blood pooling\n- Promotes recovery\n- Enhances flexibility\n- Mental transition\n\n**Proper cool-down (5-10 mins):**\n1. 5 minutes light activity (slow walk or jog)\n2. 5-10 minutes static stretching\n3. Deep breathing exercises',
  stretching: '**Stretching for Better Recovery:**\n\n**When to stretch:**\n- Post-workout (hold 20-30 seconds per muscle)\n- On rest days (gentle, long-hold stretches)\n- Morning routine (wakes up muscles)\n\n**Avoid:**\n- Cold stretching before workout (use dynamic stretches)\n- Bouncing (increases injury risk)\n- Overstretching (mild tension, not pain)\n\n**Key muscle groups to stretch:**\nHamstrings, quadriceps, hip flexors, calves, chest, shoulders, back'
};

// Function to analyze user input and provide contextual advice
export const analyzeUserInput = (userInput, userHealthMetrics = {}) => {
  const inputLower = userInput.toLowerCase();
  let response = '';

  // Check for symptoms
  for (const [symptom, symptomData] of Object.entries(symptomKeywords)) {
    const found = symptomData.keywords.some(keyword => inputLower.includes(keyword));
    if (found) {
      response = `🏥 **${symptom.toUpperCase()} Detected**\n\n${symptomData.advice}`;
      
      // Add health metric check if available
      if (userHealthMetrics.blood_pressure) {
        const [systolic, diastolic] = userHealthMetrics.blood_pressure;
        response += `\n\n**Your Current Blood Pressure:** ${systolic}/${diastolic}`;
      }
      return response;
    }
  }

  // Check for workout types
  for (const [workout, workoutData] of Object.entries(workoutRelatedAdvice)) {
    const found = workoutData.keywords.some(keyword => inputLower.includes(keyword));
    if (found) {
      response = `💪 **${workout.toUpperCase()} Guidance**\n\n${workoutData.advice}`;
      
      // Parse reps/sets if mentioned
      const repsMatch = userInput.match(/(\d+)\s*(reps?|sets?)/i);
      if (repsMatch) {
        response += `\n\n**Your Activity:** ${repsMatch[0]}\n**Recovery:** Based on your volume, expect muscle soreness in 24-48 hours.`;
      }
      return response;
    }
  }

  // Check for recovery-related queries
  if (inputLower.includes('recovery') || inputLower.includes('soreness') || inputLower.includes('doms')) {
    return `🔄 **Recovery Guide**\n\n${recoveryAdvice.soreness}`;
  }

  if (inputLower.includes('warm') || inputLower.includes('warm up')) {
    return `🔥 ${preventiveAdvice.warmup}`;
  }

  if (inputLower.includes('cool down')) {
    return `❄️ ${preventiveAdvice.cooldown}`;
  }

  if (inputLower.includes('stretch')) {
    return `🧘 ${preventiveAdvice.stretching}`;
  }

  if (inputLower.includes('nutrition') || inputLower.includes('eat') || inputLower.includes('protein')) {
    return `🥗 **Nutrition for Fitness**\n\n**Pre-Workout (2-3 hours before):**\nCarbs + Protein\nExample: Oatmeal + banana, Rice + chicken\n\n**Post-Workout (within 30 mins):**\nProtein (20-30g) + Carbs (40-80g)\nExample: Protein shake + banana, Chicken + rice\n\n**Daily Hydration:**\n3-4 liters of water per day (more if exercising)`;
  }

  // Default response
  return `👋 **Welcome to FitnessBot!**\n\nI can help you with:\n- 💪 Workout form and techniques (leg press, squats, bench press, cardio)\n- 🏥 Symptom analysis (cramps, dizziness, pain, fatigue)\n- 📊 Health metrics interpretation\n- 🔄 Recovery and post-workout protocols\n- 🥗 Nutrition guidance\n- ⚠️ Signs of overtraining\n- 🧘 Stretching and flexibility\n\n**How to use me:**\nTell me about:\n- A symptom you're experiencing\n- A workout you just completed\n- Your health concerns\n- Recovery questions\n\nExample: "I did 20 reps of leg press and have a cramp" or "I feel dizzy after cardio"`;
};
