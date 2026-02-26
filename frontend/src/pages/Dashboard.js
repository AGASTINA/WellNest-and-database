import React from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuthSession, getStoredUser } from '../utils/auth';
import EditProfileModal from '../components/EditProfileModal';
import ChangePasswordModal from '../components/ChangePasswordModal';
import DeleteProfileModal from '../components/DeleteProfileModal';
import WorkoutPlanCard from '../components/WorkoutPlanCard';
import WorkoutPlanDetailModal from '../components/WorkoutPlanDetailModal';
import WorkoutPlanExecutionModal from '../components/WorkoutPlanExecutionModal';
import WorkoutLogModal from '../components/WorkoutLogModal';
import workoutApi from '../utils/workoutApi';
import { getLatestHealthMetrics, getUserConsultations } from '../utils/medicalApi';
import { getCalorieSummary, getUserSessions } from '../utils/calorieApi';
import { useState, useRef, useEffect } from 'react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';

const sparklineData1 = [{ value: 310 }, { value: 320 }, { value: 290 }, { value: 345 }, { value: 335 }, { value: 360 }, { value: 345 }];
const sparklineData2 = [{ value: 300 }, { value: 340 }, { value: 310 }, { value: 315 }, { value: 330 }, { value: 315 }, { value: 341 }];
const sparklineData3 = [{ value: 350 }, { value: 300 }, { value: 320 }, { value: 340 }, { value: 310 }, { value: 360 }, { value: 345 }];
const sparklineData4 = [{ value: 280 }, { value: 300 }, { value: 290 }, { value: 350 }, { value: 340 }, { value: 380 }, { value: 341 }];

