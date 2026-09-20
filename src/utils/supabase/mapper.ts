import { Period, Goal, NonGoal, Project, Task, EntityStatus, GoalPriority, ProjectPriority, ProjectStatus, TaskPriority, TaskStatus } from '@/types';

// Utility to convert undefined to null for DB insertion
const toDbNull = <T>(value: T | undefined): T | null => (value === undefined ? null : value);
// Utility to convert null to undefined for Frontend state
const fromDbNull = <T>(value: T | null): T | undefined => (value === null ? undefined : value);

// --- Period ---
export const toDbPeriod = (period: Period) => ({
  id: period.id,
  name: period.name,
  start_date: period.startDate,
  end_date: period.endDate,
  notes: toDbNull(period.notes),
});

export const fromDbPeriod = (row: any): Period => ({
  id: row.id,
  name: row.name,
  startDate: row.start_date,
  endDate: row.end_date,
  notes: fromDbNull(row.notes),
});

// --- Goal ---
export const toDbGoal = (goal: Goal) => ({
  id: goal.id,
  period_id: goal.periodId,
  title: goal.title,
  notes: toDbNull(goal.notes),
  deadline: toDbNull(goal.deadline),
  priority: toDbNull(goal.priority),
  status: goal.status,
});

export const fromDbGoal = (row: any): Goal => ({
  id: row.id,
  periodId: row.period_id,
  title: row.title,
  notes: fromDbNull(row.notes),
  deadline: fromDbNull(row.deadline),
  priority: fromDbNull(row.priority) as GoalPriority | undefined,
  status: row.status as EntityStatus,
});

// --- NonGoal ---
export const toDbNonGoal = (nonGoal: NonGoal) => ({
  id: nonGoal.id,
  period_id: nonGoal.periodId,
  title: nonGoal.title,
  notes: toDbNull(nonGoal.notes),
});

export const fromDbNonGoal = (row: any): NonGoal => ({
  id: row.id,
  periodId: row.period_id,
  title: row.title,
  notes: fromDbNull(row.notes),
});

// --- Project ---
export const toDbProject = (project: Project) => ({
  id: project.id,
  period_id: project.periodId,
  goal_id: toDbNull(project.goalId),
  title: project.title,
  notes: toDbNull(project.notes),
  deadline: toDbNull(project.deadline),
  priority: toDbNull(project.priority),
  status: project.status,
});

export const fromDbProject = (row: any): Project => ({
  id: row.id,
  periodId: row.period_id,
  goalId: fromDbNull(row.goal_id),
  title: row.title,
  notes: fromDbNull(row.notes),
  deadline: fromDbNull(row.deadline),
  priority: fromDbNull(row.priority) as ProjectPriority | undefined,
  status: row.status as ProjectStatus,
});

// --- Task ---
export const toDbTask = (task: Task) => ({
  id: task.id,
  period_id: task.periodId,
  project_id: toDbNull(task.projectId),
  goal_id: toDbNull(task.goalId),
  title: task.title,
  notes: toDbNull(task.notes),
  deadline: toDbNull(task.deadline),
  priority: toDbNull(task.priority),
  status: task.status,
});

export const fromDbTask = (row: any): Task => ({
  id: row.id,
  periodId: row.period_id,
  projectId: fromDbNull(row.project_id),
  goalId: fromDbNull(row.goal_id),
  title: row.title,
  notes: fromDbNull(row.notes),
  deadline: fromDbNull(row.deadline),
  priority: fromDbNull(row.priority) as TaskPriority | undefined,
  status: row.status as TaskStatus,
});
