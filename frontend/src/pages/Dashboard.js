import React from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuthSession, getStoredUser, getToken } from '../utils/auth';
import EditProfileModal from '../components/EditProfileModal';
import ChangePasswordModal from '../components/ChangePasswordModal';
import DeleteProfileModal from '../components/DeleteProfileModal';
import WorkoutPlanCard from '../components/WorkoutPlanCard';
import WorkoutPlanDetailModal from '../components/WorkoutPlanDetailModal';
import WorkoutPlanExecutionModal from '../components/WorkoutPlanExecutionModal';
import WorkoutLogModal from '../components/WorkoutLogModal';
import workoutApi from '../utils/workoutApi';
import { getLatestHealthMetrics, getUserConsultations, getUserMedicalRecords } from '../utils/medicalApi';
import { deleteWorkoutSession, getCalorieSummary, getUserSessions, updateWorkoutSession } from '../utils/calorieApi';
import { getUserMeals } from '../utils/mealsApi';
import { getUserSleepLogs, logSleep, updateSleep, getSleepByDate } from '../utils/sleepApi';
import BMICalculator from '../components/BMICalculator';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';

const sparklineData1 = [{ value: 310 }, { value: 320 }, { value: 290 }, { value: 345 }, { value: 335 }, { value: 360 }, { value: 345 }];

