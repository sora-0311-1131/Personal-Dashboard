'use client';

import React from 'react';
import GoalManager from "@/components/GoalManager";
import NonGoalManager from "@/components/NonGoalManager";
import { useDashboard } from "@/store/DashboardContext";

export default function GoalsPage() {
  const { state } = useDashboard();

  return (
    <main className="p-4 sm:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Goals & Periods</h1>
          <p className="text-neutral-500 mt-2">Define your North Star and what to avoid.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-8 space-y-8">
            {state.currentPeriodId ? (
              <GoalManager />
            ) : (
              <div className="p-8 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-center">
                <h3 className="text-lg font-medium text-neutral-900 dark:text-white">No Period Selected</h3>
                <p className="text-neutral-500 mt-2">Create a new period to start adding goals.</p>
              </div>
            )}
          </div>

          <div className="xl:col-span-4 space-y-8">
            {state.currentPeriodId && <NonGoalManager />}
          </div>
        </div>
      </div>
    </main>
  );
}
