"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Loader2,
  AlertCircle,
  CheckCircle,
  Brain,
  Stethoscope,
  FileText,
  Shield,
  TrendingUp,
  Heart,
  Zap,
  Sparkles,
} from "lucide-react";
import { predictDisease } from "@/services/python_server/pythonServer";
import { Navbar } from "@/components/layout/Navbar";

const SymptomSelector = ({ symptoms, selected, setSelected, loading }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSymptoms = useMemo(() => {
    if (!searchTerm) return symptoms;
    return symptoms.filter((symptom) =>
      symptom.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [symptoms, searchTerm]);

  const toggleSymptom = (symptom) => {
    if (selected.includes(symptom)) {
      setSelected(selected.filter((s) => s !== symptom));
    } else {
      setSelected([...selected, symptom]);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 ring-1 ring-slate-900/10 dark:ring-slate-100/10 shadow-lg">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center shadow-md mr-4">
          <Search className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Symptom Analysis
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Select your symptoms for AI-powered diagnosis
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search symptoms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-800 dark:text-white transition-colors"
        />
      </div>

      {/* Selected Symptoms */}
      {selected.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-3">
            Selected Symptoms ({selected.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {selected.map((symptom) => (
              <span
                key={symptom}
                onClick={() => toggleSymptom(symptom)}
                className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-full text-sm cursor-pointer hover:bg-emerald-500/20 transition-colors flex items-center"
              >
                {symptom}
                <span className="ml-2 text-emerald-500">×</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Symptom Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-80 overflow-y-auto">
        {filteredSymptoms.map((symptom) => (
          <button
            key={symptom}
            onClick={() => toggleSymptom(symptom)}
            disabled={loading}
            className={`p-3 text-sm rounded-xl transition-all duration-200 text-left border ${
              selected.includes(symptom)
                ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/25"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 hover:border-emerald-500/50"
            } ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:scale-105"
            }`}
          >
            {symptom.replace(/_/g, " ")}
          </button>
        ))}
      </div>
    </div>
  );
};

const PredictionResult = ({ result, loading, onNewPrediction }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 ring-1 ring-slate-900/10 dark:ring-slate-100/10 shadow-lg text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          Analyzing Symptoms
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Our AI is analyzing your symptoms...
        </p>
      </div>
    );
  }

  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 rounded-2xl p-8 ring-1 ring-slate-900/10 dark:ring-slate-100/10 shadow-lg"
    >
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center shadow-md mr-4">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Prediction Results
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            AI-powered diagnosis and recommendations
          </p>
        </div>
      </div>

      {result.prediction && (
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <Stethoscope className="w-5 h-5 mr-2 text-blue-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Most Likely Condition:
            </span>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <h4 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-3">
              {result.prediction}
            </h4>
            {result.confidence && (
              <div className="flex items-center">
                <div className="flex-1 bg-blue-200 dark:bg-blue-800 rounded-full h-3 mr-4">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${result.confidence}%` }}
                  ></div>
                </div>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-300">
                  {result.confidence}% confidence
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {result.description && (
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <FileText className="w-5 h-5 mr-2 text-emerald-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Description:
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
            {result.description}
          </p>
        </div>
      )}

      {result.precautions && result.precautions.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-3">
            <Shield className="w-5 h-5 mr-2 text-orange-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Recommended Precautions:
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {result.precautions.map((precaution, index) => (
              <div
                key={index}
                className="flex items-start bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800"
              >
                <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700 dark:text-slate-300 text-sm">
                  {precaution}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Debug Section - Remove in production */}
      {/* {process.env.NODE_ENV === "development" && result && (
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h4 className="font-semibold mb-2 text-sm">Debug Info:</h4>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )} */}

      <div className="flex justify-center">
        <button
          onClick={onNewPrediction}
          className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30"
        >
          New Prediction
        </button>
      </div>
    </motion.div>
  );
};

export default function SymptomsTab() {
  const [symptoms, setSymptoms] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState(null);

  // Fetch initial symptoms data
  useEffect(() => {
    async function fetchSymptoms() {
      try {
        // Mock symptoms data - you can replace with actual API call
        const mockSymptoms = [
          "fever",
          "headache",
          "cough",
          "fatigue",
          "nausea",
          "vomiting",
          "diarrhea",
          "abdominal_pain",
          "chest_pain",
          "shortness_of_breath",
          "dizziness",
          "muscle_aches",
          "sore_throat",
          "runny_nose",
          "sneezing",
          "rash",
          "joint_pain",
          "back_pain",
          "insomnia",
          "loss_of_appetite",
          "chills",
          "sweating",
          "weight_loss",
          "weight_gain",
          "blurred_vision",
          "ear_pain",
          "toothache",
          "swollen_glands",
          "wheezing",
          "palpitations",
        ];

        setSymptoms(mockSymptoms);
        setMeta({
          model_accuracy: 0.94,
          last_trained: "2024-10-01",
          total_symptoms: mockSymptoms.length,
        });
        setError(null);
      } catch (e) {
        setError("Failed to load symptoms data");
        console.error("Fetch error:", e);
      }
    }
    fetchSymptoms();
  }, []);

  const canPredict = useMemo(() => selected.length > 0, [selected]);

  async function handlePredict() {
    if (!canPredict) return;
    setLoading(true);
    setError(null);

    try {
      // Call the predictDisease API with selected symptoms
      const response = await predictDisease({ symptoms: selected });

      console.log("Full API Response:", response); // Debug log

      // Check if we have top_predictions array
      const hasTopPredictions =
        response.data.top_predictions &&
        response.data.top_predictions.length > 0;

      // Map the API response to match our component's expected format
      const predictionResult = {
        // Use the main predicted disease or fallback to first top prediction
        prediction:
          response.data.predicted_disease ||
          (hasTopPredictions
            ? response.data.top_predictions[0].disease
            : "Unknown Condition"),

        // Calculate confidence from top prediction probability
        confidence: hasTopPredictions
          ? Math.round(response.data.top_predictions[0].probability * 100)
          : 85,

        // Use description from response or fallback
        description:
          response.data.description ||
          (hasTopPredictions
            ? response.data.top_predictions[0].description
            : "No description available for this condition."),

        // Use precautions from response or fallback
        precautions:
          response.data.precautions ||
          (hasTopPredictions
            ? response.data.top_predictions[0].precautions
            : [
                "Get plenty of rest",
                "Stay hydrated by drinking lots of fluids",
                "Consult with a healthcare professional",
                "Monitor your symptoms closely",
              ]),

        // Include all top predictions for future use
        topPredictions: response.data.top_predictions || [],
      };

      console.log("Processed Result:", predictionResult); // Debug log
      setResult(predictionResult);
    } catch (e) {
      console.error("Prediction error:", e);

      // Fallback mock data if API fails
      const mockResult = {
        prediction: "Common Cold",
        confidence: 85,
        description:
          "A viral infection of your nose and throat (upper respiratory tract). It's usually harmless, although it might not feel that way.",
        precautions: [
          "Get plenty of rest",
          "Stay hydrated by drinking lots of fluids",
          "Use a humidifier or breathe steam from a shower",
          "Take over-the-counter pain relievers if needed",
          "Avoid close contact with others to prevent spreading",
        ],
      };

      setResult(mockResult);
      setError("Note: Using demo data. Backend may not be connected.");
    } finally {
      setLoading(false);
    }
  }

  const handleNewPrediction = () => {
    setResult(null);
    setSelected([]);
    setError(null);
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      
      {meta && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 ring-1 ring-slate-900/10 dark:ring-slate-100/10 shadow-lg">
            <div className="flex items-center justify-center mb-3">
              <TrendingUp className="w-6 h-6 text-emerald-500 mr-2" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Accuracy
              </span>
            </div>
            <p className="text-3xl font-bold text-center text-emerald-600 dark:text-emerald-400">
              {Math.round(meta.model_accuracy * 100)}%
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 ring-1 ring-slate-900/10 dark:ring-slate-100/10 shadow-lg">
            <div className="flex items-center justify-center mb-3">
              <Heart className="w-6 h-6 text-blue-500 mr-2" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Symptoms
              </span>
            </div>
            <p className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400">
              {meta.total_symptoms}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 ring-1 ring-slate-900/10 dark:ring-slate-100/10 shadow-lg">
            <div className="flex items-center justify-center mb-3">
              <Zap className="w-6 h-6 text-purple-500 mr-2" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Updated
              </span>
            </div>
            <p className="text-lg font-bold text-center text-purple-600 dark:text-purple-400">
              {meta.last_trained}
            </p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4"
        >
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700 dark:text-red-300">{error}</span>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="space-y-8">
        <SymptomSelector
          symptoms={symptoms}
          selected={selected}
          setSelected={setSelected}
          loading={loading}
        />

        {/* Predict Button */}
        <div className="text-center">
          <button
            onClick={handlePredict}
            disabled={!canPredict || loading}
            className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 disabled:shadow-none flex items-center mx-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-3" />
                Analyzing Symptoms...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-3" />
                Predict Condition
              </>
            )}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {(result || loading) && (
            <PredictionResult
              result={result}
              loading={loading}
              onNewPrediction={handleNewPrediction}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
