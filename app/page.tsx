"use client";

import React, { useEffect, useState } from 'react';
import { Search, Target, Zap, User, Bell, Trophy, ChevronRight, Rocket } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import LandingPage from './LandingPage';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [displayedXp, setDisplayedXp] = useState(0);
  const [recentChallenges, setRecentChallenges] = useState<any[]>([]);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(profile);
        if (profile) setDisplayedXp(profile.xp || 0);

        const { data: challengesData } = await supabase
          .from('challenges')
          .select('*')
          .limit(2);
        setRecentChallenges(challengesData || []);
      }
      setLoading(false);
    };
    getData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Animation de l'XP
  useEffect(() => {
    if (profile?.xp !== undefined && displayedXp !== profile.xp) {
      const timer = setTimeout(() => {
        const diff = profile.xp - displayedXp;
        const step = Math.ceil(Math.abs(diff) / 10);
        setDisplayedXp(prev => diff > 0 ? prev + step : prev - step);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [profile?.xp, displayedXp]);

  // Afficher la landing page pour les visiteurs non connectés
  if (!loading && !user) {
    return <LandingPage />;
  }

  const getRankInfo = (xp: number) => {
    if (xp <= 200) return { name: 'Apprenti', icon: '🛠️', next: 200, prev: 0, color: 'text-slate-500' };
    if (xp <= 600) return { name: 'Pilote', icon: '✈️', next: 600, prev: 200, color: 'text-blue-400' };
    if (xp <= 1500) return { name: 'Commandant', icon: '🚀', next: 1500, prev: 600, color: 'text-primary' };
    return { name: 'Hacker d\'Élite', icon: '👑', next: 10000, prev: 1500, color: 'text-secondary' };
  };

  const rank = getRankInfo(profile?.xp || 0);
  const progress = Math.min(((displayedXp - rank.prev) / (rank.next - rank.prev)) * 100, 100);

  // Loader pendant le chargement
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

      <main className="flex-grow ml-64 p-8 flex flex-col">
        {/* Top Header Bar */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Bienvenue, {profile?.username ? profile.username.split('@')[0] : 'Pilote'} ! 👋
            </h1>
            <p className="text-slate-900 dark:text-slate-400 mt-1">
              Ton cockpit est prêt pour de nouvelles missions. 🚀
            </p>
          </div>

          <div className="flex items-center gap-6">
            <ThemeToggle />
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{profile?.username?.split('@')[0] || 'Pilote'}</p>
                <p className={`text-xs font-semibold mt-1 ${rank.color}`}>{rank.icon} {rank.name}</p>
              </div>
              <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
                <User className="w-5 h-5 text-slate-900 dark:text-slate-400 group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
              </div>
            </div>
          </div>
        </header>

        {/* Bannière Nouveaux Défis */}
        <div className="mb-10 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-2xl flex items-center justify-between group hover:from-primary/30 transition-all">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center animate-bounce shadow-lg shadow-primary/10">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                Catalogue de défis disponible
                <span className="text-[10px] bg-primary text-slate-900 px-2 py-0.5 rounded-full font-black uppercase animate-pulse">Nouveau</span>
              </h2>
              <p className="text-slate-900 dark:text-slate-400 font-medium">Explore les défis HTML, CSS, JavaScript, Python et PHP.</p>
            </div>
          </div>
          <Link href="/challenges" className="bg-primary text-slate-900 px-6 py-3 rounded-xl font-black flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-primary/20">
            Explorer <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Stats & Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Progress Card */}
          <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Progression du Grade</h2>
                <p className="text-sm text-slate-900 dark:text-slate-400">
                  Grade actuel : {rank.name}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center animate-pulse">
                <Trophy className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-primary flex items-center gap-1">
                  <span className="text-xl font-black">{displayedXp}</span> 
                  <span className="text-xs uppercase tracking-wider opacity-60">XP</span>
                </span>
                <span className="text-slate-900 dark:text-slate-500 flex items-center gap-1">
                  <span className="text-xl font-black">{rank.next}</span>
                  <span className="text-xs uppercase tracking-wider opacity-60">XP</span>
                </span>
              </div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden border border-slate-300 dark:border-slate-600/50">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 via-primary to-primary transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(57,255,20,0.3)]"
                  style={{ width: `${progress}%` }} 
                />
              </div>
              <p className="text-xs text-center text-slate-900 dark:text-slate-500 font-medium italic">
                Plus que {Math.max(0, rank.next - displayedXp)} XP pour devenir {getRankInfo(rank.next + 1).name} !
              </p>
            </div>
          </div>

          {/* Quick Stats Grid — données réelles depuis le profil */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors group">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{profile?.challenges_completed || 0}</p>
              <p className="text-[10px] uppercase font-bold text-slate-900 dark:text-slate-500 tracking-wider">Défis Relevés</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center hover:border-yellow-500/50 transition-colors group">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{profile?.xp || 0}</p>
              <p className="text-[10px] uppercase font-bold text-slate-900 dark:text-slate-500 tracking-wider">Points XP</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center hover:border-purple-500/50 transition-colors group">
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-purple-500" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{rank.name}</p>
              <p className="text-[10px] uppercase font-bold text-slate-900 dark:text-slate-500 tracking-wider">Grade Actuel</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center hover:border-blue-500/50 transition-colors group">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{recentChallenges.length > 0 ? recentChallenges.length : '—'}</p>
              <p className="text-[10px] uppercase font-bold text-slate-900 dark:text-slate-500 tracking-wider">Missions Dispo</p>
            </div>
          </div>
        </div>

        {/* Section: Continuer l'aventure */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              Continuer l&apos;aventure
              <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/30">En cours</span>
            </h2>
            <Link href="/challenges" className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
              Voir tous les défis <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {recentChallenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {recentChallenges.map((challenge) => (
                <Link 
                  key={challenge.id}
                  href={`/challenges/${challenge.id}`}
                  className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all group flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      challenge.type === 'bug_hunter' ? 'bg-orange-500/10 text-orange-500' :
                      challenge.type === 'pixel_perfect' ? 'bg-primary/10 text-primary' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      {challenge.type === 'bug_hunter' ? <Search className="w-5 h-5" /> :
                       challenge.type === 'pixel_perfect' ? <Target className="w-5 h-5" /> :
                       <Zap className="w-5 h-5" />}
                    </div>
                    <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-400">
                      {challenge.language || 'HTML'}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                    {challenge.titre}
                  </h3>
                  <p className="text-slate-900 dark:text-slate-400 text-sm line-clamp-1 mb-4">
                    {challenge.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-black text-slate-900 dark:text-white">{challenge.xp_reward} XP</span>
                    </div>
                    <div className="text-primary font-bold text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Reprendre <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-center">
              <p className="text-slate-900 dark:text-slate-400 mb-4">Tu n&apos;as pas encore commencé de défi.</p>
              <Link href="/challenges" className="inline-block bg-primary text-slate-900 px-6 py-2 rounded-xl font-bold text-sm">
                Découvrir le catalogue
              </Link>
            </div>
          )}
        </div>

        {/* Section: Prochainement */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-8">
            Prochainement
            <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800">À venir</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 flex items-center gap-6 group hover:border-purple-500/50 transition-all">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Rocket className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Python pour la Data</h3>
                <p className="text-slate-900 dark:text-slate-400 text-sm">Analyse tes premières données avec Python. Bientôt disponible.</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 flex items-center gap-6 group hover:border-purple-500/50 transition-all">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Backend PHP & MySQL</h3>
                <p className="text-slate-900 dark:text-slate-400 text-sm">Apprends à gérer des bases de données réelles. Bientôt disponible.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
