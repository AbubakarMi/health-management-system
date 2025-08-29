"use client"

import React, { Suspense, lazy, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// Lazy load chart components for better performance
const LazyFinancialChart = lazy(() => import('./financial-overview-chart').then(module => ({ default: module.FinancialOverviewChart })));
const LazyPatientStatusChart = lazy(() => import('./patient-status-chart').then(module => ({ default: module.PatientStatusChart })));
const LazyMedicationChart = lazy(() => import('./medication-availability-chart').then(module => ({ default: module.MedicationAvailabilityChart })));
const LazyLabVisitsChart = lazy(() => import('./lab-visits-chart').then(module => ({ default: module.LabVisitsChart })));
const LazyDoctorAdmissionsChart = lazy(() => import('./doctor-admissions-chart').then(module => ({ default: module.DoctorAdmissionsChart })));

// Chart loading skeleton with beautiful animation
const ChartSkeleton = () => (
  <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-card via-card to-primary/5">
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 bg-gradient-to-r from-teal-400/20 via-cyan-400/20 to-blue-500/20" />
          <Skeleton className="h-4 w-64 bg-muted/50" />
        </div>
        <Skeleton className="h-8 w-24 rounded-full bg-gradient-to-r from-primary/20 to-accent/20" />
      </div>
      
      <div className="grid grid-cols-4 gap-3 mt-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="text-center p-3 rounded-lg bg-gradient-to-br from-primary/5 to-accent/5">
            <Skeleton className="w-5 h-5 mx-auto mb-2 rounded-full" />
            <Skeleton className="h-6 w-12 mx-auto mb-1" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
        ))}
      </div>
    </CardHeader>
    <CardContent className="h-[28rem] pt-4">
      <div className="w-full h-full flex items-center justify-center">
        <div className="space-y-4 w-full">
          <Skeleton className="h-8 w-full bg-gradient-to-r from-teal-400/20 to-cyan-400/20 animate-pulse" />
          <Skeleton className="h-8 w-4/5 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 animate-pulse delay-75" />
          <Skeleton className="h-8 w-3/4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse delay-150" />
          <Skeleton className="h-8 w-5/6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse delay-225" />
          <div className="flex items-center justify-center pt-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Chart cache implementation
class ChartCache {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes cache

  set(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  get(key: string) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  clear() {
    this.cache.clear();
  }
}

const chartCache = new ChartCache();

// High-performance chart wrapper with caching and optimization
interface OptimizedChartProps {
  type: 'financial' | 'patient-status' | 'medication' | 'lab-visits' | 'doctor-admissions';
  data?: any;
  cacheKey?: string;
  priority?: 'high' | 'normal' | 'low';
}

export function OptimizedChart({ type, data, cacheKey, priority = 'normal' }: OptimizedChartProps) {
  // Implement caching strategy
  const cachedData = useMemo(() => {
    if (cacheKey) {
      const cached = chartCache.get(cacheKey);
      if (cached) return cached;
      
      if (data) {
        chartCache.set(cacheKey, data);
        return data;
      }
    }
    return data;
  }, [data, cacheKey]);

  // Performance-based loading strategy
  const LoadingComponent = useMemo(() => {
    const delay = priority === 'high' ? 0 : priority === 'normal' ? 100 : 500;
    
    return () => (
      <div style={{ animationDelay: `${delay}ms` }} className="animate-fade-in">
        <ChartSkeleton />
      </div>
    );
  }, [priority]);

  // Render optimized chart component
  const renderChart = () => {
    switch (type) {
      case 'financial':
        return <LazyFinancialChart />;
      case 'patient-status':
        return <LazyPatientStatusChart patients={cachedData || []} />;
      case 'medication':
        return <LazyMedicationChart />;
      case 'lab-visits':
        return <LazyLabVisitsChart />;
      case 'doctor-admissions':
        return <LazyDoctorAdmissionsChart />;
      default:
        return <ChartSkeleton />;
    }
  };

  return (
    <Suspense fallback={<LoadingComponent />}>
      <div className="transform transition-all duration-500 hover:scale-[1.02]">
        {renderChart()}
      </div>
    </Suspense>
  );
}

// Batch chart loader for dashboard pages
interface ChartBatchLoaderProps {
  charts: Array<{
    type: OptimizedChartProps['type'];
    data?: any;
    priority?: OptimizedChartProps['priority'];
  }>;
  columns?: 1 | 2 | 3;
}

export function ChartBatchLoader({ charts, columns = 2 }: ChartBatchLoaderProps) {
  const gridClass = useMemo(() => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 lg:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';
      default: return 'grid-cols-1 lg:grid-cols-2';
    }
  }, [columns]);

  return (
    <div className={`grid ${gridClass} gap-6`}>
      {charts.map((chart, index) => (
        <OptimizedChart
          key={`${chart.type}-${index}`}
          type={chart.type}
          data={chart.data}
          cacheKey={`chart-${chart.type}-${index}`}
          priority={chart.priority}
        />
      ))}
    </div>
  );
}

export { chartCache };