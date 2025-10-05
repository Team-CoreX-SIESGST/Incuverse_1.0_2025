"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth/AuthProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Menu, X, User, LogOut, Sparkles, ChevronDown } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Navbar() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const { showToast } = useToast();
  const { messages } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [previousAuthState, setPreviousAuthState] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [localUser, setLocalUser] = useState(null);
  const [hasToken, setHasToken] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);

  // Translation function
  const t = (key) => {
    const keys = key.split(".");
    let value = messages;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  // Auth state
  const isAuthenticated = isClient && (hasToken || !!user || !!localUser);
  const userInfo = user || localUser;

  useEffect(() => {
    setIsClient(true);

    // Restore local user + token
    try {
      const userData = localStorage.getItem("user");
      if (userData) setLocalUser(JSON.parse(userData));
    } catch {
      localStorage.removeItem("user");
    }
    setHasToken(!!localStorage.getItem("token"));

    // Sync across tabs
    const onStorage = (e) => {
      if (e.key === "user") {
        try {
          const val = localStorage.getItem("user");
          setLocalUser(val ? JSON.parse(val) : null);
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

  // Toast for login
  useEffect(() => {
    if (!isClient) return;

    const currentAuthState = hasToken || !!user || !!localUser;

    // If user just logged in (went from not authenticated to authenticated)
    if (!previousAuthState && currentAuthState && (user || localUser)) {
      const userName =
        (user || localUser)?.name || (user || localUser)?.email || "User";
      showToast(`Welcome back, ${userName}!`, "success");
    }

    setPreviousAuthState(currentAuthState);
  }, [hasToken, user, localUser, isClient, showToast, previousAuthState]);

  // Scroll style
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close profile dropdown when clicking outside
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }

      // Close mobile menu when clicking outside
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        mobileMenuButtonRef.current &&
        !mobileMenuButtonRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // When auth context user changes, mirror to localStorage
  useEffect(() => {
    if (!isClient) return;
    if (user) {
      setLocalUser(user);
      try {
        localStorage.setItem("user", JSON.stringify(user));
      } catch {
        // If storage full or blocked, at least keep in state
      }
      setHasToken(!!localStorage.getItem("token"));
    } else {
      setLocalUser((prev) => prev); // keep whatever we restored until token says otherwise
      setHasToken(!!localStorage.getItem("token"));
    }
  }, [user, isClient]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: "/", label: t("Navbar.home") },
    { href: "/features", label: t("Navbar.features") },
    { href: "/about", label: t("Navbar.about") },
    { href: "/asha-centers", label: t("Navbar.asha_centers") },
    // { href: "/contact", label: t("Navbar.contact") },
    ...(isAuthenticated
      ? [
          { href: "/chat", label: t("Navbar.chat"), newTab: true },
          { href: "/dashboard", label: t("Navbar.dashboard"), newTab: true },
          {
            href: "/ai-assistant",
            label: t("Navbar.aiAssistant"),
            newTab: true,
          },
          // { href: "/subscriptions", label: t("Navbar.subscriptions") },
        ]
      : []),
  ];

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.15, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: { duration: 0.1, ease: "easeIn" },
    },
  };

  // Get user initial for avatar
  const getUserInitial = () => {
    if (!userInfo) return "";
    if (userInfo.name) return userInfo.name.charAt(0).toUpperCase();
    if (userInfo.email) return userInfo.email.charAt(0).toUpperCase();
    return "U";
  };

  const createDesktopNavLinks = () =>
    navLinks.map((link) =>
      link.newTab
        ? // For links that should open in new tab, use regular <a> tag
          React.createElement(
            "a",
            {
              key: link.href,
              href: link.href,
              target: "_blank",
              rel: "noopener noreferrer",
              className: `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-900/5 dark:hover:bg-slate-100/5 hover:text-slate-900 dark:hover:text-slate-100"
              }`,
            },
            link.label
          )
        : // For regular links, use Next.js Link
          React.createElement(
            Link,
            {
              key: link.href,
              href: link.href,
              className: `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-900/5 dark:hover:bg-slate-100/5 hover:text-slate-900 dark:hover:text-slate-100"
              }`,
            },
            link.label
          )
    );

  const createMobileNavLinks = () =>
    navLinks.map((link) =>
      link.newTab
        ? // For mobile links that should open in new tab
          React.createElement(
            "a",
            {
              key: link.href,
              href: link.href,
              target: "_blank",
              rel: "noopener noreferrer",
              className: `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                pathname === link.href
                  ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-900/5 dark:hover:bg-slate-100/5"
              }`,
              onClick: () => setIsMobileMenuOpen(false),
            },
            link.label
          )
        : // For regular mobile links
          React.createElement(
            Link,
            {
              key: link.href,
              href: link.href,
              className: `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                pathname === link.href
                  ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-900/5 dark:hover:bg-slate-100/5"
              }`,
              onClick: () => setIsMobileMenuOpen(false),
            },
            link.label
          )
    );

  const handleLogout = () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLocalUser(null);
      setHasToken(false);
      setIsProfileDropdownOpen(false);
      logout(); // will route to /login
    }
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return React.createElement(
    "nav",
    {
      className: `fixed top-0 left-0 right-0 z-50 transition-all duration-300
      bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-lg
      ${
        isScrolled || isMobileMenuOpen
          ? "border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm"
          : "border-transparent"
      }`,
    },
    React.createElement(
      "div",
      { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" },
      React.createElement(
        "div",
        { className: "flex justify-between h-16" },
        // Logo
        React.createElement(
          "div",
          { className: "flex items-center" },
          React.createElement(
            Link,
            {
              href: "/",
              className: "flex items-center space-x-2.5 group",
              onClick: () => setIsMobileMenuOpen(false),
            },
            React.createElement(
              "div",
              {
                className:
                  "w-9 h-9 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300",
              },
              React.createElement(Sparkles, { className: "w-5 h-5 text-white" })
            ),
            React.createElement(
              "span",
              {
                className:
                  "text-xl font-semibold tracking-tight text-slate-900 dark:text-white",
              },
              t("Navbar.ashaSakhi")
            )
          )
        ),
        // Desktop Navigation
        React.createElement(
          "div",
          { className: "hidden md:flex items-center space-x-2" },
          ...createDesktopNavLinks()
        ),
        // Right side - Auth, Language & Theme
        React.createElement(
          "div",
          { className: "flex items-center space-x-3" },
          React.createElement(ThemeToggle),
          React.createElement(LanguageSwitcher),
          React.createElement(
            "div",
            { className: "hidden md:flex items-center space-x-3" },
            !loading &&
              isClient &&
              (isAuthenticated
                ? React.createElement(
                    "div",
                    {
                      className: "relative",
                      ref: profileDropdownRef,
                    },
                    // Profile Avatar Button
                    React.createElement(
                      "button",
                      {
                        onClick: toggleProfileDropdown,
                        className:
                          "flex items-center space-x-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group",
                        "aria-label": "Profile menu",
                      },
                      React.createElement(
                        "div",
                        {
                          className:
                            "w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-500 text-white font-medium text-sm ring-2 ring-white dark:ring-slate-900 group-hover:ring-slate-200 dark:group-hover:ring-slate-700 transition-all",
                        },
                        getUserInitial()
                      ),
                      React.createElement(ChevronDown, {
                        className: `w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${
                          isProfileDropdownOpen ? "rotate-180" : ""
                        }`,
                      })
                    ),
                    // Dropdown Menu
                    React.createElement(
                      AnimatePresence,
                      null,
                      isProfileDropdownOpen &&
                        React.createElement(
                          motion.div,
                          {
                            variants: dropdownVariants,
                            initial: "hidden",
                            animate: "visible",
                            exit: "exit",
                            className:
                              "absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg ring-1 ring-slate-200 dark:ring-slate-700 py-1 z-50",
                          },
                          // User Info Header
                          React.createElement(
                            "div",
                            {
                              className:
                                "px-4 py-3 border-b border-slate-200 dark:border-slate-700",
                            },
                            React.createElement(
                              "p",
                              {
                                className:
                                  "text-sm font-medium text-slate-900 dark:text-slate-100 truncate",
                              },
                              userInfo?.name || "User"
                            ),
                            React.createElement(
                              "p",
                              {
                                className:
                                  "text-xs text-slate-500 dark:text-slate-400 truncate",
                              },
                              userInfo?.email || ""
                            )
                          ),
                          // Profile Link
                          React.createElement(
                            Link,
                            {
                              href: "/settings",
                              className:
                                "flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors",
                              onClick: () => setIsProfileDropdownOpen(false),
                            },
                            React.createElement(User, {
                              className:
                                "w-4 h-4 mr-3 text-slate-500 dark:text-slate-400",
                            }),
                            t("Navbar.profile")
                          ),
                          // Logout Button
                          React.createElement(
                            "button",
                            {
                              onClick: handleLogout,
                              className:
                                "w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors",
                            },
                            React.createElement(LogOut, {
                              className: "w-4 h-4 mr-3",
                            }),
                            t("Navbar.logout")
                          )
                        )
                    )
                  )
                : React.createElement(
                    React.Fragment,
                    null,
                    React.createElement(
                      Link,
                      {
                        href: "/login",
                        className:
                          "px-3 py-2 rounded-md text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-900/5 dark:hover:bg-slate-100/5 hover:text-slate-900 dark:hover:text-slate-100 transition-colors",
                      },
                      t("Navbar.login")
                    ),
                    React.createElement(
                      Link,
                      {
                        href: "/register",
                        className:
                          "px-4 py-2 rounded-md text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors",
                      },
                      t("Navbar.getStarted")
                    )
                  ))
          ),
          // Mobile toggle
          React.createElement(
            "button",
            {
              ref: mobileMenuButtonRef,
              onClick: toggleMobileMenu,
              className:
                "md:hidden p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-900/5 dark:hover:bg-slate-100/5 transition-colors",
              "aria-label": "Toggle mobile menu",
            },
            isMobileMenuOpen
              ? React.createElement(X, { className: "w-6 h-6" })
              : React.createElement(Menu, { className: "w-6 h-6" })
          )
        )
      ),
      // Mobile Navigation
      React.createElement(
        AnimatePresence,
        null,
        isMobileMenuOpen &&
          React.createElement(
            motion.div,
            {
              variants: mobileMenuVariants,
              initial: "hidden",
              animate: "visible",
              exit: "exit",
              className:
                "md:hidden fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800/80 z-40 overflow-y-auto",
              ref: mobileMenuRef,
            },
            React.createElement(
              "div",
              { className: "px-4 pt-4 pb-6 space-y-2" },
              ...createMobileNavLinks(),
              React.createElement(
                "div",
                {
                  className:
                    "pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2",
                },
                !loading &&
                  isClient &&
                  (isAuthenticated
                    ? React.createElement(
                        React.Fragment,
                        null,
                        React.createElement(
                          "div",
                          {
                            className: "flex items-center px-3 py-2 space-x-3",
                          },
                          React.createElement(
                            "div",
                            {
                              className:
                                "w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-500 text-white font-medium text-sm",
                            },
                            getUserInitial()
                          ),
                          React.createElement(
                            "div",
                            { className: "flex-1" },
                            React.createElement(
                              "p",
                              {
                                className:
                                  "font-medium text-slate-900 dark:text-slate-100 text-sm",
                              },
                              userInfo?.name || "User"
                            ),
                            React.createElement(
                              "p",
                              {
                                className:
                                  "text-xs text-slate-500 dark:text-slate-400",
                              },
                              userInfo?.email || ""
                            )
                          )
                        ),
                        React.createElement(
                          Link,
                          {
                            href: "/profile",
                            className:
                              "flex items-center px-3 py-2 rounded-md text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-900/5 dark:hover:bg-slate-100/5 transition-colors",
                            onClick: () => setIsMobileMenuOpen(false),
                          },
                          React.createElement(User, {
                            className: "w-5 h-5 mr-2",
                          }),
                          t("Navbar.profile")
                        ),
                        React.createElement(
                          "button",
                          {
                            onClick: () => {
                              handleLogout();
                              setIsMobileMenuOpen(false);
                            },
                            className:
                              "w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-500 hover:bg-red-500/10 transition-colors",
                          },
                          React.createElement(LogOut, {
                            className: "w-5 h-5 mr-2",
                          }),
                          t("Navbar.logout")
                        )
                      )
                    : React.createElement(
                        React.Fragment,
                        null,
                        React.createElement(
                          Link,
                          {
                            href: "/login",
                            className:
                              "block px-3 py-2 rounded-md text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-900/5 dark:hover:bg-slate-100/5",
                            onClick: () => setIsMobileMenuOpen(false),
                          },
                          t("Navbar.login")
                        ),
                        React.createElement(
                          Link,
                          {
                            href: "/register",
                            className:
                              "block w-full text-center px-3 py-3 rounded-md text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors",
                            onClick: () => setIsMobileMenuOpen(false),
                          },
                          t("Navbar.getStarted")
                        )
                      ))
              )
            )
          )
      )
    )
  );
}
