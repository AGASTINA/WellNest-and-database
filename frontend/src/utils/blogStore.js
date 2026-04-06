const BLOG_STORAGE_KEY = 'wellnest-community-blog-v2';

const starterPosts = [
  {
    id: 'post-1',
    title: 'Stay fit Stay Healthy',
    category: 'Fitness',
    authorName: 'Likhita Reddy',
    authorRole: 'USER',
    authorInitial: 'L',
    createdAt: '2026-03-22T08:30:00.000Z',
    excerpt: 'Staying healthy is not just about hitting the gym—it’s about creating a balanced lifestyle that nourishes your body, mind, and spirit.',
    content: `💪 Staying healthy isn’t just about hitting the gym—it’s about creating a balanced lifestyle that nourishes your body, mind, and spirit. Here are some practical ways to keep yourself fit and fine every day:\n\n🥗 Eat Smart, Not Less\nFocus on whole foods: fruits, vegetables, lean proteins, and whole grains.\n\nLimit processed foods and sugary drinks—they drain energy and add empty calories.\n\nHydrate consistently; water is your body’s best friend.\n\n🏃 Move Your Body Daily\nAim for at least 30 minutes of physical activity—walking, cycling, yoga, or dancing.\n\nMix cardio with strength training to build endurance and muscle.\n\nStretch regularly to improve flexibility and prevent injuries.`,
    tags: ['Fitness', 'Health', 'WellNest'],
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    likeUserIds: [],
    comments: [
      {
        id: 'c1',
        authorName: 'Alex',
        authorInitial: 'A',
        text: 'Great read! Really helped me today.',
        createdAt: '2026-03-22T10:00:00.000Z'
      },
      {
        id: 'c2',
        authorName: 'Sam_Fit',
        authorInitial: 'S',
        text: 'Thanks for sharing this context!',
        createdAt: '2026-03-22T07:00:00.000Z'
      }
    ]
  },
  {
    id: 'post-likhita-2',
    title: 'Recovery Hacks: Bounce Back Faster After Intense Workouts',
    category: 'Recovery',
    authorName: 'Likhita Reddy',
    authorRole: 'USER',
    authorInitial: 'L',
    createdAt: '2026-03-25T09:15:00.000Z',
    excerpt: 'Learn the science-backed recovery techniques that will help you reduce soreness, prevent injuries, and perform better in your next workout.',
    content: `🔄 Recovery is where the magic happens! After crushing your workout, proper recovery is crucial for muscle growth, injury prevention, and sustained performance improvement.\n\n🛌 Sleep is Your Superpower\nAim for 7-9 hours of quality sleep per night.\nDuring sleep, your muscles repair and grow.\nPoor sleep hampers recovery and increases injury risk.\n\n🧊 Active Recovery Techniques\nLow-intensity movement on rest days (25-30 min walk, swimming, yoga)\nFoam rolling to release muscle tension and improve blood flow\nMassage therapy or self-massage to reduce soreness\n\n💧 Hydration & Nutrition\nDrink water consistently throughout the day\nPost-workout meal within 30 mins: protein + carbs\nEat anti-inflammatory foods (berries, leafy greens, omega-3s)\n\n🧘 Stress Management\nHigh stress increases cortisol, which inhibits recovery\nPractice meditation, deep breathing, or mindfulness\nTake rest days seriously—your body needs them!`,
    tags: ['Recovery', 'Muscle Growth', 'Wellness', 'Sleep'],
    imageUrl: 'https://images.unsplash.com/photo-1518611505868-d2b4fd36d6c7?auto=format&fit=crop&w=1200&q=80',
    likeUserIds: [],
    comments: []
  },
  {
    id: 'post-likhita-3',
    title: 'Nutrition 101: Pre & Post Workout Meals That Maximize Results',
    category: 'Nutrition',
    authorName: 'Likhita Reddy',
    authorRole: 'USER',
    authorInitial: 'L',
    createdAt: '2026-03-20T14:45:00.000Z',
    excerpt: 'Discover what to eat before and after your workouts to fuel performance, support muscle recovery, and achieve your fitness goals faster.',
    content: `🥗 Your nutrition directly impacts your workout performance and recovery! Eating the right foods at the right time is key to maximizing your fitness results.\n\n🔥 Pre-Workout Nutrition (2-3 hours before)\nObject: Provide energy without feeling heavy\nCarbohydrates (they fuel your muscles)\nLean protein (stabilizes blood sugar)\nMinimal fat and fiber\n\nExamples:\n• Oatmeal with banana and almonds\n• Brown rice with grilled chicken\n• Sweet potato with egg whites\n• Whole wheat toast with peanut butter\n\n💪 During Workout (if exceeding 60 minutes)\nSimple carbohydrates for quick energy\nElectrolytes for hydration\nExamples: Sports drink, coconut water, energy gels\n\n⚡ Post-Workout (within 30 minutes)\nMost critical meal! Your muscles are primed to absorb nutrients\nHigh-quality protein (repairs muscle tissue)\nFast-digesting carbs (replenishes glycogen)\nRatio: 1 part protein to 2-3 parts carbs\n\nExamples:\n• Grilled chicken breast with jasmine rice\n• Protein shake with Greek yogurt and berries\n• Salmon with sweet potato\n• Protein pancakes with fruit\n\n📊 Daily Nutrition Guidelines\nProtein: 1.6-2.2g per kg of body weight\nCarbs: 3-10g per kg (varies by activity level)\nFats: 0.5-1.5g per kg (don't skip healthy fats!)\nWater: 3-4 liters daily (more if exercising intensely)`,
    tags: ['Nutrition', 'Diet', 'Meal Planning', 'Fitness'],
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
    likeUserIds: [],
    comments: []
  },
  {
    id: 'post-likhita-4',
    title: 'Mental Health & Fitness: Why Physical Exercise is Your Best Therapist',
    category: 'Mental Health',
    authorName: 'Likhita Reddy',
    authorRole: 'USER',
    authorInitial: 'L',
    createdAt: '2026-03-18T11:20:00.000Z',
    excerpt: 'Explore the powerful connection between exercise and mental wellbeing, and discover how fitness can transform your mental health journey.',
    content: `🧠 The mind-body connection is real and powerful! Exercise isn't just about physical transformation—it's one of the most effective tools for mental health improvement.\n\n😊 How Exercise Improves Mental Health\nReleases endorphins (natural mood boosters)\nReduces cortisol and adrenaline (stress hormones)\nImproves sleep quality (essential for mental clarity)\nBoosts confidence and self-esteem\nProvides a healthy coping mechanism for stress\n\n🏃 Type of Exercise & Mental Benefits\nCardio workouts: Best for reducing anxiety and depression\n• 30 mins of running/cycling releases significant endorphins\nStrength training: Builds confidence and resilience\n• Seeing progress in strength translates to life confidence\nYoga & Stretching: Reduces stress and improves mindfulness\n• Focuses on breathing and body awareness\n\n🎯 Building a Mental Health Fitness Routine\nStart small: Even 15 minutes daily makes a difference\nChoose activities you enjoy—consistency matters more than intensity\nExercise with others: Community support boosts mental well-being\ntrack progress: Celebrate small wins for motivation\nBe patient: Mental health improvements take 3-4 weeks to notice\n\n⚠️ When to Seek Professional Help\nIf depression or anxiety persists despite exercise\nIf you have suicidal thoughts\nIf exercise worsens your mental state\nAlways combine fitness with professional mental health support when needed.`,
    tags: ['Mental Health', 'Wellness', 'Stress', 'Mindfulness'],
    imageUrl: 'https://images.unsplash.com/photo-1506819925906-301ff08cef0d?auto=format&fit=crop&w=1200&q=80',
    likeUserIds: [],
    comments: []
  },
  {
    id: 'post-agastina-1',
    title: 'Strength Training for Beginners: Build Muscle Safely & Effectively',
    category: 'Fitness',
    authorName: 'Agastina',
    authorRole: 'USER',
    authorInitial: 'A',
    createdAt: '2026-03-26T08:00:00.000Z',
    excerpt: 'A complete beginner\'s guide to strength training that focuses on proper form, progressive overload, and avoiding common injuries.',
    content: `💪 Strength training doesn't have to be intimidating! Whether you\'re new to fitness or returning after a break, this guide will help you build muscle safely and effectively.\n\n🏋️ Why Strength Training?\nBuilds muscle mass (increases metabolism)\nStengthens bones (prevents osteoporosis)\nImproves balance and reduces fall risk\nBoosts confidence and mental health\nHelps manage weight and blood sugar\n\n🎯 Strength Training Basics\n\n**Frequency:** 2-3 days per week (allow 48 hours between sessions for muscle recovery)\n\n**Duration:** 30-45 minutes per session\n\n**Exercise Selection:** Focus on compound movements\n• Squats (legs, glutes, core)\n• Push-ups (chest, shoulders, triceps)\n• Rows (back, biceps)\n• Deadlifts (full body)\n• Bench press (chest, shoulders)\n\n**Sets & Reps for Beginners:**\n• 3 sets of 8-12 reps\n• 2-3 minutes rest between sets\n• Start light—focus on form over weight\n\n🔥 Progressive Overload: The Key to Muscle Growth\nIncrease weight by 5-10% each week\nIncrease repetitions when weight becomes easy\nDecrease rest periods gradually\nChange exercises every 4-6 weeks\n\n⚠️ Common Beginner Mistakes to Avoid\n1. **Using too much weight** → Poor form = injury risk\n2. **Skipping warm-up** → Increases injury chance\n3. **Training the same muscles daily** → Muscles need 48 hours to recover\n4. **Neglecting core work** → Core stability prevents injuries\n5. **Not tracking progress** → Can't tell if improving\n\n📋 Sample Beginner Workout (3x per week)\n\n**Day 1 & 3 (Lower Body + Core):**\n- Squats: 3x10\n- Leg press: 3x10\n- Calf raises: 3x15\n- Planks: 3x30 seconds\n\n**Day 2 (Upper Body):**\n- Push-ups: 3x8\n- Rows: 3x10\n- Shoulder press: 3x8\n- Bicep curls: 3x10\n\n💡 Nutrition for Muscle Growth\nProtein: 1.6-2.2g per kg body weight\nCarbs: Fuel for your workouts\nFats: Support hormone production\nWater: 3-4 liters daily\n\nPost-workout within 30 mins: Protein + Carbs\n\nRemember: Consistency beats perfection! Start light, focus on form, and progressively increase. In 8-12 weeks, you\'ll notice significant strength gains! 🎉`,
    tags: ['Strength Training', 'Beginners', 'Muscle Building', 'Fitness'],
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    likeUserIds: [],
    comments: []
  },
  {
    id: 'post-agastina-2',
    title: 'Women\'s Fitness: Breaking Myths and Building Confidence',
    category: 'Fitness',
    authorName: 'Agastina',
    authorRole: 'USER',
    authorInitial: 'A',
    createdAt: '2026-03-24T16:30:00.000Z',
    excerpt: 'Debunk common fitness myths specific to women and learn how to build strength and confidence without fear of "bulking up".',
    content: `👩‍💪 Women's fitness is unique, and it's time we talked about it honestly! There are many myths that discourage women from strength training, and it's time to set the record straight.\n\n❌ Myth #1: "Lifting weights will make me bulky"\n\nFACT: Women produce significantly less testosterone than men (15-20x less). Building muscle requires a calorie surplus + consistent heavy lifting + high protein intake. Most women will develop lean, toned muscle—not bulk!\n\nBenefit of weight training for women:\n- More defined, sculpted appearance\n- Increased metabolism (burn more calories at rest)\n- Stronger bones (prevents osteoporosis)\n- Better posture and confidence\n\n❌ Myth #2: "Cardio is better than weights for fat loss"\n\nFACT: Both matter, but strength training is superior for sustainable fat loss because:\n- Builds muscle (muscle burns more calories)\n- Increases resting metabolic rate\n- Prevents muscle loss during dieting\n- Improves body composition (not just weight loss)\n\nIdeal combo: 2-3 strength sessions + 2-3 cardio sessions per week\n\n❌ Myth #3: "Women shouldn\'t lift heavy"\n\nFACT: Women are stronger than they think! Progressive overload with proper form is safe and effective:\n- Start with a weight you can do 8-12 reps safely\n- Add 5-10% weight weekly\n- Prioritize form over ego\n- Listen to your body\n\n💪 Women-Specific Fitness Considerations\n\n**Hormonal Cycles:**\nWeek 1-2 (Follicular phase): Higher energy, go hard with strength training\nWeek 3-4 (Luteal phase): Lower energy, focus on moderate intensity & recovery\n\n**Pelvic Floor Health:**\nImportant for all women, especially after pregnancy:\n- Include pelvic floor exercises (Kegels)\n- Avoid heavy jumping initially if weak pelvic floor\n- Consult pelvic floor PT if needed\n\n**Breast Support:**\n- Invest in a quality sports bra\n- Proper support prevents sagging and discomfort\n- Different activities = different bra types\n\n📊 Sample Women's Strength Program\n\n**Day 1 (Upper Body):**\n- Incline dumbbell press: 3x8\n- Rows: 3x10\n- Pull-ups or assisted: 3x6\n- Lateral raises: 3x12\n\n**Day 2 (Lower Body):**\n- Goblet squats: 3x12\n- Romanian deadlifts: 3x8\n- Leg press: 3x10\n- Leg curls: 3x12\n\n**Day 3 (Full Body + Core):**\n- Deadlifts: 3x5\n- Push-ups: 3x10\n- Planks: 3x45 sec\n- Glute bridges: 3x15\n- Side planks: 2x30 sec each\n\n✨ The Real Benefits Women Should Know\n- Increased confidence and self-esteem\n- Better mental health (reduced anxiety/depression)\n- Improved strength for daily activities\n- Beautiful, sculpted physique\n- Reduced injury risk\n- Better posture\n- Increased energy levels\n\n🎯 Getting Started\n1. Find a supportive gym or trainer\n2. Start with weights you can control safely\n3. Focus on proper form (YouTube videos help)\n4. Track your workouts\n5. Be patient—results take 6-8 weeks\n6. Celebrate non-scale victories (strength gains, new abilities)\n\nYou\'re stronger than you think! Stop waiting for permission and start building the body you want! 💪✨`,
    tags: ['Women\'s Fitness', 'Strength', 'Myths', 'Body Confidence'],
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    likeUserIds: [],
    comments: []
  },
  {
    id: 'post-priya-1',
    title: 'Yoga for Stress Relief: 5 Poses You Can Do Today',
    category: 'Wellness',
    authorName: 'Priya Sharma',
    authorRole: 'USER',
    authorInitial: 'P',
    createdAt: '2026-03-23T10:15:00.000Z',
    excerpt: 'Simple yoga poses that you can do in just 10 minutes to instantly reduce stress, calm your mind, and improve your mood.',
    content: `🧘 Stress is inevitable, but how we handle it makes all the difference! Yoga is one of the most effective stress-relief tools available—and the best part? You only need 10 minutes!\n\n✨ Why Yoga Works for Stress\n\n- Activates the parasympathetic nervous system (rest & digest)\n- Reduces cortisol (stress hormone)\n- Improves breathing (oxygen to brain)\n- Relieves physical tension\n- Calms racing thoughts\n- Improves sleep quality\n- No equipment needed!\n\n🧘 5 Essential Stress-Relief Poses (10 Minutes)\n\n**1. Child's Pose (2 minutes)**\n- Kneel and fold forward, arms extended\n- Rest forehead on mat\n- Breathe deeply into your belly\n- Benefits: Calms the mind, stretches lower back\n\n**2. Cat-Cow Stretch (2 minutes)**\n- On hands and knees\n- Inhale: Arch back, lift head (cow)\n- Exhale: Round spine, tuck chin (cat)\n- Repeat 10 times slowly\n- Benefits: Releases spine tension, improves breathing\n\n**3. Downward Dog (2 minutes)**\n- Hands and feet on floor, hips high\n- Head between shoulders, looking down\n- Press palms firmly\n- Breathe deeply\n- Benefits: Full body stretch, calms mind, reduces anxiety\n\n**4. Legs Up the Wall (2 minutes)**\n- Lie on back near wall\n- Extend legs up against wall\n- Arms relaxed at sides\n- Close eyes and breathe\n- Benefits: Activates parasympathetic nervous system, reduces anxiety\n\n**5. Corpse Pose with Deep Breathing (2 minutes)**\n- Lie flat on back\n- Legs extended, arms at sides\n- Close eyes\n- Breathe in for 4 counts, hold for 4, exhale for 4\n- Benefits: Complete relaxation, anxiety reduction\n\n🕉️ Bonus: 4-7-8 Breathing Technique\n\nDo this anywhere, anytime (even at work!):\n1. Inhale through nose for 4 counts\n2. Hold breath for 7 counts\n3. Exhale through mouth for 8 counts\n4. Repeat 4 times\n\nThis technique activates your parasympathetic nervous system instantly!\n\n📅 Daily Stress-Relief Routine\n\n**Morning (upon wake-up):**\n- 2 minutes cat-cow stretches\n- 2 minutes of 4-7-8 breathing\n\n**Midday (lunch break):**\n- 5 minute quick yoga routine (above)\n\n**Evening (before bed):**\n- 5 minutes child's pose + 4-7-8 breathing\n- 2 minutes corpse pose\n\n💡 Pro Tips\n- Practice on empty stomach if possible\n- Use a yoga mat for comfort\n- Don't force poses—meet yourself where you are\n- Consistency matters more than intensity\n- Join a yoga class for guidance and community\n\n🌿 Expected Benefits\n- After 1 session: Immediate calm and relaxation\n- After 1 week: Better sleep and mood\n- After 1 month: Noticeable anxiety reduction, better stress management\n- After 3 months: Transformed relationship with stress\n\nYou don't need 1 hour for yoga. Even 10 minutes of intentional breathing and stretching can transform your day! Start today! 🙏✨`,
    tags: ['Yoga', 'Stress Relief', 'Mental Health', 'Wellness'],
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    likeUserIds: [],
    comments: []
  },
  {
    id: 'post-likhita-5',
    title: '10 Foods That Boost Your Immune System Naturally',
    category: 'Nutrition',
    authorName: 'Likhita Reddy',
    authorRole: 'USER',
    authorInitial: 'L',
    createdAt: '2026-03-21T13:45:00.000Z',
    excerpt: 'Discover the top 10 foods that strengthen your immune system and help your body fight off infections naturally.',
    content: `🥗 Your immune system is your body's defense against illness! While no food is a magic cure, certain nutrient-dense foods can give your immune system the fuel it needs to thrive.\n\n🍊 Top 10 Immune-Boosting Foods\n\n**1. Citrus Fruits (Oranges, Lemons, Grapefruits)**\n- Rich in Vitamin C\n- Supports white blood cell production\n- Goal: 1-2 servings daily\n\n**2. Ginger**\n- Anti-inflammatory properties\n- Aids digestion\n- Helps reduce inflammation\n- Use: Add to tea, curry, smoothies\n\n**3. Garlic**\n- Contains allicin (antimicrobial)\n- Supports immune function\n- Best when raw or freshly minced\n- Goal: 3-4 cloves daily\n\n**4. Turmeric**\n- Curcumin = powerful anti-inflammatory\n- Golden milk (turmeric + milk + honey) = immune boost\n- Pair with black pepper for better absorption\n\n**5. Almonds**\n- Rich in Vitamin E (antioxidant)\n- Only 1 oz (23 almonds) daily provides 37% daily value\n- Great for snacking\n\n**6. Spinach**\n- Loaded with Vitamin C and antioxidants\n- Most nutritious when raw or lightly cooked\n- Use in salads, soups, smoothies\n\n**7. Broccoli**\n- Sulforaphane = antioxidant powerhouse\n- Rich in vitamins A, C, E\n- Eat raw or lightly steamed\n\n**8. Yogurt/Probiotics**\n- Live cultures support gut health\n- Gut = 70% of immune system!\n- Choose plain, unsweetened varieties\n- Daily amount: 1 serving\n\n**9. Bell Peppers**\n- More Vitamin C than oranges!\n- Red peppers have more Vitamin A\n- Add to salads, stir-fries, snack raw\n\n**10. Mushrooms (Shiitake, Maitake)**\n- Beta-glucans support immune response\n- Selenium content = antioxidant\n- Cook lightly for best nutritional value\n\n🥤 Immune-Boosting Beverages\n\n**Golden Milk (before bed):**\n- 1 cup warm milk\n- 1/4 tsp turmeric\n- Pinch black pepper\n- 1 tsp honey\n- Dash of cinnamon\n\n**Immunity Tea:**\n- Ginger slices\n- Lemon juice\n- Raw honey\n- Hot water\n- Optional: turmeric, cinnamon\n\n**Smoothie:**\n- Orange juice\n- Spinach\n- Ginger\n- Almonds\n- Greek yogurt\n\n💪 Other Immune-Support Habits\n- Sleep 7-9 hours nightly (immune cells repair at night)\n- Exercise 30 mins daily (boosts immune circulation)\n- Manage stress (chronic stress suppresses immunity)\n- Stay hydrated (water supports immune function)\n- Hand washing (prevents pathogen entry)\n\n📊 Weekly Immune-Boosting Meal Plan\n\n**Breakfast:** Yogurt + berries + almonds\n**Lunch:** Spinach salad + grilled chicken + bell peppers + olive oil\n**Dinner:** Baked salmon + steamed broccoli + sweet potato + turmeric dressing\n**Snacks:** Citrus fruits, almonds, raw veggies\n**Beverages:** Green tea, golden milk, immune smoothies\n\n✨ Expected Timeline\n- Immediate: Better digestion and energy\n- 2-4 weeks: Noticeable mood improvement\n- 6-8 weeks: Reduced cold/flu symptoms\n- 3+ months: Significantly stronger immune response\n\nRemember: Nutrition alone can't prevent illness, but combined with sleep, exercise, stress management, and hygiene, these foods create an incredibly strong immune system! 🛡️💚`,
    tags: ['Nutrition', 'Immunity', 'Health', 'Superfoods'],
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
    likeUserIds: [],
    comments: []
  },
  {
    id: 'post-rajesh-1',
    title: 'Marathon Training: From Couch to 42K in 16 Weeks',
    category: 'Fitness',
    authorName: 'Rajesh Patel',
    authorRole: 'USER',
    authorInitial: 'R',
    createdAt: '2026-03-27T07:20:00.000Z',
    excerpt: 'Complete marathon training guide for beginners—from starting as a couch potato to crossing the finish line strong.',
    content: `🏃 Marathon training seems intimidating, but with the right plan, consistency, and mindset, anyone can finish 42 kilometers!\n\n🎯 What You Need Before Starting\n- Running shoes (get fitted at a specialty store)\n- 3-4 months with NO injuries\n- Ability to run 3-4 miles comfortably\n- Commitment to 4-5 training days/week\n\n📅 16-Week Marathon Training Plan\n\n**Weeks 1-4 (Base Building):**\n- Monday: 4 miles easy\n- Tuesday: 3 miles tempo\n- Wednesday: Rest or cross-train\n- Thursday: 5 miles easy\n- Saturday: Long run (start 6 miles, increase 1 mile weekly)\n- Sunday: Rest or yoga\n\n**Weeks 5-8 (Building Endurance):**\n- Increase long run weekly by 2 miles\n- Long run reaches 14-16 miles\n- Midweek runs stay at 4-6 miles\n- Add strength training 1x per week\n\n**Weeks 9-12 (Peak Training):**\n- Long run: 18-20 miles\n- One speed workout weekly\n- Tempo runs: 6-8 miles\n- Total weekly mileage: 35-40 miles\n\n**Weeks 13-16 (Taper):**\n- Reduce mileage by 20% each week\n- Long run: 12-14 miles (week 13), then decrease\n- Rest is crucial—avoid injuries now\n- Mental preparation intensifies\n\n💊 Nutrition Strategy\n\n**Daily:**\n- Carbs: 5-8g per kg body weight\n- Protein: 1.6-2g per kg body weight\n- Hydration: 3-4 liters daily (more on training days)\n- Iron-rich foods (supports oxygen transport)\n\n**During Long Runs (>90 mins):**\n- Sports drink with 6-8% carbs\n- Gels or energy bars\n- Salt (prevents hyponatremia)\n- Aim for 30-60g carbs per hour\n\n**Post-Run (within 30 mins):**\n- Carbs + Protein (3:1 ratio)\n- Example: Chocolate milk, banana + peanut butter\n\n⚠️ Common Marathon Training Mistakes\n- Running too fast on easy days\n- Increasing mileage too quickly (>10% per week)\n- Neglecting strength training\n- Not practicing race nutrition\n- Pushing through pain (rest is training!)\n- Ignoring sleep (recovery happens while sleeping)\n\n🏥 Injury Prevention\n- Strength train 2x weekly (core, glutes, legs)\n- Stretch daily (15-20 mins)\n- Foam roll problem areas\n- Cross-train on rest days (cycling, swimming)\n- Replace shoes every 300-500 miles\n- Listen to your body—rest beats injury\n\n🎯 Race Day Strategy\n- Wake up 3 hours before race\n- Eat familiar food (nothing new!)\n- Pin bib number day before\n- Start conservatively (first 5K slower than planned)\n- Take walk breaks if needed\n- Celebrate every milestone (10K, halfway, 30K)\n\nYou've got this! Thousands train for marathons every year—so can you! 💪`,
    tags: ['Marathon', 'Running', 'Endurance', 'Training Plan'],
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
    likeUserIds: [],
    comments: []
  },
  {
    id: 'post-sophia-1',
    title: 'Sleep Hygiene: How to Finally Get That Perfect 8 Hours',
    category: 'Wellness',
    authorName: 'Sophia Williams',
    authorRole: 'USER',
    authorInitial: 'S',
    createdAt: '2026-03-19T20:00:00.000Z',
    excerpt: 'Master the science of sleep and implement proven techniques to wake up refreshed and recharged every morning.',
    content: `😴 Sleep is not a luxury—it's a necessity! Yet millions struggle with insomnia, poor sleep quality, and daytime fatigue. The good news? Your sleep can transform dramatically with proper sleep hygiene.\n\n🌙 Why Sleep Matters\n- Immune system repair (happens during sleep)\n- Muscle recovery and growth\n- Memory consolidation\n- Hormone regulation\n- Mood stability\n- Metabolism optimization\n- Disease prevention\n\n🛏️ The 10 Pillars of Sleep Hygiene\n\n**1. Consistent Sleep Schedule**\n- Go to bed at the same time nightly\n- Wake up at the same time (even weekends!)\n- Your body thrives on consistency\n- Takes 2-3 weeks to establish\n\n**2. Dark Sleep Environment**\n- Use blackout curtains\n- Keep lights completely off\n- Wear an eye mask if needed\n- Even small lights impair melatonin\n\n**3. Cool Temperature**\n- 60-67°F (15-19°C) is optimal\n- Cool room triggers sleep\n- Use fans or adjust AC\n- Cooler body = better sleep\n\n**4. No Screens 1 Hour Before Bed**\n- Blue light suppresses melatonin\n- Include phone, laptop, TV\n- Read a book instead\n- Listen to nature sounds\n\n**5. No Caffeine After 2 PM**\n- Half-life of caffeine = 5-6 hours\n- 200mg at 2 PM = 100mg still in blood at 8 PM\n- Switch to herbal tea in evening\n\n**6. No Large Meals Before Bed**\n- Eat 2-3 hours before sleep\n- Light snack OK if hungry:\n  - Banana + almond butter\n  - Yogurt + berries\n  - Whole grain toast with cheese\n\n**7. Exercise (But Not Too Late)**\n- Daily exercise improves sleep\n- Exercise 4+ hours before bed\n- Avoid vigorous exercise after 6 PM\n- Morning or afternoon exercise ideal\n\n**8. No Alcohol Before Bed**\n- Alcohol disrupts sleep architecture\n- You fall asleep faster but sleep quality tanks\n- Wake up 3-4 hours later\n- Avoid 6+ hours before bed\n\n**9. Relaxation Techniques**\n- Meditation (10-15 mins)\n- Progressive muscle relaxation\n- Deep breathing (4-7-8 technique)\n- Journaling\n- Gentle stretching\n\n**10. Comfortable Bedding**\n- Quality mattress (8+ year lifespan)\n- Supportive pillows\n- Breathable sheets (cotton, linen)\n- Extra blankets for comfort\n\n💤 Pre-Sleep Routine (30 Minutes)\n\n8:00 PM - Put phone away\n8:05 PM - Dim lights, switch to warm lighting\n8:10 PM - Take a warm bath/shower\n8:20 PM - Light stretching or yoga\n8:25 PM - Read or journaling\n8:30 PM - Lights out\n\n🧘 Relaxation Techniques to Try\n\n**Guided Meditation:**\n- Apps: Calm, Headspace, Insight Timer\n- 10-20 minutes before bed\n- Tracks your sleep + provides guided sessions\n\n**4-7-8 Breathing:**\n- Inhale for 4 counts\n- Hold for 7 counts\n- Exhale for 8 counts\n- Repeat 4 times\n\n**Body Scan:**\n- Lie down, focus on each body part\n- Release tension consciously\n- 10-15 minutes\n\n⚠️ When to See a Doctor\n- Can't fall asleep despite good sleep hygiene\n- Wake frequently during night\n- Daytime sleepiness despite \"sleeping\"\n- Loud snoring\n- Gasping for breath at night\n\n📊 Expected Sleep Improvements\n- Week 1: Easier to fall asleep\n- Week 2: Sleep more deeply\n- Week 3: Feel significantly more rested\n- Week 4: Transformation in energy/mood\n- Month 2: Health improvements noticeable\n\nGood sleep isn't a gift—it's a skill you can master! Start with 2-3 changes and gradually add more. Your future self will thank you! 💤✨`,
    tags: ['Sleep', 'Wellness', 'Rest', 'Sleep Science'],
    imageUrl: 'https://images.unsplash.com/photo-1604432913691-d1a45f25e385?auto=format&fit=crop&w=1200&q=80',
    likeUserIds: [],
    comments: []
  },
  {
    id: 'post-aditya-1',
    title: 'Plant-Based Diet: Get Enough Protein Without Meat',
    category: 'Nutrition',
    authorName: 'Aditya Desai',
    authorRole: 'USER',
    authorInitial: 'A',
    createdAt: '2026-03-25T12:00:00.000Z',
    excerpt: 'Complete guide to meeting your protein needs on a plant-based diet, with meal plans and delicious recipes.',
    content: `🌱 Switching to plant-based eating? Don\'t worry about protein—with smart planning, you can easily meet your daily needs!\n\n💪 Best Plant-Based Protein Sources\n\n**Legumes (Top Choice):**\n- Lentils: 18g protein per cooked cup\n- Chickpeas: 19g per cooked cup\n- Black beans: 15g per cooked cup\n- Peanuts: 7g per ounce\n- Peas: 8g per cooked cup\n\n**Grains:**\n- Quinoa: 8g per cooked cup (complete protein!)\n- Oats: 10g per cooked cup\n- Brown rice: 5g per cooked cup\n- Whole wheat bread: 4g per slice\n\n**Nuts & Seeds:**\n- Hemp seeds: 10g per 3 tablespoons\n- Chia seeds: 5g per 2 tablespoons\n- Almonds: 6g per ounce\n- Pumpkin seeds: 9g per ounce\n- Tahini: 3g per tablespoon\n\n**Plant-Based Products:**\n- Tofu: 19g per 200g\n- Tempeh: 19g per 100g\n- Edamame: 18g per cooked cup\n- Plant-based milk (fortified): 8g per cup\n\n🥗 Daily Protein Goals\n- Sedentary: 0.8g per kg body weight\n- Regular exercise: 1.2-2g per kg body weight\n- Strength training: 1.6-2.2g per kg body weight\n\n📋 Sample Plant-Based High-Protein Day (90g protein)\n\n**Breakfast (20g protein):**\n- Oatmeal (40g): 5g\n- Hemp seeds (3 tbsp): 10g\n- Almond butter (2 tbsp): 7g\n- Banana, berries\n\n**Lunch (25g protein):**\n- Lentil curry (1.5 cups): 27g\n- Brown rice (1 cup): 5g\n- Spinach salad\n\n**Snack (10g protein):**\n- Hummus (3 tbsp): 4g\n- Pita bread (1): 3g\n- Almonds (1 oz): 6g\n\n**Dinner (25g protein):**\n- Tofu stir-fry (200g): 20g\n- Quinoa (1 cup): 8g\n- Vegetables\n\n**Evening Snack (10g protein):**\n- Plant-based yogurt (1 cup): 10g\n- Chia seeds (2 tbsp): 5g\n- Berries\n\n✅ Complete Plant-Based Proteins (Have All 9 Amino Acids)\n- Quinoa\n- Hemp seeds\n- Chia seeds\n- Nutritional yeast\n- Buckwheat\n- Soy products (tofu, tempeh, edamame)\n\n💡 Combining Incomplete Proteins\nMany plant proteins are incomplete, but combining different sources creates complete proteins:\n- Rice + Beans (classic!)\n- Hummus + Pita bread\n- Peanut butter + Whole wheat bread\n- Tofu + Rice\n\n🔥 Plant-Based Muscle-Building Secrets\n1. Eat enough calories (protein works with adequate energy)\n2. Strength train 3-4x per week\n3. Distribute protein throughout day (20-30g per meal)\n4. Stay consistent for 8-12 weeks\n5. Track meals initially to ensure hitting targets\n\n✨ Benefits of Plant-Based Eating\n- Lower cholesterol\n- Reduced heart disease risk\n- Better digestion\n- More energy\n- Environmental sustainability\n- Often cheaper than meat\n- Feel lighter and more energetic\n\nYou don\'t need meat to build muscle! Be consistent, eat enough, train hard, and watch your plant-based gains grow! 💚🌱`,
    tags: ['Plant-Based', 'Nutrition', 'Vegetarian', 'Protein'],
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
    likeUserIds: [],
    comments: []
  }
];

