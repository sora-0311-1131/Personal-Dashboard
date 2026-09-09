'use client';

import React from 'react';
import { useDashboard } from '@/store/DashboardContext';
import TaskManager from './TaskManager';
import { Folder, ArrowLeft } from 'lucide-react';

export default function ProjectDetail({
  projectId,
  onBack,
}: {
  projectId: string;
  onBack: () => void;
}) {
  const { state } = useDashboard();
  const project = state.projects.find((p) => p.id === projectId);
  const goal = project ? state.goals.find(g => g.id === project.goalId) : null;

  if (!project) {
    return (
      <div className="text-center py-10">
        <p className="text-neutral-500">Project not found.</p>
        <button onClick={onBack} className="mt-4 text-amber-600 hover:underline">
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
          戻る
        </button>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl">
            <Folder className="w-8 h-8" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white break-words">{project.title}</h2>
              {project.priority === 'P0' && <span className="text-xs font-bold px-2 py-1 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50">P0: High</span>}
              {project.priority === 'P1' && <span className="text-xs font-bold px-2 py-1 rounded bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50">P1: Medium</span>}
              {project.priority === 'P2' && <span className="text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50">P2: Low</span>}
              <span className={`text-xs font-bold px-2 py-1 rounded border ${
                project.status === 'done' ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400' :
                project.status === 'in-progress' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400' :
                project.status === 'pending' ? 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400' :
                'bg-neutral-100 text-neutral-700 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-600'
              }`}>
                {project.status === 'done' ? 'Done' : project.status === 'in-progress' ? 'In Progress' : project.status === 'pending' ? 'Pending' : 'To Do'}
              </span>
            </div>
            
            {project.deadline && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 font-medium">
                期限: {project.deadline}
              </p>
            )}

            {project.notes && (
              <div className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 mt-4">
                {project.notes}
              </div>
            )}

            {goal && (
              <div className="flex flex-wrap gap-2 mt-4 text-xs text-neutral-500">
                <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-2 py-1 rounded-md font-medium border border-indigo-200 dark:border-indigo-800/50">目標: {goal.title}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tasks under this project */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-neutral-700 dark:text-neutral-300 px-1">紐づくタスク</h3>
        <TaskManager filterProjectId={project.id} />
      </div>
    </div>
  );
}
