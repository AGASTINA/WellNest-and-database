import React, { useState, useEffect } from 'react';
import HospitalMap from '../components/HospitalMap';
import { 
  getAllDoctors, 
  getAllHospitals, 
  findNearbyDoctors, 
  findNearbyHospitals, 
  searchDoctors,
  searchHospitals,
  bookConsultation 
} from '../utils/medicalApi';

const ConsultDoctor = () => {
  const [activeTab, setActiveTab] = useState('doctors');
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    consultationType: 'IN_PERSON',
    scheduledAt: '',
    symptoms: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
    getUserLocation();
  }, [activeTab]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      console.log('Requesting user location...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          console.log('User location obtained:', location);
          setUserLocation(location);
        },
        (error) => {
          console.error('Error getting location:', error);
          console.log('Using default location: Chennai');
          // Optionally use a default location
          // setUserLocation({ latitude: 13.0827, longitude: 80.2707 });
        }
      );
    } else {
      console.log('Geolocation not supported by browser');
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'doctors') {
        const data = await getAllDoctors();
        console.log('Doctors loaded:', data);
        setDoctors(data);
      } else {
        const data = await getAllHospitals();
        console.log('Hospitals loaded:', data);
        setHospitals(data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      alert(`Error loading ${activeTab}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadData();
      return;
    }
    setLoading(true);
    try {
      if (activeTab === 'doctors') {
        const data = await searchDoctors(searchQuery);
        setDoctors(data);
      } else {
        const data = await searchHospitals(searchQuery);
        setHospitals(data);
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNearbySearch = async () => {
    if (!userLocation) {
      alert('Please enable location services to find nearby facilities');
      return;
    }
    setLoading(true);
    try {
      if (activeTab === 'doctors') {
        const data = await findNearbyDoctors(userLocation.latitude, userLocation.longitude);
        setDoctors(data);
      } else {
        const data = await findNearbyHospitals(userLocation.latitude, userLocation.longitude);
        setHospitals(data);
      }
    } catch (error) {
      console.error('Error finding nearby:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookConsultation = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const submitBooking = async () => {
    try {
      const consultationRequest = {
        doctorId: selectedDoctor.id,
        ...bookingData
      };
      await bookConsultation(consultationRequest);
      alert('Consultation booked successfully!');
      setShowBookingModal(false);
      setBookingData({
        consultationType: 'IN_PERSON',
        scheduledAt: '',
        symptoms: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error booking consultation:', error);
      alert('Failed to book consultation');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Consult Healthcare Professionals</h1>
        <p className="text-gray-600 mb-8">Find doctors and hospitals near you</p>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('doctors')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'doctors'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Doctors
          </button>
          <button
            onClick={() => setActiveTab('hospitals')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'hospitals'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Hospitals
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
            <button
              onClick={handleNearbySearch}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Nearby
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Doctors List */}
        {!loading && activeTab === 'doctors' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">{doctor.name}</h3>
                    <p className="text-blue-600 font-semibold">{doctor.specialization}</p>
                    <p className="text-sm text-gray-500">{doctor.qualification}</p>
                  </div>
                  {doctor.distance && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {doctor.distance} km
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 mb-4 text-sm">
                  <p className="text-gray-600">
                    <span className="font-semibold">Experience:</span> {doctor.experienceYears} years
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Hospital:</span> {doctor.hospitalName}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Location:</span> {doctor.city}, {doctor.state}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Fee:</span> ${doctor.consultationFee}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Available:</span> {doctor.availabilityDays}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 font-semibold">{doctor.rating}</span>
                    <span className="text-gray-500 text-sm ml-1">({doctor.totalReviews})</span>
                  </div>
                </div>

                <button
                  onClick={() => handleBookConsultation(doctor)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book Consultation
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Hospitals List */}
        {!loading && activeTab === 'hospitals' && (
          <>
            {hospitals.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600 text-lg">No hospitals found.</p>
                <button 
                  onClick={loadData}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Reload Hospitals
                </button>
              </div>
            ) : (
              <>
            {/* Hospital Map */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Hospital Locations Map</h2>
              <p className="text-sm text-gray-600 mb-2">Found {hospitals.length} hospitals</p>
              {hospitals.length > 0 && (
                <HospitalMap 
                  hospitals={hospitals} 
                  userLocation={userLocation}
                  onHospitalClick={(hospital) => {
                    const element = document.getElementById(`hospital-${hospital.id}`);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      element.classList.add('ring-4', 'ring-blue-500');
                      setTimeout(() => {
                        element.classList.remove('ring-4', 'ring-blue-500');
                      }, 2000);
                    }
                  }}
                />
              )}
            </div>

            {/* Hospital Cards */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Hospitals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitals.map((hospital) => (
              <div key={hospital.id} id={`hospital-${hospital.id}`} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">{hospital.name}</h3>
                    <p className="text-blue-600 font-semibold">{hospital.hospitalType}</p>
                  </div>
                  {hospital.distance && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {hospital.distance} km
                    </span>
                  )}
                </div>

                <p className="text-gray-600 mb-4">{hospital.description}</p>

                <div className="space-y-2 mb-4 text-sm">
                  <p className="text-gray-600">
                    <span className="font-semibold">Address:</span> {hospital.address}, {hospital.city}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Phone:</span> {hospital.phoneNumber}
                  </p>
                  {hospital.emergencyNumber && (
                    <p className="text-red-600">
                      <span className="font-semibold">Emergency:</span> {hospital.emergencyNumber}
                    </p>
                  )}
                  <p className="text-gray-600">
                    <span className="font-semibold">Hours:</span> {hospital.operatingHours}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Specialties:</span> {hospital.specialties}
                  </p>
                </div>

                <div className="flex items-center space-x-4 mb-4 text-sm">
                  {hospital.hasEmergency && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded">Emergency</span>
                  )}
                  {hospital.hasAmbulance && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Ambulance</span>
                  )}
                  {hospital.hasParking && (
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">Parking</span>
                  )}
                </div>

                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1 font-semibold">{hospital.rating}</span>
                  <span className="text-gray-500 text-sm ml-1">({hospital.totalReviews})</span>
                </div>
              </div>
            ))}
            </div>
              </>
            )}
          </>
        )}

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Book Consultation</h2>
              <p className="text-gray-600 mb-4">with {selectedDoctor?.name}</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consultation Type
                  </label>
                  <select
                    value={bookingData.consultationType}
                    onChange={(e) => setBookingData({ ...bookingData, consultationType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="IN_PERSON">In Person</option>
                    <option value="VIDEO">Video Call</option>
                    <option value="PHONE">Phone Call</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={bookingData.scheduledAt}
                    onChange={(e) => setBookingData({ ...bookingData, scheduledAt: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Symptoms
                  </label>
                  <textarea
                    value={bookingData.symptoms}
                    onChange={(e) => setBookingData({ ...bookingData, symptoms: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Describe your symptoms..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={bookingData.notes}
                    onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="2"
                    placeholder="Any additional information..."
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitBooking}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultDoctor;
