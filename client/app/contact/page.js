"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Loader2,
  Scale,
  Building,
} from "lucide-react";
import toast from "react-hot-toast";

// Animation variants
const FADE_IN_STAGGER_VARIANTS = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const FADE_IN_UP_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// Reusable input component for consistent styling
const FormInput = (props) => (
  <input
    {...props}
    className="w-full bg-slate-900/50 border-0 rounded-md px-4 py-3 text-slate-300 placeholder-slate-500 ring-1 ring-inset ring-slate-100/10 focus:ring-2 focus:ring-inset focus:ring-emerald-500 transition"
  />
);

const FormTextarea = (props) => (
  <textarea
    {...props}
    className="w-full bg-slate-900/50 border-0 rounded-md px-4 py-3 text-slate-300 placeholder-slate-500 ring-1 ring-inset ring-slate-100/10 focus:ring-2 focus:ring-inset focus:ring-emerald-500 transition"
  />
);

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    firm: "",
    practiceArea: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success(
        "Message sent successfully! Our legal team will contact you soon."
      );
      setFormData({
        name: "",
        email: "",
        firm: "",
        practiceArea: "",
        message: "",
      });
      setLoading(false);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Legal Support",
      content: "support@legalairesearch.com",
    },
    {
      icon: Phone,
      title: "Sales & Demos",
      content: "+1 (555) 123-LEGAL",
    },
    {
      icon: Building,
      title: "Headquarters",
      content: "123 Justice Avenue, Legal District, USA",
    },
  ];

  const practiceAreas = [
    "General Practice",
    "Corporate Law",
    "Criminal Law",
    "Family Law",
    "Intellectual Property",
    "Real Estate",
    "Tax Law",
    "Immigration Law",
    "Other",
  ];

  return (
    <div className="bg-slate-950 text-white">
      <Navbar />
      <main className="relative overflow-hidden py-16 sm:py-20">
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_45rem_at_50%_50%,_theme(colors.emerald.950/40%),_theme(colors.slate.950))]"
          aria-hidden="true"
        />
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN_STAGGER_VARIANTS}
          className="max-w-7xl mx-auto px-6 lg:px-8 space-y-20 sm:space-y-24"
        >
          {/* Hero Section */}
          <motion.div variants={FADE_IN_UP_VARIANTS} className="text-center">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-100/5 ring-1 ring-inset ring-slate-100/10 mb-8 backdrop-blur-lg">
              <Scale className="w-4 h-4 text-emerald-400 mr-2" />
              <span className="text-sm font-medium text-slate-300">
                Legal Support & Demos
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-6">
              Contact Our Legal Team
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto">
              Interested in transforming your legal practice with AI? Schedule a
              personalized demo or get answers to your questions from our legal
              technology specialists.
            </p>
          </motion.div>

          {/* Contact Grid */}
          <motion.div
            variants={FADE_IN_UP_VARIANTS}
            className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16 items-start"
          >
            {/* Contact Information */}
            <div className="space-y-8">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start space-x-5">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-slate-100/5 ring-1 ring-inset ring-slate-100/10 rounded-lg flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-slate-400">{item.content}</p>
                  </div>
                </div>
              ))}

              {/* Additional Legal Info */}
              <div className="bg-slate-100/5 p-6 rounded-xl ring-1 ring-inset ring-slate-100/10 mt-8">
                <h4 className="text-lg font-semibold text-slate-100 mb-3">
                  Why Legal Professionals Choose Us
                </h4>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li>• 10M+ case law database</li>
                  <li>• 50x faster legal research</li>
                  <li>• Enterprise-grade security</li>
                  <li>• Bar association compliant</li>
                  <li>• Dedicated legal support team</li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-slate-100/5 p-8 rounded-2xl ring-1 ring-inset ring-slate-100/10">
              <h2 className="text-2xl font-bold text-white mb-6">
                Request a Legal Demo
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <FormInput
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
                <FormInput
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@lawfirm.com"
                />
                <FormInput
                  type="text"
                  name="firm"
                  required
                  value={formData.firm}
                  onChange={handleChange}
                  placeholder="Law firm or organization"
                />

                <select
                  name="practiceArea"
                  required
                  value={formData.practiceArea}
                  onChange={handleChange}
                  className="w-full bg-slate-900/50 border-0 rounded-md px-4 py-3 text-slate-300 placeholder-slate-500 ring-1 ring-inset ring-slate-100/10 focus:ring-2 focus:ring-inset focus:ring-emerald-500 transition"
                >
                  <option value="">Select your practice area</option>
                  {practiceAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>

                <FormTextarea
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your legal research needs, case volume, and specific challenges you're facing..."
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-slate-900 bg-white rounded-full hover:bg-slate-200 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Request Legal Demo
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
