import React from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuthSession, getStoredUser } from '../utils/auth';

const LandingPage = () => {
  const navigate = useNavigate();
  const user = getStoredUser();

  const handleLogout = () => {
    clearAuthSession();
    navigate('/');
  };

  const features = [
    {
      icon: '🧘',
      title: 'Mindfulness & Meditation',
      description: 'Discover guided meditation sessions and mindfulness exercises to reduce stress and improve mental clarity.'
    },
    {
      icon: '💪',
      title: 'Fitness Tracking',
      description: 'Track your workouts, set fitness goals, and monitor your progress with our comprehensive fitness tools.'
    },
    {
      icon: '🥗',
      title: 'Nutrition Planning',
      description: 'Get personalized meal plans and nutrition advice to fuel your body and achieve your wellness goals.'
    },
    {
      icon: '😴',
      title: 'Sleep Optimization',
      description: 'Improve your sleep quality with expert tips, sleep tracking, and relaxation techniques.'
    },
    {
      icon: '📊',
      title: 'Progress Analytics',
      description: 'Visualize your wellness journey with detailed analytics and insights about your health trends.'
    },
    {
      icon: '👥',
      title: 'Community Support',
      description: 'Connect with like-minded individuals, share experiences, and get support from our wellness community.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">🌿 WellNest</span>
            </div>
            <div className="flex items-center space-x-4">
              {!user ? (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors shadow-md"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard')}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors shadow-md"
                  >
                    Go to Dashboard
                  </button>
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold">
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="text-sm text-gray-700">
                      <div className="font-semibold">{user.name}</div>
                      <button
                        onClick={handleLogout}
                        className="text-xs text-gray-500 hover:text-gray-800"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Wellness Journey
            <span className="block text-primary-600">Starts Here</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your life with personalized wellness programs, expert guidance, 
            and a supportive community. Start living your healthiest life today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Get Started Free
            </button>
            <button
              className="px-8 py-4 bg-white text-primary-600 border-2 border-primary-600 rounded-lg hover:bg-primary-50 font-semibold text-lg transition-colors shadow-lg"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Wellness
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive tools and resources to support every aspect of your wellness journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-primary-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Life?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of users who have already started their wellness journey with WellNest
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-4 bg-white text-primary-600 rounded-lg hover:bg-gray-100 font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Start Your Journey Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-2xl font-bold text-primary-400">🌿 WellNest</span>
            <p className="mt-4 text-gray-400">
              © 2026 WellNest. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
