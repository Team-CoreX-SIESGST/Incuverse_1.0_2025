"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle } from "lucide-react";

// Mock form data - in a real app, this would come from your database
const mockFormData = {
  1: {
    id: 1,
    title: "Community Health Survey - Recent Diseases",
    description:
      "Help ASHA workers track recent health issues in the community. This survey helps us understand what diseases people are facing and provide better healthcare support.",
    fields: [
      {
        id: 1,
        type: "text",
        question: "Patient Name",
        required: true,
      },
      {
        id: 2,
        type: "text",
        question: "Age",
        required: true,
      },
      {
        id: 3,
        type: "radio",
        question: "Gender",
        options: ["Male", "Female", "Other"],
        required: true,
      },
      {
        id: 4,
        type: "text",
        question: "Contact Number",
        required: false,
      },
      {
        id: 5,
        type: "textarea",
        question: "Address",
        required: true,
      },
      {
        id: 6,
        type: "checkbox",
        question:
          "What symptoms have you observed recently? (Select all that apply)",
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
        required: true,
      },
      {
        id: 7,
        type: "checkbox",
        question: "Suspected Diseases (Select all that apply)",
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
        required: false,
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
        required: true,
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
        required: true,
      },
      {
        id: 10,
        type: "textarea",
        question: "Additional Notes or Observations",
        required: false,
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
        required: true,
      },
      {
        id: 12,
        type: "textarea",
        question: "Any medication currently being taken?",
        required: false,
      },
    ],
  },
  2: {
    id: 2,
    title: "Maternal Care Follow-up",
    description: "Follow-up form for pregnant women in the community",
    fields: [
      {
        id: 1,
        type: "text",
        question: "Mother's Name",
        required: true,
      },
      {
        id: 2,
        type: "text",
        question: "Weeks of Pregnancy",
        required: true,
      },
      // ... other fields
    ],
  },
};

export default function FormSubmission() {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const formData = mockFormData[params.id];
      setForm(formData);
      setIsLoading(false);

      // Initialize responses
      if (formData) {
        const initialResponses = {};
        formData.fields.forEach((field) => {
          if (field.type === "checkbox") {
            initialResponses[field.id] = [];
          } else {
            initialResponses[field.id] = "";
          }
        });
        setResponses(initialResponses);
      }
    }, 500);
  }, [params.id]);

  const handleInputChange = (fieldId, value) => {
    setResponses((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleCheckboxChange = (fieldId, option) => {
    setResponses((prev) => {
      const currentValues = prev[fieldId] || [];
      if (currentValues.includes(option)) {
        return {
          ...prev,
          [fieldId]: currentValues.filter((item) => item !== option),
        };
      } else {
        return {
          ...prev,
          [fieldId]: [...currentValues, option],
        };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Form submitted:", responses);
    setIsSubmitted(true);

    // In a real app, you would send this to your backend
    // await fetch('/api/responses', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     formId: form.id,
    //     responses: responses,
    //     submittedAt: new Date().toISOString()
    //   })
    // });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Loading form...
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

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Thank You!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Your response has been recorded successfully. This information will
            help ASHA workers provide better healthcare support to the
            community.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Submit Another Response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Forms
          </button>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {form.title}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {form.description}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {form.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {field.question}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>

                  {field.type === "text" && (
                    <input
                      type="text"
                      required={field.required}
                      value={responses[field.id] || ""}
                      onChange={(e) =>
                        handleInputChange(field.id, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  )}

                  {field.type === "textarea" && (
                    <textarea
                      required={field.required}
                      value={responses[field.id] || ""}
                      onChange={(e) =>
                        handleInputChange(field.id, e.target.value)
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  )}

                  {field.type === "radio" && (
                    <div className="space-y-2">
                      {field.options.map((option, index) => (
                        <label
                          key={index}
                          className="flex items-center space-x-3"
                        >
                          <input
                            type="radio"
                            name={`field-${field.id}`}
                            value={option}
                            required={field.required}
                            checked={responses[field.id] === option}
                            onChange={(e) =>
                              handleInputChange(field.id, e.target.value)
                            }
                            className="text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-slate-700 dark:text-slate-300">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                  {field.type === "checkbox" && (
                    <div className="space-y-2">
                      {field.options.map((option, index) => (
                        <label
                          key={index}
                          className="flex items-center space-x-3"
                        >
                          <input
                            type="checkbox"
                            value={option}
                            checked={(responses[field.id] || []).includes(
                              option
                            )}
                            onChange={() =>
                              handleCheckboxChange(field.id, option)
                            }
                            className="text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-slate-700 dark:text-slate-300">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                  {field.type === "date" && (
                    <input
                      type="date"
                      required={field.required}
                      value={responses[field.id] || ""}
                      onChange={(e) =>
                        handleInputChange(field.id, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Submit Response
              </button>
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-3">
                This information will be shared with ASHA workers to improve
                community healthcare services.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
