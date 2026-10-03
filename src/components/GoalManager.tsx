'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/store/DashboardContext';
import { Goal, Priority } from '@/types';
import { Target, Plus, ArrowUpDown, Eye, EyeOff } from 'lucide-react';
import GoalItem from './GoalItem';

export default function GoalManager({ onGoalClick }: { onGoalClick?: (id: string) => void } = {}) {
  const { state, addGoal } = useDashboard();
  const [isCreating, setIsCreating] = useState(false);
  const [newGoal, setNewGoal] = useState<{
    title: string;
    priority: Priority | '';
    deadline: string;
    notes: string;
  }>({ title: '', priority: '', deadline: '', notes: '' });

  const [sortBy, setSortBy] = useState<'deadline-asc' | 'priority-desc' | 'status'>('deadline-asc');
  const [showDone, setShowDone] = useState(false);

  const currentPeriodId = state.currentPeriodId;
  const currentGoals = state.goals
    .filter((g) => g.periodId === currentPeriodId)
    .filter((g) => showDone || g.status !== 'done')
    .sort((a, b) => {
      if (sortBy === 'deadline-asc') {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (sortBy === 'priority-desc') {
        const pOrder: Record<string, number> = { P0: 0, P1: 1, P2: 2 };
        const pA = a.priority ? pOrder[a.priority] : 3;
        const pB = b.priority ? pOrder[b.priority] : 3;
        if (pA !== pB) {
          return pA - pB;
        }
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (sortBy === 'status') {
        const sOrder = { 'todo': 0, 'in-progress': 1, 'done': 2 };
        if (sOrder[a.status] !== sOrder[b.status]) {
          return sOrder[a.status] - sOrder[b.status];
        }
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      return 0;
    });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title || !currentPeriodId) return;

    const goal: Goal = {
      id: crypto.randomUUID(),
      periodId: currentPeriodId,
      title: newGoal.title,
      notes: newGoal.notes || undefined,
      deadline: newGoal.deadline || undefined,
      priority: newGoal.priority || undefined,
      status: 'todo',
    };
    
    addGoal(goal);
    setNewGoal({ title: '', priority: '', deadline: '', notes: '' });
    setIsCreating(false);
  };

  if (!currentPeriodId) return null;

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-500" />
          Goals
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setShowDone(!showDone)}
            className={`text-sm flex items-center gap-1 font-medium px-3 py-1.5 rounded-md transition-colors ${
              showDone
                ? 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
                : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
            title={showDone ? "Hide done items" : "Show done items"}
          >
            {showDone ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden sm:inline">{showDone ? 'Hide Done' : 'Show Done'}</span>
          </button>
          <div className="flex items-center gap-2 text-sm text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50 px-2 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700">
            <ArrowUpDown className="w-4 h-4" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'deadline-asc' | 'priority-desc' | 'status')}
              className="bg-transparent border-none outline-none cursor-pointer text-neutral-700 dark:text-neutral-300 font-medium"
            >
              <option value="deadline-asc">Deadline (Ascending)</option>
              <option value="priority-desc">Priority (High to Low)</option>
              <option value="status">Status</option>
            </select>
          </div>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="text-sm flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            New
          </button>
        </div>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="mb-6 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg space-y-4 border border-neutral-200 dark:border-neutral-700">
          <div>
            <label className="block text-sm font-medium mb-1">Goal</label>
            <input
              type="text"
              required
              placeholder="e.g., Complete Personal Dashboard"
              className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
              value={newGoal.title}
              onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Deadline</label>
              <input
                type="date"
                className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
                value={newGoal.deadline}
                onChange={e => setNewGoal({ ...newGoal, deadline: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
                value={newGoal.priority}
                onChange={e => setNewGoal({ ...newGoal, priority: e.target.value as (Priority | '') })}
              >
                <option value="">-- Unset --</option>
                <option value="P0">P0: High</option>
                <option value="P1">P1: Medium</option>
                <option value="P2">P2: Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              rows={2}
              className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
              value={newGoal.notes}
              onChange={e => setNewGoal({ ...newGoal, notes: e.target.value })}
            />
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
              className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
            >
              Create
            </button>
          </div>
        </form>
      )}

      {currentGoals.length === 0 && !isCreating ? (
        <div className="text-center py-6 text-neutral-500">
          <p>No goals have been set for this period yet.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {currentGoals.map((goal) => (
            <GoalItem key={goal.id} goal={goal} onGoalClick={onGoalClick} />
          ))}
        </ul>
      )}
    </div>
  );
}
