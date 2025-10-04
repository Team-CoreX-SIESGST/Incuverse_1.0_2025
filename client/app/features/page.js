"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Features } from "@/components/home/Features";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Animation variants from the reference code
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

export default function FeaturesPage() {
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
      <main className="relative overflow-hidden py-1 sm:py-20">
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_45rem_at_50%_50%,_theme(colors.indigo.950/40%),_theme(colors.slate.950))]"
          aria-hidden="true"
        />
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN_STAGGER_VARIANTS}
          className="max-w-7xl mx-auto px-6 lg:px-8 space-y-20 sm:space-y-24"
        >
          {/* Hero Section */}
          {/* <motion.div variants={FADE_IN_UP_VARIANTS} className="text-center">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-100/5 ring-1 ring-inset ring-slate-100/10 mb-8 backdrop-blur-lg">
              <Sparkles className="w-4 h-4 text-indigo-400 mr-2" />
              <span className="text-sm font-medium text-slate-300">
                {t("Features.comprehensiveTools")}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-6">
              {t("Navbar.features")}
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto">
              {t("Features.subtitle")}
            </p>
          </motion.div> */}

          {/* Features Component Section */}
          <motion.div variants={FADE_IN_UP_VARIANTS}>
            <Features />
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
