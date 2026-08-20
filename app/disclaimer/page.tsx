'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex text-slate-900 dark:text-slate-400">
      <Sidebar />
      <main className="flex-grow lg:ml-64 p-4 sm:p-6 lg:p-12 pt-16 lg:pt-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900/50 backdrop-blur-sm p-10 lg:p-16 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 bg-yellow-500/10 rounded-2xl">
              <ShieldAlert className="w-8 h-8 text-yellow-500" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Disclaimer</h1>
              <p className="text-xs font-bold text-yellow-500 uppercase tracking-widest">Clause de non-responsabilité</p>
            </div>
          </div>
          
          <div className="space-y-12">
            <section>
              <h2 className="text-sm font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span> 1. Usage Pédagogique
              </h2>
              <p className="text-sm leading-relaxed">
                Le site <strong>MonCoachDev</strong> est une plateforme de formation. Les informations, codes sources, et exercices proposés le sont à titre purement pédagogique. MonCoachDev ne garantit pas l'adéquation de ces contenus à un usage professionnel ou industriel sans vérification préalable par l'utilisateur.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span> 2. Exécution de Code
              </h2>
              <div className="text-sm leading-relaxed space-y-4">
                <p>
                  La plateforme permet l'exécution de code (JavaScript, Python) dans un environnement sécurisé (Sandbox). Toutefois, MonCoachDev décline toute responsabilité en cas de :
                </p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Perte de données sur le terminal de l'utilisateur.</li>
                  <li>Dysfonctionnement du navigateur suite à une boucle infinie ou un script trop gourmand en ressources écrit par l'utilisateur.</li>
                  <li>Utilisation du code issu de la plateforme dans des projets tiers.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span> 3. Liens Externes
              </h2>
              <p className="text-sm leading-relaxed">
                Le site peut contenir des liens vers des sites tiers. MonCoachDev n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou aux dommages pouvant résulter de leur utilisation.
              </p>
            </section>

            <section className="p-8 bg-yellow-500/5 rounded-[2rem] border border-yellow-500/10">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-1" />
                <div>
                  <h3 className="text-sm font-black text-yellow-700 dark:text-yellow-500 uppercase mb-2">Avertissement Important</h3>
                  <p className="text-xs leading-relaxed italic text-yellow-800/80 dark:text-yellow-500/80">
                    Le développement logiciel comporte des risques. Il est de la responsabilité de l'utilisateur de tester et valider tout code avant son déploiement dans un environnement critique. MonCoachDev est un espace d'apprentissage et d'expérimentation.
                  </p>
                </div>
              </div>
            </section>
          </div>
          
          <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              MonCoachDev © 2026 - Sécurité & Apprentissage
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
