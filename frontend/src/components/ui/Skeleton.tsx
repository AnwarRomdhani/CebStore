import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-white/60 p-5 backdrop-blur dark:bg-black/20 animate-pulse">
      <div className="aspect-square w-full rounded-lg bg-muted mb-3" />
      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
      <div className="h-3 bg-muted rounded w-1/2 mb-4" />
      <div className="flex items-center justify-between mt-auto">
        <div className="h-6 bg-muted rounded w-20" />
        <div className="h-8 bg-muted rounded w-24" />
      </div>
    </div>
  );
}


export function TableRowSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-border animate-pulse">
          <td className="py-3 px-4">
            <div className="h-4 bg-muted rounded w-32" />
          </td>
          <td className="py-3 px-4">
            <div className="h-4 bg-muted rounded w-24" />
          </td>
          <td className="py-3 px-4">
            <div className="h-4 bg-muted rounded w-20" />
          </td>
          <td className="py-3 px-4">
            <div className="h-4 bg-muted rounded w-16" />
          </td>
        </tr>
      ))}
    </>
  );
}


export function StatsCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-white/60 p-5 backdrop-blur dark:bg-black/20 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-lg bg-muted" />
        <div className="flex-1">
          <div className="h-3 bg-muted rounded w-24 mb-2" />
          <div className="h-8 bg-muted rounded w-16" />
        </div>
      </div>
    </div>
  );
}


export function PageSkeleton() {
  return (
    <div className="grid gap-6">
      <div className="h-20 bg-muted rounded-xl animate-pulse" />
      <div className="grid gap-4 md:grid-cols-3">
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
      </div>
    </div>
  );
}


export function TextSkeleton({ lines = 1 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-muted rounded animate-pulse"
          style={{ width: `${100 - i * 10}%` }}
        />
      ))}
    </div>
  );
}
