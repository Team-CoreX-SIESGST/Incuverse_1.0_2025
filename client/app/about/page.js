"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Brain,
  Heart,
  BookOpen,
  Zap,
  Shield,
  Globe,
  Cpu,
  Eye,
  BarChart3,
  Sparkles,
  ArrowRight,
  Database,
  Mic,
  Activity,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Animation variants for Framer Motion
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

export default function AboutPage() {
  const { messages } = useLanguage();

  const t = (key) => {
    const keys = key.split(".");
    let value = messages;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

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
              <Heart className="w-4 h-4 text-emerald-400 mr-2" />
              <span className="text-sm font-medium text-slate-300">
                {t("About.aiPoweredHealthAssistant")}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-6">
              {t("About.revolutionizingCommunityHealthcare")}
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto">
              {t("About.description")}
            </p>
          </motion.div>

          {/* Core Capabilities */}
          <motion.div variants={FADE_IN_UP_VARIANTS}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Mic,
                  title: t("About.voiceBasedInterface"),
                  description: t("About.voiceBasedInterfaceDesc"),
                },
                {
                  icon: Brain,
                  title: t("About.healthIntelligence"),
                  description: t("About.healthIntelligenceDesc"),
                },
                {
                  icon: BarChart3,
                  title: t("About.communityAnalytics"),
                  description: t("About.communityAnalyticsDesc"),
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-slate-100/5 p-6 rounded-xl ring-1 ring-inset ring-slate-100/10 hover:ring-slate-100/20 transition-all duration-300"
                >
                  <item.icon className="w-8 h-8 text-emerald-400 mb-4" />
                  <h2 className="text-xl font-semibold text-slate-100 mb-2">
                    {item.title}
                  </h2>
                  <p className="text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Technology Stack */}
          <motion.div
            variants={FADE_IN_UP_VARIANTS}
            className="bg-slate-100/5 p-8 rounded-2xl ring-1 ring-inset ring-slate-100/10"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              {t("About.builtForHealthcareExcellence")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Cpu,
                  title: t("About.vernacularAIModels"),
                  description: t("About.vernacularAIModelsDesc"),
                },
                {
                  icon: Shield,
                  title: t("About.healthcareSecurity"),
                  description: t("About.healthcareSecurityDesc"),
                },
                {
                  icon: Database,
                  title: t("About.healthDatabase"),
                  description: t("About.healthDatabaseDesc"),
                },
              ].map((tech) => (
                <div key={tech.title} className="text-center">
                  <tech.icon className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">
                    {tech.title}
                  </h3>
                  <p className="text-slate-400 text-sm">{tech.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Use Cases */}
          <motion.div variants={FADE_IN_UP_VARIANTS}>
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              {t("About.trustedByHealthcareProfessionals")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  emoji: "👩‍⚕️",
                  title: t("About.ashaWorkers"),
                  description: t("About.ashaWorkersDesc"),
                },
                {
                  emoji: "🏥",
                  title: t("About.healthCenters"),
                  description: t("About.healthCentersDesc"),
                },
                {
                  emoji: "🤰",
                  title: t("About.maternalHealthcare"),
                  description: t("About.maternalHealthcareDesc"),
                },
                {
                  emoji: "👶",
                  title: t("About.childHealthcare"),
                  description: t("About.childHealthcareDesc"),
                },
              ].map((useCase) => (
                <div
                  key={useCase.title}
                  className="flex items-start p-6 bg-slate-100/5 rounded-xl ring-1 ring-inset ring-slate-100/10 space-x-4"
                >
                  <div className="text-2xl mt-1">{useCase.emoji}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">
                      {useCase.title}
                    </h3>
                    <p className="text-slate-400">{useCase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action Section */}
          <motion.div
            variants={FADE_IN_UP_VARIANTS}
            className="text-center bg-slate-100/5 p-10 sm:p-12 rounded-2xl ring-1 ring-inset ring-slate-100/10"
          >
            <Activity className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {t("About.readyToTransformCommunityHealth")}
            </h2>
            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              {t("About.joinThousands")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/demo"
                className="group inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-slate-900 bg-white rounded-full hover:bg-slate-200 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {t("About.startFreeTrial")}
                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="/contact"
                className="group inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-white/5 rounded-full ring-1 ring-inset ring-slate-100/20 hover:bg-white/10 transition-all duration-300"
              >
                {t("About.getHealthDemo")}
              </a>
            </div>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
