'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Period, Goal, NonGoal, Project, Task } from '@/types';

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

  // Load from local storage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        setState(JSON.parse(savedData));
      } catch (e) {
        console.error('Failed to parse dashboard data', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const addPeriod = (period: Period) => {
    setState((prev) => {
      const isFirst = prev.periods.length === 0;
      return {
        ...prev,
        periods: [...prev.periods, period],
        currentPeriodId: isFirst ? period.id : prev.currentPeriodId,
      };
    });
  };

  const updatePeriod = (id: string, updates: Partial<Period>) => {
    setState((prev) => ({
      ...prev,
      periods: prev.periods.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  };

  const deletePeriod = (id: string) => {
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
  };

  const setCurrentPeriod = (id: string) => {
    setState((prev) => ({ ...prev, currentPeriodId: id }));
  };

  const addGoal = (goal: Goal) => {
    setState((prev) => ({ ...prev, goals: [...prev.goals, goal] }));
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }));
  };

  const deleteGoal = (id: string) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== id),
    }));
  };

  const addNonGoal = (nonGoal: NonGoal) => {
    setState((prev) => ({ ...prev, nonGoals: [...prev.nonGoals, nonGoal] }));
  };

  const updateNonGoal = (id: string, updates: Partial<NonGoal>) => {
    setState((prev) => ({
      ...prev,
      nonGoals: prev.nonGoals.map((ng) => (ng.id === id ? { ...ng, ...updates } : ng)),
    }));
  };

  const deleteNonGoal = (id: string) => {
    setState((prev) => ({
      ...prev,
      nonGoals: prev.nonGoals.filter((ng) => ng.id !== id),
    }));
  };

  const addProject = (project: Project) => {
    setState((prev) => ({ ...prev, projects: [...prev.projects, project] }));
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  };

  const deleteProject = (id: string) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
      // Also untie tasks from this project
      tasks: prev.tasks.map(t => t.projectId === id ? { ...t, projectId: undefined } : t),
    }));
  };

  const addTask = (task: Task) => {
    setState((prev) => ({ ...prev, tasks: [...prev.tasks, task] }));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  };

  const deleteTask = (id: string) => {
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
