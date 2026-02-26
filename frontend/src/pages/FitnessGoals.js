import React, { useState, useEffect } from 'react';
import { getUserGoals, createGoal, updateGoal, deleteGoal } from '../utils/fitnessGoalsApi';

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

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            const data = await getUserGoals();
            setGoals(data);
        } catch (error) {
            alert('Error fetching goals: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

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

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Fitness Goals</h1>
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
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        {showForm ? 'Cancel' : '+ New Goal'}
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4">
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No goals yet. Create your first fitness goal!
                        </div>
                    ) : (
                        goals.map((goal) => (
                            <div key={goal.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">
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

                                <div className="space-y-2 text-sm text-gray-600">
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

                                {goal.progressPercentage !== null && (
                                    <div className="mt-4">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">Progress</span>
                                            <span className="font-semibold text-blue-600">{goal.progressPercentage.toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all"
                                                style={{ width: `${Math.min(goal.progressPercentage, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {goal.notes && (
                                    <p className="mt-4 text-sm text-gray-500 italic">{goal.notes}</p>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default FitnessGoals;
