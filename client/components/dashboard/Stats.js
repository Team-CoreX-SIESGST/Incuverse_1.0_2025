"use client";

import { useState } from "react";
import {
  Users,
  TrendingUp,
  FileText,
  BarChart3,
  PieChart,
  Settings,
} from "lucide-react";

export default function Stats() {
  const [timeRange, setTimeRange] = useState("month");

  const statsData = {
    totalWorkers: 1247,
    activeWorkers: 892,
    pendingApprovals: 45,
    totalForms: 23,
    formResponses: 12456,
    avgResponseTime: "2.3 days",
  };

  const chartData = {
    monthly: [65, 59, 80, 81, 56, 55, 40, 45, 60, 75, 80, 90],
    weekly: [45, 52, 38, 24, 33, 26, 45],
    daily: [12, 19, 3, 5, 2, 3, 15],
  };

  const topForms = [
    { name: "Health Assessment", responses: 2345, completion: 92 },
    { name: "Maternal Care", responses: 1876, completion: 88 },
    { name: "Child Nutrition", responses: 1567, completion: 85 },
    { name: "Vaccination", responses: 1432, completion: 91 },
  ];

  const getCurrentData = () => {
    return timeRange === "day"
      ? chartData.daily
      : timeRange === "week"
      ? chartData.weekly
      : chartData.monthly;
  };

  const getLabels = () => {
    if (timeRange === "day")
      return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    if (timeRange === "week")
      return Array.from({ length: 7 }, (_, i) => `W${i + 1}`);
    return [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Statistics & Analytics
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Overview of platform usage and performance
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
        >
          <option value="day">Last 7 Days</option>
          <option value="week">Last 4 Weeks</option>
          <option value="month">Last 12 Months</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 ring-1 ring-slate-900/10 dark:ring-slate-100/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total Workers
            </h3>
            <Users className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {statsData.totalWorkers.toLocaleString()}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <span className="text-emerald-600 dark:text-emerald-400">+12%</span>{" "}
            from last month
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 ring-1 ring-slate-900/10 dark:ring-slate-100/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Active Workers
            </h3>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {statsData.activeWorkers.toLocaleString()}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <span className="text-emerald-600 dark:text-emerald-400">+8%</span>{" "}
            from last month
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 ring-1 ring-slate-900/10 dark:ring-slate-100/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Pending Approvals
            </h3>
            <FileText className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {statsData.pendingApprovals}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <span className="text-red-600 dark:text-red-400">-3%</span> from
            last week
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 ring-1 ring-slate-900/10 dark:ring-slate-100/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total Forms
            </h3>
            <BarChart3 className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {statsData.totalForms}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <span className="text-emerald-600 dark:text-emerald-400">+5</span>{" "}
            new this month
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 ring-1 ring-slate-900/10 dark:ring-slate-100/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Form Responses
            </h3>
            <PieChart className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {statsData.formResponses.toLocaleString()}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <span className="text-emerald-600 dark:text-emerald-400">+23%</span>{" "}
            from last month
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 ring-1 ring-slate-900/10 dark:ring-slate-100/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Avg Response Time
            </h3>
            <Settings className="w-5 h-5 text-cyan-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {statsData.avgResponseTime}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <span className="text-emerald-600 dark:text-emerald-400">
              -0.5 days
            </span>{" "}
            improvement
          </div>
        </div>
      </div>

      {/* Charts and Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 ring-1 ring-slate-900/10 dark:ring-slate-100/10">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-6">
            Activity Overview
          </h3>
          <div className="h-64 flex items-end justify-between gap-1">
            {getCurrentData().map((value, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-gradient-to-t from-emerald-500 to-green-500 rounded-t transition-all duration-300"
                  style={{ height: `${(value / 100) * 200}px` }}
                />
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  {getLabels()[index]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Forms */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 ring-1 ring-slate-900/10 dark:ring-slate-100/10">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-6">
            Top Performing Forms
          </h3>
          <div className="space-y-4">
            {topForms.map((form, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-slate-900 dark:text-white">
                    {form.name}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {form.responses.toLocaleString()} responses
                  </div>
                </div>
                <div className="w-20 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${form.completion}%` }}
                  />
                </div>
                <div className="text-sm font-medium text-slate-900 dark:text-white w-12 text-right">
                  {form.completion}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
