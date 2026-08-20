'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  Monitor, Server, Shield, Cloud, Database, Code, 
  ChevronRight, CheckCircle2, Clock, Zap, ArrowRight,
  Layout, Palette, Smartphone, Globe, Lock, Terminal,
  Network, Bug, Key, FileCode, Layers, Box, Cpu,
  GitBranch, Container, Settings, Activity, Eye,
  AlertTriangle, Search, HardDrive, Wifi, Rocket
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type RoadmapKey = 'frontend' | 'backend' | 'devops' | 'cyber' | 'data' | 'mobile';

interface Step {
  title: string;
  description: string;
  duration: string;
  tools: string[];
  icon: any;
}

interface Roadmap {
  key: RoadmapKey;
  title: string;
  subtitle: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: any;
  steps: Step[];
}

const roadmaps: Roadmap[] = [
  {
    key: 'frontend',
    title: 'Développeur Frontend',
    subtitle: 'Crée les interfaces que les utilisateurs voient et touchent.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    icon: Layout,
    steps: [
      {
        title: 'Les Fondations du Web',
        description: 'Maîtrise HTML5 et CSS3. Apprends la sémantique, le responsive design et Flexbox/Grid.',
        duration: '2-3 semaines',
        tools: ['HTML5', 'CSS3', 'Flexbox', 'Grid'],
        icon: Globe,
      },
      {
        title: 'JavaScript Moderne',
        description: 'DOM, ES6+, Promises, async/await, modules. JavaScript est le cœur du frontend.',
        duration: '4-6 semaines',
        tools: ['JavaScript (ES6+)', 'DOM API', 'Fetch API'],
        icon: FileCode,
      },
      {
        title: 'Un Framework SPA',
        description: 'Choisis React, Vue ou Angular. Apprends les composants, le state management et le routing.',
        duration: '4-8 semaines',
        tools: ['React', 'Vue.js', 'Next.js'],
        icon: Layers,
      },
      {
        title: 'CSS Avancé & UI Libraries',
        description: 'Tailwind CSS, Sass, styled-components. Utilise des bibliothèques UI pour accélérer.',
        duration: '2-4 semaines',
        tools: ['Tailwind CSS', 'Sass', 'Figma'],
        icon: Palette,
      },
      {
        title: 'TypeScript',
        description: 'Ajoute la sécurité des types à ton JavaScript. Indispensable en entreprise.',
        duration: '2-3 semaines',
        tools: ['TypeScript', 'Interfaces', 'Génériques'],
        icon: Code,
      },
      {
        title: 'Tests & Qualité',
        description: 'Tests unitaires, tests d\'intégration, linting. Livre un code fiable.',
        duration: '2-3 semaines',
        tools: ['Jest', 'Vitest', 'ESLint', 'Playwright'],
        icon: CheckCircle2,
      },
      {
        title: 'Performance & SEO',
        description: 'Optimisation des bundles, lazy loading, métriques Core Web Vitals.',
        duration: '1-2 semaines',
        tools: ['Lighthouse', 'Web Vitals', 'Code Splitting'],
        icon: Zap,
      },
      {
        title: 'Projet Portfolio & Déploiement',
        description: 'Construis 2-3 projets solides, déploie-les et constitue ton portfolio GitHub.',
        duration: '2-4 semaines',
        tools: ['GitHub', 'Vercel', 'Netlify'],
        icon: Rocket,
      },
    ],
  },
  {
    key: 'backend',
    title: 'Développeur Backend',
    subtitle: 'Construis les API, bases de données et la logique métier.',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    icon: Server,
    steps: [
      {
        title: 'Fondations Backend',
        description: 'Comprends HTTP, REST, les status codes, le client-serveur et le terminal.',
        duration: '1-2 semaines',
        tools: ['HTTP/HTTPS', 'REST', 'Terminal/Bash'],
        icon: Terminal,
      },
      {
        title: 'Un Langage Backend',
        description: 'Choisis Node.js (JavaScript), Python (Django/Flask), PHP (Laravel) ou Go.',
        duration: '4-8 semaines',
        tools: ['Node.js', 'Python', 'PHP', 'Go'],
        icon: Code,
      },
      {
        title: 'Bases de Données',
        description: 'SQL (PostgreSQL, MySQL) et NoSQL (MongoDB). Modélisation, requêtes, indexation.',
        duration: '3-5 semaines',
        tools: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQL'],
        icon: Database,
      },
      {
        title: 'Conception d\'API',
        description: 'RESTful API, authentification (JWT, OAuth), validation, routage.',
        duration: '3-4 semaines',
        tools: ['REST API', 'JWT', 'Express', 'Laravel'],
        icon: Layers,
      },
      {
        title: 'Authentification & Sécurité',
        description: 'Gestion des sessions, hachage de mots de passe, protection contre les injections XSS/SQL.',
        duration: '2-3 semaines',
        tools: ['bcrypt', 'JWT', 'OAuth2', 'Helmet.js'],
        icon: Lock,
      },
      {
        title: 'Cache & Performance',
        description: 'Redis, mise en cache des requêtes, optimisation des performances.',
        duration: '2-3 semaines',
        tools: ['Redis', 'Memcached', 'CDN'],
        icon: Zap,
      },
      {
        title: 'Tests & CI/CD',
        description: 'Tests unitaires et d\'intégration. Intègre un pipeline CI/CD.',
        duration: '2-3 semaines',
        tools: ['Jest', 'Mocha', 'GitHub Actions'],
        icon: CheckCircle2,
      },
      {
        title: 'Déploiement & Projets',
        description: 'Déploie sur VPS, Heroku ou AWS. Construis des projets concrets.',
        duration: '2-4 semaines',
        tools: ['Docker', 'Railway', 'AWS', 'DigitalOcean'],
        icon: Rocket,
      },
    ],
  },
  {
    key: 'devops',
    title: 'Ingénieur DevOps',
    subtitle: 'Automatise, déploie et maintiens les infrastructures.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    icon: Cloud,
    steps: [
      {
        title: 'Fondations Linux & Réseau',
        description: 'Maîtrise la ligne de commande Linux, les permissions, les processus et les protocoles réseau.',
        duration: '3-5 semaines',
        tools: ['Linux (Ubuntu/CentOS)', 'SSH', 'TCP/IP', 'DNS'],
        icon: Terminal,
      },
      {
        title: 'Scripting & Automatisation',
        description: 'Bash, Python ou Go pour automatiser les tâches d\'infrastructure.',
        duration: '3-4 semaines',
        tools: ['Bash', 'Python', 'Ansible'],
        icon: Code,
      },
      {
        title: 'Conteneurisation (Docker)',
        description: 'Crée des images Docker, gère les containers et les volumes.',
        duration: '3-4 semaines',
        tools: ['Docker', 'Docker Compose', 'Dockerfile'],
        icon: Container,
      },
      {
        title: 'Orchestration (Kubernetes)',
        description: 'Déploie et gère des clusters K8s. Pods, services, deployments, ingress.',
        duration: '6-8 semaines',
        tools: ['Kubernetes', 'Helm', 'kubectl'],
        icon: Box,
      },
      {
        title: 'CI/CD Pipeline',
        description: 'Configure des pipelines d\'intégration et de déploiement continu.',
        duration: '2-3 semaines',
        tools: ['GitHub Actions', 'GitLab CI', 'Jenkins', 'ArgoCD'],
        icon: GitBranch,
      },
      {
        title: 'Cloud Computing',
        description: 'AWS, GCP ou Azure. Compute, stockage, réseaux et services managés.',
        duration: '6-8 semaines',
        tools: ['AWS', 'GCP', 'Azure', 'Terraform'],
        icon: Cloud,
      },
      {
        title: 'Monitoring & Observabilité',
        description: 'Logs, métriques et alertes. Surveille la santé de tes systèmes.',
        duration: '2-3 semaines',
        tools: ['Prometheus', 'Grafana', 'ELK Stack', 'Datadog'],
        icon: Activity,
      },
      {
        title: 'Sécurité & Certification',
        description: 'Hardening, gestion des secrets, audits de sécurité. Prépare la certification CKA/AWS.',
        duration: '3-4 semaines',
        tools: ['Vault', 'Falco', 'CKA', 'AWS Solutions Architect'],
        icon: Shield,
      },
    ],
  },
  {
    key: 'cyber',
    title: 'Ingénieur Cybersécurité',
    subtitle: 'Protège les systèmes, les données et les réseaux contre les menaces.',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    icon: Shield,
    steps: [
      {
        title: 'Fondations Réseau & Système',
        description: 'TCP/IP, pare-feu, routage, systèmes d\'exploitation (Linux/Windows).',
        duration: '4-6 semaines',
        tools: ['Linux', 'Windows Server', 'TCP/IP', 'Wireshark'],
        icon: Network,
      },
      {
        title: 'Sécurité des Systèmes',
        description: 'Hardening OS, gestion des permissions, chiffrement, PKI.',
        duration: '3-5 semaines',
        tools: ['GPG', 'OpenSSL', 'SELinux', 'Firewalld'],
        icon: Lock,
      },
      {
        title: 'Sécurité Web & Applications',
        description: 'OWASP Top 10, XSS, SQL Injection, CSRF. Apprends à sécuriser des applications.',
        duration: '4-6 semaines',
        tools: ['OWASP', 'Burp Suite', 'ZAP', 'Nmap'],
        icon: Bug,
      },
      {
        title: 'Analyse de Vulnérabilités',
        description: 'Scan de vulnérabilités, pentest méthodologique, reporting.',
        duration: '4-6 semaines',
        tools: ['Nessus', 'OpenVAS', 'Metasploit', 'Nmap'],
        icon: Search,
      },
      {
        title: 'Sécurité Réseau Avancée',
        description: 'IDS/IPS, analyse de trafic, détection d\'intrusions.',
        duration: '3-4 semaines',
        tools: ['Snort', 'Suricata', 'Zeek', 'tcpdump'],
        icon: Eye,
      },
      {
        title: 'Sécurité Cloud',
        description: 'Sécuriser AWS/GCP/Azure. IAM, chiffrement at rest/in transit, logging.',
        duration: '3-5 semaines',
        tools: ['AWS IAM', 'Azure Security', 'CloudTrail'],
        icon: Cloud,
      },
      {
        title: 'Réponse à Incident & Forensics',
        description: 'Investigation post-attaque, analyse de logs, préservation de preuves.',
        duration: '3-4 semaines',
        tools: ['Velociraptor', 'Volatility', 'Autopsy'],
        icon: AlertTriangle,
      },
      {
        title: 'Certifications & Specialisation',
        description: 'Obtiens des certifications reconnues : CEH, CompTIA Security+, OSCP.',
        duration: '8-16 semaines',
        tools: ['CEH', 'CompTIA Security+', 'OSCP', 'CISSP'],
        icon: Key,
      },
    ],
  },
  {
    key: 'data',
    title: 'Ingénieur Data',
    subtitle: 'Collecte, transforme et analyse les données pour éclairer les décisions.',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    icon: Database,
    steps: [
      {
        title: 'Bases de Programmation',
        description: 'Python ou R. Variables, boucles, fonctions, structures de données.',
        duration: '3-5 semaines',
        tools: ['Python', 'R', 'Jupyter Notebook'],
        icon: Code,
      },
      {
        title: 'SQL & Bases de Données',
        description: 'Requêtes SQL avancées, jointures, sous-requêtes, optimisation.',
        duration: '2-4 semaines',
        tools: ['PostgreSQL', 'MySQL', 'BigQuery'],
        icon: Database,
      },
      {
        title: 'Analyse de Données',
        description: 'Pandas, NumPy, visualisation avec Matplotlib/Seaborn.',
        duration: '4-6 semaines',
        tools: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn'],
        icon: Activity,
      },
      {
        title: 'Statistiques & Mathématiques',
        description: 'Probabilités, distributions, tests d\'hypothèses, régression.',
        duration: '4-6 semaines',
        tools: ['Scipy', 'Statsmodels', 'Mathématiques'],
        icon: Cpu,
      },
      {
        title: 'Machine Learning',
        description: 'Scikit-learn, régression, classification, clustering, évaluation.',
        duration: '6-8 semaines',
        tools: ['Scikit-learn', 'XGBoost', 'Feature Engineering'],
        icon: Zap,
      },
      {
        title: 'Big Data & ETL',
        description: 'Traitement de données massives, pipelines ETL, Spark.',
        duration: '4-6 semaines',
        tools: ['Apache Spark', 'Airflow', 'dbt'],
        icon: HardDrive,
      },
      {
        title: 'Deep Learning & IA',
        description: 'Réseaux de neurones, TensorFlow/PyTorch, NLP, Computer Vision.',
        duration: '8-12 semaines',
        tools: ['TensorFlow', 'PyTorch', 'Hugging Face'],
        icon: Cpu,
      },
      {
        title: 'Projets & Portfolio Data',
        description: 'Réalis des projets kaggle, construis un portfolio, prépare des entretiens.',
        duration: '3-4 semaines',
        tools: ['Kaggle', 'GitHub', 'Tableau', 'Power BI'],
        icon: Rocket,
      },
    ],
  },
  {
    key: 'mobile',
    title: 'Développeur Mobile',
    subtitle: 'Crée des applications iOS et Android performantes.',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    icon: Smartphone,
    steps: [
      {
        title: 'Fondations Mobile',
        description: 'Comprends le cycle de vie d\'une app mobile, le responsive et les APIs REST.',
        duration: '2-3 semaines',
        tools: ['HTTP', 'REST API', 'JSON'],
        icon: Smartphone,
      },
      {
        title: 'React Native ou Flutter',
        description: 'Choisis un framework cross-platform : React Native (JS) ou Flutter (Dart).',
        duration: '6-8 semaines',
        tools: ['React Native', 'Flutter', 'Dart'],
        icon: Layers,
      },
      {
        title: 'Navigation & State',
        description: 'React Navigation, gestion d\'état (Redux, Provider), bottom tabs, drawers.',
        duration: '3-4 semaines',
        tools: ['React Navigation', 'Redux', 'Provider', 'Zustand'],
        icon: Settings,
      },
      {
        title: 'APIs & Backend',
        description: 'Connecte ton app à un backend. Authentification, stockage, push notifications.',
        duration: '3-4 semaines',
        tools: ['Axios', 'Firebase', 'Supabase', 'OneSignal'],
        icon: Server,
      },
      {
        title: 'UI/UX Mobile',
        description: 'Design patterns mobile, animations, accessibilité.',
        duration: '2-3 semaines',
        tools: ['Figma', 'React Native Reanimated', 'Lottie'],
        icon: Palette,
      },
      {
        title: 'Tests & Déploiement',
        description: 'Tests E2E, publication sur App Store et Google Play.',
        duration: '3-4 semaines',
        tools: ['Detox', 'Expo', 'Fastlane', 'App Store Connect'],
        icon: CheckCircle2,
      },
      {
        title: 'Performance & Offline',
        description: 'Optimisation, cache, mode hors-ligne, mise à jour OTA.',
        duration: '2-3 semaines',
        tools: ['AsyncStorage', 'Flipper', 'CodePush'],
        icon: Zap,
      },
      {
        title: 'Projets Portfolio Mobile',
        description: 'Construis 2-3 apps complètes, déploie-les et partage-les.',
        duration: '3-4 semaines',
        tools: ['GitHub', 'Expo Go', 'TestFlight'],
        icon: Rocket,
      },
    ],
  },
];

