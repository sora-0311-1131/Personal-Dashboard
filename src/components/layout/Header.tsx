'use client';

import React from 'react';
import { useDashboard } from "@/store/DashboardContext";
import { LayoutDashboard, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function Header() {
  const { state } = useDashboard();
  const currentPeriod = state.periods.find(p => p.id === state.currentPeriodId);
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      
      <div className="relative z-10 w-full">
        <div className="flex items-center justify-between mb-4 w-full">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-md">
              <LayoutDashboard className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Personal Dashboard</span>
          </div>
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
        {currentPeriod ? (
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-2">
              {currentPeriod.name}
            </h1>
            <p className="text-lg text-neutral-500 flex items-center gap-2 font-medium">
              {currentPeriod.startDate} <span className="opacity-50">—</span> {currentPeriod.endDate}
            </p>
            {currentPeriod.notes && (
              <p className="mt-4 text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap max-w-2xl leading-relaxed">
                {currentPeriod.notes}
              </p>
            )}
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Welcome</h1>
            <p className="text-neutral-500">
              Select or create a period to get started.
            </p>
          </div>
        )}
      </div>
    </header>
  );
}
