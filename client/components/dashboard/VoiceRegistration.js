"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Play, Square } from "lucide-react";
import {
  getPatients,
  getPatient,
  deletePatient,
  updatePatient,
  createPatient,
} from "@/services/patients/patientsServices";

export function VoiceRegistration() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const recognitionRef = useRef(null);

  const questions = [
    "What is the patient's full name?",
    "What is the patient's age?",
    "What is the patient's Aadhar number?",
    "What is the patient's phone number?",
    "What is the patient's gender?",
    "What is the patient's married status?",
    "What health issue is the patient facing?",
    "What is the patient's address?",
    "Do you have an emergency contact number?",
    "What is the patient's blood group?",
  ];

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
  }, [currentQuestion]);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
      setTranscript("");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleVoiceResponse = (response) => {
    const fieldName = fieldMapping[currentQuestion];
    if (fieldName) {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: response,
      }));
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setTranscript("");
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setTranscript("");
    }
  };

  const submitForm = async () => {
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      // const response = await fetch("/api/patients", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(formData),
      // });
      const response = await createPatient(formData);
      const result = response.data;

      if (result) {
        setMessage("Patient registered successfully!");
        setFormData({});
        setCurrentQuestion(0);
      } else {
        setMessage(result.message || "Registration failed");
      }
    } catch (error) {
      setMessage("Error registering patient");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <Mic className="w-8 h-8 text-emerald-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Voice Patient Registration
          </h2>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.includes("success")
                ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300"
            }`}
          >
            {message}
          </div>
        )}

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Progress</span>
            <span>
              {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Current Question */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {questions[currentQuestion]}
          </h3>

          {/* Voice Controls */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            {!isListening ? (
              <button
                onClick={startListening}
                className="flex items-center px-6 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
              >
                <Mic className="w-5 h-5 mr-2" />
                Start Speaking
              </button>
            ) : (
              <button
                onClick={stopListening}
                className="flex items-center px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                <Square className="w-5 h-5 mr-2" />
                Stop
              </button>
            )}
          </div>

          {/* Transcript */}
          {transcript && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>You said:</strong> {transcript}
              </p>
            </div>
          )}

          {/* Current Answer Display */}
          {formData[fieldMapping[currentQuestion]] && (
            <div className="mt-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
              <p className="text-emerald-700 dark:text-emerald-300">
                <strong>Saved answer:</strong>{" "}
                {formData[fieldMapping[currentQuestion]]}
              </p>
            </div>
          )}
        </div>

        {/* Form Preview */}
        {Object.keys(formData).length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Form Preview
            </h4>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="flex">
                  <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {key}:
                  </span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentQuestion < questions.length - 1 ? (
            <button
              onClick={nextQuestion}
              className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              Next Question
            </button>
          ) : (
            <button
              onClick={submitForm}
              disabled={loading || Object.keys(formData).length === 0}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Complete Registration"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
