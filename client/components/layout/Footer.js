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
  Heart,
  Mic,
  BarChart3,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const { messages } = useLanguage();
  const currentYear = new Date().getFullYear();

  const t = (key) => {
    const keys = key.split(".");
    let value = messages;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  // Social media URLs from environment variables
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com";
  const twitterUrl =
    process.env.NEXT_PUBLIC_TWITTER_URL || "https://twitter.com";
  const linkedinUrl =
    process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com";
  const emailUrl =
    process.env.NEXT_PUBLIC_EMAIL || "mailto:contact@example.com";

  const socialLinks = [
    { href: githubUrl, icon: Github, label: "GitHub" },
    { href: twitterUrl, icon: Twitter, label: "Twitter" },
    { href: linkedinUrl, icon: Linkedin, label: "LinkedIn" },
    { href: emailUrl, icon: Mail, label: "Email" },
  ];

  const healthFeatures = [
    { icon: Mic, label: t("Footer.voiceDataEntry") },
    { icon: Heart, label: t("Footer.healthSchemes") },
    { icon: BarChart3, label: t("Footer.communityAnalytics") },
    { icon: Shield, label: t("Footer.clientSecurity") },
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
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  ASHA सखी
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t("Footer.tagline")}
                </p>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-base mb-6 max-w-md">
              {t("Footer.description")}
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
                {t("Footer.platform")}
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/features" className="footer-link">
                    {t("Footer.features")}
                  </Link>
                </li>
                <li>
                  <Link href="/health-records" className="footer-link">
                    {t("Footer.healthRecords")}
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="footer-link">
                    {t("Footer.pricing")}
                  </Link>
                </li>
                <li>
                  <Link href="/demo" className="footer-link">
                    {t("Footer.requestDemo")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                {t("Footer.resources")}
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="/docs" className="footer-link">
                    {t("Footer.documentation")}
                  </a>
                </li>
                <li>
                  <a href="/blog" className="footer-link">
                    {t("Footer.healthInsights")}
                  </a>
                </li>
                <li>
                  <a href="/tutorials" className="footer-link">
                    {t("Footer.tutorials")}
                  </a>
                </li>
                <li>
                  <a href="/api" className="footer-link">
                    {t("Footer.apiReference")}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semabold text-slate-900 dark:text-white mb-4">
                {t("Footer.legal")}
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/privacy" className="footer-link">
                    {t("Footer.privacyPolicy")}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="footer-link">
                    {t("Footer.termsOfService")}
                  </Link>
                </li>
                <li>
                  <Link href="/compliance" className="footer-link">
                    {t("Footer.compliance")}
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="footer-link">
                    {t("Footer.security")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Health Features */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
          <h4 className="text-sm font-semibold text-center text-slate-900 dark:text-white mb-6">
            {t("Footer.aiPoweredFeatures")}
          </h4>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
            {healthFeatures.map((feature) => (
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
            <p>
              &copy; {currentYear} ASHA सखी. {t("Footer.copyright")}
            </p>
            <p className="mt-1 text-xs">{t("Footer.trustedBy")}</p>
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
