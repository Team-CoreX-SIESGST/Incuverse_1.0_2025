"use client";

import Link from "next/link";
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  Sparkles,
  FileText,
  Image,
  Video,
  Database,
  Zap,
  Gavel,
  Scale,
  BookOpen,
  Shield,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  // Social media URLs from environment variables
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com";
  const twitterUrl =
    process.env.NEXT_PUBLIC_TWITTER_URL || "https://twitter.com";
  const linkedinUrl =
    process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com";
  const emailUrl =
    process.env.NEXT_PUBLIC_EMAIL || "mailto:contact@legalai.com";

  const socialLinks = [
    { href: githubUrl, icon: Github, label: "GitHub" },
    { href: twitterUrl, icon: Twitter, label: "Twitter" },
    { href: linkedinUrl, icon: Linkedin, label: "LinkedIn" },
    { href: emailUrl, icon: Mail, label: "Email" },
  ];

  const legalFeatures = [
    { icon: Gavel, label: "Case Law Research" },
    { icon: BookOpen, label: "Legal Documents" },
    { icon: Scale, label: "Case Analysis" },
    { icon: Shield, label: "Client Security" },
    { icon: Zap, label: "AI-Powered" },
  ];

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-5">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  LegalAI Research
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Research. Analyze. Win.
                </p>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-base mb-6 max-w-md">
              The next-generation AI-powered legal research platform that helps
              attorneys find relevant case laws, analyze documents, and build
              stronger legal arguments with unprecedented efficiency.
            </p>
            <div className="flex space-x-5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                Platform
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/features" className="footer-link">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/research" className="footer-link">
                    Legal Research
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="footer-link">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/demo" className="footer-link">
                    Request Demo
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                Resources
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="/docs" className="footer-link">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="/blog" className="footer-link">
                    Legal Insights
                  </a>
                </li>
                <li>
                  <a href="/tutorials" className="footer-link">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="/api" className="footer-link">
                    API Reference
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                Legal
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/privacy" className="footer-link">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="footer-link">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/compliance" className="footer-link">
                    Compliance
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="footer-link">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Legal Features */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
          <h4 className="text-sm font-semibold text-center text-slate-900 dark:text-white mb-6">
            AI-Powered Legal Features
          </h4>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
            {legalFeatures.map((feature) => (
              <div key={feature.label} className="flex items-center space-x-2">
                <feature.icon className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            <p>&copy; {currentYear} LegalAI Research. All rights reserved.</p>
            <p className="mt-1 text-xs">
              Trusted by attorneys and legal professionals worldwide
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-link {
          @apply text-base text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200;
        }
      `}</style>
    </footer>
  );
}
