"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Shield,
  FileText,
  Users,
  Database,
  Zap,
  Cloud,
  CheckCircle,
  ArrowRight,
  Brain,
  BarChart3,
  Scale,
  BookOpen,
  Mic,
  Calendar,
  Heart,
  Activity,
} from "lucide-react";

// Animation variants for the tab content
const tabContentVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2, ease: "easeIn" } },
};

export function Features() {
  const [activeTab, setActiveTab] = useState(0);

  const features = [
    {
      id: 0,
      title: "Voice Patient Registration",
      description:
        "Register patients using simple voice commands in local language.",
      icon: Mic,
      color: "from-emerald-500 to-green-500",
      details: [
        "Vernacular voice recognition",
        "Auto-fill patient forms",
        "QR health card generation",
        "Offline voice processing",
        "Multiple language support",
        "Real-time validation",
      ],
    },
    {
      id: 1,
      title: "Smart Follow-up Scheduling",
      description: "Automated appointment tracking and reminder system.",
      icon: Calendar,
      color: "from-green-500 to-emerald-500",
      details: [
        "Automated visit reminders",
        "Priority-based scheduling",
        "Missed visit alerts",
        "Progress tracking",
        "Performance analytics",
        "Community health trends",
      ],
    },
    {
      id: 2,
      title: "Health Scheme Access",
      description: "Easy access to government health schemes and benefits.",
      icon: Heart,
      color: "from-emerald-600 to-green-600",
      details: [
        "Scheme eligibility checking",
        "Application guidance",
        "Benefit explanations",
        "Document requirements",
        "Status tracking",
        "Local language support",
      ],
    },
    {
      id: 3,
      title: "Community Health Dashboard",
      description: "Track community health metrics and outcomes.",
      icon: BarChart3,
      color: "from-green-600 to-emerald-600",
      details: [
        "Health trend analysis",
        "Vaccination tracking",
        "Maternal health monitoring",
        "Child nutrition status",
        "Outbreak alerts",
        "Performance reports",
      ],
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
            Comprehensive tools for{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent">
              community healthcare
            </span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Our AI-powered platform transforms how ASHA workers serve their
            communities with efficient data management and intelligent health
            insights.
          </p>
        </div>

        {/* Feature Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Tab Navigation */}
          <div className="space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <button
                  key={feature.id}
                  onClick={() => setActiveTab(index)}
                  className={`w-full p-5 rounded-xl transition-all duration-300 text-left group ring-1 ring-inset ${
                    activeTab === index
                      ? "bg-slate-900/5 dark:bg-slate-100/5 ring-emerald-500/50 dark:ring-emerald-500/80 shadow-lg"
                      : "ring-slate-900/10 dark:ring-slate-100/10 hover:ring-slate-900/20 dark:hover:ring-slate-100/20"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center shrink-0 shadow-md group-hover:-translate-y-0.5 transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feature Content */}
          <div className="lg:sticky lg:top-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white dark:bg-slate-900 rounded-2xl p-8 ring-1 ring-slate-900/10 dark:ring-slate-100/10 shadow-xl"
              >
                <div className="flex items-center mb-6">
                  {(() => {
                    const Icon = features[activeTab].icon;
                    return (
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-r ${features[activeTab].color} flex items-center justify-center shadow-md mr-4`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    );
                  })()}
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {features[activeTab].title}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features[activeTab].details.map((detail, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {detail}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <Link
                    href="/register"
                    className="group inline-flex items-center text-base font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
                  >
                    <span>Start Your Free Trial</span>
                    <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Additional Features Grid */}
        <div className="mt-20 sm:mt-24">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-12">
            Trusted by Healthcare Professionals
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Users, title: "ASHA Workers" },
              { icon: Activity, title: "Health Centers" },
              { icon: Heart, title: "Maternal Care" },
              { icon: Shield, title: "Government Agencies" },
              { icon: Zap, title: "Fast Processing" },
              { icon: Database, title: "Secure Data" },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="text-center">
                  <div className="w-14 h-14 rounded-xl bg-white dark:bg-slate-900 ring-1 ring-slate-900/10 dark:ring-slate-100/10 shadow-md flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-emerald-500" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    Comprehensive health solutions.
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
