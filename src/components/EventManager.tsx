'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/store/DashboardContext';
import { Event } from '@/types';
import { CalendarDays, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { Linkify } from '@/components/Linkify';

const getDaysRemainingText = (dateString: string) => {
  const eventDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);
  const diffTime = eventDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1) return `${diffDays} days left`;
  return `${Math.abs(diffDays)} days ago`;
};

export default function EventManager() {
  const { state, addEvent, updateEvent, deleteEvent } = useDashboard();
  const [isCreating, setIsCreating] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', notes: '' });

  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editingEventData, setEditingEventData] = useState<Partial<Event>>({});
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

  const events = [...state.events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;

    const event: Event = {
      id: crypto.randomUUID(),
      title: newEvent.title,
      date: newEvent.date,
      notes: newEvent.notes || undefined,
    };
    
    addEvent(event);
    setNewEvent({ title: '', date: '', notes: '' });
    setIsCreating(false);
  };

  const startEditing = (ev: Event) => {
    setEditingEventId(ev.id);
    setEditingEventData(ev);
  };

  const saveEdit = () => {
    if (editingEventId && editingEventData.title && editingEventData.date) {
      updateEvent(editingEventId, editingEventData);
      setEditingEventId(null);
    }
  };

  const cancelEdit = () => {
    setEditingEventId(null);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-indigo-500" />
          Events
        </h2>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="text-sm flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      <p className="text-sm text-neutral-500 mb-4">
        Important dates or milestones.
      </p>

      {isCreating && (
        <form onSubmit={handleCreate} className="mb-6 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Event Title</label>
            <input
              type="text"
              required
              placeholder="e.g., TOEIC Exam"
              className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              value={newEvent.title}
              onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              required
              className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              value={newEvent.date}
              onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              rows={2}
              className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              value={newEvent.notes}
              onChange={e => setNewEvent({ ...newEvent, notes: e.target.value })}
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
              Add
            </button>
          </div>
        </form>
      )}

      {events.length === 0 && !isCreating ? (
        <div className="text-center py-4 text-neutral-500 text-sm">
          No events registered.
        </div>
      ) : (
        <ul className="space-y-2">
          {events.map((ev) => {
            const isEditing = editingEventId === ev.id;
            const diffDays = Math.round((new Date(ev.date).getTime() - new Date().setHours(0,0,0,0)) / (1000 * 60 * 60 * 24));
            const isPast = diffDays < 0;

            if (isEditing) {
              return (
                <li key={ev.id} className="p-4 rounded-lg border border-indigo-300 dark:border-indigo-700 bg-indigo-50/50 dark:bg-indigo-900/10 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Event Title</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      value={editingEventData.title || ''}
                      onChange={e => setEditingEventData({ ...editingEventData, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input
                      type="date"
                      required
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      value={editingEventData.date || ''}
                      onChange={e => setEditingEventData({ ...editingEventData, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      value={editingEventData.notes || ''}
                      onChange={e => setEditingEventData({ ...editingEventData, notes: e.target.value })}
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
              key={ev.id}
              onMouseEnter={() => setHoveredEventId(ev.id)}
              onMouseLeave={() => setHoveredEventId(null)}
              className={`flex items-start gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/30 text-sm border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 transition-colors ${isPast ? 'opacity-60' : 'text-neutral-700 dark:text-neutral-300'}`}
            >
              <div className="flex flex-col items-center justify-center shrink-0 w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
                <span className="text-xs font-bold leading-none">{new Date(ev.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                <span className="text-lg font-black leading-none mt-1">{new Date(ev.date).getDate()}</span>
              </div>
              <div className="flex-1 flex flex-col min-w-0 py-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-neutral-900 dark:text-white">{ev.title}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${diffDays > 0 ? (diffDays <= 7 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400') : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'}`}>
                    {getDaysRemainingText(ev.date)}
                  </span>
                </div>
                {ev.notes && (
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 whitespace-pre-wrap"><Linkify>{ev.notes}</Linkify></span>
                )}
              </div>
              <div className={`flex items-center gap-1 transition-opacity duration-200 ml-2 shrink-0 ${hoveredEventId === ev.id ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <button
                  onClick={() => startEditing(ev)}
                  className="p-1.5 text-neutral-400 hover:text-indigo-500 transition-colors rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteEvent(ev.id)}
                  className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
