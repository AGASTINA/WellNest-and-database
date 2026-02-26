import React, { useState, useEffect } from 'react';
import { getUserMeals, addMeal, deleteMeal, getDailyCalories, getIndianCuisineTemplates } from '../utils/mealsApi';

const MealTracker = () => {
    const [meals, setMeals] = useState([]);
    const [dailyCalories, setDailyCalories] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [indianTemplates, setIndianTemplates] = useState({});
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [formData, setFormData] = useState({
        mealType: 'BREAKFAST',
        mealName: '',
        cuisineType: 'INDIAN',
        calories: '',
        proteinGrams: '',
        carbsGrams: '',
        fatGrams: '',
        fiberGrams: '',
        portionSize: '',
        isVegetarian: false,
        isVegan: false,
        mealDate: new Date().toISOString().substring(0, 16),
        notes: ''
    });

    useEffect(() => {
        fetchMeals();
        fetchDailyCalories();
        fetchIndianTemplates();
    }, []);

    const fetchMeals = async () => {
        try {
            const data = await getUserMeals();
            setMeals(data);
        } catch (error) {
            alert('Error fetching meals: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchDailyCalories = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const data = await getDailyCalories(today);
            setDailyCalories(data);
        } catch (error) {
            console.error('Error fetching daily calories:', error);
        }
    };

    const fetchIndianTemplates = async () => {
        try {
            const templates = await getIndianCuisineTemplates();
            setIndianTemplates(templates);
        } catch (error) {
            console.error('Error fetching Indian templates:', error);
        }
    };

    const handleTemplateSelect = (e) => {
        const templateName = e.target.value;
        if (templateName && indianTemplates[templateName]) {
            const template = indianTemplates[templateName];
            setSelectedTemplate(templateName);
            setFormData({
                ...formData,
                mealName: template.name,
                calories: template.calories,
                proteinGrams: template.proteinGrams,
                carbsGrams: template.carbsGrams,
                fatGrams: template.fatGrams,
                fiberGrams: template.fiberGrams,
                portionSize: template.portionSize,
                isVegetarian: template.vegetarian,
                isVegan: template.vegan,
                cuisineType: 'INDIAN'
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const mealData = {
                ...formData,
                calories: parseInt(formData.calories),
                proteinGrams: parseInt(formData.proteinGrams),
                carbsGrams: parseInt(formData.carbsGrams),
                fatGrams: parseInt(formData.fatGrams),
                fiberGrams: parseInt(formData.fiberGrams)
            };

            await addMeal(mealData);
            alert('Meal added successfully!');
            setShowForm(false);
            setSelectedTemplate(null);
            setFormData({
                mealType: 'BREAKFAST',
                mealName: '',
                cuisineType: 'INDIAN',
                calories: '',
                proteinGrams: '',
                carbsGrams: '',
                fatGrams: '',
                fiberGrams: '',
                portionSize: '',
                isVegetarian: false,
                isVegan: false,
                mealDate: new Date().toISOString().substring(0, 16),
                notes: ''
            });
            fetchMeals();
            fetchDailyCalories();
        } catch (error) {
            alert('Error adding meal: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this meal?')) {
            try {
                await deleteMeal(id);
                alert('Meal deleted successfully!');
                fetchMeals();
                fetchDailyCalories();
            } catch (error) {
                alert('Error deleting meal: ' + error.message);
            }
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Meal Tracker</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        {showForm ? 'Cancel' : '+ Log Meal'}
                    </button>
                </div>

                {/* Daily Calorie Summary */}
                {dailyCalories && (
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg shadow-lg p-6 mb-8 text-white">
                        <h2 className="text-2xl font-bold mb-4">Today's Calorie Intake</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                                <p className="text-sm opacity-90">Total</p>
                                <p className="text-3xl font-bold">{dailyCalories.totalCalories}</p>
                            </div>
                            <div>
                                <p className="text-sm opacity-90">Target</p>
                                <p className="text-3xl font-bold">{dailyCalories.targetCalories}</p>
                            </div>
                            <div>
                                <p className="text-sm opacity-90">Remaining</p>
                                <p className="text-3xl font-bold">{dailyCalories.remainingCalories}</p>
                            </div>
                            <div>
                                <p className="text-sm opacity-90">Progress</p>
                                <p className="text-3xl font-bold">{dailyCalories.progressPercentage.toFixed(1)}%</p>
                            </div>
                        </div>
                        <div className="w-full bg-white bg-opacity-30 rounded-full h-4">
                            <div
                                className="bg-white h-4 rounded-full transition-all"
                                style={{ width: `${Math.min(dailyCalories.progressPercentage, 100)}%` }}
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-2 mt-4 text-sm">
                            <div>
                                <p className="opacity-90">Breakfast</p>
                                <p className="font-semibold">{dailyCalories.breakfastCalories} cal</p>
                            </div>
                            <div>
                                <p className="opacity-90">Lunch</p>
                                <p className="font-semibold">{dailyCalories.lunchCalories} cal</p>
                            </div>
                            <div>
                                <p className="opacity-90">Dinner</p>
                                <p className="font-semibold">{dailyCalories.dinnerCalories} cal</p>
                            </div>
                            <div>
                                <p className="opacity-90">Snacks</p>
                                <p className="font-semibold">{dailyCalories.snackCalories} cal</p>
                            </div>
                        </div>
                    </div>
                )}

                {showForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4">Log New Meal</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Indian Cuisine Template Selector */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    🇮🇳 Select Indian Dish (Optional)
                                </label>
                                <select
                                    onChange={handleTemplateSelect}
                                    value={selectedTemplate || ''}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">-- Choose from Indian cuisine --</option>
                                    {Object.keys(indianTemplates).map((key) => (
                                        <option key={key} value={key}>
                                            {indianTemplates[key].name} ({indianTemplates[key].calories} cal)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Meal Type
                                    </label>
                                    <select
                                        value={formData.mealType}
                                        onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                        required
                                    >
                                        <option value="BREAKFAST">Breakfast</option>
                                        <option value="LUNCH">Lunch</option>
                                        <option value="DINNER">Dinner</option>
                                        <option value="SNACK">Snack</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Meal Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.mealName}
                                        onChange={(e) => setFormData({ ...formData, mealName: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                        required
                                        placeholder="e.g., Masala Dosa"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Calories
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.calories}
                                        onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Protein (g)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.proteinGrams}
                                        onChange={(e) => setFormData({ ...formData, proteinGrams: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Carbs (g)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.carbsGrams}
                                        onChange={(e) => setFormData({ ...formData, carbsGrams: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Fat (g)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.fatGrams}
                                        onChange={(e) => setFormData({ ...formData, fatGrams: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Fiber (g)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.fiberGrams}
                                        onChange={(e) => setFormData({ ...formData, fiberGrams: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Portion Size
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.portionSize}
                                        onChange={(e) => setFormData({ ...formData, portionSize: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                        placeholder="e.g., 1 medium bowl"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Meal Date & Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={formData.mealDate}
                                        onChange={(e) => setFormData({ ...formData, mealDate: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.isVegetarian}
                                        onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
                                        className="mr-2"
                                    />
                                    Vegetarian
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.isVegan}
                                        onChange={(e) => setFormData({ ...formData, isVegan: e.target.checked })}
                                        className="mr-2"
                                    />
                                    Vegan
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notes
                                </label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    rows="2"
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                                >
                                    Log Meal
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Meals List */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Recent Meals</h2>
                    {meals.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No meals logged yet</p>
                    ) : (
                        <div className="space-y-3">
                            {meals.map((meal) => (
                                <div key={meal.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-lg font-semibold text-gray-900">{meal.mealName}</h3>
                                                {meal.isVegetarian && <span className="text-green-600">🌿</span>}
                                                {meal.isVegan && <span className="text-green-600">🌱</span>}
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {meal.mealType} • {new Date(meal.mealDate).toLocaleString()}
                                            </p>
                                            <div className="flex flex-wrap gap-3 text-sm">
                                                <span className="font-semibold text-orange-600">{meal.calories} cal</span>
                                                <span className="text-gray-600">P: {meal.proteinGrams}g</span>
                                                <span className="text-gray-600">C: {meal.carbsGrams}g</span>
                                                <span className="text-gray-600">F: {meal.fatGrams}g</span>
                                                <span className="text-gray-600">Fiber: {meal.fiberGrams}g</span>
                                            </div>
                                            {meal.portionSize && (
                                                <p className="text-sm text-gray-500 mt-1">Portion: {meal.portionSize}</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleDelete(meal.id)}
                                            className="text-red-600 hover:text-red-800 ml-4"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MealTracker;
