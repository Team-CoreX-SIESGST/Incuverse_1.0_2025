"use client";

import { useState } from "react";
import { User, Camera, QrCode, Plus, Mic, FileText, List } from "lucide-react";
import {
  getPatients,
  getPatient,
  deletePatient,
  updatePatient,
  createPatient,
} from "@/services/patients/patientsServices";

export function ManualRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    aadhar: "",
    issue: "",
    phone: "",
    gender: "",
    marriedStatus: "",
    address: "",
    emergencyContact: "",
    bloodGroup: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key]);
      });

      if (profileImage) {
        submitData.append("profileImage", profileImage);
      }

      const response = await createPatient(submitData);
      const result = response.data;

      if (result) {
        setMessage("Patient registered successfully!");
        setFormData({
          name: "",
          age: "",
          aadhar: "",
          issue: "",
          phone: "",
          gender: "",
          marriedStatus: "",
          address: "",
          emergencyContact: "",
          bloodGroup: "",
        });
        setProfileImage(null);
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
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg rounded-2xl shadow-xl ring-1 ring-slate-900/10 dark:ring-slate-100/10 p-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg mr-4">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Manual Patient Registration
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Register patients with detailed information
            </p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-8 p-4 rounded-xl backdrop-blur-lg ${
              message.includes("success")
                ? "bg-green-50/80 dark:bg-green-900/20 text-green-800 dark:text-green-300 ring-1 ring-green-200 dark:ring-green-800"
                : "bg-red-50/80 dark:bg-red-900/20 text-red-800 dark:text-red-300 ring-1 ring-red-200 dark:ring-red-800"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Image Upload */}
          <div className="flex items-center space-x-6 p-6 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl ring-1 ring-slate-900/5 dark:ring-slate-100/10">
            <div className="shrink-0">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center ring-2 ring-white dark:ring-slate-800 shadow-lg">
                {profileImage ? (
                  <img
                    className="w-24 h-24 rounded-full object-cover"
                    src={URL.createObjectURL(profileImage)}
                    alt="Profile"
                  />
                ) : (
                  <Camera className="w-8 h-8 text-slate-400" />
                )}
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Profile Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-emerald-900/30 dark:file:text-emerald-300"
              />
            </div>
          </div>

          {/* Personal Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                label: "Full Name *",
                name: "name",
                type: "text",
                required: true,
              },
              {
                label: "Age *",
                name: "age",
                type: "number",
                required: true,
              },
              {
                label: "Aadhar Number *",
                name: "aadhar",
                type: "text",
                pattern: "[0-9]{12}",
                required: true,
              },
              {
                label: "Phone Number *",
                name: "phone",
                type: "tel",
                pattern: "[0-9]{10}",
                required: true,
              },
              {
                label: "Gender *",
                name: "gender",
                type: "select",
                options: ["", "male", "female", "other"],
                required: true,
              },
              {
                label: "Married Status *",
                name: "marriedStatus",
                type: "select",
                options: ["", "single", "married", "divorced", "widowed"],
                required: true,
              },
              {
                label: "Blood Group",
                name: "bloodGroup",
                type: "select",
                options: ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
              },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {field.label}
                </label>
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white backdrop-blur-lg transition-all duration-200"
                  >
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option || `Select ${field.label.replace(" *", "")}`}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    pattern={field.pattern}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white backdrop-blur-lg transition-all duration-200"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Address and Emergency Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white backdrop-blur-lg transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Emergency Contact
              </label>
              <input
                type="tel"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                pattern="[0-9]{10}"
                className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white backdrop-blur-lg transition-all duration-200"
              />
            </div>
          </div>

          {/* Health Issue */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Health Issue/Problem *
            </label>
            <textarea
              name="issue"
              value={formData.issue}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white backdrop-blur-lg transition-all duration-200"
              placeholder="Describe the patient's health issue..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-slate-200 dark:border-slate-700">
            <button
              type="submit"
              disabled={loading}
              className="group inline-flex items-center px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-emerald-600 to-green-600 rounded-full hover:from-emerald-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              {loading ? "Registering Patient..." : "Register Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
