'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/store/DashboardContext';
import { Period } from '@/types';
import { Plus, Calendar as CalendarIcon, Check } from 'lucide-react';

export default function PeriodManager() {
  const { state, addPeriod, setCurrentPeriod } = useDashboard();
  const [isCreating, setIsCreating] = useState(false);
  const [newPeriod, setNewPeriod] = useState({ name: '', startDate: '', endDate: '' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPeriod.name || !newPeriod.startDate || !newPeriod.endDate) return;

    const period: Period = {
      id: crypto.randomUUID(),
      name: newPeriod.name,
      startDate: newPeriod.startDate,
      endDate: newPeriod.endDate,
    };
    
    addPeriod(period);
    setNewPeriod({ name: '', startDate: '', endDate: '' });
    setIsCreating(false);
  };

  const currentPeriod = state.periods.find(p => p.id === state.currentPeriodId);

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-blue-500" />
          期間 (Periods)
        </h2>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
        >
          <Plus className="w-4 h-4" />
          新規作成
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="mb-6 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">期間名</label>
            <input
              type="text"
              required
              placeholder="例: 2026年 夏"
              className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              value={newPeriod.name}
              onChange={e => setNewPeriod({ ...newPeriod, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">開始日</label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                value={newPeriod.startDate}
                onChange={e => setNewPeriod({ ...newPeriod, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">終了日</label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                value={newPeriod.endDate}
                onChange={e => setNewPeriod({ ...newPeriod, endDate: e.target.value })}
              />
            </div>
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
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
            >
              作成
            </button>
          </div>
        </form>
      )}

      {state.periods.length === 0 && !isCreating ? (
        <div className="text-center py-8 text-neutral-500">
          <p>期間がまだ設定されていません。</p>
          <p className="text-sm mt-1">最初の期間を作成して始めましょう。</p>
        </div>
      ) : (
        <div className="space-y-2">
          {state.periods.map(period => {
            const isCurrent = period.id === state.currentPeriodId;
            return (
              <div
                key={period.id}
                onClick={() => setCurrentPeriod(period.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  isCurrent 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 dark:border-blue-500/50' 
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`font-medium ${isCurrent ? 'text-blue-700 dark:text-blue-400' : ''}`}>
                      {period.name}
                    </h3>
                    <p className="text-sm text-neutral-500 mt-1">
                      {period.startDate} — {period.endDate}
                    </p>
                  </div>
                  {isCurrent && <Check className="w-5 h-5 text-blue-500" />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
