"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Users, Activity, Phone, Navigation } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
// Dummy data for ASHA centers across India (mostly rural areas)
const ASHA_CENTERS = [
  {
    id: 1,
    name: "ASHA Center - Bihar",
    location: "Gaya, Bihar",
    coordinates: { lat: 24.7955, lng: 85.0005 },
    workers: 45,
    patients: 1200,
    contact: "+91-1234567890",
    type: "Primary Health Center"
  },
  {
    id: 2,
    name: "ASHA Center - Uttar Pradesh",
    location: "Varanasi, Uttar Pradesh",
    coordinates: { lat: 25.3176, lng: 82.9739 },
    workers: 38,
    patients: 980,
    contact: "+91-1234567891",
    type: "Community Health Center"
  },
  {
    id: 3,
    name: "ASHA Center - Rajasthan",
    location: "Udaipur, Rajasthan",
    coordinates: { lat: 27.0238, lng: 74.2179 },
    workers: 28,
    patients: 750,
    contact: "+91-1234567892",
    type: "Sub Center"
  },
  {
    id: 4,
    name: "ASHA Center - Madhya Pradesh",
    location: "Bhopal, Madhya Pradesh",
    coordinates: { lat: 23.2599, lng: 77.4126 },
    workers: 52,
    patients: 1500,
    contact: "+91-1234567893",
    type: "Primary Health Center"
  },
  {
    id: 5,
    name: "ASHA Center - West Bengal",
    location: "Kolkata Rural, West Bengal",
    coordinates: { lat: 22.5726, lng: 88.3639 },
    workers: 42,
    patients: 1100,
    contact: "+91-1234567894",
    type: "Community Health Center"
  },
  {
    id: 6,
    name: "ASHA Center - Odisha",
    location: "Bhubaneswar, Odisha",
    coordinates: { lat: 20.2961, lng: 85.8245 },
    workers: 35,
    patients: 890,
    contact: "+91-1234567895",
    type: "Sub Center"
  },
  {
    id: 7,
    name: "ASHA Center - Jharkhand",
    location: "Ranchi, Jharkhand",
    coordinates: { lat: 23.3441, lng: 85.3096 },
    workers: 31,
    patients: 820,
    contact: "+91-1234567896",
    type: "Primary Health Center"
  },
  {
    id: 8,
    name: "ASHA Center - Assam",
    location: "Guwahati, Assam",
    coordinates: { lat: 26.1445, lng: 91.7362 },
    workers: 29,
    patients: 780,
    contact: "+91-1234567897",
    type: "Community Health Center"
  },
  {
    id: 9,
    name: "ASHA Center - Chhattisgarh",
    location: "Raipur, Chhattisgarh",
    coordinates: { lat: 21.2514, lng: 81.6296 },
    workers: 33,
    patients: 950,
    contact: "+91-1234567898",
    type: "Sub Center"
  },
  {
    id: 10,
    name: "ASHA Center - Tamil Nadu Rural",
    location: "Madurai Rural, Tamil Nadu",
    coordinates: { lat: 9.9252, lng: 78.1198 },
    workers: 48,
    patients: 1300,
    contact: "+91-1234567899",
    type: "Primary Health Center"
  }
];

