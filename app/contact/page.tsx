'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Mail, Phone, MapPin, Send, MessageSquare, Loader2, CheckCircle2, Clock, Globe } from 'lucide-react';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Envoi via mailto (pas de backend requis)
    const mailtoLink = `mailto:achillesdev10@gmail.com?subject=${encodeURIComponent(`[MonCoachDev] ${form.subject}`)}&body=${encodeURIComponent(`Nom: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
    window.location.href = mailtoLink;
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex text-slate-900 dark:text-slate-300">
      <Sidebar />

      <main className="flex-grow lg:ml-64 p-4 sm:p-6 lg:p-12 pt-16 lg:pt-12">
        <div className="max-w-5xl mx-auto">
          <header className="mb-10 lg:mb-12">
            <div className="absolute top-4 right-4 lg:top-8 lg:right-8">
              <ThemeToggle />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
              Contactez-nous ✉️
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
              Une question, un partenariat ou besoin d&apos;assistance ? MonCoachDev est là pour vous.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
            {/* Infos de contact */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" /> Informations
                </h2>
                <div className="space-y-5">
                  <a href="mailto:achillesdev10@gmail.com" className="flex items-start gap-4 group">
                    <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Email</p>
                      <p className="font-bold text-sm group-hover:text-primary transition-colors">achillesdev10@gmail.com</p>
                    </div>
                  </a>

                  <a href="tel:+2250709243045" className="flex items-start gap-4 group">
                    <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Téléphone</p>
                      <p className="font-bold text-sm group-hover:text-primary transition-colors">+225 07 09 24 30 45</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Siège</p>
                      <p className="font-bold text-sm">Abidjan, Côte d&apos;Ivoire</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Disponibilité</p>
                      <p className="font-bold text-sm">Lun – Sam, 8h – 18h</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary to-green-400 p-6 rounded-3xl text-slate-950 shadow-lg shadow-primary/20">
                <h3 className="text-lg font-black mb-2">MonCoachDev</h3>
                <p className="font-medium opacity-80 text-sm">Votre plateforme d&apos;apprentissage et de coaching en développement.</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold opacity-70">
                  <Clock className="w-4 h-4" /> Réponse sous 24-48h
                </div>
              </div>
            </div>

            {/* Formulaire */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                {submitted ? (
                  <div className="text-center py-10 sm:py-12">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-black mb-2">Message envoyé !</h2>
                    <p className="text-slate-500 text-sm">Merci de nous avoir contacté. MonCoachDev vous répondra sous 24-48h.</p>
                    <button 
                      onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                      className="mt-6 text-primary font-bold text-sm hover:underline"
                    >
                      Envoyer un autre message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-wider">Nom Complet</label>
                        <input 
                          required
                          type="text" 
                          value={form.name}
                          onChange={e => setForm({...form, name: e.target.value})}
                          placeholder="Ex: Jean Dupont"
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-wider">Email</label>
                        <input 
                          required
                          type="email" 
                          value={form.email}
                          onChange={e => setForm({...form, email: e.target.value})}
                          placeholder="jean@example.com"
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-wider">Sujet</label>
                      <input 
                        required
                        type="text" 
                        value={form.subject}
                        onChange={e => setForm({...form, subject: e.target.value})}
                        placeholder="Comment pouvons-nous vous aider ?"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-wider">Message</label>
                      <textarea 
                        required
                        rows={5}
                        value={form.message}
                        onChange={e => setForm({...form, message: e.target.value})}
                        placeholder="Votre message ici..."
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none text-sm"
                      />
                    </div>

                    <button 
                      disabled={loading}
                      type="submit"
                      className="w-full bg-primary text-slate-950 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
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
                    <p className="text-[10px] text-center text-slate-400 font-medium">
                      📩 Le formulaire ouvre votre client mail avec le message pré-rempli.
                    </p>
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