const safeParse = (raw, fallback) => {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const getFallbackImageByCategory = (category) => {
  const normalized = String(category || '').toLowerCase();
  if (normalized.includes('nutrition')) {
    return 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80';
  }
  if (normalized.includes('mental') || normalized.includes('wellness') || normalized.includes('recovery')) {
    return 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80';
  }
  return 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&w=1200&q=80';
};

const normalizeAuthorName = (name) => {
  const normalized = String(name || '').trim();
  if (!normalized) return 'WellNest User';
  if (normalized.toLowerCase() === 'agastina kumar') return 'Agastina';
  return normalized;
};

const normalizePost = (post = {}) => {
  const authorName = normalizeAuthorName(post.authorName);
  const imageUrl = typeof post.imageUrl === 'string' ? post.imageUrl.trim() : '';

  return {
    ...post,
    authorName,
    authorInitial: (authorName[0] || 'W').toUpperCase(),
    imageUrl: imageUrl || getFallbackImageByCategory(post.category)
  };
};

const mergeStarterPosts = (savedPosts) => {
  const normalizedSaved = Array.isArray(savedPosts) ? savedPosts : [];
  const byId = new Map(normalizedSaved.map((post) => [post.id, normalizePost(post)]));

  starterPosts.forEach((starterPost) => {
    if (!byId.has(starterPost.id)) {
      byId.set(starterPost.id, normalizePost(starterPost));
    }
  });

  return Array.from(byId.values());
};

const readPosts = () => {
  const saved = safeParse(localStorage.getItem(BLOG_STORAGE_KEY), null);
  if (!Array.isArray(saved) || saved.length === 0) {
    const normalizedStarters = starterPosts.map(normalizePost);
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(normalizedStarters));
    return [...normalizedStarters];
  }

  const merged = mergeStarterPosts(saved);
  const changed = JSON.stringify(merged) !== JSON.stringify(saved);
  if (changed) {
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(merged));
  }

  return merged;
};

