'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/store/DashboardContext';
import { Task, TaskPriority, TaskStatus } from '@/types';
import { CheckSquare, Plus, Trash2 } from 'lucide-react';

export default function TaskManager() {
  const { state, addTask, updateTask, deleteTask } = useDashboard();
  const [isCreating, setIsCreating] = useState(false);
  const [newTask, setNewTask] = useState<{
    title: string;
    projectId: string;
    goalId: string;
    priority: TaskPriority;
    deadline: string;
    notes: string;
  }>({ title: '', projectId: '', goalId: '', priority: 'P1', deadline: '', notes: '' });

  const currentPeriodId = state.currentPeriodId;
  const currentTasks = state.tasks.filter((t) => t.periodId === currentPeriodId);
  const currentProjects = state.projects.filter((p) => p.periodId === currentPeriodId);
  const currentGoals = state.goals.filter((g) => g.periodId === currentPeriodId);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !currentPeriodId) return;

    const task: Task = {
      id: crypto.randomUUID(),
      periodId: currentPeriodId,
      projectId: newTask.projectId || undefined,
      goalId: newTask.goalId || undefined,
      title: newTask.title,
      notes: newTask.notes || undefined,
      deadline: newTask.deadline || undefined,
      priority: newTask.priority,
      status: 'todo',
    };
    
    addTask(task);
    setNewTask({ title: '', projectId: '', goalId: '', priority: 'P1', deadline: '', notes: '' });
    setIsCreating(false);
  };

  if (!currentPeriodId) return null;

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-emerald-500" />
          Task
        </h2>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="text-sm flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium"
        >
          <Plus className="w-4 h-4" />
          新規作成
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="mb-6 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Task (タイトル)</label>
            <input
              type="text"
              required
              placeholder="例: PRDを作成する"
              className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-emerald-500"
              value={newTask.title}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Deadline</label>
              <input
                type="date"
                className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-emerald-500"
                value={newTask.deadline}
                onChange={e => setNewTask({ ...newTask, deadline: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-emerald-500"
                value={newTask.priority}
                onChange={e => setNewTask({ ...newTask, priority: e.target.value as TaskPriority })}
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
              className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-emerald-500"
              value={newTask.notes}
              onChange={e => setNewTask({ ...newTask, notes: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">プロジェクトに紐付ける (任意)</label>
              <select
                className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-emerald-500"
                value={newTask.projectId}
                onChange={e => setNewTask({ ...newTask, projectId: e.target.value })}
              >
                <option value="">-- 紐付けなし --</option>
                {currentProjects.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">目標に紐付ける (任意)</label>
              <select
                className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-emerald-500"
                value={newTask.goalId}
                onChange={e => setNewTask({ ...newTask, goalId: e.target.value })}
              >
                <option value="">-- 紐付けなし --</option>
                {currentGoals.map(g => (
                  <option key={g.id} value={g.id}>{g.title}</option>
                ))}
              </select>
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
              className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
            >
              作成
            </button>
          </div>
        </form>
      )}

      {currentTasks.length === 0 && !isCreating ? (
        <div className="text-center py-10 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg flex flex-col items-center justify-center text-neutral-500">
          <CheckSquare className="w-8 h-8 text-neutral-400 mb-3 opacity-50" />
          <p className="font-medium text-neutral-600 dark:text-neutral-400">タスクがまだありません。</p>
          <p className="text-sm mt-1">タスクを追加して行動を開始しましょう。</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {currentTasks.map((task) => {
            const isDone = task.status === 'done';
            const project = currentProjects.find(p => p.id === task.projectId);
            const goal = currentGoals.find(g => g.id === task.goalId);

            return (
              <li
                key={task.id}
                className={`group flex items-start gap-3 p-4 rounded-lg border transition-colors ${
                  isDone 
                    ? 'border-neutral-100 dark:border-neutral-800/50 bg-neutral-50/50 dark:bg-neutral-900/50' 
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-emerald-300 dark:hover:border-emerald-700'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  <select
                    value={task.status}
                    onChange={(e) => updateTask(task.id, { status: e.target.value as TaskStatus })}
                    className={`text-xs font-semibold rounded-md px-2 py-1 border outline-none cursor-pointer ${
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
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`block break-all ${isDone ? 'text-neutral-400 line-through' : 'text-neutral-900 dark:text-neutral-100 font-medium'}`}>
                      {task.title}
                    </span>
                    {task.priority === 'P0' && <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50">P0: High</span>}
                    {task.priority === 'P1' && <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50">P1: Medium</span>}
                    {task.priority === 'P2' && <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50">P2: Low</span>}
                  </div>
                  
                  {task.deadline && (
                    <div className={`text-xs mt-1.5 ${isDone ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      Deadline: {task.deadline}
                    </div>
                  )}
                  
                  {task.notes && (
                    <div className={`text-sm mt-2 whitespace-pre-wrap ${isDone ? 'text-neutral-400' : 'text-neutral-600 dark:text-neutral-400'}`}>
                      {task.notes}
                    </div>
                  )}

                  {(project || goal) && !isDone && (
                    <div className="flex flex-wrap gap-2 mt-3 text-xs text-neutral-500">
                      {project && <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded">プロジェクト: {project.title}</span>}
                      {goal && <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-1.5 py-0.5 rounded">目標: {goal.title}</span>}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="shrink-0 opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-500 transition-opacity p-1 ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
