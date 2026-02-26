import React, { useState, useEffect } from 'react';
import { logWorkoutSession } from '../utils/calorieApi';

const WorkoutPlanExecutionModal = ({ isOpen, onClose, workout, onWorkoutComplete }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSets, setCompletedSets] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Mock data for execution
  const mockExercises = [
    {
      id: 1,
      name: 'Squats',
      type: 'Barbell',
      exerciseOrder: 1,
      sets: [
        { setNumber: 1, reps: 10, weight: 20, weightUnit: 'kg' },
        { setNumber: 2, reps: 10, weight: 20, weightUnit: 'kg' },
        { setNumber: 3, reps: 10, weight: 20, weightUnit: 'kg' },
        { setNumber: 4, reps: 10, weight: 20, weightUnit: 'kg' },
        { setNumber: 5, reps: 10, weight: 20, weightUnit: 'kg' }
      ],
      restSeconds: 90,
      notes: 'Pay attention to a clean execution.'
    },
    {
      id: 2,
      name: 'Bench Press',
      type: 'Barbell',
      exerciseOrder: 2,
      sets: [
        { setNumber: 1, reps: 5, weight: 50, weightUnit: 'kg' },
        { setNumber: 2, reps: 5, weight: 50, weightUnit: 'kg' },
        { setNumber: 3, reps: 5, weight: 50, weightUnit: 'kg' }
      ],
      restSeconds: 120,
      notes: 'Keep your back on the bench.'
    }
  ];

  const exercises = workout?.exercises || mockExercises;
  const currentExercise = exercises[currentExerciseIndex];
  const currentSet = currentExercise?.sets[currentSetIndex];

  // Timer effect
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleCompleteSet = () => {
    const key = `${currentExerciseIndex}-${currentSetIndex}`;
    setCompletedSets(prev => ({ ...prev, [key]: true }));

    if (currentSetIndex < currentExercise.sets.length - 1) {
      setCurrentSetIndex(prev => prev + 1);
    } else if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSetIndex(0);
    }
  };

  const handleFinishWorkout = async () => {
    // Estimate calories based on duration and exercise intensity
    // Average strength training burns 5-8 calories per minute
    const caloriesBurned = Math.round(elapsedTime / 60 * 6); // ~6 cal/min
    const durationMinutes = Math.round(elapsedTime / 60);

    console.log('=== Finishing Workout ===');
    console.log('Duration:', durationMinutes, 'minutes');
    console.log('Calories Burned:', caloriesBurned);
    console.log('Workout Name:', workout?.name || '5x5 Workout A');

    setIsSaving(true);
    try {
      const workoutData = {
        workoutName: workout?.name || '5x5 Workout A',
        workoutType: 'Weightlifting',
        durationMinutes: durationMinutes,
        caloriesBurned: caloriesBurned || 0,
        notes: `Completed ${Object.keys(completedSets).length} sets`
      };

      console.log('Saving workout session:', workoutData);
      
      const response = await logWorkoutSession(workoutData);
      console.log('Workout saved successfully:', response);

      // Call callback to refresh dashboard
      if (onWorkoutComplete) {
        console.log('Calling onWorkoutComplete callback');
        onWorkoutComplete();
      }

      onClose();
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('Workout completed but failed to save. Error: ' + error.message);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6 sticky top-0">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold">{workout?.name || '5x5 Workout A'}</h2>
              <p className="text-primary-100">{currentExerciseIndex + 1} of {exercises.length} exercises</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-primary-200 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Timer */}
          <div className="flex items-center justify-between bg-primary-700 rounded-lg p-4">
            <div>
              <div className="text-sm text-primary-100">Duration</div>
              <div className="text-3xl font-bold">{formatTime(elapsedTime)}</div>
            </div>
            <button
              onClick={toggleTimer}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                isRunning
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={handleFinishWorkout}
              disabled={isSaving}
              className="px-6 py-2 rounded-full font-semibold bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSaving ? 'Saving...' : 'Finish'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Exercise Card */}
          {currentExercise && (
            <div className="border-2 border-gray-200 rounded-lg p-5 bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{currentExercise.name}</h3>
                  <p className="text-sm text-gray-600">{currentExercise.type}</p>
                </div>
                <div className="text-4xl">💪</div>
              </div>

              {/* Current Set Info */}
              {currentSet && (
                <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    <div>
                      <div className="text-xs text-gray-600">SET</div>
                      <div className="text-xl font-bold text-primary-600">{currentSet.setNumber}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">REPS</div>
                      <div className="text-xl font-bold text-gray-900">{currentSet.reps}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">WEIGHT</div>
                      <div className="text-xl font-bold text-gray-900">{currentSet.weight}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">UNIT</div>
                      <div className="text-xl font-bold text-gray-900">{currentSet.weightUnit}</div>
                    </div>
                  </div>

                  <button
                    onClick={handleCompleteSet}
                    className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="text-2xl">✓</span> Complete Set
                  </button>
                </div>
              )}

              {/* Notes */}
              {currentExercise.notes && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-900">💡 {currentExercise.notes}</p>
                </div>
              )}

              {/* Sets Progress */}
              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">SETS</p>
                <div className="grid grid-cols-5 gap-2">
                  {currentExercise.sets.map((set, idx) => {
                    const isCompleted = completedSets[`${currentExerciseIndex}-${idx}`];
                    const isCurrent = idx === currentSetIndex;
                    return (
                      <div
                        key={idx}
                        className={`p-2 rounded text-center text-sm font-semibold transition-colors ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : isCurrent
                            ? 'bg-primary-600 text-white border-2 border-primary-700'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {set.setNumber}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rest Timer */}
              {currentExercise.restSeconds > 0 && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-lg">⏱️</span>
                  <span>Auto Rest</span>
                  <span className="font-semibold text-gray-900">
                    00:{String(currentExercise.restSeconds).padStart(2, '0')}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Exercise List */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-3">ALL EXERCISES</h4>
            <div className="space-y-2">
              {exercises.map((ex, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border transition-colors ${
                    idx === currentExerciseIndex
                      ? 'bg-primary-50 border-primary-300'
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="text-sm font-semibold text-gray-900">{ex.name}</div>
                  <div className="text-xs text-gray-600">{ex.sets.length} sets</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlanExecutionModal;
