"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, Users, BarChart3 } from "lucide-react";

// Mock responses data
const mockResponses = {
  1: [
    {
      id: 1,
      submittedAt: "2024-01-15 10:30:00",
      responses: {
        1: "Rahul Sharma",
        2: "35",
        3: "Male",
        4: "9876543210",
        5: "MG Road, Bangalore",
        6: ["Fever", "Cough & Cold", "Headache"],
        7: ["COVID-19", "Respiratory Infection"],
        8: "3-7 days",
        9: "Moderate (some difficulty with daily activities)",
        10: "Patient has been isolating at home",
        11: "No, but planning to visit",
        12: "Paracetamol for fever",
      },
    },
    {
      id: 2,
      submittedAt: "2024-01-15 14:20:00",
      responses: {
        1: "Priya Patel",
        2: "28",
        3: "Female",
        4: "9876543211",
        5: "Koramangala, Bangalore",
        6: ["Fever", "Body Aches", "Fatigue/Weakness"],
        7: ["Malaria", "Dengue"],
        8: "1-2 weeks",
        9: "Severe (needs medical attention)",
        10: "High fever persists for 5 days",
        11: "Yes, government hospital",
        12: "Antibiotics prescribed",
      },
    },
    {
      id: 3,
      submittedAt: "2024-01-16 09:15:00",
      responses: {
        1: "Amit Kumar",
        2: "42",
        3: "Male",
        4: "9876543212",
        5: "Whitefield, Bangalore",
        6: ["Diarrhea", "Vomiting", "Loss of Appetite"],
        7: ["Gastrointestinal Issues", "Water-borne Diseases"],
        8: "Less than 3 days",
        9: "Mild (can do daily activities)",
        10: "Ate street food yesterday",
        11: "No, not yet",
        12: "ORS solution",
      },
    },
  ],
  2: [
    {
      id: 1,
      submittedAt: "2024-01-14 11:00:00",
      responses: {
        1: "Anita Desai",
        2: "26 weeks",
        3: "Normal",
        4: "Yes",
        5: "All normal",
      },
    },
  ],
};

// Mock form structure for analysis
const mockFormStructure = {
  1: {
    id: 1,
    title: "Community Health Survey - Recent Diseases",
    description:
      "Help ASHA workers track recent health issues in the community",
    fields: [
      { id: 1, type: "text", question: "Patient Name" },
      { id: 2, type: "text", question: "Age" },
      {
        id: 3,
        type: "radio",
        question: "Gender",
        options: ["Male", "Female", "Other"],
      },
      { id: 4, type: "text", question: "Contact Number" },
      { id: 5, type: "textarea", question: "Address" },
      {
        id: 6,
        type: "checkbox",
        question: "What symptoms have you observed recently?",
        options: [
          "Fever",
          "Cough & Cold",
          "Difficulty Breathing",
          "Diarrhea",
          "Vomiting",
          "Skin Rashes",
          "Body Aches",
          "Headache",
          "Fatigue/Weakness",
          "Loss of Appetite",
        ],
      },
      {
        id: 7,
        type: "checkbox",
        question: "Suspected Diseases",
        options: [
          "Malaria",
          "Dengue",
          "Typhoid",
          "COVID-19",
          "Respiratory Infection",
          "Gastrointestinal Issues",
          "Skin Infection",
          "Water-borne Diseases",
          "Vector-borne Diseases",
          "Other",
        ],
      },
      {
        id: 8,
        type: "radio",
        question: "Duration of Symptoms",
        options: [
          "Less than 3 days",
          "3-7 days",
          "1-2 weeks",
          "More than 2 weeks",
        ],
      },
      {
        id: 9,
        type: "radio",
        question: "Severity of Condition",
        options: [
          "Mild (can do daily activities)",
          "Moderate (some difficulty with daily activities)",
          "Severe (needs medical attention)",
          "Critical (emergency care needed)",
        ],
      },
      {
        id: 10,
        type: "textarea",
        question: "Additional Notes or Observations",
      },
      {
        id: 11,
        type: "radio",
        question: "Has the patient visited a healthcare facility?",
        options: [
          "Yes, government hospital",
          "Yes, private clinic",
          "Yes, local health center",
          "No, not yet",
          "No, but planning to visit",
        ],
      },
      {
        id: 12,
        type: "textarea",
        question: "Any medication currently being taken?",
      },
    ],
  },
};

