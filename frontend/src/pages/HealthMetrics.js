import React, { useState, useEffect } from 'react';
import { getUserHealthMetrics, recordHealthMetrics, getLatestHealthMetrics } from '../utils/medicalApi';

const HealthMetrics = () => {
  const [metrics, setMetrics] = useState([]);
  const [latestMetric, setLatestMetric] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    heartRate: '',
    bloodSugar: '',
    cholesterolTotal: '',
    cholesterolHDL: '',
    cholesterolLDL: '',
    bodyTemperature: '',
    oxygenSaturation: '',
    weight: '',
    height: '',
    stepsCount: '',
    caloriesBurned: '',
    workoutDurationMinutes: '',
    notes: ''
  });

  useEffect(() => {
    loadMetrics();
    loadLatestMetric();
  }, []);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const data = await getUserHealthMetrics();
      setMetrics(data);
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLatestMetric = async () => {
    try {
      const data = await getLatestHealthMetrics();
      setLatestMetric(data);
    } catch (error) {
      console.error('Error loading latest metric:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert empty strings to null for numeric fields
      const processedData = Object.keys(formData).reduce((acc, key) => {
        if (formData[key] === '' || formData[key] === null) {
          acc[key] = null;
        } else if (key !== 'notes') {
          acc[key] = Number(formData[key]);
        } else {
          acc[key] = formData[key];
        }
        return acc;
      }, {});

      await recordHealthMetrics(processedData);
      loadMetrics();
      loadLatestMetric();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Error recording metrics:', error);
      alert('Failed to record health metrics');
    }
  };

  const resetForm = () => {
    setFormData({
      bloodPressureSystolic: '',
      bloodPressureDiastolic: '',
      heartRate: '',
      bloodSugar: '',
      cholesterolTotal: '',
      cholesterolHDL: '',
      cholesterolLDL: '',
      bodyTemperature: '',
      oxygenSaturation: '',
      weight: '',
      height: '',
      stepsCount: '',
      caloriesBurned: '',
      workoutDurationMinutes: '',
      notes: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Health Metrics</h1>
            <p className="text-gray-600">Track your vital signs and health indicators</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Record Metrics
          </button>
        </div>

        {/* Latest Metrics Summary */}
        {latestMetric && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Latest Reading</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {latestMetric.bloodPressureSystolic && latestMetric.bloodPressureDiastolic && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Blood Pressure</p>
                  <p className="text-2xl font-bold text-red-600">
                    {latestMetric.bloodPressureSystolic}/{latestMetric.bloodPressureDiastolic}
                  </p>
                  <p className="text-xs text-gray-500">mmHg</p>
                </div>
              )}
              {latestMetric.heartRate && (
                <div className="bg-pink-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Heart Rate</p>
                  <p className="text-2xl font-bold text-pink-600">{latestMetric.heartRate}</p>
                  <p className="text-xs text-gray-500">bpm</p>
                </div>
              )}
              {latestMetric.bloodSugar && (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Blood Sugar</p>
                  <p className="text-2xl font-bold text-orange-600">{latestMetric.bloodSugar}</p>
                  <p className="text-xs text-gray-500">mg/dL</p>
                </div>
              )}
              {latestMetric.oxygenSaturation && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Oxygen Sat.</p>
                  <p className="text-2xl font-bold text-blue-600">{latestMetric.oxygenSaturation}%</p>
                  <p className="text-xs text-gray-500">SpO2</p>
                </div>
              )}
              {latestMetric.weight && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Weight</p>
                  <p className="text-2xl font-bold text-green-600">{latestMetric.weight}</p>
                  <p className="text-xs text-gray-500">kg</p>
                </div>
              )}
              {latestMetric.bmi && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">BMI</p>
                  <p className="text-2xl font-bold text-purple-600">{latestMetric.bmi.toFixed(1)}</p>
                  <p className="text-xs text-gray-500">index</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Metrics History */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">History</h2>
            {metrics.map((metric) => (
              <div key={metric.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      {new Date(metric.recordedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
                  {metric.bloodPressureSystolic && (
                    <div>
                      <span className="text-gray-600">Blood Pressure:</span>
                      <p className="font-semibold">
                        {metric.bloodPressureSystolic}/{metric.bloodPressureDiastolic} mmHg
                      </p>
                    </div>
                  )}
                  {metric.heartRate && (
                    <div>
                      <span className="text-gray-600">Heart Rate:</span>
                      <p className="font-semibold">{metric.heartRate} bpm</p>
                    </div>
                  )}
                  {metric.bloodSugar && (
                    <div>
                      <span className="text-gray-600">Blood Sugar:</span>
                      <p className="font-semibold">{metric.bloodSugar} mg/dL</p>
                    </div>
                  )}
                  {metric.cholesterolTotal && (
                    <div>
                      <span className="text-gray-600">Cholesterol:</span>
                      <p className="font-semibold">{metric.cholesterolTotal} mg/dL</p>
                    </div>
                  )}
                  {metric.oxygenSaturation && (
                    <div>
                      <span className="text-gray-600">Oxygen:</span>
                      <p className="font-semibold">{metric.oxygenSaturation}%</p>
                    </div>
                  )}
                  {metric.weight && (
                    <div>
                      <span className="text-gray-600">Weight:</span>
                      <p className="font-semibold">{metric.weight} kg</p>
                    </div>
                  )}
                  {metric.bmi && (
                    <div>
                      <span className="text-gray-600">BMI:</span>
                      <p className="font-semibold">{metric.bmi.toFixed(1)}</p>
                    </div>
                  )}
                  {metric.stepsCount && (
                    <div>
                      <span className="text-gray-600">Steps:</span>
                      <p className="font-semibold">{metric.stepsCount.toLocaleString()}</p>
                    </div>
                  )}
                  {metric.caloriesBurned && (
                    <div>
                      <span className="text-gray-600">Calories:</span>
                      <p className="font-semibold">{metric.caloriesBurned} kcal</p>
                    </div>
                  )}
                  {metric.workoutDurationMinutes && (
                    <div>
                      <span className="text-gray-600">Workout:</span>
                      <p className="font-semibold">{metric.workoutDurationMinutes} min</p>
                    </div>
                  )}
                </div>

                {metric.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="text-gray-600 text-sm">Notes:</span>
                    <p className="text-gray-700 mt-1">{metric.notes}</p>
                  </div>
                )}
              </div>
            ))}

            {metrics.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500">No health metrics recorded yet. Start tracking your health!</p>
              </div>
            )}
          </div>
        )}

        {/* Recording Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-8 max-w-4xl w-full my-8">
              <h2 className="text-2xl font-bold mb-6">Record Health Metrics</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-800 mb-3">Vital Signs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Systolic BP (mmHg)
                      </label>
                      <input
                        type="number"
                        value={formData.bloodPressureSystolic}
                        onChange={(e) => setFormData({ ...formData, bloodPressureSystolic: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="120"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Diastolic BP (mmHg)
                      </label>
                      <input
                        type="number"
                        value={formData.bloodPressureDiastolic}
                        onChange={(e) => setFormData({ ...formData, bloodPressureDiastolic: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="80"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Heart Rate (bpm)
                      </label>
                      <input
                        type="number"
                        value={formData.heartRate}
                        onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="72"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-800 mb-3">Blood Tests</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Blood Sugar (mg/dL)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.bloodSugar}
                        onChange={(e) => setFormData({ ...formData, bloodSugar: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Cholesterol (mg/dL)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.cholesterolTotal}
                        onChange={(e) => setFormData({ ...formData, cholesterolTotal: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        HDL Cholesterol (mg/dL)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.cholesterolHDL}
                        onChange={(e) => setFormData({ ...formData, cholesterolHDL: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LDL Cholesterol (mg/dL)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.cholesterolLDL}
                        onChange={(e) => setFormData({ ...formData, cholesterolLDL: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-800 mb-3">Body Measurements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.height}
                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Oxygen Saturation (%)
                      </label>
                      <input
                        type="number"
                        value={formData.oxygenSaturation}
                        onChange={(e) => setFormData({ ...formData, oxygenSaturation: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="98"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-bold text-gray-800 mb-3">Activity Data</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Steps Count
                      </label>
                      <input
                        type="number"
                        value={formData.stepsCount}
                        onChange={(e) => setFormData({ ...formData, stepsCount: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Calories Burned
                      </label>
                      <input
                        type="number"
                        value={formData.caloriesBurned}
                        onChange={(e) => setFormData({ ...formData, caloriesBurned: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Workout Duration (min)
                      </label>
                      <input
                        type="number"
                        value={formData.workoutDurationMinutes}
                        onChange={(e) => setFormData({ ...formData, workoutDurationMinutes: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
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
                    placeholder="Any additional observations..."
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Metrics
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthMetrics;
