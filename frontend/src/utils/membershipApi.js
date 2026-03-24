const API_BASE_URL = 'http://localhost:8081/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const createMembership = async (membershipData) => {
    const response = await fetch(`${API_BASE_URL}/memberships`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(membershipData)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create membership');
    }
    return response.json();
};

export const getActiveMembership = async () => {
    const response = await fetch(`${API_BASE_URL}/memberships/active`, {
        method: 'GET',
        headers: getAuthHeader()
    });
    if (response.status === 204) return null;
    if (!response.ok) throw new Error('Failed to fetch active membership');
    return response.json();
};

export const getMembershipHistory = async () => {
    const response = await fetch(`${API_BASE_URL}/memberships/history`, {
        method: 'GET',
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch membership history');
    return response.json();
};

export const processPayment = async (paymentData) => {
    const response = await fetch(`${API_BASE_URL}/memberships/payment/process`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(paymentData)
    });
    if (!response.ok) throw new Error('Failed to process payment');
    return response.json();
};

export const upgradeMembership = async (planType) => {
    const response = await fetch(`${API_BASE_URL}/memberships/upgrade`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify({ planType })
    });
    if (!response.ok) throw new Error('Failed to upgrade membership');
    return response.json();
};

export const cancelMembership = async (id) => {
    const response = await fetch(`${API_BASE_URL}/memberships/${id}/cancel`, {
        method: 'DELETE',
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to cancel membership');
};

export const getMembershipPlans = async () => {
    const response = await fetch(`${API_BASE_URL}/memberships/plans`, {
        method: 'GET',
        headers: getAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch membership plans');
    return response.json();
};
