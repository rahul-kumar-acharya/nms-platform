import React from 'react';

// Base Pulsing Skeleton Box
export function SkeletonBox({ className = '' }) {
  return (
    <div className={`bg-[#E8E2D6]/80 dark:bg-[#2C2824]/40 animate-pulse rounded-lg ${className}`} />
  );
}

// Card Skeleton
export function SkeletonCard({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="glass-card p-6 border-[#C5A059]/40 space-y-4 animate-pulse">
          <div className="flex justify-between items-center">
            <SkeletonBox className="h-5 w-24" />
            <SkeletonBox className="h-5 w-16" />
          </div>
          <SkeletonBox className="h-8 w-3/4" />
          <SkeletonBox className="h-10 w-1/2" />
          <div className="pt-4 border-t border-[#E2DDD1] space-y-2">
            <SkeletonBox className="h-4 w-full" />
            <SkeletonBox className="h-4 w-5/6" />
            <SkeletonBox className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Table Skeleton
export function SkeletonTable({ rows = 5, cols = 6 }) {
  return (
    <div className="glass-card p-6 space-y-4 animate-pulse">
      <div className="flex justify-between items-center pb-2">
        <SkeletonBox className="h-6 w-48" />
        <SkeletonBox className="h-8 w-32" />
      </div>
      <div className="space-y-3">
        <div className="h-10 bg-[#E8E2D6]/90 rounded-lg" />
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="flex items-center justify-between gap-4 p-3 border-b border-[#E2DDD1]/60">
            {Array.from({ length: cols }).map((_, cIdx) => (
              <SkeletonBox key={cIdx} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Dashboard Overview Skeleton
export function SkeletonDashboard() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Banner Skeleton */}
      <div className="glass-card p-6 bg-[#1B3B2B]/10 border-[#C5A059]/30 flex justify-between items-center">
        <div className="space-y-2 w-2/3">
          <SkeletonBox className="h-8 w-1/2" />
          <SkeletonBox className="h-4 w-3/4" />
        </div>
        <SkeletonBox className="h-10 w-32" />
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="glass-card p-5 space-y-3 border-[#C5A059]/30">
            <div className="flex justify-between items-center">
              <SkeletonBox className="h-4 w-24" />
              <SkeletonBox className="h-8 w-8 rounded-xl" />
            </div>
            <SkeletonBox className="h-8 w-32" />
            <SkeletonBox className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <SkeletonTable rows={4} cols={5} />
    </div>
  );
}

// Tree Hierarchy Skeleton
export function SkeletonTree() {
  return (
    <div className="glass-card p-12 text-center space-y-8 animate-pulse">
      <div className="flex flex-col items-center space-y-3">
        <SkeletonBox className="w-20 h-20 rounded-2xl" />
        <SkeletonBox className="h-5 w-36" />
        <SkeletonBox className="h-4 w-24" />
      </div>

      <div className="w-1/2 mx-auto h-0.5 bg-[#C5A059]/30" />

      <div className="flex justify-around items-center gap-6">
        <div className="flex flex-col items-center space-y-2">
          <SkeletonBox className="w-14 h-14 rounded-xl" />
          <SkeletonBox className="h-4 w-24" />
        </div>
        <div className="flex flex-col items-center space-y-2">
          <SkeletonBox className="w-14 h-14 rounded-xl" />
          <SkeletonBox className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}
