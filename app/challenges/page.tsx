"use client";

import React, { useEffect, useState } from 'react';
import { Search, Target, Zap, Sword, Trophy, ChevronRight, Code, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/getUser';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('HTML');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(true);
      const user = await getCurrentUser();
      setUser(user);
      const { data } = await supabase.from('challenges').select('*');
      setChallenges(data || []);
      setLoading(false);
    };
    fetchChallenges();
  }, []);

  const filteredChallenges = challenges.filter(c => {
    const lang = (c.language || '').trim().toLowerCase();
    const sel = selectedLanguage.trim().toLowerCase();

    // Normalisation : JS/JavaScript
    const isJS = (l: string) => l === 'js' || l === 'javascript';
    // Normalisation : HTML
    const isHTML = (l: string) => l === 'html' || l === '' || l === 'htm';
    // Normalisation : CSS
    const isCSS = (l: string) => l === 'css';

    if (sel === 'html' && isHTML(lang)) return true;
    if (sel === 'css' && isCSS(lang)) return true;
    if (isJS(sel) && isJS(lang)) return true;
    if (sel === 'python' && lang === 'python') return true;
    if (sel === 'php' && lang === 'php') return true;
    return false;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex text-slate-900 dark:text-slate-300 transition-colors duration-300">
      <Sidebar />

      <main className="flex-grow lg:ml-64 p-4 sm:p-6 lg:p-8 flex flex-col pt-16 lg:pt-8">
        <header className="flex justify-between items-center mb-6 sm:mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Catalogue des Défis</h1>
            <p className="text-slate-900 dark:text-slate-400 mt-1 text-sm sm:text-base">Choisis ta mission et gagne de l&apos;expérience.</p>
          </div>
          <ThemeToggle />
        </header>

        {!user && (
          <div className="mb-8 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Inscris-toi pour sauvegarder ta progression et gagner de l&apos;XP</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Les défis sont libres — mais l&apos;inscription débloque le système de grades.</p>
              </div>
            </div>
            <Link href="/login" className="bg-primary text-slate-900 px-6 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-primary/20 whitespace-nowrap">
              S&apos;inscrire
            </Link>
          </div>
        )}

        <div className="flex gap-1.5 sm:gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit mb-6 sm:mb-8 border border-slate-200 dark:border-slate-700 overflow-x-auto">
          {['HTML', 'CSS', 'JavaScript', 'Python', 'PHP'].map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 relative whitespace-nowrap ${
                selectedLanguage === lang
                  ? 'bg-primary text-slate-900 shadow-lg shadow-primary/20'
                  : 'text-slate-900 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-slate-50 dark:bg-slate-800 h-64 rounded-3xl animate-pulse border border-slate-200 dark:border-slate-700" />
            ))}
          </div>
        ) : filteredChallenges.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredChallenges.map((challenge) => (
              <Link 
                key={challenge.id}
                href={`/challenges/${challenge.id}`}
                className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all group flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                    challenge.language?.toLowerCase() === 'python' ? 'bg-blue-500/10 text-blue-500' :
                    challenge.language?.toLowerCase() === 'php' ? 'bg-purple-500/10 text-purple-500' :
                    challenge.type === 'bug_hunter' ? 'bg-orange-500/10 text-orange-500' :
                    challenge.type === 'pixel_perfect' ? 'bg-primary/10 text-primary' :
                    'bg-blue-500/10 text-blue-500'
                  }`}>
                    {challenge.language?.toLowerCase() === 'python' ? <Code className="w-6 h-6" /> :
                     challenge.language?.toLowerCase() === 'php' ? <Code className="w-6 h-6" /> :
                     challenge.type === 'bug_hunter' ? <Search className="w-6 h-6" /> :
                     challenge.type === 'pixel_perfect' ? <Target className="w-6 h-6" /> :
                     <Zap className="w-6 h-6" />}
                  </div>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter ${
                    challenge.niveau === 'Débutant' ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-400' :
                    challenge.niveau === 'Apprenti' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                    challenge.niveau === 'Pilote' ? 'bg-primary/10 text-primary' :
                    'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                  }`}>
                    {challenge.niveau}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                  {challenge.titre}
                </h3>
                <p className="text-slate-900 dark:text-slate-400 text-sm line-clamp-2 mb-6 flex-grow">
                  {challenge.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-black text-slate-900 dark:text-white">{challenge.xp_reward} XP</span>
                  </div>
                  <div className="text-primary font-bold text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Décollage <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 dark:bg-slate-800 p-12 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-center">
            <Sword className="w-12 h-12 text-slate-900 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Aucun défi en {selectedLanguage}</h3>
            <p className="text-slate-900 dark:text-slate-400">Le quartier général prépare de nouvelles missions.</p>
          </div>
        )}
      </main>
    </div>
  );
}
