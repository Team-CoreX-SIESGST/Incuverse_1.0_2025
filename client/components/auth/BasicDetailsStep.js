"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Calendar, ArrowRight, ArrowLeft } from "lucide-react";
import { verifyEmailOTP } from "@/services/auth/authServices";

const FADE_IN_UP_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function BasicDetailsStep({ onNext, onBack, initialData }) {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    date_of_birth: initialData.date_of_birth || "",
    otp: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.date_of_birth || !formData.otp) {
      setError("All fields are required");
      return;
    }

    // Validate age
    const today = new Date();
    const birthDate = new Date(formData.date_of_birth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 13) {
      setError("You must be at least 13 years old");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await verifyEmailOTP({
        email: initialData.email,
        otp: formData.otp,
        verificationToken: initialData.verificationToken,
        password: initialData.password,
        name: formData.name,
        date_of_birth: formData.date_of_birth,
      });

      if (result?.data) {
        // Store tokens
        localStorage.setItem("access_token", result.data.accessToken);
        localStorage.setItem("refresh_token", result.data.refresh_token);
        localStorage.setItem("user", JSON.stringify(result.data));

        onNext({
          name: formData.name,
          date_of_birth: formData.date_of_birth,
        });
      }
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const minDate = new Date(new Date().getFullYear() - 120, 0, 1)
    .toISOString()
    .split("T")[0];

  return (
    <motion.div variants={FADE_IN_UP_VARIANTS} className="text-center">
      <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-2">
        Basic Details
      </h2>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        Please provide your basic information
      </p>

      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg ring-1 ring-slate-900/10 dark:ring-slate-100/10 rounded-2xl shadow-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2.5 bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-slate-50 rounded-lg ring-1 ring-inset ring-slate-900/10 dark:ring-slate-100/10 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-emerald-500 transition-all duration-200"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="date_of_birth"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Date of Birth
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                required
                value={formData.date_of_birth}
                onChange={handleChange}
                min={minDate}
                max={today}
                className="block w-full pl-10 pr-3 py-2.5 bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-slate-50 rounded-lg ring-1 ring-inset ring-slate-900/10 dark:ring-slate-100/10 focus:ring-2 focus:ring-inset focus:ring-emerald-500 transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              OTP (Check your email)
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              required
              value={formData.otp}
              onChange={handleChange}
              className="block w-full px-3 py-2.5 bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-slate-50 rounded-lg ring-1 ring-inset ring-slate-900/10 dark:ring-slate-100/10 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-emerald-500 transition-all duration-200"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
            />
          </div>

          <div className="flex gap-4">
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
                  Verifying...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
