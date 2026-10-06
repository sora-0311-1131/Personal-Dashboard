'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/store/DashboardContext';
import { Goal, Priority, EntityStatus } from '@/types';
import { Trash2, Edit2, Check } from 'lucide-react';
import { Linkify } from '@/components/Linkify';

export default function GoalItem({ 
  goal, 
  onGoalClick 
}: { 
  goal: Goal; 
  onGoalClick?: (id: string) => void;
}) {
  const { state, updateGoal, deleteGoal } = useDashboard();
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState<Partial<Goal>>(goal);
  const [isHovered, setIsHovered] = useState(false);

  const currentProjects = state.projects.filter((p) => p.periodId === state.currentPeriodId);

  const isDone = goal.status === 'done';
  
  const goalProjects = currentProjects.filter(p => p.goalId === goal.id);
  const completedProjectsCount = goalProjects.filter(p => p.status === 'done').length;
  const totalProjectsCount = goalProjects.length;

  const saveEdit = () => {
    if (editingData.title) {
      // Status is managed by the dropdown, so exclude it to avoid overwriting with stale values
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { status, ...updates } = editingData;
      updateGoal(goal.id, updates);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <li className="p-4 rounded-lg border border-indigo-300 dark:border-indigo-700 bg-indigo-50/50 dark:bg-indigo-900/10 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Goal</label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
            value={editingData.title || ''}
            onChange={e => setEditingData({ ...editingData, title: e.target.value })}
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Deadline</label>
            <input
              type="date"
              className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
              value={editingData.deadline || ''}
              onChange={e => setEditingData({ ...editingData, deadline: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
              value={editingData.priority || ''}
              onChange={e => setEditingData({ ...editingData, priority: (e.target.value || undefined) as Priority | undefined })}
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
            value={editingData.notes || ''}
            onChange={e => setEditingData({ ...editingData, notes: e.target.value })}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={() => setIsEditing(false)}
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onGoalClick?.(goal.id)}
      className={`flex flex-col sm:flex-row sm:items-start gap-4 p-4 rounded-lg border transition-colors ${
        onGoalClick ? 'cursor-pointer ' : ''
      }${
        isDone
          ? 'border-neutral-100 dark:border-neutral-800/50 bg-neutral-50/50 dark:bg-neutral-900/50'
          : 'border-neutral-200 dark:border-neutral-800 hover:border-indigo-300 dark:hover:border-indigo-700'
      }`}
    >
      <div className="shrink-0 sm:w-28 mt-0.5">
        {goal.deadline ? (
          <div className={`text-sm font-medium ${isDone ? 'text-neutral-400' : 'text-neutral-700 dark:text-neutral-300'}`}>
            {goal.deadline}
          </div>
        ) : (
          <div className="text-xs text-neutral-400 dark:text-neutral-600">Unset</div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="leading-snug break-words">
          <span className={`font-medium ${isDone ? 'text-neutral-400 line-through' : 'text-neutral-900 dark:text-neutral-100'}`}>
            {goal.title}
          </span>
          {goal.priority === 'P0' && <span className="inline-block ml-2 align-middle text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50">P0: High</span>}
          {goal.priority === 'P1' && <span className="inline-block ml-2 align-middle text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50">P1: Medium</span>}
          {goal.priority === 'P2' && <span className="inline-block ml-2 align-middle text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50">P2: Low</span>}
        </div>

        {totalProjectsCount > 0 && (
          <div className="mt-1.5 text-xs text-neutral-500 font-medium flex items-center gap-2">
            <div className="w-16 h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div 
                className={`h-full ${completedProjectsCount === totalProjectsCount ? 'bg-indigo-500' : 'bg-blue-500'}`}
                style={{ width: `${(completedProjectsCount / totalProjectsCount) * 100}%` }}
              />
            </div>
            Projects {completedProjectsCount}/{totalProjectsCount}
          </div>
        )}
        
        {goal.notes && (
          <div className={`text-sm mt-1.5 whitespace-pre-wrap ${isDone ? 'text-neutral-400' : 'text-neutral-600 dark:text-neutral-400'}`}>
            <Linkify>{goal.notes}</Linkify>
          </div>
        )}
      </div>

      <div className="shrink-0 flex items-center gap-3 mt-3 sm:mt-0">
        <select
          value={goal.status}
          onClick={(e) => e.stopPropagation()}
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

        <div className={`flex items-center gap-1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <button
            onClick={(e) => { e.stopPropagation(); setEditingData(goal); setIsEditing(true); }}
            className="p-1.5 text-neutral-400 hover:text-indigo-500 transition-colors rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); deleteGoal(goal.id); }}
            className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </li>
  );
}
