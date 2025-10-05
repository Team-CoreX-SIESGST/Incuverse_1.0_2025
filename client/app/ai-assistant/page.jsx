"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import NavigationTabs from "./NavigationTabs";
import ConsultationTab from "./ConsultationTab";
import LifestyleTab from "./LifestyleTab";
import SymtomsTab from "./SymtomsTab";
import {
  fullConsultation,
  lifestyleRecommendations,
  predictDisease
} from "@/services/python_server/pythonServer";
import { Bot } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

export default function AIAssistant() {
  // const { user } = useAuth();
  const [ user , setUser ] = useState(null);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("consultation");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [consultationResult, setConsultationResult] = useState(null);
  const [lifestyleData, setLifestyleData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("user");
    setUser(data);
    if (!data) {
      router.push("/login");
    }
  }, [user, router]);

  const handleFullConsultation = async () => {
    if (!audioBlob && !selectedImage) {
      alert("Please provide audio or image for consultation");
      return;
    }

    setIsLoading(true);
    try {
      // Debug: Check what we're adding
      console.log("Audio blob:", audioBlob);
      console.log("Selected image:", selectedImage);

      // Pass the files directly to fullConsultation
      const result = await fullConsultation(selectedImage, audioBlob);
      console.log(result,"fewoihfweo")
      setConsultationResult(result.data);
    } catch (error) {
      console.error("Consultation error:", error);
      alert("Consultation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLifestyleRecommendations = async () => {
    const userProfile = {
      age: 35,
      gender: "female",
      height_cm: 165,
      weight_kg: 65,
      activity_level: 1,
      symptoms: ["fatigue", "headache"],
      conditions: ["hypertension"],
      symptom_severity: 1,
    };

    setIsLoading(true);
    try {
      const result = await lifestyleRecommendations(userProfile);
      setLifestyleData(result.data.recommendations);
    } catch (error) {
      console.error("Lifestyle recommendations error:", error);
      alert("Failed to generate recommendations");
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = (audioBase64) => {
    const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
    audio.play();
  };

  if (!user) {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 mt-20 dark:bg-slate-950 py-8">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* <Header /> */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <div className="lg:col-span-2">
            {activeTab === "consultation" && (
              <ConsultationTab
                isRecording={isRecording}
                setIsRecording={setIsRecording}
                audioBlob={audioBlob}
                setAudioBlob={setAudioBlob}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                consultationResult={consultationResult}
                isLoading={isLoading}
                onConsult={handleFullConsultation}
                onPlayAudio={playAudio}
              />
            )}

            {activeTab === "lifestyle" && (
              <LifestyleTab
                lifestyleData={lifestyleData}
                isLoading={isLoading}
                onGenerate={handleLifestyleRecommendations}
              />
            )}

            {activeTab === "symtomstab" && <SymtomsTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-200/50 dark:bg-slate-100/5 ring-1 ring-inset ring-slate-900/10 dark:ring-slate-100/10 mb-6 backdrop-blur-lg">
        <Bot className="w-4 h-4 text-emerald-500 dark:text-emerald-400 mr-2" />
        <span className="text-sm font-medium text-slate-800 dark:text-slate-300">
          AI Health Assistant
        </span>
      </div>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
        AI Health Assistant
      </h1>
      <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
        Get personalized health consultations, lifestyle recommendations, and
        medical insights powered by AI.
      </p>
    </div>
  );
}
