export type EntityStatus = 'todo' | 'in-progress' | 'done';
export type Priority = 'P1' | 'P2' | 'P3' | 'none';

export interface Period {
  id: string;
  name: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  description?: string;
}

export interface Goal {
  id: string;
  periodId: string;
  title: string;
  description?: string;
  priority: Priority;
  status: EntityStatus;
}

export interface NonGoal {
  id: string;
  periodId: string;
  title: string;
  description?: string;
}

export interface Project {
  id: string;
  periodId: string;
  goalId?: string;
  title: string;
  description?: string;
  status: EntityStatus;
}

export interface Task {
  id: string;
  periodId: string;
  projectId?: string;
  goalId?: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO date string
  status: EntityStatus;
}
