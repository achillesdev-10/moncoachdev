"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { 
  Trophy, Medal, User, Crown, ChevronRight, 
  Sparkles, Star, TrendingUp, Users, Activity,
  Award, Target, Rocket
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Sidebar } from '@/components/Sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function LeaderboardPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [myProfile, setMyProfile] = useState<any>(null);
  const [myRank, setMyRank] = useState<number>(0);
  const [globalStats, setGlobalStats] = useState({ totalXp: 0, completionsToday: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // 1. Récupérer l'utilisateur actuel
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      // 2. Récupérer le Top 10
      const { data: topTen } = await supabase
        .from('profiles')
        .select('*')
        .order('xp', { ascending: false })
        .limit(10);
      
      setProfiles(topTen || []);

      // 3. Récupérer la position et profil de l'utilisateur actuel s'il n'est pas dans le top 10
      if (user) {
        const { data: allProfiles } = await supabase
          .from('profiles')
          .select('id, xp, username, rank')
          .order('xp', { ascending: false });
        
        if (allProfiles) {
          const rank = allProfiles.findIndex(p => p.id === user.id) + 1;
          setMyRank(rank);
          setMyProfile(allProfiles.find(p => p.id === user.id));
        }
      }

      // 4. Statistiques Globales
      const { data: profilesData } = await supabase.from('profiles').select('xp');
      const totalXp = profilesData?.reduce((acc, p) => acc + (p.xp || 0), 0) || 0;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: completionsToday } = await supabase
        .from('user_completions')
        .select('*', { count: 'exact', head: true })
        .gte('completed_at', today.toISOString());

      setGlobalStats({ totalXp, completionsToday: completionsToday || 0 });
      setLoading(false);
    };
    fetchData();
  }, []);

  const getRankData = (xp: number) => {
    if (xp <= 100) return { name: 'Apprenti', icon: '🟢', color: 'text-green-500', bg: 'bg-green-500/10', next: 101 };
    if (xp <= 500) return { name: 'Développeur', icon: '🔵', color: 'text-blue-500', bg: 'bg-blue-500/10', next: 501 };
    if (xp <= 1500) return { name: 'Ninja du Code', icon: '🟣', color: 'text-purple-500', bg: 'bg-purple-500/10', next: 1501 };
    return { name: 'Maître IA', icon: '👑', color: 'text-yellow-500', bg: 'bg-yellow-500/10', next: Infinity };
  };

  const topThree = profiles.slice(0, 3);
  const others = profiles.slice(3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex text-slate-900 dark:text-slate-300 transition-colors duration-300">
      <Sidebar />

      <main className="flex-grow ml-64 p-8 flex flex-col gap-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              Hall of Fame
              <Award className="w-10 h-10 text-yellow-500 animate-bounce" />
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-bold uppercase text-xs tracking-widest">Le Panthéon des Pilotes MonCoachDev</p>
          </div>
          <ThemeToggle />
        </header>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-6"
          >
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">XP Totale Distribuée</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{globalStats.totalXp.toLocaleString()}</p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-6"
          >
            <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center">
              <Activity className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Défis Relevés (24h)</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{globalStats.completionsToday}</p>
            </div>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex-grow flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-12"
          >
            {/* Top 3 Premium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end px-4">
              {/* 2nd Place */}
              {topThree[1] && (
                <PodiumCard profile={topThree[1]} rank={2} color="slate-400" />
              )}
              {/* 1st Place */}
              {topThree[0] && (
                <PodiumCard profile={topThree[0]} rank={1} color="yellow-500" isWinner />
              )}
              {/* 3rd Place */}
              {topThree[2] && (
                <PodiumCard profile={topThree[2]} rank={3} color="orange-400" />
              )}
            </div>

            {/* Others List */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                  <Users className="w-6 h-6 text-primary" />
                  Les Challengers du Top 10
                </h2>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {others.map((profile, index) => (
                  <motion.div 
                    key={profile.id}
                    variants={itemVariants}
                    className="p-6 grid grid-cols-12 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="col-span-1 font-black text-slate-400 text-xl text-center">#{index + 4}</div>
                    <div className="col-span-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-primary text-xl shadow-inner border border-slate-200 dark:border-slate-700">
                        {profile.username?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 dark:text-white text-lg">{profile.username || 'Pilote Anonyme'}</p>
                        <RankBadge xp={profile.xp} />
                      </div>
                    </div>
                    <div className="col-span-4 px-8">
                      <XPProgressBar xp={profile.xp} />
                    </div>
                    <div className="col-span-2 text-right font-black text-2xl text-slate-900 dark:text-white tracking-tighter">
                      {profile.xp.toLocaleString()} <span className="text-[10px] text-primary uppercase">XP</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* My Position Sticky Footer */}
              {myRank > 10 && myProfile && (
                <div className="bg-primary/10 border-t border-primary/20 p-6 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary text-slate-900 w-10 h-10 rounded-xl flex items-center justify-center font-black">
                      #{myRank}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 dark:text-white">Ta Position Actuelle</p>
                      <RankBadge xp={myProfile.xp} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-2xl text-slate-900 dark:text-white">{myProfile.xp.toLocaleString()} XP</p>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Encore {getRankData(myProfile.xp).next - myProfile.xp} XP pour le rang suivant</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

function PodiumCard({ profile, rank, color, isWinner = false }: any) {
  const rankData = (xp: number) => {
    if (xp <= 100) return { name: 'Apprenti', icon: '🟢' };
    if (xp <= 500) return { name: 'Développeur', icon: '🔵' };
    if (xp <= 1500) return { name: 'Ninja', icon: '🟣' };
    return { name: 'Maître IA', icon: '👑' };
  };

  const info = rankData(profile.xp);

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`relative flex flex-col items-center gap-4 p-8 rounded-[3rem] border transition-all hover:scale-105 ${
        isWinner 
          ? 'bg-gradient-to-b from-yellow-500/20 to-transparent border-yellow-500/30 h-[400px] z-10 shadow-[0_0_40px_rgba(234,179,8,0.1)]' 
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 h-[320px]'
      }`}
    >
      <div className="absolute -top-6">
        <div className={`w-12 h-12 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shadow-xl border-4 ${
          rank === 1 ? 'border-yellow-500' : rank === 2 ? 'border-slate-300' : 'border-orange-400'
        }`}>
          {rank === 1 ? <Crown className="w-6 h-6 text-yellow-500" /> : <Medal className={`w-6 h-6 text-${color}`} />}
        </div>
      </div>
      
      <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center font-black text-4xl shadow-2xl ${
        isWinner ? 'bg-yellow-500 text-slate-950 scale-110' : 'bg-slate-100 dark:bg-slate-800 text-primary'
      }`}>
        {profile.username?.charAt(0).toUpperCase()}
      </div>

      <div className="text-center mt-2">
        <h3 className="text-xl font-black text-slate-900 dark:text-white line-clamp-1">{profile.username}</h3>
        <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${isWinner ? 'text-yellow-500' : 'text-slate-400'}`}>
          {info.icon} {info.name}
        </p>
      </div>

      <div className="mt-auto flex flex-col items-center">
        <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{profile.xp.toLocaleString()}</p>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Points d'XP</p>
      </div>
    </motion.div>
  );
}

function RankBadge({ xp }: { xp: number }) {
  const getRankData = (xp: number) => {
    if (xp <= 100) return { name: 'Apprenti', icon: '🟢', color: 'text-green-500', bg: 'bg-green-500/10' };
    if (xp <= 500) return { name: 'Développeur', icon: '🔵', color: 'text-blue-500', bg: 'bg-blue-500/10' };
    if (xp <= 1500) return { name: 'Ninja', icon: '🟣', color: 'text-purple-500', bg: 'bg-purple-500/10' };
    return { name: 'Maître IA', icon: '👑', color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
  };
  const rank = getRankData(xp);
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${rank.bg} ${rank.color} mt-1`}>
      {rank.icon} {rank.name}
    </span>
  );
}

function XPProgressBar({ xp }: { xp: number }) {
  const getRankData = (xp: number) => {
    if (xp <= 100) return { min: 0, max: 100 };
    if (xp <= 500) return { min: 101, max: 500 };
    if (xp <= 1500) return { min: 501, max: 1500 };
    return { min: 1501, max: 5000 };
  };
  const range = getRankData(xp);
  const progress = ((xp - range.min) / (range.max - range.min)) * 100;
  
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
        <span>Progression Rang</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-primary"
        />
      </div>
    </div>
  );
}

function Loader() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Rocket className="w-12 h-12 text-primary animate-bounce" />
      <p className="text-slate-400 font-black uppercase text-xs tracking-[0.2em] animate-pulse">Scan du Panthéon...</p>
    </div>
  );
}
