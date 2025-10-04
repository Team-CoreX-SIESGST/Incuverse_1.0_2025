"use client";

import { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Play,
  Square,
  Edit,
  Check,
  X,
  User,
  Calendar,
  IdCard,
  Phone,
  VenusMars,
  Heart,
  MapPin,
  PhoneCall,
  Droplets,
  ArrowRight,
  Clock,
} from "lucide-react";
import { createPatient } from "@/services/patients/patientsServices";

export function VoiceRegistration() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("interview");
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [timeLeft, setTimeLeft] = useState(10);
  const recognitionRef = useRef(null);
  const speechSynthRef = useRef(null);
  const timerRef = useRef(null);

  const questions = [
    "Your full name?",
    "Your age?",
    "Your Aadhar number?",
    "Your phone number?",
    "Your gender? Please say male, female, or other",
    "Your married status? Please say single, married, divorced, or widowed",
    "What health issue are you facing?",
    "Your complete address?",
    "Emergency contact number?",
    "Your blood group? Please say A positive, A negative, B positive, B negative, AB positive, AB negative, O positive, or O negative",
  ];

  const fieldIcons = {
    0: User,
    1: Calendar,
    2: IdCard,
    3: Phone,
    4: VenusMars,
    5: Heart,
    6: User,
    7: MapPin,
    8: PhoneCall,
    9: Droplets,
  };

  const fieldMapping = {
    0: "name",
    1: "age",
    2: "aadhar",
    3: "phone",
    4: "gender",
    5: "marriedStatus",
    6: "issue",
    7: "address",
    8: "emergencyContact",
    9: "bloodGroup",
  };

  const fieldLabels = {
    name: "Full Name",
    age: "Age",
    aadhar: "Aadhar Number",
    phone: "Phone Number",
    gender: "Gender",
    marriedStatus: "Married Status",
    issue: "Health Issue",
    address: "Address",
    emergencyContact: "Emergency Contact",
    bloodGroup: "Blood Group",
  };

  // Enum options for specific fields
  const enumOptions = {
    gender: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" },
    ],
    marriedStatus: [
      { value: "single", label: "Single" },
      { value: "married", label: "Married" },
      { value: "divorced", label: "Divorced" },
      { value: "widowed", label: "Widowed" },
    ],
    bloodGroup: [
      { value: "A+", label: "A Positive" },
      { value: "A-", label: "A Negative" },
      { value: "B+", label: "B Positive" },
      { value: "B-", label: "B Negative" },
      { value: "AB+", label: "AB Positive" },
      { value: "AB-", label: "AB Negative" },
      { value: "O+", label: "O Positive" },
      { value: "O-", label: "O Negative" },
    ],
  };

  // Normalize voice input for enum fields
  const normalizeEnumInput = (field, input) => {
    const inputLower = input.toLowerCase().trim();

    if (field === "gender") {
      if (inputLower.includes("male") && !inputLower.includes("female"))
        return "male";
      if (inputLower.includes("female")) return "female";
      if (inputLower.includes("other")) return "other";
    }

    if (field === "marriedStatus") {
      if (inputLower.includes("single")) return "single";
      if (inputLower.includes("married")) return "married";
      if (inputLower.includes("divorced")) return "divorced";
      if (inputLower.includes("widowed")) return "widowed";
    }

    if (field === "bloodGroup") {
      if (inputLower.includes("a positive") || inputLower === "a+") return "A+";
      if (inputLower.includes("a negative") || inputLower === "a-") return "A-";
      if (inputLower.includes("b positive") || inputLower === "b+") return "B+";
      if (inputLower.includes("b negative") || inputLower === "b-") return "B-";
      if (inputLower.includes("ab positive") || inputLower === "ab+")
        return "AB+";
      if (inputLower.includes("ab negative") || inputLower === "ab-")
        return "AB-";
      if (inputLower.includes("o positive") || inputLower === "o+") return "O+";
      if (inputLower.includes("o negative") || inputLower === "o-") return "O-";
    }

    return input;
  };

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            const finalTranscript = event.results[i][0].transcript;
            setTranscript(finalTranscript);
            handleVoiceResponse(finalTranscript);
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      speechSynthRef.current = window.speechSynthesis;
    }

    return () => {
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (mode === "interview" && !isListening) {
      setTimeLeft(10);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            nextQuestion();
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentQuestion, mode, isListening]);

  const speakQuestion = () => {
    if (!speechSynthRef.current) return;

    speechSynthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(questions[currentQuestion]);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    speechSynthRef.current.speak(utterance);
  };

  useEffect(() => {
    if (mode === "interview") {
      speakQuestion();
    }
  }, [currentQuestion, mode]);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
      setTranscript("");

      // Pause timer while listening
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);

      // Resume timer
      setTimeLeft(10);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            nextQuestion();
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleVoiceResponse = (response) => {
    const fieldName = fieldMapping[currentQuestion];
    if (fieldName) {
      let cleanedResponse = response.trim();

      // Normalize enum fields
      if (["gender", "marriedStatus", "bloodGroup"].includes(fieldName)) {
        cleanedResponse = normalizeEnumInput(fieldName, cleanedResponse);
      }

      setFormData((prev) => ({
        ...prev,
        [fieldName]: cleanedResponse,
      }));

      // Auto proceed to next question after 1 second
      setTimeout(() => {
        nextQuestion();
      }, 1000);
    }
  };

  const nextQuestion = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setTranscript("");
    } else {
      setMode("review");
    }
  };

  const prevQuestion = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setTranscript("");
    }
  };

  const startEdit = (fieldName) => {
    setEditingField(fieldName);
    setEditValue(formData[fieldName] || "");
  };

  const saveEdit = () => {
    if (editingField) {
      setFormData((prev) => ({
        ...prev,
        [editingField]: editValue,
      }));
      setEditingField(null);
      setEditValue("");
    }
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  const submitForm = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await createPatient(formData);

      if (response.data) {
        setMessage("Patient registered successfully!");
        setFormData({});
        setCurrentQuestion(0);
        setMode("interview");
      } else {
        setMessage(response.message || "Registration failed");
      }
    } catch (error) {
      setMessage("Error registering patient. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  const backToInterview = () => {
    setMode("interview");
    setCurrentQuestion(0);
  };

  // Review Mode
  if (mode === "review") {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg rounded-2xl shadow-xl ring-1 ring-slate-900/10 dark:ring-slate-100/10 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-white">
                    Patient Information Review
                  </h2>
                  <p className="text-emerald-100">
                    Review and confirm patient details
                  </p>
                </div>
              </div>
              <div className="text-white/80 text-sm bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                {Object.keys(formData).length} of {questions.length} fields
                completed
              </div>
            </div>
          </div>

          <div className="p-8">
            {message && (
              <div
                className={`mb-6 p-4 rounded-xl backdrop-blur-lg ${
                  message.includes("success")
                    ? "bg-green-50/80 dark:bg-green-900/20 text-green-800 dark:text-green-300 ring-1 ring-green-200 dark:ring-green-800"
                    : "bg-red-50/80 dark:bg-red-900/20 text-red-800 dark:text-red-300 ring-1 ring-red-200 dark:ring-red-800"
                }`}
              >
                {message}
              </div>
            )}

            <div className="mb-6">
              <p className="text-slate-600 dark:text-slate-400">
                Please review your information below. Click the edit button to
                make corrections.
              </p>
            </div>

            {/* Review Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {Object.entries(fieldLabels).map(([field, label]) => {
                const questionIndex =
                  Object.values(fieldMapping).indexOf(field);
                const IconComponent = fieldIcons[questionIndex];
                const value = formData[field] || "Not provided";

                return (
                  <div
                    key={field}
                    className="bg-slate-50/50 dark:bg-slate-800/50 rounded-xl p-6 ring-1 ring-slate-900/5 dark:ring-slate-100/10 hover:ring-slate-900/10 dark:hover:ring-slate-100/20 transition-all duration-300 backdrop-blur-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center mb-3">
                        {IconComponent && (
                          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center mr-3">
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {label}
                        </h3>
                      </div>
                      <button
                        onClick={() => startEdit(field)}
                        className="flex items-center text-sm text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 mr-1.5" />
                        Edit
                      </button>
                    </div>

                    {editingField === field ? (
                      <div className="flex items-center space-x-3 mt-3">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 px-4 py-2 bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white backdrop-blur-lg"
                          autoFocus
                        />
                        <button
                          onClick={saveEdit}
                          className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 bg-green-50 dark:bg-green-900/30 rounded-lg transition-colors"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/30 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-slate-700 dark:text-slate-300 mt-2">
                        {value}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={backToInterview}
                className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium"
              >
                Back to Interview
              </button>
              <div className="flex space-x-4">
                <button
                  onClick={backToInterview}
                  className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium"
                >
                  Add More Details
                </button>
                <button
                  onClick={submitForm}
                  disabled={loading || Object.keys(formData).length === 0}
                  className="group inline-flex items-center px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                >
                  {loading ? "Submitting..." : "Complete Registration"}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Interview Mode
  const CurrentIcon = fieldIcons[currentQuestion];
  const currentField = fieldMapping[currentQuestion];
  const currentValue = formData[currentField] || "";
  const isEnumField = ["gender", "marriedStatus", "bloodGroup"].includes(
    currentField
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg rounded-2xl shadow-xl ring-1 ring-slate-900/10 dark:ring-slate-100/10 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-white">
                  Voice Patient Registration
                </h2>
                <p className="text-emerald-100">
                  Speak your responses clearly for accurate transcription
                </p>
              </div>
            </div>
            <button
              onClick={() => setMode("review")}
              disabled={Object.keys(formData).length === 0}
              className="px-4 py-2 text-sm bg-white/20 text-white rounded-lg hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors backdrop-blur-sm"
            >
              Review Answers
            </button>
          </div>
        </div>

        <div className="p-8">
          {message && (
            <div
              className={`mb-6 p-4 rounded-xl backdrop-blur-lg ${
                message.includes("success")
                  ? "bg-green-50/80 dark:bg-green-900/20 text-green-800 dark:text-green-300 ring-1 ring-green-200 dark:ring-green-800"
                  : "bg-red-50/80 dark:bg-red-900/20 text-red-800 dark:text-red-300 ring-1 ring-red-200 dark:ring-red-800"
              }`}
            >
              {message}
            </div>
          )}

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-3">
              <span>Registration Progress</span>
              <span className="font-medium">
                Question {currentQuestion + 1} of {questions.length}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Timer */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full">
              <Clock className="w-4 h-4 text-slate-600 dark:text-slate-400 mr-2" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Next question in:{" "}
                <span className="text-emerald-600 dark:text-emerald-400">
                  {timeLeft}s
                </span>
              </span>
            </div>
          </div>

          {/* Current Question Card */}
          <div className="bg-slate-50/50 dark:bg-slate-800/50 rounded-xl p-6 mb-6 ring-1 ring-slate-900/5 dark:ring-slate-100/10 backdrop-blur-lg">
            <div className="flex items-start space-x-4">
              {CurrentIcon && (
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center shadow-lg">
                  <CurrentIcon className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {questions[currentQuestion]}
                  </h3>
                  <button
                    onClick={speakQuestion}
                    className="flex items-center px-3 py-1.5 text-sm bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                  >
                    <Play className="w-4 h-4 mr-1.5" />
                    Repeat
                  </button>
                </div>

                {/* Show options for enum fields */}
                {isEnumField && enumOptions[currentField] && (
                  <div className="mb-4 p-4 bg-white/50 dark:bg-slate-700/50 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Available options:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {enumOptions[currentField].map((option, index) => (
                        <span
                          key={option.value}
                          className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm border border-emerald-200 dark:border-emerald-800"
                        >
                          {option.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Voice Controls */}
                <div className="flex items-center justify-center space-x-4 mb-4">
                  {!isListening ? (
                    <button
                      onClick={startListening}
                      className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-full hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                    >
                      <Mic className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      Start Speaking
                    </button>
                  ) : (
                    <button
                      onClick={stopListening}
                      className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full hover:from-red-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium animate-pulse"
                    >
                      <Square className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      Stop Listening
                    </button>
                  )}
                </div>

                {/* Live Transcript */}
                {isListening && (
                  <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800 backdrop-blur-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                        Listening...
                      </span>
                    </div>
                    {transcript && (
                      <p className="text-slate-700 dark:text-slate-300">
                        {transcript}
                      </p>
                    )}
                  </div>
                )}

                {/* Current Answer */}
                {currentValue && !isListening && (
                  <div className="bg-emerald-50/80 dark:bg-emerald-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800 backdrop-blur-lg">
                    <p className="text-emerald-700 dark:text-emerald-300">
                      <strong>Saved response:</strong> {currentValue}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Previous
            </button>

            <div className="text-center">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {currentQuestion + 1} of {questions.length}
              </span>
            </div>

            <button
              onClick={nextQuestion}
              className="group inline-flex items-center px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
            >
              {currentQuestion < questions.length - 1
                ? "Next Question"
                : "Review All Answers"}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
