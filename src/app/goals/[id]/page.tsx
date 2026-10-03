'use client';

import React from 'react';
import GoalDetail from "@/components/GoalDetail";
import Header from "@/components/layout/Header";
import { useParams, useRouter } from "next/navigation";

export default function GoalPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  return (
    <main className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950 p-4 sm:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <Header />
        <div className="max-w-4xl mx-auto">
          <GoalDetail goalId={id} onBack={() => router.push('/')} onProjectClick={(pid) => router.push(`/projects/${pid}`)} />
        </div>
      </div>
    </main>
  );
}
