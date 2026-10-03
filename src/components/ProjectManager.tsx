'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/store/DashboardContext';
import { Project, Priority } from '@/types';
import { Folder, Plus, ArrowUpDown, Eye, EyeOff, ChevronRight, ChevronDown } from 'lucide-react';
import ProjectItem from './ProjectItem';

export default function ProjectManager({
  filterGoalId,
  onProjectClick,
}: {
  filterGoalId?: string;
  onProjectClick?: (id: string) => void;
} = {}) {
  const { state, addProject } = useDashboard();
  const [isCreating, setIsCreating] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({ unassigned: true });

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const isGrouped = !filterGoalId;

  const [newProject, setNewProject] = useState<{
    title: string;
    goalId: string;
    priority: Priority | '';
    deadline: string;
    notes: string;
  }>({ title: '', goalId: '', priority: '', deadline: '', notes: '' });

  const [sortBy, setSortBy] = useState<'deadline-asc' | 'priority-desc' | 'status'>('deadline-asc');
  const [showDone, setShowDone] = useState(false);

  const currentPeriodId = state.currentPeriodId;
  const currentGoals = state.goals.filter((g) => g.periodId === currentPeriodId);
  
  const currentProjects = state.projects
    .filter((p) => p.periodId === currentPeriodId)
    .filter((p) => (filterGoalId ? p.goalId === filterGoalId : true))
    .filter((p) => showDone || p.status !== 'done')
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
        const sOrder = { 'todo': 0, 'in-progress': 1, 'pending': 2, 'done': 3 };
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
    if (!newProject.title || !currentPeriodId) return;

    const project: Project = {
      id: crypto.randomUUID(),
      periodId: currentPeriodId,
      goalId: filterGoalId || newProject.goalId || undefined,
      title: newProject.title,
      notes: newProject.notes || undefined,
      deadline: newProject.deadline || undefined,
      priority: newProject.priority || undefined,
      status: 'todo',
    };
    
    addProject(project);
    setNewProject({ title: '', goalId: '', priority: '', deadline: '', notes: '' });
    setIsCreating(false);
  };

  const renderProjectList = (projects: Project[]) => (
    <ul className="space-y-3">
      {projects.map((project) => (
        <ProjectItem key={project.id} project={project} filterGoalId={filterGoalId} onProjectClick={onProjectClick} />
      ))}
    </ul>
  );

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Folder className="w-5 h-5 text-amber-500" />
          Projects
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setShowDone(!showDone)}
            className={`text-sm flex items-center gap-1 font-medium px-3 py-1.5 rounded-md transition-colors ${
              showDone
                ? 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
                : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
            title={showDone ? "Hide done items" : "Show done items"}
          >
            {showDone ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden sm:inline">{showDone ? 'Hide Done' : 'Show Done'}</span>
          </button>
          <div className="flex items-center gap-2 text-sm text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50 px-2 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700">
            <ArrowUpDown className="w-4 h-4" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'deadline-asc' | 'priority-desc' | 'status')}
              className="bg-transparent border-none outline-none cursor-pointer text-neutral-700 dark:text-neutral-300 font-medium"
            >
              <option value="deadline-asc">Deadline (Ascending)</option>
              <option value="priority-desc">Priority (High to Low)</option>
              <option value="status">Status</option>
            </select>
          </div>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="text-sm flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            New
          </button>
        </div>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="mb-6 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg space-y-4 border border-neutral-200 dark:border-neutral-700">
          <div>
            <label className="block text-sm font-medium mb-1">Project (Title)</label>
            <input
              type="text"
              required
              placeholder="e.g., Website Renewal"
              className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-amber-500"
              value={newProject.title}
              onChange={e => setNewProject({ ...newProject, title: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Deadline</label>
              <input
                type="date"
                className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-amber-500"
                value={newProject.deadline}
                onChange={e => setNewProject({ ...newProject, deadline: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-amber-500"
                value={newProject.priority}
                onChange={e => setNewProject({ ...newProject, priority: e.target.value as (Priority | '') })}
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
              placeholder="Notes or details"
              rows={2}
              className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-amber-500"
              value={newProject.notes}
              onChange={e => setNewProject({ ...newProject, notes: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Link to Goal (Optional)</label>
            <select
              className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-amber-500"
              value={newProject.goalId}
              onChange={e => setNewProject({ ...newProject, goalId: e.target.value })}
            >
              <option value="">-- None --</option>
              {currentGoals.map(g => (
                <option key={g.id} value={g.id}>{g.title}</option>
              ))}
            </select>
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
              className="px-4 py-2 text-sm font-medium bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
            >
              Create
            </button>
          </div>
        </form>
      )}

      {currentProjects.length === 0 && !isCreating ? (
        <div className="text-center py-10 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg flex flex-col items-center justify-center text-neutral-500">
          <Folder className="w-8 h-8 text-neutral-400 mb-3 opacity-50" />
          <p className="font-medium text-neutral-600 dark:text-neutral-400">No projects yet.</p>
          <p className="text-sm mt-1">Group your tasks into projects.</p>
        </div>
      ) : (
        isGrouped ? (
          <div className="space-y-4">
            {(() => {
              const sortedGoalsForGroups = [...currentGoals].sort((a, b) => {
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
                  if (pA !== pB) return pA - pB;
                  if (!a.deadline && !b.deadline) return 0;
                  if (!a.deadline) return 1;
                  if (!b.deadline) return -1;
                  return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
                }
                if (sortBy === 'status') {
                  const sOrder = { 'todo': 0, 'in-progress': 1, 'pending': 2, 'done': 3 };
                  if (sOrder[a.status] !== sOrder[b.status]) return sOrder[a.status] - sOrder[b.status];
                  if (!a.deadline && !b.deadline) return 0;
                  if (!a.deadline) return 1;
                  if (!b.deadline) return -1;
                  return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
                }
                return 0;
              });

              const groups = [
                { id: 'unassigned', title: 'No Goal' },
                ...sortedGoalsForGroups.map(g => ({ id: g.id, title: g.title }))
              ];
              
              return groups.map(group => {
                const groupProjects = currentProjects.filter(p => (group.id === 'unassigned' ? !p.goalId : p.goalId === group.id));
                if (groupProjects.length === 0) return null;
                
                const isExpanded = expandedGroups[group.id];
                
                return (
                  <div key={group.id} className="space-y-2">
                    <div 
                      className="flex items-center gap-2 cursor-pointer py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 px-2 rounded-md transition-colors -ml-2"
                      onClick={() => toggleGroup(group.id)}
                    >
                      {isExpanded ? <ChevronDown className="w-4 h-4 text-neutral-500" /> : <ChevronRight className="w-4 h-4 text-neutral-500" />}
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">{group.title}</span>
                      <span className="text-xs text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
                        {groupProjects.length}
                      </span>
                    </div>
                    {isExpanded && (
                      <div className="pl-4 border-l-2 border-neutral-100 dark:border-neutral-800 ml-2">
                        {renderProjectList(groupProjects)}
                      </div>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        ) : (
          renderProjectList(currentProjects)
        )
      )}
    </div>
  );
}
