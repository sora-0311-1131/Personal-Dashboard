'use client';

import { useDashboard } from "@/store/DashboardContext";
import PeriodManager from "@/components/PeriodManager";
import GoalManager from "@/components/GoalManager";
import NonGoalManager from "@/components/NonGoalManager";
import ProjectManager from "@/components/ProjectManager";
import TaskManager from "@/components/TaskManager";
import { LayoutDashboard } from "lucide-react";

export default function Home() {
  const { state } = useDashboard();
  const currentPeriod = state.periods.find(p => p.id === state.currentPeriodId);

  return (
    <main className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950 p-4 sm:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-md">
                <LayoutDashboard className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Personal Dashboard</span>
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
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">ようこそ</h1>
                <p className="text-neutral-500">
                  期間（Period）を選択または作成して開始してください。
                </p>
              </div>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        {state.periods.length === 0 || !state.currentPeriodId ? (
          <div className="max-w-2xl mx-auto">
            <PeriodManager />
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* Left Column (Main Focus: Execution) */}
            <div className="xl:col-span-8 space-y-8">
              <TaskManager />
              <ProjectManager />
            </div>

            {/* Right Column (Sidebar: Direction) */}
            <div className="xl:col-span-4 space-y-8">
              <GoalManager />
              <NonGoalManager />
              
              {/* Period Switcher placed in sidebar for context switching */}
              <div className="opacity-75 hover:opacity-100 transition-opacity">
                <PeriodManager />
              </div>
            </div>
            
          </div>
        )}
      </div>
    </main>
  );
}