const writePosts = (posts) => {
  localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
};

const byNewest = (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

export const listPosts = () => readPosts().sort(byNewest);

export const getPostById = (id) => listPosts().find((p) => p.id === id) || null;

export const upsertPost = (postPayload) => {
  const posts = readPosts();
  const now = new Date().toISOString();

  if (postPayload.id) {
    const idx = posts.findIndex((p) => p.id === postPayload.id);
    if (idx >= 0) {
      posts[idx] = {
        ...posts[idx],
        ...postPayload,
        updatedAt: now
      };
      writePosts(posts);
      return posts[idx];
    }
  }

  const created = {
    id: `post-${Date.now()}`,
    createdAt: now,
    likeUserIds: [],
    comments: [],
    ...postPayload
  };
  posts.push(created);
  writePosts(posts);
  return created;
};

export const deletePostById = (id) => {
  const posts = readPosts().filter((p) => p.id !== id);
  writePosts(posts);
};

export const toggleLike = (postId, userId) => {
  if (!userId) return null;
  const posts = readPosts();
  const idx = posts.findIndex((p) => p.id === postId);
  if (idx < 0) return null;
  const likes = Array.isArray(posts[idx].likeUserIds) ? posts[idx].likeUserIds : [];
  const hasLiked = likes.includes(userId);
  posts[idx].likeUserIds = hasLiked
    ? likes.filter((id) => id !== userId)
    : [...likes, userId];
  writePosts(posts);
  return posts[idx];
};

export const addComment = (postId, commentPayload) => {
  const posts = readPosts();
  const idx = posts.findIndex((p) => p.id === postId);
  if (idx < 0) return null;

  const nextComment = {
    id: `comment-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...commentPayload
  };

  const existingComments = Array.isArray(posts[idx].comments) ? posts[idx].comments : [];
  posts[idx].comments = [...existingComments, nextComment];
  writePosts(posts);
  return posts[idx];
};
