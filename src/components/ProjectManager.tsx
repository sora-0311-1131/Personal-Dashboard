'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/store/DashboardContext';
import { Project } from '@/types';
import { Folder, Plus, Trash2 } from 'lucide-react';

export default function ProjectManager() {
  const { state, addProject, deleteProject } = useDashboard();
  const [isCreating, setIsCreating] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', goalId: '' });

  const currentPeriodId = state.currentPeriodId;
  const currentProjects = state.projects.filter((p) => p.periodId === currentPeriodId);
  const currentGoals = state.goals.filter((g) => g.periodId === currentPeriodId);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !currentPeriodId) return;

    const project: Project = {
      id: crypto.randomUUID(),
      periodId: currentPeriodId,
      goalId: newProject.goalId || undefined,
      title: newProject.title,
      status: 'todo',
    };
    
    addProject(project);
    setNewProject({ title: '', goalId: '' });
    setIsCreating(false);
  };

  if (!currentPeriodId) return null;

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Folder className="w-5 h-5 text-amber-500" />
          Projects
        </h2>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="text-sm flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="mb-6 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Project Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Website Redesign"
              className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-amber-500"
              value={newProject.title}
              onChange={e => setNewProject({ ...newProject, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Link to Goal (Optional)</label>
            <select
              className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-amber-500"
              value={newProject.goalId}
              onChange={e => setNewProject({ ...newProject, goalId: e.target.value })}
            >
              <option value="">-- No specific goal --</option>
              {currentGoals.map(g => (
                <option key={g.id} value={g.id}>{g.title}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
            >
              Create
            </button>
          </div>
        </form>
      )}

      {currentProjects.length === 0 && !isCreating ? (
        <div className="text-center py-10 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg flex flex-col items-center justify-center text-neutral-500">
          <Folder className="w-8 h-8 text-neutral-400 mb-3 opacity-50" />
          <p className="font-medium text-neutral-600 dark:text-neutral-400">No projects created yet.</p>
          <p className="text-sm mt-1">Group your tasks into projects.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentProjects.map((project) => {
            const linkedGoal = currentGoals.find(g => g.id === project.goalId);
            return (
              <div
                key={project.id}
                className="group p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-amber-300 dark:hover:border-amber-700 transition-colors flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-neutral-900 dark:text-neutral-100">{project.title}</h3>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-500 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {linkedGoal && (
                    <p className="text-xs text-neutral-500 mt-2 flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                      Goal: {linkedGoal.title}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
