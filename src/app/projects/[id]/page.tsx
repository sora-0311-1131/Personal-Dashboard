'use client';

import React from 'react';
import ProjectDetail from "@/components/ProjectDetail";
import Header from "@/components/layout/Header";
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useDashboard } from "@/store/DashboardContext";

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const { state } = useDashboard();
  const id = params.id as string;

  return (
    <main className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950 p-4 sm:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <Header />
        <div className="max-w-4xl mx-auto">
          <ProjectDetail projectId={id} onBack={() => {
            const project = state.projects.find(p => p.id === id);
            if (project?.goalId) {
              router.push(`/goals/${project.goalId}`);
            } else {
              router.push('/');
            }
          }} />
        </div>
      </div>
    </main>
  );
}
