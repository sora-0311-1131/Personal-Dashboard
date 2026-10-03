-- Drop existing policies to ensure clean state
DROP POLICY IF EXISTS "Users can view own periods" ON periods;
DROP POLICY IF EXISTS "Users can insert own periods" ON periods;
DROP POLICY IF EXISTS "Users can update own periods" ON periods;
DROP POLICY IF EXISTS "Users can delete own periods" ON periods;

DROP POLICY IF EXISTS "Users can view own goals" ON goals;
DROP POLICY IF EXISTS "Users can insert own goals" ON goals;
DROP POLICY IF EXISTS "Users can update own goals" ON goals;
DROP POLICY IF EXISTS "Users can delete own goals" ON goals;

DROP POLICY IF EXISTS "Users can view own non_goals" ON non_goals;
DROP POLICY IF EXISTS "Users can insert own non_goals" ON non_goals;
DROP POLICY IF EXISTS "Users can update own non_goals" ON non_goals;
DROP POLICY IF EXISTS "Users can delete own non_goals" ON non_goals;

DROP POLICY IF EXISTS "Users can view own projects" ON projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;

DROP POLICY IF EXISTS "Users can view own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON tasks;

-- Ensure user_id exists
ALTER TABLE periods ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE goals ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE non_goals ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Enforce RLS
ALTER TABLE periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE non_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Recreate Policies for periods
CREATE POLICY "Users can view own periods" ON periods FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own periods" ON periods FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own periods" ON periods FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own periods" ON periods FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Recreate Policies for goals
CREATE POLICY "Users can view own goals" ON goals FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON goals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON goals FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON goals FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Recreate Policies for non_goals
CREATE POLICY "Users can view own non_goals" ON non_goals FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own non_goals" ON non_goals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own non_goals" ON non_goals FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own non_goals" ON non_goals FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Recreate Policies for projects
CREATE POLICY "Users can view own projects" ON projects FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON projects FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Recreate Policies for tasks
CREATE POLICY "Users can view own tasks" ON tasks FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON tasks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON tasks FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON tasks FOR DELETE TO authenticated USING (auth.uid() = user_id);
