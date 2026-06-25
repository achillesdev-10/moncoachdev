'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  BookOpen, 
  Construction, 
  ArrowRight, 
  Bell, 
  Rocket, 
  Zap, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CoursPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex text-slate-900 dark:text-slate-300 transition-colors duration-300">
      <Sidebar />

      <main className="flex-grow ml-64 p-8 flex flex-col items-center justify-center">
        <div className="absolute top-8 right-8">
          <ThemeToggle />
        </div>

        <div className="max-w-3xl w-full text-center space-y-12">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 relative z-10">
                <Construction className="w-12 h-12 text-primary" />
              </div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"
              />
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              L'Académie <span className="text-primary">MonCoachDev</span> arrive bientôt 🚀
            </h1>
            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
              Nous préparons des cours exclusifs pour propulser votre carrière de développeur. Restez à l'écoute !
            </p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 max-w-md mx-auto"
          >
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-black uppercase tracking-widest text-primary">Développement du contenu</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">75%</span>
            </div>
            <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-1 border border-slate-300 dark:border-slate-700">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(57,255,20,0.5)]"
              />
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Phase finale : Montage des modules vidéo</p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              href="/contact"
              className="group w-full sm:w-auto bg-primary text-slate-950 px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
            >
              <Bell className="w-5 h-5 group-hover:animate-ring" />
              Être prévenu au lancement
            </Link>
            <Link 
              href="/"
              className="w-full sm:w-auto bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              Retour au Dashboard
            </Link>
          </motion.div>

          {/* Features Preview */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-slate-200 dark:border-slate-800"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <Rocket className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-sm">Contenu Premium</h3>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-sm">Exercices Pratiques</h3>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-sm">Accès à vie</h3>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
