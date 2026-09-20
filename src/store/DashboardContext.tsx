'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Period, Goal, NonGoal, Project, Task } from '@/types';
import { createClient } from '@/utils/supabase/client';
import {
  fromDbPeriod, toDbPeriod,
  fromDbGoal, toDbGoal,
  fromDbNonGoal, toDbNonGoal,
  fromDbProject, toDbProject,
  fromDbTask, toDbTask
} from '@/utils/supabase/mapper';

interface DashboardState {
  periods: Period[];
  currentPeriodId: string | null;
  goals: Goal[];
  nonGoals: NonGoal[];
  projects: Project[];
  tasks: Task[];
}

const initialState: DashboardState = {
  periods: [],
  currentPeriodId: null,
  goals: [],
  nonGoals: [],
  projects: [],
  tasks: [],
};

interface DashboardContextType {
  state: DashboardState;
  isLoaded: boolean;
  addPeriod: (period: Period) => void;
  updatePeriod: (id: string, updates: Partial<Period>) => void;
  deletePeriod: (id: string) => void;
  setCurrentPeriod: (id: string) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addNonGoal: (nonGoal: NonGoal) => void;
  updateNonGoal: (id: string, updates: Partial<NonGoal>) => void;
  deleteNonGoal: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'personal-dashboard-data';

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DashboardState>(initialState);
  const [isLoaded, setIsLoaded] = useState(false);
  const supabase = createClient();

  // Load from Supabase on mount
  useEffect(() => {
    let mounted = true;
    
    const initializeData = async () => {
      try {
        const [
          { data: periodsData, error: pErr },
          { data: goalsData, error: gErr },
          { data: nonGoalsData, error: ngErr },
          { data: projectsData, error: prjErr },
          { data: tasksData, error: tErr }
        ] = await Promise.all([
          supabase.from('periods').select('*'),
          supabase.from('goals').select('*'),
          supabase.from('non_goals').select('*'),
          supabase.from('projects').select('*'),
          supabase.from('tasks').select('*')
        ]);

        if (pErr) throw pErr;
        if (gErr) throw gErr;
        if (ngErr) throw ngErr;
        if (prjErr) throw prjErr;
        if (tErr) throw tErr;

        const fetchedPeriods = (periodsData || []).map(fromDbPeriod);
        const fetchedGoals = (goalsData || []).map(fromDbGoal);
        const fetchedNonGoals = (nonGoalsData || []).map(fromDbNonGoal);
        const fetchedProjects = (projectsData || []).map(fromDbProject);
        const fetchedTasks = (tasksData || []).map(fromDbTask);

        // --- Local Storage Migration Logic ---
        const isEmptyDb = fetchedPeriods.length === 0 && fetchedGoals.length === 0 &&
                          fetchedNonGoals.length === 0 && fetchedProjects.length === 0 &&
                          fetchedTasks.length === 0;

        const savedLocalStr = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (isEmptyDb && savedLocalStr) {
          console.log('Starting local storage migration to Supabase...');
          try {
            const localData = JSON.parse(savedLocalStr) as DashboardState;
            
            // Insert in order of constraints to respect Foreign Keys
            if (localData.periods && localData.periods.length > 0) {
              const { error } = await supabase.from('periods').insert(localData.periods.map(toDbPeriod));
              if (error) throw error;
            }
            if (localData.goals && localData.goals.length > 0) {
              const { error } = await supabase.from('goals').insert(localData.goals.map(toDbGoal));
              if (error) throw error;
            }
            if (localData.nonGoals && localData.nonGoals.length > 0) {
              const { error } = await supabase.from('non_goals').insert(localData.nonGoals.map(toDbNonGoal));
              if (error) throw error;
            }
            if (localData.projects && localData.projects.length > 0) {
              const { error } = await supabase.from('projects').insert(localData.projects.map(toDbProject));
              if (error) throw error;
            }
            if (localData.tasks && localData.tasks.length > 0) {
              const { error } = await supabase.from('tasks').insert(localData.tasks.map(toDbTask));
              if (error) throw error;
            }
            
            console.log('Migration successful. Clearing local storage.');
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            
            if (mounted) {
              setState({
                periods: localData.periods || [],
                goals: localData.goals || [],
                nonGoals: localData.nonGoals || [],
                projects: localData.projects || [],
                tasks: localData.tasks || [],
                currentPeriodId: localData.currentPeriodId || null,
              });
              setIsLoaded(true);
            }
            return;
          } catch (migrationErr) {
            console.error('Migration failed, local storage intact:', migrationErr);
            // Fallthrough to normal load logic (empty DB) on failure
          }
        }

        // --- Normal Load ---
        if (mounted) {
          setState({
            periods: fetchedPeriods,
            goals: fetchedGoals,
            nonGoals: fetchedNonGoals,
            projects: fetchedProjects,
            tasks: fetchedTasks,
            currentPeriodId: fetchedPeriods.length > 0 ? fetchedPeriods[0].id : null,
          });
          setIsLoaded(true);
        }
      } catch (err) {
        console.error('Failed to load data from Supabase', err);
        if (mounted) setIsLoaded(true);
      }
    };

    initializeData();

    return () => {
      mounted = false;
    };
  }, []);

