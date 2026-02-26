import React, { useState, useEffect } from 'react';
import { getToken, setAuthSession, getStoredUser } from '../utils/auth';

const EditAdminProfileModal = ({ isOpen, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        role: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchProfile();
        }
    }, [isOpen]);

    const fetchProfile = async () => {
        try {
            const token = getToken();
            const response = await fetch('http://localhost:8081/api/user/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    phoneNumber: data.phoneNumber || '',
                    role: data.role || ''
                });
            }
        } catch (err) {
            console.error("Failed to fetch profile", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Assuming we parse name to firstName and lastName for backend compatibility
        // If your backend only updates based on firstName/lastName, we do a basic split:
        const nameParts = formData.name.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

        const payload = {
            firstName,
            lastName,
            phoneNumber: formData.phoneNumber,
            role: formData.role
        };

        try {
            const token = getToken();
            const response = await fetch('http://localhost:8081/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                const currentUser = getStoredUser();
                // Since name is generated from firstName + lastName in backend
                setAuthSession(token, { ...currentUser, ...data });
                onUpdate(data);
                onClose();
            } else {
                setError(data.message || 'Failed to update profile');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-xl w-full max-w-md overflow-hidden text-white">
                <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-800">
                    <h3 className="text-lg font-semibold text-white">Edit Admin Profile</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-700 bg-slate-800 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            readOnly
                            className="w-full px-3 py-2 border border-slate-700 bg-slate-950 rounded-lg text-slate-500 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="+1234567890"
                            className="w-full px-3 py-2 border border-slate-700 bg-slate-800 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-700 bg-slate-800 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-white"
                        >
                            <option value="">Select Role...</option>
                            <option value="ADMIN">Admin</option>
                            <option value="USER">User</option>
                            <option value="TRAINER">Trainer</option>
                            <option value="TRAINEE">Trainee</option>
                        </select>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAdminProfileModal;
