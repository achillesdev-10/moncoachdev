'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ShieldCheck, Info } from 'lucide-react';

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex text-slate-900 dark:text-slate-400">
      <Sidebar />
      <main className="flex-grow lg:ml-64 p-4 sm:p-6 lg:p-12 pt-16 lg:pt-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900/50 backdrop-blur-sm p-10 lg:p-16 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Mentions Légales</h1>
              <p className="text-xs font-bold text-primary uppercase tracking-widest">Transparence & Conformité</p>
            </div>
          </div>
          
          <div className="space-y-12">
            <section>
              <h2 className="text-sm font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span> 1. Édition du Site
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div>
                  <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">Propriétaire du site :</p>
                  <p>MonCoachDev</p>
                  <p>Contact : achillesdev10@gmail.com</p>
                  <p>Téléphone : +225 07 09 24 30 45</p>
                </div>
                <div>
                  <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">Directeur de la publication :</p>
                  <p>MonCoachDev</p>
                  <p className="font-bold text-slate-700 dark:text-slate-300 mt-4 mb-1">Siège social :</p>
                  <p>Abidjan, Côte d'Ivoire</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span> 2. Hébergement
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <p className="font-black text-xs uppercase text-primary mb-2">Frontend & Edge</p>
                  <p className="font-bold text-slate-900 dark:text-white">Vercel Inc.</p>
                  <p>440 N Barranca Ave #4133</p>
                  <p>Covina, CA 91723, USA</p>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <p className="font-black text-xs uppercase text-primary mb-2">Base de données & Auth</p>
                  <p className="font-bold text-slate-900 dark:text-white">Supabase Inc.</p>
                  <p>970 Summer St, Stamford</p>
                  <p>CT 06905, USA</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span> 3. Propriété Intellectuelle
              </h2>
              <p className="text-sm leading-relaxed">
                L'ensemble de ce site relève de la législation internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques. La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
              </p>
            </section>

            <section className="p-8 bg-primary/5 rounded-[2rem] border border-primary/10">
              <div className="flex items-start gap-4">
                <Info className="w-5 h-5 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase mb-2">Note sur les cookies</h3>
                  <p className="text-xs leading-relaxed italic">
                    MonCoachDev utilise des cookies techniques strictement nécessaires au fonctionnement de la plateforme (authentification, session). Aucun cookie de traçage publicitaire n'est utilisé sans votre consentement.
                  </p>
                </div>
              </div>
            </section>
          </div>
          
          <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              MonCoachDev © 2026 - Tous droits réservés
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
