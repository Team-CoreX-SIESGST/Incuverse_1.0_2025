import { Bot, Mic, Users, Activity, ArrowRight } from "lucide-react";

export default function NavigationTabs({ activeTab, setActiveTab }) {
  const tabs = [
    {
      id: "consultation",
      icon: Mic,
      label: "AI Consultation",
      description: "Voice and image analysis",
    },
    {
      id: "lifestyle",
      icon: Activity,
      label: "Lifestyle Tips",
      description: "Personalized recommendations",
    },
    {
      id: "symtomstab",
      icon: Users,
      label: "Symtoms",
      description: "Symtoms",
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 ring-1 ring-slate-900/10 dark:ring-slate-100/10 shadow-lg">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        Health Assistant
      </h3>
      <div className="space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full p-4 rounded-xl transition-all duration-300 text-left group ${
                activeTab === tab.id
                  ? "bg-emerald-50 dark:bg-emerald-950/20 ring-2 ring-emerald-500/50"
                  : "bg-slate-50 dark:bg-slate-800/50 ring-1 ring-slate-900/10 dark:ring-slate-100/10 hover:ring-slate-900/20"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg ${
                    activeTab === tab.id
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4
                    className={`font-medium ${
                      activeTab === tab.id
                        ? "text-emerald-900 dark:text-emerald-100"
                        : "text-slate-900 dark:text-slate-100"
                    }`}
                  >
                    {tab.label}
                  </h4>
                  <p
                    className={`text-sm ${
                      activeTab === tab.id
                        ? "text-emerald-700 dark:text-emerald-300"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {tab.description}
                  </p>
                </div>
                <ArrowRight
                  className={`w-4 h-4 ${
                    activeTab === tab.id ? "text-emerald-500" : "text-slate-400"
                  } group-hover:translate-x-1 transition-transform`}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* <QuickStats /> */}
    </div>
  );
}

function QuickStats() {
  return (
    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
      <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
        Today's Activity
      </h4>
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Consultations", value: "12", icon: Mic },
          { label: "Patients", value: "47", icon: Users },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
            >
              <Icon className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
