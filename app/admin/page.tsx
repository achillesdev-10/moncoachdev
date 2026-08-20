'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser, logout } from '@/lib/getUser';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  Users, Trophy, Target, ShieldCheck, Search, Mail, 
  ArrowUpRight, Loader2, Download, TrendingUp, 
  Activity, BarChart3, Clock, UserCheck, Zap
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ 
    totalUsers: 0, 
    activeToday: 0, 
    totalChallenges: 0, 
    avgXp: 0 
  });
  const [profiles, setProfiles] = useState<any[]>([]);
  const [topChallenges, setTopChallenges] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [visitData, setVisitData] = useState<any[]>([]);

  useEffect(() => {
    const checkAdminAndFetchData = async () => {
      setLoading(true);
      const user = await getCurrentUser();

      if (!user) {
        router.push('/login');
        return;
      }

      if (!user.is_admin) {
        router.push('/');
        return;
      }

      // Fetch Stats & Data
      const { data: allProfiles } = await supabase.from('app_users').select('*');
      const { data: allChallenges } = await supabase.from('challenges').select('*');
      
      // Calculate basic stats
      const totalUsers = allProfiles?.length || 0;
      const totalChallenges = allChallenges?.length || 0;
      const totalXp = allProfiles?.reduce((acc, p) => acc + (p.xp || 0), 0) || 0;
      const avgXp = totalUsers > 0 ? Math.round(totalXp / totalUsers) : 0;
      
      // Simuler les actifs d'aujourd'hui (pour l'instant basé sur updated_at récent)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const activeToday = allProfiles?.filter(p => new Date(p.updated_at) >= today).length || 0;

      // Top challenges (simulé par ordre de récompense ou autre critère dispo)
      const sortedChallenges = [...(allChallenges || [])]
        .sort((a, b) => b.xp_reward - a.xp_reward)
        .slice(0, 3);

      // Simuler des données de visite pour le graphique
      const mockVisitData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          name: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
          visites: Math.floor(Math.random() * 50) + 10
        };
      });

      setStats({ totalUsers, activeToday, totalChallenges, avgXp });
      setProfiles(allProfiles || []);
      setTopChallenges(sortedChallenges);
      setVisitData(mockVisitData);
      setLoading(false);
    };

    checkAdminAndFetchData();
  }, [router]);

  const filteredProfiles = useMemo(() => {
    return profiles.filter(p => 
      p.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [profiles, searchQuery]);

  const exportToCSV = () => {
    const headers = ['ID', 'Username', 'XP', 'Rank', 'Is Admin', 'Updated At'];
    const csvContent = [
      headers.join(','),
      ...profiles.map(p => [
        p.id,
        p.username || 'N/A',
        p.xp,
        p.rank,
        p.is_admin,
        p.updated_at
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `members_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const seedChallenges = async () => {
    const allNewChallenges = [
      // HTML (Structure & Sémantique)
      {
        titre: "Le Squelette d'un Article",
        description: "Structure un article de blog en utilisant les balises sémantiques <header>, <article> et <footer>.",
        niveau: "Débutant",
        xp_reward: 50,
        type: "algo",
        initial_code: "<!-- Ton code ici -->\n",
        test_keywords: ["<header>", "<article>", "<footer>"],
        language: "html"
      },
      {
        titre: "Formulaire de Contact",
        description: "Crée un formulaire de contact simple avec des champs pour le nom, l'email et un bouton d'envoi.",
        niveau: "Débutant",
        xp_reward: 60,
        type: "algo",
        initial_code: "<form>\n  <!-- Champs ici -->\n</form>",
        test_keywords: ["<input", "type=\"text\"", "type=\"email\"", "<button"],
        language: "html"
      },
      {
        titre: "Liste de Navigation",
        description: "Utilise la balise <nav> et une liste non-ordonnée <ul> pour créer un menu de navigation.",
        niveau: "Débutant",
        xp_reward: 40,
        type: "algo",
        initial_code: "<nav>\n  <!-- Liste ici -->\n</nav>",
        test_keywords: ["<ul>", "<li>", "<a>"],
        language: "html"
      },
      {
        titre: "Tableau de Prix",
        description: "Organise des tarifs dans un tableau HTML utilisant <table>, <tr> et <td>.",
        niveau: "Apprenti",
        xp_reward: 80,
        type: "algo",
        initial_code: "<table>\n  <!-- Données ici -->\n</table>",
        test_keywords: ["<tr>", "<td>", "<th>"],
        language: "html"
      },
      {
        titre: "Intégration Média",
        description: "Ajoute une image à ta page en n'oubliant pas l'attribut 'alt' pour l'accessibilité.",
        niveau: "Débutant",
        xp_reward: 30,
        type: "algo",
        initial_code: "<!-- Ajoute l'image ici -->\n",
        test_keywords: ["<img", "src=", "alt="],
        language: "html"
      },

      // CSS (Design & Mise en page)
      {
        titre: "Le Bouton Fluo",
        description: "Donne un style néon à un bouton et change sa couleur au survol avec :hover.",
        niveau: "Apprenti",
        xp_reward: 70,
        type: "algo",
        initial_code: "<style>\n  button {\n    /* Style ici */\n  }\n</style>\n<button>NÉON</button>",
        test_keywords: ["background", "box-shadow", ":hover"],
        language: "css"
      },
      {
        titre: "Grille de Photos",
        description: "Crée une galerie d'images 3x3 en utilisant CSS Grid.",
        niveau: "Pilote",
        xp_reward: 120,
        type: "algo",
        initial_code: "<style>\n  .gallery {\n    display: grid;\n    /* Config grid ici */\n  }\n</style>\n<div class='gallery'><div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div><div>8</div><div>9</div></div>",
        test_keywords: ["grid-template-columns", "repeat(3", "gap"],
        language: "css"
      },
      {
        titre: "Centrer un Div",
        description: "Le défi classique : centre parfaitement un carré au milieu de son conteneur avec Flexbox.",
        niveau: "Débutant",
        xp_reward: 50,
        type: "algo",
        initial_code: "<style>\n  .parent {\n    display: flex;\n    height: 200px;\n  }\n</style>\n<div class='parent'><div class='child'></div></div>",
        test_keywords: ["justify-content: center", "align-items: center"],
        language: "css"
      },
      {
        titre: "Texte Arc-en-ciel",
        description: "Applique un dégradé linéaire sur le texte pour lui donner un effet coloré.",
        niveau: "Apprenti",
        xp_reward: 90,
        type: "algo",
        initial_code: "<style>\n  h1 {\n    /* Dégradé ici */\n  }\n</style>\n<h1>MAGIC</h1>",
        test_keywords: ["linear-gradient", "background-clip: text", "transparent"],
        language: "css"
      },
      {
        titre: "Carte Profil",
        description: "Design une carte avec des bords arrondis (border-radius) et une ombre douce (box-shadow).",
        niveau: "Apprenti",
        xp_reward: 60,
        type: "algo",
        initial_code: "<style>\n  .card {\n    /* Design ici */\n  }\n</style>\n<div class='card'>Profil</div>",
        test_keywords: ["border-radius", "box-shadow", "padding"],
        language: "css"
      },

      // JAVASCRIPT (Interactivité)
      {
        titre: "Compteur de Clics",
        description: "Incrémente la valeur affichée dans un <span> à chaque clic sur le bouton.",
        niveau: "Apprenti",
        xp_reward: 80,
        type: "algo",
        initial_code: "<span id='count'>0</span>\n<button id='btn'>+1</button>\n<script>\n  // Ton code JS ici\n</script>",
        test_keywords: ["addEventListener", "innerText", "++"],
        language: "javascript"
      },
      {
        titre: "Mode Sombre",
        description: "Bascule la classe 'dark' sur le document.body lors du clic sur un bouton.",
        niveau: "Apprenti",
        xp_reward: 100,
        type: "algo",
        initial_code: "<button id='toggle'>Switch</button>\n<script>\n  // Toggle dark mode\n</script>",
        test_keywords: ["classList.toggle", "dark", "body"],
        language: "javascript"
      },
      {
        titre: "Calculateur de Pourboire",
        description: "Écris une fonction qui prend un montant et retourne 15% de pourboire.",
        niveau: "Débutant",
        xp_reward: 60,
        type: "algo",
        initial_code: "function calculateTip(amount) {\n  // Code\n}",
        test_keywords: ["return", "* 0.15", "amount"],
        language: "javascript"
      },
      {
        titre: "Générateur de Citations",
        description: "Affiche une citation aléatoire tirée d'un tableau de chaînes de caractères.",
        niveau: "Apprenti",
        xp_reward: 110,
        type: "algo",
        initial_code: "const quotes = ['Veni', 'Vidi', 'Vici'];\n// Affiche une citation au hasard",
        test_keywords: ["Math.random", "Math.floor", "quotes["],
        language: "javascript"
      },
      {
        titre: "Vérification d'Âge",
        description: "Affiche 'Majeur' si l'âge est >= 18, sinon 'Mineur'.",
        niveau: "Débutant",
        xp_reward: 40,
        type: "algo",
        initial_code: "let age = 20;\n// Ton test ici",
        test_keywords: ["if", "else", "18"],
        language: "javascript"
      },

      // PYTHON (Logique & Data)
      {
        titre: "Inverser une Chaîne",
        description: "Inverse l'ordre des caractères d'une chaîne de texte (ex: 'Python' -> 'nohtyP').",
        niveau: "Débutant",
        xp_reward: 50,
        type: "algo",
        initial_code: "texte = 'Python'\n# Inverse ici\n",
        test_keywords: ["[::-1]", "print"],
        language: "python"
      },
      {
        titre: "Liste de Courses",
        description: "Ajoute 'Pommes' et 'Lait' à une liste vide et affiche la liste finale.",
        niveau: "Débutant",
        xp_reward: 40,
        type: "algo",
        initial_code: "courses = []\n# Ajoute les éléments\n",
        test_keywords: ["append", "courses", "print"],
        language: "python"
      },
      {
        titre: "Moyenne de Notes",
        description: "Calcule la moyenne d'une liste de nombres : [12, 15, 18, 10].",
        niveau: "Apprenti",
        xp_reward: 70,
        type: "algo",
        initial_code: "notes = [12, 15, 18, 10]\n# Calcul\n",
        test_keywords: ["sum(notes)", "len(notes)", "/"],
        language: "python"
      },
      {
        titre: "Le Devin",
        description: "Génère un nombre aléatoire entre 1 et 10 et compare-le à une variable 'choix'.",
        niveau: "Apprenti",
        xp_reward: 90,
        type: "algo",
        initial_code: "import random\nchoix = 7\n# Code du devin\n",
        test_keywords: ["random.randint", "if", "=="],
        language: "python"
      },
      {
        titre: "Compteur de Voyelles",
        description: "Compte le nombre total de voyelles (a, e, i, o, u) dans la phrase 'Hello World'.",
        niveau: "Pilote",
        xp_reward: 130,
        type: "algo",
        initial_code: "phrase = 'Hello World'\n# Compteur\n",
        test_keywords: ["for", "in", "count", "aeiou"],
        language: "python"
      },

      // PHP (Backend & Dynamisme)
      {
        titre: "Message de Bienvenue",
        description: "Affiche 'Bonjour' suivi de l'heure actuelle (format H:i).",
        niveau: "Débutant",
        xp_reward: 40,
        type: "algo",
        initial_code: "<?php\n// Ton code ici\n",
        test_keywords: ["echo", "date(", "'H:i'"],
        language: "php"
      },
      {
        titre: "Générateur de Table de Multi",
        description: "Utilise une boucle 'for' pour afficher la table de multiplication de 7.",
        niveau: "Apprenti",
        xp_reward: 90,
        type: "algo",
        initial_code: "<?php\n// Table de 7\n",
        test_keywords: ["for", "7 *", "echo"],
        language: "php"
      },
      {
        titre: "Vérification de Login",
        description: "Vérifie si $user est 'admin' ET $pass est '1234'.",
        niveau: "Débutant",
        xp_reward: 50,
        type: "algo",
        initial_code: "<?php\n$user = 'admin';\n$pass = '1234';\n// Test",
        test_keywords: ["if", "&&", "=="],
        language: "php"
      },
      {
        titre: "Nettoyeur de Données",
        description: "Sécurise une variable $input en utilisant la fonction htmlspecialchars.",
        niveau: "Apprenti",
        xp_reward: 80,
        type: "algo",
        initial_code: "<?php\n$input = '<script>alert()</script>';\n// Sécurise",
        test_keywords: ["htmlspecialchars(", "echo"],
        language: "php"
      },
      {
        titre: "Calculateur de TVA",
        description: "Calcule le prix TTC d'un article à partir de son prix HT ($ht = 100) avec une TVA de 20%.",
        niveau: "Débutant",
        xp_reward: 60,
        type: "algo",
        initial_code: "<?php\n$ht = 100;\n// Calcul TTC",
        test_keywords: ["* 1.2", "echo"],
        language: "php"
      }
    ];

    try {
      // 1. Récupérer les titres existants pour éviter les doublons
      const { data: existingChallenges } = await supabase
        .from('challenges')
        .select('titre');
      
      const existingTitles = new Set(existingChallenges?.map(c => c.titre) || []);

      // 2. Filtrer les nouveaux défis
      const challengesToInsert = allNewChallenges.filter(c => !existingTitles.has(c.titre));

      if (challengesToInsert.length === 0) {
        alert("Tous ces défis existent déjà dans la base !");
        return;
      }

      // 3. Insertion
      const { error } = await supabase.from('challenges').insert(challengesToInsert);
      
      if (error) throw error;
      
      alert(`${challengesToInsert.length} nouveaux défis insérés avec succès !`);
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      alert("Erreur lors de l'insertion : " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-slate-900 dark:text-slate-400 font-bold animate-pulse">Chargement du centre de commandement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex text-slate-900 dark:text-slate-300 transition-colors duration-300">
      <Sidebar />

      <main className="flex-grow lg:ml-64 p-4 sm:p-6 lg:p-8 flex flex-col gap-8 pt-16 lg:pt-8">
        {/* Header */}
        <header className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-primary/20 text-primary text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Expert Mode</span>
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">v3.0.0</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              Command Center
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={seedChallenges}
              className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary hover:text-slate-950 transition-all shadow-sm"
            >
              <Zap className="w-4 h-4" /> Générer Défis Backend
            </button>
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button 
              onClick={async () => {
                await logout();
                router.push('/');
              }}
              className="flex items-center gap-2 bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all shadow-sm"
            >
              <Clock className="w-4 h-4" /> Déconnexion
            </button>
            <ThemeToggle />
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Membres" 
            value={stats.totalUsers} 
            icon={<Users className="w-5 h-5 text-blue-500" />}
            trend="+12% ce mois"
            color="blue"
          />
          <StatCard 
            title="Actifs (24h)" 
            value={stats.activeToday} 
            icon={<UserCheck className="w-5 h-5 text-primary" />}
            trend="Stable"
            color="green"
          />
          <StatCard 
            title="Moyenne XP" 
            value={stats.avgXp} 
            icon={<TrendingUp className="w-5 h-5 text-orange-500" />}
            trend="+240 XP / user"
            color="orange"
          />
          <StatCard 
            title="Défis Dispos" 
            value={stats.totalChallenges} 
            icon={<Target className="w-5 h-5 text-purple-500" />}
            trend="2 nouveaux"
            color="purple"
          />
        </div>

        {/* Analytics & Top Challenges */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Analytique des Visites</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">7 derniers jours</p>
              </div>
              <Activity className="w-5 h-5 text-primary animate-pulse" />
            </div>
            <div className="h-[250px] w-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <AreaChart data={visitData}>
                  <defs>
                    <linearGradient id="colorVisites" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#006633" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#006633" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#33415520" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff'}}
                    itemStyle={{color: '#39ff14'}}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="visites" 
                    stroke="#006633" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorVisites)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Challenges */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Top Missions</h2>
            </div>
            <div className="flex flex-col gap-4">
              {topChallenges.map((challenge, idx) => (
                <div key={challenge.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 group hover:border-primary/50 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-black text-slate-500">
                    {idx + 1}
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{challenge.titre}</p>
                    <p className="text-[10px] font-bold text-primary uppercase">{challenge.xp_reward} XP Reward</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-auto w-full py-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-400 hover:border-primary hover:text-primary transition-all">
              Gérer le catalogue
            </button>
          </div>
        </div>

        {/* User Management Table */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Escouade de Pilotes</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Surveillance des comptes</p>
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Rechercher un pseudo, email ou ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pilote</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Progression</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Contrôle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredProfiles.map((profile) => (
                  <tr key={profile.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center font-black text-primary text-xl shadow-inner">
                          {profile.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white text-base group-hover:text-primary transition-colors">{profile.username || 'Pilote Anonyme'}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{profile.id.substring(0, 18)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-lg font-black text-slate-900 dark:text-white">{profile.xp.toLocaleString()} <span className="text-[10px] text-primary">XP</span></span>
                        <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{width: `${Math.min((profile.xp/1500)*100, 100)}%`}} />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                          {profile.rank}
                        </span>
                        {profile.is_admin && (
                          <span className="flex items-center gap-1 text-[8px] font-black uppercase text-primary tracking-widest">
                            <ShieldCheck className="w-3 h-3" /> Officier
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-3 hover:bg-primary/10 rounded-2xl transition-all text-slate-400 hover:text-primary">
                        <ArrowUpRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, trend, color }: any) {
  const colors: any = {
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    green: "bg-primary/10 text-primary border-primary/20",
    orange: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    purple: "bg-purple-500/10 text-purple-500 border-purple-500/20"
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4 group hover:scale-[1.02] transition-all">
      <div className="flex justify-between items-start">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${colors[color]}`}>
          {icon}
        </div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{trend}</div>
      </div>
      <div>
        <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{value.toLocaleString()}</p>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{title}</p>
      </div>
    </div>
  );
}
