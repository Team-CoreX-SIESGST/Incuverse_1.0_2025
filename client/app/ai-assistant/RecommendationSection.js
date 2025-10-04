import { Heart, Zap, Calendar } from "lucide-react";

export default function RecommendationSection({
  title,
  icon,
  recommendations,
  color = "emerald",
}) {
  const colorClasses = {
    emerald:
      "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-100",
    blue: "bg-blue-50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-100",
    purple:
      "bg-purple-50 dark:bg-purple-950/20 text-purple-900 dark:text-purple-100",
  };

  const IconComponent = getIconComponent(icon);

  return (
    <div className={`rounded-xl p-6 ${colorClasses[color]}`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <IconComponent className="w-5 h-5 mr-2" />
        {title}
      </h3>
      <ul className="space-y-3">
        {recommendations.map((rec, index) => (
          <li key={index} className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-current rounded-full mt-2 shrink-0" />
            <span className="text-sm">{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function getIconComponent(iconName) {
  switch (iconName) {
    case "Heart":
      return Heart;
    case "Zap":
      return Zap;
    case "Calendar":
      return Calendar;
    default:
      return Heart;
  }
}
