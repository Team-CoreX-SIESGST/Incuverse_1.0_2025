"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Users,
  Activity,
  Phone,
  Navigation,
  Bot,
  Mic,
  Send,
  X,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";

// Animation variants
const FADE_IN_STAGGER_VARIANTS = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const FADE_IN_UP_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// Dummy data for ASHA centers across India
const ASHA_CENTERS = [
  {
    id: 1,
    name: "ASHA Center - Bihar",
    location: "Gaya, Bihar",
    coordinates: { lat: 24.7955, lng: 85.0005 },
    workers: 45,
    patients: 1200,
    contact: "+91-1234567890",
    type: "Primary Health Center",
  },
  {
    id: 2,
    name: "ASHA Center - Uttar Pradesh",
    location: "Varanasi, Uttar Pradesh",
    coordinates: { lat: 25.3176, lng: 82.9739 },
    workers: 38,
    patients: 980,
    contact: "+91-1234567891",
    type: "Community Health Center",
  },
  {
    id: 3,
    name: "ASHA Center - Rajasthan",
    location: "Udaipur, Rajasthan",
    coordinates: { lat: 27.0238, lng: 74.2179 },
    workers: 28,
    patients: 750,
    contact: "+91-1234567892",
    type: "Sub Center",
  },
  {
    id: 4,
    name: "ASHA Center - Madhya Pradesh",
    location: "Bhopal, Madhya Pradesh",
    coordinates: { lat: 23.2599, lng: 77.4126 },
    workers: 52,
    patients: 1500,
    contact: "+91-1234567893",
    type: "Primary Health Center",
  },
  {
    id: 5,
    name: "ASHA Center - West Bengal",
    location: "Kolkata Rural, West Bengal",
    coordinates: { lat: 22.5726, lng: 88.3639 },
    workers: 42,
    patients: 1100,
    contact: "+91-1234567894",
    type: "Community Health Center",
  },
  {
    id: 6,
    name: "ASHA Center - Odisha",
    location: "Bhubaneswar, Odisha",
    coordinates: { lat: 20.2961, lng: 85.8245 },
    workers: 35,
    patients: 890,
    contact: "+91-1234567895",
    type: "Sub Center",
  },
  {
    id: 7,
    name: "ASHA Center - Jharkhand",
    location: "Ranchi, Jharkhand",
    coordinates: { lat: 23.3441, lng: 85.3096 },
    workers: 31,
    patients: 820,
    contact: "+91-1234567896",
    type: "Primary Health Center",
  },
  {
    id: 8,
    name: "ASHA Center - Assam",
    location: "Guwahati, Assam",
    coordinates: { lat: 26.1445, lng: 91.7362 },
    workers: 29,
    patients: 780,
    contact: "+91-1234567897",
    type: "Community Health Center",
  },
  {
    id: 9,
    name: "ASHA Center - Chhattisgarh",
    location: "Raipur, Chhattisgarh",
    coordinates: { lat: 21.2514, lng: 81.6296 },
    workers: 33,
    patients: 950,
    contact: "+91-1234567898",
    type: "Sub Center",
  },
  {
    id: 10,
    name: "ASHA Center - Tamil Nadu Rural",
    location: "Madurai Rural, Tamil Nadu",
    coordinates: { lat: 9.9252, lng: 78.1198 },
    workers: 48,
    patients: 1300,
    contact: "+91-1234567899",
    type: "Primary Health Center",
  },
];

