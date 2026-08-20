'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Gavel, FileText } from 'lucide-react';

export default function CGUPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex text-slate-900 dark:text-slate-400">
      <Sidebar />
      <main className="flex-grow lg:ml-64 p-4 sm:p-6 lg:p-12 pt-16 lg:pt-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900/50 backdrop-blur-sm p-10 lg:p-16 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Gavel className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Conditions Générales</h1>
              <p className="text-xs font-bold text-primary uppercase tracking-widest">Utilisation & Propriété</p>
            </div>
          </div>
          
          <div className="space-y-12">
            <section>
              <h2 className="text-sm font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span> 1. Propriété Intellectuelle
              </h2>
              <div className="text-sm leading-relaxed space-y-4">
                <p>
                  Tous les éléments de la plateforme <strong>MonCoachDev</strong> (textes, défis, cours, architecture, codes sources des exercices, logos, icônes) sont et restent la propriété intellectuelle et exclusive de MonCoachDev.
                </p>
                <p>
                  Nul n'est autorisé à reproduire, exploiter, rediffuser, ou utiliser à quelque titre que ce soit, même partiellement, des éléments du site qu'ils soient logiciels, visuels ou sonores sans l'accord écrit préalable de MonCoachDev.
                </p>
                <p className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 italic">
                  Note : L'utilisateur conserve la pleine propriété du code original qu'il rédige dans le Playground ou pour résoudre des défis.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span> 2. Produits Digitaux & Accès
              </h2>
              <div className="text-sm leading-relaxed space-y-4">
                <p>
                  MonCoachDev propose des contenus éducatifs digitaux. L'accès à ces contenus est personnel et non transmissible. MonCoachDev se réserve le droit de modifier, d'ajouter ou de supprimer des cours et des défis à tout moment pour maintenir la qualité de la plateforme.
                </p>
                <p>
                  Conformément à la législation sur les produits digitaux, tout contenu consommé ou service commencé ne pourra faire l'objet d'un remboursement, sauf mention contraire explicite.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span> 3. Limitation de Responsabilité
              </h2>
              <p className="text-sm leading-relaxed">
                MonCoachDev ne pourra être tenu responsable des dommages directs et indirects causés au matériel de l'utilisateur lors de l'accès au site, et résultant soit de l'utilisation d'un matériel ne répondant pas aux spécifications techniques requises, soit de l'apparition d'un bug ou d'une incompatibilité.
              </p>
            </section>

            <section className="p-8 bg-slate-950 rounded-[2rem] border border-slate-800">
              <div className="flex items-start gap-4">
                <FileText className="w-5 h-5 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="text-sm font-black text-white uppercase mb-2">Acceptation des conditions</h3>
                  <p className="text-xs leading-relaxed text-slate-400">
                    En créant un compte sur MonCoachDev, vous reconnaissez avoir pris connaissance de ces conditions et les accepter sans réserve. Ces conditions peuvent être modifiées à tout moment sans préavis.
                  </p>
                </div>
              </div>
            </section>
          </div>
          
          <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Dernière mise à jour : 25 Avril 2026
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