const asNumber = (...values) => {
  for (const value of values) {
    if (value === null || value === undefined || value === '') continue;
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
};

const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

const getScoreLabel = (score) => {
  if (score >= 80) return 'Good';
  if (score >= 60) return 'Average';
  return 'Low';
};

const isAuthAccessIssue = (message = '') => {
  const value = String(message || '').toLowerCase();
  return value.includes('invalid or expired token')
    || value.includes('missing or invalid authorization')
    || value.includes('session expired')
    || value.includes('user not found with id')
    || value.includes('forbidden')
    || value.includes('unauthorized');
};

const getLocalDateKey = (value) => {
  if (!value) return null;

  const raw = String(value);
  const direct = raw.match(/^(\d{4}-\d{2}-\d{2})/);
  if (direct) return direct[1];

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  const y = parsed.getFullYear();
  const m = String(parsed.getMonth() + 1).padStart(2, '0');
  const d = String(parsed.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const getRecentDateKeys = (days = 7) => {
  const list = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    list.push(getLocalDateKey(d));
  }
  return list;
};

const formatDateKey = (date) => {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const formatLocalToday = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const buildChartDataByPeriod = (sessions, meals, period, metric = 'burned', activeWorkoutType = 'All') => {
  const safeSessions = Array.isArray(sessions) ? sessions : [];
  const safeMeals = Array.isArray(meals) ? meals : [];

  const filteredSessions = activeWorkoutType === 'All'
    ? safeSessions
    : safeSessions.filter((session) => session?.workoutType === activeWorkoutType);

  const sessionEntries = filteredSessions
    .map((session) => {
      const completedAt = session?.completedAt || session?.createdAt || session?.sessionDate;
      const parsed = completedAt ? new Date(completedAt) : null;
      if (!parsed || Number.isNaN(parsed.getTime())) return null;
      return {
        date: parsed,
        calories: asNumber(session?.caloriesBurned, session?.calories, session?.burnedCalories)
      };
    })
    .filter(Boolean);

  const mealEntries = safeMeals
    .map((meal) => {
      const mealAt = meal?.mealDate || meal?.createdAt;
      const parsed = mealAt ? new Date(mealAt) : null;
      if (!parsed || Number.isNaN(parsed.getTime())) return null;
      return {
        date: parsed,
        calories: asNumber(meal?.calories, meal?.totalCalories)
      };
    })
    .filter(Boolean);

  const allDates = [...sessionEntries, ...mealEntries].map((entry) => entry.date.getTime());
  const anchorDate = allDates.length > 0 ? new Date(Math.max(...allDates)) : new Date();
  anchorDate.setHours(0, 0, 0, 0);

  const resolveValue = (consumed, burned) => {
    if (metric === 'consumed') return consumed;
    if (metric === 'net') return consumed - burned;
    return burned;
  };

  const buildDailyPoints = (days, labelFormatter) => {
    const startDate = new Date(anchorDate);
    startDate.setDate(anchorDate.getDate() - (days - 1));

    const points = [];
    for (let i = 0; i < days; i += 1) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const key = formatDateKey(d);

      const dayBurned = sessionEntries
        .filter((e) => formatDateKey(e.date) === key)
        .reduce((sum, e) => sum + e.calories, 0);
      const dayConsumed = mealEntries
        .filter((e) => formatDateKey(e.date) === key)
        .reduce((sum, e) => sum + e.calories, 0);

      points.push({
        name: labelFormatter(d),
        value: resolveValue(dayConsumed, dayBurned)
      });
    }

    return points;
  };

  if (period === 'week') {
    return buildDailyPoints(7, (date) => date.toLocaleDateString(undefined, { weekday: 'short' }));
  }

  if (period === 'month') {
    return buildDailyPoints(30, (date) => `${date.getDate()}`);
  }

  const monthTotals = new Map();
  for (let i = 11; i >= 0; i -= 1) {
    const d = new Date(anchorDate.getFullYear(), anchorDate.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    monthTotals.set(key, {
      name: d.toLocaleDateString(undefined, { month: 'short' }),
      consumed: 0,
      burned: 0,
      value: 0
    });
  }

  sessionEntries.forEach((e) => {
    const key = `${e.date.getFullYear()}-${e.date.getMonth()}`;
    if (monthTotals.has(key)) {
      monthTotals.get(key).burned += e.calories;
    }
  });

  mealEntries.forEach((e) => {
    const key = `${e.date.getFullYear()}-${e.date.getMonth()}`;
    if (monthTotals.has(key)) {
      monthTotals.get(key).consumed += e.calories;
    }
  });

  return Array.from(monthTotals.values()).map((item) => ({
    name: item.name,
    value: resolveValue(item.consumed, item.burned)
  }));
};

const workoutTypeList = [
  { label: 'All', icon: '🏅' },
  { label: 'Running', icon: '🏃' },
  { label: 'Cycling', icon: '🚴' },
  { label: 'Walking', icon: '🚶' },
  { label: 'Yoga', icon: '🧘' },
  { label: 'Swimming', icon: '🏊' },
  { label: 'Weightlifting', icon: '🏋️' },
];

const trainerPreview = [
  { name: 'Arun Kumar', specialization: 'Strength Training', rate: 1800 },
  { name: 'Meena Lakshmi', specialization: 'Yoga & Flexibility', rate: 1500 },
  { name: 'Jeeva Prakash', specialization: 'Cardio & HIIT', rate: 2000 }
];

const dashboardHeaderTabs = [
  { label: 'Health', sectionId: 'health-medical-section', icon: '🩺' },
  { label: 'Wellness Tools', sectionId: 'wellness-tools-section', icon: '⚡' },
  { label: 'BMI + Plans', sectionId: 'bmi-calculator-section', icon: '🎯' },
  { label: 'Progress (Graphs)', sectionId: 'analytics-graph-section', icon: '📈' },
  { label: 'Trainers', navigateTo: '/trainers', icon: '💪' },
  { label: 'Blog', navigateTo: '/community-blog', icon: '📝' }
];

const dashboardBackgroundEmojis = [
  { emoji: '🌿', top: '4%', left: '8%', size: '28px', opacity: 0.22, rotate: '-14deg' },
  { emoji: '💧', top: '8%', left: '23%', size: '24px', opacity: 0.18, rotate: '9deg' },
  { emoji: '🧘', top: '6%', left: '41%', size: '30px', opacity: 0.2, rotate: '-8deg' },
  { emoji: '🥗', top: '10%', left: '59%', size: '26px', opacity: 0.19, rotate: '12deg' },
  { emoji: '💚', top: '7%', left: '77%', size: '24px', opacity: 0.16, rotate: '-18deg' },
  { emoji: '🏃', top: '13%', left: '89%', size: '28px', opacity: 0.21, rotate: '16deg' },
  { emoji: '🚴', top: '20%', left: '12%', size: '29px', opacity: 0.2, rotate: '-11deg' },
  { emoji: '🍎', top: '23%', left: '31%', size: '24px', opacity: 0.17, rotate: '8deg' },
  { emoji: '😴', top: '18%', left: '48%', size: '30px', opacity: 0.18, rotate: '-10deg' },
  { emoji: '🤸', top: '26%', left: '67%', size: '28px', opacity: 0.2, rotate: '14deg' },
  { emoji: '🫀', top: '22%', left: '83%', size: '26px', opacity: 0.18, rotate: '-7deg' },
  { emoji: '🌱', top: '33%', left: '6%', size: '24px', opacity: 0.17, rotate: '10deg' },
  { emoji: '👟', top: '38%', left: '18%', size: '26px', opacity: 0.18, rotate: '-13deg' },
  { emoji: '💪', top: '35%', left: '37%', size: '31px', opacity: 0.22, rotate: '9deg' },
  { emoji: '🥤', top: '42%', left: '54%', size: '25px', opacity: 0.18, rotate: '-16deg' },
  { emoji: '🫶', top: '37%', left: '72%', size: '27px', opacity: 0.17, rotate: '12deg' },
  { emoji: '🏋️', top: '45%', left: '87%', size: '30px', opacity: 0.21, rotate: '-9deg' },
  { emoji: '🚶', top: '56%', left: '10%', size: '28px', opacity: 0.19, rotate: '11deg' },
  { emoji: '🌿', top: '61%', left: '26%', size: '24px', opacity: 0.16, rotate: '-17deg' },
  { emoji: '💧', top: '54%', left: '44%', size: '26px', opacity: 0.18, rotate: '7deg' },
  { emoji: '🥬', top: '63%', left: '61%', size: '28px', opacity: 0.17, rotate: '-12deg' },
  { emoji: '😌', top: '58%', left: '79%', size: '25px', opacity: 0.18, rotate: '15deg' },
  { emoji: '🧘', top: '69%', left: '90%', size: '30px', opacity: 0.19, rotate: '-14deg' },
  { emoji: '💚', top: '76%', left: '8%', size: '24px', opacity: 0.16, rotate: '13deg' },
  { emoji: '🍎', top: '82%', left: '21%', size: '25px', opacity: 0.18, rotate: '-8deg' },
  { emoji: '🤸', top: '74%', left: '39%', size: '28px', opacity: 0.2, rotate: '10deg' },
  { emoji: '🌱', top: '85%', left: '56%', size: '24px', opacity: 0.16, rotate: '-18deg' },
  { emoji: '💪', top: '79%', left: '72%', size: '31px', opacity: 0.22, rotate: '8deg' },
  { emoji: '🚴', top: '88%', left: '88%', size: '29px', opacity: 0.19, rotate: '-11deg' },
];

const BMI_PROFILE_STORAGE_KEY = 'wellnest-bmi-profile';

const LEGACY_RECOMMENDATION_NAMES = new Set([
  'active longevity routine',
  'joint-friendly strength builder',
  'balanced fitness starter',
  'low-impact fat burn circuit',
  'strength & muscle builder',
  'heart-smart cardio flow',
  'post-meal glucose control walks',
  'knee-friendly mobility plan',
  'back care core stability',
  'breath-paced endurance plan',
  'core & bone strength support',
  'strength mobility balance',
  'recovery & flexibility reset'
]);

const normalizeGender = (value) => {
  if (!value) return 'unspecified';
  const normalized = String(value).trim().toLowerCase();
  if (['male', 'man', 'm'].includes(normalized)) return 'male';
  if (['female', 'woman', 'f'].includes(normalized)) return 'female';
  return 'unspecified';
};

const buildMedicalConditionText = (medicalRecords = [], latestHealthMetrics = null) => {
  const recordText = medicalRecords
    .flatMap((record) => [
      record?.title,
      record?.description,
      record?.diagnosis,
      record?.medications,
      record?.allergies,
      record?.chronicConditions,
    ])
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const metricFlags = [];
  const bmi = Number(latestHealthMetrics?.bmi);
  if (Number.isFinite(bmi)) {
    if (bmi >= 30) metricFlags.push('obesity');
    else if (bmi >= 25) metricFlags.push('overweight');
    else if (bmi < 18.5) metricFlags.push('underweight');
  }

  return `${recordText} ${metricFlags.join(' ')}`.trim();
};

const getStoredBmiProfile = () => {
  try {
    const raw = localStorage.getItem(BMI_PROFILE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const buildRecommendedWorkoutPlans = ({ userProfile, latestHealthMetrics, medicalRecords, bmiProfile }) => {
  const plans = [];
  const age = Number(bmiProfile?.age ?? userProfile?.age);
  const gender = normalizeGender(bmiProfile?.gender ?? userProfile?.gender);
  const bmi = Number(latestHealthMetrics?.bmi ?? bmiProfile?.result?.bmi);
  const fitnessGoal = String(userProfile?.fitnessGoal || '').toLowerCase();
  const conditionText = buildMedicalConditionText(medicalRecords, latestHealthMetrics);

  const addPlan = (name, description, durationMinutes) => {
    if (!plans.some((plan) => plan.name.toLowerCase() === name.toLowerCase())) {
      plans.push({ name, description, durationMinutes });
    }
  };

  if (Number.isFinite(age) && age >= 55) {
    addPlan(
      'Chair Squats + Heel Raises + Wall Push-Ups',
      'Recommended for active aging: chair squats, heel raises, wall push-ups, marching, and balance holds to improve strength and stability safely.',
      35
    );
  } else if (Number.isFinite(age) && age >= 35) {
    addPlan(
      'Squats + Plank + Glute Bridge Builder',
      'A joint-smart strength plan using bodyweight squats, front plank, glute bridges, step-ups, and band rows for steady full-body conditioning.',
      40
    );
  } else {
    addPlan(
      'Squats + Push-Ups + Plank Starter',
      'A balanced full-body beginner plan featuring squats, push-ups, plank holds, lunges, and brisk walking for all-round fitness.',
      45
    );
  }

  if (fitnessGoal.includes('weight loss') || (Number.isFinite(bmi) && bmi >= 25)) {
    addPlan(
      'Step-Ups + Squats + Plank Fat Burn',
      'For fat loss and higher BMI support: brisk walking, step-ups, bodyweight squats, mountain climbers, and plank work with low joint stress.',
      40
    );
  }

  if (fitnessGoal.includes('weight gain') || (Number.isFinite(bmi) && bmi > 0 && bmi < 18.5)) {
    addPlan(
      'Goblet Squats + Lateral Raise + Plank',
      'For lean muscle gain: goblet squats, lateral raises, incline push-ups, plank holds, and glute bridges with controlled progressive overload.',
      50
    );
  }

  if (conditionText.includes('hypertension') || conditionText.includes('high blood pressure') || conditionText.includes('bp')) {
    addPlan(
      'Walking + Wall Squats + Bird-Dog',
      'Heart-friendly recommendation for blood pressure support: brisk walking, wall squats, bird-dog, seated knee lifts, and breathing drills.',
      30
    );
  }

  if (conditionText.includes('diabetes') || conditionText.includes('blood sugar')) {
    addPlan(
      'Walking + Squats + Calf Raises Circuit',
      'For blood sugar control: post-meal walking, squats, calf raises, band rows, and plank taps to improve daily glucose use and activity tolerance.',
      30
    );
  }

  if (conditionText.includes('knee') || conditionText.includes('arthritis') || conditionText.includes('joint pain')) {
    addPlan(
      'Glute Bridge + Mini Squat + Side Leg Raise',
      'Knee-friendly option with glute bridges, supported mini squats, side leg raises, calf raises, and cycling or walking instead of jump work.',
      30
    );
  }

  if (conditionText.includes('back pain') || conditionText.includes('spine') || conditionText.includes('slip disc')) {
    addPlan(
      'Bird-Dog + Dead Bug + Side Plank',
      'Back-safe recommendation built around bird-dog, dead bug, side plank, glute bridge, and wall slides to strengthen the core without spinal overload.',
      25
    );
  }

  if (conditionText.includes('asthma') || conditionText.includes('breath') || conditionText.includes('respiratory')) {
    addPlan(
      'Marching + Wall Push-Ups + Step Touch',
      'Breath-friendly conditioning with marching, step touch, wall push-ups, seated knee lifts, and pacing-focused recovery breaks.',
      25
    );
  }

  if (gender === 'female') {
    addPlan(
      'Squats + Lateral Raise + Dead Bug Tone',
      'A female-focused strength recommendation using squats, lateral raises, dead bugs, glute bridges, and plank holds for core and bone support.',
      35
    );
  } else if (gender === 'male') {
    addPlan(
      'Push-Ups + Squats + Lateral Raise Strength',
      'A male-focused balanced routine with push-ups, squats, lateral raises, plank work, and band rows for upper and lower body strength.',
      45
    );
  }

  if (plans.length < 4) {
    addPlan(
      'Plank + Mobility + Recovery Flow',
      'A lighter recovery option featuring plank holds, cat-cow, hip mobility, shoulder circles, and easy walking to maintain consistency.',
      20
    );
  }

  return plans.slice(0, 5);
};

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
  const [, setMedicalRecords] = useState([]);

  // Workout session state
  const [isWorkoutLogModalOpen, setIsWorkoutLogModalOpen] = useState(false);
  const [recentWorkoutSessions, setRecentWorkoutSessions] = useState([]);
  const [allWorkoutSessions, setAllWorkoutSessions] = useState([]);
  const [allMeals, setAllMeals] = useState([]);
  const [sleepLogs, setSleepLogs] = useState([]);
  const [editingWorkoutSession, setEditingWorkoutSession] = useState(null);

  const [chartPeriod, setChartPeriod] = useState('month');
  const [chartMetric, setChartMetric] = useState('burned');
  const [activeWorkoutType, setActiveWorkoutType] = useState('All');

  // Notification state
  const [waterReminderEnabled, setWaterReminderEnabled] = useState(true);
  const [sleepReminderEnabled, setSleepReminderEnabled] = useState(true);
  const [waterGlassesToday, setWaterGlassesToday] = useState(5);
  const [inAppNotifications, setInAppNotifications] = useState([]);

  // Water reminder interval settings
  const [waterIntervalHours, setWaterIntervalHours] = useState(0);
  const [waterIntervalMinutes, setWaterIntervalMinutes] = useState(30);
  const [waterIntervalSeconds, setWaterIntervalSeconds] = useState(0);
  const [waterTimerId, setWaterTimerId] = useState(null);

  // Sleep reminder time settings
  const [, setSleepReminderTime] = useState('22:00'); // 10:00 PM default
  const [sleepTimerId, setSleepTimerId] = useState(null);
  const [sleepHour, setSleepHour] = useState('10');
  const [sleepMinute, setSleepMinute] = useState('00');
  const [sleepPeriod, setSleepPeriod] = useState('PM');

  // Refs to fix closure issue in setInterval
  const waterReminderEnabledRef = useRef(waterReminderEnabled);
  const sleepReminderEnabledRef = useRef(sleepReminderEnabled);
  const waterTimerRef = useRef(null);
  const sleepTimerRef = useRef(null);

  // Keep refs in sync with state
  useEffect(() => {
    waterReminderEnabledRef.current = waterReminderEnabled;
  }, [waterReminderEnabled]);

  useEffect(() => {
    sleepReminderEnabledRef.current = sleepReminderEnabled;
  }, [sleepReminderEnabled]);

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

        const fetchProfile = async () => {
          const response = await fetch('http://localhost:8081/api/user/profile', {
            headers: { Authorization: `Bearer ${getToken()}` }
          });
          if (!response.ok) {
            throw new Error('Failed to fetch user profile');
          }
          return response.json();
        };

        const bmiProfile = getStoredBmiProfile();

        const [plans, profileResult, recordsResult, metricsResult] = await Promise.all([
          workoutApi.getWorkoutPlans(),
          fetchProfile().catch(() => null),
          getUserMedicalRecords().catch(() => []),
          getLatestHealthMetrics().catch(() => null)
        ]);

        const mergedUserProfile = profileResult ? { ...getStoredUser(), ...profileResult } : getStoredUser();
        if (profileResult) {
          setUser(mergedUserProfile);
        }
        setMedicalRecords(Array.isArray(recordsResult) ? recordsResult : []);
        if (metricsResult) {
          setLatestHealthMetrics(metricsResult);
        }

        const recommendedPlans = buildRecommendedWorkoutPlans({
          userProfile: mergedUserProfile,
          latestHealthMetrics: metricsResult,
          medicalRecords: Array.isArray(recordsResult) ? recordsResult : [],
          bmiProfile
        });

        const legacyPlans = (Array.isArray(plans) ? plans : []).filter((plan) =>
          LEGACY_RECOMMENDATION_NAMES.has(String(plan.name || '').trim().toLowerCase())
        );

        if (legacyPlans.length > 0) {
          await Promise.all(legacyPlans.map((plan) => workoutApi.deleteWorkoutPlan(plan.id)));
        }

        const filteredExistingPlans = (Array.isArray(plans) ? plans : []).filter((plan) =>
          !LEGACY_RECOMMENDATION_NAMES.has(String(plan.name || '').trim().toLowerCase())
        );

        const existingPlanNames = new Set(filteredExistingPlans.map((plan) => String(plan.name || '').trim().toLowerCase()));
        const missingRecommendations = recommendedPlans.filter((plan) => !existingPlanNames.has(plan.name.toLowerCase()));

        let resolvedPlans = filteredExistingPlans;
        if (missingRecommendations.length > 0) {
          await Promise.all(missingRecommendations.map((plan) => workoutApi.createWorkoutPlan(plan)));
          resolvedPlans = await workoutApi.getWorkoutPlans();
        }

        setWorkoutPlans(resolvedPlans);
      } catch (error) {
        console.error('Failed to fetch workouts:', error);
        if (isAuthAccessIssue(error?.message)) {
          clearAuthSession();
          setWorkoutPlans([]);
          setWorkoutError('Your session is invalid or expired. Please sign in again.');
          navigate('/login');
          return;
        }

        setWorkoutError(error.message || 'Failed to load workouts. Please try again.');
        setWorkoutPlans([]);
      } finally {
        setIsLoadingWorkouts(false);
      }
    };

    fetchWorkouts();
  }, [navigate]);

  const refreshDashboardData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const [metricsResult, consultationsResult, summaryResult, sessionsResult, mealsResult, sleepLogsResult] = await Promise.allSettled([
        getLatestHealthMetrics(),
        getUserConsultations(),
        getCalorieSummary(formatLocalToday()),
        getUserSessions(),
        getUserMeals(),
        getUserSleepLogs()
      ]);

      if (metricsResult.status === 'fulfilled') {
        setLatestHealthMetrics(metricsResult.value);
      }

      if (consultationsResult.status === 'fulfilled' && Array.isArray(consultationsResult.value)) {
        const upcoming = consultationsResult.value
          .filter(c => c.status === 'SCHEDULED' && new Date(c.scheduledAt) > new Date())
          .slice(0, 3);
        setUpcomingConsultations(upcoming);
      }

      if (summaryResult.status === 'fulfilled') {
        setCalorieSummary(summaryResult.value);
      }

      if (sessionsResult.status === 'fulfilled' && Array.isArray(sessionsResult.value)) {
        setAllWorkoutSessions(sessionsResult.value);
        setRecentWorkoutSessions(sessionsResult.value.slice(0, 5));
      }

      if (mealsResult.status === 'fulfilled' && Array.isArray(mealsResult.value)) {
        setAllMeals(mealsResult.value);
      }

      if (sleepLogsResult.status === 'fulfilled' && Array.isArray(sleepLogsResult.value)) {
        setSleepLogs(sleepLogsResult.value);
      }
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
    }
  }, []);

  // Fetch health data on mount + periodic refresh + tab focus refresh
  useEffect(() => {
    refreshDashboardData();

    const intervalId = setInterval(() => {
      refreshDashboardData();
    }, 30000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshDashboardData();
      }
    };

    window.addEventListener('focus', refreshDashboardData);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', refreshDashboardData);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [refreshDashboardData]);

  const dashboardSummary = useMemo(() => {
    const caloriesConsumed = allMeals.reduce((sum, meal) => sum + asNumber(meal?.calories, meal?.totalCalories), 0);
    const totalProtein = allMeals.reduce((sum, meal) => sum + asNumber(meal?.proteinGrams, meal?.protein), 0);
    const totalCarbs = allMeals.reduce((sum, meal) => sum + asNumber(meal?.carbsGrams, meal?.carbs), 0);
    const totalFat = allMeals.reduce((sum, meal) => sum + asNumber(meal?.fatGrams, meal?.fat, meal?.fats), 0);
    const caloriesBurned = allWorkoutSessions.reduce((sum, session) => sum + asNumber(session?.caloriesBurned, session?.calories), 0);
    const workoutMinutes = allWorkoutSessions.reduce((sum, session) => sum + asNumber(session?.durationMinutes, session?.duration), 0);

    const hasAnyLogs = allMeals.length > 0 || allWorkoutSessions.length > 0;
    if (hasAnyLogs) {
      return {
        caloriesConsumed: Math.round(caloriesConsumed),
        caloriesBurned: Math.round(caloriesBurned),
        netCalories: Math.round(caloriesConsumed - caloriesBurned),
        totalProtein: Math.round(totalProtein),
        totalCarbs: Math.round(totalCarbs),
        totalFat: Math.round(totalFat),
        workoutMinutes: Math.round(workoutMinutes),
        targetCalories: asNumber(calorieSummary?.targetCalories, 2000),
        remainingCalories: asNumber(calorieSummary?.remainingCalories, asNumber(calorieSummary?.targetCalories, 2000) - caloriesConsumed),
        progressPercentage: asNumber(calorieSummary?.progressPercentage)
      };
    }

    if (calorieSummary) {
      return {
        caloriesConsumed: Math.round(asNumber(calorieSummary?.caloriesConsumed)),
        caloriesBurned: Math.round(asNumber(calorieSummary?.caloriesBurned)),
        netCalories: Math.round(asNumber(calorieSummary?.netCalories)),
        totalProtein: Math.round(asNumber(calorieSummary?.totalProtein)),
        totalCarbs: Math.round(asNumber(calorieSummary?.totalCarbs)),
        totalFat: Math.round(asNumber(calorieSummary?.totalFat)),
        workoutMinutes: Math.round(asNumber(calorieSummary?.workoutMinutes)),
        targetCalories: Math.round(asNumber(calorieSummary?.targetCalories, 2000)),
        remainingCalories: Math.round(asNumber(calorieSummary?.remainingCalories)),
        progressPercentage: asNumber(calorieSummary?.progressPercentage)
      };
    }

    return {
      caloriesConsumed: 0,
      caloriesBurned: 0,
      netCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      workoutMinutes: 0,
      targetCalories: 2000,
      remainingCalories: 2000,
      progressPercentage: 0
    };
  }, [allMeals, allWorkoutSessions, calorieSummary]);

  // Debug effect - log when dashboard summary changes
  useEffect(() => {
    if (dashboardSummary) {
      console.log('Dashboard Summary Updated:', {
        workoutMinutes: dashboardSummary.workoutMinutes,
        caloriesBurned: dashboardSummary.caloriesBurned,
        caloriesConsumed: dashboardSummary.caloriesConsumed,
        netCalories: dashboardSummary.netCalories
      });
    }
  }, [dashboardSummary]);

  // Debug effect - log when recent workout sessions change
  useEffect(() => {
    if (recentWorkoutSessions.length > 0) {
      console.log('Recent Workout Sessions Updated:', recentWorkoutSessions);
    }
  }, [recentWorkoutSessions]);

  const activityChartData = useMemo(
    () => buildChartDataByPeriod(allWorkoutSessions, allMeals, chartPeriod, chartMetric, activeWorkoutType),
    [allWorkoutSessions, allMeals, chartPeriod, chartMetric, activeWorkoutType]
  );

  const dashboardWellness = useMemo(() => {
    const todayKey = getLocalDateKey(new Date());
    const recentKeys = getRecentDateKeys(14);

    const workoutDays = new Set(
      allWorkoutSessions
        .map((session) => getLocalDateKey(session?.completedAt || session?.createdAt || session?.sessionDate))
        .filter(Boolean)
    );

    const sleepByDay = new Map();
    sleepLogs.forEach((log) => {
      const key = getLocalDateKey(log?.sleepDate);
      if (!key) return;
      if (!sleepByDay.has(key)) {
        sleepByDay.set(key, log);
      }
    });

    const computeStreak = (predicate) => {
      let streak = 0;
      for (let i = recentKeys.length - 1; i >= 0; i -= 1) {
        const key = recentKeys[i];
        if (!predicate(key)) break;
        streak += 1;
      }
      return streak;
    };

    const workoutStreak = computeStreak((key) => workoutDays.has(key));
    const hydrationStreak = computeStreak((key) => {
      const log = sleepByDay.get(key);
      const waterLiters = asNumber(log?.waterLiters, asNumber(log?.waterGlasses, log?.water_glasses) * 0.25);
      return waterLiters >= 2;
    });
    const sleepStreak = computeStreak((key) => {
      const log = sleepByDay.get(key);
      return asNumber(log?.hoursSlept, log?.hours_slept) >= 7;
    });

    const todaySleepLog = sleepByDay.get(todayKey) || sleepLogs[0] || null;
    const todaySleepHours = asNumber(todaySleepLog?.hoursSlept, todaySleepLog?.hours_slept);
    const todayWaterLiters = asNumber(todaySleepLog?.waterLiters, asNumber(todaySleepLog?.waterGlasses, todaySleepLog?.water_glasses) * 0.25);
    const todaySteps = asNumber(
      latestHealthMetrics?.stepsCount,
      latestHealthMetrics?.stepCount,
      latestHealthMetrics?.steps,
      latestHealthMetrics?.stepsTaken
    );

    const stepsTarget = asNumber(latestHealthMetrics?.dailyStepGoal, 9000);
    const caloriesConsumed = asNumber(dashboardSummary?.caloriesConsumed);
    const caloriesTarget = Math.max(asNumber(dashboardSummary?.targetCalories, 2000), 1);

    const stepScore = clamp((todaySteps / Math.max(stepsTarget, 1)) * 100, 0, 100);
    const sleepScore = clamp((todaySleepHours / 7) * 100, 0, 100);
    const waterScore = clamp((todayWaterLiters / 2) * 100, 0, 100);
    const calorieDelta = Math.abs(caloriesConsumed - caloriesTarget);
    const calorieScore = clamp((1 - (calorieDelta / caloriesTarget)) * 100, 0, 100);

    const healthScore = Math.round(
      (stepScore * 0.30)
      + (sleepScore * 0.25)
      + (waterScore * 0.20)
      + (calorieScore * 0.25)
    );

    return {
      streaks: {
        workout: workoutStreak,
        hydration: hydrationStreak,
        sleep: sleepStreak
      },
      healthScore,
      components: {
        steps: Math.round(stepScore),
        sleep: Math.round(sleepScore),
        water: Math.round(waterScore),
        calories: Math.round(calorieScore)
      }
    };
  }, [allWorkoutSessions, sleepLogs, latestHealthMetrics, dashboardSummary]);

  const workoutPlanAnalytics = useMemo(() => {
    const recentKeys = getRecentDateKeys(30);
    const recentSet = new Set(recentKeys);

    const recentSessions = allWorkoutSessions.filter((session) => {
      const key = getLocalDateKey(session?.completedAt || session?.createdAt || session?.sessionDate);
      return Boolean(key && recentSet.has(key));
    });

    const frequency = recentSessions.length;
    const totalDurationMinutes = Math.round(
      recentSessions.reduce((sum, session) => sum + asNumber(session?.durationMinutes, session?.duration), 0)
    );

    return {
      frequency,
      totalDurationMinutes,
      streak: dashboardWellness.streaks.workout
    };
  }, [allWorkoutSessions, dashboardWellness.streaks.workout]);

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

  const handleSwitchAccount = () => {
    clearAuthSession();
    navigate('/login');
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
    // Refresh all dashboard cards/graph after workout actions
    try {
      console.log('=== Starting Dashboard Refresh ===');

      // Wait a moment for backend to persist
      await new Promise(resolve => setTimeout(resolve, 500));

      // Fetch fresh data from backend
      console.log('Refreshing workout data after logging...');
      await refreshDashboardData();

      const refreshedPlans = await workoutApi.getWorkoutPlans();
      setWorkoutPlans(Array.isArray(refreshedPlans) ? refreshedPlans : []);

      console.log('=== Dashboard Refresh Complete ===');
    } catch (err) {
      console.error('=== Dashboard Refresh Error ===');
      console.error('Error refreshing workout data:', err);
    }
  };

  const handleCloseWorkoutLogModal = () => {
    setIsWorkoutLogModalOpen(false);
    setEditingWorkoutSession(null);
  };

  const handleEditWorkoutSession = (session) => {
    setEditingWorkoutSession(session);
    setIsWorkoutLogModalOpen(true);
  };

  const handleSubmitWorkoutSessionUpdate = async (payload) => {
    if (!editingWorkoutSession?.id) {
      throw new Error('Workout session not selected');
    }

    return updateWorkoutSession(editingWorkoutSession.id, {
      ...payload,
      completedAt: editingWorkoutSession.completedAt
    });
  };

  const handleDeleteRecentWorkout = async (sessionId) => {
    if (!window.confirm('Clear this recent workout entry?')) {
      return;
    }

    try {
      await deleteWorkoutSession(sessionId);
      await handleWorkoutLogged();
    } catch (error) {
      alert('Error clearing workout: ' + error.message);
    }
  };

  const handleClearRecentWorkouts = async () => {
    if (!recentWorkoutSessions.length) {
      return;
    }

    if (!window.confirm('Clear all recent workout entries shown here?')) {
      return;
    }

    try {
      await Promise.all(recentWorkoutSessions.map((session) => deleteWorkoutSession(session.id)));
      await handleWorkoutLogged();
    } catch (error) {
      alert('Error clearing recent workouts: ' + error.message);
    }
  };

  const pushInAppNotification = (type, title, body) => {
    const notificationItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type,
      title,
      body,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setInAppNotifications(prev => [notificationItem, ...prev].slice(0, 6));
  };

  const triggerReminderNotification = ({ type, title, body, tag }) => {
    pushInAppNotification(type, title, body);

    if (!('Notification' in window)) {
      console.log('🔔 Browser notification API unavailable, used in-app fallback only');
      return;
    }

    if (Notification.permission !== 'granted') {
      console.log('🔔 Browser notification permission not granted, used in-app fallback only');
      return;
    }

    try {
      new Notification(title, {
        body,
        tag,
        requireInteraction: true,
        renotify: true,
        silent: false
      });
    } catch (err) {
      console.error('Browser notification failed, in-app fallback still shown:', err);
    }
  };

  // Water reminder handler
  const handleWaterReminder = async () => {
    if (waterGlassesToday < 8) {
      const newWaterGlasses = waterGlassesToday + 1;
      setWaterGlassesToday(newWaterGlasses);
      
      try {
        // Get today's date in YYYY-MM-DD format
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        
        // Try to get today's sleep log
        try {
          const todaySleepLog = await getSleepByDate(todayStr);
          // If found, update it with the new water glasses count
          if (todaySleepLog && todaySleepLog.id) {
            await updateSleep(todaySleepLog.id, {
              ...todaySleepLog,
              waterGlasses: newWaterGlasses,
              waterLiters: newWaterGlasses * 0.25
            });
          }
        } catch (err) {
          // If no sleep log exists for today, create a new one
          await logSleep({
            sleepDate: todayStr,
            hoursSlept: 0,
            sleepQuality: 'UNKNOWN',
            sleepType: 'DAYTIME',
            waterGlasses: newWaterGlasses,
            waterLiters: newWaterGlasses * 0.25,
            notes: 'Water intake logged from dashboard'
          });
        }
        
        // Refresh dashboard data to update hydration streak
        await refreshDashboardData();
        
        triggerReminderNotification({
          type: 'water',
          title: '💧 Water Logged!',
          body: `Great! You've had ${newWaterGlasses} glasses today. ${8 - newWaterGlasses} more to go!`,
          tag: 'water-logged'
        });
      } catch (error) {
        console.error('Failed to log water intake:', error);
        alert('Failed to update hydration: ' + error.message);
      }
    }
  };

  // Start water reminder interval
  const startWaterReminder = () => {
    console.log('💧 START button clicked - Water reminder interval:', waterIntervalHours, 'hours', waterIntervalMinutes, 'minutes', waterIntervalSeconds, 'seconds');

    // Clear existing timer if any
    if (waterTimerRef.current) {
      clearInterval(waterTimerRef.current);
      waterTimerRef.current = null;
      setWaterTimerId(null);
    }

    const totalSeconds = (waterIntervalHours * 3600) + (waterIntervalMinutes * 60) + waterIntervalSeconds;
    console.log('💧 Total interval seconds:', totalSeconds);

    if (totalSeconds === 0) {
      alert('Please set a valid interval (greater than 0)');
      return;
    }

    const intervalMs = totalSeconds * 1000;
    console.log('💧 Interval in milliseconds:', intervalMs);

    const startWaterTimer = () => {
      waterReminderEnabledRef.current = true;
      setupWaterTimer(intervalMs);
    };

    // Auto-enable water reminder when starting
    setWaterReminderEnabled(true);
    console.log('💧 Auto-enabled water reminder');

    if (!('Notification' in window)) {
      startWaterTimer();
      return;
    }

    console.log('💧 Current notification permission:', Notification.permission);

    if (Notification.permission === 'default') {
      console.log('💧 Requesting notification permission...');
      Notification.requestPermission().then((permission) => {
        console.log('💧 Permission result:', permission);
        startWaterTimer();
      });
    } else {
      console.log('💧 Permission already granted, setting up timer');
      startWaterTimer();
    }
  };

  const setupWaterTimer = (intervalMs) => {
    console.log(`💧 Setting up water reminder with ${intervalMs}ms interval`);
    const timerId = setInterval(() => {
      console.log('💧 Timer fired! Checking if water reminder is enabled:', waterReminderEnabledRef.current);
      if (waterReminderEnabledRef.current) {
        console.log('💧 Sending water reminder notification');
        triggerReminderNotification({
          type: 'water',
          title: '💧 Water Reminder!',
          body: 'Time to drink water! Stay hydrated for better health.',
          tag: 'water-reminder'
        });
      } else {
        console.log('💧 Water reminder is disabled, skipping notification');
      }
    }, intervalMs);

    waterTimerRef.current = timerId;
    setWaterTimerId(timerId);
    console.log('💧 Water reminder timer started with ID:', timerId);

    // Send confirmation notification
    const hours = Math.floor(intervalMs / 3600000);
    const minutes = Math.floor((intervalMs % 3600000) / 60000);
    const seconds = Math.floor((intervalMs % 60000) / 1000);
    let intervalText = '';
    if (hours > 0) intervalText += `${hours}h `;
    if (minutes > 0) intervalText += `${minutes}m `;
    if (seconds > 0) intervalText += `${seconds}s`;

    triggerReminderNotification({
      type: 'system',
      title: '✅ Water Reminder Started!',
      body: `You'll receive reminders every ${intervalText.trim()}`,
      tag: 'water-reminder-started'
    });
  };

  // Stop water reminder
  const stopWaterReminder = () => {
    if (waterTimerRef.current) {
      console.log('💧 Stopping water reminder, timer ID:', waterTimerRef.current);
      clearInterval(waterTimerRef.current);
      waterTimerRef.current = null;
      setWaterTimerId(null);
      waterReminderEnabledRef.current = false;
      setWaterReminderEnabled(false);

      triggerReminderNotification({
        type: 'system',
        title: '🛑 Water Reminder Stopped',
        body: 'Water reminders have been turned off.',
        tag: 'water-reminder-stopped'
      });
    } else {
      console.log('💧 No water timer to stop');
    }
  };

  // Start sleep reminder at specific time
  const startSleepReminder = () => {
    console.log('💤 START ALARM button clicked - Sleep time:', sleepHour, ':', sleepMinute, sleepPeriod);

    // Clear existing timer if any
    if (sleepTimerRef.current) {
      clearTimeout(sleepTimerRef.current);
      sleepTimerRef.current = null;
      setSleepTimerId(null);
    }

    // Convert 12-hour format to 24-hour format
    let hour24 = parseInt(sleepHour);
    if (sleepPeriod === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (sleepPeriod === 'AM' && hour24 === 12) {
      hour24 = 0;
    }

    const timeString = `${hour24.toString().padStart(2, '0')}:${sleepMinute}`;
    console.log('💤 Converted to 24-hour format:', timeString);
    setSleepReminderTime(timeString);

    if (!sleepHour || !sleepMinute) {
      alert('Please set a valid time');
      return;
    }

    const startSleepTimer = () => {
      sleepReminderEnabledRef.current = true;
      setupSleepTimer(timeString);
    };

    // Auto-enable sleep reminder when starting
    setSleepReminderEnabled(true);
    console.log('💤 Auto-enabled sleep reminder');

    if (!('Notification' in window)) {
      startSleepTimer();
      return;
    }

    console.log('💤 Current notification permission:', Notification.permission);

    if (Notification.permission === 'default') {
      console.log('💤 Requesting notification permission...');
      Notification.requestPermission().then((permission) => {
        console.log('💤 Permission result:', permission);
        startSleepTimer();
      });
    } else {
      console.log('💤 Permission already granted, setting up timer');
      startSleepTimer();
    }
  };

  const setupSleepTimer = (timeString) => {
    console.log(`😴 Setting up sleep reminder for ${timeString} (${sleepHour}:${sleepMinute} ${sleepPeriod})`);
    const [hourStr, minuteStr] = timeString.split(':');
    const alarmHour = parseInt(hourStr, 10);
    const alarmMinute = parseInt(minuteStr, 10);

    const scheduleNextSleepAlarm = () => {
      const now = new Date();
      const nextAlarm = new Date(now);
      nextAlarm.setHours(alarmHour, alarmMinute, 0, 0);

      if (nextAlarm <= now) {
        nextAlarm.setDate(nextAlarm.getDate() + 1);
      }

      const msUntilAlarm = nextAlarm.getTime() - now.getTime();
      console.log(`😴 Next sleep alarm scheduled at ${nextAlarm.toLocaleString()} (${msUntilAlarm}ms from now)`);

      const timeoutId = setTimeout(() => {
        if (sleepReminderEnabledRef.current) {
          console.log('😴 Alarm triggered! Sending sleep reminder notification');
          triggerReminderNotification({
            type: 'sleep',
            title: '😴 Sleep Reminder!',
            body: `It's ${sleepHour}:${sleepMinute} ${sleepPeriod}! Time to wind down for better rest. Aim for 7-8 hours of sleep tonight!`,
            tag: 'sleep-reminder'
          });
        } else {
          console.log('😴 Alarm time reached, but sleep reminder is disabled');
        }

        // Reschedule only if reminder is still enabled
        if (sleepReminderEnabledRef.current) {
          scheduleNextSleepAlarm();
        }
      }, msUntilAlarm);

      sleepTimerRef.current = timeoutId;
      setSleepTimerId(timeoutId);
      console.log('😴 Sleep reminder timer started with ID:', timeoutId);
    };

    scheduleNextSleepAlarm();

    triggerReminderNotification({
      type: 'system',
      title: '✅ Sleep Alarm Set!',
      body: `You'll receive a reminder at ${sleepHour}:${sleepMinute} ${sleepPeriod} every day`,
      tag: 'sleep-alarm-set'
    });
  };

  // Stop sleep reminder
  const stopSleepReminder = () => {
    if (sleepTimerRef.current) {
      console.log('💤 Stopping sleep reminder, timer ID:', sleepTimerRef.current);
      clearTimeout(sleepTimerRef.current);
      sleepTimerRef.current = null;
      setSleepTimerId(null);
      sleepReminderEnabledRef.current = false;
      setSleepReminderEnabled(false);

      triggerReminderNotification({
        type: 'system',
        title: '🛑 Sleep Reminder Stopped',
        body: 'Sleep reminders have been turned off.',
        tag: 'sleep-reminder-stopped'
      });
    } else {
      console.log('💤 No sleep timer to stop');
    }
  };

  // Sleep reminder trigger (manual)
  const handleSleepReminder = () => {
    triggerReminderNotification({
      type: 'sleep',
      title: '😴 Sleep Reminder!',
      body: `Consider winding down for better rest. Your alarm is set for ${sleepHour}:${sleepMinute} ${sleepPeriod}. Aim for 7-8 hours tonight!`,
      tag: 'sleep-reminder-now'
    });
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (waterTimerRef.current) clearInterval(waterTimerRef.current);
      if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
    };
  }, []);

  // Test notification function
  const testNotification = () => {
    if (!('Notification' in window)) {
      alert('❌ Your browser does not support notifications!');
      return;
    }

    if (Notification.permission === 'granted') {
      triggerReminderNotification({
        type: 'system',
        title: '✅ Test Notification',
        body: 'Great! Notifications are working. You will receive water and sleep reminders.',
        tag: 'test-notification'
      });
      alert('✅ Test notification sent! Check your notifications.');
    } else if (Notification.permission === 'denied') {
      alert('❌ Notification permission is DENIED. Please enable notifications in your browser settings:\n\n1. Click the lock icon in address bar\n2. Find "Notifications"\n3. Change to "Allow"');
    } else {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          triggerReminderNotification({
            type: 'system',
            title: '✅ Test Notification',
            body: 'Great! Notifications are working. You will receive water and sleep reminders.',
            tag: 'test-notification'
          });
          alert('✅ Permission granted! Test notification sent.');
        } else {
          alert('❌ Permission denied. Please enable notifications to use reminders.');
        }
      });
    }
  };

  const notificationSupported = typeof window !== 'undefined' && 'Notification' in window;
  const notificationPermission = notificationSupported ? Notification.permission : 'unsupported';

  return (
    <div className="min-h-screen wellnest-app-bg wellnest-dashboard-bg">
      <div className="wellnest-dashboard-sprinkles" aria-hidden="true">
        {dashboardBackgroundEmojis.map((item, index) => (
          <span
            key={`${item.emoji}-${index}`}
            className="wellnest-dashboard-sprinkle"
            style={{
              top: item.top,
              left: item.left,
              fontSize: item.size,
              opacity: item.opacity,
              transform: `rotate(${item.rotate})`
            }}
          >
            {item.emoji}
          </span>
        ))}
      </div>
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm overflow-visible">
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
                  aria-haspopup="menu"
                  aria-expanded={isDropdownOpen}
                >
                  Account
                  <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-[120]">
                    <button
                      onClick={() => { handleSwitchAccount(); setIsDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Switch Account
                    </button>
                    <div className="h-px bg-gray-100 my-1" />
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
                      onClick={() => { handleLogout(); setIsDropdownOpen(false); }}
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
          <div className="border-t border-slate-100 flex items-center justify-between py-1.5 px-1">
            <div className="flex items-center gap-1 overflow-x-auto">
              {dashboardHeaderTabs.map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => tab.navigateTo ? navigate(tab.navigateTo) : scrollToSection(tab.sectionId)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors whitespace-nowrap"
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => scrollToSection('reminder-center-section')}
              title="Reminder Center"
              className="relative flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {inAppNotifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
              )}
            </button>
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
        onClose={handleCloseWorkoutLogModal}
        onSuccess={handleWorkoutLogged}
        initialWorkoutData={editingWorkoutSession}
        onSubmitWorkout={editingWorkoutSession ? handleSubmitWorkoutSessionUpdate : undefined}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 wellnest-content-layer">
        <div className="wellnest-surface p-6 md:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="wellnest-muted-kicker">Performance dashboard</p>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name || 'WellNester'} 👋</h1>
            <p className="text-gray-600 mt-2">Here’s a snapshot of your progress and your membership.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold shadow hover:bg-primary-700"
              onClick={() => navigate('/fitness-goals')}
            >
              Update Goals
            </button>
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700"
              onClick={() => navigate('/trainers')}
            >
              👥 View Trainers
            </button>
          </div>
        </div>

        {/* Health & Medical Section */}
        <section id="health-medical-section" className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 wellnest-section-title">🩺 Health & Medical</h2>
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

          {/* BMI Calculator Section */}
          <div id="bmi-calculator-section" className="mb-8">
            <BMICalculator />
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => scrollToSection('workout-plans-section')}
                className="px-4 py-2 rounded-lg border border-primary-200 bg-primary-50 text-primary-700 text-sm font-semibold hover:bg-primary-100 transition-colors"
              >
                See recommended workout plans ↓
              </button>
            </div>
          </div>
        </section>

        {/* Wellness Tools Section */}
        <section id="wellness-tools-section" className="mt-10 wellnest-surface p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 wellnest-section-title">⚡ Wellness Tools</h2>
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

        <section className="wellnest-surface p-6 md:p-8 mt-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 wellnest-section-title">🔥 Consistency & Health Score</h2>
              <p className="text-sm text-gray-600 mt-1">Gamified momentum from workouts, hydration, sleep, and calorie balance.</p>
            </div>
            <button
              onClick={() => navigate('/fitness-goals')}
              className="px-4 py-2 rounded-lg border border-primary-200 bg-primary-50 text-primary-700 text-sm font-semibold hover:bg-primary-100 transition-colors"
            >
              Open Fitness Goals →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
              <p className="text-sm text-orange-700 font-semibold">🔥 Workout Streak</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{dashboardWellness.streaks.workout} days</p>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-sky-50 p-5">
              <p className="text-sm text-sky-700 font-semibold">💧 Hydration Streak</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{dashboardWellness.streaks.hydration} days</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 p-5">
              <p className="text-sm text-violet-700 font-semibold">😴 Sleep Goal Streak</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{dashboardWellness.streaks.sleep} days</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Today&apos;s Health Score</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">
                  {dashboardWellness.healthScore} / 100 {dashboardWellness.healthScore >= 80 ? '🟢' : dashboardWellness.healthScore >= 60 ? '🟡' : '🔴'}
                </h3>
                <p className="text-xs text-slate-500 mt-2">Formula: 30% Steps + 25% Sleep + 20% Water + 25% Calories balance</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
              {[
                { key: 'steps', label: 'Steps' },
                { key: 'sleep', label: 'Sleep' },
                { key: 'water', label: 'Water' },
                { key: 'calories', label: 'Calories' }
              ].map((item) => (
                <div key={item.key} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
                  <p className="text-base font-semibold text-slate-900 mt-1">{getScoreLabel(dashboardWellness.components[item.key])}</p>
                  <p className="text-xs text-slate-500 mt-1">{dashboardWellness.components[item.key]}/100</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="analytics-graph-section" className="wellnest-surface p-8 mt-10">
          <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 mb-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-gray-900">📊 Activity Progress</h2>
              <button
                onClick={() => setIsWorkoutLogModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 flex-shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Log Workout
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {workoutTypeList.map(({ label, icon }) => {
                const count = label === 'All'
                  ? recentWorkoutSessions.length
                  : recentWorkoutSessions.filter(s => s.workoutType === label).length;
                const isActive = activeWorkoutType === label;
                return (
                  <button
                    key={label}
                    onClick={() => setActiveWorkoutType(label)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                    }`}
                  >
                    <span>{icon}</span>
                    <span>{label}</span>
                    {count > 0 && (
                      <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
                      }`}>{count}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Net Calories card */}
            <div className="rounded-2xl p-5 border border-blue-100 bg-gradient-to-br from-blue-50 to-sky-100 relative overflow-hidden group transition-all hover:shadow-md wellnest-emoji-card">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-sky-500 text-white text-lg shadow">⚡</span>
                <p className="text-sm font-semibold text-blue-700">Net Calories</p>
              </div>
              <h3 className={`text-2xl font-bold mb-1 ${dashboardSummary?.netCalories != null && dashboardSummary.netCalories < 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                {dashboardSummary ? `${dashboardSummary.netCalories} cal` : '—'}
              </h3>
              {dashboardSummary && (
                <div className="text-xs text-gray-600 mb-2 space-y-0.5">
                  <p className="text-green-600">+{dashboardSummary.caloriesConsumed} consumed</p>
                  <p className="text-orange-600">−{dashboardSummary.caloriesBurned} burned</p>
                </div>
              )}
              <div className="h-14 w-full mt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData1}>
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={false} isAnimationActive />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Protein card */}
            <div className="rounded-2xl p-5 border border-green-100 bg-gradient-to-br from-green-50 to-emerald-100 relative overflow-hidden group transition-all hover:shadow-md wellnest-emoji-card">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 text-white text-lg shadow">🥩</span>
                <p className="text-sm font-semibold text-emerald-700">Protein Intake</p>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {dashboardSummary ? `${dashboardSummary.totalProtein}g` : '—'}
              </h3>
              <p className="text-xs text-gray-500">From meal logs</p>
              <p className="text-xs text-emerald-600 mt-1 font-medium">Target: 50–60g daily</p>
            </div>

            {/* Workout Time card */}
            <div className="rounded-2xl p-5 border border-pink-100 bg-gradient-to-br from-pink-50 to-rose-100 relative overflow-hidden group transition-all hover:shadow-md wellnest-emoji-card">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white text-lg shadow">⏱️</span>
                <p className="text-sm font-semibold text-pink-700">Workout Time</p>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {dashboardSummary?.workoutMinutes != null
                  ? `${dashboardSummary.workoutMinutes} min`
                  : recentWorkoutSessions.length > 0
                    ? `${recentWorkoutSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0)} min`
                    : '—'}
              </h3>
              <p className="text-xs text-gray-500">From workout logs</p>
            </div>

            {/* Calories Burned card */}
            <div className="rounded-2xl p-5 border border-purple-100 bg-gradient-to-br from-purple-50 to-violet-100 relative overflow-hidden group transition-all hover:shadow-md wellnest-emoji-card">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 text-white text-lg shadow">🔥</span>
                <p className="text-sm font-semibold text-purple-700">Calories Burned</p>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {dashboardSummary?.caloriesBurned != null
                  ? `${dashboardSummary.caloriesBurned} cal`
                  : recentWorkoutSessions.length > 0
                    ? `${recentWorkoutSessions.reduce((sum, s) => sum + (s.caloriesBurned || 0), 0)} cal`
                    : '—'}
              </h3>
              <p className="text-xs text-gray-500">From workout logs</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {[{ key: 'burned', label: 'Burned' }, { key: 'consumed', label: 'Consumed' }, { key: 'net', label: 'Net' }].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setChartMetric(key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all border ${
                  chartMetric === key
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-500 border-gray-200 hover:text-gray-800 hover:border-gray-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 mb-8">
            {[{ key: 'week', label: 'Last Week' }, { key: 'month', label: 'Last Month' }, { key: 'year', label: 'Last Year' }].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setChartPeriod(key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                  chartPeriod === key
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-500 border-gray-200 hover:text-gray-800 hover:border-gray-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="h-80 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityChartData} margin={{ top: 10, right: 10, left: 30, bottom: 35 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={true} horizontal={false} stroke="#f1f5f9" strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }}
                  dy={15}
                  label={{ value: chartPeriod === 'week' ? 'Day of Week' : chartPeriod === 'month' ? 'Day of Month' : 'Month', position: 'insideBottom', offset: -16, style: { fill: '#64748b', fontSize: 12, fontWeight: 600 } }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }}
                  dx={-10}
                  domain={chartMetric === 'net' ? ['auto', 'auto'] : [0, 'auto']}
                  label={{ value: chartMetric === 'consumed' ? 'Calories Consumed (cal)' : chartMetric === 'net' ? 'Net Calories (cal)' : 'Calories Burned (cal)', angle: -90, position: 'insideLeft', offset: 10, style: { fill: '#64748b', fontSize: 12, fontWeight: 600 } }}
                />
                <RechartsTooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                  formatter={(value) => {
                    const label = chartMetric === 'consumed' ? 'Calories Consumed' : chartMetric === 'net' ? 'Net Calories' : 'Calories Burned';
                    return [`${value} cal`, label];
                  }}
                />
                <Area type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="rounded-2xl p-6 border border-slate-100 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 wellnest-emoji-card">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🏋️</span>
              <p className="text-sm font-semibold text-blue-700">Workout Sessions</p>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {recentWorkoutSessions.length > 0 ? `${recentWorkoutSessions.length} session${recentWorkoutSessions.length > 1 ? 's' : ''}` : 'No sessions yet'}
            </h3>
            <p className="text-sm text-blue-600 mt-2">
              {recentWorkoutSessions.length > 0 ? 'Recent logged workouts' : 'Log your first workout above'}
            </p>
          </div>
          <div className="rounded-2xl p-6 border border-slate-100 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100 wellnest-emoji-card">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🔥</span>
              <p className="text-sm font-semibold text-orange-700">Calories Burned</p>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {dashboardSummary?.caloriesBurned != null
                ? `${dashboardSummary.caloriesBurned} kcal`
                : recentWorkoutSessions.length > 0
                  ? `${recentWorkoutSessions.reduce((s, r) => s + (r.caloriesBurned || 0), 0)} kcal`
                  : '— kcal'}
            </h3>
            <p className="text-sm text-orange-600 mt-2">
              {dashboardSummary?.caloriesConsumed != null ? `${dashboardSummary.caloriesConsumed} kcal consumed` : 'Track meals for full picture'}
            </p>
          </div>
          <div className="rounded-2xl p-6 border border-slate-100 shadow-sm bg-gradient-to-br from-violet-50 to-violet-100 wellnest-emoji-card">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">⏱️</span>
              <p className="text-sm font-semibold text-violet-700">Active Minutes</p>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {dashboardSummary?.workoutMinutes != null
                ? `${dashboardSummary.workoutMinutes} mins`
                : recentWorkoutSessions.length > 0
                  ? `${recentWorkoutSessions.reduce((s, r) => s + (r.durationMinutes || 0), 0)} mins`
                  : '— mins'}
            </h3>
            <p className="text-sm text-violet-600 mt-2">
              {latestHealthMetrics?.bmi ? `BMI ${latestHealthMetrics.bmi.toFixed(1)} on record` : 'Update health metrics'}
            </p>
          </div>
        </section>

        {/* Recent Workout Sessions */}
        {recentWorkoutSessions.length > 0 && (
          <section id="recent-workouts-section" className="wellnest-surface p-8 mt-10">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 wellnest-section-title">🕒 Recent Workouts</h2>
              <button
                onClick={handleClearRecentWorkouts}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors"
              >
                Clear Recent
              </button>
            </div>
            <div className="space-y-3">
              {recentWorkoutSessions.map((session, idx) => (
                <div key={session.id || idx} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-2xl">
                        {session.workoutType === 'Running' ? '🏃' :
                          session.workoutType === 'Cycling' ? '🚴' :
                            session.workoutType === 'Yoga' ? '🧘' :
                              session.workoutType === 'Swimming' ? '🏊' :
                                session.workoutType === 'Weightlifting' ? '🏋️' : '🚶'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900">{session.workoutName || session.workoutType}</h3>
                      <p className="text-sm text-gray-500">
                        {session.durationMinutes} min · {session.caloriesBurned} cal burned
                        {session.completedAt && ` · ${new Date(session.completedAt).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 md:justify-end">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Completed
                    </span>
                    <button
                      onClick={() => handleEditWorkoutSession(session)}
                      className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 text-sm font-semibold hover:bg-blue-100 transition-colors"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteRecentWorkout(session.id)}
                      className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Notification Controls Section */}
        <section id="reminder-center-section" className="mt-12">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 px-6 py-5 text-white flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Reminder Center</h2>
                <p className="text-sm text-slate-200 mt-1">
                  {!notificationSupported
                    ? 'Browser popups unavailable — in-app reminders are active.'
                    : notificationPermission === 'granted'
                      ? 'Browser and in-app reminders are enabled.'
                      : notificationPermission === 'denied'
                        ? 'Browser notifications are blocked — using in-app reminder feed.'
                        : 'Permission pending — test to enable browser popups.'}
                </p>
              </div>
              <button
                onClick={testNotification}
                className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors"
              >
                Test Notifications
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Water Card */}
                <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900">💧 Hydration Reminder</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={waterReminderEnabled}
                        onChange={(e) => setWaterReminderEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={waterIntervalHours}
                      onChange={(e) => setWaterIntervalHours(parseInt(e.target.value) || 0)}
                      className="px-3 py-2 border border-slate-200 rounded-lg text-center"
                      placeholder="HH"
                    />
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={waterIntervalMinutes}
                      onChange={(e) => setWaterIntervalMinutes(parseInt(e.target.value) || 0)}
                      className="px-3 py-2 border border-slate-200 rounded-lg text-center"
                      placeholder="MM"
                    />
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={waterIntervalSeconds}
                      onChange={(e) => setWaterIntervalSeconds(parseInt(e.target.value) || 0)}
                      className="px-3 py-2 border border-slate-200 rounded-lg text-center"
                      placeholder="SS"
                    />
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                      <span>Today</span>
                      <span className="font-semibold">{waterGlassesToday} / 8 glasses</span>
                    </div>
                    <div className="h-2 rounded-full bg-sky-100">
                      <div className="h-2 rounded-full bg-sky-500 transition-all" style={{ width: `${Math.min((waterGlassesToday / 8) * 100, 100)}%` }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={startWaterReminder} className="py-2.5 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800">Start</button>
                    <button onClick={stopWaterReminder} className="py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100">Stop</button>
                  </div>
                  <button
                    onClick={handleWaterReminder}
                    disabled={waterGlassesToday >= 8}
                    className={`w-full mt-2 py-2.5 rounded-lg font-semibold ${waterGlassesToday >= 8 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-sky-600 text-white hover:bg-sky-700'}`}
                  >
                    {waterGlassesToday >= 8 ? 'Daily Goal Reached' : 'Log Glass'}
                  </button>
                  <p className="mt-2 text-xs text-slate-500">Status: {waterTimerId ? 'Active' : 'Inactive'}</p>
                </div>

                {/* Sleep Card */}
                <div className="bg-violet-50 border border-violet-100 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900">😴 Sleep Reminder</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sleepReminderEnabled}
                        onChange={(e) => setSleepReminderEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <select value={sleepHour} onChange={(e) => setSleepHour(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-center">
                      {[...Array(12)].map((_, i) => {
                        const hour = i + 1;
                        return <option key={hour} value={hour.toString().padStart(2, '0')}>{hour.toString().padStart(2, '0')}</option>;
                      })}
                    </select>
                    <select value={sleepMinute} onChange={(e) => setSleepMinute(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-center">
                      {[...Array(60)].map((_, i) => <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</option>)}
                    </select>
                    <select value={sleepPeriod} onChange={(e) => setSleepPeriod(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-center">
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>

                  <div className="text-xs text-slate-600 mb-4">Alarm at {sleepHour}:{sleepMinute} {sleepPeriod} • Recommended 7-8h sleep</div>

                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <button onClick={startSleepReminder} className="py-2.5 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800">Start</button>
                    <button onClick={stopSleepReminder} className="py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100">Stop</button>
                  </div>
                  <button onClick={handleSleepReminder} className="w-full py-2.5 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-700">Send Now</button>
                  <button onClick={() => navigate('/sleep-tracker')} className="w-full py-2.5 rounded-lg mt-2 border border-violet-300 text-violet-700 font-semibold hover:bg-violet-100">Open Sleep Tracker</button>
                  <p className="mt-2 text-xs text-slate-500">Status: {sleepTimerId ? 'Active' : 'Inactive'}</p>
                </div>
              </div>

              {/* In-app Feed */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-900">Recent Alerts</h3>
                  <span className="text-xs text-slate-500">In-app fallback</span>
                </div>
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {inAppNotifications.length === 0 ? (
                    <div className="text-sm text-slate-500 bg-white rounded-xl border border-slate-200 p-4">
                      No alerts yet. Start a water or sleep reminder and alerts will appear here.
                    </div>
                  ) : (
                    inAppNotifications.map((item) => (
                      <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                          <span className="text-[11px] text-slate-400 whitespace-nowrap">{item.createdAt}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{item.body}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="workout-plans-section" className="mt-12 wellnest-surface p-6 md:p-8">
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

          <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 max-w-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Workout Analytics</h3>
            <div className="space-y-1 text-gray-700 text-sm">
              <p>💪 Frequency: <span className="font-semibold">{workoutPlanAnalytics.frequency} workouts</span></p>
              <p>⏱️ Total Duration: <span className="font-semibold">{workoutPlanAnalytics.totalDurationMinutes} mins</span></p>
              <p>🔥 Streak: <span className="font-semibold">{workoutPlanAnalytics.streak} days</span></p>
            </div>
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

        <section id="membership-section" className="mt-12 wellnest-surface p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Our Expert Trainers 💪</h2>
              <p className="text-gray-600 mt-1">Choose from certified Tamil Nadu trainers across multiple specializations.</p>
            </div>
            <button
              onClick={() => navigate('/trainers')}
              className="px-5 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trainerPreview.map((trainer) => (
              <div key={trainer.name} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 wellnest-emoji-card">
                <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center text-lg font-bold mb-4">
                  {trainer.name[0]}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{trainer.name}</h3>
                <p className="text-green-600 font-semibold mt-1">{trainer.specialization}</p>
                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Hourly Rate</p>
                    <p className="text-2xl font-bold text-green-600">₹{trainer.rate}</p>
                  </div>
                  <button
                    onClick={() => navigate('/trainers')}
                    className="px-4 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600"
                  >
                    Book Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default Dashboard;
