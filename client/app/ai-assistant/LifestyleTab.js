import { motion } from "framer-motion";
import { Activity, Sparkles, Shield } from "lucide-react";
import RecommendationSection from "./RecommendationSection";

export default function LifestyleTab({ lifestyleData, isLoading, onGenerate }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 ring-1 ring-slate-900/10 dark:ring-slate-100/10 shadow-lg">
      <TabHeader
        icon={Activity}
        title="Lifestyle Recommendations"
        description="Personalized health and wellness tips"
      />

      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mb-8"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Generating Recommendations...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            <span>Generate Personalized Recommendations</span>
          </>
        )}
      </button>

      {lifestyleData && <LifestyleResults lifestyleData={lifestyleData} />}
    </div>
  );
}

function TabHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-center mb-6">
      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-md mr-4">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {title}
        </h2>
        <p className="text-slate-600 dark:text-slate-400">{description}</p>
      </div>
    </div>
  );
}

function LifestyleResults({ lifestyleData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <PriorityBadge
        priorityLevel={lifestyleData.priority_level}
        confidence={lifestyleData.confidence}
      />

      <RecommendationSection
        title="General Health Tips"
        icon="Heart"
        recommendations={lifestyleData.general_recommendations}
        color="blue"
      />

      {lifestyleData.specific_recommendations.length > 0 && (
        <RecommendationSection
          title="Specific Recommendations"
          icon="Zap"
          recommendations={lifestyleData.specific_recommendations}
          color="emerald"
        />
      )}

      <RecommendationSection
        title="Age-appropriate Advice"
        icon="Calendar"
        recommendations={lifestyleData.age_specific}
        color="purple"
      />
    </motion.div>
  );
}

function PriorityBadge({ priorityLevel, confidence }) {
  const getPriorityStyles = (level) => {
    switch (level) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
    }
  };

  return (
    <div
      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getPriorityStyles(
        priorityLevel
      )}`}
    >
      <Shield className="w-4 h-4 mr-2" />
      {priorityLevel.toUpperCase()} PRIORITY • {Math.round(confidence * 100)}%
      Confidence
    </div>
  );
}
