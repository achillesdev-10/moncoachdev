'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  LogIn, UserPlus, Mail, Lock, ChevronLeft, Shield, 
  HelpCircle, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { signUp, signIn, getSecurityQuestion, verifySecurityAnswer, resetPassword } from '@/lib/auth';

type View = 'login' | 'signup' | 'forgot' | 'security' | 'new-password';

function LoginContent() {
  const [view, setView] = useState<View>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [fetchedQuestion, setFetchedQuestion] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      setMessage({ type: 'error', text: decodeURIComponent(error) });
    }
  }, [searchParams]);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setUsername('');
    setSecurityAnswer('');
    setSelectedQuestion('');
    setNewPassword('');
    setResetToken('');
    setMessage(null);
  };

  // ============================================
  // CONNEXION
  // ============================================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await signIn(email, password);

    if (error) {
      setMessage({ type: 'error', text: error });
    } else {
      router.push('/');
      router.refresh();
    }
    setLoading(false);
  };

  // ============================================
  // INSCRIPTION
  // ============================================
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas.' });
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Le mot de passe doit faire au moins 6 caractères.' });
      setLoading(false);
      return;
    }

    if (!selectedQuestion) {
      setMessage({ type: 'error', text: 'Choisis une question de sécurité.' });
      setLoading(false);
      return;
    }

    if (securityAnswer.trim().length < 2) {
      setMessage({ type: 'error', text: 'Ta réponse de sécurité doit faire au moins 2 caractères.' });
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password, username, selectedQuestion, securityAnswer);

    if (error) {
      setMessage({ type: 'error', text: error });
    } else {
      router.push('/');
      router.refresh();
    }
    setLoading(false);
  };

  // ============================================
  // MOT DE PASSE OUBLIÉ — Étape 1 : Email
  // ============================================
  const handleForgotEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { question, error } = await getSecurityQuestion(email);

    if (error) {
      setMessage({ type: 'error', text: error });
    } else {
      setFetchedQuestion(question || '');
      setView('security');
    }
    setLoading(false);
  };

  // ============================================
  // MOT DE PASSE OUBLIÉ — Étape 2 : Question de sécurité
  // ============================================
  const handleSecurityAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { token, error } = await verifySecurityAnswer(email, securityAnswer);

    if (error) {
      setMessage({ type: 'error', text: error });
    } else {
      setResetToken(token || '');
      setView('new-password');
    }
    setLoading(false);
  };

  // ============================================
  // MOT DE PASSE OUBLIÉ — Étape 3 : Nouveau mot de passe
  // ============================================
  const handleNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Le mot de passe doit faire au moins 6 caractères.' });
      setLoading(false);
      return;
    }

    const { error } = await resetPassword(resetToken, newPassword);

    if (error) {
      setMessage({ type: 'error', text: error });
    } else {
      setMessage({ type: 'success', text: 'Mot de passe réinitialisé ! Tu peux te connecter.' });
      setTimeout(() => {
        resetForm();
        setView('login');
      }, 2000);
    }
    setLoading(false);
  };

  const securityQuestions = [
    "Quel est le nom de ta première école ?",
    "Quel est le nom de ton premier animal de compagnie ?",
    "Dans quelle ville es-tu né(e) ?",
    "Quel est le prénom de ta mère ?",
    "Quel est ton film préféré ?",
    "Quel est le nom de ton meilleur ami d'enfance ?",
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-colors mb-8 justify-center">
          <ChevronLeft className="w-5 h-5" /> Retour à l&apos;accueil
        </Link>
        
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-slate-900 font-bold text-2xl">M</span>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-50 dark:bg-slate-800 py-8 px-4 shadow-xl border border-slate-200 dark:border-slate-700 sm:rounded-2xl sm:px-10">

          {/* ===== VUE : CONNEXION ===== */}
          {view === 'login' && (
            <>
              <h2 className="text-center text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                Connexion
              </h2>
              <p className="text-center text-sm text-slate-500 mb-6">
                Pas encore de compte ?{' '}
                <button onClick={() => { resetForm(); setView('signup'); }} className="font-medium text-primary hover:opacity-80">
                  S&apos;inscrire
                </button>
              </p>

              <form className="space-y-5" onSubmit={handleLogin}>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                  <div className="mt-1 relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email" required value={email} onChange={e => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-all"
                      placeholder="ton@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Mot de passe</label>
                  <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-all"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button type="button" onClick={() => { resetForm(); setView('forgot'); }} className="text-xs font-medium text-primary hover:opacity-80">
                    Mot de passe oublié ?
                  </button>
                </div>

                {message && (
                  <div className={`p-3 rounded-xl text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'}`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {message.text}
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="w-full flex justify-center py-3 rounded-xl shadow-sm text-sm font-bold text-slate-900 bg-primary hover:opacity-90 focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-all"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="flex items-center gap-2"><LogIn className="w-5 h-5" /> Se connecter</span>}
                </button>
              </form>
            </>
          )}

          {/* ===== VUE : INSCRIPTION ===== */}
          {view === 'signup' && (
            <>
              <h2 className="text-center text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                Créer un compte
              </h2>
              <p className="text-center text-sm text-slate-500 mb-6">
                Déjà membre ?{' '}
                <button onClick={() => { resetForm(); setView('login'); }} className="font-medium text-primary hover:opacity-80">
                  Se connecter
                </button>
              </p>

              <form className="space-y-4" onSubmit={handleSignup}>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Pseudo</label>
                  <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary text-sm transition-all"
                    placeholder="Ton pseudo (optionnel)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
                  <div className="mt-1 relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                      className="block w-full pl-9 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary text-sm transition-all"
                      placeholder="ton@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Mot de passe</label>
                    <input type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} minLength={6}
                      className="mt-1 block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary text-sm transition-all"
                      placeholder="6+ caractères"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Confirmer</label>
                    <input type={showPassword ? 'text' : 'password'} required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                      className="mt-1 block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary text-sm transition-all"
                      placeholder="Répète le mot de passe"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-xs text-slate-500 hover:text-primary flex items-center gap-1">
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {showPassword ? 'Masquer' : 'Afficher'}
                  </button>
                </div>

                {/* Sécurité */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Sécurité du compte</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Question de sécurité</label>
                    <select value={selectedQuestion} onChange={e => setSelectedQuestion(e.target.value)} required
                      className="block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary text-sm transition-all"
                    >
                      <option value="">— Choisis une question —</option>
                      {securityQuestions.map((q, i) => (
                        <option key={i} value={q}>{q}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ta réponse</label>
                    <div className="relative">
                      <HelpCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="text" required value={securityAnswer} onChange={e => setSecurityAnswer(e.target.value)}
                        className="block w-full pl-9 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary text-sm transition-all"
                        placeholder="Réponds à la question"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 italic">Cette question servira à récupérer ton mot de passe si tu l&apos;oublies.</p>
                  </div>
                </div>

                {message && (
                  <div className={`p-3 rounded-xl text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'}`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {message.text}
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="w-full flex justify-center py-3 rounded-xl shadow-sm text-sm font-bold text-slate-900 bg-primary hover:opacity-90 focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-all"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="flex items-center gap-2"><UserPlus className="w-5 h-5" /> Créer mon compte</span>}
                </button>
              </form>
            </>
          )}

          {/* ===== VUE : MOT DE PASSE OUBLIÉ — Étape 1 ===== */}
          {view === 'forgot' && (
            <>
              <h2 className="text-center text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                Mot de passe oublié
              </h2>
              <p className="text-center text-sm text-slate-500 mb-6">
                Entre ton email pour répondre à ta question de sécurité.
              </p>

              <form className="space-y-5" onSubmit={handleForgotEmail}>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email du compte</label>
                  <div className="mt-1 relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary text-sm transition-all"
                      placeholder="ton@email.com"
                    />
                  </div>
                </div>

                {message && (
                  <div className="p-3 rounded-xl text-sm flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                    <AlertCircle className="w-4 h-4" /> {message.text}
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="w-full flex justify-center py-3 rounded-xl shadow-sm text-sm font-bold text-slate-900 bg-primary hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continuer'}
                </button>

                <button type="button" onClick={() => { resetForm(); setView('login'); }}
                  className="w-full text-center text-sm font-medium text-slate-500 hover:text-primary"
                >
                  ← Retour à la connexion
                </button>
              </form>
            </>
          )}

          {/* ===== VUE : QUESTION DE SÉCURITÉ ===== */}
          {view === 'security' && (
            <>
              <h2 className="text-center text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                Question de sécurité
              </h2>
              <p className="text-center text-sm text-slate-500 mb-6">
                Réponds à ta question pour réinitialiser ton mot de passe.
              </p>

              <form className="space-y-5" onSubmit={handleSecurityAnswer}>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <HelpCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Ta question</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{fetchedQuestion}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Ta réponse</label>
                  <input type="text" required value={securityAnswer} onChange={e => setSecurityAnswer(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary text-sm transition-all"
                    placeholder="Ta réponse secrète"
                  />
                </div>

                {message && (
                  <div className="p-3 rounded-xl text-sm flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                    <AlertCircle className="w-4 h-4" /> {message.text}
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="w-full flex justify-center py-3 rounded-xl shadow-sm text-sm font-bold text-slate-900 bg-primary hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Vérifier ma réponse'}
                </button>

                <button type="button" onClick={() => { resetForm(); setView('forgot'); }}
                  className="w-full text-center text-sm font-medium text-slate-500 hover:text-primary"
                >
                  ← Utiliser un autre email
                </button>
              </form>
            </>
          )}

          {/* ===== VUE : NOUVEAU MOT DE PASSE ===== */}
          {view === 'new-password' && (
            <>
              <h2 className="text-center text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                Nouveau mot de passe
              </h2>
              <p className="text-center text-sm text-slate-500 mb-6">
                Choisis un nouveau mot de passe sécurisé.
              </p>

              <form className="space-y-5" onSubmit={handleNewPassword}>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nouveau mot de passe</label>
                  <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type={showPassword ? 'text' : 'password'} required value={newPassword} onChange={e => setNewPassword(e.target.value)} minLength={6}
                      className="block w-full pl-10 pr-10 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary text-sm transition-all"
                      placeholder="6+ caractères"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {message && (
                  <div className={`p-3 rounded-xl text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'}`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {message.text}
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="w-full flex justify-center py-3 rounded-xl shadow-sm text-sm font-bold text-slate-900 bg-primary hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Réinitialiser</span>}
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
