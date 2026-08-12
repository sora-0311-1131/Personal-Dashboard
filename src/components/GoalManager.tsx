'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/store/DashboardContext';
import { Goal, Priority } from '@/types';
import { Target, Plus, Trash2 } from 'lucide-react';

export default function GoalManager() {
  const { state, addGoal, deleteGoal } = useDashboard();
  const [isCreating, setIsCreating] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', priority: 'P2' as Priority });

  const currentPeriodId = state.currentPeriodId;
  const currentGoals = state.goals.filter((g) => g.periodId === currentPeriodId);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title || !currentPeriodId) return;

    const goal: Goal = {
      id: crypto.randomUUID(),
      periodId: currentPeriodId,
      title: newGoal.title,
      priority: newGoal.priority,
      status: 'todo',
    };
    
    addGoal(goal);
    setNewGoal({ title: '', priority: 'P2' });
    setIsCreating(false);
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'P1': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/50';
      case 'P2': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
      case 'P3': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/50';
      default: return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700';
    }
  };

  if (!currentPeriodId) return null;

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-500" />
          目標 (Goals)
        </h2>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="text-sm flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium"
        >
          <Plus className="w-4 h-4" />
          新規作成
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="mb-6 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">目標タイトル</label>
            <input
              type="text"
              required
              placeholder="例: パーソナルダッシュボードを完成させる"
              className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
              value={newGoal.title}
              onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">優先度</label>
            <select
              className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
              value={newGoal.priority}
              onChange={e => setNewGoal({ ...newGoal, priority: e.target.value as Priority })}
            >
              <option value="P1">P1 - 最高</option>
              <option value="P2">P2 - 中</option>
              <option value="P3">P3 - 低</option>
              <option value="none">なし</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
            >
              作成
            </button>
          </div>
        </form>
      )}

      {currentGoals.length === 0 && !isCreating ? (
        <div className="text-center py-6 text-neutral-500">
          <p>この期間の目標はまだ設定されていません。</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {currentGoals.map((goal) => (
            <li
              key={goal.id}
              className="group flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded-md border ${getPriorityColor(goal.priority)}`}>
                  {goal.priority}
                </span>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">{goal.title}</span>
              </div>
              <button
                onClick={() => deleteGoal(goal.id)}
                className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-500 transition-opacity"
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
