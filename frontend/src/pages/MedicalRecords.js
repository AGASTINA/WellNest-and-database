import React, { useState, useEffect } from 'react';
import { getUserMedicalRecords, createMedicalRecord, updateMedicalRecord, deleteMedicalRecord } from '../utils/medicalApi';

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({
    recordType: 'VISIT_NOTE',
    title: '',
    description: '',
    doctorName: '',
    hospitalName: '',
    diagnosis: '',
    medications: '',
    allergies: '',
    bloodType: '',
    chronicConditions: '',
    recordDate: new Date().toISOString().slice(0, 16)
  });

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await getUserMedicalRecords();
      setRecords(data);
    } catch (error) {
      console.error('Error loading records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRecord) {
        await updateMedicalRecord(editingRecord.id, formData);
      } else {
        await createMedicalRecord(formData);
      }
      loadRecords();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving record:', error);
      alert('Failed to save record');
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormData({
      recordType: record.recordType,
      title: record.title,
      description: record.description || '',
      doctorName: record.doctorName || '',
      hospitalName: record.hospitalName || '',
      diagnosis: record.diagnosis || '',
      medications: record.medications || '',
      allergies: record.allergies || '',
      bloodType: record.bloodType || '',
      chronicConditions: record.chronicConditions || '',
      recordDate: record.recordDate ? new Date(record.recordDate).toISOString().slice(0, 16) : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteMedicalRecord(id);
        loadRecords();
      } catch (error) {
        console.error('Error deleting record:', error);
        alert('Failed to delete record');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      recordType: 'VISIT_NOTE',
      title: '',
      description: '',
      doctorName: '',
      hospitalName: '',
      diagnosis: '',
      medications: '',
      allergies: '',
      bloodType: '',
      chronicConditions: '',
      recordDate: new Date().toISOString().slice(0, 16)
    });
    setEditingRecord(null);
  };

  const getRecordTypeColor = (type) => {
    const colors = {
      'VISIT_NOTE': 'bg-blue-100 text-blue-800',
      'LAB_RESULT': 'bg-green-100 text-green-800',
      'PRESCRIPTION': 'bg-purple-100 text-purple-800',
      'DIAGNOSIS': 'bg-red-100 text-red-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Medical Records</h1>
            <p className="text-gray-600">Manage your health records and medical history</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Record
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {records.map((record) => (
              <div key={record.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{record.title}</h3>
                      <span className={`text-xs px-3 py-1 rounded-full ${getRecordTypeColor(record.recordType)}`}>
                        {record.recordType.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(record.recordDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(record)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {record.description && (
                    <div className="col-span-2">
                      <span className="font-semibold text-gray-700">Description:</span>
                      <p className="text-gray-600 mt-1">{record.description}</p>
                    </div>
                  )}
                  
                  {record.doctorName && (
                    <div>
                      <span className="font-semibold text-gray-700">Doctor:</span>
                      <p className="text-gray-600">{record.doctorName}</p>
                    </div>
                  )}
                  
                  {record.hospitalName && (
                    <div>
                      <span className="font-semibold text-gray-700">Hospital:</span>
                      <p className="text-gray-600">{record.hospitalName}</p>
                    </div>
                  )}
                  
                  {record.diagnosis && (
                    <div className="col-span-2">
                      <span className="font-semibold text-gray-700">Diagnosis:</span>
                      <p className="text-gray-600 mt-1">{record.diagnosis}</p>
                    </div>
                  )}
                  
                  {record.medications && (
                    <div className="col-span-2">
                      <span className="font-semibold text-gray-700">Medications:</span>
                      <p className="text-gray-600 mt-1">{record.medications}</p>
                    </div>
                  )}
                  
                  {record.allergies && (
                    <div>
                      <span className="font-semibold text-gray-700">Allergies:</span>
                      <p className="text-red-600">{record.allergies}</p>
                    </div>
                  )}
                  
                  {record.bloodType && (
                    <div>
                      <span className="font-semibold text-gray-700">Blood Type:</span>
                      <p className="text-gray-600">{record.bloodType}</p>
                    </div>
                  )}
                  
                  {record.chronicConditions && (
                    <div className="col-span-2">
                      <span className="font-semibold text-gray-700">Chronic Conditions:</span>
                      <p className="text-gray-600 mt-1">{record.chronicConditions}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {records.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500">No medical records found. Add your first record!</p>
              </div>
            )}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full my-8">
              <h2 className="text-2xl font-bold mb-6">
                {editingRecord ? 'Edit Medical Record' : 'Add Medical Record'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Record Type *
                    </label>
                    <select
                      value={formData.recordType}
                      onChange={(e) => setFormData({ ...formData, recordType: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="VISIT_NOTE">Visit Note</option>
                      <option value="LAB_RESULT">Lab Result</option>
                      <option value="PRESCRIPTION">Prescription</option>
                      <option value="DIAGNOSIS">Diagnosis</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.recordDate}
                      onChange={(e) => setFormData({ ...formData, recordDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Doctor Name
                    </label>
                    <input
                      type="text"
                      value={formData.doctorName}
                      onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hospital Name
                    </label>
                    <input
                      type="text"
                      value={formData.hospitalName}
                      onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diagnosis
                  </label>
                  <textarea
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medications
                  </label>
                  <textarea
                    value={formData.medications}
                    onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="2"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allergies
                    </label>
                    <input
                      type="text"
                      value={formData.allergies}
                      onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blood Type
                    </label>
                    <input
                      type="text"
                      value={formData.bloodType}
                      onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., A+, O-, AB+"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chronic Conditions
                  </label>
                  <textarea
                    value={formData.chronicConditions}
                    onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="2"
                  />
                </div>

                <div className="flex gap-4 pt-4">
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
                    {editingRecord ? 'Update' : 'Save'} Record
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

export default MedicalRecords;
