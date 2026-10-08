'use client';

import React from 'react';
import Header from "@/components/layout/Header";
import { useDashboard } from "@/store/DashboardContext";
import Link from 'next/link';
import { CheckSquare, Target } from 'lucide-react';

import EventManager from '@/components/EventManager';

export default function Home() {
  const { state } = useDashboard();
  
  // Calculate some basic stats
  const currentPeriodTasks = state.tasks.filter(t => t.periodId === state.currentPeriodId);
  const currentPeriodGoals = state.goals.filter(g => g.periodId === state.currentPeriodId);
  const currentPeriodProjects = state.projects.filter(p => p.periodId === state.currentPeriodId);
  
  const completedTasks = currentPeriodTasks.filter(t => t.status === 'done').length;
  const completedGoals = currentPeriodGoals.filter(g => g.status === 'done').length;

  return (
    <main className="p-4 sm:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <Header />

        {/* Dashboard Summary Area */}
        {state.periods.length > 0 && state.currentPeriodId ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                    <CheckSquare className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Tasks & Projects</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-neutral-500">Tasks Completed</p>
                      <p className="text-3xl font-extrabold mt-1">{completedTasks} <span className="text-lg text-neutral-400 font-medium">/ {currentPeriodTasks.length}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-neutral-500">Active Projects</p>
                      <p className="text-xl font-bold mt-1">{currentPeriodProjects.length}</p>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${currentPeriodTasks.length ? (completedTasks / currentPeriodTasks.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <Link href="/tasks" className="block text-center w-full py-2 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800/50 dark:hover:bg-neutral-800 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors">
                    Go to Tasks
                  </Link>
                </div>
              </div>
              <EventManager />
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
                    <Target className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Goals & Focus</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-neutral-500">Goals Achieved</p>
                      <p className="text-3xl font-extrabold mt-1">{completedGoals} <span className="text-lg text-neutral-400 font-medium">/ {currentPeriodGoals.length}</span></p>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${currentPeriodGoals.length ? (completedGoals / currentPeriodGoals.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <Link href="/goals" className="block text-center w-full py-2 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800/50 dark:hover:bg-neutral-800 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors">
                    Go to Goals
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