export default function AshaCentersMap() {
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Initialize Google Maps
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        initializeMap();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      const mapOptions = {
        center: { lat: 23.5937, lng: 78.9629 }, // Center of India
        zoom: 5,
        styles: [
          {
            featureType: "all",
            elementType: "geometry",
            stylers: [{ color: "#f5f5f5" }],
          },
          {
            featureType: "all",
            elementType: "labels.text.fill",
            stylers: [{ color: "#666666" }],
          },
          {
            featureType: "poi",
            elementType: "all",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "road",
            elementType: "all",
            stylers: [{ color: "#ffffff" }],
          },
          {
            featureType: "water",
            elementType: "all",
            stylers: [{ color: "#e9f5f8" }],
          },
        ],
      };

      const mapElement = document.getElementById("asha-map");
      if (mapElement) {
        const newMap = new window.google.maps.Map(mapElement, mapOptions);
        setMap(newMap);

        // Add markers for each ASHA center
        const newMarkers = ASHA_CENTERS.map((center) => {
          const marker = new window.google.maps.Marker({
            position: center.coordinates,
            map: newMap,
            title: center.name,
            icon: {
              url: "data:image/svg+xml;base64," + btoa(`
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="16" fill="#10b981"/>
                  <circle cx="16" cy="16" r="8" fill="white"/>
                  <circle cx="16" cy="16" r="4" fill="#10b981"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(32, 32),
            },
          });

          marker.addListener("click", () => {
            setSelectedCenter(center);
            newMap.panTo(center.coordinates);
            newMap.setZoom(12);
          });

          return marker;
        });

        setMarkers(newMarkers);
        setIsMapLoaded(true);
      }
    };

    loadGoogleMaps();
  }, []);

  const handleCenterClick = (center) => {
    setSelectedCenter(center);
    if (map) {
      map.panTo(center.coordinates);
      map.setZoom(12);
    }
  };

  const resetMapView = () => {
    setSelectedCenter(null);
    if (map) {
      map.setCenter({ lat: 23.5937, lng: 78.9629 });
      map.setZoom(5);
    }
  };

  return (
    <div className="relative bg-slate-50 dark:bg-slate-950 py-16 sm:py-24">
      <Navbar/>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-900/5 dark:bg-slate-100/5 ring-1 ring-inset ring-slate-900/10 dark:ring-slate-100/10 mb-6 backdrop-blur-lg">
            <MapPin className="w-4 h-4 text-emerald-500 mr-2" />
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
              Nationwide Network
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-4">
            ASHA Centers Across{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent">
              India
            </span>
          </h2>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Discover our network of ASHA centers serving rural communities with 
            healthcare services and support.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Centers List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg ring-1 ring-slate-900/5 dark:ring-slate-100/10 p-6 h-fit sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  ASHA Centers ({ASHA_CENTERS.length})
                </h3>
                {selectedCenter && (
                  <button
                    onClick={resetMapView}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                  >
                    <Navigation className="w-4 h-4 mr-1" />
                    Reset View
                  </button>
                )}
              </div>

              <div className="space-y-4 max-h-96 lg:max-h-[500px] overflow-y-auto">
                {ASHA_CENTERS.map((center) => (
                  <div
                    key={center.id}
                    onClick={() => handleCenterClick(center)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedCenter?.id === center.id
                        ? "bg-emerald-50 dark:bg-emerald-900/20 ring-2 ring-emerald-500"
                        : "bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                          {center.name}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {center.location}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{center.workers} workers</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            <span>{center.patients} patients</span>
                          </div>
                        </div>
                      </div>
                      <MapPin className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Map Container */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg ring-1 ring-slate-900/5 dark:ring-slate-100/10 overflow-hidden h-[600px]">
              <div id="asha-map" className="w-full h-full" />
              
              {!isMapLoaded && (
                <div className="flex items-center justify-center h-full bg-slate-100 dark:bg-slate-800">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">Loading map...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Selected Center Details */}
            {selectedCenter && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-white dark:bg-slate-900 rounded-2xl shadow-lg ring-1 ring-slate-900/5 dark:ring-slate-100/10 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                      {selectedCenter.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-1">
                      {selectedCenter.location}
                    </p>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded-full">
                      {selectedCenter.type}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedCenter(null)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-500" />
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">ASHA Workers</p>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {selectedCenter.workers}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Patients Served</p>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {selectedCenter.patients}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-400">
                    {selectedCenter.contact}
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: "10K+", label: "ASHA Workers" },
            { value: "500+", label: "Centers" },
            { value: "25+", label: "States Covered" },
            { value: "1M+", label: "Patients Served" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}