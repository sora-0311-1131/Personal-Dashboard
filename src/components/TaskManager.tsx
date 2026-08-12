'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/store/DashboardContext';
import { Task } from '@/types';
import { CheckSquare, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';

export default function TaskManager() {
  const { state, addTask, updateTask, deleteTask } = useDashboard();
  const [isCreating, setIsCreating] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', projectId: '', goalId: '' });

  const currentPeriodId = state.currentPeriodId;
  const currentTasks = state.tasks.filter((t) => t.periodId === currentPeriodId);
  const currentProjects = state.projects.filter((p) => p.periodId === currentPeriodId);
  const currentGoals = state.goals.filter((g) => g.periodId === currentPeriodId);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !currentPeriodId) return;

    const task: Task = {
      id: crypto.randomUUID(),
      periodId: currentPeriodId,
      projectId: newTask.projectId || undefined,
      goalId: newTask.goalId || undefined,
      title: newTask.title,
      status: 'todo',
    };
    
    addTask(task);
    setNewTask({ title: '', projectId: '', goalId: '' });
    setIsCreating(false);
  };

  const toggleTaskStatus = (task: Task) => {
    updateTask(task.id, { status: task.status === 'done' ? 'todo' : 'done' });
  };

  if (!currentPeriodId) return null;

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-emerald-500" />
          Tasks
        </h2>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="text-sm flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="mb-6 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Task Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Write PRD"
              className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-emerald-500"
              value={newTask.title}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Link to Project (Optional)</label>
              <select
                className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-emerald-500"
                value={newTask.projectId}
                onChange={e => setNewTask({ ...newTask, projectId: e.target.value })}
              >
                <option value="">-- No specific project --</option>
                {currentProjects.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Link to Goal (Optional)</label>
              <select
                className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-emerald-500"
                value={newTask.goalId}
                onChange={e => setNewTask({ ...newTask, goalId: e.target.value })}
              >
                <option value="">-- No specific goal --</option>
                {currentGoals.map(g => (
                  <option key={g.id} value={g.id}>{g.title}</option>
                ))}
              </select>
            </div>
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
              className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
            >
              Create
            </button>
          </div>
        </form>
      )}

      {currentTasks.length === 0 && !isCreating ? (
        <div className="text-center py-10 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg flex flex-col items-center justify-center text-neutral-500">
          <CheckSquare className="w-8 h-8 text-neutral-400 mb-3 opacity-50" />
          <p className="font-medium text-neutral-600 dark:text-neutral-400">No tasks for this period.</p>
          <p className="text-sm mt-1">Add a task to start executing your goals.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {currentTasks.map((task) => {
            const isDone = task.status === 'done';
            const project = currentProjects.find(p => p.id === task.projectId);
            const goal = currentGoals.find(g => g.id === task.goalId);

            return (
              <li
                key={task.id}
                className={`group flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  isDone 
                    ? 'border-neutral-100 dark:border-neutral-800/50 bg-neutral-50/50 dark:bg-neutral-900/50' 
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-emerald-300 dark:hover:border-emerald-700'
                }`}
              >
                <button
                  onClick={() => toggleTaskStatus(task)}
                  className={`shrink-0 ${isDone ? 'text-emerald-500' : 'text-neutral-400 hover:text-emerald-500'}`}
                >
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </button>
                
                <div className="flex-1 min-w-0">
                  <span className={`block truncate ${isDone ? 'text-neutral-400 line-through' : 'text-neutral-900 dark:text-neutral-100 font-medium'}`}>
                    {task.title}
                  </span>
                  {(project || goal) && !isDone && (
                    <div className="flex gap-2 mt-1 text-xs text-neutral-500">
                      {project && <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded">Project: {project.title}</span>}
                      {goal && <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-1.5 py-0.5 rounded">Goal: {goal.title}</span>}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-500 transition-opacity p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