export default function RoadmapPage() {
  const [selected, setSelected] = useState<RoadmapKey>('frontend');
  const active = roadmaps.find(r => r.key === selected)!;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex text-slate-900 dark:text-slate-300 transition-colors duration-300">
      <Sidebar />

      <main className="flex-grow ml-64 p-8 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              Roadmaps Carrière
              <span className="text-2xl">🗺️</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Ton guide étape par étape pour devenir développeur. Choisis ta voie.
            </p>
          </div>
          <ThemeToggle />
        </header>

        {/* Tabs */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2 -mx-2 px-2">
          {roadmaps.map((r) => (
            <button
              key={r.key}
              onClick={() => setSelected(r.key)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all border ${
                selected === r.key
                  ? `${r.bgColor} ${r.borderColor} ${r.color} shadow-lg`
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <r.icon className="w-4 h-4" />
              {r.title}
            </button>
          ))}
        </div>

        {/* Roadmap Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Roadmap Header Card */}
            <div className={`mb-10 p-8 rounded-[2rem] border ${active.borderColor} ${active.bgColor} relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="relative z-10 flex items-center gap-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${active.bgColor} border ${active.borderColor}`}>
                  <active.icon className={`w-8 h-8 ${active.color}`} />
                </div>
                <div>
                  <h2 className={`text-3xl font-black ${active.color}`}>{active.title}</h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-lg">{active.subtitle}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-bold uppercase tracking-wider">
                    ⏱️ Durée estimée totale : {active.steps.length * 3}–{active.steps.length * 6} semaines
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline Steps */}
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-slate-200 dark:from-slate-800 via-slate-300 dark:via-slate-700 to-slate-200 dark:to-slate-800" />

              <div className="space-y-6">
                {active.steps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="relative flex gap-6 group"
                  >
                    {/* Step Number Circle */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${
                        i === 0 
                          ? `${active.bgColor} ${active.borderColor}` 
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                      } group-hover:scale-110 transition-transform shadow-sm`}>
                        <span className={`text-lg font-black ${i === 0 ? active.color : 'text-slate-400 dark:text-slate-500'}`}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </div>
                    </div>

                    {/* Step Card */}
                    <div className="flex-grow bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg transition-all mb-2">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <step.icon className={`w-5 h-5 ${active.color}`} />
                          <h3 className="text-lg font-black text-slate-900 dark:text-white">{step.title}</h3>
                        </div>
                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                          <Clock className="w-3 h-3" />
                          {step.duration}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-4 leading-relaxed">
                        {step.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {step.tools.map((tool, j) => (
                          <span 
                            key={j}
                            className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Final CTA */}
            <div className="mt-12 mb-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] text-center">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
                Prêt à démarrer ta mission ? 🚀
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium max-w-lg mx-auto">
                Inscris-toi sur MonCoachDev et commence dès maintenant par les défis pratiques pour mettre en application chaque étape.
              </p>
              <div className="flex items-center justify-center gap-4">
                <a 
                  href="/login" 
                  className="bg-primary text-slate-900 px-8 py-3 rounded-2xl font-black hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                  Commencer maintenant <ArrowRight className="w-5 h-5" />
                </a>
                <a 
                  href="/challenges" 
                  className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 px-8 py-3 rounded-2xl font-black hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
                >
                  Explorer les défis
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
