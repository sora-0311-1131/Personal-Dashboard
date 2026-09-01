'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/store/DashboardContext';
import { Period } from '@/types';
import { Plus, Calendar as CalendarIcon, Check, Edit2, Trash2 } from 'lucide-react';

export default function PeriodManager() {
  const { state, addPeriod, updatePeriod, deletePeriod, setCurrentPeriod } = useDashboard();
  const [isCreating, setIsCreating] = useState(false);
  const [newPeriod, setNewPeriod] = useState({ name: '', startDate: '', endDate: '', notes: '' });

  const [editingPeriodId, setEditingPeriodId] = useState<string | null>(null);
  const [editingPeriodData, setEditingPeriodData] = useState<Partial<Period>>({});
  const [hoveredPeriodId, setHoveredPeriodId] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPeriod.name || !newPeriod.startDate || !newPeriod.endDate) return;

    const period: Period = {
      id: crypto.randomUUID(),
      name: newPeriod.name,
      startDate: newPeriod.startDate,
      endDate: newPeriod.endDate,
      notes: newPeriod.notes || undefined,
    };
    
    addPeriod(period);
    setNewPeriod({ name: '', startDate: '', endDate: '', notes: '' });
    setIsCreating(false);
  };

  const startEditing = (e: React.MouseEvent, p: Period) => {
    e.stopPropagation();
    setEditingPeriodId(p.id);
    setEditingPeriodData(p);
  };

  const saveEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editingPeriodId && editingPeriodData.name && editingPeriodData.startDate && editingPeriodData.endDate) {
      updatePeriod(editingPeriodId, editingPeriodData);
      setEditingPeriodId(null);
    }
  };

  const cancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPeriodId(null);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('この期間を削除すると、関連する目標やタスクも削除されます。本当によろしいですか？')) {
      deletePeriod(id);
    }
  };

  const currentPeriod = state.periods.find(p => p.id === state.currentPeriodId);

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-blue-500" />
          Periods
        </h2>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
        >
          <Plus className="w-4 h-4" />
          New
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="mb-6 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Period</label>
            <input
              type="text"
              required
              placeholder="e.g., Summer 2026"
              className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              value={newPeriod.name}
              onChange={e => setNewPeriod({ ...newPeriod, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                value={newPeriod.startDate}
                onChange={e => setNewPeriod({ ...newPeriod, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                value={newPeriod.endDate}
                onChange={e => setNewPeriod({ ...newPeriod, endDate: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              rows={2}
              className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              value={newPeriod.notes}
              onChange={e => setNewPeriod({ ...newPeriod, notes: e.target.value })}
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
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
            >
              Create
            </button>
          </div>
        </form>
      )}

      {state.periods.length === 0 && !isCreating ? (
        <div className="text-center py-8 text-neutral-500">
          <p>No periods have been set yet.</p>
          <p className="text-sm mt-1">Create your first period to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {state.periods.map(period => {
            const isEditing = editingPeriodId === period.id;

            if (isEditing) {
              return (
                <div key={period.id} className="p-4 rounded-lg border border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/10 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Period</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                      value={editingPeriodData.name || ''}
                      onChange={e => setEditingPeriodData({ ...editingPeriodData, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Start Date</label>
                      <input
                        type="date"
                        required
                        className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        value={editingPeriodData.startDate || ''}
                        onChange={e => setEditingPeriodData({ ...editingPeriodData, startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">End Date</label>
                      <input
                        type="date"
                        required
                        className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        value={editingPeriodData.endDate || ''}
                        onChange={e => setEditingPeriodData({ ...editingPeriodData, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                      value={editingPeriodData.notes || ''}
                      onChange={e => setEditingPeriodData({ ...editingPeriodData, notes: e.target.value })}
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
                      className="flex items-center gap-1 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <Check className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                </div>
              );
            }

            const isCurrent = period.id === state.currentPeriodId;
            return (
              <div
                key={period.id}
                onClick={() => setCurrentPeriod(period.id)}
                onMouseEnter={() => setHoveredPeriodId(period.id)}
                onMouseLeave={() => setHoveredPeriodId(null)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  isCurrent 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 dark:border-blue-500/50' 
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className={`font-medium ${isCurrent ? 'text-blue-700 dark:text-blue-400' : ''}`}>
                      {period.name}
                    </h3>
                    <p className="text-sm text-neutral-500 mt-1">
                      {period.startDate} — {period.endDate}
                    </p>
                    {period.notes && (
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 whitespace-pre-wrap">
                        {period.notes}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center shrink-0">
                    <div className={`flex items-center gap-1 transition-opacity duration-200 mr-2 ${hoveredPeriodId === period.id ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                      <button
                        onClick={(e) => startEditing(e, period)}
                        className="p-1.5 text-neutral-400 hover:text-blue-500 transition-colors rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, period.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {isCurrent && <Check className="w-5 h-5 text-blue-500" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
