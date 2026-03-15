import React, { useState, useEffect } from 'react';

const EXERCISE_LIBRARY = [
  {
    name: 'Squats',
    type: 'strength',
    notes: 'Keep your chest up and drive through your heels.',
    instructions: 'Stand with feet shoulder-width apart, lower until thighs are parallel, then stand back up.',
    restSeconds: 90,
    sets: [
      { setNumber: 1, reps: 12, weight: 20, weightUnit: 'kg' },
      { setNumber: 2, reps: 12, weight: 20, weightUnit: 'kg' },
      { setNumber: 3, reps: 10, weight: 22.5, weightUnit: 'kg' }
    ]
  },
  {
    name: 'Plank',
    type: 'core',
    notes: 'Brace your core and avoid letting your hips sag.',
    instructions: 'Hold a straight-body position on your forearms while keeping your glutes and core engaged.',
    restSeconds: 45,
    sets: [
      { setNumber: 1, reps: 30, weight: 0, weightUnit: 'sec' },
      { setNumber: 2, reps: 30, weight: 0, weightUnit: 'sec' },
      { setNumber: 3, reps: 45, weight: 0, weightUnit: 'sec' }
    ]
  },
  {
    name: 'Lateral Raise',
    type: 'upper-body',
    notes: 'Lift with control and stop around shoulder height.',
    instructions: 'Raise dumbbells out to the sides with a soft bend in the elbows, then lower slowly.',
    restSeconds: 60,
    sets: [
      { setNumber: 1, reps: 15, weight: 4, weightUnit: 'kg' },
      { setNumber: 2, reps: 12, weight: 4, weightUnit: 'kg' },
      { setNumber: 3, reps: 12, weight: 5, weightUnit: 'kg' }
    ]
  },
  {
    name: 'Push-Ups',
    type: 'upper-body',
    notes: 'Keep a straight line from shoulders to ankles.',
    instructions: 'Lower your chest toward the floor and press back up while keeping elbows at about 45 degrees.',
    restSeconds: 60,
    sets: [
      { setNumber: 1, reps: 10, weight: 0, weightUnit: 'bodyweight' },
      { setNumber: 2, reps: 10, weight: 0, weightUnit: 'bodyweight' },
      { setNumber: 3, reps: 8, weight: 0, weightUnit: 'bodyweight' }
    ]
  },
  {
    name: 'Glute Bridge',
    type: 'mobility',
    notes: 'Pause at the top and squeeze your glutes.',
    instructions: 'Lie on your back with knees bent, lift hips until your body forms a straight line, then lower slowly.',
    restSeconds: 45,
    sets: [
      { setNumber: 1, reps: 15, weight: 0, weightUnit: 'bodyweight' },
      { setNumber: 2, reps: 15, weight: 0, weightUnit: 'bodyweight' },
      { setNumber: 3, reps: 12, weight: 5, weightUnit: 'kg' }
    ]
  },
  {
    name: 'Bird-Dog',
    type: 'mobility',
    notes: 'Move slowly and keep hips square to the floor.',
    instructions: 'Extend the opposite arm and leg while maintaining a neutral spine, then switch sides.',
    restSeconds: 30,
    sets: [
      { setNumber: 1, reps: 10, weight: 0, weightUnit: 'bodyweight' },
      { setNumber: 2, reps: 10, weight: 0, weightUnit: 'bodyweight' },
      { setNumber: 3, reps: 12, weight: 0, weightUnit: 'bodyweight' }
    ]
  },
  {
    name: 'Step-Ups',
    type: 'functional',
    notes: 'Push through the front foot instead of bouncing off the back foot.',
    instructions: 'Step onto a stable bench or platform, fully stand, then return under control.',
    restSeconds: 60,
    sets: [
      { setNumber: 1, reps: 12, weight: 6, weightUnit: 'kg' },
      { setNumber: 2, reps: 12, weight: 6, weightUnit: 'kg' },
      { setNumber: 3, reps: 10, weight: 8, weightUnit: 'kg' }
    ]
  },
  {
    name: 'Dead Bug',
    type: 'core',
    notes: 'Keep your lower back gently pressed into the floor.',
    instructions: 'Lower opposite arm and leg while keeping your core braced, then return and switch sides.',
    restSeconds: 30,
    sets: [
      { setNumber: 1, reps: 10, weight: 0, weightUnit: 'bodyweight' },
      { setNumber: 2, reps: 10, weight: 0, weightUnit: 'bodyweight' },
      { setNumber: 3, reps: 12, weight: 0, weightUnit: 'bodyweight' }
    ]
  },
  {
    name: 'Side Plank',
    type: 'core',
    notes: 'Stack shoulders and hips for better alignment.',
    instructions: 'Hold your body in a straight line on one forearm, then repeat on the other side.',
    restSeconds: 30,
    sets: [
      { setNumber: 1, reps: 20, weight: 0, weightUnit: 'sec' },
      { setNumber: 2, reps: 20, weight: 0, weightUnit: 'sec' },
      { setNumber: 3, reps: 30, weight: 0, weightUnit: 'sec' }
    ]
  },
  {
    name: 'Wall Sit',
    type: 'endurance',
    notes: 'Keep your knees stacked above your ankles.',
    instructions: 'Slide down a wall until your thighs are roughly parallel with the floor and hold.',
    restSeconds: 45,
    sets: [
      { setNumber: 1, reps: 30, weight: 0, weightUnit: 'sec' },
      { setNumber: 2, reps: 30, weight: 0, weightUnit: 'sec' },
      { setNumber: 3, reps: 45, weight: 0, weightUnit: 'sec' }
    ]
  },
  {
    name: 'Custom Exercise',
    type: 'custom',
    notes: '',
    instructions: '',
    restSeconds: 60,
    sets: [{ setNumber: 1, reps: 10, weight: 0, weightUnit: 'kg' }]
  }
];

