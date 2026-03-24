import React, { useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { getUserGoals, createGoal, updateGoal, deleteGoal } from '../utils/fitnessGoalsApi';
import { getLatestHealthMetrics, recordHealthMetrics, getHealthMetricsByDateRange } from '../utils/medicalApi';
import { getSleepByDate, getUserSleepLogs } from '../utils/sleepApi';
import { getCalorieSummary, getUserSessions } from '../utils/calorieApi';
import PageHeader from '../components/PageHeader';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    Legend
} from 'recharts';

const asNumber = (...values) => {
    for (const value of values) {
        if (value === null || value === undefined || value === '') continue;
        const num = Number(value);
        if (Number.isFinite(num)) return num;
    }
    return 0;
};

const isSameDay = (value, yyyyMmDd) => {
    if (!value) return false;

    const raw = String(value);
    // Direct string prefix match (covers "2026-03-14T..." from backend)
    if (raw.startsWith(yyyyMmDd)) return true;

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return false;
    // Compare using LOCAL date parts to avoid UTC day-boundary shift (important for IST +5:30)
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, '0');
    const d = String(parsed.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}` === yyyyMmDd;
};

const parseLocalDateFromYyyyMmDd = (value) => {
    if (!value) return null;
    const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return null;
    const [, y, m, d] = match;
    return new Date(Number(y), Number(m) - 1, Number(d));
};

const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

const formatLocalDateKey = (value) => {
    if (!value) return null;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, '0');
    const d = String(parsed.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

const getRecentDayKeys = (days) => {
    const list = [];
    const now = new Date();
    for (let index = days - 1; index >= 0; index -= 1) {
        const day = new Date(now);
        day.setDate(now.getDate() - index);
        const y = day.getFullYear();
        const m = String(day.getMonth() + 1).padStart(2, '0');
        const d = String(day.getDate()).padStart(2, '0');
        list.push(`${y}-${m}-${d}`);
    }
    return list;
};

const computeCurrentStreak = (items, predicate) => {
    let streak = 0;
    for (let index = items.length - 1; index >= 0; index -= 1) {
        if (!predicate(items[index])) break;
        streak += 1;
    }
    return streak;
};

const computeCurrentStreakIgnoringTrailingMissing = (items, hasData, meetsGoal) => {
    let index = items.length - 1;

    // Ignore trailing days where metric data hasn't been logged yet (e.g., today's sleep)
    while (index >= 0 && !hasData(items[index])) {
        index -= 1;
    }

    let streak = 0;
    for (; index >= 0; index -= 1) {
        const day = items[index];
        if (!hasData(day)) break;
        if (!meetsGoal(day)) break;
        streak += 1;
    }

    return streak;
};

const normalizeWorkoutType = (value) => {
    if (!value) return 'Other';
    const cleaned = String(value).trim();
    if (!cleaned) return 'Other';
    return cleaned;
};

const getScoreLabel = (value) => {
    if (value >= 80) return 'Good';
    if (value >= 60) return 'Average';
    return 'Low';
};

const statusLegend = [
    { label: 'Good', tone: 'bg-green-100 text-green-700 border-green-200' },
    { label: 'Average', tone: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { label: 'Poor', tone: 'bg-red-100 text-red-700 border-red-200' }
];

const metricDefinitions = [
    { key: 'Steps', icon: '👣', unit: 'steps', accent: 'from-emerald-500 to-green-500' },
    { key: 'Sleep', icon: '😴', unit: 'hours', accent: 'from-indigo-500 to-violet-500' },
    { key: 'Hydration', icon: '💧', unit: 'liters', accent: 'from-sky-500 to-cyan-500' },
    { key: 'Workout', icon: '💪', unit: 'minutes', accent: 'from-orange-500 to-amber-500' }
];

const getSuggestedStepsFromBmi = (bmi) => {
    if (!bmi || bmi <= 0) {
        return {
            target: 9000,
            guidance: 'General baseline recommendation',
            note: 'Track consistently for a week, then increase gradually if comfortable.'
        };
    }

    if (bmi < 18.5) {
        return {
            target: 7500,
            guidance: 'Underweight range (focus on balanced activity)',
            note: 'Keep activity moderate and combine with nutrition support.'
        };
    }

    if (bmi < 25) {
        return {
            target: 9000,
            guidance: 'Healthy BMI range',
            note: 'Maintain consistency between 8k-10k steps/day.'
        };
    }

    if (bmi < 30) {
        return {
            target: 10500,
            guidance: 'Overweight range (weight-management focus)',
            note: 'Aim for 10k+ with gradual progression and rest days.'
        };
    }

    return {
        target: 8500,
        guidance: 'Obesity range (start sustainable)',
        note: 'Begin with steady daily movement and increase step target progressively.'
    };
};

const FitnessGoals = () => {
    const [goals, setGoals] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        goalType: 'WEIGHT_LOSS',
        targetWeight: '',
        targetCalories: '',
        targetSteps: '',
        targetWorkoutMinutes: '',
        targetDate: '',
        notes: ''
    });
    const [editingGoal, setEditingGoal] = useState(null);
    const [todayStats, setTodayStats] = useState({
        steps: 0,
        sleepHours: 0,
        waterLiters: 0,
        workoutMinutes: 0,
        caloriesConsumed: 0,
        bmi: 0
    });
    const [weeklyAnalytics, setWeeklyAnalytics] = useState({
        trend: [],
        streaks: {
            workout: 0,
            hydration: 0,
            sleep: 0
        },
        workoutsPerWeek: 0,
        totalWorkoutMinutes: 0,
        exerciseDistribution: []
    });
    const [showDailyUpdate, setShowDailyUpdate] = useState(false);
    const [dailyUpdate, setDailyUpdate] = useState({
        stepsCount: '',
        workoutDurationMinutes: ''
    });
    const [lastCelebrationKey, setLastCelebrationKey] = useState('');

    const fetchTodayStats = useCallback(async () => {
        try {
            // Use local date (not UTC) to avoid day-boundary mismatches for IST users
            const now = new Date();
            const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
            const todayEnd = `${today}T23:59:59`;
            const recentDayKeys = getRecentDayKeys(7);
            const weekStart = `${recentDayKeys[0]}T00:00:00`;

            const safeCalorieSummariesPromise = Promise.all(
                recentDayKeys.map((day) => getCalorieSummary(day).catch(() => null))
            );

            const [healthResult, weekMetricsResult, sleepResult, sleepLogsResult, sessionsResult, caloriesByDayResult] = await Promise.allSettled([
                getLatestHealthMetrics(),
                getHealthMetricsByDateRange(weekStart, todayEnd),
                getSleepByDate(today),
                getUserSleepLogs(),
                getUserSessions(),
                safeCalorieSummariesPromise
            ]);

            const health = healthResult.status === 'fulfilled' ? healthResult.value : null;
            const weekMetrics = weekMetricsResult.status === 'fulfilled' && Array.isArray(weekMetricsResult.value)
                ? weekMetricsResult.value
                : [];
            const sleepLog = sleepResult.status === 'fulfilled' ? sleepResult.value : null;
            const sleepLogs = sleepLogsResult.status === 'fulfilled' && Array.isArray(sleepLogsResult.value)
                ? sleepLogsResult.value
                : [];
            const sessions = sessionsResult.status === 'fulfilled' && Array.isArray(sessionsResult.value)
                ? sessionsResult.value
                : [];
            const calorieSummaries = caloriesByDayResult.status === 'fulfilled' && Array.isArray(caloriesByDayResult.value)
                ? caloriesByDayResult.value
                : [];

            const daySet = new Set(recentDayKeys);
            const weeklySessions = sessions.filter((session) => {
                const dateValue = session?.completedAt || session?.createdAt || session?.sessionDate;
                const key = formatLocalDateKey(dateValue);
                return Boolean(key && daySet.has(key));
            });

            const weeklyTrend = recentDayKeys.map((day, idx) => {
                const dayMetrics = weekMetrics.filter((metric) => {
                    const dateValue = metric?.recordedAt || metric?.createdAt || metric?.recordDate || metric?.metricDate;
                    return isSameDay(dateValue, day);
                });

                const daySleepLog = sleepLogs.find((log) => isSameDay(log?.sleepDate, day));

                const sessionsForDay = weeklySessions.filter((session) => {
                    const dateValue = session?.completedAt || session?.createdAt || session?.sessionDate;
                    return isSameDay(dateValue, day);
                });

                const steps = dayMetrics.reduce(
                    (max, metric) => Math.max(max, asNumber(metric?.stepsCount, metric?.stepCount, metric?.steps)),
                    0
                );

                const workoutMinutesFromMetrics = dayMetrics.reduce(
                    (max, metric) => Math.max(max, asNumber(metric?.workoutDurationMinutes, metric?.workoutMinutes)),
                    0
                );

                const sessionWorkoutMinutes = sessionsForDay.reduce(
                    (sum, session) => sum + asNumber(session?.durationMinutes, session?.duration, session?.workoutDurationMinutes),
                    0
                );

                const workoutMinutes = Math.max(workoutMinutesFromMetrics, sessionWorkoutMinutes);
                const sleepHours = asNumber(daySleepLog?.hoursSlept, daySleepLog?.hours_slept);
                const waterLiters = asNumber(
                    daySleepLog?.waterLiters,
                    daySleepLog?.water_liters,
                    asNumber(daySleepLog?.waterGlasses, daySleepLog?.water_glasses) * 0.25
                );
                const calorieSummary = calorieSummaries[idx] || null;

                return {
                    day,
                    label: new Date(`${day}T00:00:00`).toLocaleDateString(undefined, { weekday: 'short' }),
                    steps,
                    sleepHours,
                    waterLiters,
                    hasSleepData: Boolean(daySleepLog),
                    workoutMinutes,
                    workoutCount: sessionsForDay.length,
                    caloriesConsumed: asNumber(
                        calorieSummary?.caloriesConsumed,
                        calorieSummary?.totalCalories,
                        calorieSummary?.consumedCalories
                    ),
                    caloriesTarget: asNumber(
                        calorieSummary?.targetCalories,
                        calorieSummary?.calorieTarget,
                        calorieSummary?.recommendedCalories
                    )
                };
            });

            const todayTrend = weeklyTrend[weeklyTrend.length - 1] || {
                steps: 0,
                sleepHours: 0,
                waterLiters: 0,
                workoutMinutes: 0,
                caloriesConsumed: 0
            };

            const workoutTypeMap = new Map();
            weeklySessions.forEach((session) => {
                const type = normalizeWorkoutType(session?.workoutType || session?.exerciseType || session?.name);
                const minutes = asNumber(session?.durationMinutes, session?.duration, session?.workoutDurationMinutes);
                const existing = workoutTypeMap.get(type) || { type, count: 0, minutes: 0 };
                existing.count += 1;
                existing.minutes += minutes;
                workoutTypeMap.set(type, existing);
            });

            const exerciseDistribution = Array.from(workoutTypeMap.values())
                .sort((a, b) => b.minutes - a.minutes)
                .slice(0, 5);

            const steps = Math.max(
                todayTrend.steps,
                asNumber(health?.stepsCount, health?.stepCount, health?.steps_count, health?.steps, health?.stepsTaken)
            );

            const workoutMinutesFromLatestHealth = asNumber(
                asNumber(health?.workoutDurationMinutes, health?.workout_duration_minutes, health?.workoutMinutes, health?.durationMinutes)
            );
            const todayDate = parseLocalDateFromYyyyMmDd(today);
            const recentSleepLog = sleepLogs.find((log) => {
                const logDate = parseLocalDateFromYyyyMmDd(log?.sleepDate);
                if (!todayDate || !logDate) return false;
                const dayDiff = Math.round((todayDate.getTime() - logDate.getTime()) / (24 * 60 * 60 * 1000));
                return dayDiff >= 0 && dayDiff <= 2;
            });

            const effectiveSleepLog = sleepLog
                || sleepLogs.find((log) => isSameDay(log?.sleepDate, today))
                || recentSleepLog
                || sleepLogs[0]
                || null;

            const sleepHours = asNumber(effectiveSleepLog?.hoursSlept, effectiveSleepLog?.hours_slept);
            const waterLiters = asNumber(
                effectiveSleepLog?.waterLiters,
                effectiveSleepLog?.water_liters,
                asNumber(effectiveSleepLog?.waterGlasses, effectiveSleepLog?.water_glasses) * 0.25
            );

            const workoutMinutes = Math.max(todayTrend.workoutMinutes, workoutMinutesFromLatestHealth);

            const weight = asNumber(health?.weight);
            const heightCm = asNumber(health?.height);
            const derivedBmi = (weight > 0 && heightCm > 0)
                ? (weight / Math.pow(heightCm / 100, 2))
                : 0;
            const bmi = asNumber(health?.bmi, derivedBmi);

            setTodayStats({
                steps,
                sleepHours,
                waterLiters,
                workoutMinutes,
                caloriesConsumed: todayTrend.caloriesConsumed,
                bmi
            });

            setWeeklyAnalytics({
                trend: weeklyTrend,
                streaks: {
                    workout: computeCurrentStreak(weeklyTrend, (day) => day.workoutMinutes > 0),
                    hydration: computeCurrentStreakIgnoringTrailingMissing(
                        weeklyTrend,
                        (day) => day.hasSleepData,
                        (day) => day.waterLiters >= 2
                    ),
                    sleep: computeCurrentStreakIgnoringTrailingMissing(
                        weeklyTrend,
                        (day) => day.hasSleepData,
                        (day) => day.sleepHours >= 7
                    )
                },
                workoutsPerWeek: weeklySessions.length,
                totalWorkoutMinutes: weeklyTrend.reduce((sum, day) => sum + day.workoutMinutes, 0),
                exerciseDistribution
            });
        } catch (error) {
            console.error('Error fetching today stats:', error);
        }
    }, []);

    const fetchGoals = useCallback(async () => {
        try {
            const data = await getUserGoals();
            setGoals(data);
        } catch (error) {
            alert('Error fetching goals: ' + error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGoals();
        fetchTodayStats();
    }, [fetchGoals, fetchTodayStats]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const goalData = {
                ...formData,
                targetWeight: formData.targetWeight ? parseFloat(formData.targetWeight) : null,
                targetCalories: formData.targetCalories ? parseInt(formData.targetCalories) : null,
                targetSteps: formData.targetSteps ? parseInt(formData.targetSteps) : null,
                targetWorkoutMinutes: formData.targetWorkoutMinutes ? parseInt(formData.targetWorkoutMinutes) : null,
                targetDate: formData.targetDate ? new Date(formData.targetDate).toISOString() : null
            };

            if (editingGoal) {
                await updateGoal(editingGoal.id, goalData);
                alert('Goal updated successfully!');
            } else {
                await createGoal(goalData);
                alert('Goal created successfully!');
            }
            
            setShowForm(false);
            setEditingGoal(null);
            setFormData({
                goalType: 'WEIGHT_LOSS',
                targetWeight: '',
                targetCalories: '',
                targetSteps: '',
                targetWorkoutMinutes: '',
                targetDate: '',
                notes: ''
            });
            fetchGoals();
        } catch (error) {
            alert('Error saving goal: ' + error.message);
        }
    };

    const handleEdit = (goal) => {
        setEditingGoal(goal);
        setFormData({
            goalType: goal.goalType,
            targetWeight: goal.targetWeight || '',
            targetCalories: goal.targetCalories || '',
            targetSteps: goal.targetSteps || '',
            targetWorkoutMinutes: goal.targetWorkoutMinutes || '',
            targetDate: goal.targetDate ? goal.targetDate.substring(0, 10) : '',
            notes: goal.notes || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this goal?')) {
            try {
                await deleteGoal(id);
                alert('Goal deleted successfully!');
                fetchGoals();
            } catch (error) {
                alert('Error deleting goal: ' + error.message);
            }
        }
    };

    const handleDailyUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const stepsCount = dailyUpdate.stepsCount === '' ? null : Math.max(0, parseInt(dailyUpdate.stepsCount, 10) || 0);
            const workoutDurationMinutes = dailyUpdate.workoutDurationMinutes === ''
                ? null
                : Math.max(0, parseInt(dailyUpdate.workoutDurationMinutes, 10) || 0);

            if (stepsCount === null && workoutDurationMinutes === null) {
                alert('Please enter steps or workout minutes to update.');
                return;
            }

            await recordHealthMetrics({
                stepsCount,
                workoutDurationMinutes,
                recordedAt: new Date().toISOString(),
                notes: 'Quick activity update from Fitness Goals'
            });

            setShowDailyUpdate(false);
            setDailyUpdate({ stepsCount: '', workoutDurationMinutes: '' });
            await fetchTodayStats();
            alert('Today\'s activity updated successfully!');
        } catch (error) {
            alert('Failed to update activity: ' + error.message);
        }
    };

    const getGoalTypeLabel = (type) => {
        const labels = {
            'WEIGHT_LOSS': 'Weight Loss',
            'MUSCLE_GAIN': 'Muscle Gain',
            'ENDURANCE': 'Endurance',
            'FLEXIBILITY': 'Flexibility',
            'GENERAL_FITNESS': 'General Fitness'
        };
        return labels[type] || type;
    };

    const getStatusColor = (status) => {
        const colors = {
            'ACTIVE': 'bg-green-100 text-green-800',
            'COMPLETED': 'bg-blue-100 text-blue-800',
            'PAUSED': 'bg-yellow-100 text-yellow-800',
            'ABANDONED': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getMetricState = (value, target) => {
        if (!target || target <= 0) return { label: 'Average', color: 'text-yellow-700 bg-yellow-100', bar: 'bg-yellow-500' };
        const ratio = value / target;
        if (ratio >= 1) return { label: 'Good', color: 'text-green-700 bg-green-100', bar: 'bg-green-500' };
        if (ratio >= 0.6) return { label: 'Average', color: 'text-yellow-700 bg-yellow-100', bar: 'bg-yellow-500' };
        return { label: 'Poor', color: 'text-red-700 bg-red-100', bar: 'bg-red-500' };
    };

    const getDailyMetricState = (metric, value, target) => {
        switch (metric) {
            case 'sleep': {
                if (value >= 7) return { label: 'Good', color: 'text-green-700 bg-green-100', bar: 'bg-green-500' };
                if (value >= 6) return { label: 'Average', color: 'text-yellow-700 bg-yellow-100', bar: 'bg-yellow-500' };
                return { label: 'Poor', color: 'text-red-700 bg-red-100', bar: 'bg-red-500' };
            }
            case 'hydration': {
                if (value >= 2) return { label: 'Good', color: 'text-green-700 bg-green-100', bar: 'bg-green-500' };
                if (value >= 1) return { label: 'Average', color: 'text-yellow-700 bg-yellow-100', bar: 'bg-yellow-500' };
                return { label: 'Poor', color: 'text-red-700 bg-red-100', bar: 'bg-red-500' };
            }
            case 'steps': {
                if (!target || target <= 0) return { label: 'Average', color: 'text-yellow-700 bg-yellow-100', bar: 'bg-yellow-500' };
                const ratio = value / target;
                if (ratio >= 1) return { label: 'Good', color: 'text-green-700 bg-green-100', bar: 'bg-green-500' };
                if (ratio >= 0.6) return { label: 'Average', color: 'text-yellow-700 bg-yellow-100', bar: 'bg-yellow-500' };
                return { label: 'Poor', color: 'text-red-700 bg-red-100', bar: 'bg-red-500' };
            }
            case 'workout': {
                if (!target || target <= 0) return { label: 'Average', color: 'text-yellow-700 bg-yellow-100', bar: 'bg-yellow-500' };
                const ratio = value / target;
                if (ratio >= 1) return { label: 'Good', color: 'text-green-700 bg-green-100', bar: 'bg-green-500' };
                if (ratio >= 0.5) return { label: 'Average', color: 'text-yellow-700 bg-yellow-100', bar: 'bg-yellow-500' };
                return { label: 'Poor', color: 'text-red-700 bg-red-100', bar: 'bg-red-500' };
            }
            default:
                return getMetricState(value, target);
        }
    };

    const getGoalProgress = (goal) => {
        const hasLiveDailyTarget = Boolean(goal.targetSteps || goal.targetWorkoutMinutes || goal.targetCalories);

        if (!hasLiveDailyTarget && goal.progressPercentage !== null && goal.progressPercentage !== undefined) {
            const fallbackStatus = getMetricState(goal.progressPercentage, 100);
            return {
                percentage: Math.max(0, Math.min(goal.progressPercentage, 100)),
                currentText: `${goal.progressPercentage.toFixed(1)}% complete`,
                status: fallbackStatus,
                targetText: null
            };
        }

        if (goal.targetSteps) {
            const percentage = Math.max(0, Math.min((todayStats.steps / goal.targetSteps) * 100, 100));
            return {
                percentage,
                currentText: `${todayStats.steps.toLocaleString()} / ${goal.targetSteps.toLocaleString()} steps`,
                status: getDailyMetricState('steps', todayStats.steps, goal.targetSteps),
                targetText: 'Daily Steps Goal'
            };
        }

        if (goal.targetWorkoutMinutes) {
            const percentage = Math.max(0, Math.min((todayStats.workoutMinutes / goal.targetWorkoutMinutes) * 100, 100));
            return {
                percentage,
                currentText: `${todayStats.workoutMinutes} / ${goal.targetWorkoutMinutes} min`,
                status: getDailyMetricState('workout', todayStats.workoutMinutes, goal.targetWorkoutMinutes),
                targetText: 'Daily Workout Goal'
            };
        }

        if (goal.targetCalories) {
            const percentage = Math.max(0, Math.min((todayStats.caloriesConsumed / goal.targetCalories) * 100, 100));
            return {
                percentage,
                currentText: `${todayStats.caloriesConsumed} / ${goal.targetCalories} kcal`,
                status: getMetricState(todayStats.caloriesConsumed, goal.targetCalories),
                targetText: 'Daily Calories Goal'
            };
        }

        if (goal.progressPercentage !== null && goal.progressPercentage !== undefined) {
            const fallbackStatus = getMetricState(goal.progressPercentage, 100);
            return {
                percentage: Math.max(0, Math.min(goal.progressPercentage, 100)),
                currentText: `${goal.progressPercentage.toFixed(1)}% complete`,
                status: fallbackStatus,
                targetText: null
            };
        }

        return {
            percentage: 0,
            currentText: 'No measurable daily target available',
            status: { label: 'Average', color: 'text-yellow-700 bg-yellow-100', bar: 'bg-yellow-500' },
            targetText: null
        };
    };

    const activeGoal = goals.find((goal) => goal.status === 'ACTIVE') || goals[0];
    const suggestedStepsPlan = getSuggestedStepsFromBmi(todayStats.bmi);
    const effectiveStepsTarget = activeGoal?.targetSteps || suggestedStepsPlan.target;
    const stepCompletionPercentage = Math.max(0, Math.min((todayStats.steps / effectiveStepsTarget) * 100, 100));

    const coachMessage = stepCompletionPercentage >= 100
        ? `🎉 Brilliant! You achieved today’s step goal (${effectiveStepsTarget.toLocaleString()}).`
        : stepCompletionPercentage >= 60
            ? `🔥 Great momentum — just ${(effectiveStepsTarget - todayStats.steps).toLocaleString()} more steps to hit today’s goal.`
            : `💡 Let’s build momentum: a 10-minute brisk walk now will move you closer to ${(effectiveStepsTarget).toLocaleString()} steps.`;

    useEffect(() => {
        if (!effectiveStepsTarget || todayStats.steps < effectiveStepsTarget) return;

        const today = new Date().toISOString().split('T')[0];
        const celebrationKey = `${today}-${effectiveStepsTarget}`;
        if (lastCelebrationKey === celebrationKey) return;

        confetti({ particleCount: 120, spread: 80, origin: { y: 0.65 } });
        confetti({ particleCount: 90, angle: 60, spread: 70, origin: { x: 0 } });
        confetti({ particleCount: 90, angle: 120, spread: 70, origin: { x: 1 } });
        setLastCelebrationKey(celebrationKey);
    }, [todayStats.steps, effectiveStepsTarget, lastCelebrationKey]);

    const insights = [];

    if (effectiveStepsTarget) {
        const gap = effectiveStepsTarget - todayStats.steps;
        if (gap > 0) {
            insights.push({
                icon: '⚠️',
                text: `You need ${gap.toLocaleString()} more steps today`,
                tone: 'text-yellow-700 bg-yellow-50 border-yellow-200'
            });
        } else {
            insights.push({
                icon: '✅',
                text: 'Steps goal achieved',
                tone: 'text-green-700 bg-green-50 border-green-200'
            });
        }
    }

    if (todayStats.sleepHours >= 7) {
        insights.push({
            icon: '✅',
            text: 'Sleep target achieved',
            tone: 'text-green-700 bg-green-50 border-green-200'
        });
    } else if (todayStats.sleepHours >= 6) {
        insights.push({
            icon: '⚠️',
            text: 'Sleep slightly below recommended level',
            tone: 'text-yellow-700 bg-yellow-50 border-yellow-200'
        });
    } else if (todayStats.sleepHours > 0) {
        insights.push({
            icon: '⚠️',
            text: 'Sleep below recommended level',
            tone: 'text-red-700 bg-red-50 border-red-200'
        });
    }

    if (todayStats.waterLiters >= 2) {
        insights.push({
            icon: '✅',
            text: 'Hydration goal achieved',
            tone: 'text-green-700 bg-green-50 border-green-200'
        });
    } else if (todayStats.waterLiters >= 1) {
        insights.push({
            icon: '⚠️',
            text: 'Low hydration today',
            tone: 'text-yellow-700 bg-yellow-50 border-yellow-200'
        });
    } else if (todayStats.waterLiters > 0) {
        insights.push({
            icon: '⚠️',
            text: 'Hydration critically low today',
            tone: 'text-red-700 bg-red-50 border-red-200'
        });
    }

    if (activeGoal?.targetWorkoutMinutes) {
        if (todayStats.workoutMinutes >= activeGoal.targetWorkoutMinutes) {
            insights.push({
                icon: '✅',
                text: 'Workout goal achieved',
                tone: 'text-green-700 bg-green-50 border-green-200'
            });
        } else {
            insights.push({
                icon: '⚠️',
                text: `Need ${activeGoal.targetWorkoutMinutes - todayStats.workoutMinutes} more workout minutes`,
                tone: 'text-yellow-700 bg-yellow-50 border-yellow-200'
            });
        }
    }

    const activeGoalsCount = goals.filter((goal) => goal.status === 'ACTIVE').length;
    const completedGoalsCount = goals.filter((goal) => goal.status === 'COMPLETED').length;
    const dailyStates = {
        steps: getDailyMetricState('steps', todayStats.steps, effectiveStepsTarget),
        sleep: getDailyMetricState('sleep', todayStats.sleepHours, 7),
        hydration: getDailyMetricState('hydration', todayStats.waterLiters, 2),
        workout: getDailyMetricState('workout', todayStats.workoutMinutes, activeGoal?.targetWorkoutMinutes || 45)
    };

    const readinessSignals = [
        dailyStates.steps.label === 'Good' ? 100 : dailyStates.steps.label === 'Average' ? 70 : 35,
        dailyStates.sleep.label === 'Good' ? 100 : dailyStates.sleep.label === 'Average' ? 70 : 35,
        dailyStates.hydration.label === 'Good' ? 100 : dailyStates.hydration.label === 'Average' ? 70 : 35,
        dailyStates.workout.label === 'Good' ? 100 : dailyStates.workout.label === 'Average' ? 70 : 35
    ];
    const readinessScore = Math.round(readinessSignals.reduce((sum, value) => sum + value, 0) / readinessSignals.length);
    const readinessState = getMetricState(readinessScore, 100);

    const scoredTrend = useMemo(() => {
        return (weeklyAnalytics.trend || []).map((day) => {
            const stepsTarget = Math.max(effectiveStepsTarget || 9000, 1);
            const caloriesTarget = Math.max(day.caloriesTarget || activeGoal?.targetCalories || 2000, 1);

            const stepsScore = clamp((day.steps / stepsTarget) * 100, 0, 100);
            const sleepScore = clamp((day.sleepHours / 7) * 100, 0, 100);
            const waterScore = clamp((day.waterLiters / 2) * 100, 0, 100);
            const calorieDelta = Math.abs(day.caloriesConsumed - caloriesTarget);
            const calorieScore = clamp((1 - (calorieDelta / caloriesTarget)) * 100, 0, 100);

            const score = Math.round(
                (stepsScore * 0.30)
                + (sleepScore * 0.25)
                + (waterScore * 0.20)
                + (calorieScore * 0.25)
            );

            return {
                ...day,
                healthScore: score,
                stepScore: Math.round(stepsScore),
                sleepScore: Math.round(sleepScore),
                waterScore: Math.round(waterScore),
                calorieScore: Math.round(calorieScore)
            };
        });
    }, [weeklyAnalytics.trend, effectiveStepsTarget, activeGoal?.targetCalories]);

    const todaysScoredMetrics = scoredTrend[scoredTrend.length - 1] || {
        healthScore: 0,
        stepScore: 0,
        sleepScore: 0,
        waterScore: 0,
        calorieScore: 0,
        caloriesTarget: activeGoal?.targetCalories || 2000
    };
    const healthScoreTone = todaysScoredMetrics.healthScore >= 80
        ? '🟢'
        : todaysScoredMetrics.healthScore >= 60
            ? '🟡'
            : '🔴';

    const workoutDualLineData = scoredTrend.map((day) => ({
        name: day.label,
        workoutMinutes: day.workoutMinutes,
        workoutCount: day.workoutCount
    }));

    const workoutDaysCompleted = scoredTrend.filter((day) => day.workoutMinutes > 0).length;

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div className="min-h-screen wellnest-app-bg py-8 px-4">
            <div className="max-w-6xl mx-auto wellnest-content-layer">
                <PageHeader
                    title="Fitness Goals"
                    subtitle="Monitor daily execution, compare milestones, and stay on track."
                    icon="🎯"
                />
                <div className="bg-slate-900 text-white rounded-3xl shadow-xl overflow-hidden mb-8">
                    <div className="bg-[radial-gradient(circle_at_top_right,_rgba(96,165,250,0.35),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(52,211,153,0.25),_transparent_30%)] px-8 py-8 md:px-10 md:py-10">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                            <div className="max-w-2xl">
                                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100">
                                    Performance command center
                                </span>
                                <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">Fitness Goals</h1>
                                <p className="mt-3 text-slate-200 text-sm md:text-base leading-7">
                                    Monitor daily execution, compare it against your milestones, and catch early warning signals before a goal slips off track.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-w-full lg:min-w-[420px] lg:max-w-[460px]">
                                <div className="rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur-sm">
                                    <p className="text-xs uppercase tracking-wide text-slate-300">Readiness score</p>
                                    <p className="mt-2 text-3xl font-bold">{readinessScore}%</p>
                                    <span className={`inline-flex mt-3 rounded-full border px-2.5 py-1 text-xs font-semibold ${readinessState.color.replace('bg-', 'border-').replace('text-', 'text-').replace('bg-', 'bg-')}`}>
                                        {readinessState.label}
                                    </span>
                                </div>
                                <div className="rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur-sm">
                                    <p className="text-xs uppercase tracking-wide text-slate-300">Active goals</p>
                                    <p className="mt-2 text-3xl font-bold">{activeGoalsCount}</p>
                                    <p className="mt-3 text-xs text-slate-300">Focus areas currently in motion</p>
                                </div>
                                <div className="rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur-sm">
                                    <p className="text-xs uppercase tracking-wide text-slate-300">Completed</p>
                                    <p className="mt-2 text-3xl font-bold">{completedGoalsCount}</p>
                                    <p className="mt-3 text-xs text-slate-300">Milestones already achieved</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-4">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                                <div>
                                    <p className="text-sm font-semibold text-white">Today&apos;s suggested step goal: {effectiveStepsTarget.toLocaleString()} steps</p>
                                    <p className="text-xs text-slate-200 mt-1">
                                        Based on BMI {todayStats.bmi ? todayStats.bmi.toFixed(1) : 'N/A'} · {suggestedStepsPlan.guidance}
                                    </p>
                                    <p className="text-xs text-slate-300 mt-1">{suggestedStepsPlan.note}</p>
                                </div>
                                <button
                                    onClick={async () => {
                                        try {
                                            if (activeGoal?.id) {
                                                await updateGoal(activeGoal.id, { targetSteps: suggestedStepsPlan.target });
                                                await fetchGoals();
                                                alert(`Updated active goal to ${suggestedStepsPlan.target.toLocaleString()} steps/day.`);
                                                return;
                                            }

                                            setShowForm(true);
                                            setFormData((prev) => ({
                                                ...prev,
                                                targetSteps: String(suggestedStepsPlan.target)
                                            }));
                                            alert('No active goal found. Suggested steps were pre-filled in the goal form.');
                                        } catch (error) {
                                            alert('Failed to apply suggested steps: ' + error.message);
                                        }
                                    }}
                                    className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-100 transition"
                                >
                                    Apply suggested steps
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex flex-wrap gap-2">
                                {statusLegend.map((item) => (
                                    <span key={item.label} className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${item.tone}`}>
                                        {item.label}
                                    </span>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-2 justify-end">
                                <button
                                    onClick={() => setShowDailyUpdate(!showDailyUpdate)}
                                    className="inline-flex items-center justify-center rounded-xl border border-white/40 bg-white/15 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20 transition"
                                >
                                    {showDailyUpdate ? 'Close activity update' : 'Update steps/workout'}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowForm(!showForm);
                                        setEditingGoal(null);
                                        setFormData({
                                            goalType: 'WEIGHT_LOSS',
                                            targetWeight: '',
                                            targetCalories: '',
                                            targetSteps: '',
                                            targetWorkoutMinutes: '',
                                            targetDate: '',
                                            notes: ''
                                        });
                                    }}
                                    className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg hover:bg-slate-100 transition"
                                >
                                    {showForm ? 'Cancel editing' : '+ Create strategic goal'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {showDailyUpdate && (
                    <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-1 text-slate-900">Update today&apos;s activity</h2>
                        <p className="text-sm text-slate-500 mb-4">Use this quick update when steps or workout minutes need manual entry.</p>
                        <form onSubmit={handleDailyUpdateSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Steps today</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={dailyUpdate.stepsCount}
                                    onChange={(e) => setDailyUpdate((prev) => ({ ...prev, stepsCount: e.target.value }))}
                                    placeholder={`Current: ${todayStats.steps.toLocaleString()}`}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Workout minutes today</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={dailyUpdate.workoutDurationMinutes}
                                    onChange={(e) => setDailyUpdate((prev) => ({ ...prev, workoutDurationMinutes: e.target.value }))}
                                    placeholder={`Current: ${todayStats.workoutMinutes} min`}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="h-10 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                            >
                                Save update
                            </button>
                        </form>
                    </div>
                )}

                {showForm && (
                    <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-slate-900">
                            {editingGoal ? 'Edit Goal' : 'Create New Goal'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Goal Type
                                    </label>
                                    <select
                                        value={formData.goalType}
                                        onChange={(e) => setFormData({ ...formData, goalType: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="WEIGHT_LOSS">Weight Loss</option>
                                        <option value="MUSCLE_GAIN">Muscle Gain</option>
                                        <option value="ENDURANCE">Endurance</option>
                                        <option value="FLEXIBILITY">Flexibility</option>
                                        <option value="GENERAL_FITNESS">General Fitness</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Target Date
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.targetDate}
                                        onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Target Weight (kg)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={formData.targetWeight}
                                        onChange={(e) => setFormData({ ...formData, targetWeight: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., 70.5"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Target Daily Calories
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.targetCalories}
                                        onChange={(e) => setFormData({ ...formData, targetCalories: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., 2000"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Target Daily Steps
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.targetSteps}
                                        onChange={(e) => setFormData({ ...formData, targetSteps: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., 10000"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Target Workout Minutes
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.targetWorkoutMinutes}
                                        onChange={(e) => setFormData({ ...formData, targetWorkoutMinutes: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., 45"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notes
                                </label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                    placeholder="Add any notes about your goal..."
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    {editingGoal ? 'Update Goal' : 'Create Goal'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        {
                            title: 'Steps',
                            type: 'steps',
                            value: todayStats.steps.toLocaleString(),
                            target: effectiveStepsTarget,
                            unit: 'steps',
                            raw: todayStats.steps
                        },
                        {
                            title: 'Sleep',
                            type: 'sleep',
                            value: todayStats.sleepHours ? `${todayStats.sleepHours.toFixed(1)}h` : '0h',
                            target: 7,
                            unit: 'hours',
                            raw: todayStats.sleepHours
                        },
                        {
                            title: 'Hydration',
                            type: 'hydration',
                            value: `${todayStats.waterLiters.toFixed(1)}L`,
                            target: 2,
                            unit: 'liters',
                            raw: todayStats.waterLiters
                        },
                        {
                            title: 'Workout',
                            type: 'workout',
                            value: `${todayStats.workoutMinutes} min`,
                            target: activeGoal?.targetWorkoutMinutes || 45,
                            unit: 'minutes',
                            raw: todayStats.workoutMinutes
                        }
                    ].map((metric) => {
                        const state = getDailyMetricState(metric.type, metric.raw, metric.target);
                        const percentage = Math.max(0, Math.min((metric.raw / metric.target) * 100, 100));
                        const config = metricDefinitions.find((item) => item.key === metric.title);
                        return (
                            <div key={metric.title} className="bg-white rounded-2xl shadow-md border border-slate-100 p-5 hover:shadow-lg transition-all wellnest-emoji-card">
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <p className="text-sm text-slate-500">{metric.title}</p>
                                        <p className="text-2xl font-bold text-slate-900 mt-2">{metric.value}</p>
                                    </div>
                                    <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${config?.accent || 'from-slate-500 to-slate-600'} text-white flex items-center justify-center text-xl shadow-lg`}>
                                        {config?.icon || '🎯'}
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <p className="text-xs text-slate-500">Target: {metric.target} {metric.unit}</p>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${state.color}`}>{state.label}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5 mt-3">
                                    <div className={`h-2 rounded-full transition-all ${state.bar}`} style={{ width: `${percentage}%` }} />
                                </div>
                                <div className="mt-3 flex items-center justify-between text-xs">
                                    <span className="text-slate-500">Progress today</span>
                                    <span className="font-semibold text-slate-800">{Math.round(percentage)}%</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {[
                        {
                            title: 'Workout Streak',
                            icon: '🔥',
                            days: weeklyAnalytics.streaks.workout,
                            note: 'Consecutive days with workout minutes'
                        },
                        {
                            title: 'Hydration Streak',
                            icon: '💧',
                            days: weeklyAnalytics.streaks.hydration,
                            note: 'Consecutive days at 2L+ hydration'
                        },
                        {
                            title: 'Sleep Goal Streak',
                            icon: '😴',
                            days: weeklyAnalytics.streaks.sleep,
                            note: 'Consecutive nights with 7h+ sleep'
                        }
                    ].map((streak) => (
                        <div key={streak.title} className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
                            <p className="text-sm text-slate-500">{streak.title}</p>
                            <p className="mt-2 text-3xl font-bold text-slate-900">{streak.icon} {streak.days} day{streak.days === 1 ? '' : 's'}</p>
                            <p className="mt-2 text-xs text-slate-500">{streak.note}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-slate-500">Today&apos;s Health Score</p>
                            <h2 className="text-3xl font-bold text-slate-900 mt-1">
                                {todaysScoredMetrics.healthScore} / 100 <span className="text-2xl">{healthScoreTone}</span>
                            </h2>
                            <p className="text-sm text-slate-500 mt-2">
                                Formula: 30% Steps + 25% Sleep + 20% Water + 25% Calories balance
                            </p>
                        </div>
                        <div className="text-sm text-slate-600">
                            <p>Calories target used: <span className="font-semibold">{Math.round(todaysScoredMetrics.caloriesTarget || activeGoal?.targetCalories || 2000)} kcal</span></p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-5">
                        {[
                            { label: 'Steps', score: todaysScoredMetrics.stepScore },
                            { label: 'Sleep', score: todaysScoredMetrics.sleepScore },
                            { label: 'Water', score: todaysScoredMetrics.waterScore },
                            { label: 'Calories', score: todaysScoredMetrics.calorieScore }
                        ].map((part) => (
                            <div key={part.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <p className="text-xs uppercase tracking-wide text-slate-500">{part.label}</p>
                                <p className="text-lg font-semibold text-slate-900 mt-1">{getScoreLabel(part.score)}</p>
                                <p className="text-xs text-slate-500 mt-1">{part.score}/100</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-5">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900">Workout Frequency & Duration Analytics</h2>
                            <p className="text-sm text-slate-500 mt-1">Dual-line trend for last 7 days: workout sessions and total workout minutes.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 min-w-[220px]">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                <p className="text-xs text-slate-500">Workouts this week</p>
                                <p className="text-xl font-bold text-slate-900">{weeklyAnalytics.workoutsPerWeek}</p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                <p className="text-xs text-slate-500">Total workout minutes</p>
                                <p className="text-xl font-bold text-slate-900">{weeklyAnalytics.totalWorkoutMinutes}</p>
                            </div>
                        </div>
                    </div>

                    <div className="h-72 mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={workoutDualLineData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#64748b" />
                                <YAxis yAxisId="left" stroke="#2563eb" allowDecimals={false} />
                                <YAxis yAxisId="right" orientation="right" stroke="#f97316" allowDecimals={false} />
                                <RechartsTooltip />
                                <Legend />
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="workoutCount"
                                    name="Workouts"
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="workoutMinutes"
                                    name="Workout Minutes"
                                    stroke="#f97316"
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-slate-200 p-4">
                            <p className="text-sm font-semibold text-slate-800">Exercise Type Distribution (Top 5)</p>
                            <div className="space-y-3 mt-3">
                                {weeklyAnalytics.exerciseDistribution.length === 0 ? (
                                    <p className="text-sm text-slate-500">No workouts logged this week yet.</p>
                                ) : (
                                    weeklyAnalytics.exerciseDistribution.map((item) => {
                                        const width = weeklyAnalytics.totalWorkoutMinutes > 0
                                            ? clamp((item.minutes / weeklyAnalytics.totalWorkoutMinutes) * 100, 0, 100)
                                            : 0;
                                        return (
                                            <div key={item.type}>
                                                <div className="flex justify-between text-xs text-slate-600 mb-1">
                                                    <span>{item.type}</span>
                                                    <span>{item.count} sessions · {item.minutes} min</span>
                                                </div>
                                                <div className="h-2 rounded-full bg-slate-100">
                                                    <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${width}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 p-4">
                            <p className="text-sm font-semibold text-slate-800">Weekly activity snapshot</p>
                            <div className="mt-3 space-y-2 text-sm text-slate-600">
                                <p>✅ Workout days completed: <span className="font-semibold text-slate-900">{workoutDaysCompleted} / 7</span></p>
                                <p>🔥 Current workout streak: <span className="font-semibold text-slate-900">{weeklyAnalytics.streaks.workout} days</span></p>
                                <p>💧 Current hydration streak: <span className="font-semibold text-slate-900">{weeklyAnalytics.streaks.hydration} days</span></p>
                                <p>😴 Current sleep streak: <span className="font-semibold text-slate-900">{weeklyAnalytics.streaks.sleep} days</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`rounded-2xl border px-4 py-3 mb-8 text-sm font-medium ${stepCompletionPercentage >= 100 ? 'border-green-200 bg-green-50 text-green-800' : stepCompletionPercentage >= 60 ? 'border-yellow-200 bg-yellow-50 text-yellow-800' : 'border-blue-200 bg-blue-50 text-blue-800'}`}>
                    {coachMessage}
                </div>

                {insights.length > 0 && (
                    <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-6 mb-8">
                        <div className="flex items-center justify-between gap-4 mb-4">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">Milestone Insights</h2>
                                <p className="text-sm text-slate-500 mt-1">Actionable nudges generated from today’s performance versus your targets.</p>
                            </div>
                            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
                                <span className="h-2 w-2 rounded-full bg-green-500" /> On track
                                <span className="h-2 w-2 rounded-full bg-yellow-500 ml-3" /> Needs attention
                                <span className="h-2 w-2 rounded-full bg-red-500 ml-3" /> Priority
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {insights.map((item, idx) => (
                                <div key={idx} className={`border rounded-2xl px-4 py-4 text-sm font-medium ${item.tone}`}>
                                    <div className="flex items-start gap-3">
                                        <span className="text-lg leading-none mt-0.5">{item.icon}</span>
                                        <div>
                                            <p>{item.text}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.length === 0 ? (
                        <div className="col-span-full text-center py-14 rounded-3xl border border-dashed border-slate-300 bg-white text-slate-500 shadow-sm">
                            <div className="text-4xl mb-3">🎯</div>
                            <p className="font-medium text-slate-700">No goals yet. Create your first fitness goal!</p>
                            <p className="text-sm mt-2">Start with daily steps or workout minutes for the fastest momentum.</p>
                        </div>
                    ) : (
                        goals.map((goal) => (
                            <div key={goal.id} className="bg-white rounded-3xl shadow-md border border-slate-100 p-6 hover:shadow-xl transition-all wellnest-emoji-card">
                                {(() => {
                                    const progress = getGoalProgress(goal);
                                    return (
                                        <>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-slate-900">
                                            {getGoalTypeLabel(goal.goalType)}
                                        </h3>
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(goal.status)}`}>
                                            {goal.status}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(goal)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(goal.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-2 text-sm text-slate-600">
                                    {goal.targetWeight && (
                                        <p>🎯 Target Weight: <span className="font-semibold">{goal.targetWeight} kg</span></p>
                                    )}
                                    {goal.targetCalories && (
                                        <p>🔥 Target Calories: <span className="font-semibold">{goal.targetCalories} cal/day</span></p>
                                    )}
                                    {goal.targetSteps && (
                                        <p>👣 Target Steps: <span className="font-semibold">{goal.targetSteps.toLocaleString()}/day</span></p>
                                    )}
                                    {goal.targetWorkoutMinutes && (
                                        <p>💪 Workout: <span className="font-semibold">{goal.targetWorkoutMinutes} min/day</span></p>
                                    )}
                                    {goal.targetDate && (
                                        <p>📅 Target Date: <span className="font-semibold">{new Date(goal.targetDate).toLocaleDateString()}</span></p>
                                    )}
                                </div>

                                <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    {progress.targetText && (
                                        <p className="text-xs text-slate-500 mb-1 uppercase tracking-wide">{progress.targetText}</p>
                                    )}
                                    <p className="text-sm text-slate-700">{progress.currentText}</p>
                                    <div className="flex justify-between text-sm mb-1 mt-2">
                                        <span className="text-slate-600">Progress</span>
                                        <span className="font-semibold text-slate-900">{Math.round(progress.percentage)}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                                        <div
                                            className={`h-2.5 rounded-full transition-all ${progress.status.bar}`}
                                            style={{ width: `${progress.percentage}%` }}
                                        />
                                    </div>
                                    <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${progress.status.color}`}>
                                        {progress.status.label}
                                    </span>
                                </div>

                                {goal.notes && (
                                    <p className="mt-4 text-sm text-slate-500 italic border-t border-slate-100 pt-4">{goal.notes}</p>
                                )}
                                        </>
                                    );
                                })()}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default FitnessGoals;
