'use client';

import React from 'react';
import { useDashboard } from "@/store/DashboardContext";
import PeriodManager from "@/components/PeriodManager";
import GoalManager from "@/components/GoalManager";
import NonGoalManager from "@/components/NonGoalManager";
import ProjectManager from "@/components/ProjectManager";
import TaskManager from "@/components/TaskManager";
import Header from "@/components/layout/Header";

export default function Home() {
  const { state } = useDashboard();

  return (
    <main className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950 p-4 sm:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <Header />

        {/* Main Content Area */}
        {state.periods.length === 0 || !state.currentPeriodId ? (
          <div className="max-w-2xl mx-auto">
            <PeriodManager />
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* Left Column (Main Focus: Tasks, Projects, Goals) */}
            <div className="xl:col-span-8 space-y-8">
              <TaskManager />
              <ProjectManager />
              <GoalManager />
            </div>

            {/* Right Column (Sidebar: Non-Goals, Periods) */}
            <div className="xl:col-span-4 space-y-8">
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
