"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Settings,
  User,
  MessageSquare,
  Zap,
  Shield,
  Palette,
  Volume2,
  Bell,
  Save,
  RotateCcw,
  Moon,
  Sun,
  Monitor,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Camera,
  Upload,
  Check,
  AlertCircle,
  Gavel,
  Scale,
  BookOpen,
} from "lucide-react";

export default function ProfilePage() {
  const { user, logout, loading } = useAuth();
  const [settings, setSettings] = useState({
    // Profile Settings
    username: "",
    email: "",
    avatar: "",
    barNumber: "",
    practiceArea: "general",
    firmName: "",

    // Research Settings
    model: "legal-ai-pro",
    jurisdiction: "federal",
    citationStyle: "bluebook",
    caseDepth: "comprehensive",
    autoSave: true,
    legalUpdates: true,

    // Appearance
    theme: "system",
    fontSize: "medium",
    researchView: "detailed",
    showCitations: true,

    // Privacy & Security
    dataRetention: "30days",
    analyticsEnabled: false,
    shareResearch: false,
    clientDataProtection: true,

    // Notifications
    soundEnabled: true,
    desktopNotifications: false,
    emailNotifications: true,
    caseAlerts: true,
  });

  const [activeSection, setActiveSection] = useState("profile");
  const [isClient, setIsClient] = useState(false);
  const [localUser, setLocalUser] = useState(null);
  const [hasToken, setHasToken] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // Client-side initialization
  useEffect(() => {
    setIsClient(true);

    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setLocalUser(parsedUser);
        setSettings((prev) => ({
          ...prev,
          username: parsedUser.name || "",
          email: parsedUser.email || "",
        }));
      }
    } catch {
      localStorage.removeItem("user");
    }
    setHasToken(!!localStorage.getItem("token"));

    const onStorage = (e) => {
      if (e.key === "user") {
        try {
          const val = localStorage.getItem("user");
          const parsedUser = val ? JSON.parse(val) : null;
          setLocalUser(parsedUser);
          if (parsedUser) {
            setSettings((prev) => ({
              ...prev,
              username: parsedUser.name || "",
              email: parsedUser.email || "",
            }));
          }
        } catch {
          localStorage.removeItem("user");
          setLocalUser(null);
        }
      }
      if (e.key === "token") {
        setHasToken(!!localStorage.getItem("token"));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    if (user) {
      setLocalUser(user);
      setSettings((prev) => ({
        ...prev,
        username: user.name || "",
        email: user.email || "",
      }));
      try {
        localStorage.setItem("user", JSON.stringify(user));
      } catch {
        // Handle storage error
      }
      setHasToken(!!localStorage.getItem("token"));
    } else {
      setLocalUser((prev) => prev);
      setHasToken(!!localStorage.getItem("token"));
    }
  }, [user, isClient]);

  // Auth state
  const isAuthenticated = isClient && (hasToken || !!user || !!localUser);
  const userInfo = user || localUser;

  // Get user initial for avatar
  const getUserInitial = () => {
    if (!userInfo && !settings.username) return "A";
    const displayName = userInfo?.name || settings.username;
    const displayEmail = userInfo?.email || settings.email;
    if (displayName) return displayName.charAt(0).toUpperCase();
    if (displayEmail) return displayEmail.charAt(0).toUpperCase();
    return "A";
  };

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (userInfo || isAuthenticated) {
        try {
          const updatedUser = {
            ...(userInfo || {}),
            name: settings.username,
            email: settings.email,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setLocalUser(updatedUser);
        } catch {
          // Handle error
        }
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all settings to default?")) {
      setSettings({
        username: userInfo?.name || "",
        email: userInfo?.email || "",
        avatar: "",
        barNumber: "",
        practiceArea: "general",
        firmName: "",
        model: "legal-ai-pro",
        jurisdiction: "federal",
        citationStyle: "bluebook",
        caseDepth: "comprehensive",
        autoSave: true,
        legalUpdates: true,
        theme: "system",
        fontSize: "medium",
        researchView: "detailed",
        showCitations: true,
        dataRetention: "30days",
        analyticsEnabled: false,
        shareResearch: false,
        clientDataProtection: true,
        soundEnabled: true,
        desktopNotifications: false,
        emailNotifications: true,
        caseAlerts: true,
      });
    }
  };

  const handleAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Uploading file:", file);
    }
  };

  const sections = [
    { id: "profile", label: "Attorney Profile", icon: User },
    { id: "research", label: "Research Settings", icon: BookOpen },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const renderProfileSettings = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Full Name
        </label>
        <input
          type="text"
          value={settings.username}
          onChange={(e) => handleSettingChange("username", e.target.value)}
          className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-slate-500 dark:placeholder-slate-400"
          placeholder="Enter your full name"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={settings.email}
          onChange={(e) => handleSettingChange("email", e.target.value)}
          className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-slate-500 dark:placeholder-slate-400"
          placeholder="Enter your email"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Bar Number
        </label>
        <input
          type="text"
          value={settings.barNumber}
          onChange={(e) => handleSettingChange("barNumber", e.target.value)}
          className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-slate-500 dark:placeholder-slate-400"
          placeholder="Enter your bar number"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Practice Area
        </label>
        <select
          value={settings.practiceArea}
          onChange={(e) => handleSettingChange("practiceArea", e.target.value)}
          className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
        >
          <option value="general">General Practice</option>
          <option value="corporate">Corporate Law</option>
          <option value="criminal">Criminal Law</option>
          <option value="family">Family Law</option>
          <option value="intellectual">Intellectual Property</option>
          <option value="realestate">Real Estate</option>
          <option value="tax">Tax Law</option>
          <option value="immigration">Immigration Law</option>
        </select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Law Firm / Organization
        </label>
        <input
          type="text"
          value={settings.firmName}
          onChange={(e) => handleSettingChange("firmName", e.target.value)}
          className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-slate-500 dark:placeholder-slate-400"
          placeholder="Enter your firm name"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Profile Picture
        </label>
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white font-medium text-2xl ring-4 ring-white dark:ring-slate-900 shadow-lg">
            {getUserInitial()}
          </div>
          <div className="flex flex-col space-y-2">
            <button
              onClick={handleAvatarUpload}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Image</span>
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              PNG, JPG up to 2MB
            </p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </motion.div>
    </motion.div>
  );

  const renderResearchSettings = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          AI Research Model
        </label>
        <select
          value={settings.model}
          onChange={(e) => handleSettingChange("model", e.target.value)}
          className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
        >
          <option value="legal-ai-pro">Legal AI Pro</option>
          <option value="legal-ai-standard">Legal AI Standard</option>
          <option value="case-law-expert">Case Law Expert</option>
          <option value="statute-specialist">Statute Specialist</option>
        </select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Primary Jurisdiction
        </label>
        <select
          value={settings.jurisdiction}
          onChange={(e) => handleSettingChange("jurisdiction", e.target.value)}
          className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
        >
          <option value="federal">Federal</option>
          <option value="state">State Level</option>
          <option value="international">International</option>
          <option value="multiple">Multiple Jurisdictions</option>
        </select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Citation Style
        </label>
        <select
          value={settings.citationStyle}
          onChange={(e) => handleSettingChange("citationStyle", e.target.value)}
          className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
        >
          <option value="bluebook">Bluebook</option>
          <option value="alwd">ALWD</option>
          <option value="oscola">OSCOLA</option>
          <option value="chicago">Chicago</option>
          <option value="apa">APA</option>
        </select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Case Research Depth
        </label>
        <select
          value={settings.caseDepth}
          onChange={(e) => handleSettingChange("caseDepth", e.target.value)}
          className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
        >
          <option value="basic">Basic Overview</option>
          <option value="standard">Standard Analysis</option>
          <option value="comprehensive">Comprehensive Research</option>
          <option value="exhaustive">Exhaustive Review</option>
        </select>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Auto-save Research
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Automatically save research progress
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={(e) =>
                handleSettingChange("autoSave", e.target.checked)
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Legal Updates
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Receive updates on relevant case laws
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.legalUpdates}
              onChange={(e) =>
                handleSettingChange("legalUpdates", e.target.checked)
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderAppearanceSettings = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Theme
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "light", label: "Light", icon: Sun },
            { value: "dark", label: "Dark", icon: Moon },
            { value: "system", label: "System", icon: Monitor },
          ].map((theme) => (
            <button
              key={theme.value}
              onClick={() => handleSettingChange("theme", theme.value)}
              className={`p-4 rounded-lg border-2 flex flex-col items-center space-y-2 transition-all duration-200 hover:scale-105 ${
                settings.theme === theme.value
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 shadow-lg shadow-emerald-500/20"
                  : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              <theme.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{theme.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Font Size
        </label>
        <select
          value={settings.fontSize}
          onChange={(e) => handleSettingChange("fontSize", e.target.value)}
          className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Research View
        </label>
        <select
          value={settings.researchView}
          onChange={(e) => handleSettingChange("researchView", e.target.value)}
          className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
        >
          <option value="detailed">Detailed View</option>
          <option value="compact">Compact View</option>
          <option value="timeline">Timeline View</option>
        </select>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Show Citations
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Display full legal citations in research
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showCitations}
              onChange={(e) =>
                handleSettingChange("showCitations", e.target.checked)
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderPrivacySettings = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Data Retention
        </label>
        <select
          value={settings.dataRetention}
          onChange={(e) => handleSettingChange("dataRetention", e.target.value)}
          className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
        >
          <option value="7days">7 days</option>
          <option value="30days">30 days</option>
          <option value="90days">90 days</option>
          <option value="1year">1 year</option>
          <option value="never">Never delete</option>
        </select>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Client Data Protection
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Enhanced security for client-related data
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.clientDataProtection}
              onChange={(e) =>
                handleSettingChange("clientDataProtection", e.target.checked)
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Share Research
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Allow sharing research with team members
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.shareResearch}
              onChange={(e) =>
                handleSettingChange("shareResearch", e.target.checked)
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-1">
                Research Data Export
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-400 mb-3">
                Download all your legal research and case data
              </p>
              <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium">
                Export Research Data
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-red-800 dark:text-red-300 mb-1">
                Delete Account
              </h4>
              <p className="text-sm text-red-700 dark:text-red-400 mb-3">
                Permanently delete your account and all research data
              </p>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderNotificationSettings = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <Volume2 className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Sound Effects
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Play sounds for research completions
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) =>
                handleSettingChange("soundEnabled", e.target.checked)
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <Monitor className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Desktop Notifications
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Show browser notifications for case updates
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.desktopNotifications}
              onChange={(e) =>
                handleSettingChange("desktopNotifications", e.target.checked)
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Email Notifications
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Receive legal research updates via email
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) =>
                handleSettingChange("emailNotifications", e.target.checked)
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <Scale className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Case Alerts
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Get alerts for relevant new case laws
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.caseAlerts}
              onChange={(e) =>
                handleSettingChange("caseAlerts", e.target.checked)
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return renderProfileSettings();
      case "research":
        return renderResearchSettings();
      case "appearance":
        return renderAppearanceSettings();
      case "privacy":
        return renderPrivacySettings();
      case "notifications":
        return renderNotificationSettings();
      default:
        return renderProfileSettings();
    }
  };

  // Don't render until client-side to prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!loading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gavel className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Attorney Login Required
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            You need to be logged in to access your legal research profile.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <Link
                href="/"
                className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Attorney Profile
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Manage your legal research preferences
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <AnimatePresence>
                {saveSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg text-green-700 dark:text-green-400 text-sm"
                  >
                    <Check className="w-4 h-4" />
                    <span>Saved!</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={handleReset}
                className="flex items-center space-x-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200/80 dark:border-slate-800/80 p-6 h-fit sticky top-24">
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white font-medium text-lg ring-2 ring-white dark:ring-slate-900">
                {getUserInitial()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                  {userInfo?.name || settings.username || "Attorney"}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                  {settings.practiceArea || "Legal Professional"}
                </p>
              </div>
            </div>

            <nav className="space-y-1">
              {sections.map((section, index) => (
                <motion.button
                  key={section.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
                    activeSection === section.id
                      ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 shadow-sm border-l-4 border-emerald-500"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <section.icon
                      className={`w-5 h-5 transition-transform duration-200 ${
                        activeSection === section.id
                          ? "scale-110"
                          : "group-hover:scale-105"
                      }`}
                    />
                    <span className="font-medium">{section.label}</span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-all duration-200 ${
                      activeSection === section.id
                        ? "rotate-90 text-emerald-500"
                        : "group-hover:translate-x-0.5"
                    }`}
                  />
                </motion.button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200/80 dark:border-slate-800/80 p-8">
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-2">
                {sections.find((s) => s.id === activeSection)?.icon &&
                  React.createElement(
                    sections.find((s) => s.id === activeSection).icon,
                    {
                      className:
                        "w-6 h-6 text-emerald-600 dark:text-emerald-400",
                    }
                  )}
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  {sections.find((s) => s.id === activeSection)?.label}
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                {activeSection === "profile" &&
                  "Manage your attorney profile and professional information"}
                {activeSection === "research" &&
                  "Configure legal research preferences and AI settings"}
                {activeSection === "appearance" &&
                  "Customize the look and feel of your research interface"}
                {activeSection === "privacy" &&
                  "Control your data privacy and security settings"}
                {activeSection === "notifications" &&
                  "Manage your legal research notifications"}
              </p>
            </div>

            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
