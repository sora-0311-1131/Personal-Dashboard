'use client';

import React, { useEffect, useState } from 'react';
import { useDashboardStore } from './useDashboardStore';
import { createClient } from '@/utils/supabase/client';

export const DashboardProvider: React.FC<{ children: React.ReactNode; userId?: string | null }> = ({ children, userId }) => {
  const initializeData = useDashboardStore(s => s.initializeData);
  const clearData = useDashboardStore(s => s.clearData);
  const [prevUserId, setPrevUserId] = useState<string | null | undefined>(userId);
  const supabase = createClient();

  if (userId !== undefined && userId !== prevUserId) {
    setPrevUserId(userId);
    clearData();
  }

  useEffect(() => {
    

    if (userId !== undefined) {
      if (userId) {
        initializeData(userId);
      }
    } else {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          initializeData(user.id);
        }
      });
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        if (session?.user && session.user.id !== userId) {
          initializeData(session.user.id);
        }
      }
    });

    return () => {
      
      authListener.subscription.unsubscribe();
    };
  }, [userId, initializeData, supabase.auth]);

  return <>{children}</>;
};

// Export the hook so we don't have to change every single import in the codebase right now.
// Note: This returns the full store for backward compatibility. 
// For better performance, components should import useDashboardStore and use selectors.
export const useDashboard = () => useDashboardStore();
