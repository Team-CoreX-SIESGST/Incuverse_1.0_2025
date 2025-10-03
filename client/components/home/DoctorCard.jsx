import Lottie from "lottie-react";
import doctorAnimation from "/public/Doctor.json"; // or Doctor.lottie

export default function DoctorCard() {
  return (
    <div className="bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl p-1 shadow-xl">
      <div className="bg-slate-900 rounded-xl p-8 text-center">
        <div className="w-full h-64 bg-slate-800 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
          <Lottie
            animationData={doctorAnimation}
            loop
            autoplay
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <p className="text-slate-400 text-sm">
          Demo: Voice-based patient registration in action
        </p>
      </div>
    </div>
  );
}
