import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const faqs = [
    {
      id: 1,
      category: 'General Health',
      question: 'How often should I exercise per week for optimal health?',
      answer: 'According to WHO guidelines, adults should aim for at least 150 minutes of moderate-intensity aerobic activity or 75 minutes of vigorous-intensity activity per week, combined with muscle-strengthening activities 2+ days per week. However, start with what\'s sustainable for you and gradually increase.'
    },
    {
      id: 2,
      category: 'Fitness',
      question: 'What\'s the best time to work out - morning or evening?',
      answer: 'The best time is when you\'re most consistent! However, morning workouts may boost metabolism throughout the day, while evening workouts might increase strength gains. Choose based on your schedule and energy levels. Most importantly: consistency beats timing.'
    },
    {
      id: 3,
      category: 'Nutrition',
      question: 'How much protein do I need daily for muscle growth?',
      answer: 'For muscle building, aim for 1.6-2.2 grams of protein per kilogram of body weight daily. For example, a 70kg person should consume 112-154g of protein. Distribute protein intake throughout the day for optimal muscle protein synthesis.'
    },
    {
      id: 4,
      category: 'Recovery',
      question: 'How long does muscle soreness (DOMS) typically last?',
      answer: 'Delayed Onset Muscle Soreness (DOMS) typically peaks 24-48 hours after intense exercise and resolves within 5-7 days. It\'s normal and indicates your muscles are adapting. Light movement, stretching, and proper nutrition can help reduce soreness.'
    },
    {
      id: 5,
      category: 'Sleep & Recovery',
      question: 'How many hours of sleep do I need for fitness recovery?',
      answer: 'Adults should aim for 7-9 hours of quality sleep per night for optimal recovery. During deep sleep stages, your body repairs muscles, consolidates memory, and produces growth hormone. Poor sleep significantly impairs recovery and fitness progress.'
    },
    {
      id: 6,
      category: 'Fitness',
      question: 'What\'s the difference between HIIT and steady-state cardio?',
      answer: 'HIIT (High-Intensity Interval Training) alternates intense bursts with recovery periods—great for burning calories in less time. Steady-state cardio maintains consistent intensity—better for building aerobic capacity and endurance. Both have benefits; combine them for best results.'
    },
    {
      id: 7,
      category: 'Nutrition',
      question: 'Should I eat before or after my workout?',
      answer: 'Both! Pre-workout meal (2-3 hours before) provides energy—eat carbs + protein. Post-workout meal (within 30 mins) supports recovery—eat fast-digesting carbs + protein (1:2-3 ratio). Examples: banana + peanut butter before; protein shake + rice after.'
    },
    {
      id: 8,
      category: 'Injuries & Pain',
      question: 'When should I see a doctor about workout pain?',
      answer: 'Seek medical help if: pain is sharp or severe, doesn\'t improve after 1 week with rest, swelling increases, you can\'t move the joint, or pain worsens with activity. Mild muscle soreness is normal, but sharp joint or ligament pain needs professional evaluation.'
    },
    {
      id: 9,
      category: 'Mental Health',
      question: 'How does exercise help with anxiety and depression?',
      answer: 'Exercise releases endorphins (mood-boosting chemicals), reduces cortisol and adrenaline (stress hormones), improves sleep quality, and boosts confidence. Aim for 30 mins of moderate cardio 3-5 times weekly. Combine with professional mental health support if needed.'
    },
    {
      id: 10,
      category: 'General Health',
      question: 'How much water should I drink daily?,',
      answer: 'A general rule is 3-4 liters (8-10 cups) daily for sedentary people. If you exercise, add 500ml (17oz) per 30 minutes of activity. Listen to your body: thirst, activity level, climate, and health conditions affect hydration needs. Urine color is a good indicator—pale/clear is ideal.'
    },
    {
      id: 11,
      category: 'Fitness',
      question: 'Is it okay to exercise with muscle soreness (DOMS)?',
      answer: 'Light activity (walking, stretching, yoga) helps speed recovery. However, avoid heavy exercise on sore muscle groups. Focus on different muscle groups or do low-intensity cardio. Soreness typically means your muscles are adapting and growing—rest those specific muscles for 48 hours.'
    },
    {
      id: 12,
      category: 'Weight Management',
      question: 'How many calories should I eat to lose weight safely?',
      answer: 'Create a modest calorie deficit: aim for 300-500 fewer calories than you burn daily (safe loss of 0.5-1 kg/week). Don\'t go below 1200 calories/day (women) or 1500 (men). Combine calorie deficit with strength training to preserve muscle mass. Consult a nutritionist for personalized advice.'
    },
    {
      id: 13,
      category: 'Fitness',
      question: 'What\'s the best way to increase workout intensity safely?',
      answer: 'Follow the 10% rule: increase volume/intensity by max 10% per week. Examples: add 1 more rep, 5 more pounds, or 5 more minutes of cardio. Proper form is more important than heavy weight. Progress gradually to prevent injury and allow adaptation.'
    },
    {
      id: 14,
      category: 'Nutrition',
      question: 'Are supplements necessary for fitness goals?',
      answer: 'A balanced diet covers most nutrient needs. However, protein powder, creatine, and vitamins can supplement a good diet. Skip fancy supplements; focus on whole foods first. Consult a nutritionist before starting supplements, especially with health conditions or medications.'
    },
    {
      id: 15,
      category: 'Mental Health',
      question: 'How can I stay motivated to exercise regularly?',
      answer: 'Set specific, measurable goals. Start small and progress gradually. Find activities you genuinely enjoy. Exercise with a friend or join a class (community). Track progress (photos, weights, times). Celebrate small wins. Rest when needed—burnout kills motivation. Make it a lifestyle, not a chore.'
    },
    {
      id: 16,
      category: 'Health Metrics',
      question: 'What should my resting heart rate be?',
      answer: 'Normal resting heart rate for adults is 60-100 bpm. Athletes may have lower rates (40-60 bpm). Higher resting heart rate may indicate stress, illness, or overtraining. Check your RHR first thing in the morning before getting out of bed.'
    },
    {
      id: 17,
      category: 'Fitness',
      question: 'How to prevent injuries during strength training?',
      answer: 'Warm up properly (5-10 mins light cardio + dynamic stretches). Use proper form over heavy weight—consider hiring a trainer. Progress gradually (10% rule). Don\'t skip rest days. Include flexibility work. Listen to your body and stop if something hurts.'
    },
    {
      id: 18,
      category: 'Recovery',
      question: 'What\'s active recovery and how often should I do it?',
      answer: 'Active recovery is light movement (walking, yoga, swimming) on rest days at 25-30% max effort. Improves blood flow, reduces soreness, and aids recovery. Do 1-2 active recovery sessions per week. Avoid high intensity on these days.'
    }
  ];

  const filteredFAQs = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      faq =>
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q) ||
        faq.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const categories = ['All', ...new Set(faqs.map(f => f.category))];

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen wellnest-app-bg py-8 px-4">
      <div className="max-w-4xl mx-auto wellnest-content-layer">
        <PageHeader
          icon="💬"
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions about fitness, health, nutrition, and recovery"
        />

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search FAQs... (e.g., 'sleep', 'protein', 'injury')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className="wellnest-surface border border-gray-200 rounded-lg overflow-hidden hover:border-green-300 transition"
              >
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full px-6 py-4 flex items-start justify-between gap-4 hover:bg-gray-50 transition text-left"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">
                        {faq.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-base">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="flex-shrink-0">
                    {expandedId === faq.id ? (
                      <ChevronUp className="text-green-600" size={24} />
                    ) : (
                      <ChevronDown className="text-gray-400" size={24} />
                    )}
                  </div>
                </button>

                {/* Expanded Answer */}
                {expandedId === faq.id && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No questions found matching your search.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-green-600 hover:text-green-700 font-semibold"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* Additional Help */}
        <div className="mt-12 wellnest-surface border-l-4 border-green-500 p-6 rounded-lg">
          <h3 className="font-bold text-lg text-gray-800 mb-2">Didn't find your answer?</h3>
          <p className="text-gray-600 mb-4">
            Use our FitnessBot (💬 floating button) to get personalized advice, or consult with:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/consult-doctor"
              className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:border-blue-400 transition text-center"
            >
              <p className="font-semibold text-blue-700">👨‍⚕️ Consult Doctor</p>
              <p className="text-sm text-gray-600 mt-1">Professional medical advice</p>
            </a>
            <a
              href="/trainers"
              className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:border-purple-400 transition text-center"
            >
              <p className="font-semibold text-purple-700">💪 Talk to Trainer</p>
              <p className="text-sm text-gray-600 mt-1">Expert fitness guidance</p>
            </a>
            <a
              href="/community-blog"
              className="p-4 bg-orange-50 border border-orange-200 rounded-lg hover:border-orange-400 transition text-center"
            >
              <p className="font-semibold text-orange-700">📚 Blog & Community</p>
              <p className="text-sm text-gray-600 mt-1">Stories and tips from users</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
