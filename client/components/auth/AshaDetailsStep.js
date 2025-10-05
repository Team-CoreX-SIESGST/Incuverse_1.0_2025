"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Phone,
  IdCard,
  Briefcase,
  ArrowLeft,
  Check,
} from "lucide-react";

import LocationSearch from "@/components/common/LocationSearch";
import { completeAshaRegistration } from "@/services/auth/authServices";

const FADE_IN_UP_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const QUALIFICATION_OPTIONS = [
  "10th Pass",
  "12th Pass",
  "Graduate",
  "Post Graduate",
  "ANM (Auxiliary Nurse Midwife)",
  "GNM (General Nursing Midwifery)",
  "Other"
];

const LANGUAGE_OPTIONS = [
  "Hindi", "English", "Bengali", "Telugu", "Marathi", "Tamil", "Urdu", 
  "Gujarati", "Kannada", "Odia", "Punjabi", "Malayalam", "Assamese"
];

export default function AshaDetailsStep({ onBack, initialData }) {
  const [formData, setFormData] = useState({
    ashaId: initialData.ashaId || "",
    phone: initialData.phone || "",
    address: initialData.address || {
      street: "",
      city: "",
      state: "",
      pincode: ""
    },
    location: initialData.location || {
      lat: 0,
      lng: 0,
      formattedAddress: ""
    },
    yearsOfExperience: initialData.yearsOfExperience || "",
    qualifications: initialData.qualifications || [],
    languages: initialData.languages || ["Hindi", "English"],
    governmentId: initialData.governmentId || ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (error) setError("");
  };

  const handleLocationSelect = (place) => {
    setFormData(prev => ({
      ...prev,
      location: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        formattedAddress: place.formatted_address
      },
      address: {
        ...prev.address,
        city: place.address_components.find(comp => comp.types.includes('locality'))?.long_name || "",
        state: place.address_components.find(comp => comp.types.includes('administrative_area_level_1'))?.long_name || "",
        pincode: place.address_components.find(comp => comp.types.includes('postal_code'))?.long_name || ""
      }
    }));
  };

  const handleQualificationToggle = (qualification) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.includes(qualification)
        ? prev.qualifications.filter(q => q !== qualification)
        : [...prev.qualifications, qualification]
    }));
  };

  const handleLanguageToggle = (language) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.ashaId || !formData.phone || !formData.governmentId || !formData.yearsOfExperience) {
      setError("Please fill all required fields");
      return;
    }

    if (formData.qualifications.length === 0) {
      setError("Please select at least one qualification");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await completeAshaRegistration(formData);
      
      if (result?.data.status) {
        // Update user data in localStorage
        const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = { ...existingUser, ...result.data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        router.push("/");
      }
      else{
        setError(result.data.message || "Registration failed");
      }
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div variants={FADE_IN_UP_VARIANTS} className="text-center">
      <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-2">
        ASHA Worker Details
      </h2>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        Please provide your ASHA worker information
      </p>

      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg ring-1 ring-slate-900/10 dark:ring-slate-100/10 rounded-2xl shadow-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* ASHA ID */}
          <div>
            <label htmlFor="ashaId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              ASHA ID *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="ashaId"
                name="ashaId"
                type="text"
                required
                value={formData.ashaId}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2.5 bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-slate-50 rounded-lg ring-1 ring-inset ring-slate-900/10 dark:ring-slate-100/10 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-emerald-500 transition-all duration-200"
                placeholder="Enter your ASHA ID"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2.5 bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-slate-50 rounded-lg ring-1 ring-inset ring-slate-900/10 dark:ring-slate-100/10 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-emerald-500 transition-all duration-200"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          {/* Location Search */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Work Location *
            </label>
            <LocationSearch onPlaceSelected={handleLocationSelect} />
            {formData.location.formattedAddress && (
              <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2">
                Selected: {formData.location.formattedAddress}
              </p>
            )}
          </div>

          {/* Address Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="address.city" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                City
              </label>
              <input
                id="address.city"
                name="address.city"
                type="text"
                value={formData.address.city}
                onChange={handleChange}
                className="block w-full px-3 py-2.5 bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-slate-50 rounded-lg ring-1 ring-inset ring-slate-900/10 dark:ring-slate-100/10 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-emerald-500 transition-all duration-200"
                placeholder="City"
              />
            </div>
            <div>
              <label htmlFor="address.pincode" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Pincode
              </label>
              <input
                id="address.pincode"
                name="address.pincode"
                type="text"
                value={formData.address.pincode}
                onChange={handleChange}
                className="block w-full px-3 py-2.5 bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-slate-50 rounded-lg ring-1 ring-inset ring-slate-900/10 dark:ring-slate-100/10 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-emerald-500 transition-all duration-200"
                placeholder="Pincode"
              />
            </div>
          </div>

          {/* Years of Experience */}
          <div>
            <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Years of Experience *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="yearsOfExperience"
                name="yearsOfExperience"
                type="number"
                required
                min="0"
                max="50"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2.5 bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-slate-50 rounded-lg ring-1 ring-inset ring-slate-900/10 dark:ring-slate-100/10 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-emerald-500 transition-all duration-200"
                placeholder="Years of experience"
              />
            </div>
          </div>

          {/* Qualifications */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Qualifications *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {QUALIFICATION_OPTIONS.map(qualification => (
                <button
                  key={qualification}
                  type="button"
                  onClick={() => handleQualificationToggle(qualification)}
                  className={`flex items-center space-x-2 p-3 rounded-lg border transition-all duration-200 ${
                    formData.qualifications.includes(qualification)
                      ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-300"
                      : "bg-slate-50/50 dark:bg-slate-800/40 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-emerald-500"
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                    formData.qualifications.includes(qualification)
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-slate-400"
                  }`}>
                    {formData.qualifications.includes(qualification) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-sm">{qualification}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Languages You Speak *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {LANGUAGE_OPTIONS.map(language => (
                <button
                  key={language}
                  type="button"
                  onClick={() => handleLanguageToggle(language)}
                  className={`flex items-center space-x-2 p-2 rounded-lg border transition-all duration-200 ${
                    formData.languages.includes(language)
                      ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-300"
                      : "bg-slate-50/50 dark:bg-slate-800/40 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-emerald-500"
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                    formData.languages.includes(language)
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-slate-400"
                  }`}>
                    {formData.languages.includes(language) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-sm">{language}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Government ID */}
          <div>
            <label htmlFor="governmentId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Government ID (Aadhar) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="governmentId"
                name="governmentId"
                type="text"
                required
                value={formData.governmentId}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2.5 bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-slate-50 rounded-lg ring-1 ring-inset ring-slate-900/10 dark:ring-slate-100/10 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-emerald-500 transition-all duration-200"
                placeholder="Aadhar number"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 transition-all duration-300 shadow-lg disabled:bg-emerald-400 dark:disabled:bg-emerald-700 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Completing Registration...
                </>
              ) : (
                <>
                  Complete Registration
                  <Check className="w-4 h-4 ml-1.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}