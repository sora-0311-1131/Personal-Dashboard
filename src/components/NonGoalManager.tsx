'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/store/DashboardContext';
import { NonGoal } from '@/types';
import { ShieldAlert, Plus, Trash2 } from 'lucide-react';

export default function NonGoalManager() {
  const { state, addNonGoal, deleteNonGoal } = useDashboard();
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');

  const currentPeriodId = state.currentPeriodId;
  const currentNonGoals = state.nonGoals.filter((ng) => ng.periodId === currentPeriodId);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !currentPeriodId) return;

    const nonGoal: NonGoal = {
      id: crypto.randomUUID(),
      periodId: currentPeriodId,
      title: title,
    };
    
    addNonGoal(nonGoal);
    setTitle('');
    setIsCreating(false);
  };

  if (!currentPeriodId) return null;

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-500" />
          Non-Goals
        </h2>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="text-sm flex items-center gap-1 text-rose-600 hover:text-rose-700 font-medium"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      <p className="text-sm text-neutral-500 mb-4">
        Things you explicitly decide <strong>not</strong> to pursue in this period.
      </p>

      {isCreating && (
        <form onSubmit={handleCreate} className="mb-6 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg flex gap-2">
          <input
            type="text"
            required
            placeholder="e.g. Do not over-engineer the UI"
            className="flex-1 px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-rose-500 text-sm"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setIsCreating(false)}
            className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium bg-rose-600 text-white rounded-md hover:bg-rose-700 focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
          >
            Add
          </button>
        </form>
      )}

      {currentNonGoals.length === 0 && !isCreating ? (
        <div className="text-center py-4 text-neutral-500 text-sm">
          No Non-Goals defined.
        </div>
      ) : (
        <ul className="space-y-2">
          {currentNonGoals.map((ng) => (
            <li
              key={ng.id}
              className="group flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/30 text-neutral-700 dark:text-neutral-300 text-sm border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 transition-colors"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
              <span className="flex-1">{ng.title}</span>
              <button
                onClick={() => deleteNonGoal(ng.id)}
                className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-rose-500 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
