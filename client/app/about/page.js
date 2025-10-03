"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Brain,
  Search,
  FileText,
  Gavel,
  Scale,
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
} from "lucide-react";

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
                AI-Powered Legal Intelligence
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-6">
              Revolutionizing Legal Research
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto">
              The world's first AI platform specifically designed for legal
              professionals. Search across case laws, statutes, contracts, and
              legal documents with unprecedented speed and accuracy.
            </p>
          </motion.div>

          {/* Core Capabilities */}
          <motion.div variants={FADE_IN_UP_VARIANTS}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Search,
                  title: "Case Law Research",
                  description:
                    "Find relevant precedents and case laws across millions of legal documents with a single query.",
                },
                {
                  icon: Brain,
                  title: "Legal Analysis",
                  description:
                    "Advanced AI models that understand legal reasoning, statutes, and judicial interpretations.",
                },
                {
                  icon: BarChart3,
                  title: "Case Strategy Insights",
                  description:
                    "Generate legal arguments, identify weaknesses, and build stronger case strategies automatically.",
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
              Built for Legal Excellence
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Cpu,
                  title: "Legal Language Models",
                  description:
                    "Specialized AI models trained on legal texts for superior understanding of case law and statutes.",
                },
                {
                  icon: Shield,
                  title: "Enterprise Security",
                  description:
                    "Bank-level encryption and compliance with legal industry security standards and regulations.",
                },
                {
                  icon: Database,
                  title: "Legal Database",
                  description:
                    "Comprehensive database of case laws, statutes, and legal precedents updated in real-time.",
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
              Trusted by Legal Professionals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  emoji: "⚖️",
                  title: "Law Firms",
                  description:
                    "Accelerate case research, reduce billable hours, and deliver better outcomes for clients.",
                },
                {
                  emoji: "🏛️",
                  title: "Corporate Legal",
                  description:
                    "Streamline contract review, compliance checking, and corporate governance documentation.",
                },
                {
                  emoji: "🎓",
                  title: "Legal Education",
                  description:
                    "Enhance legal research training and provide students with cutting-edge AI tools.",
                },
                {
                  emoji: "👨‍⚖️",
                  title: "Judicial Research",
                  description:
                    "Access comprehensive case law analysis and precedent research for informed decisions.",
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
            <Gavel className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Practice?
            </h2>
            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              Join thousands of legal professionals who've revolutionized their
              research workflow with AI-powered legal intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/demo"
                className="group inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-slate-900 bg-white rounded-full hover:bg-slate-200 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="/contact"
                className="group inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-white/5 rounded-full ring-1 ring-inset ring-slate-100/20 hover:bg-white/10 transition-all duration-300"
              >
                Get Legal Demo
              </a>
            </div>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
