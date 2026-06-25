"use client";

import React, { useEffect, useState } from 'react';
import { Search, Target, Zap, User, Bell, Sword, Trophy, Flame, ChevronRight, LayoutGrid, Award, CheckCircle2, Rocket } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [displayedXp, setDisplayedXp] = useState(0);
  const [recentChallenges, setRecentChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCertModal, setShowCertModal] = useState(false);

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

        // Récupérer les 2 derniers défis (simulé pour l'instant ou via une table de progression si elle existe)
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

  const getRankInfo = (xp: number) => {
    if (xp <= 200) return { name: 'Apprenti', icon: '🛠️', next: 200, prev: 0, color: 'text-slate-500' };
    if (xp <= 600) return { name: 'Pilote', icon: '✈️', next: 600, prev: 200, color: 'text-blue-400' };
    if (xp <= 1500) return { name: 'Commandant', icon: '🚀', next: 1500, prev: 600, color: 'text-primary' };
    return { name: 'Hacker d\'Élite', icon: '👑', next: 10000, prev: 1500, color: 'text-secondary' };
  };

  const rank = getRankInfo(profile?.xp || 0);
  const progress = Math.min(((displayedXp - rank.prev) / (rank.next - rank.prev)) * 100, 100);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex text-slate-900 dark:text-slate-300 transition-colors duration-300">
      <Sidebar />

      <main className="flex-grow ml-64 p-8 flex flex-col">
        {/* Top Header Bar */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {user ? `Bienvenue, ${profile?.username ? profile.username.split('@')[0] : 'Pilote'} !` : 'Bienvenue, Pilote !'}
            </h1>
            <p className="text-slate-900 dark:text-slate-400 mt-1">
              {user ? 'Ton cockpit est prêt pour de nouvelles missions. 🚀' : 'Connecte-toi pour sauvegarder ta progression.'}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <ThemeToggle />
            {user ? (
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
            ) : (
              <Link href="/login" className="bg-primary text-slate-900 px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg flex items-center gap-2">
                <User className="w-5 h-5" /> Se connecter
              </Link>
            )}
          </div>
        </header>

        {/* Bannière Vague 5 */}
        <div className="mb-10 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent border-l-4 border-primary p-6 rounded-r-2xl flex items-center justify-between group hover:from-primary/30 transition-all">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center animate-bounce shadow-lg shadow-primary/10">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                Vague 5 disponible : Maîtrise le Mobile-First !
                <span className="text-[10px] bg-primary text-slate-900 px-2 py-0.5 rounded-full font-black uppercase animate-pulse">Nouveau</span>
              </h2>
              <p className="text-slate-900 dark:text-slate-400 font-medium">4 nouveaux défis techniques pour dompter les écrans et les interactions JS.</p>
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
            {!user && (
              <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/40 backdrop-blur-[2px] z-10 flex items-center justify-center p-6 text-center">
                <div className="max-w-xs">
                  <p className="text-slate-900 dark:text-white font-bold mb-2">Progression Verrouillée 🔒</p>
                  <p className="text-sm text-slate-900 dark:text-slate-400 mb-4">Inscris-toi pour débloquer ton système de rangs et accumuler de l'XP.</p>
                  <Link href="/login" className="inline-block bg-primary text-slate-900 px-6 py-2 rounded-lg font-bold text-sm">S'inscrire</Link>
                </div>
              </div>
            )}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Progression du Grade</h2>
                <p className="text-sm text-slate-900 dark:text-slate-400">
                  {user ? `Grade actuel : ${rank.name}` : 'Connecte-toi pour voir ton grade'}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center animate-pulse">
                <Trophy className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-primary flex items-center gap-1">
                  <span className="text-xl font-black">{user ? displayedXp : '??'}</span> 
                  <span className="text-xs uppercase tracking-wider opacity-60">XP</span>
                </span>
                <span className="text-slate-900 dark:text-slate-500 flex items-center gap-1">
                  <span className="text-xl font-black">{user ? rank.next : '??'}</span>
                  <span className="text-xs uppercase tracking-wider opacity-60">XP</span>
                </span>
              </div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden border border-slate-300 dark:border-slate-600/50">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 via-primary to-primary transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(57,255,20,0.3)]"
                  style={{ width: `${user ? progress : 0}%` }}
                />
              </div>
              <p className="text-xs text-center text-slate-900 dark:text-slate-500 font-medium italic">
                {user 
                  ? `Plus que ${Math.max(0, rank.next - displayedXp)} XP pour devenir ${getRankInfo(rank.next + 1).name} !`
                  : 'Tes futures missions t\'attendent.'}
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center hover:border-orange-500/50 transition-colors group">
              <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">3</p>
              <p className="text-[10px] uppercase font-bold text-slate-900 dark:text-slate-500 tracking-wider">Série (Jours)</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors group">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">12</p>
              <p className="text-[10px] uppercase font-bold text-slate-900 dark:text-slate-500 tracking-wider">Missions</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center hover:border-blue-500/50 transition-colors group">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Sword className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">85%</p>
              <p className="text-[10px] uppercase font-bold text-slate-900 dark:text-slate-500 tracking-wider">Précision</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center hover:border-purple-500/50 transition-colors group">
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <LayoutGrid className="w-6 h-6 text-purple-500" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">4</p>
              <p className="text-[10px] uppercase font-bold text-slate-900 dark:text-slate-500 tracking-wider">Badges</p>
            </div>
          </div>
        </div>

        {/* Section: Continuer l'aventure */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              Continuer l'aventure
              <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/30">En cours</span>
            </h2>
            <Link href="/challenges" className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
              Voir tous les défis <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-800 h-48 rounded-3xl animate-pulse border border-slate-200 dark:border-slate-700" />
              ))}
            </div>
          ) : recentChallenges.length > 0 ? (
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
              <p className="text-slate-900 dark:text-slate-400 mb-4">Tu n'as pas encore commencé de défi.</p>
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
            <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800">Teaser</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 flex items-center gap-6 group hover:border-purple-500/50 transition-all">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Rocket className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Python pour la Data</h3>
                <p className="text-slate-900 dark:text-slate-400 text-sm">Analyse tes premières données avec Python. Arrivée prévue : Mai 2024.</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 flex items-center gap-6 group hover:border-purple-500/50 transition-all">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Backend PHP & MySQL</h3>
                <p className="text-slate-900 dark:text-slate-400 text-sm">Apprends à gérer des bases de données réelles. Arrivée prévue : Juin 2024.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Certificat (Visible si Pilote+) */}
        {profile?.xp >= 200 && (
          <div className="bg-gradient-to-r from-blue-600 to-primary p-8 rounded-3xl text-white shadow-xl shadow-primary/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-colors" />
            <div className="relative z-10">
              <h2 className="text-2xl font-black mb-2 flex items-center gap-3">
                <Award className="w-8 h-8" />
                Certificat de Compétences
              </h2>
              <p className="text-blue-100 max-w-md">
                Félicitations Pilote ! Tu as atteint le grade nécessaire pour générer ton certificat officiel MonCoachDev.
              </p>
            </div>
            <button 
              onClick={() => setShowCertModal(true)}
              className="relative z-10 bg-white text-blue-600 px-8 py-4 rounded-2xl font-black hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
            >
              Générer mon Certificat 🎓
            </button>
          </div>
        )}

        {/* Modal Certificat */}
        {showCertModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300 border border-slate-200 dark:border-slate-800">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Génération en cours...</h2>
              <p className="text-slate-900 dark:text-slate-400 mb-8 italic">
                Le quartier général prépare ton document officiel. Il sera prêt dans quelques instants.
              </p>
              <button 
                onClick={() => setShowCertModal(false)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold py-4 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
