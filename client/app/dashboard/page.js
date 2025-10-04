"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ManualRegistration } from "@/components/dashboard/ManualRegistration";
import { VoiceRegistration } from "@/components/dashboard/VoiceRegistration";
import { PatientList } from "@/components/dashboard/PatientList";
export default function Dashboard() {
  const { loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("manual");

  const user =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "manual":
        return <ManualRegistration />;
      case "voice":
        return <VoiceRegistration />;
      case "patients":
        return <PatientList />;
      default:
        return <ManualRegistration />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}
