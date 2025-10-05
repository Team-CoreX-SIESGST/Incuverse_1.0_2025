"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  UserPlus,
  List,
  Menu,
  X,
  LogOut,
  Mic,
  FileText,
  Home,
  BarChart3,
} from "lucide-react";
import VerifyASHAWorkers from "../dashboard/VerifyASHAWorkers";
import CreateForms from "../dashboard/CreateForms";
import Stats from "../dashboard/Stats";
import { Navbar } from "./Navbar";

export default function DashboardLayout({ children, activeTab, onTabChange }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  const menuItems = [
    {
      id: "registration",
      label: "Patient Registration",
      icon: UserPlus,
      subItems: [
        {
          id: "manual",
          label: "Manual Registration",
          icon: FileText,
        },
        {
          id: "voice",
          label: "Voice Registration",
          icon: Mic,
        },
      ],
    },
    {
      id: "patients",
      label: "Patients List",
      icon: List,
    },
  ];

  // Add admin menu items if user is admin
  if (user?.isAdmin) {
    menuItems.push(
      {
        id: "verify-asha",
        label: "Verify ASHA Workers",
        icon: Users,
      },
      {
        id: "create-forms",
        label: "Create Forms",
        icon: FileText,
      },
      {
        id: "stats",
        label: "Statistics",
        icon: BarChart3,
      }
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "verify-asha":
        return <VerifyASHAWorkers />;
      case "create-forms":
        return <CreateForms />;
      case "stats":
        return <Stats />;
      default:
        return children;
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Mobile Sidebar */}
      <Navbar/>
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-600 bg-opacity-75 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0  top-10 w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-xl ring-1 ring-slate-900/10 dark:ring-slate-100/10">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center">
                <div className="w-8 h-8  bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center shadow-lg mr-3">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                  ASHA Dashboard
                </h1>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="mt-4 px-4">
              {menuItems.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => {
                      if (item.subItems) {
                        onTabChange(item.subItems[0].id);
                      } else {
                        onTabChange(item.id);
                      }
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-xl mb-2 ${
                      activeTab === item.id ||
                      item.subItems?.some((sub) => sub.id === activeTab)
                        ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    } transition-all duration-200`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                  {item.subItems && (
                    <div className="ml-4 space-y-1">
                      {item.subItems.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => {
                            onTabChange(subItem.id);
                            setSidebarOpen(false);
                          }}
                          className={`w-full flex items-center px-4 py-2 text-left rounded-lg text-sm ${
                            activeTab === subItem.id
                              ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-200 dark:ring-emerald-800"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                          } transition-colors duration-200`}
                        >
                          <subItem.icon className="w-4 h-4 mr-3" />
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-1 min-h-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-r border-slate-200 dark:border-slate-700 ring-1 ring-slate-900/5 dark:ring-slate-100/10">
            <div className="flex items-center justify-between flex-shrink-0 px-6 py-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center shadow-lg mr-3">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                  ASHA Dashboard
                </h1>
              </div>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
              {menuItems.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => {
                      if (item.subItems) {
                        onTabChange(item.subItems[0].id);
                      } else {
                        onTabChange(item.id);
                      }
                    }}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-xl ${
                      activeTab === item.id ||
                      item.subItems?.some((sub) => sub.id === activeTab)
                        ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    } transition-all duration-200`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                  {item.subItems && (
                    <div className="ml-4 mt-2 space-y-1">
                      {item.subItems.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => onTabChange(subItem.id)}
                          className={`w-full flex items-center px-4 py-2 text-left rounded-lg text-sm ${
                            activeTab === subItem.id
                              ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-200 dark:ring-emerald-800"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                          } transition-colors duration-200`}
                        >
                          <subItem.icon className="w-4 h-4 mr-3" />
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            <div className="flex-shrink-0 p-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:pl-64 flex flex-col flex-1">
          {/* Top Bar */}
          <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 ring-1 ring-slate-900/5 dark:ring-slate-100/10 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="px-4 border-r border-slate-200 dark:border-slate-700 text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500 lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1 flex justify-between px-4">
              <div className="flex-1 flex items-center">
                <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                  ASHA Dashboard
                </h1>
              </div>
              <div className="flex items-center">
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <main className="flex-1 pb-8">
            <div className="max-w-full">{renderContent()}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