const mainChartData = [
  { name: 'May', value: 220 },
  { name: 'Jun', value: 350 },
  { name: 'Jul', value: 120 },
  { name: 'Aug', value: 310 },
  { name: 'Sep', value: 450 },
  { name: 'Nov', value: 120 }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getStoredUser());
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [isWorkoutExecutionOpen, setIsWorkoutExecutionOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isNewWorkout, setIsNewWorkout] = useState(false);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [isLoadingWorkouts, setIsLoadingWorkouts] = useState(true);
  const [workoutError, setWorkoutError] = useState(null);
  const dropdownRef = useRef(null);
  
  // Health-related state
  const [latestHealthMetrics, setLatestHealthMetrics] = useState(null);
  const [upcomingConsultations, setUpcomingConsultations] = useState([]);
  const [calorieSummary, setCalorieSummary] = useState(null);
  
  // Workout session state
  const [isWorkoutLogModalOpen, setIsWorkoutLogModalOpen] = useState(false);
  const [recentWorkoutSessions, setRecentWorkoutSessions] = useState([]);

  // Fetch workout plans from backend
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setIsLoadingWorkouts(true);
        setWorkoutError(null);
        
        // Check if user has a valid token
        const token = localStorage.getItem('token');
        if (!token) {
          setWorkoutError('Please login to view workouts');
          setWorkoutPlans([]);
          setIsLoadingWorkouts(false);
          return;
        }

        const plans = await workoutApi.getWorkoutPlans();
        setWorkoutPlans(Array.isArray(plans) ? plans : []);
      } catch (error) {
        console.error('Failed to fetch workouts:', error);
        setWorkoutError(error.message || 'Failed to load workouts. Please try again.');
        setWorkoutPlans([]);
      } finally {
        setIsLoadingWorkouts(false);
      }
    };

    fetchWorkouts();
  }, []);

  // Fetch health data
  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Fetch latest health metrics
          try {
            const metrics = await getLatestHealthMetrics();
            setLatestHealthMetrics(metrics);
          } catch (err) {
            console.log('No health metrics available yet');
          }

          // Fetch upcoming consultations
          try {
            const consultations = await getUserConsultations();
            const upcoming = consultations.filter(c => 
              c.status === 'SCHEDULED' && new Date(c.scheduledAt) > new Date()
            ).slice(0, 3);
            setUpcomingConsultations(upcoming);
          } catch (err) {
            console.log('No consultations available yet');
          }

          // Fetch calorie summary
          try {
            const summary = await getCalorieSummary();
            setCalorieSummary(summary);
          } catch (err) {
            console.log('No calorie data available yet');
          }

          // Fetch recent workout sessions
          try {
            const sessions = await getUserSessions();
            setRecentWorkoutSessions(Array.isArray(sessions) ? sessions.slice(0, 5) : []);
          } catch (err) {
            console.log('No workout sessions available yet');
          }
        }
      } catch (error) {
        console.error('Error fetching health data:', error);
      }
    };

    fetchHealthData();
  }, []);

  // Debug effect - log when calorieSummary changes
  useEffect(() => {
    if (calorieSummary) {
      console.log('Calorie Summary Updated:', {
        workoutMinutes: calorieSummary.workoutMinutes,
        caloriesBurned: calorieSummary.caloriesBurned,
        caloriesConsumed: calorieSummary.caloriesConsumed,
        netCalories: calorieSummary.netCalories
      });
    }
  }, [calorieSummary]);

  // Debug effect - log when recent workout sessions change
  useEffect(() => {
    if (recentWorkoutSessions.length > 0) {
      console.log('Recent Workout Sessions Updated:', recentWorkoutSessions);
    }
  }, [recentWorkoutSessions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    navigate('/');
  };

  const handleCreateWorkout = () => {
    setSelectedWorkout(null);
    setIsNewWorkout(true);
    setIsWorkoutModalOpen(true);
  };

  const handleEditWorkout = (workout) => {
    setSelectedWorkout(workout);
    setIsNewWorkout(false);
    setIsWorkoutModalOpen(true);
  };

  const handleSaveWorkout = async (workoutData) => {
    try {
      if (isNewWorkout) {
        const created = await workoutApi.createWorkoutPlan(workoutData);
        setWorkoutPlans([...workoutPlans, created]);
      } else {
        const updated = await workoutApi.updateWorkoutPlan(selectedWorkout.id, workoutData);
        setWorkoutPlans(workoutPlans.map(w =>
          w.id === selectedWorkout.id ? updated : w
        ));
      }
      setIsWorkoutModalOpen(false);
    } catch (error) {
      alert('Error saving workout: ' + error.message);
    }
  };

  const handleDeleteWorkout = async (id) => {
    if (window.confirm('Are you sure you want to delete this workout plan?')) {
      try {
        await workoutApi.deleteWorkoutPlan(id);
        setWorkoutPlans(workoutPlans.filter(w => w.id !== id));
      } catch (error) {
        alert('Error deleting workout: ' + error.message);
      }
    }
  };

  const handleStartWorkout = (workout) => {
    setSelectedWorkout(workout);
    setIsWorkoutExecutionOpen(true);
  };

  const handleWorkoutLogged = async () => {
    // Refresh calorie summary and workout sessions with a small delay to ensure backend persisted
    try {
      console.log('=== Starting Dashboard Refresh ===');
      
      // Wait a moment for backend to persist
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Fetch fresh data from backend
      console.log('Refreshing workout data after logging...');
      
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);

      const summary = await getCalorieSummary();
      console.log('Updated calorie summary:', summary);
      setCalorieSummary(summary);
      
      const sessions = await getUserSessions();
      console.log('Updated workout sessions:', sessions);
      console.log('Session count:', Array.isArray(sessions) ? sessions.length : 0);
      setRecentWorkoutSessions(Array.isArray(sessions) ? sessions.slice(0, 5) : []);
      
      console.log('=== Dashboard Refresh Complete ===');
    } catch (err) {
      console.error('=== Dashboard Refresh Error ===');
      console.error('Error refreshing workout data:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-primary-600">🌿 WellNest</span>
              <span className="text-sm text-gray-500">Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              {user?.role === 'ADMIN' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="text-sm text-primary-700 font-semibold"
                >
                  Admin Panel
                </button>
              )}
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="text-sm cursor-pointer" onClick={() => setIsProfileModalOpen(true)}>
                  <div className="font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                    {user?.name || 'WellNester'}
                    <span className="text-xs font-normal text-primary-600 ml-2">(Edit)</span>
                  </div>
                  <div className="text-gray-500 text-xs">{user?.email}</div>
                </div>
              </div>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100"
                >
                  Account
                  <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <button
                      onClick={() => { setIsPasswordModalOpen(true); setIsDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Change Password
                    </button>
                    <button
                      onClick={() => { setIsDeleteModalOpen(true); setIsDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete Account
                    </button>
                    <div className="h-px bg-gray-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <EditProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onUpdate={(updatedUser) => setUser(updatedUser)}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />

      <DeleteProfileModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />

      <WorkoutPlanDetailModal
        isOpen={isWorkoutModalOpen}
        onClose={() => setIsWorkoutModalOpen(false)}
        workout={selectedWorkout}
        onSave={handleSaveWorkout}
        isNewPlan={isNewWorkout}
      />

      <WorkoutPlanExecutionModal
        isOpen={isWorkoutExecutionOpen}
        onClose={() => setIsWorkoutExecutionOpen(false)}
        workout={selectedWorkout}
        onWorkoutComplete={handleWorkoutLogged}
      />

      <WorkoutLogModal
        isOpen={isWorkoutLogModalOpen}
        onClose={() => setIsWorkoutLogModalOpen(false)}
        onSuccess={handleWorkoutLogged}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name || 'WellNester'} 👋</h1>
            <p className="text-gray-600 mt-2">Here’s a snapshot of your progress and your membership.</p>
          </div>
          <button
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold shadow hover:bg-primary-700"
            onClick={() => navigate('/fitness-goals')}
          >
            Set Fitness Goals
          </button>
        </div>
        {/* Health & Medical Section */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Health & Medical</h2>
            <button
              onClick={() => navigate('/consult-doctor')}
              className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-2"
            >
              View All
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <button
              onClick={() => navigate('/consult-doctor')}
              className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <svg className="w-6 h-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Consult Doctor</h3>
              <p className="text-blue-100 text-sm">Find doctors and book appointments</p>
              {upcomingConsultations.length > 0 && (
                <div className="mt-4 bg-white/20 rounded-lg p-3">
                  <p className="text-xs text-blue-100">Next Appointment</p>
                  <p className="font-semibold text-sm">
                    {new Date(upcomingConsultations[0].scheduledAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </button>

            <button
              onClick={() => navigate('/medical-records')}
              className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <svg className="w-6 h-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Medical Records</h3>
              <p className="text-purple-100 text-sm">View and manage your health records</p>
            </button>

            <button
              onClick={() => navigate('/health-metrics')}
              className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <svg className="w-6 h-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Health Metrics</h3>
              <p className="text-green-100 text-sm">Track your vital signs and health data</p>
              {latestHealthMetrics?.bmi && (
                <div className="mt-4 bg-white/20 rounded-lg p-3">
                  <p className="text-xs text-green-100">Latest BMI</p>
                  <p className="font-semibold text-sm">{latestHealthMetrics.bmi.toFixed(1)}</p>
                </div>
              )}
            </button>
          </div>

          {/* Latest Health Metrics Summary */}
          {latestHealthMetrics && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Latest Health Readings</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {latestHealthMetrics.bloodPressureSystolic && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600">Blood Pressure</p>
                    <p className="text-lg font-bold text-red-600">
                      {latestHealthMetrics.bloodPressureSystolic}/{latestHealthMetrics.bloodPressureDiastolic}
                    </p>
                    <p className="text-xs text-gray-500">mmHg</p>
                  </div>
                )}
                {latestHealthMetrics.heartRate && (
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600">Heart Rate</p>
                    <p className="text-lg font-bold text-pink-600">{latestHealthMetrics.heartRate}</p>
                    <p className="text-xs text-gray-500">bpm</p>
                  </div>
                )}
                {latestHealthMetrics.bloodSugar && (
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600">Blood Sugar</p>
                    <p className="text-lg font-bold text-orange-600">{latestHealthMetrics.bloodSugar}</p>
                    <p className="text-xs text-gray-500">mg/dL</p>
                  </div>
                )}
                {latestHealthMetrics.oxygenSaturation && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600">Oxygen</p>
                    <p className="text-lg font-bold text-blue-600">{latestHealthMetrics.oxygenSaturation}%</p>
                    <p className="text-xs text-gray-500">SpO2</p>
                  </div>
                )}
                {latestHealthMetrics.weight && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600">Weight</p>
                    <p className="text-lg font-bold text-green-600">{latestHealthMetrics.weight}</p>
                    <p className="text-xs text-gray-500">kg</p>
                  </div>
                )}
                {latestHealthMetrics.bmi && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600">BMI</p>
                    <p className="text-lg font-bold text-purple-600">{latestHealthMetrics.bmi.toFixed(1)}</p>
                    <p className="text-xs text-gray-500">index</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Wellness Tools Section */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Wellness Tools</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => navigate('/fitness-goals')}
              className="bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <svg className="w-6 h-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Fitness Goals</h3>
              <p className="text-orange-100 text-sm">Set and track your fitness objectives</p>
            </button>

            <button
              onClick={() => navigate('/meal-tracker')}
              className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <svg className="w-6 h-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Meal Tracker</h3>
              <p className="text-teal-100 text-sm">Log meals and track calories intake</p>
            </button>

            <button
              onClick={() => navigate('/membership')}
              className="bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <svg className="w-6 h-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Membership</h3>
              <p className="text-pink-100 text-sm">Manage your WellNest plan</p>
            </button>

            <button
              onClick={() => navigate('/sleep-tracker')}
              className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <span className="text-4xl">😴</span>
                </div>
                <svg className="w-6 h-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Sleep & Hydration</h3>
              <p className="text-indigo-100 text-sm">Track sleep quality and water intake</p>
            </button>
          </div>
        </section>

        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mt-10">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-8">
            <div className="flex gap-4 overflow-x-auto">
              <button className="text-gray-900 font-semibold border-b-2 border-gray-900 pb-4 -mb-[18px] whitespace-nowrap">
                Fitness
              </button>
              {['Running', 'Cycling', 'Yoga', 'Swimming', 'Weightlifting'].map(type => {
                const count = recentWorkoutSessions.filter(s => s.workoutType === type).length;
                return (
                  <button 
                    key={type}
                    className="text-gray-400 font-medium pb-4 hover:text-gray-600 transition-colors whitespace-nowrap"
                  >
                    {type} {count > 0 && `(${count})`}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setIsWorkoutLogModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 ml-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Log Workout
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 relative overflow-hidden group hover:border-blue-200 transition-colors">
              <p className="text-sm font-medium text-gray-500 mb-1">Net Calories</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {calorieSummary ? `${calorieSummary.netCalories} cal` : 'Loading...'}
              </h3>
              {calorieSummary && (
                <div className="text-xs text-gray-600 mb-2">
                  <p className="text-green-600">+{calorieSummary.caloriesConsumed} consumed</p>
                  <p className="text-orange-600">-{calorieSummary.caloriesBurned} burned</p>
                </div>
              )}
              <div className="h-16 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData1}>
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={false} isAnimationActive={true} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 relative overflow-hidden group hover:border-green-200 transition-colors">
              <p className="text-sm font-medium text-gray-500 mb-1">Protein Intake</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {calorieSummary ? `${calorieSummary.totalProtein}g` : 'Loading...'}
              </h3>
              <div className="text-xs text-gray-600">Today's protein</div>
            </div>

            <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 relative overflow-hidden group hover:border-pink-200 transition-colors">
              <p className="text-sm font-medium text-gray-500 mb-1">Workout Time</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {calorieSummary?.workoutMinutes !== undefined && calorieSummary.workoutMinutes !== null 
                  ? `${calorieSummary.workoutMinutes} min` 
                  : recentWorkoutSessions.length > 0 
                    ? `${recentWorkoutSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0)} min`
                    : 'Loading...'}
              </h3>
              <div className="text-xs text-gray-600">Total exercise today</div>
            </div>

            <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 relative overflow-hidden group hover:border-purple-200 transition-colors">
              <p className="text-sm font-medium text-gray-500 mb-1">Calories Burned</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {calorieSummary?.caloriesBurned !== undefined && calorieSummary.caloriesBurned !== null 
                  ? `${calorieSummary.caloriesBurned} cal` 
                  : recentWorkoutSessions.length > 0 
                    ? `${recentWorkoutSessions.reduce((sum, s) => sum + (s.caloriesBurned || 0), 0)} cal`
                    : 'Loading...'}
              </h3>
              <div className="text-xs text-gray-600">From workouts</div>
            </div>
          </div>

          <div className="flex gap-8 mb-8">
            <button className="text-gray-400 font-medium hover:text-gray-600 transition-colors">Last Week</button>
            <button className="text-gray-900 font-semibold relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-gray-900">Last Month</button>
            <button className="text-gray-400 font-medium hover:text-gray-600 transition-colors">Last Year</button>
          </div>

          <div className="h-80 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mainChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={true} horizontal={false} stroke="#f1f5f9" strokeDasharray="3 3" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }} dx={-10} ticks={[100, 200, 300, 400]} domain={[0, 450]} />
                <RechartsTooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-gray-500">Weekly Activity</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-2">4 of 6 sessions</h3>
            <p className="text-sm text-green-600 mt-2">+12% vs last week</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-gray-500">Calories Burned</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-2">2,150 kcal</h3>
            <p className="text-sm text-primary-600 mt-2">On track with your goal</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-gray-500">Mindfulness Minutes</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-2">95 mins</h3>
            <p className="text-sm text-gray-600 mt-2">2 sessions remaining</p>
          </div>
        </section>

        {/* Recent Workout Sessions */}
        {recentWorkoutSessions.length > 0 && (
          <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mt-10">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Workouts</h2>
            <div className="space-y-3">
              {recentWorkoutSessions.map((session, idx) => (
                <div key={session.id || idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-2xl">
                        {session.workoutType === 'Running' ? '🏃' : 
                         session.workoutType === 'Cycling' ? '🚴' : 
                         session.workoutType === 'Yoga' ? '🧘' : 
                         session.workoutType === 'Swimming' ? '🏊' : 
                         session.workoutType === 'Weightlifting' ? '🏋️' : '🚶'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{session.workoutName || session.workoutType}</h3>
                      <p className="text-sm text-gray-500">
                        {session.durationMinutes} min · {session.caloriesBurned} cal burned
                        {session.completedAt && ` · ${new Date(session.completedAt).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
          <div className="bg-white rounded-2xl shadow p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Today's Menu</h2>
              <span className="text-xs text-gray-500">Personalized plan</span>
            </div>
            <div className="mt-6 space-y-4">
              {[{
                title: 'Breakfast',
                items: 'Greek yogurt, berries, chia seeds',
                calories: '320 kcal'
              }, {
                title: 'Lunch',
                items: 'Grilled chicken bowl, quinoa, greens',
                calories: '520 kcal'
              }, {
                title: 'Dinner',
                items: 'Salmon, roasted vegetables, brown rice',
                calories: '610 kcal'
              }].map((meal) => (
                <div key={meal.title} className="flex items-center justify-between border border-gray-100 rounded-xl p-4">
                  <div>
                    <p className="text-sm text-gray-500">{meal.title}</p>
                    <h3 className="text-base font-semibold text-gray-900">{meal.items}</h3>
                  </div>
                  <span className="text-sm font-semibold text-primary-600">{meal.calories}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900">Water Reminder</h2>
            <p className="text-sm text-gray-500 mt-2">Stay hydrated for optimal recovery.</p>
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Today</span>
                <span className="font-semibold text-gray-900">5 / 8 glasses</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-gray-100">
                <div className="h-2 rounded-full bg-sky-500" style={{ width: '62%' }} />
              </div>
              <button className="mt-6 w-full py-2 rounded-lg bg-sky-50 text-sky-700 font-semibold">Log a glass</button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900">Calories Tracker</h2>
            <p className="text-sm text-gray-500 mt-2">Daily goal: 2,100 kcal</p>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Consumed</span>
                <span className="font-semibold text-gray-900">1,450 kcal</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-gray-100">
                <div className="h-2 rounded-full bg-primary-500" style={{ width: '69%' }} />
              </div>
              <button className="mt-6 w-full py-2 rounded-lg border border-primary-600 text-primary-600 font-semibold">Add meal</button>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900">Health Tips</h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>• Take a 10-minute walk after meals.</li>
              <li>• Sleep 7-8 hours to boost recovery.</li>
              <li>• Add leafy greens for micronutrients.</li>
            </ul>
            <button className="mt-6 w-full py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold">View more tips</button>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900">Today's Focus</h2>
            <p className="text-sm text-gray-500 mt-2">Strength & Mobility</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-gray-100 p-4">
                <p className="text-sm text-gray-500">Workout</p>
                <h3 className="text-base font-semibold text-gray-900">Full-body stretch</h3>
              </div>
              <div className="rounded-xl border border-gray-100 p-4">
                <p className="text-sm text-gray-500">Mindfulness</p>
                <h3 className="text-base font-semibold text-gray-900">5-minute breathing reset</h3>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">💪 Your Workout Plans</h2>
              <p className="text-gray-600 mt-1">Manage and track your fitness routines</p>
            </div>
            <button
              onClick={handleCreateWorkout}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold shadow hover:bg-primary-700 transition-colors"
            >
              + New Workout
            </button>
          </div>

          {isLoadingWorkouts ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
                <p className="text-gray-600">Loading your workouts...</p>
              </div>
            </div>
          ) : workoutError ? (
            <div className="bg-red-50 border border-red-300 rounded-lg p-6 text-center">
              <p className="text-red-700 font-semibold mb-2">⚠️ Error Loading Workouts</p>
              <p className="text-red-600 text-sm mb-4">{workoutError}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          ) : workoutPlans && workoutPlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workoutPlans.map(workout => (
                <WorkoutPlanCard
                  key={workout.id}
                  workout={workout}
                  onStartWorkout={handleStartWorkout}
                  onEdit={handleEditWorkout}
                  onDelete={handleDeleteWorkout}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">No workout plans yet</p>
              <button
                onClick={handleCreateWorkout}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700"
              >
                Create Your First Workout
              </button>
            </div>
          )}
        </section>

        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Membership & Subscriptions</h2>
            <button className="text-primary-600 font-semibold">Manage billing</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{
              name: 'Starter',
              price: '$0',
              perks: ['Guided basics', 'Weekly check-ins', 'Community access'],
              accent: 'border-gray-200'
            }, {
              name: 'Balance',
              price: '$14 / mo',
              perks: ['Personalized plans', 'Workout library', 'Nutrition tracking'],
              accent: 'border-primary-500'
            }, {
              name: 'Elite',
              price: '$29 / mo',
              perks: ['1:1 coaching', 'Advanced analytics', 'Priority support'],
              accent: 'border-amber-400'
            }].map((plan) => (
              <div key={plan.name} className={`bg-white rounded-2xl shadow p-6 border-2 ${plan.accent}`}>
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="text-3xl font-bold text-gray-900 mt-3">{plan.price}</p>
                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                  {plan.perks.map((perk) => (
                    <li key={perk}>• {perk}</li>
                  ))}
                </ul>
                <button className="mt-6 w-full py-2 rounded-lg border border-primary-600 text-primary-600 font-semibold hover:bg-primary-50">
                  Choose {plan.name}
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
