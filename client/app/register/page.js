"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AuthStep from "@/components/auth/AuthStep";
import BasicDetailsStep from "@/components/auth/BasicDetailsStep";
import AshaDetailsStep from "@/components/auth/AshaDetailsStep";
import { Navbar } from "@/components/layout/Navbar";

const FADE_IN_STAGGER_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const FADE_IN_UP_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState({
    // Auth step data
    email: "",
    password: "",
    name: "",
    date_of_birth: "",
    verificationToken: "",

    // Asha details data
    ashaId: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
    location: {
      lat: 0,
      lng: 0,
      formattedAddress: "",
    },
    yearsOfExperience: "",
    qualifications: [],
    languages: ["Hindi", "English"],
    governmentId: "",
    idDocument: null,
  });

  const handleNextStep = (data) => {
    setUserData((prev) => ({ ...prev, ...data }));
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <AuthStep onNext={handleNextStep} initialData={userData} />;
      case 2:
        return (
          <BasicDetailsStep
            onNext={handleNextStep}
            onBack={handlePrevStep}
            initialData={userData}
          />
        );
      case 3:
        return (
          <AshaDetailsStep onBack={handlePrevStep} initialData={userData} />
        );
      default:
        return <AuthStep onNext={handleNextStep} initialData={userData} />;
    }
  };

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 pt-16">
        <Navbar />
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_45rem_at_50%_50%,_theme(colors.emerald.100),_transparent_80%)] dark:bg-[radial-gradient(45rem_45rem_at_50%_50%,_theme(colors.emerald.950/40%),_transparent_80%)]"
          aria-hidden="true"
        />

        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN_STAGGER_VARIANTS}
          className="max-w-md w-full space-y-8"
        >
          {renderStep()}
        </motion.div>
      </div>
    </>
  );
}
