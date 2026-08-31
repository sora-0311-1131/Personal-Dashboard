'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/store/DashboardContext';
import { Project, ProjectPriority, ProjectStatus } from '@/types';
import { Folder, Plus, Trash2, ArrowUpDown, Edit2, X, Check } from 'lucide-react';

export default function ProjectManager() {
  const { state, addProject, updateProject, deleteProject } = useDashboard();
  const [isCreating, setIsCreating] = useState(false);
  
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingProjectData, setEditingProjectData] = useState<Partial<Project>>({});

  const [newProject, setNewProject] = useState<{
    title: string;
    goalId: string;
    priority: ProjectPriority;
    deadline: string;
    notes: string;
  }>({ title: '', goalId: '', priority: 'P1', deadline: '', notes: '' });

  const [sortBy, setSortBy] = useState<'deadline-asc' | 'priority-desc' | 'status'>('deadline-asc');

  const currentPeriodId = state.currentPeriodId;
  const currentGoals = state.goals.filter((g) => g.periodId === currentPeriodId);
  
  const currentProjects = state.projects
    .filter((p) => p.periodId === currentPeriodId)
    .sort((a, b) => {
      if (sortBy === 'deadline-asc') {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (sortBy === 'priority-desc') {
        const pOrder = { P0: 0, P1: 1, P2: 2 };
        if (pOrder[a.priority] !== pOrder[b.priority]) {
          return pOrder[a.priority] - pOrder[b.priority];
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
      goalId: newProject.goalId || undefined,
      title: newProject.title,
      notes: newProject.notes || undefined,
      deadline: newProject.deadline || undefined,
      priority: newProject.priority,
      status: 'todo',
    };
    
    addProject(project);
    setNewProject({ title: '', goalId: '', priority: 'P1', deadline: '', notes: '' });
    setIsCreating(false);
  };

  const startEditing = (project: Project) => {
    setEditingProjectId(project.id);
    setEditingProjectData(project);
  };

  const saveEdit = () => {
    if (editingProjectId && editingProjectData.title) {
      updateProject(editingProjectId, editingProjectData);
      setEditingProjectId(null);
    }
  };

  const cancelEdit = () => {
    setEditingProjectId(null);
  };

  if (!currentPeriodId) return null;

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Folder className="w-5 h-5 text-amber-500" />
          Projects
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
            className="text-sm flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            新規作成
          </button>
        </div>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="mb-6 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg space-y-4 border border-neutral-200 dark:border-neutral-700">
          <div>
            <label className="block text-sm font-medium mb-1">Project (タイトル)</label>
            <input
              type="text"
              required
              placeholder="例: ウェブサイトのリニューアル"
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
                onChange={e => setNewProject({ ...newProject, priority: e.target.value as ProjectPriority })}
              >
                <option value="P0">P0: High</option>
                <option value="P1">P1: Medium</option>
                <option value="P2">P2: Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              placeholder="メモや詳細"
              rows={2}
              className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-amber-500"
              value={newProject.notes}
              onChange={e => setNewProject({ ...newProject, notes: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">目標に紐付ける (任意)</label>
            <select
              className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-amber-500"
              value={newProject.goalId}
              onChange={e => setNewProject({ ...newProject, goalId: e.target.value })}
            >
              <option value="">-- 紐付けなし --</option>
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
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
            >
              作成
            </button>
          </div>
        </form>
      )}

      {currentProjects.length === 0 && !isCreating ? (
        <div className="text-center py-10 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg flex flex-col items-center justify-center text-neutral-500">
          <Folder className="w-8 h-8 text-neutral-400 mb-3 opacity-50" />
          <p className="font-medium text-neutral-600 dark:text-neutral-400">プロジェクトがまだありません。</p>
          <p className="text-sm mt-1">タスクをプロジェクトにまとめましょう。</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {currentProjects.map((project) => {
            const isDone = project.status === 'done';
            const goal = currentGoals.find(g => g.id === project.goalId);
            const isEditing = editingProjectId === project.id;

            if (isEditing) {
              return (
                <li key={project.id} className="p-4 rounded-lg border border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/10 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Project (タイトル)</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                      value={editingProjectData.title || ''}
                      onChange={e => setEditingProjectData({ ...editingProjectData, title: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Deadline</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        value={editingProjectData.deadline || ''}
                        onChange={e => setEditingProjectData({ ...editingProjectData, deadline: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Priority</label>
                      <select
                        className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        value={editingProjectData.priority}
                        onChange={e => setEditingProjectData({ ...editingProjectData, priority: e.target.value as ProjectPriority })}
                      >
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
                      value={editingProjectData.notes || ''}
                      onChange={e => setEditingProjectData({ ...editingProjectData, notes: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">目標</label>
                    <select
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                      value={editingProjectData.goalId || ''}
                      onChange={e => setEditingProjectData({ ...editingProjectData, goalId: e.target.value || undefined })}
                    >
                      <option value="">-- 紐付けなし --</option>
                      {currentGoals.map(g => (
                        <option key={g.id} value={g.id}>{g.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={saveEdit}
                      className="flex items-center gap-1 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <Check className="w-4 h-4" />
                      保存
                    </button>
                  </div>
                </li>
              );
            }

            return (
              <li
                key={project.id}
                className={`group flex flex-col sm:flex-row sm:items-start gap-4 p-4 rounded-lg border transition-colors ${
                  isDone
                    ? 'border-neutral-100 dark:border-neutral-800/50 bg-neutral-50/50 dark:bg-neutral-900/50'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-amber-300 dark:hover:border-amber-700'
                }`}
              >
                {/* 1. Far Left: Deadline */}
                <div className="shrink-0 sm:w-28 mt-0.5">
                  {project.deadline ? (
                    <div className={`text-sm font-medium ${isDone ? 'text-neutral-400' : 'text-neutral-700 dark:text-neutral-300'}`}>
                      {project.deadline}
                    </div>
                  ) : (
                    <div className="text-xs text-neutral-400 dark:text-neutral-600">未設定</div>
                  )}
                </div>
                
                {/* 2. Middle: Title, Priority, Notes */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`block break-all ${isDone ? 'text-neutral-400 line-through' : 'text-neutral-900 dark:text-neutral-100 font-medium'}`}>
                      {project.title}
                    </span>
                    {project.priority === 'P0' && <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50">P0: High</span>}
                    {project.priority === 'P1' && <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50">P1: Medium</span>}
                    {project.priority === 'P2' && <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50">P2: Low</span>}
                  </div>
                  
                  {/* Notes below title */}
                  {project.notes && (
                    <div className={`text-sm mt-1.5 whitespace-pre-wrap ${isDone ? 'text-neutral-400' : 'text-neutral-600 dark:text-neutral-400'}`}>
                      {project.notes}
                    </div>
                  )}

                  {goal && !isDone && (
                    <div className="flex flex-wrap gap-2 mt-3 text-xs text-neutral-500">
                      <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-1.5 py-0.5 rounded">目標: {goal.title}</span>
                    </div>
                  )}
                </div>

                {/* 3. Far Right: Status and Actions */}
                <div className="shrink-0 flex items-center gap-3 mt-3 sm:mt-0">
                  <select
                    value={project.status}
                    onChange={(e) => updateProject(project.id, { status: e.target.value as ProjectStatus })}
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

                  <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEditing(project)}
                      className="p-1.5 text-neutral-400 hover:text-blue-500 transition-colors rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      title="編集"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="削除"
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
