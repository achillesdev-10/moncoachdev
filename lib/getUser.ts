'use client';

import { supabase } from './supabase';

export async function getCurrentUser() {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('session_token');
  if (!token) return null;

  try {
    const { data: session, error } = await supabase
      .from('login_sessions')
      .select('*, app_user:app_users(*)')
      .eq('token', token)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !session) {
      localStorage.removeItem('session_token');
      return null;
    }

    return session.app_user;
  } catch {
    localStorage.removeItem('session_token');
    return null;
  }
}

export async function logout() {
  if (typeof window === 'undefined') return;

  const token = localStorage.getItem('session_token');
  if (token) {
    await supabase.from('login_sessions').delete().eq('token', token);
    localStorage.removeItem('session_token');
  }
}
