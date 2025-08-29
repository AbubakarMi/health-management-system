"use client"

import { AnalyticsDashboard } from "@/components/advanced/analytics-dashboard";

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold nubenta-gradient-text">
            Advanced Analytics Dashboard
          </h1>
          <div className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 text-white rounded-full animate-pulse-slow">
            Powered by Nubenta AI
          </div>
        </div>
        <p className="text-muted-foreground">
          Comprehensive healthcare analytics with predictive insights and performance monitoring
        </p>
      </div>
      
      <AnalyticsDashboard />
    </div>
  );
}