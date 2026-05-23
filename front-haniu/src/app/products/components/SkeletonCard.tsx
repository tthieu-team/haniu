'use client';

export default function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-[28px] border border-slate-100 dark:border-zinc-800/80 p-5 space-y-4 animate-pulse">
      <div className="aspect-square bg-slate-100 dark:bg-zinc-800 rounded-2xl w-full" />
      <div className="space-y-2">
        <div className="h-3 bg-slate-100 dark:bg-zinc-800 rounded-full w-1/3" />
        <div className="h-4 bg-slate-100 dark:bg-zinc-800 rounded-full w-3/4" />
        <div className="h-3 bg-slate-100 dark:bg-zinc-800 rounded-full w-5/6" />
      </div>
      <div className="h-10 bg-slate-100 dark:bg-zinc-800 rounded-xl w-full pt-4" />
    </div>
  );
}
