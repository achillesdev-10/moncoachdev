'use client';

import React, { useEffect, useState } from 'react';
import { 
  Zap, Sword, Trophy, Rocket, Target, Code, 
  ChevronRight, Terminal, BookOpen, Users, Star,
  ArrowRight, CheckCircle2, Sparkles, Play, Map
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function LandingPage() {
  const [challenges, setChallenges] = useState<any[]>([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      const { data } = await supabase
        .from('challenges')
        .select('*')
        .order('xp_reward', { ascending: false })
        .limit(6);
      setChallenges(data || []);
    };
    fetchChallenges();
  }, []);

  const features = [
    { icon: Target, title: 'Défis Pratiques', desc: 'Résous des missions réelles et gagne de l\'XP pour monter en grade.' },
    { icon: Terminal, title: 'Playground Live', desc: 'Code en direct HTML, CSS, JS et Python directement dans ton navigateur.' },
    { icon: Trophy, title: 'Classement', desc: 'Mesure-toi aux meilleurs développeurs de la communauté.' },
    { icon: BookOpen, title: 'Cours Prochainement', desc: 'L\'Académie MonCoachDev arrive avec des formations premium.' },
    { icon: Map, title: 'Roadmaps Carrière', desc: 'Des guides étape par étape pour chaque spécialité du dev.' },
  ];

  const ranks = [
    { icon: '🛠️', name: 'Apprenti', xp: '0 – 200 XP', desc: 'Tu fais tes premiers pas.' },
    { icon: '✈️', name: 'Pilote', xp: '201 – 600 XP', desc: 'Tu maîtrises les bases.' },
    { icon: '🚀', name: 'Commandant', xp: '601 – 1500 XP', desc: 'Tu es un développeur solide.' },
    { icon: '👑', name: 'Hacker d\'Élite', xp: '1500+ XP', desc: 'L\'élite du code.' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex text-slate-900 dark:text-slate-300 transition-colors duration-300">
      <Sidebar />

      <main className="flex-grow ml-64 p-8 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Bienvenue sur <span className="text-primary">MonCoachDev</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">
              La plateforme n°1 pour maîtriser le code par le défi. 🚀
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link 
              href="/login" 
              className="bg-primary text-slate-900 px-8 py-3 rounded-xl font-black hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              Commencer gratuitement <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <div className="mb-16 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-12 rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">Plateforme EdTech</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-6">
              Apprends le code en <span className="text-primary">relevant des défis</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-2xl font-medium leading-relaxed">
              HTML, CSS, JavaScript, Python, PHP — résous des missions pratiques, gagne de l&apos;XP, monte en grade et deviens un développeur d&apos;élite. 
              <strong className="text-slate-900 dark:text-white"> 100% gratuit.</strong>
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/login" 
                className="bg-primary text-slate-900 px-8 py-4 rounded-2xl font-black text-lg flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-primary/20"
              >
                <Play className="w-6 h-6 fill-current" /> Je commence maintenant
              </Link>
              <Link 
                href="/roadmap" 
                className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-2xl font-black text-lg flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
              >
                <Map className="w-6 h-6" /> Voir les roadmaps
              </Link>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-primary" />
            Pourquoi MonCoachDev ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <div 
                key={i}
                className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feat.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Grille des Rangs */}
        <div className="mb-16">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Le système de grades
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {ranks.map((rank, i) => (
              <div 
                key={i}
                className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 text-center hover:border-primary/30 transition-all"
              >
                <div className="text-4xl mb-3">{rank.icon}</div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">{rank.name}</h3>
                <p className="text-xs font-bold text-primary mt-1">{rank.xp}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">{rank.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Catalogue Preview */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <Sword className="w-6 h-6 text-primary" />
              Défis disponibles
            </h2>
            <Link href="/challenges" className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
              Voir tout le catalogue <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {challenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {challenges.map((challenge) => (
                <Link 
                  key={challenge.id}
                  href={`/challenges/${challenge.id}`}
                  className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all group flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                      challenge.language?.toLowerCase() === 'python' ? 'bg-blue-500/10 text-blue-500' :
                      challenge.language?.toLowerCase() === 'php' ? 'bg-purple-500/10 text-purple-500' :
                      challenge.type === 'bug_hunter' ? 'bg-orange-500/10 text-orange-500' :
                      challenge.type === 'pixel_perfect' ? 'bg-primary/10 text-primary' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      <Code className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-400">
                      {challenge.language || 'HTML'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                    {challenge.titre}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4 flex-grow">
                    {challenge.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-black text-slate-900 dark:text-white">{challenge.xp_reward} XP</span>
                    </div>
                    <span className="text-primary font-bold text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                      Explorer →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800 p-12 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-center">
              <Sword className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Des défis arrivent bientôt</h3>
              <p className="text-slate-500 dark:text-slate-400">Le quartier général prépare de nouvelles missions.</p>
            </div>
          )}
        </div>

        {/* CTA Final */}
        <div className="bg-gradient-to-r from-primary/20 via-primary/5 to-transparent border-l-4 border-primary p-10 rounded-r-3xl flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Prêt à relever le défi ?</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Inscris-toi gratuitement et commence à accumuler de l&apos;XP dès maintenant.
            </p>
          </div>
          <Link 
            href="/login" 
            className="bg-primary text-slate-900 px-8 py-4 rounded-2xl font-black text-lg flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-primary/20 whitespace-nowrap"
          >
            <Rocket className="w-6 h-6" /> Créer mon compte
          </Link>
        </div>
      </main>
    </div>
  );
}
