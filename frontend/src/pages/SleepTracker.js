import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  logSleep,
  updateSleep,
  getUserSleepLogs,
  deleteSleep,
  getAverageSleepHours,
  getAverageSleepQuality,
  getTotalWaterIntake
} from '../utils/sleepApi';

const SleepTracker = () => {
  const navigate = useNavigate();
  const [sleepLogs, setSleepLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [stats, setStats] = useState({
    avgHours: 0,
    avgQuality: 0,
    totalWater: 0
  });

  const [formData, setFormData] = useState({
    sleepDate: new Date().toISOString().split('T')[0],
    bedTime: '22:00',
    wakeTime: '06:00',
    hoursSlept: 8.0,
    sleepQuality: 3,
    waterGlasses: 8,
    notes: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchSleepLogs();
    fetchStats();
  }, [navigate]);

  const fetchSleepLogs = async () => {
    try {
      setLoading(true);
      const logs = await getUserSleepLogs();
      setSleepLogs(logs);
    } catch (error) {
      console.error('Error fetching sleep logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const [avgHours, avgQuality, totalWater] = await Promise.all([
        getAverageSleepHours(startDate, endDate),
        getAverageSleepQuality(startDate, endDate),
        getTotalWaterIntake(startDate, endDate)
      ]);

      setStats({ avgHours, avgQuality, totalWater });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const calculateHoursSlept = (bedTime, wakeTime) => {
    const [bedHour, bedMin] = bedTime.split(':').map(Number);
    const [wakeHour, wakeMin] = wakeTime.split(':').map(Number);
    
    let bedMinutes = bedHour * 60 + bedMin;
    let wakeMinutes = wakeHour * 60 + wakeMin;
    
    // If wake time is earlier than bed time, add 24 hours to wake time
    if (wakeMinutes < bedMinutes) {
      wakeMinutes += 24 * 60;
    }
    
    const totalMinutes = wakeMinutes - bedMinutes;
    return (totalMinutes / 60).toFixed(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-calculate hours slept when bed time or wake time changes
      if (name === 'bedTime' || name === 'wakeTime') {
        updated.hoursSlept = parseFloat(calculateHoursSlept(
          name === 'bedTime' ? value : prev.bedTime,
          name === 'wakeTime' ? value : prev.wakeTime
        ));
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLog) {
        await updateSleep(editingLog.id, formData);
      } else {
        await logSleep(formData);
      }
      
      setShowModal(false);
      setEditingLog(null);
      setFormData({
        sleepDate: new Date().toISOString().split('T')[0],
        bedTime: '22:00',
        wakeTime: '06:00',
        hoursSlept: 8.0,
        sleepQuality: 3,
        waterGlasses: 8,
        notes: ''
      });
      
      fetchSleepLogs();
      fetchStats();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (log) => {
    setEditingLog(log);
    setFormData({
      sleepDate: log.sleepDate,
      bedTime: log.bedTime,
      wakeTime: log.wakeTime,
      hoursSlept: log.hoursSlept,
      sleepQuality: log.sleepQuality,
      waterGlasses: log.waterGlasses,
      notes: log.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sleep log?')) {
      try {
        await deleteSleep(id);
        fetchSleepLogs();
        fetchStats();
      } catch (error) {
        alert('Failed to delete sleep log');
      }
    }
  };

  const getSleepQualityColor = (quality) => {
    if (quality >= 4) return 'text-green-600';
    if (quality >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSleepQualityText = (quality) => {
    const texts = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    return texts[quality - 1] || 'Not Rated';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Sleep & Hydration Tracker</h1>
            <p className="text-gray-600 mt-2">Monitor your sleep quality and daily water intake</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Avg Sleep (7 days)</p>
                <p className="text-3xl font-bold mt-2">{stats.avgHours.toFixed(1)} hrs</p>
              </div>
              <div className="text-5xl opacity-50">😴</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Avg Quality (7 days)</p>
                <p className="text-3xl font-bold mt-2">{stats.avgQuality.toFixed(1)}/5</p>
              </div>
              <div className="text-5xl opacity-50">⭐</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-100 text-sm">Water Intake (7 days)</p>
                <p className="text-3xl font-bold mt-2">{stats.totalWater} glasses</p>
              </div>
              <div className="text-5xl opacity-50">💧</div>
            </div>
          </div>
        </div>

        {/* Add Log Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              setEditingLog(null);
              setFormData({
                sleepDate: new Date().toISOString().split('T')[0],
                bedTime: '22:00',
                wakeTime: '06:00',
                hoursSlept: 8.0,
                sleepQuality: 3,
                waterGlasses: 8,
                notes: ''
              });
              setShowModal(true);
            }}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all text-lg font-semibold"
          >
            + Log Sleep & Water
          </button>
        </div>

        {/* Sleep Logs List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading sleep logs...</p>
          </div>
        ) : sleepLogs.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-lg">
            <div className="text-6xl mb-4">😴</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Sleep Logs Yet</h3>
            <p className="text-gray-600">Start tracking your sleep to see patterns and improve your rest!</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Bed Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Wake Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Hours Slept</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Quality</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Water Intake</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Notes</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sleepLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{log.sleepDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{log.bedTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{log.wakeTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-blue-600 font-semibold">{log.hoursSlept} hrs</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`font-semibold ${getSleepQualityColor(log.sleepQuality)}`}>
                          {getSleepQualityText(log.sleepQuality)} ({log.sleepQuality}/5)
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-cyan-600 font-semibold">{log.waterGlasses} glasses</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-600 text-sm max-w-xs truncate">
                          {log.notes || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleEdit(log)}
                          className="text-blue-600 hover:text-blue-800 mr-3 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(log.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-t-xl">
                <h2 className="text-2xl font-bold">
                  {editingLog ? 'Edit Sleep Log' : 'Log Sleep & Water'}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Date</label>
                    <input
                      type="date"
                      name="sleepDate"
                      value={formData.sleepDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Bed Time</label>
                    <input
                      type="time"
                      name="bedTime"
                      value={formData.bedTime}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Wake Time</label>
                    <input
                      type="time"
                      name="wakeTime"
                      value={formData.wakeTime}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Hours Slept</label>
                    <input
                      type="number"
                      name="hoursSlept"
                      value={formData.hoursSlept}
                      onChange={handleInputChange}
                      step="0.1"
                      min="0"
                      max="24"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Sleep Quality (1-5)
                    </label>
                    <select
                      name="sleepQuality"
                      value={formData.sleepQuality}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Water Intake (glasses)
                    </label>
                    <input
                      type="number"
                      name="waterGlasses"
                      value={formData.waterGlasses}
                      onChange={handleInputChange}
                      min="0"
                      max="20"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="e.g., Felt refreshed, woke up during night, etc."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingLog(null);
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    {editingLog ? 'Update Log' : 'Add Log'}
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

export default SleepTracker;
