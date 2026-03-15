import React, { useEffect, useState } from 'react';
import { logWorkoutSession } from '../utils/calorieApi';

const defaultWorkoutData = {
  workoutType: 'Running',
  durationMinutes: '',
  caloriesBurned: '',
  notes: ''
};

const WorkoutLogModal = ({ isOpen, onClose, onSuccess, initialWorkoutData = null, onSubmitWorkout }) => {
  const [workoutData, setWorkoutData] = useState(defaultWorkoutData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const workoutTypes = ['Running', 'Yoga', 'Cycling', 'Swimming', 'Weightlifting', 'Walking'];
  const isEditing = Boolean(initialWorkoutData?.id);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (initialWorkoutData) {
      setWorkoutData({
        workoutType: initialWorkoutData.workoutType || 'Running',
        durationMinutes: initialWorkoutData.durationMinutes ?? '',
        caloriesBurned: initialWorkoutData.caloriesBurned ?? '',
        notes: initialWorkoutData.notes || ''
      });
    } else {
      setWorkoutData(defaultWorkoutData);
    }

    setError('');
  }, [initialWorkoutData, isOpen]);

  // Estimate calories based on workout type and duration
  const estimateCalories = (type, minutes) => {
    if (!minutes) return '';
    const rates = {
      'Running': 10,
      'Cycling': 8,
      'Yoga': 3,
      'Swimming': 8,
      'Weightlifting': 6,
      'Walking': 4
    };
    return Math.round((rates[type] || 5) * minutes);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWorkoutData(prev => {
      const updated = { ...prev, [name]: value };
      // Auto-calculate calories when duration or type changes
      if (name === 'durationMinutes' || name === 'workoutType') {
        updated.caloriesBurned = estimateCalories(
          name === 'workoutType' ? value : updated.workoutType,
          name === 'durationMinutes' ? value : updated.durationMinutes
        );
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!workoutData.durationMinutes || workoutData.durationMinutes <= 0) {
      setError('Please enter a valid duration');
      return;
    }

    setLoading(true);
    
    const payload = {
      workoutType: workoutData.workoutType,
      workoutName: `${workoutData.workoutType} Session`,
      durationMinutes: parseInt(workoutData.durationMinutes),
      caloriesBurned: parseInt(workoutData.caloriesBurned) || 0,
      notes: workoutData.notes
    };

    console.log('=== Starting Workout Log ===');
    console.log('Payload:', payload);
    console.log('Token exists:', !!localStorage.getItem('token'));

    try {
      const submitWorkout = onSubmitWorkout || logWorkoutSession;
      const responseData = await submitWorkout(payload);

      console.log('Workout logged successfully:', responseData);

      setWorkoutData(defaultWorkoutData);

      setError('');
      if (onSuccess) {
        console.log('Calling onSuccess callback');
        onSuccess();
      }
      onClose();
    } catch (err) {
      console.error('=== Workout Log Error ===');
      console.error('Error Message:', err.message);
      console.error('Full Error:', err);
      setError(err.message || 'Failed to log workout. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{isEditing ? 'Update Workout' : 'Log Workout'}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workout Type
            </label>
            <select
              name="workoutType"
              value={workoutData.workoutType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            >
              {workoutTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              name="durationMinutes"
              value={workoutData.durationMinutes}
              onChange={handleInputChange}
              placeholder="e.g., 30"
              min="1"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calories Burned (estimated)
            </label>
            <input
              type="number"
              name="caloriesBurned"
              value={workoutData.caloriesBurned}
              onChange={handleInputChange}
              placeholder="Auto-calculated"
              min="0"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              name="notes"
              value={workoutData.notes}
              onChange={handleInputChange}
              placeholder="How did you feel?"
              rows="3"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (isEditing ? 'Updating...' : 'Logging...') : (isEditing ? 'Update Workout' : 'Log Workout')}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            💡 Calories are estimated based on average rates for each activity type
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkoutLogModal;
