import React, { useState, useEffect } from 'react';

const WorkoutPlanDetailModal = ({ isOpen, onClose, workout, onSave, isNewPlan = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    durationMinutes: 0,
    exercises: []
  });

  const [currentExercise, setCurrentExercise] = useState({
    name: '',
    type: 'barbell',
    sets: [{ setNumber: 1, reps: 10, weight: 20, weightUnit: 'kg' }],
    notes: '',
    restSeconds: 90
  });

  const [showExerciseForm, setShowExerciseForm] = useState(false);

  useEffect(() => {
    if (workout && !isNewPlan) {
      setFormData({
        id: workout.id,
        name: workout.name,
        description: workout.description || '',
        durationMinutes: workout.durationMinutes || 0,
        exercises: workout.exercises || []
      });
    } else {
      setFormData({
        name: '',
        description: '',
        durationMinutes: 0,
        exercises: []
      });
    }
  }, [workout, isNewPlan, isOpen]);

  // Temporary data for demonstration
  const tempExercises = [
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
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'durationMinutes' ? parseInt(value) || 0 : value
    }));
  };

  const handleAddExercise = () => {
    const exercises = [
      ...(formData.exercises || []),
      {
        ...currentExercise,
        exerciseOrder: (formData.exercises?.length || 0) + 1
      }
    ];
    setFormData(prev => ({ ...prev, exercises }));
    setCurrentExercise({
      name: '',
      type: 'barbell',
      sets: [{ setNumber: 1, reps: 10, weight: 20, weightUnit: 'kg' }],
      notes: '',
      restSeconds: 90
    });
    setShowExerciseForm(false);
  };

  const handleRemoveExercise = (index) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const handleAddSet = () => {
    const lastSet = currentExercise.sets[currentExercise.sets.length - 1];
    setCurrentExercise(prev => ({
      ...prev,
      sets: [
        ...prev.sets,
        {
          setNumber: prev.sets.length + 1,
          reps: lastSet.reps,
          weight: lastSet.weight,
          weightUnit: 'kg'
        }
      ]
    }));
  };

  const handleSetChange = (setIndex, field, value) => {
    setCurrentExercise(prev => ({
      ...prev,
      sets: prev.sets.map((set, i) =>
        i === setIndex ? { ...set, [field]: field === 'reps' || field === 'weight' ? Number(value) : value } : set
      )
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Please enter a workout name');
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-primary-600 text-white p-6 sticky top-0">
          <h2 className="text-2xl font-bold">
            {isNewPlan ? 'Create New Workout Plan' : 'Edit Workout Plan'}
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Workout Name and Duration */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Workout Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., 5x5 Workout A"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                name="durationMinutes"
                value={formData.durationMinutes}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., 90"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Brief description"
              />
            </div>
          </div>

          {/* Sample Exercises Display */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Exercises</h3>
            {tempExercises.length > 0 && (
              <div className="space-y-4">
                {tempExercises.map((exercise, idx) => (
                  <div key={idx} className="border border-gray-300 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-gray-900">{exercise.name}</h4>
                        <p className="text-sm text-gray-600">{exercise.type}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveExercise(idx)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Sets Table */}
                    <div className="mb-3">
                      <div className="grid grid-cols-4 gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <div>Set</div>
                        <div>Reps</div>
                        <div>Weight</div>
                        <div>Unit</div>
                      </div>
                      {exercise.sets.map((set, setIdx) => (
                        <div key={setIdx} className="grid grid-cols-4 gap-2 text-sm mb-2">
                          <input
                            type="number"
                            value={set.setNumber}
                            className="border border-gray-200 rounded px-2 py-1 bg-gray-50"
                            disabled
                          />
                          <input
                            type="number"
                            value={set.reps}
                            className="border border-gray-200 rounded px-2 py-1"
                            disabled
                          />
                          <input
                            type="number"
                            value={set.weight}
                            className="border border-gray-200 rounded px-2 py-1"
                            disabled
                          />
                          <input
                            type="text"
                            value={set.weightUnit}
                            className="border border-gray-200 rounded px-2 py-1 bg-gray-50"
                            disabled
                          />
                        </div>
                      ))}
                    </div>

                    {exercise.notes && (
                      <p className="text-sm text-blue-700 bg-blue-50 p-2 rounded">
                        💡 {exercise.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowExerciseForm(!showExerciseForm)}
              className="mt-4 w-full py-2 border-2 border-dashed border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 font-semibold transition-colors"
            >
              + Add Exercise
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold transition-colors"
            >
              {isNewPlan ? 'Create Plan' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlanDetailModal;
