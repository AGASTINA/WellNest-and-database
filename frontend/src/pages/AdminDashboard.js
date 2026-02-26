import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuthSession, getStoredUser } from '../utils/auth';
import EditAdminProfileModal from '../components/EditAdminProfileModal';
import ChangePasswordModal from '../components/ChangePasswordModal';
import DeleteProfileModal from '../components/DeleteProfileModal';
import { getCalorieSummary } from '../utils/calorieApi';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getStoredUser());
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientStats, setClientStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const dropdownRef = useRef(null);

  // Mock client data - in production this would come from backend
  const mockClients = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      joinDate: '2025-11-15',
      totalWorkouts: 24,
      workoutTime: 480,
      caloriesBurned: 3840,
      age: 35,
      weight: 85,
      height: 180,
      bloodType: 'O+',
      healthConditions: ['Pre-diabetes', 'High cortisol'],
      allergies: 'Penicillin',
      recentWorkouts: [
        { type: 'Cycling', duration: 60, calories: 480, date: '2026-02-26' },
        { type: 'Running', duration: 45, calories: 450, date: '2026-02-25' },
        { type: 'Weightlifting', duration: 50, calories: 300, date: '2026-02-24' }
      ]
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      joinDate: '2025-10-20',
      totalWorkouts: 31,
      workoutTime: 620,
      caloriesBurned: 5580,
      age: 28,
      weight: 62,
      height: 165,
      bloodType: 'A-',
      healthConditions: ['PCOS', 'Thyroid disorder'],
      allergies: 'Shellfish, Nuts',
      recentWorkouts: [
        { type: 'Yoga', duration: 45, calories: 180, date: '2026-02-26' },
        { type: 'Cycling', duration: 75, calories: 600, date: '2026-02-25' },
        { type: 'Swimming', duration: 40, calories: 320, date: '2026-02-24' }
      ]
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike@example.com',
      joinDate: '2025-09-10',
      totalWorkouts: 42,
      workoutTime: 840,
      caloriesBurned: 8400,
      age: 42,
      weight: 92,
      height: 178,
      bloodType: 'B+',
      healthConditions: ['Hypertension', 'Sleep apnea'],
      allergies: 'None',
      recentWorkouts: [
        { type: 'Weightlifting', duration: 60, calories: 360, date: '2026-02-26' },
        { type: 'Running', duration: 50, calories: 500, date: '2026-02-25' },
        { type: 'Cycling', duration: 90, calories: 720, date: '2026-02-24' }
      ]
    },
    {
      id: 4,
      name: 'Emma Davis',
      email: 'emma@example.com',
      joinDate: '2025-12-05',
      totalWorkouts: 15,
      workoutTime: 300,
      caloriesBurned: 2400,
      age: 31,
      weight: 58,
      height: 168,
      bloodType: 'AB+',
      healthConditions: ['Lower back pain', 'Mild anxiety'],
      allergies: 'Dairy',
      recentWorkouts: [
        { type: 'Running', duration: 35, calories: 350, date: '2026-02-26' },
        { type: 'Yoga', duration: 50, calories: 200, date: '2026-02-24' },
        { type: 'Cycling', duration: 45, calories: 360, date: '2026-02-22' }
      ]
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'david@example.com',
      joinDate: '2025-11-01',
      totalWorkouts: 28,
      workoutTime: 560,
      caloriesBurned: 4480,
      age: 45,
      weight: 88,
      height: 175,
      bloodType: 'O-',
      healthConditions: ['Arthritis', 'Osteoporosis risk'],
      allergies: 'Aspirin',
      recentWorkouts: [
        { type: 'Cycling', duration: 70, calories: 560, date: '2026-02-26' },
        { type: 'Weightlifting', duration: 55, calories: 330, date: '2026-02-25' },
        { type: 'Running', duration: 40, calories: 400, date: '2026-02-23' }
      ]
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setActiveTab('client-details');
    // Simulate fetching client stats
    setClientStats({
      avgWorkoutIntensity: 7.2,
      weeklyGoalProgress: 85,
      streakDays: 12
    });
  };

  const getWorkoutEmoji = (type) => {
    switch(type) {
      case 'Running': return '🏃';
      case 'Cycling': return '🚴';
      case 'Yoga': return '🧘';
      case 'Swimming': return '🏊';
      case 'Weightlifting': return '🏋️';
      default: return '💪';
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-primary-300">🌿 WellNest Admin</span>
              <span className="text-xs uppercase tracking-widest text-slate-400">Control Center</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-sm font-semibold text-slate-200"
              >
                User Dashboard
              </button>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 px-4 py-2 border border-slate-700 rounded-lg text-sm font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  <div className="text-right">
                    <div className="text-sm font-semibold">{user?.name || 'Admin'}</div>
                    <div className="text-xs text-slate-400">{user?.role || 'ADMIN'}</div>
                  </div>
                  <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 text-gray-800">
                    <button
                      onClick={() => { setIsProfileModalOpen(true); setIsDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-3 font-medium"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Edit Profile
                    </button>
                    <button
                      onClick={() => { setIsPasswordModalOpen(true); setIsDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-3 font-medium"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Change Password
                    </button>
                    <button
                      onClick={() => { setIsDeleteModalOpen(true); setIsDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Deactivate/Delete Account
                    </button>
                    <div className="h-px bg-gray-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-3 font-medium"
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

      <EditAdminProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onUpdate={(updatedUser) => setUser({ ...user, ...updatedUser })}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />

      <DeleteProfileModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-2 font-semibold transition-colors ${
              activeTab === 'overview' 
                ? 'text-primary-400 border-b-2 border-primary-400' 
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('clients')}
            className={`pb-4 px-2 font-semibold transition-colors ${
              activeTab === 'clients' 
                ? 'text-primary-400 border-b-2 border-primary-400' 
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Client Management
          </button>
          {selectedClient && (
            <button
              onClick={() => setActiveTab('client-details')}
              className={`pb-4 px-2 font-semibold transition-colors ${
                activeTab === 'client-details' 
                  ? 'text-primary-400 border-b-2 border-primary-400' 
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              {selectedClient.name}'s Progress
            </button>
          )}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold">Admin Overview</h1>
              <p className="text-slate-300 mt-2">Monitor engagement, revenue, and wellness programs from one place.</p>
            </div>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[{
                label: 'Active Members',
                value: '1,284',
                trend: '+4.2%'
              }, {
                label: 'Subscription Revenue',
                value: '$18.4k',
                trend: '+12%'
              }, {
                label: 'Coach Sessions',
                value: '312',
                trend: '+8%'
              }].map((item) => (
                <div key={item.label} className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <h3 className="text-2xl font-bold mt-2">{item.value}</h3>
                  <p className="text-sm text-emerald-400 mt-2">{item.trend} this month</p>
                </div>
              ))}
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                <h2 className="text-xl font-semibold">Membership Mix</h2>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between">
                    <span>Starter</span>
                    <span className="font-semibold text-white">42%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Balance</span>
                    <span className="font-semibold text-white">38%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Elite</span>
                    <span className="font-semibold text-white">20%</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                <h2 className="text-xl font-semibold">Progress Highlights</h2>
                <ul className="mt-4 space-y-3 text-sm text-slate-300">
                  <li>• 78% of members hit weekly activity goal</li>
                  <li>• Avg. calories tracked: 1,920 kcal</li>
                  <li>• 64% completed mindfulness streak</li>
                </ul>
              </div>
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                <h2 className="text-xl font-semibold">Subscription Health</h2>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between">
                    <span>New this month</span>
                    <span className="font-semibold text-emerald-400">+112</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Cancellations</span>
                    <span className="font-semibold text-rose-400">-18</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Churn rate</span>
                    <span className="font-semibold text-white">1.4%</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Client Management Tab */}
        {activeTab === 'clients' && (
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold">Client Management</h1>
              <p className="text-slate-300 mt-2">Monitor client fitness progress, workouts, and achievements.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Client List */}
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                <h2 className="text-xl font-semibold mb-4">Your Clients</h2>
                <div className="space-y-3">
                  {mockClients.map((client) => (
                    <div
                      key={client.id}
                      onClick={() => handleSelectClient(client)}
                      className={`p-4 rounded-xl cursor-pointer transition-all ${
                        selectedClient?.id === client.id
                          ? 'bg-primary-600 border border-primary-500'
                          : 'bg-slate-800 border border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{client.name}</h3>
                          <p className="text-sm text-slate-400">{client.email}</p>
                          <p className="text-xs text-slate-500 mt-1">Joined {client.joinDate}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">{client.totalWorkouts}</div>
                          <div className="text-xs text-slate-400">workouts</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Stats */}
              {selectedClient && (
                <div className="space-y-4">
                  <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                    <h2 className="text-xl font-semibold mb-4">{selectedClient.name} - Stats</h2>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-slate-400">Total Workout Time</span>
                          <span className="font-semibold">{selectedClient.workoutTime} min</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div className="bg-primary-500 h-2 rounded-full" style={{width: '65%'}}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-slate-400">Calories Burned</span>
                          <span className="font-semibold">{selectedClient.caloriesBurned} kcal</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div className="bg-emerald-500 h-2 rounded-full" style={{width: '72%'}}></div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-700">
                        <h3 className="font-semibold mb-3">Health Information</h3>
                        <div className="space-y-3 bg-slate-800 rounded-lg p-3 mb-4">
                          <div>
                            <span className="text-xs text-slate-400">Blood Type</span>
                            <div className="font-semibold text-primary-300">{selectedClient.bloodType}</div>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400">Allergies</span>
                            <div className="font-semibold text-orange-400">{selectedClient.allergies || 'None'}</div>
                          </div>
                          {selectedClient.healthConditions && selectedClient.healthConditions.length > 0 && (
                            <div>
                              <span className="text-xs text-slate-400">Health Conditions</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {selectedClient.healthConditions.map((condition, idx) => (
                                  <span key={idx} className="bg-red-900/50 text-red-200 text-xs px-2 py-1 rounded border border-red-700">
                                    ⚠️ {condition}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-700">
                        <h3 className="font-semibold mb-3">Recent Workouts</h3>
                        <div className="space-y-2">
                          {selectedClient.recentWorkouts.map((workout, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{getWorkoutEmoji(workout.type)}</span>
                                <div>
                                  <div className="font-semibold text-sm">{workout.type}</div>
                                  <div className="text-xs text-slate-500">{workout.date}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-semibold">{workout.duration} min</div>
                                <div className="text-xs text-slate-400">{workout.calories} cal</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Client Details Tab */}
        {activeTab === 'client-details' && selectedClient && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">{selectedClient.name}</h1>
                <p className="text-slate-300 mt-2">{selectedClient.email}</p>
              </div>
              <button
                onClick={() => setActiveTab('clients')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold transition-colors"
              >
                Back to Clients
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                <p className="text-sm text-slate-400">Total Workouts</p>
                <h3 className="text-3xl font-bold mt-2">{selectedClient.totalWorkouts}</h3>
                <p className="text-sm text-emerald-400 mt-2">✓ Consistent progress</p>
              </div>

              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                <p className="text-sm text-slate-400">Workout Intensity</p>
                <h3 className="text-3xl font-bold mt-2">{clientStats?.avgWorkoutIntensity}/10</h3>
                <p className="text-sm text-blue-400 mt-2">↑ Improving</p>
              </div>

              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                <p className="text-sm text-slate-400">Current Streak</p>
                <h3 className="text-3xl font-bold mt-2">{clientStats?.streakDays} days</h3>
                <p className="text-sm text-yellow-400 mt-2">🔥 Keep it going!</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Health Information Card */}
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                <h2 className="text-xl font-semibold mb-4">📋 Health Information</h2>
                <div className="space-y-4">
                  <div className="bg-slate-800 rounded-lg p-4">
                    <p className="text-sm text-slate-400 mb-1">Blood Type</p>
                    <p className="text-lg font-semibold text-primary-300">{selectedClient.bloodType}</p>
                  </div>

                  <div className="bg-slate-800 rounded-lg p-4">
                    <p className="text-sm text-slate-400 mb-1">Age</p>
                    <p className="text-lg font-semibold">{selectedClient.age} years old</p>
                  </div>

                  <div className="bg-slate-800 rounded-lg p-4">
                    <p className="text-sm text-slate-400 mb-1">Weight / Height</p>
                    <p className="text-lg font-semibold">{selectedClient.weight} kg / {selectedClient.height} cm</p>
                  </div>

                  <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-700">
                    <p className="text-sm text-orange-300 mb-2">⚠️ Allergies</p>
                    <p className="font-semibold text-orange-100">{selectedClient.allergies || 'None'}</p>
                  </div>

                  {selectedClient.healthConditions && selectedClient.healthConditions.length > 0 && (
                    <div className="bg-red-900/30 rounded-lg p-4 border border-red-700">
                      <p className="text-sm text-red-300 mb-2">🚨 Health Conditions</p>
                      <div className="space-y-2">
                        {selectedClient.healthConditions.map((condition, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                            <span className="text-red-100">{condition}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                <h2 className="text-xl font-semibold mb-4">Client Profile</h2>
                <div className="space-y-3 text-sm text-slate-300">
                  <div className="flex justify-between">
                    <span>Joined</span>
                    <span className="font-semibold">{selectedClient.joinDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Workouts</span>
                    <span className="font-semibold text-emerald-400">{selectedClient.totalWorkouts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Time</span>
                    <span className="font-semibold text-blue-400">{selectedClient.workoutTime} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Calories Burned</span>
                    <span className="font-semibold text-yellow-400">{selectedClient.caloriesBurned} kcal</span>
                  </div>
                  <div className="h-px bg-slate-700 my-2"></div>
                  <div className="flex justify-between">
                    <span>Consistency</span>
                    <span className="font-semibold text-primary-300">82%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
              <h2 className="text-xl font-semibold mb-4">Workout Breakdown</h2>
              <div className="space-y-4">
                {Object.entries(
                  selectedClient.recentWorkouts.reduce((acc, workout) => {
                    acc[workout.type] = (acc[workout.type] || 0) + 1;
                    return acc;
                  }, {})
                ).map(([type, count]) => (
                  <div key={type}>
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getWorkoutEmoji(type)}</span>
                        <span className="font-semibold">{type}</span>
                      </div>
                      <span className="text-slate-400">{count} sessions</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full" 
                        style={{width: `${(count / selectedClient.totalWorkouts) * 100}%`}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
              <h2 className="text-xl font-semibold mb-4">All Recent Workouts</h2>
              <div className="space-y-3">
                {selectedClient.recentWorkouts.map((workout, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{getWorkoutEmoji(workout.type)}</span>
                      <div>
                        <h3 className="font-semibold">{workout.type}</h3>
                        <p className="text-sm text-slate-400">{workout.date}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-semibold text-lg">{workout.duration} min</div>
                      <div className="text-sm text-emerald-400">{workout.calories} cal burned</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
