'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/store/DashboardContext';
import { Task, Priority, ExtendedStatus } from '@/types';
import { Trash2, Edit2, Check } from 'lucide-react';
import { Linkify } from '@/components/Linkify';

export default function TaskItem({ task }: { task: Task }) {
  const { state, updateTask, deleteTask } = useDashboard();
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState<Partial<Task>>(task);
  const [isHovered, setIsHovered] = useState(false);

  const currentProjects = state.projects.filter((p) => p.periodId === state.currentPeriodId);
  const currentGoals = state.goals.filter((g) => g.periodId === state.currentPeriodId);

  const isDone = task.status === 'done';
  const project = currentProjects.find(p => p.id === task.projectId);
  const goal = currentGoals.find(g => g.id === task.goalId);

  const saveEdit = () => {
    if (editingData.title) {
      updateTask(task.id, editingData);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <li className="p-4 rounded-lg border border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/10 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Task (Title)</label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            value={editingData.title || ''}
            onChange={e => setEditingData({ ...editingData, title: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Deadline</label>
            <input
              type="date"
              className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              value={editingData.deadline || ''}
              onChange={e => setEditingData({ ...editingData, deadline: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            value={editingData.notes || ''}
            onChange={e => setEditingData({ ...editingData, notes: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Project</label>
            <select
              className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              value={editingData.projectId || ''}
              onChange={e => setEditingData({ ...editingData, projectId: e.target.value || undefined })}
            >
              <option value="">-- None --</option>
              {currentProjects.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Goal</label>
            <select
              className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              value={editingData.goalId || ''}
              onChange={e => setEditingData({ ...editingData, goalId: e.target.value || undefined })}
            >
              <option value="">-- None --</option>
              {currentGoals.map(g => (
                <option key={g.id} value={g.id}>{g.title}</option>
              ))}
            </select>
          </div>
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
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
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
      className={`flex flex-col sm:flex-row sm:items-start gap-4 p-4 rounded-lg border transition-colors ${
        isDone
          ? 'border-neutral-100 dark:border-neutral-800/50 bg-neutral-50/50 dark:bg-neutral-900/50'
          : 'border-neutral-200 dark:border-neutral-800 hover:border-emerald-300 dark:hover:border-emerald-700'
      }`}
    >
      <div className="shrink-0 sm:w-28 mt-0.5">
        {task.deadline ? (
          <div className={`text-sm font-medium ${isDone ? 'text-neutral-400' : 'text-neutral-700 dark:text-neutral-300'}`}>
            {task.deadline}
          </div>
        ) : (
          <div className="text-xs text-neutral-400 dark:text-neutral-600">Unset</div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="leading-snug break-words">
          <span className={`font-medium ${isDone ? 'text-neutral-400 line-through' : 'text-neutral-900 dark:text-neutral-100'}`}>
            {task.title}
          </span>
          {task.priority === 'P0' && <span className="inline-block ml-2 align-middle text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50">P0: High</span>}
          {task.priority === 'P1' && <span className="inline-block ml-2 align-middle text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50">P1: Medium</span>}
          {task.priority === 'P2' && <span className="inline-block ml-2 align-middle text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50">P2: Low</span>}
        </div>
        
        {task.notes && (
          <div className={`text-sm mt-1.5 whitespace-pre-wrap ${isDone ? 'text-neutral-400' : 'text-neutral-600 dark:text-neutral-400'}`}>
            <Linkify>{task.notes}</Linkify>
          </div>
        )}

        {(project || goal) && !isDone && (
          <div className="flex flex-wrap gap-2 mt-3 text-xs text-neutral-500">
            {project && <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded">Project: {project.title}</span>}
            {goal && <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-1.5 py-0.5 rounded">Goal: {goal.title}</span>}
          </div>
        )}
      </div>

      <div className="shrink-0 flex items-center gap-3 mt-3 sm:mt-0">
        <select
          value={task.status}
          onChange={(e) => updateTask(task.id, { status: e.target.value as ExtendedStatus })}
          className={`text-xs font-semibold rounded-md px-2 py-1.5 border outline-none cursor-pointer ${
            task.status === 'done' ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400' :
            task.status === 'in-progress' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400' :
            task.status === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400' :
            'bg-neutral-100 text-neutral-700 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-600'
          }`}
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="pending">Pending</option>
          <option value="done">Done</option>
        </select>

        <div className={`flex items-center gap-1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-neutral-400 hover:text-blue-500 transition-colors rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
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
