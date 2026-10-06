'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/store/DashboardContext';
import { Project, Priority, ExtendedStatus } from '@/types';
import { Trash2, Edit2, Check } from 'lucide-react';
import { Linkify } from '@/components/Linkify';

export default function ProjectItem({ 
  project, 
  filterGoalId, 
  onProjectClick 
}: { 
  project: Project; 
  filterGoalId?: string; 
  onProjectClick?: (id: string) => void;
}) {
  const { state, updateProject, deleteProject } = useDashboard();
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState<Partial<Project>>(project);
  const [isHovered, setIsHovered] = useState(false);

  const currentGoals = state.goals.filter((g) => g.periodId === state.currentPeriodId);
  const currentTasks = state.tasks.filter((t) => t.periodId === state.currentPeriodId);

  const isDone = project.status === 'done';
  const goal = currentGoals.find(g => g.id === project.goalId);
  
  const projectTasks = currentTasks.filter(t => t.projectId === project.id);
  const completedTasksCount = projectTasks.filter(t => t.status === 'done').length;
  const totalTasksCount = projectTasks.length;

  const saveEdit = () => {
    if (editingData.title) {
      // Status is managed by the dropdown, so exclude it to avoid overwriting with stale values
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { status, ...updates } = editingData;
      updateProject(project.id, updates);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <li className="p-4 rounded-lg border border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/10 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Project (Title)</label>
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
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={() => setIsEditing(false)}
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
      </li>
    );
  }

  return (
    <li
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onProjectClick?.(project.id)}
      className={`flex flex-col sm:flex-row sm:items-start gap-4 p-4 rounded-lg border transition-colors ${
        onProjectClick ? 'cursor-pointer ' : ''
      }${
        isDone
          ? 'border-neutral-100 dark:border-neutral-800/50 bg-neutral-50/50 dark:bg-neutral-900/50'
          : 'border-neutral-200 dark:border-neutral-800 hover:border-amber-300 dark:hover:border-amber-700'
      }`}
    >
      <div className="shrink-0 sm:w-28 mt-0.5">
        {project.deadline ? (
          <div className={`text-sm font-medium ${isDone ? 'text-neutral-400' : 'text-neutral-700 dark:text-neutral-300'}`}>
            {project.deadline}
          </div>
        ) : (
          <div className="text-xs text-neutral-400 dark:text-neutral-600">Unset</div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="leading-snug break-words">
          <span className={`font-medium ${isDone ? 'text-neutral-400 line-through' : 'text-neutral-900 dark:text-neutral-100'}`}>
            {project.title}
          </span>
          {project.priority === 'P0' && <span className="inline-block ml-2 align-middle text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50">P0: High</span>}
          {project.priority === 'P1' && <span className="inline-block ml-2 align-middle text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50">P1: Medium</span>}
          {project.priority === 'P2' && <span className="inline-block ml-2 align-middle text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50">P2: Low</span>}
        </div>

        {totalTasksCount > 0 && (
          <div className="mt-1.5 text-xs text-neutral-500 font-medium flex items-center gap-2">
            <div className="w-16 h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div 
                className={`h-full ${completedTasksCount === totalTasksCount ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${(completedTasksCount / totalTasksCount) * 100}%` }}
              />
            </div>
            Tasks {completedTasksCount}/{totalTasksCount}
          </div>
        )}
        
        {project.notes && (
          <div className={`text-sm mt-1.5 whitespace-pre-wrap ${isDone ? 'text-neutral-400' : 'text-neutral-600 dark:text-neutral-400'}`}>
            <Linkify>{project.notes}</Linkify>
          </div>
        )}

        {goal && !filterGoalId && !isDone && (
          <div className="flex flex-wrap gap-2 mt-3 text-xs text-neutral-500">
            <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-1.5 py-0.5 rounded">Goal: {goal.title}</span>
          </div>
        )}
      </div>

      <div className="shrink-0 flex items-center gap-3 mt-3 sm:mt-0">
        <select
          value={project.status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => updateProject(project.id, { status: e.target.value as ExtendedStatus })}
          className={`text-xs font-semibold rounded-md px-2 py-1.5 border outline-none cursor-pointer ${
            project.status === 'done' ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400' :
            project.status === 'in-progress' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400' :
            project.status === 'pending' ? 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400' :
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
            onClick={(e) => { e.stopPropagation(); setEditingData(project); setIsEditing(true); }}
            className="p-1.5 text-neutral-400 hover:text-blue-500 transition-colors rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
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
