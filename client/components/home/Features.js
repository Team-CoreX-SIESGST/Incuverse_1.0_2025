"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Shield,
  FileText,
  Gavel,
  Database,
  Zap,
  Cloud,
  CheckCircle,
  ArrowRight,
  Brain,
  BarChart3,
  Scale,
  BookOpen,
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
      title: "Case Law Research",
      description:
        "Advanced search across millions of legal documents and precedents.",
      icon: Search,
      color: "from-emerald-500 to-green-500",
      details: [
        "Natural language case law search",
        "Precedent analysis and citation tracking",
        "Jurisdiction-specific filtering",
        "Historical case timeline analysis",
        "Similar case recommendations",
        "Real-time legal updates",
      ],
    },
    {
      id: 1,
      title: "Document Analysis",
      description: "AI-powered analysis of legal documents and contracts.",
      icon: FileText,
      color: "from-green-500 to-emerald-500",
      details: [
        "Contract clause identification",
        "Risk assessment and scoring",
        "Compliance checking",
        "Document summarization",
        "Legal reasoning extraction",
        "Automated citation checking",
      ],
    },
    {
      id: 2,
      title: "Legal Intelligence",
      description:
        "Advanced AI algorithms extract legal insights and patterns.",
      icon: Brain,
      color: "from-emerald-600 to-green-600",
      details: [
        "Legal argument analysis",
        "Judge ruling prediction",
        "Case outcome forecasting",
        "Legal strategy optimization",
        "Statutory interpretation",
        "Doctrine development tracking",
      ],
    },
    {
      id: 3,
      title: "Case Management",
      description: "Comprehensive case tracking and management tools.",
      icon: BarChart3,
      color: "from-green-600 to-emerald-600",
      details: [
        "Case timeline visualization",
        "Document organization",
        "Deadline tracking",
        "Team collaboration tools",
        "Client management portal",
        "Performance analytics",
      ],
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
            Powerful tools for{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent">
              modern legal practice
            </span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Our AI-powered platform transforms how legal professionals research,
            analyze, and manage cases with unprecedented efficiency and
            accuracy.
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
            Trusted by Legal Professionals
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Gavel, title: "Law Firms" },
              { icon: Scale, title: "Corporate Legal" },
              { icon: BookOpen, title: "Academic Research" },
              { icon: Shield, title: "Government Agencies" },
              { icon: Zap, title: "Fast Processing" },
              { icon: Database, title: "Secure Database" },
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
                    Comprehensive legal solutions.
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