  // --- CRUD Operations ---
  // Period
  const addPeriod = async (period: Period) => {
    const { error } = await supabase.from('periods').insert(toDbPeriod(period));
    if (error) {
      console.error('Failed to add period', error);
      return;
    }
    setState((prev) => {
      const isFirst = prev.periods.length === 0;
      return {
        ...prev,
        periods: [...prev.periods, period],
        currentPeriodId: isFirst ? period.id : prev.currentPeriodId,
      };
    });
  };

  const updatePeriod = async (id: string, updates: Partial<Period>) => {
    // Generate db-compatible partial updates
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.startDate !== undefined) dbUpdates.start_date = updates.startDate;
    if (updates.endDate !== undefined) dbUpdates.end_date = updates.endDate;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes === undefined ? null : updates.notes;

    const { error } = await supabase.from('periods').update(dbUpdates).eq('id', id);
    if (error) {
      console.error('Failed to update period', error);
      return;
    }
    setState((prev) => ({
      ...prev,
      periods: prev.periods.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  };

  const deletePeriod = async (id: string) => {
    try {
      // Must delete dependencies first (No action foreign keys)
      const { error: tErr } = await supabase.from('tasks').delete().eq('period_id', id);
      if (tErr) throw tErr;
      const { error: pErr } = await supabase.from('projects').delete().eq('period_id', id);
      if (pErr) throw pErr;
      const { error: ngErr } = await supabase.from('non_goals').delete().eq('period_id', id);
      if (ngErr) throw ngErr;
      const { error: gErr } = await supabase.from('goals').delete().eq('period_id', id);
      if (gErr) throw gErr;
      const { error: periodErr } = await supabase.from('periods').delete().eq('id', id);
      if (periodErr) throw periodErr;

      setState((prev) => {
        const remainingPeriods = prev.periods.filter((p) => p.id !== id);
        let newCurrentPeriodId = prev.currentPeriodId;
        if (prev.currentPeriodId === id) {
          newCurrentPeriodId = remainingPeriods.length > 0 ? remainingPeriods[0].id : null;
        }
        return {
          ...prev,
          periods: remainingPeriods,
          currentPeriodId: newCurrentPeriodId,
          goals: prev.goals.filter(g => g.periodId !== id),
          nonGoals: prev.nonGoals.filter(ng => ng.periodId !== id),
          projects: prev.projects.filter(p => p.periodId !== id),
          tasks: prev.tasks.filter(t => t.periodId !== id),
        };
      });
    } catch (err) {
      console.error('Failed to delete period and related data', err);
    }
  };

  const setCurrentPeriod = (id: string) => {
    setState((prev) => ({ ...prev, currentPeriodId: id }));
  };

  // Goal
  const addGoal = async (goal: Goal) => {
    const { error } = await supabase.from('goals').insert(toDbGoal(goal));
    if (error) {
      console.error('Failed to add goal', error);
      return;
    }
    setState((prev) => ({ ...prev, goals: [...prev.goals, goal] }));
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    const dbUpdates: any = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes ?? null;
    if (updates.deadline !== undefined) dbUpdates.deadline = updates.deadline ?? null;
    if (updates.priority !== undefined) dbUpdates.priority = updates.priority ?? null;
    if (updates.status !== undefined) dbUpdates.status = updates.status;

    const { error } = await supabase.from('goals').update(dbUpdates).eq('id', id);
    if (error) {
      console.error('Failed to update goal', error);
      return;
    }
    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }));
  };

  const deleteGoal = async (id: string) => {
    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (error) {
      // NOTE: If tasks or projects are referencing this goal, Supabase will throw a constraint error.
      // We log it and prevent state from breaking.
      console.error('Failed to delete goal. (There might be dependent projects or tasks)', error);
      return;
    }
    setState((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== id),
    }));
  };

  // NonGoal
  const addNonGoal = async (nonGoal: NonGoal) => {
    const { error } = await supabase.from('non_goals').insert(toDbNonGoal(nonGoal));
    if (error) {
      console.error('Failed to add non-goal', error);
      return;
    }
    setState((prev) => ({ ...prev, nonGoals: [...prev.nonGoals, nonGoal] }));
  };

  const updateNonGoal = async (id: string, updates: Partial<NonGoal>) => {
    const dbUpdates: any = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes ?? null;

    const { error } = await supabase.from('non_goals').update(dbUpdates).eq('id', id);
    if (error) {
      console.error('Failed to update non-goal', error);
      return;
    }
    setState((prev) => ({
      ...prev,
      nonGoals: prev.nonGoals.map((ng) => (ng.id === id ? { ...ng, ...updates } : ng)),
    }));
  };

  const deleteNonGoal = async (id: string) => {
    const { error } = await supabase.from('non_goals').delete().eq('id', id);
    if (error) {
      console.error('Failed to delete non-goal', error);
      return;
    }
    setState((prev) => ({
      ...prev,
      nonGoals: prev.nonGoals.filter((ng) => ng.id !== id),
    }));
  };

  // Project
  const addProject = async (project: Project) => {
    const { error } = await supabase.from('projects').insert(toDbProject(project));
    if (error) {
      console.error('Failed to add project', error);
      return;
    }
    setState((prev) => ({ ...prev, projects: [...prev.projects, project] }));
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const dbUpdates: any = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.goalId !== undefined) dbUpdates.goal_id = updates.goalId ?? null;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes ?? null;
    if (updates.deadline !== undefined) dbUpdates.deadline = updates.deadline ?? null;
    if (updates.priority !== undefined) dbUpdates.priority = updates.priority ?? null;
    if (updates.status !== undefined) dbUpdates.status = updates.status;

    const { error } = await supabase.from('projects').update(dbUpdates).eq('id', id);
    if (error) {
      console.error('Failed to update project', error);
      return;
    }
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  };

  const deleteProject = async (id: string) => {
    try {
      // Must untie tasks referencing this project before deletion to prevent FK constraint error
      const { error: tErr } = await supabase.from('tasks').update({ project_id: null }).eq('project_id', id);
      if (tErr) throw tErr;

      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;

      setState((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== id),
        tasks: prev.tasks.map(t => t.projectId === id ? { ...t, projectId: undefined } : t),
      }));
    } catch (err) {
      console.error('Failed to delete project', err);
    }
  };

  // Task
  const addTask = async (task: Task) => {
    const { error } = await supabase.from('tasks').insert(toDbTask(task));
    if (error) {
      console.error('Failed to add task', error);
      return;
    }
    setState((prev) => ({ ...prev, tasks: [...prev.tasks, task] }));
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const dbUpdates: any = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.projectId !== undefined) dbUpdates.project_id = updates.projectId ?? null;
    if (updates.goalId !== undefined) dbUpdates.goal_id = updates.goalId ?? null;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes ?? null;
    if (updates.deadline !== undefined) dbUpdates.deadline = updates.deadline ?? null;
    if (updates.priority !== undefined) dbUpdates.priority = updates.priority ?? null;
    if (updates.status !== undefined) dbUpdates.status = updates.status;

    const { error } = await supabase.from('tasks').update(dbUpdates).eq('id', id);
    if (error) {
      console.error('Failed to update task', error);
      return;
    }
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) {
      console.error('Failed to delete task', error);
      return;
    }
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }));
  };

  return (
    <DashboardContext.Provider
      value={{
        state,
        isLoaded,
        addPeriod,
        updatePeriod,
        deletePeriod,
        setCurrentPeriod,
        addGoal,
        updateGoal,
        deleteGoal,
        addNonGoal,
        updateNonGoal,
        deleteNonGoal,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
