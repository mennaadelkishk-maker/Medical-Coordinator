import React from 'react';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Allow preview access to admin if backend isn't set up
      setIsAuthenticated(true);
      return;
    }

    supabase?.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const {
      data: { subscription },
    } = supabase?.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    }) || { data: { subscription: { unsubscribe: () => {} } } };

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <div className="p-8 text-center text-slate-500">جاري التحقق...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/admin" />;
}
