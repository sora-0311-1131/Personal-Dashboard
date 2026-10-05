'use client';

import React from 'react';
import TaskManager from "@/components/TaskManager";
import ProjectManager from "@/components/ProjectManager";
import { useDashboard } from "@/store/DashboardContext";
import { useRouter } from "next/navigation";

export default function TasksPage() {
  const { state } = useDashboard();
  const router = useRouter();

  return (
    <main className="p-4 sm:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Tasks & Projects</h1>
          <p className="text-neutral-500 mt-2">Manage your actionable items for the current period.</p>
        </div>

        {!state.currentPeriodId ? (
          <div className="p-8 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-center">
            <h3 className="text-lg font-medium text-neutral-900 dark:text-white">No Period Selected</h3>
            <p className="text-neutral-500 mt-2">Please select or create a period from the Goals page to manage tasks.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="space-y-8">
              <TaskManager />
            </div>
            <div className="space-y-8">
              <ProjectManager onProjectClick={(id) => router.push(`/projects/${id}`)} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
