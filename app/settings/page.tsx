"use client";

import React, { useEffect, useState } from 'react';
import { Settings, User, Mail, Shield, LogOut, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      setUser(user);

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setProfile(profile);
        setUsername(profile.username || '');
      }
      setLoading(false);
    };

    getUserData();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          username: username,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
      
      // Refresh local profile state
      setProfile({ ...profile, username });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Une erreur est survenue lors de la mise à jour.' });
    } finally {
      setSaving(false);
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex text-slate-900 dark:text-slate-300 transition-colors duration-300">
      <Sidebar />

      <main className="flex-grow ml-64 p-8 flex flex-col max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <Settings className="w-8 h-8 text-slate-900 dark:text-slate-400" />
              Paramètres du Compte
            </h1>
            <p className="text-slate-900 dark:text-slate-400 mt-1">Gère ton profil, tes préférences et ta sécurité.</p>
          </div>
          <ThemeToggle />
        </header>

        <div className="space-y-8">
          {/* Section: Profil */}
          <section className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-200 dark:border-slate-700">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Informations de Profil</h2>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Avatar Display */}
                <div className="flex flex-col items-center gap-4">
                  <div className="w-24 h-24 rounded-3xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden shadow-inner group relative">
                    {user?.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-primary" />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-[10px] text-white font-bold uppercase text-center p-2">Image Google</p>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="flex-grow space-y-6 w-full">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Adresse Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="email" 
                        value={user?.email || ''} 
                        disabled 
                        className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl text-slate-900 dark:text-slate-400 cursor-not-allowed font-medium"
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-900 dark:text-slate-500 italic">L'email est géré par ton compte de connexion.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-900 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Pseudo (Leaderboard)
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-bold"
                        placeholder="Ton pseudo d'élite..."
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit" 
                      disabled={saving}
                      className="bg-primary text-slate-900 px-8 py-3 rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                      {saving ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                          Enregistrement...
                        </span>
                      ) : (
                        <>
                          <Save className="w-5 h-5" /> Sauvegarder les modifications
                        </>
                      )}
                    </button>
                  </div>

                  {message && (
                    <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300 ${
                      message.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                    }`}>
                      {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                      <span className="font-bold text-sm">{message.text}</span>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </section>

          {/* Section: Préférences */}
          <section className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
              <Shield className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Préférences d'affichage</h2>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Thème de l'interface</p>
                <p className="text-sm text-slate-900 dark:text-slate-400">Choisis entre le mode clair et le mode sombre pour ton cockpit.</p>
              </div>
              <ThemeToggle />
            </div>
          </section>

          {/* Section: Sécurité / Déconnexion */}
          <section className="bg-red-50 dark:bg-red-900/10 rounded-3xl p-8 border border-red-100 dark:border-red-900/30 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-red-100 dark:border-red-900/30">
              <Shield className="w-5 h-5 text-red-500" />
              <h2 className="text-xl font-bold text-red-900 dark:text-red-300">Zone de danger</h2>
            </div>
            
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="font-bold text-red-900 dark:text-red-300">Session de compte</p>
                <p className="text-sm text-red-800/60 dark:text-red-300/60">Quitte ton cockpit en toute sécurité. Ta progression est sauvegardée.</p>
              </div>
              <button 
                onClick={handleSignOut}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 transition-all shadow-lg shadow-red-500/20"
              >
                <LogOut className="w-5 h-5" /> Se déconnecter
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
