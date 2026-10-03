import { create } from 'zustand';
import { Period, Goal, NonGoal, Project, Task } from '@/types';
import { createClient } from '@/utils/supabase/client';
import {
  fromDbPeriod, toDbPeriod,
  fromDbGoal, toDbGoal,
  fromDbNonGoal, toDbNonGoal,
  fromDbProject, toDbProject,
  fromDbTask, toDbTask
} from '@/utils/supabase/mapper';

export interface DashboardState {
  periods: Period[];
  currentPeriodId: string | null;
  goals: Goal[];
  nonGoals: NonGoal[];
  projects: Project[];
  tasks: Task[];
}

interface DashboardStore {
  state: DashboardState;
  isLoaded: boolean;
  initializeData: (userId?: string) => Promise<void>;
  clearData: () => void;
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

const initialState: DashboardState = {
  periods: [],
  currentPeriodId: null,
  goals: [],
  nonGoals: [],
  projects: [],
  tasks: [],
};

const LAST_SELECTED_PERIOD_KEY = 'personal-dashboard-last-period-id';

const getDefaultPeriodId = (periods: Period[]): string | null => {
  if (periods.length === 0) return null;
  const d = new Date();
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const activePeriods = periods.filter(p => p.startDate <= today && p.endDate >= today);
  if (activePeriods.length > 0) {
    activePeriods.sort((a, b) => a.id.localeCompare(b.id));
    return activePeriods[0].id;
  }
  return periods[0].id;
};

export const useDashboardStore = create<DashboardStore>((set, get) => {
  const supabase = createClient();

  return {
    state: initialState,
    isLoaded: false,

    clearData: () => set({ state: initialState, isLoaded: false }),

    initializeData: async (userId?: string) => {
      try {
        const [
          { data: periodsData },
          { data: goalsData },
          { data: nonGoalsData },
          { data: projectsData },
          { data: tasksData }
        ] = await Promise.all([
          supabase.from('periods').select('*').order('start_date', { ascending: false }),
          supabase.from('goals').select('*'),
          supabase.from('non_goals').select('*'),
          supabase.from('projects').select('*'),
          supabase.from('tasks').select('*')
        ]);

        const fetchedPeriods = (periodsData || []).map(fromDbPeriod).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        const fetchedGoals = (goalsData || []).map(fromDbGoal);
        const fetchedNonGoals = (nonGoalsData || []).map(fromDbNonGoal);
        const fetchedProjects = (projectsData || []).map(fromDbProject);
        const fetchedTasks = (tasksData || []).map(fromDbTask);

        let initialPeriodId = null;
        const savedPeriodId = localStorage.getItem(LAST_SELECTED_PERIOD_KEY);
        if (savedPeriodId && fetchedPeriods.some(p => p.id === savedPeriodId)) {
          initialPeriodId = savedPeriodId;
        } else {
          initialPeriodId = getDefaultPeriodId(fetchedPeriods);
          if (initialPeriodId) {
            localStorage.setItem(LAST_SELECTED_PERIOD_KEY, initialPeriodId);
          }
        }

        set({
          state: {
            periods: fetchedPeriods,
            goals: fetchedGoals,
            nonGoals: fetchedNonGoals,
            projects: fetchedProjects,
            tasks: fetchedTasks,
            currentPeriodId: initialPeriodId,
          },
          isLoaded: true
        });
      } catch (err) {
        console.error('Failed to load data from Supabase', err);
        set({ isLoaded: true });
      }
    },

    addPeriod: async (period: Period) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase.from('periods').insert({ ...toDbPeriod(period), user_id: user.id });
      if (error) return console.error('Failed to add period', error);
      
      set(prev => {
        const isFirst = prev.state.periods.length === 0;
        const newPeriods = [...prev.state.periods, period].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        const newCurrentPeriodId = isFirst ? period.id : prev.state.currentPeriodId;
        if (isFirst) localStorage.setItem(LAST_SELECTED_PERIOD_KEY, period.id);
        
        return { state: { ...prev.state, periods: newPeriods, currentPeriodId: newCurrentPeriodId } };
      });
    },

    updatePeriod: async (id: string, updates: Partial<Period>) => {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.startDate !== undefined) dbUpdates.start_date = updates.startDate;
      if (updates.endDate !== undefined) dbUpdates.end_date = updates.endDate;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes === undefined ? null : updates.notes;

      const { error } = await supabase.from('periods').update(dbUpdates).eq('id', id);
      if (error) return console.error('Failed to update period', error);
      
      set(prev => {
        const newPeriods = prev.state.periods.map(p => (p.id === id ? { ...p, ...updates } : p));
        newPeriods.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        return { state: { ...prev.state, periods: newPeriods } };
      });
    },

    deletePeriod: async (id: string) => {
      try {
        await supabase.from('tasks').delete().eq('period_id', id);
        await supabase.from('projects').delete().eq('period_id', id);
        await supabase.from('non_goals').delete().eq('period_id', id);
        await supabase.from('goals').delete().eq('period_id', id);
        await supabase.from('periods').delete().eq('id', id);

        set(prev => {
          const remainingPeriods = prev.state.periods.filter(p => p.id !== id);
          let newCurrentPeriodId = prev.state.currentPeriodId;
          if (prev.state.currentPeriodId === id) {
            newCurrentPeriodId = getDefaultPeriodId(remainingPeriods);
            if (newCurrentPeriodId) localStorage.setItem(LAST_SELECTED_PERIOD_KEY, newCurrentPeriodId);
            else localStorage.removeItem(LAST_SELECTED_PERIOD_KEY);
          }
          return {
            state: {
              ...prev.state,
              periods: remainingPeriods,
              currentPeriodId: newCurrentPeriodId,
              goals: prev.state.goals.filter(g => g.periodId !== id),
              nonGoals: prev.state.nonGoals.filter(ng => ng.periodId !== id),
              projects: prev.state.projects.filter(p => p.periodId !== id),
              tasks: prev.state.tasks.filter(t => t.periodId !== id),
            }
          };
        });
      } catch (err) {
        console.error('Failed to delete period', err);
      }
    },

    setCurrentPeriod: (id: string) => {
      localStorage.setItem(LAST_SELECTED_PERIOD_KEY, id);
      set(prev => ({ state: { ...prev.state, currentPeriodId: id } }));
    },

    addGoal: async (goal: Goal) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase.from('goals').insert({ ...toDbGoal(goal), user_id: user.id });
      if (error) return console.error('Failed to add goal', error);
      set(prev => ({ state: { ...prev.state, goals: [...prev.state.goals, goal] } }));
    },