const createDefaultExercise = () => ({
  name: '',
  type: 'strength',
  sets: [{ setNumber: 1, reps: 10, weight: 0, weightUnit: 'kg' }],
  notes: '',
  instructions: '',
  restSeconds: 60
});

const normalizeExercise = (exercise, exerciseIndex = 0) => ({
  id: exercise.id,
  name: exercise.name || '',
  type: exercise.type || 'strength',
  exerciseOrder: exercise.exerciseOrder || exerciseIndex + 1,
  notes: exercise.notes || '',
  instructions: exercise.instructions || '',
  restSeconds: Number(exercise.restSeconds) || 0,
  sets: (exercise.sets && exercise.sets.length > 0 ? exercise.sets : [{ setNumber: 1, reps: 10, weight: 0, weightUnit: 'kg' }]).map((set, setIndex) => ({
    id: set.id,
    setNumber: set.setNumber || setIndex + 1,
    reps: Number(set.reps) || 0,
    weight: Number(set.weight) || 0,
    weightUnit: set.weightUnit || 'kg',
    notes: set.notes || '',
    isCompleted: Boolean(set.isCompleted),
    actualReps: set.actualReps || null,
    actualWeight: set.actualWeight || null
  }))
});

const WorkoutPlanDetailModal = ({ isOpen, onClose, workout, onSave, isNewPlan = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    durationMinutes: 0,
    exercises: []
  });

  const [currentExercise, setCurrentExercise] = useState(createDefaultExercise());
  const [selectedExerciseTemplate, setSelectedExerciseTemplate] = useState('');

  const [showExerciseForm, setShowExerciseForm] = useState(false);

  useEffect(() => {
    if (workout && !isNewPlan) {
      setFormData({
        id: workout.id,
        name: workout.name,
        description: workout.description || '',
        durationMinutes: workout.durationMinutes || 0,
        exercises: (workout.exercises || []).map((exercise, index) => normalizeExercise(exercise, index))
      });
    } else {
      setFormData({
        name: '',
        description: '',
        durationMinutes: 0,
        exercises: []
      });
    }
    setCurrentExercise(createDefaultExercise());
    setSelectedExerciseTemplate('');
    setShowExerciseForm(false);
  }, [workout, isNewPlan, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'durationMinutes' ? parseInt(value) || 0 : value
    }));
  };

  const handleExerciseTemplateChange = (e) => {
    const selectedName = e.target.value;
    setSelectedExerciseTemplate(selectedName);

    const template = EXERCISE_LIBRARY.find((exercise) => exercise.name === selectedName);
    if (!template) {
      setCurrentExercise(createDefaultExercise());
      return;
    }

    setCurrentExercise(normalizeExercise(template));
  };

  const handleCurrentExerciseChange = (field, value) => {
    setCurrentExercise((prev) => ({
      ...prev,
      [field]: field === 'restSeconds' ? Number(value) || 0 : value
    }));
  };

  const handleAddExercise = () => {
    if (!currentExercise.name.trim()) {
      alert('Please choose or name an exercise before adding it.');
      return;
    }

    const exercises = [
      ...(formData.exercises || []),
      normalizeExercise({
        ...currentExercise,
        exerciseOrder: (formData.exercises?.length || 0) + 1
      }, formData.exercises?.length || 0)
    ];
    setFormData(prev => ({ ...prev, exercises }));
    setCurrentExercise(createDefaultExercise());
    setSelectedExerciseTemplate('');
    setShowExerciseForm(false);
  };

  const handleRemoveExercise = (index) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises
        .filter((_, i) => i !== index)
        .map((exercise, exerciseIndex) => ({
          ...exercise,
          exerciseOrder: exerciseIndex + 1
        }))
    }));
  };

  const handleAddSet = (exerciseIndex = null) => {
    if (exerciseIndex === null) {
      const lastSet = currentExercise.sets[currentExercise.sets.length - 1];
      setCurrentExercise(prev => ({
        ...prev,
        sets: [
          ...prev.sets,
          {
            setNumber: prev.sets.length + 1,
            reps: lastSet.reps,
            weight: lastSet.weight,
            weightUnit: lastSet.weightUnit || 'kg',
            notes: ''
          }
        ]
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise, index) => {
        if (index !== exerciseIndex) return exercise;
        const lastSet = exercise.sets[exercise.sets.length - 1] || { reps: 10, weight: 0, weightUnit: 'kg' };
        return {
          ...exercise,
          sets: [
            ...exercise.sets,
            {
              setNumber: exercise.sets.length + 1,
              reps: lastSet.reps,
              weight: lastSet.weight,
              weightUnit: lastSet.weightUnit || 'kg',
              notes: ''
            }
          ]
        };
      })
    }));
  };

  const handleRemoveSet = (exerciseIndex, setIndex) => {
    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise, index) => {
        if (index !== exerciseIndex) return exercise;
        const nextSets = exercise.sets
          .filter((_, currentIndex) => currentIndex !== setIndex)
          .map((set, currentIndex) => ({
            ...set,
            setNumber: currentIndex + 1
          }));
        return {
          ...exercise,
          sets: nextSets.length > 0 ? nextSets : [{ setNumber: 1, reps: 10, weight: 0, weightUnit: 'kg', notes: '' }]
        };
      })
    }));
  };

  const handleExerciseChange = (exerciseIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise, index) =>
        index === exerciseIndex
          ? {
              ...exercise,
              [field]: field === 'restSeconds' ? Number(value) || 0 : value
            }
          : exercise
      )
    }));
  };

  const handleCurrentExerciseSetChange = (setIndex, field, value) => {
    setCurrentExercise(prev => ({
      ...prev,
      sets: prev.sets.map((set, i) =>
        i === setIndex
          ? {
              ...set,
              [field]: field === 'reps' || field === 'weight' || field === 'setNumber'
                ? Number(value) || 0
                : value
            }
          : set
      )
    }));
  };

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, index) =>
        index === exerciseIndex
          ? {
              ...exercise,
              sets: exercise.sets.map((set, i) =>
                i === setIndex
                  ? {
                      ...set,
                      [field]: field === 'reps' || field === 'weight' || field === 'setNumber'
                        ? Number(value) || 0
                        : value
                    }
                  : set
              )
            }
          : exercise
      )
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Please enter a workout name');
      return;
    }

    const normalizedExercises = (formData.exercises || []).map((exercise, exerciseIndex) => ({
      ...exercise,
      exerciseOrder: exerciseIndex + 1,
      restSeconds: Number(exercise.restSeconds) || 0,
      sets: (exercise.sets || []).map((set, setIndex) => ({
        ...set,
        setNumber: setIndex + 1,
        reps: Number(set.reps) || 0,
        weight: Number(set.weight) || 0,
        weightUnit: set.weightUnit || 'kg'
      }))
    }));

    onSave({
      ...formData,
      exercises: normalizedExercises
    });
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

          {/* Exercises Display */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Exercises</h3>
            {formData.exercises.length > 0 && (
              <div className="space-y-4">
                {formData.exercises.map((exercise, idx) => (
                  <div key={idx} className="border border-gray-300 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 mr-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1">
                            Exercise name
                          </label>
                          <input
                            type="text"
                            value={exercise.name}
                            onChange={(e) => handleExerciseChange(idx, 'name', e.target.value)}
                            className="w-full border border-gray-200 rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1">
                            Type
                          </label>
                          <input
                            type="text"
                            value={exercise.type}
                            onChange={(e) => handleExerciseChange(idx, 'type', e.target.value)}
                            className="w-full border border-gray-200 rounded px-3 py-2"
                          />
                        </div>
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
                      <div className="grid grid-cols-5 gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <div>Set</div>
                        <div>Reps</div>
                        <div>Weight</div>
                        <div>Unit</div>
                        <div></div>
                      </div>
                      {exercise.sets.map((set, setIdx) => (
                        <div key={setIdx} className="grid grid-cols-5 gap-2 text-sm mb-2 items-center">
                          <input
                            type="number"
                            value={set.setNumber}
                            onChange={(e) => handleSetChange(idx, setIdx, 'setNumber', e.target.value)}
                            className="border border-gray-200 rounded px-2 py-1"
                          />
                          <input
                            type="number"
                            value={set.reps}
                            onChange={(e) => handleSetChange(idx, setIdx, 'reps', e.target.value)}
                            className="border border-gray-200 rounded px-2 py-1"
                          />
                          <input
                            type="number"
                            value={set.weight}
                            onChange={(e) => handleSetChange(idx, setIdx, 'weight', e.target.value)}
                            className="border border-gray-200 rounded px-2 py-1"
                          />
                          <input
                            type="text"
                            value={set.weightUnit}
                            onChange={(e) => handleSetChange(idx, setIdx, 'weightUnit', e.target.value)}
                            className="border border-gray-200 rounded px-2 py-1"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveSet(idx, setIdx)}
                            className="text-red-600 hover:text-red-700 text-xs font-semibold"
                          >
                            Remove
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => handleAddSet(idx)}
                        className="mt-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
                      >
                        + Add Set
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">
                          Rest between sets (seconds)
                        </label>
                        <input
                          type="number"
                          value={exercise.restSeconds}
                          onChange={(e) => handleExerciseChange(idx, 'restSeconds', e.target.value)}
                          className="w-full border border-gray-200 rounded px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">
                          Coaching note
                        </label>
                        <input
                          type="text"
                          value={exercise.notes}
                          onChange={(e) => handleExerciseChange(idx, 'notes', e.target.value)}
                          className="w-full border border-gray-200 rounded px-3 py-2"
                          placeholder="Form or safety cue"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="block text-xs font-semibold text-gray-500 mb-1">
                        Instructions
                      </label>
                      <textarea
                        value={exercise.instructions || ''}
                        onChange={(e) => handleExerciseChange(idx, 'instructions', e.target.value)}
                        className="w-full border border-gray-200 rounded px-3 py-2"
                        rows="2"
                        placeholder="How to perform the exercise"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {formData.exercises.length === 0 && (
              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600">
                No exercises added yet. Pick from common options like Squats, Plank, or Lateral Raise and build your plan.
              </div>
            )}

            <button
              onClick={() => setShowExerciseForm(!showExerciseForm)}
              className="mt-4 w-full py-2 border-2 border-dashed border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 font-semibold transition-colors"
            >
              + Add Exercise
            </button>

            {showExerciseForm && (
              <div className="mt-4 rounded-lg border border-primary-100 bg-primary-50 p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Choose exercise
                    </label>
                    <select
                      value={selectedExerciseTemplate}
                      onChange={handleExerciseTemplateChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select an exercise</option>
                      {EXERCISE_LIBRARY.map((exercise) => (
                        <option key={exercise.name} value={exercise.name}>
                          {exercise.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Exercise type
                    </label>
                    <input
                      type="text"
                      value={currentExercise.type}
                      onChange={(e) => handleCurrentExerciseChange('type', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="strength, core, mobility..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Exercise name
                  </label>
                  <input
                    type="text"
                    value={currentExercise.name}
                    onChange={(e) => handleCurrentExerciseChange('name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Goblet Squat"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Rest between sets (seconds)
                    </label>
                    <input
                      type="number"
                      value={currentExercise.restSeconds}
                      onChange={(e) => handleCurrentExerciseChange('restSeconds', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Quick note
                    </label>
                    <input
                      type="text"
                      value={currentExercise.notes}
                      onChange={(e) => handleCurrentExerciseChange('notes', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Form cue or reminder"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Instructions
                  </label>
                  <textarea
                    value={currentExercise.instructions || ''}
                    onChange={(e) => handleCurrentExerciseChange('instructions', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows="2"
                    placeholder="Describe how to perform the movement"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-700">Planned sets</h4>
                    <button
                      type="button"
                      onClick={() => handleAddSet()}
                      className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                    >
                      + Add Set
                    </button>
                  </div>
                  <div className="space-y-2">
                    {currentExercise.sets.map((set, setIdx) => (
                      <div key={setIdx} className="grid grid-cols-4 gap-2">
                        <input
                          type="number"
                          value={set.setNumber}
                          onChange={(e) => handleCurrentExerciseSetChange(setIdx, 'setNumber', e.target.value)}
                          className="border border-gray-300 rounded px-3 py-2"
                          placeholder="Set"
                        />
                        <input
                          type="number"
                          value={set.reps}
                          onChange={(e) => handleCurrentExerciseSetChange(setIdx, 'reps', e.target.value)}
                          className="border border-gray-300 rounded px-3 py-2"
                          placeholder="Reps"
                        />
                        <input
                          type="number"
                          value={set.weight}
                          onChange={(e) => handleCurrentExerciseSetChange(setIdx, 'weight', e.target.value)}
                          className="border border-gray-300 rounded px-3 py-2"
                          placeholder="Weight"
                        />
                        <input
                          type="text"
                          value={set.weightUnit}
                          onChange={(e) => handleCurrentExerciseSetChange(setIdx, 'weightUnit', e.target.value)}
                          className="border border-gray-300 rounded px-3 py-2"
                          placeholder="kg / sec"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowExerciseForm(false);
                      setCurrentExercise(createDefaultExercise());
                      setSelectedExerciseTemplate('');
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white font-semibold transition-colors"
                  >
                    Cancel exercise
                  </button>
                  <button
                    type="button"
                    onClick={handleAddExercise}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold transition-colors"
                  >
                    Add to plan
                  </button>
                </div>
              </div>
            )}
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
