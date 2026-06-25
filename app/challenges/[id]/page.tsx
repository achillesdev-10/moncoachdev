'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-php';
import 'prismjs/themes/prism-tomorrow.css';
import { 
  ChevronLeft, Play, Send, Trophy, Info, Code, 
  Eye, X, CheckCircle2, Lightbulb, RefreshCw, Loader2,
  Rocket, Award, Sparkles, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { ThemeToggle } from '@/components/ThemeToggle';

interface Challenge {
  id: string;
  titre: string;
  description: string;
  type: 'bug_hunter' | 'pixel_perfect' | 'algo';
  niveau: string;
  xp_reward: number;
  initial_code?: string;
  solution_hints?: string[];
  test_keywords?: string[];
  language?: string;
}

export default function ChallengePlayground() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [currentXp, setCurrentXp] = useState(0);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('xp')
            .eq('id', user.id)
            .single();
          setCurrentXp(profile?.xp || 0);

          const { data: completion } = await supabase
            .from('user_completions')
            .select('id')
            .eq('user_id', user.id)
            .eq('challenge_id', id)
            .single();
          if (completion) setAlreadyCompleted(true);
        }

        const { data, error } = await supabase
          .from('challenges')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setChallenge(data);
        setCode(data.initial_code || '');
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) getData();
  }, [id]);

  const validateSolution = async () => {
    if (!user) {
      setValidationError("Connecte-toi pour soumettre ta solution !");
      return;
    }

    setValidating(true);
    setValidationError(null);

    // Simulation IA "Smart"
    await new Promise(resolve => setTimeout(resolve, 1500));

    const normalizedCode = code.toLowerCase();
    const keywords = challenge?.test_keywords || [];
    
    // Validation améliorée par Regex pour Python et PHP
    const missing = keywords.filter(k => {
      const escapedKeyword = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Pour PHP, on vérifie si la variable est présente avec son $
      if (challenge?.language?.toLowerCase() === 'php' && k.startsWith('$')) {
        const regex = new RegExp(escapedKeyword.replace('\\$', '\\$'), 'i');
        return !regex.test(code);
      }
      // Pour Python, on vérifie les structures comme 'def', 'print', 'if' avec des limites de mots
      if (challenge?.language?.toLowerCase() === 'python') {
        const regex = new RegExp(`\\b${escapedKeyword}\\b|${escapedKeyword}`, 'i');
        return !regex.test(code);
      }
      // Par défaut (HTML/CSS/JS)
      return !normalizedCode.replace(/\s+/g, '').includes(k.toLowerCase().replace(/\s+/g, ''));
    });

    if (missing.length === 0) {
      // SUCCESS
      try {
        if (!alreadyCompleted) {
          // 1. Enregistrer la complétion
          await supabase.from('user_completions').insert([
            { user_id: user.id, challenge_id: challenge?.id }
          ]);

          // 2. Ajouter l'XP
          const newXp = currentXp + (challenge?.xp_reward || 0);
          await supabase.from('profiles').update({ xp: newXp }).eq('id', user.id);
          setCurrentXp(newXp);
        }

        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#006633', '#39ff14', '#ffffff']
        });
        setShowSuccessModal(true);
      } catch (err) {
        console.error("Erreur reward:", err);
      }
    } else {
      // FAIL
      setValidationError(`Il manque des éléments clés dans ton code (ex: ${missing[0]}). Vérifie la consigne !`);
    }
    setValidating(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-300 overflow-hidden">
      {/* Header Minimaliste */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Link href="/challenges" className="p-2 hover:bg-slate-800 rounded-xl transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="h-6 w-px bg-slate-800 mx-2" />
          <h1 className="font-black text-white flex items-center gap-2">
            <Rocket className="w-5 h-5 text-primary" />
            {challenge?.titre}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-xs font-black text-primary uppercase">{challenge?.xp_reward} XP en jeu</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-grow flex overflow-hidden">
        {/* Panneau Gauche : Énoncé */}
        <div className="w-1/3 border-r border-slate-800 p-8 overflow-y-auto bg-slate-900/30 flex flex-col gap-8">
          <section>
            <h2 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">Mission Briefing</h2>
            <p className="text-lg text-white font-medium leading-relaxed">{challenge?.description}</p>
          </section>

          <section className="bg-slate-800/50 rounded-3xl p-6 border border-slate-700/50">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" /> Objectifs de vol
            </h3>
            <ul className="space-y-4">
              {challenge?.test_keywords?.map((k, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-300">
                  <div className="w-5 h-5 rounded-lg border-2 border-slate-700 flex-shrink-0 mt-0.5" />
                  {k}
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-auto bg-blue-500/10 border border-blue-500/20 p-6 rounded-3xl flex gap-4">
            <Lightbulb className="w-6 h-6 text-blue-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-black text-blue-400 uppercase mb-1">Conseil du Coach</p>
              <p className="text-xs text-blue-200/70 font-medium italic">"Analyse bien la structure HTML avant de styliser."</p>
            </div>
          </div>
        </div>

        {/* Panneau Droit : Éditeur */}
        <div className="flex-grow flex flex-col bg-slate-950 relative">
          <div className="flex-grow overflow-y-auto p-4 font-mono text-sm">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 min-h-full">
              <Editor
                value={code}
                onValueChange={setCode}
                highlight={code => {
                  try {
                    const lang = challenge?.language?.toLowerCase() || 'html';
                    
                    if (lang === 'python' && languages.python) {
                      return highlight(code, languages.python, 'python');
                    }
                    if (lang === 'php' && languages.php) {
                      return highlight(code, languages.php, 'php');
                    }
                    if (languages.markup) {
                      return highlight(code, languages.markup, 'html');
                    }
                    return code; // Fallback si markup n'est pas chargé
                  } catch (e) {
                    console.error("Prism Highlight Error:", e);
                    return code; // Fallback en cas de crash
                  }
                }}
                padding={24}
                className="min-h-[500px] outline-none"
                style={{
                  fontFamily: '"Fira Code", "Fira Mono", monospace',
                  fontSize: 14,
                }}
              />
            </div>
          </div>

          {/* Barre d'action basse */}
          <div className="p-6 border-t border-slate-800 bg-slate-900/50 backdrop-blur-xl flex justify-between items-center">
            <div className="flex items-center gap-4">
              {validationError && (
                <div className="flex items-center gap-2 text-red-400 text-sm font-bold bg-red-400/10 px-4 py-2 rounded-xl border border-red-400/20 animate-shake">
                  <AlertCircle className="w-4 h-4" /> {validationError}
                </div>
              )}
            </div>
            <button 
              onClick={validateSolution}
              disabled={validating}
              className="group relative flex items-center gap-3 bg-primary text-slate-950 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-[0_0_20px_rgba(57,255,20,0.2)]"
            >
              {validating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyse IA en cours...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  Vérifier ma solution
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Modal de Succès */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-primary/30 w-full max-w-md rounded-[2.5rem] p-10 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-primary animate-pulse" />
            </div>
            <h2 className="text-3xl font-black text-white mb-2">MISSION ACCOMPLIE !</h2>
            <p className="text-slate-400 font-medium mb-8">Ta précision est redoutable, Pilote. Le cockpit est prêt.</p>
            
            <div className="bg-slate-800/50 rounded-2xl p-6 mb-8 flex justify-around">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase mb-1">XP Gagné</p>
                <p className="text-2xl font-black text-primary">+{challenge?.xp_reward}</p>
              </div>
              <div className="w-px bg-slate-700" />
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Total XP</p>
                <p className="text-2xl font-black text-white">{currentXp}</p>
              </div>
            </div>

            <button 
              onClick={() => router.push('/challenges')}
              className="w-full bg-primary text-slate-950 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg"
            >
              Défi Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