    updateGoal: async (id: string, updates: Partial<Goal>) => {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes ?? null;
      if (updates.deadline !== undefined) dbUpdates.deadline = updates.deadline ?? null;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority ?? null;
      if (updates.status !== undefined) dbUpdates.status = updates.status;

      const { error } = await supabase.from('goals').update(dbUpdates).eq('id', id);
      if (error) return console.error('Failed to update goal', error);
      
      set(prev => ({
        state: { ...prev.state, goals: prev.state.goals.map(g => (g.id === id ? { ...g, ...updates } : g)) }
      }));
    },

    deleteGoal: async (id: string) => {
      const { error } = await supabase.from('goals').delete().eq('id', id);
      if (error) return console.error('Failed to delete goal', error);
      set(prev => ({ state: { ...prev.state, goals: prev.state.goals.filter(g => g.id !== id) } }));
    },

    addNonGoal: async (nonGoal: NonGoal) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase.from('non_goals').insert({ ...toDbNonGoal(nonGoal), user_id: user.id });
      if (error) return console.error('Failed to add non-goal', error);
      set(prev => ({ state: { ...prev.state, nonGoals: [...prev.state.nonGoals, nonGoal] } }));
    },

    updateNonGoal: async (id: string, updates: Partial<NonGoal>) => {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes ?? null;

      const { error } = await supabase.from('non_goals').update(dbUpdates).eq('id', id);
      if (error) return console.error('Failed to update non-goal', error);
      
      set(prev => ({
        state: { ...prev.state, nonGoals: prev.state.nonGoals.map(ng => (ng.id === id ? { ...ng, ...updates } : ng)) }
      }));
    },

    deleteNonGoal: async (id: string) => {
      const { error } = await supabase.from('non_goals').delete().eq('id', id);
      if (error) return console.error('Failed to delete non-goal', error);
      set(prev => ({ state: { ...prev.state, nonGoals: prev.state.nonGoals.filter(ng => ng.id !== id) } }));
    },

    addProject: async (project: Project) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase.from('projects').insert({ ...toDbProject(project), user_id: user.id });
      if (error) return console.error('Failed to add project', error);
      set(prev => ({ state: { ...prev.state, projects: [...prev.state.projects, project] } }));
    },

    updateProject: async (id: string, updates: Partial<Project>) => {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.goalId !== undefined) dbUpdates.goal_id = updates.goalId ?? null;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes ?? null;
      if (updates.deadline !== undefined) dbUpdates.deadline = updates.deadline ?? null;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority ?? null;
      if (updates.status !== undefined) dbUpdates.status = updates.status;

      const { error } = await supabase.from('projects').update(dbUpdates).eq('id', id);
      if (error) return console.error('Failed to update project', error);
      
      set(prev => ({
        state: { ...prev.state, projects: prev.state.projects.map(p => (p.id === id ? { ...p, ...updates } : p)) }
      }));
    },

    deleteProject: async (id: string) => {
      try {
        await supabase.from('tasks').update({ project_id: null }).eq('project_id', id);
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) throw error;

        set(prev => ({
          state: {
            ...prev.state,
            projects: prev.state.projects.filter(p => p.id !== id),
            tasks: prev.state.tasks.map(t => t.projectId === id ? { ...t, projectId: undefined } : t),
          }
        }));
      } catch (err) {
        console.error('Failed to delete project', err);
      }
    },

    addTask: async (task: Task) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase.from('tasks').insert({ ...toDbTask(task), user_id: user.id });
      if (error) return console.error('Failed to add task', error);
      set(prev => ({ state: { ...prev.state, tasks: [...prev.state.tasks, task] } }));
    },

    updateTask: async (id: string, updates: Partial<Task>) => {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.projectId !== undefined) dbUpdates.project_id = updates.projectId ?? null;
      if (updates.goalId !== undefined) dbUpdates.goal_id = updates.goalId ?? null;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes ?? null;
      if (updates.deadline !== undefined) dbUpdates.deadline = updates.deadline ?? null;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority ?? null;
      if (updates.status !== undefined) dbUpdates.status = updates.status;

      const { error } = await supabase.from('tasks').update(dbUpdates).eq('id', id);
      if (error) return console.error('Failed to update task', error);
      
      set(prev => ({
        state: { ...prev.state, tasks: prev.state.tasks.map(t => (t.id === id ? { ...t, ...updates } : t)) }
      }));
    },

    deleteTask: async (id: string) => {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) return console.error('Failed to delete task', error);
      set(prev => ({ state: { ...prev.state, tasks: prev.state.tasks.filter(t => t.id !== id) } }));
    }
  };
});
