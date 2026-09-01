export type EntityStatus = 'todo' | 'in-progress' | 'done';

export interface Period {
  id: string;
  name: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  notes?: string;
}

export type GoalPriority = 'P0' | 'P1' | 'P2';

export interface Goal {
  id: string;
  periodId: string;
  title: string;
  notes?: string;
  deadline?: string;
  priority?: GoalPriority;
  status: EntityStatus;
}

export interface NonGoal {
  id: string;
  periodId: string;
  title: string;
  notes?: string;
}

export type ProjectStatus = 'todo' | 'in-progress' | 'pending' | 'done';
export type ProjectPriority = 'P0' | 'P1' | 'P2';

export interface Project {
  id: string;
  periodId: string;
  goalId?: string;
  title: string;
  notes?: string;
  deadline?: string;
  priority?: ProjectPriority;
  status: ProjectStatus;
}

export type TaskStatus = 'todo' | 'in-progress' | 'pending' | 'done';
export type TaskPriority = 'P0' | 'P1' | 'P2';

export interface Task {
  id: string;
  periodId: string;
  projectId?: string;
  goalId?: string;
  title: string;
  notes?: string;
  deadline?: string; // ISO date string
  priority?: TaskPriority;
  status: TaskStatus;
}
