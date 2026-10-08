'use client';

import React from 'react';
import EventManager from "@/components/EventManager";

export default function EventsPage() {
  return (
    <main className="p-4 sm:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Events</h1>
          <p className="text-neutral-500 mt-2">Manage upcoming important dates and milestones.</p>
        </div>

        <div className="max-w-2xl">
          <EventManager />
        </div>
      </div>
    </main>
  );
}
