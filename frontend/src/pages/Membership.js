import React, { useState, useEffect } from 'react';
import { getActiveMembership, getMembershipPlans, createMembership, processPayment, upgradeMembership, getMembershipHistory } from '../utils/membershipApi';

const Membership = () => {
    const [activeMembership, setActiveMembership] = useState(null);
    const [plans, setPlans] = useState({});
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [billingCycle, setBillingCycle] = useState('MONTHLY');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const [pendingMembership, setPendingMembership] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [membership, plansData, historyData] = await Promise.all([
                getActiveMembership(),
                getMembershipPlans(),
                getMembershipHistory()
            ]);
            setActiveMembership(membership);
            setPlans(plansData);
            setHistory(historyData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculatePrice = (plan, cycle) => {
        if (plan === 'FREE') return 0;
        const monthlyPrice = plans[plan]?.monthlyPrice || 0;
        if (cycle === 'MONTHLY') return monthlyPrice;
        if (cycle === 'QUARTERLY') return (monthlyPrice * 3 * 0.9).toFixed(2);
        if (cycle === 'YEARLY') return (monthlyPrice * 12 * 0.8).toFixed(2);
        return monthlyPrice;
    };

    const handleSelectPlan = async (planType) => {
        if (planType === 'FREE') {
            alert('You are already on the free plan!');
            return;
        }

        setSelectedPlan(planType);
        try {
            const membership = await createMembership({
                planType,
                billingCycle,
                autoRenewal: true
            });
            setPendingMembership(membership);
            setShowPaymentModal(true);
        } catch (error) {
            alert('Error creating membership: ' + error.message);
        }
    };

    const handlePayment = async () => {
        try {
            await processPayment({
                transactionId: pendingMembership.transactionId,
                paymentMethod,
                paymentStatus: 'COMPLETED'
            });
            alert('Payment successful! Your membership is now active.');
            setShowPaymentModal(false);
            setPendingMembership(null);
            setSelectedPlan(null);
            fetchData();
        } catch (error) {
            alert('Payment failed: ' + error.message);
        }
    };

    const handleUpgrade = async (newPlan) => {
        if (window.confirm(`Upgrade to ${plans[newPlan]?.name}?`)) {
            try {
                await upgradeMembership(newPlan);
                alert('Membership upgraded successfully!');
                fetchData();
            } catch (error) {
                alert('Error upgrading membership: ' + error.message);
            }
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Membership Plans</h1>

                {/* Current Membership */}
                {activeMembership && (
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg p-6 mb-8 text-white">
                        <h2 className="text-2xl font-bold mb-2">Current Plan</h2>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-3xl font-bold">{activeMembership.planName}</p>
                                <p className="mt-2">
                                    ${activeMembership.price}/{activeMembership.billingCycle.toLowerCase()}
                                </p>
                                <p className="text-sm opacity-90 mt-1">
                                    Valid until {new Date(activeMembership.endDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="inline-block px-4 py-2 bg-white bg-opacity-30 rounded-full text-sm font-medium">
                                    {activeMembership.status}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Billing Cycle Selector */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-2">Select Billing Cycle:</p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setBillingCycle('MONTHLY')}
                            className={`px-6 py-2 rounded-lg font-medium transition ${
                                billingCycle === 'MONTHLY'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('QUARTERLY')}
                            className={`px-6 py-2 rounded-lg font-medium transition ${
                                billingCycle === 'QUARTERLY'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Quarterly <span className="text-xs">(Save 10%)</span>
                        </button>
                        <button
                            onClick={() => setBillingCycle('YEARLY')}
                            className={`px-6 py-2 rounded-lg font-medium transition ${
                                billingCycle === 'YEARLY'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Yearly <span className="text-xs">(Save 20%)</span>
                        </button>
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {Object.keys(plans).map((planKey) => {
                        const plan = plans[planKey];
                        const price = calculatePrice(planKey, billingCycle);
                        const isCurrentPlan = activeMembership?.planType === planKey;
                        
                        return (
                            <div
                                key={planKey}
                                className={`bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition ${
                                    isCurrentPlan ? 'ring-2 ring-blue-500' : ''
                                }`}
                            >
                                {isCurrentPlan && (
                                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium mb-3">
                                        Current Plan
                                    </span>
                                )}
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                <p className="text-4xl font-bold text-gray-900 mb-4">
                                    {price > 0 ? `$${price}` : 'Free'}
                                    {price > 0 && <span className="text-sm text-gray-600">/{billingCycle.toLowerCase()}</span>}
                                </p>
                                <ul className="space-y-2 mb-6">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start text-sm text-gray-600">
                                            <span className="text-green-600 mr-2">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => isCurrentPlan ? null : handleSelectPlan(planKey)}
                                    disabled={isCurrentPlan}
                                    className={`w-full py-3 rounded-lg font-semibold transition ${
                                        isCurrentPlan
                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    {isCurrentPlan ? 'Current Plan' : 'Select Plan'}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Payment Modal */}
                {showPaymentModal && pendingMembership && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                            <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>
                            <div className="mb-6">
                                <p className="text-gray-600 mb-2">Plan: <span className="font-semibold">{pendingMembership.planName}</span></p>
                                <p className="text-gray-600 mb-2">Amount: <span className="font-semibold text-2xl">${pendingMembership.price}</span></p>
                                <p className="text-sm text-gray-500">Transaction ID: {pendingMembership.transactionId}</p>
                            </div>
                            
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Payment Method
                                </label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="UPI">UPI</option>
                                    <option value="CREDIT_CARD">Credit Card</option>
                                    <option value="DEBIT_CARD">Debit Card</option>
                                    <option value="NET_BANKING">Net Banking</option>
                                    <option value="PAYPAL">PayPal</option>
                                </select>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        setShowPaymentModal(false);
                                        setPendingMembership(null);
                                    }}
                                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePayment}
                                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                >
                                    Pay Now
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Membership History */}
                {history.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Membership History</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Plan</th>
                                        <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Price</th>
                                        <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Duration</th>
                                        <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Status</th>
                                        <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Transaction ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((item) => (
                                        <tr key={item.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm">{item.planName}</td>
                                            <td className="py-3 px-4 text-sm">${item.price}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                                    item.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                                    item.status === 'EXPIRED' ? 'bg-gray-100 text-gray-800' :
                                                    item.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{item.transactionId}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Membership;
