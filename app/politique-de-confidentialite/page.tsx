'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex text-slate-900 dark:text-slate-300">
      <Sidebar />
      <main className="flex-grow lg:ml-64 p-4 sm:p-6 lg:p-12 pt-16 lg:pt-12">
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 p-10 lg:p-16 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <h1 className="text-3xl font-black mb-8 text-slate-900 dark:text-white uppercase tracking-tight">Politique de Confidentialité</h1>
          
          <p className="mb-8 font-medium text-slate-500">Dernière mise à jour : 25 Avril 2026</p>

          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4 text-primary">1. COLLECTE DES DONNÉES</h2>
            <p className="leading-relaxed mb-4">
              Sur MonCoachDev, nous collectons les informations suivantes pour assurer le bon fonctionnement de votre compte :
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Adresse e-mail (via Supabase Auth)</li>
              <li>Données de progression (scores, défis réussis, XP)</li>
              <li>Projets sauvegardés dans le Playground</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4 text-primary">2. UTILISATION DES DONNÉES</h2>
            <p className="leading-relaxed">
              Vos données sont exclusivement utilisées pour :
            </p>
            <ul className="list-disc ml-6 mt-4 space-y-2">
              <li>Gérer votre accès à la plateforme</li>
              <li>Afficher votre position dans le Leaderboard</li>
              <li>Personnaliser votre expérience d'apprentissage</li>
              <li>Vous contacter en cas de besoin technique (Support MonCoachDev)</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4 text-primary">3. COOKIES</h2>
            <p className="leading-relaxed">
              Nous utilisons des cookies essentiels pour maintenir votre session active. En utilisant MonCoachDev, vous acceptez l'utilisation de ces cookies nécessaires à la sécurité et au fonctionnement de l'application.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4 text-primary">4. VOS DROITS (RGPD)</h2>
            <p className="leading-relaxed">
              Conformément à la réglementation sur la protection des données, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ce droit, contactez MonCoachDev à <strong>achillesdev10@gmail.com</strong>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
