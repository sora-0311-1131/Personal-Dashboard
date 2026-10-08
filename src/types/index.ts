export type EntityStatus = 'todo' | 'in-progress' | 'done';
export type ExtendedStatus = 'todo' | 'in-progress' | 'pending' | 'done';
export type Priority = 'P0' | 'P1' | 'P2';

export interface Period {
  id: string;
  userId?: string;
  name: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  notes?: string;
}

export interface Goal {
  id: string;
  userId?: string;
  periodId: string;
  title: string;
  notes?: string;
  deadline?: string;
  priority?: Priority;
  status: EntityStatus;
}

export interface NonGoal {
  id: string;
  userId?: string;
  periodId: string;
  title: string;
  notes?: string;
}

export interface Project {
  id: string;
  userId?: string;
  periodId: string;
  goalId?: string;
  title: string;
  notes?: string;
  deadline?: string;
  priority?: Priority;
  status: ExtendedStatus;
}

export interface Task {
  id: string;
  userId?: string;
  periodId: string;
  projectId?: string;
  goalId?: string;
  title: string;
  notes?: string;
  deadline?: string; // ISO date string
  priority?: Priority;
  status: ExtendedStatus;
}

export interface Event {
  id: string;
  userId?: string;
  title: string;
  date: string; // ISO date string (YYYY-MM-DD)
  notes?: string;
}
