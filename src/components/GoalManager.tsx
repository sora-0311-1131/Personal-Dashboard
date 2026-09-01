'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/store/DashboardContext';
import { Goal, GoalPriority, EntityStatus } from '@/types';
import { Target, Plus, Trash2, Edit2, Check, ArrowUpDown } from 'lucide-react';

export default function GoalManager() {
  const { state, addGoal, updateGoal, deleteGoal } = useDashboard();
  const [isCreating, setIsCreating] = useState(false);
  
  const [newGoal, setNewGoal] = useState<{
    title: string;
    priority: GoalPriority | '';
    deadline: string;
    notes: string;
  }>({ title: '', priority: '' as any, deadline: '', notes: '' });

  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editingGoalData, setEditingGoalData] = useState<Partial<Goal>>({});
  const [hoveredGoalId, setHoveredGoalId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'deadline-asc' | 'priority-desc' | 'status'>('deadline-asc');

  const currentPeriodId = state.currentPeriodId;
  const currentGoals = state.goals
    .filter((g) => g.periodId === currentPeriodId)
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
    setNewGoal({ title: '', priority: '' as any, deadline: '', notes: '' });
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
      <div className="flex flex-col sm:flex-row xl:flex-col sm:items-center xl:items-start justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-500" />
          Goals
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50 px-2 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700">
            <ArrowUpDown className="w-4 h-4" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-none outline-none cursor-pointer text-neutral-700 dark:text-neutral-300 font-medium"
            >
              <option value="deadline-asc">期限順 (早い順)</option>
              <option value="priority-desc">優先度順 (高→低)</option>
              <option value="status">ステータス順</option>
            </select>
          </div>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="text-sm flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            新規作成
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
                onChange={e => setNewGoal({ ...newGoal, priority: e.target.value as (GoalPriority | '') })}
              >
                <option value="">-- 未設定 --</option>
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
          {currentGoals.map((goal) => {
            const isEditing = editingGoalId === goal.id;
            const isDone = goal.status === 'done';

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
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Deadline</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
                        value={editingGoalData.deadline || ''}
                        onChange={e => setEditingGoalData({ ...editingGoalData, deadline: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Priority</label>
                      <select
                        className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
                        value={editingGoalData.priority || ''}
                        onChange={e => setEditingGoalData({ ...editingGoalData, priority: (e.target.value || undefined) as GoalPriority | undefined })}
                      >
                        <option value="">-- 未設定 --</option>
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
                className={`flex flex-col sm:flex-row xl:flex-col sm:items-start gap-4 p-4 rounded-lg border transition-colors ${
                  isDone
                    ? 'border-neutral-100 dark:border-neutral-800/50 bg-neutral-50/50 dark:bg-neutral-900/50'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
              >
                {/* 1. Far Left: Deadline */}
                <div className="shrink-0 sm:w-28 mt-0.5">
                  {goal.deadline ? (
                    <div className={`text-sm font-medium ${isDone ? 'text-neutral-400' : 'text-neutral-700 dark:text-neutral-300'}`}>
                      {goal.deadline}
                    </div>
                  ) : (
                    <div className="text-xs text-neutral-400 dark:text-neutral-600">未設定</div>
                  )}
                </div>
                
                {/* 2. Middle: Title, Priority, Notes */}
                <div className="flex-1 min-w-0">
                  <div className="leading-snug break-words">
                    <span className={`font-medium ${isDone ? 'text-neutral-400 line-through' : 'text-neutral-900 dark:text-neutral-100'}`}>
                      {goal.title}
                    </span>
                    {goal.priority === 'P0' && <span className="inline-block ml-2 align-middle text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50">P0: High</span>}
                    {goal.priority === 'P1' && <span className="inline-block ml-2 align-middle text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50">P1: Medium</span>}
                    {goal.priority === 'P2' && <span className="inline-block ml-2 align-middle text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50">P2: Low</span>}
                  </div>
                  
                  {/* Notes below title */}
                  {goal.notes && (
                    <div className={`text-sm mt-1.5 whitespace-pre-wrap ${isDone ? 'text-neutral-400' : 'text-neutral-600 dark:text-neutral-400'}`}>
                      {goal.notes}
                    </div>
                  )}
                </div>

                {/* 3. Far Right: Status and Actions */}
                <div className="shrink-0 flex items-center gap-3 mt-3 sm:mt-0">
                  <select
                    value={goal.status}
                    onChange={(e) => updateGoal(goal.id, { status: e.target.value as EntityStatus })}
                    className={`text-xs font-semibold rounded-md px-2 py-1.5 border outline-none cursor-pointer ${
                      goal.status === 'done' ? 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400' :
                      goal.status === 'in-progress' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-neutral-100 text-neutral-700 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-600'
                    }`}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>

                  <div className={`flex items-center gap-1 transition-opacity duration-200 ${hoveredGoalId === goal.id ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
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
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
