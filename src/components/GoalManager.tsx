'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/store/DashboardContext';
import { Goal } from '@/types';
import { Target, Plus, Trash2, Edit2, Check } from 'lucide-react';

export default function GoalManager() {
  const { state, addGoal, updateGoal, deleteGoal } = useDashboard();
  const [isCreating, setIsCreating] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', notes: '' });

  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editingGoalData, setEditingGoalData] = useState<Partial<Goal>>({});
  const [hoveredGoalId, setHoveredGoalId] = useState<string | null>(null);

  const currentPeriodId = state.currentPeriodId;
  const currentGoals = state.goals.filter((g) => g.periodId === currentPeriodId);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title || !currentPeriodId) return;

    const goal: Goal = {
      id: crypto.randomUUID(),
      periodId: currentPeriodId,
      title: newGoal.title,
      notes: newGoal.notes || undefined,
      status: 'todo',
    };
    
    addGoal(goal);
    setNewGoal({ title: '', notes: '' });
    setIsCreating(false);
  };

  const startEditing = (goal: Goal) => {
    setEditingGoalId(goal.id);
    setEditingGoalData(goal);
  };

  const saveEdit = () => {
    if (editingGoalId && editingGoalData.title) {
      updateGoal(editingGoalId, editingGoalData);
      setEditingGoalId(null);
    }
  };

  const cancelEdit = () => {
    setEditingGoalId(null);
  };



  if (!currentPeriodId) return null;

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-500" />
          Goals
        </h2>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="text-sm flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium"
        >
          <Plus className="w-4 h-4" />
          New
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="mb-6 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg space-y-4">
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
          {currentGoals.map((goal) => {
            const isEditing = editingGoalId === goal.id;

            if (isEditing) {
              return (
                <li key={goal.id} className="p-4 rounded-lg border border-indigo-300 dark:border-indigo-700 bg-indigo-50/50 dark:bg-indigo-900/10 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Goal</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
                      value={editingGoalData.title || ''}
                      onChange={e => setEditingGoalData({ ...editingGoalData, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
                      value={editingGoalData.notes || ''}
                      onChange={e => setEditingGoalData({ ...editingGoalData, notes: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEdit}
                      className="flex items-center gap-1 px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      <Check className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                </li>
              );
            }

            return (
            <li
              key={goal.id}
              onMouseEnter={() => setHoveredGoalId(goal.id)}
              onMouseLeave={() => setHoveredGoalId(null)}
              className="flex items-start justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0 mt-0.5">

                <div className="flex flex-col">
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">{goal.title}</span>
                  {goal.notes && (
                    <span className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 whitespace-pre-wrap">{goal.notes}</span>
                  )}
                </div>
              </div>
              <div className={`flex items-center gap-1 transition-opacity duration-200 ml-4 shrink-0 ${hoveredGoalId === goal.id ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <button
                  onClick={() => startEditing(goal)}
                  className="p-1.5 text-neutral-400 hover:text-indigo-500 transition-colors rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
