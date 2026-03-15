import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuthSession, getStoredUser } from '../utils/auth';
import EditAdminProfileModal from '../components/EditAdminProfileModal';
import ChangePasswordModal from '../components/ChangePasswordModal';
import DeleteProfileModal from '../components/DeleteProfileModal';

const ConditionEditor = ({ conditions, onSave, onCancel }) => {
  const [items, setItems] = React.useState(conditions ? [...conditions] : []);
  const [newItem, setNewItem] = React.useState('');
  return (
    <div className="bg-slate-800 rounded-lg p-3 border border-slate-600 min-w-[220px]">
      <div className="flex flex-wrap gap-1 mb-2">
        {items.map((c, i) => (
          <span key={i} className="flex items-center gap-1 text-xs bg-slate-700 text-slate-200 px-2 py-0.5 rounded-full">
            {c}
            <button onClick={() => setItems(items.filter((_,j) => j !== i))} className="text-red-400 hover:text-red-300 ml-1 font-bold">×</button>
          </span>
        ))}
        {items.length === 0 && <span className="text-xs text-slate-500">No conditions</span>}
      </div>
      <div className="flex gap-1">
        <input
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && newItem.trim()) { setItems([...items, newItem.trim()]); setNewItem(''); } }}
          placeholder="Add condition..."
          className="flex-1 text-xs bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <button onClick={() => { if (newItem.trim()) { setItems([...items, newItem.trim()]); setNewItem(''); } }}
          className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-500">+</button>
      </div>
      <div className="flex gap-2 mt-2">
        <button onClick={() => onSave(items)} className="flex-1 text-xs py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold">Save</button>
        <button onClick={onCancel} className="flex-1 text-xs py-1 bg-slate-600 hover:bg-slate-500 text-white rounded">Cancel</button>
      </div>
    </div>
  );
};

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
  const [leaderboardSort, setLeaderboardSort] = useState('score');
  const [editingConditions, setEditingConditions] = useState(null); // client id being edited
  const [clients, setClients] = useState(null); // will be set from mockClients on mount
  const dropdownRef = useRef(null);

  // Curated admin dataset shaped like the user experience pages: fitness, sleep, goals, and medical notes.
  const mockClients = [
    {
      id: 100,
      name: 'Agastina P',
      email: 'agastinaviyagappan@gmail.com',
      joinDate: '2026-01-08',
      totalWorkouts: 46,
      workoutTime: 910,
      caloriesBurned: 7680,
      age: 24,
      weight: 63,
      height: 165,
      bloodType: 'O+',
      bmi: 23.1,
      membershipPlan: 'Elite',
      goalFocus: 'Recomposition & endurance',
      activeGoal: '10k daily steps and 5 workout sessions per week',
      avgSleepHours: 7.6,
      sleepQuality: 4.4,
      hydrationLiters: 2.7,
      adherence: 91,
      medicalRecordCount: 4,
      lastCheckIn: '2026-03-13',
      healthConditions: ['Mild iron deficiency', 'Occasional migraine'],
      allergies: 'None',
      latestVitals: {
        bloodPressure: '112/74 mmHg',
        heartRate: '72 bpm',
        oxygen: '99%',
        bloodSugar: '92 mg/dL'
      },
      recentWorkouts: [
        { type: 'Running', duration: 42, calories: 420, date: '2026-03-13' },
        { type: 'Weightlifting', duration: 55, calories: 340, date: '2026-03-12' },
        { type: 'Yoga', duration: 35, calories: 160, date: '2026-03-11' }
      ]
    },
    {
      id: 2,
      name: 'Lkihitha',
      email: 'lkihitha@wellnest.com',
      joinDate: '2025-10-20',
      totalWorkouts: 41,
      workoutTime: 760,
      caloriesBurned: 9200,
      age: 28,
      weight: 62,
      height: 165,
      bloodType: 'A-',
      bmi: 22.8,
      membershipPlan: 'Premium',
      goalFocus: 'Strength, recovery & mental balance',
      activeGoal: 'Improve energy consistency, preserve lean mass, and keep sleep above 7 hours',
      avgSleepHours: 7.3,
      sleepQuality: 4.1,
      hydrationLiters: 2.4,
      adherence: 88,
      medicalRecordCount: 5,
      lastCheckIn: '2026-03-11',
      healthConditions: ['Mild stress'],
      allergies: 'Shellfish, Nuts',
      latestVitals: {
        bloodPressure: '116/76 mmHg',
        heartRate: '74 bpm',
        oxygen: '99%',
        bloodSugar: '97 mg/dL'
      },
      recentWorkouts: [
        { type: 'Cycling', duration: 85, calories: 680, date: '2026-03-13' },
        { type: 'Swimming', duration: 55, calories: 420, date: '2026-03-12' },
        { type: 'Yoga', duration: 45, calories: 210, date: '2026-03-11' }
      ]
    },
    {
      id: 1,
      name: 'Lokesh Moodu',
      email: 'lokesh.moodu@wellnest.com',
      joinDate: '2025-11-15',
      totalWorkouts: 47,
      workoutTime: 500,
      caloriesBurned: 3900,
      age: 35,
      weight: 85,
      height: 180,
      bloodType: 'O+',
      bmi: 26.2,
      membershipPlan: 'Premium',
      goalFocus: 'Fat loss & movement consistency',
      activeGoal: 'Improve weekly training volume and maintain joint-friendly routines',
      avgSleepHours: 6.8,
      sleepQuality: 3.6,
      hydrationLiters: 2.0,
      adherence: 83,
      medicalRecordCount: 3,
      lastCheckIn: '2026-03-10',
      healthConditions: ['Mild lower back pain'],
      allergies: 'Penicillin',
      latestVitals: {
        bloodPressure: '124/80 mmHg',
        heartRate: '78 bpm',
        oxygen: '98%',
        bloodSugar: '101 mg/dL'
      },
      recentWorkouts: [
        { type: 'Weightlifting', duration: 58, calories: 360, date: '2026-03-13' },
        { type: 'Cycling', duration: 62, calories: 470, date: '2026-03-12' },
        { type: 'Walking', duration: 50, calories: 240, date: '2026-03-11' }
      ]
    },
    {
      id: 101,
      name: 'Tina',
      email: 'pagastina@gmail.com',
      joinDate: '2026-01-14',
      totalWorkouts: 34,
      workoutTime: 650,
      caloriesBurned: 5220,
      age: 23,
      weight: 59,
      height: 162,
      bloodType: 'A+',
      bmi: 22.5,
      membershipPlan: 'Balance',
      goalFocus: 'Mobility & consistency',
      activeGoal: 'Maintain 8k steps, improve sleep schedule, and log hydration daily',
      avgSleepHours: 7.2,
      sleepQuality: 4.0,
      hydrationLiters: 2.3,
      adherence: 86,
      medicalRecordCount: 2,
      lastCheckIn: '2026-03-12',
      healthConditions: ['Vitamin D deficiency'],
      allergies: 'Dust',
      latestVitals: {
        bloodPressure: '114/76 mmHg',
        heartRate: '74 bpm',
        oxygen: '98%',
        bloodSugar: '95 mg/dL'
      },
      recentWorkouts: [
        { type: 'Cycling', duration: 50, calories: 410, date: '2026-03-13' },
        { type: 'Yoga', duration: 40, calories: 170, date: '2026-03-12' },
        { type: 'Walking', duration: 48, calories: 220, date: '2026-03-11' }
      ]
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike@example.com',
      joinDate: '2025-09-10',
      totalWorkouts: 36,
      workoutTime: 720,
      caloriesBurned: 7600,
      age: 42,
      weight: 92,
      height: 178,
      bloodType: 'B+',
      bmi: 29.0,
      membershipPlan: 'Elite',
      goalFocus: 'Cardio capacity & blood-pressure control',
      activeGoal: 'Drop 5kg while sustaining 12 active days streak',
      avgSleepHours: 6.2,
      sleepQuality: 3.1,
      hydrationLiters: 1.9,
      adherence: 74,
      medicalRecordCount: 6,
      lastCheckIn: '2026-03-13',
      healthConditions: ['Hypertension', 'Sleep apnea'],
      allergies: 'None',
      latestVitals: {
        bloodPressure: '136/88 mmHg',
        heartRate: '84 bpm',
        oxygen: '96%',
        bloodSugar: '107 mg/dL'
      },
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
      bmi: 20.5,
      membershipPlan: 'Starter',
      goalFocus: 'Posture & recovery',
      activeGoal: 'Improve lower-back resilience with mobility sessions',
      avgSleepHours: 7.8,
      sleepQuality: 4.1,
      hydrationLiters: 2.0,
      adherence: 72,
      medicalRecordCount: 2,
      lastCheckIn: '2026-03-09',
      healthConditions: ['Lower back pain', 'Mild anxiety'],
      allergies: 'Dairy',
      latestVitals: {
        bloodPressure: '110/72 mmHg',
        heartRate: '70 bpm',
        oxygen: '99%',
        bloodSugar: '90 mg/dL'
      },
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
      bmi: 28.7,
      membershipPlan: 'Balance',
      goalFocus: 'Joint-friendly strength training',
      activeGoal: 'Protect bone health and keep 3 strength sessions weekly',
      avgSleepHours: 6.8,
      sleepQuality: 3.3,
      hydrationLiters: 2.0,
      adherence: 74,
      medicalRecordCount: 5,
      lastCheckIn: '2026-03-08',
      healthConditions: ['Arthritis', 'Osteoporosis risk'],
      allergies: 'Aspirin',
      latestVitals: {
        bloodPressure: '130/82 mmHg',
        heartRate: '79 bpm',
        oxygen: '97%',
        bloodSugar: '103 mg/dL'
      },
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

  // Initialize clients state from mockClients
  useEffect(() => { setClients(mockClients); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getFitnessScore = (client) =>
    client.totalWorkouts * 10 + Math.round(client.caloriesBurned / 100) + Math.round(client.workoutTime / 10);

  const getConditionSeverity = (conditions) => {
    if (!conditions || conditions.length === 0) return 'good';
    const critical = ['Hypertension', 'Pre-diabetes', 'Sleep apnea', 'Arthritis', 'Osteoporosis risk', 'PCOS', 'Thyroid disorder'];
    if (conditions.some(c => critical.some(k => c.toLowerCase().includes(k.toLowerCase())))) return 'critical';
    return 'moderate';
  };

  const handleUpdateConditions = (clientId, newConditions) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, healthConditions: newConditions } : c));
    setEditingConditions(null);
  };

  const members = clients || mockClients;
  const membershipValueMap = { Starter: 999, Balance: 1999, Premium: 2799, Elite: 3499 };
  const averageAdherence = Math.round(members.reduce((sum, client) => sum + (client.adherence || 0), 0) / members.length);
  const estimatedMonthlyRevenue = members
    .reduce((sum, client) => sum + (membershipValueMap[client.membershipPlan] || 0), 0)
    .toLocaleString('en-IN');
  const activeCareAlerts = members.filter(client => getConditionSeverity(client.healthConditions) === 'critical').length;
  const priorityMember = members.find(client => client.email === 'agastinaviyagappan@gmail.com') || members[0];
  const hydrationAverage = (members.reduce((sum, client) => sum + (client.hydrationLiters || 0), 0) / members.length).toFixed(1);

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
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`pb-4 px-2 font-semibold transition-colors ${
              activeTab === 'leaderboard' 
                ? 'text-yellow-400 border-b-2 border-yellow-400' 
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            🏆 Leaderboard
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
                value: members.length,
                trend: '+2 this week'
              }, {
                label: 'Subscription Revenue',
                value: `₹${estimatedMonthlyRevenue}`,
                trend: 'estimated monthly'
              }, {
                label: 'Care Alerts',
                value: activeCareAlerts,
                trend: `${averageAdherence}% avg adherence`
              }].map((item) => (
                <div key={item.label} className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <h3 className="text-2xl font-bold mt-2">{item.value}</h3>
                  <p className="text-sm text-emerald-400 mt-2">{item.trend} this month</p>
                </div>
              ))}
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 rounded-2xl p-6 border border-slate-800">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-yellow-400">Member spotlight</p>
                    <h2 className="text-2xl font-semibold mt-2">{priorityMember.name}</h2>
                    <p className="text-slate-300 mt-2 max-w-2xl">
                      Elite member with strong adherence, consistent recovery, and a user profile that mirrors the fitness goals, sleep, and medical pages.
                    </p>
                  </div>
                  <div className="px-4 py-2 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 text-sm font-semibold">
                    {priorityMember.membershipPlan} plan
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-slate-800/70 rounded-xl p-4 border border-slate-700">
                    <p className="text-xs text-slate-400">Goal focus</p>
                    <p className="font-semibold mt-2">{priorityMember.goalFocus}</p>
                  </div>
                  <div className="bg-slate-800/70 rounded-xl p-4 border border-slate-700">
                    <p className="text-xs text-slate-400">Avg sleep</p>
                    <p className="font-semibold mt-2">{priorityMember.avgSleepHours} hrs</p>
                  </div>
                  <div className="bg-slate-800/70 rounded-xl p-4 border border-slate-700">
                    <p className="text-xs text-slate-400">Hydration</p>
                    <p className="font-semibold mt-2">{priorityMember.hydrationLiters} L/day</p>
                  </div>
                  <div className="bg-slate-800/70 rounded-xl p-4 border border-slate-700">
                    <p className="text-xs text-slate-400">Adherence</p>
                    <p className="font-semibold mt-2 text-emerald-400">{priorityMember.adherence}%</p>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-slate-800/70 border border-slate-700">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Current target</p>
                  <p className="mt-2 text-slate-100">{priorityMember.activeGoal}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm">
                    <div>
                      <span className="text-slate-500">Blood pressure</span>
                      <div className="font-semibold mt-1">{priorityMember.latestVitals.bloodPressure}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Heart rate</span>
                      <div className="font-semibold mt-1">{priorityMember.latestVitals.heartRate}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Oxygen</span>
                      <div className="font-semibold mt-1">{priorityMember.latestVitals.oxygen}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Blood sugar</span>
                      <div className="font-semibold mt-1">{priorityMember.latestVitals.bloodSugar}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                <h2 className="text-xl font-semibold">Program pulse</h2>
                <div className="mt-4 space-y-4 text-sm text-slate-300">
                  <div className="flex items-center justify-between">
                    <span>Avg adherence</span>
                    <span className="font-semibold text-emerald-400">{averageAdherence}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Avg hydration</span>
                    <span className="font-semibold text-cyan-300">{hydrationAverage} L</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Records to review</span>
                    <span className="font-semibold text-white">{members.reduce((sum, client) => sum + client.medicalRecordCount, 0)}</span>
                  </div>
                  <div className="h-px bg-slate-800"></div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Needs attention</p>
                    <div className="space-y-2">
                      {members
                        .filter(client => getConditionSeverity(client.healthConditions) === 'critical')
                        .slice(0, 3)
                        .map(client => (
                          <button
                            key={client.id}
                            onClick={() => handleSelectClient(client)}
                            className="w-full text-left p-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                          >
                            <div className="font-semibold text-white">{client.name}</div>
                            <div className="text-xs text-slate-400 mt-1">{client.healthConditions.join(' • ')}</div>
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && clients && (
          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold">🏆 User Leaderboard</h1>
                <p className="text-slate-300 mt-2">All users ranked by fitness activity — with live health condition tracking.</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[{key:'score',label:'Fitness Score'},{key:'workouts',label:'Workouts'},{key:'calories',label:'Calories'},{key:'time',label:'Time'}].map(({key,label}) => (
                  <button key={key} onClick={() => setLeaderboardSort(key)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors border ${
                      leaderboardSort === key ? 'bg-yellow-500 text-slate-900 border-yellow-500' : 'bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700'
                    }`}>{label}</button>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex gap-4 flex-wrap text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> No conditions</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span> Moderate concern</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> Critical condition</span>
            </div>

            {/* Leaderboard Table */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wide">
                      <th className="py-4 px-4 text-left w-10">Rank</th>
                      <th className="py-4 px-4 text-left">User</th>
                      <th className="py-4 px-4 text-left">Health Conditions</th>
                      <th className="py-4 px-4 text-center">Workouts</th>
                      <th className="py-4 px-4 text-center">Cal Burned</th>
                      <th className="py-4 px-4 text-center">Time (min)</th>
                      <th className="py-4 px-4 text-center">Fitness Score</th>
                      <th className="py-4 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...clients].sort((a, b) => {
                      if (leaderboardSort === 'workouts') return b.totalWorkouts - a.totalWorkouts;
                      if (leaderboardSort === 'calories') return b.caloriesBurned - a.caloriesBurned;
                      if (leaderboardSort === 'time') return b.workoutTime - a.workoutTime;
                      return getFitnessScore(b) - getFitnessScore(a);
                    }).map((client, idx) => {
                      const severity = getConditionSeverity(client.healthConditions);
                      const score = getFitnessScore(client);
                      const maxScore = getFitnessScore([...clients].sort((a,b) => getFitnessScore(b)-getFitnessScore(a))[0]);
                      const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx+1}`;
                      return (
                        <tr key={client.id} className={`border-b border-slate-800 hover:bg-slate-800/60 transition-colors ${
                          idx === 0 ? 'bg-yellow-500/5' : ''
                        }`}>
                          <td className="py-4 px-4">
                            <span className="text-lg font-bold">{medal}</span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                severity === 'good' ? 'bg-emerald-500' : severity === 'moderate' ? 'bg-yellow-500' : 'bg-red-500'
                              }`}></div>
                              <div>
                                <div className="font-semibold text-white">{client.name}</div>
                                <div className="text-xs text-slate-500">{client.email}</div>
                                <div className="text-xs text-slate-600 mt-0.5">{client.age}y · {client.weight}kg · {client.bloodType}</div>
                                <div className="text-xs text-slate-400 mt-1">{client.membershipPlan} · {client.goalFocus}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 max-w-xs">
                            {editingConditions === client.id ? (
                              <ConditionEditor
                                conditions={client.healthConditions}
                                onSave={(updated) => handleUpdateConditions(client.id, updated)}
                                onCancel={() => setEditingConditions(null)}
                              />
                            ) : (
                              <div className="flex flex-wrap gap-1">
                                {client.healthConditions && client.healthConditions.length > 0
                                  ? client.healthConditions.map((cond, i) => (
                                      <span key={i} className={`text-xs px-2 py-0.5 rounded-full border ${
                                        severity === 'critical'
                                          ? 'bg-red-900/40 text-red-300 border-red-700'
                                          : 'bg-yellow-900/40 text-yellow-300 border-yellow-700'
                                      }`}>⚠️ {cond}</span>
                                    ))
                                  : <span className="text-xs text-emerald-400 font-medium">✓ No conditions</span>
                                }
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-4 text-center font-semibold text-emerald-400">{client.totalWorkouts}</td>
                          <td className="py-4 px-4 text-center font-semibold text-orange-400">{client.caloriesBurned.toLocaleString()}</td>
                          <td className="py-4 px-4 text-center font-semibold text-blue-400">{client.workoutTime}</td>
                          <td className="py-4 px-4">
                            <div className="flex flex-col items-center gap-1">
                              <span className="font-bold text-yellow-300 text-base">{score}</span>
                              <div className="w-20 bg-slate-700 rounded-full h-1.5">
                                <div className="bg-yellow-400 h-1.5 rounded-full" style={{width: `${(score/maxScore)*100}%`}}></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex flex-col gap-2 items-center">
                              <button
                                onClick={() => handleSelectClient(client)}
                                className="px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
                              >
                                View details
                              </button>
                              <button
                                onClick={() => setEditingConditions(editingConditions === client.id ? null : client.id)}
                                className="px-3 py-1 text-xs bg-blue-700 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                              >
                                {editingConditions === client.id ? 'Cancel' : 'Edit conditions'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-center">
                <div className="text-2xl font-bold text-emerald-400">{clients.filter(c => getConditionSeverity(c.healthConditions) === 'good').length}</div>
                <div className="text-xs text-slate-400 mt-1">Healthy users</div>
              </div>
              <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-center">
                <div className="text-2xl font-bold text-yellow-400">{clients.filter(c => getConditionSeverity(c.healthConditions) === 'moderate').length}</div>
                <div className="text-xs text-slate-400 mt-1">Moderate concern</div>
              </div>
              <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-center">
                <div className="text-2xl font-bold text-red-400">{clients.filter(c => getConditionSeverity(c.healthConditions) === 'critical').length}</div>
                <div className="text-xs text-slate-400 mt-1">Need attention</div>
              </div>
              <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-center">
                <div className="text-2xl font-bold text-white">{clients.reduce((s,c) => s + c.totalWorkouts, 0)}</div>
                <div className="text-xs text-slate-400 mt-1">Total workouts logged</div>
              </div>
            </div>
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
                  {(clients || mockClients).map((client) => (
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

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
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

              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                <p className="text-sm text-slate-400">Sleep Average</p>
                <h3 className="text-3xl font-bold mt-2">{selectedClient.avgSleepHours} hrs</h3>
                <p className="text-sm text-indigo-400 mt-2">Quality {selectedClient.sleepQuality}/5</p>
              </div>

              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                <p className="text-sm text-slate-400">Hydration</p>
                <h3 className="text-3xl font-bold mt-2">{selectedClient.hydrationLiters} L</h3>
                <p className="text-sm text-cyan-400 mt-2">Daily average</p>
              </div>

              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                <p className="text-sm text-slate-400">Membership</p>
                <h3 className="text-3xl font-bold mt-2">{selectedClient.membershipPlan}</h3>
                <p className="text-sm text-primary-300 mt-2">{selectedClient.adherence}% adherence</p>
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

                  <div className="bg-slate-800 rounded-lg p-4">
                    <p className="text-sm text-slate-400 mb-1">BMI</p>
                    <p className="text-lg font-semibold">{selectedClient.bmi}</p>
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
                    <span>Plan</span>
                    <span className="font-semibold text-yellow-300">{selectedClient.membershipPlan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Goal Focus</span>
                    <span className="font-semibold text-slate-100">{selectedClient.goalFocus}</span>
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
                    <span className="font-semibold text-primary-300">{selectedClient.adherence}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medical Records</span>
                    <span className="font-semibold text-rose-300">{selectedClient.medicalRecordCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Check-in</span>
                    <span className="font-semibold text-slate-100">{selectedClient.lastCheckIn}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                <h2 className="text-xl font-semibold mb-4">🎯 Goal & Recovery Snapshot</h2>
                <div className="space-y-4 text-sm text-slate-300">
                  <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Active goal</p>
                    <p className="mt-2 text-slate-100">{selectedClient.activeGoal}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                      <p className="text-xs text-slate-500">Sleep quality</p>
                      <p className="font-semibold mt-2 text-indigo-300">{selectedClient.sleepQuality}/5</p>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                      <p className="text-xs text-slate-500">Hydration average</p>
                      <p className="font-semibold mt-2 text-cyan-300">{selectedClient.hydrationLiters} L/day</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                <h2 className="text-xl font-semibold mb-4">🩺 Latest Vitals</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <p className="text-xs text-slate-500">Blood Pressure</p>
                    <p className="font-semibold mt-2">{selectedClient.latestVitals.bloodPressure}</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <p className="text-xs text-slate-500">Heart Rate</p>
                    <p className="font-semibold mt-2">{selectedClient.latestVitals.heartRate}</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <p className="text-xs text-slate-500">Oxygen Saturation</p>
                    <p className="font-semibold mt-2">{selectedClient.latestVitals.oxygen}</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <p className="text-xs text-slate-500">Blood Sugar</p>
                    <p className="font-semibold mt-2">{selectedClient.latestVitals.bloodSugar}</p>
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
