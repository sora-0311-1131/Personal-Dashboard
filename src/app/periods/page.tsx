'use client';

import React from 'react';
import PeriodManager from "@/components/PeriodManager";

export default function PeriodsPage() {
  return (
    <main className="p-4 sm:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Periods</h1>
          <p className="text-neutral-500 mt-2">Manage the foundational time blocks for your tasks and goals.</p>
        </div>

        <div className="max-w-3xl">
          <PeriodManager />
        </div>
      </div>
    </main>
  );
}