export default function FormStats() {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const formData = mockFormStructure[params.id];
      const responseData = mockResponses[params.id] || [];

      setForm(formData);
      setResponses(responseData);

      if (formData && responseData.length > 0) {
        calculateStats(formData, responseData);
      }

      setIsLoading(false);
    }, 1000);
  }, [params.id]);

  const calculateStats = (formData, responseData) => {
    const calculatedStats = {};

    formData.fields.forEach((field) => {
      if (field.type === "radio" || field.type === "checkbox") {
        calculatedStats[field.id] = {
          question: field.question,
          type: field.type,
          options: field.options,
          counts: {},
        };

        // Initialize counts
        field.options.forEach((option) => {
          calculatedStats[field.id].counts[option] = 0;
        });

        // Count responses
        responseData.forEach((response) => {
          const answer = response.responses[field.id];
          if (field.type === "radio") {
            if (
              answer &&
              calculatedStats[field.id].counts[answer] !== undefined
            ) {
              calculatedStats[field.id].counts[answer]++;
            }
          } else if (field.type === "checkbox") {
            if (Array.isArray(answer)) {
              answer.forEach((opt) => {
                if (calculatedStats[field.id].counts[opt] !== undefined) {
                  calculatedStats[field.id].counts[opt]++;
                }
              });
            }
          }
        });
      }
    });

    setStats(calculatedStats);
  };

  const exportToCSV = () => {
    if (!form || responses.length === 0) return;

    const headers = [
      "Submission ID",
      "Submitted At",
      ...form.fields.map((field) => field.question),
    ];
    const csvData = [headers];

    responses.forEach((response) => {
      const row = [
        response.id,
        response.submittedAt,
        ...form.fields.map((field) => {
          const answer = response.responses[field.id];
          if (Array.isArray(answer)) {
            return answer.join("; ");
          }
          return answer || "";
        }),
      ];
      csvData.push(row);
    });

    const csvContent = csvData
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${form.title.replace(/\s+/g, "_")}_responses.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Loading statistics...
          </p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Form Not Found
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            The form you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Forms
          </button>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {form.title}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {form.description}
              </p>
            </div>

            <button
              onClick={exportToCSV}
              disabled={responses.length === 0}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center">
              <Users className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {responses.length}
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-sm">
                Total Responses
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center">
              <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {Object.keys(stats).length}
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-sm">
                Questions Analyzed
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center">
              <div className="w-8 h-8 text-orange-600 mx-auto mb-2 flex items-center justify-center">
                <span className="text-lg font-bold">%</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {responses.length > 0
                  ? Math.round(
                      (Object.keys(stats).length / form.fields.length) * 100
                    )
                  : 0}
                %
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-sm">
                Response Rate
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="space-y-6">
          {Object.keys(stats).map((fieldId) => {
            const fieldStats = stats[fieldId];
            const totalResponses = responses.length;

            return (
              <div
                key={fieldId}
                className="bg-white dark:bg-slate-800 rounded-xl p-6"
              >
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                  {fieldStats.question}
                </h3>

                <div className="space-y-3">
                  {fieldStats.options.map((option) => {
                    const count = fieldStats.counts[option] || 0;
                    const percentage =
                      totalResponses > 0 ? (count / totalResponses) * 100 : 0;

                    return (
                      <div
                        key={option}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">
                          {option}
                        </span>
                        <div className="w-48 bg-slate-200 dark:bg-slate-700 rounded-full h-3 mr-4">
                          <div
                            className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 w-20 text-right">
                          {count} ({Math.round(percentage)}%)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Individual Responses */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Individual Responses ({responses.length})
          </h2>

          <div className="space-y-4">
            {responses.map((response) => (
              <div
                key={response.id}
                className="bg-white dark:bg-slate-800 rounded-xl p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Response #{response.id}
                  </h3>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {response.submittedAt}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {form.fields.map((field) => {
                    const answer = response.responses[field.id];
                    return (
                      <div key={field.id} className="space-y-1">
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {field.question}
                        </div>
                        <div className="text-sm text-slate-900 dark:text-white">
                          {Array.isArray(answer)
                            ? answer.join(", ")
                            : answer || "Not answered"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {responses.length === 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 text-center">
                <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  No Responses Yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Share your form to start collecting responses.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
