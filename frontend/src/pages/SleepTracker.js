import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  logSleep,
  updateSleep,
  getUserSleepLogs,
  deleteSleep,
  getAverageSleepHours,
  getAverageSleepQuality,
  getTotalWaterIntake,
  getSleepLogsByDateRange
} from '../utils/sleepApi';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, Cell
} from 'recharts';
import PageHeader from '../components/PageHeader';

const getLocalDateString = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const shiftLocalDate = (baseDate, dayOffset) => {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + dayOffset);
  return d;
};

const normalizeDateKey = (value) => {
  if (!value) return null;
  const raw = String(value);
  const direct = raw.match(/^(\d{4}-\d{2}-\d{2})/);
  if (direct) return direct[1];

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return getLocalDateString(parsed);
};

const SleepTracker = () => {
  const navigate = useNavigate();
  const [sleepLogs, setSleepLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [stats, setStats] = useState({
    avgHours: 0,
    avgQuality: 0,
    totalWater: 0
  });

  const [formData, setFormData] = useState({
    sleepDate: getLocalDateString(),
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
      const today = new Date();
      const endDate = getLocalDateString(today);
      const startDate = getLocalDateString(shiftLocalDate(today, -6));

      const [avgHours, avgQuality, totalWater, weeklyLogs] = await Promise.all([
        getAverageSleepHours(startDate, endDate),
        getAverageSleepQuality(startDate, endDate),
        getTotalWaterIntake(startDate, endDate),
        getSleepLogsByDateRange(startDate, endDate)
      ]);

      setStats({ avgHours, avgQuality, totalWater });

      // Prepare weekly data for charts
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const d = shiftLocalDate(today, -i);
        const dateStr = getLocalDateString(d);
        const dayName = days[d.getDay()];

        const log = weeklyLogs.find(l => normalizeDateKey(l.sleepDate) === dateStr);
        last7Days.push({
          day: dayName,
          date: dateStr,
          sleepHours: log ? log.hoursSlept : 0,
          waterLiters: log ? (log.waterGlasses * 0.25) : 0, // Assuming 250ml per glass
          waterGlasses: log ? log.waterGlasses : 0,
          quality: log ? log.sleepQuality : 0
        });
      }
      setWeeklyData(last7Days);

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
        sleepDate: getLocalDateString(),
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
    <div className="min-h-screen wellnest-app-bg p-6">
      <div className="max-w-7xl mx-auto wellnest-content-layer">
        <PageHeader
          title="Sleep & Hydration Tracker"
          subtitle="Monitor your sleep quality and daily water intake with easy weekly insights."
          icon="😴"
          action={
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
            >
              Back to Dashboard
            </button>
          }
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-[1.02] transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Avg Sleep (7 days)</p>
                <p className="text-3xl font-bold mt-2">{stats.avgHours.toFixed(1)} hrs</p>
              </div>
              <div className="text-5xl opacity-50">😴</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-[1.02] transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Avg Quality (7 days)</p>
                <p className="text-3xl font-bold mt-2">{stats.avgQuality.toFixed(1)}/5</p>
              </div>
              <div className="text-5xl opacity-50">⭐</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-[1.02] transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-100 text-sm">Water Intake (7 days)</p>
                <p className="text-3xl font-bold mt-2">{stats.totalWater} glasses</p>
              </div>
              <div className="text-5xl opacity-50">💧</div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Water Intake Chart */}
          <div className="wellnest-surface p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Water Intake (Last 7 Days)</h3>
              <div className="text-cyan-500">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.535 5.353a1 1 0 011.415 0 2.5 2.5 0 003.5 0 1 1 0 011.415 1.415 4.5 4.5 0 01-6.33 0 1 1 0 010-1.415z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <defs>
                    <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dx={-10} unit="L" />
                  <Tooltip
                    cursor={{ fill: '#f9fafb' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="waterLiters" name="Water (L)" fill="url(#waterGradient)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sleep Pattern Chart */}
          <div className="wellnest-surface p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Sleep Pattern</h3>
              <div className="text-purple-500">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dx={-10} unit="h" />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sleepHours"
                    name="Sleep Hours"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#sleepGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Weekly Sleep Bar Chart */}
        <div className="wellnest-surface p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Weekly Sleep Distribution</h3>
            <div className="text-indigo-500">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} unit="h" />
                <Tooltip
                  cursor={{ fill: '#eef2ff' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="sleepHours" name="Sleep Hours">
                  {weeklyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.sleepHours >= 7 ? '#6366f1' : '#f43f5e'} opacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-indigo-500 rounded-sm"></div>
              <span className="text-gray-600">Optimal (7h+)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
              <span className="text-gray-600">Suboptimal ({"<"}7h)</span>
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
          <div className="wellnest-surface p-12 text-center">
            <div className="text-6xl mb-4">😴</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Sleep Logs Yet</h3>
            <p className="text-gray-600">Start tracking your sleep to see patterns and improve your rest!</p>
          </div>
        ) : (
          <div className="wellnest-surface overflow-hidden">
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
