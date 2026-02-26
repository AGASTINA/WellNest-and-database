import React from 'react';

const WorkoutPlanCard = ({ workout, onStartWorkout, onEdit, onDelete }) => {
  const formatDuration = (minutes) => {
    if (!minutes) return 'Not set';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleStartClick = () => {
    onStartWorkout(workout);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-24 flex items-center justify-center">
        <span className="text-4xl">💪</span>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{workout.name}</h3>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {workout.description || 'No description'}
        </p>

        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1 text-gray-700">
            <span className="text-lg">⏱️</span>
            <span>{formatDuration(workout.durationMinutes)}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-700">
            <span className="text-lg">✅</span>
            <span>{workout.completedCount || 0} completed</span>
          </div>
        </div>

        {workout.lastCompletedAt && (
          <p className="text-xs text-gray-500 mb-4">
            Last completed: {new Date(workout.lastCompletedAt).toLocaleDateString()}
          </p>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleStartClick}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
          >
            Start
          </button>
          <button
            onClick={() => onEdit(workout)}
            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(workout.id)}
            className="px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlanCard;
