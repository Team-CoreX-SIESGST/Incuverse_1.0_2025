"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Heart,
  Users,
  Activity,
  Mic,
  Database,
  Rocket,
} from "lucide-react";
import DoctorCard from "./DoctorCard";
import { useLanguage } from "@/contexts/LanguageContext";

// Animation variants for Framer Motion
const FADE_IN_STAGGER_VARIANTS = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const FADE_IN_UP_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Hero() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const { messages } = useLanguage();

  const t = (key) => {
    const keys = key.split(".");
    let value = messages;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const features = [
    {
      icon: Mic,
      title: t("Hero.voiceDataEntry"),
      description: t("Hero.voiceDataEntryDesc"),
    },
    {
      icon: Zap,
      title: t("Hero.aiAssistance"),
      description: t("Hero.aiAssistanceDesc"),
    },
    {
      icon: Shield,
      title: t("Hero.securePrivate"),
      description: t("Hero.securePrivateDesc"),
    },
    {
      icon: Database,
      title: t("Hero.digitalRecords"),
      description: t("Hero.digitalRecordsDesc"),
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  const CurrentFeatureIcon = features[currentFeature].icon;

  return (
    <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Background decorative elements */}
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_45rem_at_50%_50%,_theme(colors.emerald.100),_transparent_80%)] dark:bg-[radial-gradient(45rem_45rem_at_50%_50%,_theme(colors.emerald.950/40%),_transparent_80%)]"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-16 sm:pt-32 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Right Content - GIF */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-start mt-32 h-full"
          >
            <div className="relative w-full max-w-lg">
              <DoctorCard />
            </div>
          </motion.div>

          {/* Left Content */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={FADE_IN_STAGGER_VARIANTS}
            className="flex flex-col"
          >
            {/* Badge */}
            <motion.div variants={FADE_IN_UP_VARIANTS}>
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-900/5 dark:bg-slate-100/5 ring-1 ring-inset ring-slate-900/10 dark:ring-slate-100/10 mb-8 backdrop-blur-lg">
                <Heart className="w-4 h-4 text-emerald-500 mr-2" />
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {t("Hero.aiPowered")}
                </span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={FADE_IN_UP_VARIANTS}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-6"
            >
              {t("Hero.empowering")}{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent">
                {t("Hero.ashaWorkers")}
              </span>
              <br />
              {t("Hero.withAI")}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={FADE_IN_UP_VARIANTS}
              className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-8"
            >
              {t("Hero.subtitle")}
            </motion.p>

            {/* Feature Carousel */}
            <motion.div variants={FADE_IN_UP_VARIANTS} className="mb-10 h-16">
              <div className="inline-flex items-center px-4 py-2.5 rounded-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg ring-1 ring-slate-900/5 dark:ring-slate-100/10 shadow-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center mr-3 shrink-0">
                  <CurrentFeatureIcon className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    {features[currentFeature].title}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {features[currentFeature].description}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Health Icons */}
            <motion.div
              variants={FADE_IN_UP_VARIANTS}
              className="flex justify-start items-center mb-10 gap-4 sm:gap-6"
            >
              {[Heart, Users, Activity, Mic].map((Icon, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-200/50 dark:bg-slate-800/50 rounded-lg ring-1 ring-inset ring-slate-900/5 dark:ring-slate-100/10"
                >
                  <Icon className="w-7 h-7 text-slate-500 dark:text-slate-400" />
                </div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div variants={FADE_IN_UP_VARIANTS} className="mb-8">
              <Link
                href="/register"
                className="group relative inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-600 transition-all duration-300 shadow-lg"
              >
                <Rocket className="w-4 h-4 mr-2" />
                {t("Hero.startFreeTrial")}
                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={FADE_IN_UP_VARIANTS}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full"
            >
              {[
                { value: "10K+", label: t("Hero.ashaWorkersCount") },
                { value: "50x", label: t("Hero.fasterDataEntry") },
                { value: "100%", label: t("Hero.vernacular") },
                { value: "24/7", label: t("Hero.available") },
              ].map((stat) => (
                <div key={stat.label} className="text-left">
                  <div className="text-3xl font-semibold text-slate-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-px h-10 bg-slate-300 dark:bg-slate-700">
          <motion.div
            className="w-px h-4 bg-slate-500 dark:bg-slate-400"
            animate={{
              y: [0, 24, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
            }}
          />
        </div>
      </div>
    </div>
  );
}