// Chatbot Component
const ChatBot = ({ centers, onCenterSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const { messages: langMessages } = useLanguage();

  // Translation function
  const t = (key) => {
    const keys = key.split(".");
    let value = langMessages;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "hi-IN";

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
        };
      }
    }

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          setUserLocation({ lat: 28.6139, lng: 77.209 });
        }
      );
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Calculate distance between two coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Find nearest centers
  const findNearestCenters = (userLat, userLng, count = 3) => {
    const centersWithDistance = centers.map((center) => ({
      ...center,
      distance: calculateDistance(
        userLat,
        userLng,
        center.coordinates.lat,
        center.coordinates.lng
      ),
    }));

    return centersWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, count);
  };

  // Process user message
  const processMessage = async (message) => {
    setIsLoading(true);

    try {
      const nearestCenters = userLocation
        ? findNearestCenters(userLocation.lat, userLocation.lng, 3)
        : centers.slice(0, 3);

      const context = {
        userMessage: message,
        userLocation: userLocation,
        nearestCenters: nearestCenters,
        allCenters: centers,
        currentTime: new Date().toLocaleString(),
      };

      const response = await simulateGeminiResponse(context);

      setMessages((prev) => [
        ...prev,
        {
          text: response,
          isBot: true,
          centers: nearestCenters,
        },
      ]);
    } catch (error) {
      console.error("Error processing message:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: t("ChatBot.errorMessage"),
          isBot: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate Gemini API response with multi-language support
  const simulateGeminiResponse = async (context) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { userMessage, nearestCenters } = context;

    // Language detection
    const isHindi = /[\u0900-\u097F]/.test(userMessage);
    const isTamil = /[\u0B80-\u0BFF]/.test(userMessage);
    const isMarathi = /[\u0900-\u097F]/.test(userMessage); // Same script as Hindi
    const isBengali = /[\u0980-\u09FF]/.test(userMessage);

    let language = "english";
    if (isHindi) language = "hindi";
    if (isTamil) language = "tamil";
    if (isMarathi) language = "marathi";
    if (isBengali) language = "bengali";

    // Check for nearest centers query
    if (
      userMessage.toLowerCase().includes("nearest") ||
      userMessage.includes("नजदीकी") ||
      userMessage.includes("அருகிலுள்ள") ||
      userMessage.includes("जवळचे") ||
      userMessage.includes("নিকটতম")
    ) {
      if (language === "hindi") {
        return `${t("ChatBot.nearestCentersHindi")}\n\n${nearestCenters
          .map(
            (center, index) =>
              `${index + 1}. ${center.name}\n📍 ${center.location}\n📞 ${
                center.contact
              }\n📏 ${center.distance.toFixed(1)} km ${t("ChatBot.away")}`
          )
          .join("\n\n")}\n\n${t("ChatBot.moreInfoQuestionHindi")}`;
      } else if (language === "tamil") {
        return `${t("ChatBot.nearestCentersTamil")}\n\n${nearestCenters
          .map(
            (center, index) =>
              `${index + 1}. ${center.name}\n📍 ${center.location}\n📞 ${
                center.contact
              }\n📏 ${center.distance.toFixed(1)} km ${t("ChatBot.away")}`
          )
          .join("\n\n")}\n\n${t("ChatBot.moreInfoQuestionTamil")}`;
      } else if (language === "marathi") {
        return `${t("ChatBot.nearestCentersMarathi")}\n\n${nearestCenters
          .map(
            (center, index) =>
              `${index + 1}. ${center.name}\n📍 ${center.location}\n📞 ${
                center.contact
              }\n📏 ${center.distance.toFixed(1)} km ${t("ChatBot.away")}`
          )
          .join("\n\n")}\n\n${t("ChatBot.moreInfoQuestionMarathi")}`;
      } else {
        return `${t("ChatBot.nearestCentersEnglish")}\n\n${nearestCenters
          .map(
            (center, index) =>
              `${index + 1}. ${center.name}\n📍 ${center.location}\n📞 ${
                center.contact
              }\n📏 ${center.distance.toFixed(1)} km ${t("ChatBot.away")}`
          )
          .join("\n\n")}\n\n${t("ChatBot.moreInfoQuestionEnglish")}`;
      }
    }

    // Default responses based on language
    const responses = {
      english: t("ChatBot.welcomeEnglish"),
      hindi: t("ChatBot.welcomeHindi"),
      tamil: t("ChatBot.welcomeTamil"),
      marathi: t("ChatBot.welcomeMarathi"),
      bengali: t("ChatBot.welcomeBengali"),
    };

    return responses[language] || responses.english;
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = { text: inputMessage, isBot: false };
      setMessages((prev) => [...prev, newMessage]);
      setInputMessage("");
      processMessage(inputMessage);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCenterClick = (center) => {
    onCenterSelect(center);
    setIsOpen(false);
  };

  return (
    <>
      {/* Chat Bot Icon */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-emerald-500 hover:bg-emerald-600 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bot className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl ring-1 ring-slate-900/5 dark:ring-slate-100/10 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-emerald-500 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5" />
                  <h3 className="font-semibold">{t("ChatBot.headerTitle")}</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-emerald-600 rounded-full p-1 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-emerald-100 text-sm mt-1">
                {t("ChatBot.headerSubtitle")}
              </p>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                  <Bot className="w-8 h-8 mx-auto mb-2" />
                  <p>{t("ChatBot.welcomeMessage")}</p>
                  <p className="text-sm">{t("ChatBot.tryExample")}</p>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.isBot ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 ${
                      message.isBot
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                        : "bg-emerald-500 text-white"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.text}
                    </p>

                    {/* Show centers if available */}
                    {message.centers &&
                      message.centers.map((center, centerIndex) => (
                        <div
                          key={centerIndex}
                          className="mt-2 p-2 bg-white dark:bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                          onClick={() => handleCenterClick(center)}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-sm">
                                {center.name}
                              </p>
                              <p className="text-xs text-slate-600 dark:text-slate-300">
                                {center.location}
                              </p>
                              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                                {center.distance.toFixed(1)} km{" "}
                                {t("ChatBot.away")}
                              </p>
                            </div>
                            <MapPin className="w-3 h-3 text-emerald-500 mt-1 flex-shrink-0" />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t("ChatBot.inputPlaceholder")}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
                  />
                </div>
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`p-2 rounded-full transition-colors ${
                    isListening
                      ? "bg-red-500 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
                  }`}
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="p-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2">
                {t("ChatBot.supportedLanguages")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default function AshaCentersMap() {
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { messages } = useLanguage();

  // Translation function
  const t = (key) => {
    const keys = key.split(".");
    let value = messages;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

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
        center: { lat: 23.5937, lng: 78.9629 },
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

        const newMarkers = ASHA_CENTERS.map((center) => {
          const marker = new window.google.maps.Marker({
            position: center.coordinates,
            map: newMap,
            title: center.name,
            icon: {
              url:
                "data:image/svg+xml;base64," +
                btoa(`
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

  const handleCenterSelect = (center) => {
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
    <div className="relative bg-slate-50 dark:bg-slate-950 max-h-0">  
      <ChatBot centers={ASHA_CENTERS} onCenterSelect={handleCenterSelect} />
    </div>
  );
}
