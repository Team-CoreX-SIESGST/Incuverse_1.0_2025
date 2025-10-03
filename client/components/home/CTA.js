"use client";

import Link from "next/link";
import {
  ArrowRight,
  Brain,
  FileText,
  Gavel,
  Scale,
  Search,
  Cloud,
  BookOpen,
  Shield,
} from "lucide-react";

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 py-20 sm:py-24">
      {/* Background Decoration */}
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_45rem_at_50%_50%,_theme(colors.emerald.100/50%),_transparent)] dark:bg-[radial-gradient(45rem_45rem_at_50%_50%,_theme(colors.emerald.950/40%),_theme(colors.slate.950))]"
        aria-hidden="true"
      />

      {/* Floating Icons Animation */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <FileText className="absolute top-20 left-10 w-8 h-8 text-slate-300 dark:text-slate-800 animate-float" />
        <Gavel className="absolute top-40 right-20 w-6 h-6 text-slate-300 dark:text-slate-800 animate-float animation-delay-1000" />
        <Scale className="absolute bottom-40 left-20 w-7 h-7 text-slate-300 dark:text-slate-800 animate-float animation-delay-2000" />
        <BookOpen className="absolute top-60 right-40 w-5 h-5 text-slate-300 dark:text-slate-800 animate-float animation-delay-3000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-200/50 dark:bg-slate-100/5 ring-1 ring-inset ring-slate-900/10 dark:ring-slate-100/10 mb-8 backdrop-blur-lg">
            <Brain className="w-4 h-4 text-emerald-500 dark:text-emerald-400 mr-2" />
            <span className="text-sm font-medium text-slate-800 dark:text-slate-300">
              AI-Powered Legal Intelligence
            </span>
          </div>

          {/* Main Content */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            Transform Your Legal Practice
            <br />
            <span className="bg-gradient-to-r from-emerald-500 to-green-500 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
              With AI Innovation
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto">
            Our AI platform analyzes{" "}
            <strong className="text-slate-900 dark:text-slate-200">
              case laws, statutes, contracts, and legal documents
            </strong>{" "}
            simultaneously. Get instant insights, precedents, and strategic
            recommendations to win your cases.
          </p>

          {/* Use Cases */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: "⚖️",
                title: "Litigation Support",
                content:
                  "Analyze case laws, precedents, and build stronger legal arguments with AI insights.",
              },
              {
                icon: "📝",
                title: "Contract Review",
                content:
                  "Automate contract analysis, identify risks, and ensure compliance with regulations.",
              },
              {
                icon: "🔍",
                title: "Legal Research",
                content:
                  "Search through millions of legal documents and get relevant results in seconds.",
              },
            ].map((useCase) => (
              <div
                key={useCase.title}
                className="bg-white/50 dark:bg-slate-100/5 rounded-2xl p-6 ring-1 ring-inset ring-slate-900/10 dark:ring-slate-100/10 hover:ring-slate-900/20 dark:hover:ring-slate-100/20 transition-all duration-300 group text-left"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 w-fit">
                  {useCase.icon}
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-lg mb-2">
                  {useCase.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {useCase.content}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="mt-12">
            <Link
              href="/register"
              className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span>Start Your Free Trial</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </div>

      {/* Custom Styles for animation */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
      `}</style>
    </section>
  );
}
