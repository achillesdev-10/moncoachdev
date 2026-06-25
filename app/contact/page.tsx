'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Mail, Phone, MapPin, Send, MessageSquare, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulation d'envoi
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex text-slate-900 dark:text-slate-300">
      <Sidebar />

      <main className="flex-grow ml-64 p-8 lg:p-12">
        <div className="max-w-5xl mx-auto">
          <header className="mb-12">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
              CONTACTEZ-NOUS
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Une question, un partenariat ou besoin d'assistance ? MonCoachDev est là pour vous.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Infos de contact */}
            <div className="space-y-8">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" /> Informations
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase text-slate-500 mb-1">Email</p>
                      <a href="mailto:achillesdev10@gmail.com" className="font-bold hover:text-primary transition-colors">
                        achillesdev10@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase text-slate-500 mb-1">Téléphone</p>
                      <a href="tel:+2250709243045" className="font-bold hover:text-primary transition-colors">
                        +225 07 09 24 30 45
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase text-slate-500 mb-1">Siège</p>
                      <p className="font-bold">Abidjan, Côte d'Ivoire</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary p-8 rounded-[2rem] text-slate-950">
                <h3 className="text-xl font-black mb-2">MonCoachDev</h3>
                <p className="font-medium opacity-80">Votre plateforme d'apprentissage et de coaching en développement.</p>
              </div>
            </div>

            {/* Formulaire */}
            <div className="lg:col-cols-2">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Send className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-black mb-2">MESSAGE ENVOYÉ !</h2>
                    <p className="text-slate-500">Merci de nous avoir contacté. MonCoachDev vous répondra sous 24-48h.</p>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="mt-8 text-primary font-bold hover:underline"
                    >
                      Envoyer un autre message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-500 ml-1">Nom Complet</label>
                        <input 
                          required
                          type="text" 
                          placeholder="Ex: Jean Dupont"
                          className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-500 ml-1">Email</label>
                        <input 
                          required
                          type="email" 
                          placeholder="jean@example.com"
                          className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-slate-500 ml-1">Sujet</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Comment pouvons-nous vous aider ?"
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-slate-500 ml-1">Message</label>
                      <textarea 
                        required
                        rows={5}
                        placeholder="Votre message ici..."
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary transition-all resize-none"
                      ></textarea>
                    </div>

                    <button 
                      disabled={loading}
                      type="submit"
                      className="w-full bg-primary text-slate-950 py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" /> Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" /> Envoyer le message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
