import { motion } from "framer-motion";
import { Activity, Sparkles, Shield, Heart, Zap, Calendar } from "lucide-react";
import { useState } from "react";

export default function LifestyleTab({ lifestyleData, isLoading, onGenerate }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [userProfile, setUserProfile] = useState({
    age: "",
    gender: "",
    height_cm: "",
    weight_kg: "",
    activity_level: 1,
    symptoms: [],
    conditions: [],
    symptom_severity: 0,
  });

  const activityLevels = [
    { value: 0, label: "Sedentary (Little to no exercise)", icon: "🛋️" },
    { value: 1, label: "Moderate (Light exercise 1-3 days/week)", icon: "🚶" },
    { value: 2, label: "Active (Exercise 3+ days/week)", icon: "🏃" },
  ];

  const severityLevels = [
    { value: 0, label: "Mild", color: "#10B981" },
    { value: 1, label: "Moderate", color: "#F59E0B" },
    { value: 2, label: "Severe", color: "#EF4444" },
  ];

  const commonSymptoms = [
    "Fatigue",
    "Headache",
    "Back Pain",
    "Anxiety",
    "Sleep Issues",
    "Digestive Issues",
    "Joint Pain",
    "Stress",
    "Dizziness",
    "Chest Pain",
  ];

  const commonConditions = [
    "Hypertension",
    "Diabetes",
    "Heart Disease",
    "Obesity",
    "Arthritis",
    "Asthma",
    "Depression",
    "Anxiety Disorder",
    "High Cholesterol",
    "Osteoporosis",
  ];

  const handleInputChange = (field, value) => {
    setUserProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayToggle = (field, item) => {
    setUserProfile((prev) => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter((i) => i !== item)
        : [...prev[field], item],
    }));
  };

  const calculateBMI = () => {
    const { height_cm, weight_kg } = userProfile;
    if (height_cm && weight_kg) {
      const heightM = height_cm / 100;
      const bmi = weight_kg / (heightM * heightM);
      return bmi.toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: "Underweight", color: "#3B82F6" };
    if (bmi < 25) return { category: "Normal", color: "#10B981" };
    if (bmi < 30) return { category: "Overweight", color: "#F59E0B" };
    return { category: "Obese", color: "#EF4444" };
  };

  const handleGenerate = () => {
    onGenerate(userProfile);
  };

  const resetForm = () => {
    setUserProfile({
      age: "",
      gender: "",
      height_cm: "",
      weight_kg: "",
      activity_level: 1,
      symptoms: [],
      conditions: [],
      symptom_severity: 0,
    });
    setCurrentStep(1);
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
        <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm mr-3">
          1
        </span>
        Basic Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Age *
          </label>
          <input
            type="number"
            value={userProfile.age}
            onChange={(e) => handleInputChange("age", e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-800 dark:text-white transition-colors"
            placeholder="Enter your age"
            min="1"
            max="120"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Gender *
          </label>
          <select
            value={userProfile.gender}
            onChange={(e) => handleInputChange("gender", e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-800 dark:text-white transition-colors"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Height (cm)
          </label>
          <input
            type="number"
            value={userProfile.height_cm}
            onChange={(e) => handleInputChange("height_cm", e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-800 dark:text-white transition-colors"
            placeholder="e.g., 170"
            min="50"
            max="250"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Weight (kg)
          </label>
          <input
            type="number"
            value={userProfile.weight_kg}
            onChange={(e) => handleInputChange("weight_kg", e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-800 dark:text-white transition-colors"
            placeholder="e.g., 70"
            min="20"
            max="300"
          />
        </div>
      </div>

      {userProfile.height_cm && userProfile.weight_kg && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
          <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
            BMI Calculator
          </h4>
          {(() => {
            const bmi = calculateBMI();
            const bmiInfo = getBMICategory(parseFloat(bmi));
            return (
              <div className="flex items-center space-x-3">
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  BMI: {bmi}
                </span>
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: `${bmiInfo.color}20`,
                    color: bmiInfo.color,
                  }}
                >
                  {bmiInfo.category}
                </span>
              </div>
            );
          })()}
        </div>
      )}
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
        <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm mr-3">
          2
        </span>
        Activity & Health Status
      </h3>

      <div className="space-y-4">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Activity Level
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {activityLevels.map((level) => (
            <label
              key={level.value}
              className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                userProfile.activity_level === level.value
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                  : "border-slate-300 dark:border-slate-700 hover:border-emerald-500/50"
              }`}
            >
              <input
                type="radio"
                name="activity_level"
                value={level.value}
                checked={userProfile.activity_level === level.value}
                onChange={(e) =>
                  handleInputChange("activity_level", parseInt(e.target.value))
                }
                className="sr-only"
              />
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{level.icon}</span>
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {level.label}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Current Symptoms
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {commonSymptoms.map((symptom) => (
            <label
              key={symptom}
              className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${
                userProfile.symptoms.includes(symptom)
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                  : "border-slate-300 dark:border-slate-700 hover:border-emerald-500/50"
              }`}
            >
              <input
                type="checkbox"
                checked={userProfile.symptoms.includes(symptom)}
                onChange={() => handleArrayToggle("symptoms", symptom)}
                className="sr-only"
              />
              <span className="text-sm">{symptom}</span>
            </label>
          ))}
        </div>
      </div>

      {userProfile.symptoms.length > 0 && (
        <div className="space-y-4">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Overall Symptom Severity
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {severityLevels.map((level) => (
              <label
                key={level.value}
                className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  userProfile.symptom_severity === level.value
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                    : "border-slate-300 dark:border-slate-700 hover:border-emerald-500/50"
                }`}
              >
                <input
                  type="radio"
                  name="symptom_severity"
                  value={level.value}
                  checked={userProfile.symptom_severity === level.value}
                  onChange={(e) =>
                    handleInputChange(
                      "symptom_severity",
                      parseInt(e.target.value)
                    )
                  }
                  className="sr-only"
                />
                <div className="flex items-center space-x-3">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: level.color }}
                  ></span>
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {level.label}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
        <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm mr-3">
          3
        </span>
        Medical Conditions
      </h3>

      <div className="space-y-4">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Pre-existing Conditions
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {commonConditions.map((condition) => (
            <label
              key={condition}
              className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${
                userProfile.conditions.includes(condition)
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                  : "border-slate-300 dark:border-slate-700 hover:border-emerald-500/50"
              }`}
            >
              <input
                type="checkbox"
                checked={userProfile.conditions.includes(condition)}
                onChange={() => handleArrayToggle("conditions", condition)}
                className="sr-only"
              />
              <span className="text-sm">{condition}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6">
        <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
          Profile Summary
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Age:</strong> {userProfile.age || "Not provided"}
          </div>
          <div>
            <strong>Gender:</strong> {userProfile.gender || "Not provided"}
          </div>
          <div>
            <strong>Activity Level:</strong>{" "}
            {
              activityLevels.find((l) => l.value === userProfile.activity_level)
                ?.label
            }
          </div>
          <div>
            <strong>Symptoms:</strong>{" "}
            {userProfile.symptoms.length > 0
              ? userProfile.symptoms.join(", ")
              : "None"}
          </div>
          <div>
            <strong>Conditions:</strong>{" "}
            {userProfile.conditions.length > 0
              ? userProfile.conditions.join(", ")
              : "None"}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const canProceed = () => {
    if (currentStep === 1) {
      return userProfile.age && userProfile.gender;
    }
    return true;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 ring-1 ring-slate-900/10 dark:ring-slate-100/10 shadow-lg">
      <TabHeader
        icon={Activity}
        title="Lifestyle Recommendations"
        description="Personalized health and wellness tips"
      />

      {!lifestyleData ? (
        <div className="space-y-8">
          {/* Step Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      currentStep >= step
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-slate-300 dark:border-slate-700 text-slate-500"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-12 h-1 mx-2 transition-all ${
                        currentStep > step
                          ? "bg-emerald-500"
                          : "bg-slate-300 dark:bg-slate-700"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                currentStep === 1
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
              }`}
            >
              ← Previous
            </button>

            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                disabled={!canProceed()}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  !canProceed()
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg shadow-emerald-500/25"
                }`}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className={`px-8 py-3 rounded-xl font-semibold transition-all flex items-center space-x-2 ${
                  isLoading
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg shadow-emerald-500/25"
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Recommendations</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      ) : (
        <LifestyleResults lifestyleData={lifestyleData} onReset={resetForm} />
      )}
    </div>
  );
}

function TabHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-center mb-8">
      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-md mr-4">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {title}
        </h2>
        <p className="text-slate-600 dark:text-slate-400">{description}</p>
      </div>
    </div>
  );
}

function LifestyleResults({ lifestyleData, onReset }) {
  const getPriorityStyles = (level) => {
    switch (level) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 border-red-200 dark:border-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 border-green-200 dark:border-green-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div
        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getPriorityStyles(
          lifestyleData.priority_level
        )}`}
      >
        <Shield className="w-4 h-4 mr-2" />
        {lifestyleData.priority_level?.toUpperCase()} PRIORITY •{" "}
        {Math.round(lifestyleData.confidence * 100)}% Confidence
      </div>

      <RecommendationSection
        title="General Health Guidelines"
        icon={Heart}
        recommendations={lifestyleData.general_recommendations}
        color="blue"
      />

      {lifestyleData.specific_recommendations?.length > 0 && (
        <RecommendationSection
          title="Targeted Recommendations"
          icon={Zap}
          recommendations={lifestyleData.specific_recommendations}
          color="emerald"
        />
      )}

      {lifestyleData.age_specific?.length > 0 && (
        <RecommendationSection
          title="Age-Specific Recommendations"
          icon={Calendar}
          recommendations={lifestyleData.age_specific}
          color="purple"
        />
      )}

      <div className="flex justify-center space-x-4 pt-6 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={onReset}
          className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          Start Over
        </button>
      </div>
    </motion.div>
  );
}

function RecommendationSection({ title, icon: Icon, recommendations, color }) {
  const colorClasses = {
    blue: "from-blue-500 to-cyan-500",
    emerald: "from-emerald-500 to-green-500",
    purple: "from-purple-500 to-indigo-500",
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6">
      <div className="flex items-center mb-4">
        <div
          className={`w-10 h-10 rounded-lg bg-gradient-to-r ${colorClasses[color]} flex items-center justify-center shadow-md mr-3`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>
      </div>
      <ul className="space-y-3">
        {recommendations?.map((rec, idx) => (
          <li
            key={idx}
            className="flex items-start text-slate-700 dark:text-slate-300"
          >
            <div
              className={`w-2 h-2 rounded-full bg-gradient-to-r ${colorClasses[color]} mt-2 mr-3 flex-shrink-0`}
            />
            <span className="text-sm leading-relaxed">{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
