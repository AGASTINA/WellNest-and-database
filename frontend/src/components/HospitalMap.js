import React, { useEffect, useRef, useState } from 'react';

const HospitalMap = ({ hospitals = [], userLocation, onHospitalClick }) => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Load Leaflet library
  useEffect(() => {
    if (window.L) {
      setLeafletLoaded(true);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    document.head.appendChild(script);

    script.onload = () => {
      setLeafletLoaded(true);
    };

    script.onerror = () => {
      console.error('Failed to load Leaflet library');
      setLoading(false);
    };
  }, []);

  // Initialize map when Leaflet is loaded
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current || map) return;

    try {
      const defaultCenter = [13.0827, 80.2707];
      const center = userLocation ? [userLocation.latitude, userLocation.longitude] : defaultCenter;

      const newMap = window.L.map(mapContainerRef.current).setView(center, 12);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(newMap);

      setMap(newMap);
      setLoading(false);
    } catch (error) {
      console.error('Error initializing map:', error);
      setLoading(false);
    }

    return () => {
      if (map) {
        try {
          map.remove();
        } catch (e) {
          console.error('Error removing map:', e);
        }
      }
    };
  }, [leafletLoaded]);

  // Update markers when hospitals or location changes
  useEffect(() => {
    if (map && hospitals && hospitals.length > 0) {
      updateMarkers();
    }
  }, [hospitals, userLocation, map]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const updateMarkers = () => {
    if (!map || !window.L || !hospitals) return;

    try {
      // Clear existing markers
      markers.forEach(marker => {
        try {
          marker.remove();
        } catch (e) {
          console.error('Error removing marker:', e);
        }
      });
      const newMarkers = [];

      // Define global function for popup button
      window.viewHospitalDetails = (hospitalId) => {
        const hospital = hospitals.find(h => h.id === hospitalId);
        if (hospital && onHospitalClick) {
          onHospitalClick(hospital);
        }
      };

      // Add user location marker
      if (userLocation && userLocation.latitude && userLocation.longitude) {
        try {
          const userMarker = window.L.marker([userLocation.latitude, userLocation.longitude], {
            icon: window.L.divIcon({
              className: 'user-location-marker',
              html: '<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);"></div>',
              iconSize: [16, 16]
            })
          }).addTo(map);
          
          userMarker.bindPopup('<b>Your Location</b>');
          newMarkers.push(userMarker);
        } catch (e) {
          console.error('Error adding user location marker:', e);
        }
      }

      // Add hospital markers
      hospitals.forEach(hospital => {
        if (!hospital || !hospital.latitude || !hospital.longitude) {
          console.warn('Hospital missing coordinates:', hospital);
          return;
        }

        try {
          const distance = userLocation && userLocation.latitude && userLocation.longitude ? 
            calculateDistance(userLocation.latitude, userLocation.longitude, hospital.latitude, hospital.longitude) 
            : null;

          const markerIcon = window.L.divIcon({
            className: 'hospital-marker',
            html: `<div style="background-color: ${hospital.hasEmergency ? '#ef4444' : '#10b981'}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.3);"></div>`,
            iconSize: [12, 12]
          });

          const marker = window.L.marker([hospital.latitude, hospital.longitude], {
            icon: markerIcon
          }).addTo(map);

          const popupContent = `
            <div style="min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${hospital.name}</h3>
              <p style="margin: 4px 0; font-size: 12px;"><strong>Type:</strong> ${hospital.hospitalType}</p>
              <p style="margin: 4px 0; font-size: 12px;"><strong>Address:</strong> ${hospital.address}, ${hospital.city}</p>
              <p style="margin: 4px 0; font-size: 12px;"><strong>Phone:</strong> ${hospital.phoneNumber}</p>
              ${distance ? `<p style="margin: 4px 0; font-size: 12px; color: #3b82f6;"><strong>Distance:</strong> ${distance.toFixed(2)} km</p>` : ''}
              ${hospital.hasEmergency ? '<p style="margin: 4px 0; font-size: 11px; color: #ef4444;">🚨 24/7 Emergency Available</p>' : ''}
              <button onclick="window.viewHospitalDetails(${hospital.id})" style="margin-top: 8px; padding: 4px 12px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">View Details</button>
            </div>
          `;

          marker.bindPopup(popupContent);
          marker.on('click', () => {
            if (onHospitalClick) {
              onHospitalClick(hospital);
            }
          });

          newMarkers.push(marker);
        } catch (e) {
          console.error('Error adding hospital marker:', hospital.name, e);
        }
      });

      setMarkers(newMarkers);

      // Fit bounds to show all markers
      if (newMarkers.length > 0) {
        const group = window.L.featureGroup(newMarkers);
        map.fitBounds(group.getBounds().pad(0.1));
      }
    } catch (error) {
      console.error('Error updating markers:', error);
    }
  };

  return (
    <div className="relative" style={{ height: '500px', width: '100%' }}>
      <div ref={mapContainerRef} style={{ height: '100%', width: '100%', borderRadius: '12px' }} />
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="text-gray-600">Loading map...</div>
        </div>
      )}
    </div>
  );
};

export default HospitalMap;
