'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/getUser';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Loader2, Plus, Pencil, Trash2, Search, X, Save, AlertCircle,
  ChevronLeft, Code, Zap, Target, Sword, Filter
} from 'lucide-react';

interface Challenge {
  id: string;
  titre: string;
  description: string;
  type: 'bug_hunter' | 'pixel_perfect' | 'algo';
  niveau: string;
  xp_reward: number;
  initial_code: string;
  test_keywords: string[];
  language: string;
  categorie?: string;
}

const emptyChallenge: Partial<Challenge> = {
  titre: '',
  description: '',
  type: 'algo',
  niveau: 'Débutant',
  xp_reward: 50,
  initial_code: '',
  test_keywords: [],
  language: 'HTML',
  categorie: '',
};

const LANGUAGES = ['HTML', 'CSS', 'JavaScript', 'Python', 'PHP'];
const NIVEAUX = ['Débutant', 'Apprenti', 'Pilote', 'Expert', 'Hacker'];
const TYPES = [
  { value: 'algo', label: 'Algorithme' },
  { value: 'bug_hunter', label: 'Bug Hunter' },
  { value: 'pixel_perfect', label: 'Pixel Perfect' },
];

export default function AdminChallengesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLang, setFilterLang] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Partial<Challenge> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keywordInput, setKeywordInput] = useState('');

  useEffect(() => {
    const check = async () => {
      const user = await getCurrentUser();
      if (!user || !user.is_admin) {
        router.push('/');
        return;
      }
      await fetchChallenges();
    };
    check();
  }, [router]);

  const fetchChallenges = async () => {
    setLoading(true);
    const { data } = await supabase.from('challenges').select('*').order('created_at', { ascending: false });
    setChallenges(data || []);
    setLoading(false);
  };

  const filteredChallenges = useMemo(() => {
    return challenges.filter(c => {
      const matchesSearch =
        c.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLang =
        filterLang === 'all' ||
        (c.language || '').toLowerCase() === filterLang.toLowerCase();
      return matchesSearch && matchesLang;
    });
  }, [challenges, searchQuery, filterLang]);

  const openCreate = () => {
    setEditingChallenge({ ...emptyChallenge });
    setIsEditing(false);
    setKeywordInput('');
    setError(null);
    setShowModal(true);
  };

  const openEdit = (c: Challenge) => {
    setEditingChallenge({ ...c });
    setIsEditing(true);
    setKeywordInput('');
    setError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingChallenge(null);
    setError(null);
  };

  const handleSave = async () => {
    if (!editingChallenge?.titre || !editingChallenge?.description) {
      setError('Le titre et la description sont obligatoires.');
      return;
    }

    setSaving(true);
    setError(null);

    const keywords = keywordInput
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    const payload = {
      titre: editingChallenge.titre,
      description: editingChallenge.description,
      type: editingChallenge.type || 'algo',
      niveau: editingChallenge.niveau || 'Débutant',
      xp_reward: editingChallenge.xp_reward || 50,
      initial_code: editingChallenge.initial_code || '',
      test_keywords: keywords,
      language: editingChallenge.language || 'HTML',
      categorie: editingChallenge.categorie || null,
    };

    try {
      if (isEditing && editingChallenge.id) {
        const { error: updateErr } = await supabase
          .from('challenges')
          .update(payload)
          .eq('id', editingChallenge.id);
        if (updateErr) throw updateErr;
      } else {
        const { error: insertErr } = await supabase
          .from('challenges')
          .insert([payload]);
        if (insertErr) throw insertErr;
      }
      closeModal();
      await fetchChallenges();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, titre: string) => {
    if (!confirm(`Supprimer le défi "${titre}" ? Cette action est irréversible.`)) return;
    const { error: delErr } = await supabase.from('challenges').delete().eq('id', id);
    if (delErr) {
      alert('Erreur: ' + delErr.message);
    } else {
      await fetchChallenges();
    }
  };

  const addKeyword = () => {
    if (!keywordInput.trim()) return;
    const k = keywordInput.trim();
    if (editingChallenge?.test_keywords?.includes(k)) {
      setKeywordInput('');
      return;
    }
    setEditingChallenge(prev => ({
      ...prev,
      test_keywords: [...(prev?.test_keywords || []), k],
    }));
    setKeywordInput('');
  };

  const removeKeyword = (idx: number) => {
    setEditingChallenge(prev => ({
      ...prev,
      test_keywords: prev?.test_keywords?.filter((_, i) => i !== idx) || [],
    }));
  };

  const updateField = (field: string, value: any) => {
    setEditingChallenge(prev => ({ ...prev, [field]: value }));
  };

  const getLangColor = (lang: string) => {
    const l = (lang || '').toLowerCase();
    if (l === 'python') return 'bg-blue-500/10 text-blue-500';
    if (l === 'php') return 'bg-purple-500/10 text-purple-500';
    if (l === 'css') return 'bg-pink-500/10 text-pink-500';
    if (l === 'javascript' || l === 'js') return 'bg-yellow-500/10 text-yellow-500';
    return 'bg-orange-500/10 text-orange-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex text-slate-900 dark:text-slate-300 transition-colors duration-300">
      <Sidebar />

      <main className="flex-grow lg:ml-64 p-4 sm:p-6 lg:p-8 flex flex-col gap-6 pt-16 lg:pt-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin')}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-primary/20 text-primary text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Admin</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                <Sword className="w-7 h-7 text-primary" />
                Gestion des Défis
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{challenges.length} défis au total</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-primary text-slate-950 px-5 py-2.5 rounded-xl text-sm font-black hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              <Plus className="w-4 h-4" /> Nouveau Défi
            </button>
            <ThemeToggle />
          </div>
        </header>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un défi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
            <button
              onClick={() => setFilterLang('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                filterLang === 'all'
                  ? 'bg-primary text-slate-950 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Tous
            </button>
            {LANGUAGES.map(lang => (
              <button
                key={lang}
                onClick={() => setFilterLang(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  filterLang === lang
                    ? 'bg-primary text-slate-950 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Titre</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Langage</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Type</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Niveau</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">XP</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredChallenges.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{c.titre}</p>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{c.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${getLangColor(c.language)}`}>
                        {c.language || 'HTML'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 capitalize">
                        {c.type?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{c.niveau}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-black text-primary">{c.xp_reward}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(c)}
                          className="p-2 hover:bg-blue-500/10 rounded-xl transition-all text-slate-400 hover:text-blue-500"
                          title="Modifier"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.titre)}
                          className="p-2 hover:bg-red-500/10 rounded-xl transition-all text-slate-400 hover:text-red-500"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredChallenges.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <Sword className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                      <p className="text-sm font-bold text-slate-400">Aucun défi trouvé</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Create/Edit */}
      {showModal && editingChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 p-6 pb-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  {isEditing ? <Pencil className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    {isEditing ? 'Modifier le Défi' : 'Nouveau Défi'}
                  </h2>
                </div>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm font-bold bg-red-500/10 px-4 py-3 rounded-xl border border-red-500/20">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                </div>
              )}

              {/* Titre */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Titre *</label>
                <input
                  type="text"
                  value={editingChallenge.titre || ''}
                  onChange={(e) => updateField('titre', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Ex: Le Panier Fantôme"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description *</label>
                <textarea
                  value={editingChallenge.description || ''}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  placeholder="Description du défi..."
                />
              </div>

              {/* Row: Langage, Type, Niveau, XP */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Langage</label>
                  <select
                    value={editingChallenge.language || 'HTML'}
                    onChange={(e) => updateField('language', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Type</label>
                  <select
                    value={editingChallenge.type || 'algo'}
                    onChange={(e) => updateField('type', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Niveau</label>
                  <select
                    value={editingChallenge.niveau || 'Débutant'}
                    onChange={(e) => updateField('niveau', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">XP</label>
                  <input
                    type="number"
                    min={0}
                    value={editingChallenge.xp_reward || 0}
                    onChange={(e) => updateField('xp_reward', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Initial Code */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Code Initial</label>
                <textarea
                  value={editingChallenge.initial_code || ''}
                  onChange={(e) => updateField('initial_code', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  placeholder="Code de départ du défi..."
                />
              </div>

              {/* Test Keywords */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Mots-clés de validation
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addKeyword(); } }}
                    className="flex-grow px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="Tape un mot-clé puis Entrée"
                  />
                  <button
                    onClick={addKeyword}
                    className="px-4 py-2.5 bg-primary/10 text-primary rounded-xl text-sm font-bold hover:bg-primary/20 transition-all"
                  >
                    +
                  </button>
                </div>
                {editingChallenge.test_keywords && editingChallenge.test_keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {editingChallenge.test_keywords.map((kw, i) => (
                      <span key={i} className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300">
                        {kw}
                        <button onClick={() => removeKeyword(i)} className="text-slate-400 hover:text-red-500 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white dark:bg-slate-900 p-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-primary text-slate-950 px-6 py-2.5 rounded-xl text-sm font-black hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-lg shadow-primary/20"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Sauvegarde...</>
                ) : (
                  <><Save className="w-4 h-4" /> {isEditing ? 'Mettre à jour' : 'Créer le défi'}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
