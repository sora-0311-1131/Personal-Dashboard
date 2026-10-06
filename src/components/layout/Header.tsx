'use client';

import React from 'react';
import { useDashboard } from "@/store/DashboardContext";
import { CalendarDays } from "lucide-react";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** 'YYYY-MM-DD' をローカルタイムの 0:00 として解釈する（UTC ずれ防止） */
const parseLocalDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

type PeriodStatus = 'upcoming' | 'active' | 'finished';

/** 期間の総日数・経過日数・残り日数・進捗率を算出する */
const getPeriodProgress = (startDate: string, endDate: string) => {
  const start = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const totalDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / MS_PER_DAY) + 1);
  const rawDay = Math.round((today.getTime() - start.getTime()) / MS_PER_DAY) + 1;

  const status: PeriodStatus = rawDay < 1 ? 'upcoming' : rawDay > totalDays ? 'finished' : 'active';
  const currentDay = Math.min(Math.max(rawDay, 0), totalDays);
  const daysLeft = totalDays - currentDay;
  const daysUntilStart = status === 'upcoming' ? 1 - rawDay : 0;
  const percent = Math.round((currentDay / totalDays) * 100);

  return { totalDays, currentDay, daysLeft, daysUntilStart, percent, status };
};

const STATUS_STYLES: Record<PeriodStatus, { label: string; badge: string; dot: string }> = {
  active: {
    label: 'In progress',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50',
    dot: 'bg-emerald-500 animate-pulse',
  },
  upcoming: {
    label: 'Upcoming',
    badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50',
    dot: 'bg-amber-500',
  },
  finished: {
    label: 'Finished',
    badge: 'bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700',
    dot: 'bg-neutral-400',
  },
};

export default function Header() {
  const { state } = useDashboard();
  const currentPeriod = state.periods.find(p => p.id === state.currentPeriodId);

  return (
    <header className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none opacity-70" />

      <div className="relative z-10 w-full">
        {currentPeriod ? (
          <PeriodHeader
            name={currentPeriod.name}
            startDate={currentPeriod.startDate}
            endDate={currentPeriod.endDate}
            notes={currentPeriod.notes}
          />
        ) : (
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Welcome</h1>
            <p className="text-neutral-500">
              Select or create a period to get started.
            </p>
          </div>
        )}
      </div>
    </header>
  );
}

function PeriodHeader({ name, startDate, endDate, notes }: {
  name: string;
  startDate: string;
  endDate: string;
  notes?: string;
}) {
  const { totalDays, currentDay, daysLeft, daysUntilStart, percent, status } = getPeriodProgress(startDate, endDate);
  const statusStyle = STATUS_STYLES[status];

  return (
    <div>
      {/* Top row: status + date range */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyle.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
          {statusStyle.label}
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm text-neutral-500 font-medium tabular-nums">
          <CalendarDays className="w-4 h-4 opacity-70" />
          {startDate}
          <span className="opacity-40">→</span>
          {endDate}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
        {name}
      </h1>

      {/* Notes as a quote */}
      {notes && (
        <p className="mt-4 pl-4 border-l-2 border-blue-300 dark:border-blue-700 text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap max-w-2xl leading-relaxed">
          {notes}
        </p>
      )}

      {/* Progress */}
      <div className="mt-8">
        <div className="flex items-end justify-between mb-2 gap-4">
          <p className="text-sm text-neutral-500">
            {status === 'upcoming' ? (
              <>Starts in <span className="text-lg font-bold text-neutral-900 dark:text-white tabular-nums">{daysUntilStart}</span> days</>
            ) : (
              <>
                Day <span className="text-lg font-bold text-neutral-900 dark:text-white tabular-nums">{currentDay}</span>
                <span className="tabular-nums"> / {totalDays}</span>
              </>
            )}
          </p>
          <p className="text-sm text-neutral-500 text-right">
            {status === 'active' && (
              <><span className="text-lg font-bold text-blue-600 dark:text-blue-400 tabular-nums">{daysLeft}</span> days left</>
            )}
            {status === 'finished' && 'Completed'}
            {status === 'upcoming' && <span className="tabular-nums">{totalDays} days total</span>}
          </p>
        </div>
        <div
          className="w-full h-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden"
          role="progressbar"
          aria-label="Period progress"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700"
            style={{ width: `${Math.max(percent, status === 'active' ? 2 : 0)}%` }}
          />
        </div>
        <p className="mt-1.5 text-xs text-neutral-400 text-right tabular-nums">{percent}% elapsed</p>
      </div>
    </div>
  );
}
