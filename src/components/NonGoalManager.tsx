'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/store/DashboardContext';
import { NonGoal } from '@/types';
import { ShieldAlert, Plus, Trash2, Edit2, Check } from 'lucide-react';

export default function NonGoalManager() {
  const { state, addNonGoal, updateNonGoal, deleteNonGoal } = useDashboard();
  const [isCreating, setIsCreating] = useState(false);
  const [newNonGoal, setNewNonGoal] = useState({ title: '', notes: '' });

  const [editingNonGoalId, setEditingNonGoalId] = useState<string | null>(null);
  const [editingNonGoalData, setEditingNonGoalData] = useState<Partial<NonGoal>>({});
  const [hoveredNonGoalId, setHoveredNonGoalId] = useState<string | null>(null);

  const currentPeriodId = state.currentPeriodId;
  const currentNonGoals = state.nonGoals.filter((ng) => ng.periodId === currentPeriodId);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNonGoal.title || !currentPeriodId) return;

    const nonGoal: NonGoal = {
      id: crypto.randomUUID(),
      periodId: currentPeriodId,
      title: newNonGoal.title,
      notes: newNonGoal.notes || undefined,
    };
    
    addNonGoal(nonGoal);
    setNewNonGoal({ title: '', notes: '' });
    setIsCreating(false);
  };

  const startEditing = (ng: NonGoal) => {
    setEditingNonGoalId(ng.id);
    setEditingNonGoalData(ng);
  };

  const saveEdit = () => {
    if (editingNonGoalId && editingNonGoalData.title) {
      updateNonGoal(editingNonGoalId, editingNonGoalData);
      setEditingNonGoalId(null);
    }
  };

  const cancelEdit = () => {
    setEditingNonGoalId(null);
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
        Things you intentionally decided <strong>NOT</strong> to do this period.
      </p>

      {isCreating && (
        <form onSubmit={handleCreate} className="mb-6 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Non-Goal</label>
            <input
              type="text"
              required
              placeholder="e.g., Do not over-engineer the UI"
              className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-rose-500 text-sm"
              value={newNonGoal.title}
              onChange={e => setNewNonGoal({ ...newNonGoal, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              rows={2}
              className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-rose-500 text-sm"
              value={newNonGoal.notes}
              onChange={e => setNewNonGoal({ ...newNonGoal, notes: e.target.value })}
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
              className="px-4 py-2 text-sm font-medium bg-rose-600 text-white rounded-md hover:bg-rose-700 focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
            >
              Add
            </button>
          </div>
        </form>
      )}

      {currentNonGoals.length === 0 && !isCreating ? (
        <div className="text-center py-4 text-neutral-500 text-sm">
          Not set yet.
        </div>
      ) : (
        <ul className="space-y-2">
          {currentNonGoals.map((ng) => {
            const isEditing = editingNonGoalId === ng.id;

            if (isEditing) {
              return (
                <li key={ng.id} className="p-4 rounded-lg border border-rose-300 dark:border-rose-700 bg-rose-50/50 dark:bg-rose-900/10 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Non-Goal</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                      value={editingNonGoalData.title || ''}
                      onChange={e => setEditingNonGoalData({ ...editingNonGoalData, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                      value={editingNonGoalData.notes || ''}
                      onChange={e => setEditingNonGoalData({ ...editingNonGoalData, notes: e.target.value })}
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
                      className="flex items-center gap-1 px-4 py-2 text-sm font-medium bg-rose-600 text-white rounded-md hover:bg-rose-700"
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
              key={ng.id}
              onMouseEnter={() => setHoveredNonGoalId(ng.id)}
              onMouseLeave={() => setHoveredNonGoalId(null)}
              className="flex items-start gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/30 text-neutral-700 dark:text-neutral-300 text-sm border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 transition-colors"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-2" />
              <div className="flex-1 flex flex-col min-w-0">
                <span className="text-sm font-medium">{ng.title}</span>
                {ng.notes && (
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 whitespace-pre-wrap">{ng.notes}</span>
                )}
              </div>
              <div className={`flex items-center gap-1 transition-opacity duration-200 ml-2 shrink-0 ${hoveredNonGoalId === ng.id ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <button
                  onClick={() => startEditing(ng)}
                  className="p-1.5 text-neutral-400 hover:text-rose-500 transition-colors rounded-md hover:bg-rose-50 dark:hover:bg-rose-900/20"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteNonGoal(ng.id)}
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
