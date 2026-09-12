'use client';

import React from 'react';
import { useDashboard } from '@/store/DashboardContext';
import ProjectManager from './ProjectManager';
import { Target, ArrowLeft } from 'lucide-react';

export default function GoalDetail({
  goalId,
  onBack,
  onProjectClick,
}: {
  goalId: string;
  onBack: () => void;
  onProjectClick: (id: string) => void;
}) {
  const { state } = useDashboard();
  const goal = state.goals.find((g) => g.id === goalId);

  if (!goal) {
    return (
      <div className="text-center py-10">
        <p className="text-neutral-500">Goal not found.</p>
        <button onClick={onBack} className="mt-4 text-indigo-600 hover:underline">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Basic Info */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to list
        </button>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Target className="w-8 h-8" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white break-words">{goal.title}</h2>
              {goal.priority === 'P0' && <span className="text-xs font-bold px-2 py-1 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50">P0: High</span>}
              {goal.priority === 'P1' && <span className="text-xs font-bold px-2 py-1 rounded bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50">P1: Medium</span>}
              {goal.priority === 'P2' && <span className="text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50">P2: Low</span>}
              <span className={`text-xs font-bold px-2 py-1 rounded border ${
                goal.status === 'done' ? 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400' :
                goal.status === 'in-progress' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400' :
                'bg-neutral-100 text-neutral-700 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-600'
              }`}>
                {goal.status === 'done' ? 'Done' : goal.status === 'in-progress' ? 'In Progress' : 'To Do'}
              </span>
            </div>
            
            {goal.deadline && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 font-medium">
                Deadline: {goal.deadline}
              </p>
            )}

            {goal.notes && (
              <div className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 mt-4">
                {goal.notes}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Projects under this goal */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-neutral-700 dark:text-neutral-300 px-1">Linked Projects</h3>
        <ProjectManager filterGoalId={goal.id} onProjectClick={onProjectClick} />
      </div>
    </div>
  );
}
