'use client';

import React, { useEffect, useState } from 'react';
import { LayoutDashboard, BookOpen, Trophy, Settings, Sword, LogOut, Terminal, Mail, LogIn, Map, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { getCurrentUser, logout } from '@/lib/getUser';
import { usePathname, useRouter } from 'next/navigation';

const SidebarItem = ({ icon: Icon, label, href, onClick }: { icon: any, label: string, href: string, onClick?: () => void }) => {
  const pathname = usePathname();
  const active = pathname === href;
  
  return (
    <Link 
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        active 
          ? 'bg-primary/10 dark:bg-white/10 text-primary dark:text-white font-semibold border border-primary/20 dark:border-white/10' 
          : 'text-slate-900 dark:text-blue-100 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-primary dark:text-white' : 'text-slate-900 dark:text-blue-200 group-hover:text-slate-900 dark:group-hover:text-white'}`} />
      <span>{label}</span>
    </Link>
  );
};

export const Sidebar = () => {
  const [user, setUser] = useState<any>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getCurrentUser().then(u => setUser(u));
    // Vérifier l'auth au changement de page
    const interval = setInterval(() => {
      getCurrentUser().then(u => setUser(u));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = async () => {
    await logout();
    setUser(null);
    router.push('/');
    setMobileOpen(false);
  };

  const closeMobile = () => setMobileOpen(false);

  const navContent = (
    <>
      {/* Logo */}
      <div className="p-6 mb-8 flex items-center justify-between">
        <Link href="/" onClick={closeMobile} className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary dark:bg-white rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white dark:text-slate-900 font-bold text-2xl">M</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">MonCoachDev</span>
        </Link>
        {/* Close button (mobile only) */}
        <button 
          onClick={closeMobile}
          className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-grow px-4 space-y-2">
        <SidebarItem icon={LayoutDashboard} label="Tableau de bord" href="/" onClick={closeMobile} />
        <SidebarItem icon={Sword} label="Catalogue Défis" href="/challenges" onClick={closeMobile} />
        <SidebarItem icon={Map} label="Roadmaps" href="/roadmap" onClick={closeMobile} />
        <SidebarItem icon={Terminal} label="Playground" href="/playground" onClick={closeMobile} />
        <SidebarItem icon={BookOpen} label="Cours" href="/cours" onClick={closeMobile} />
        <SidebarItem icon={Trophy} label="Leaderboard" href="/leaderboard" onClick={closeMobile} />
        <SidebarItem icon={Mail} label="Contact" href="/contact" onClick={closeMobile} />
        {user && <SidebarItem icon={Settings} label="Paramètres" href="/settings" onClick={closeMobile} />}
      </nav>

      {/* Legal Links & Footer */}
      <div className="px-8 py-6 space-y-4">
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 mb-1">Légal</p>
          <div className="flex flex-col gap-2 text-[11px] font-bold text-slate-500">
            <Link href="/mentions-legales" onClick={closeMobile} className="hover:text-primary transition-colors flex items-center gap-2">
              <span className="w-1 h-1 bg-slate-400 rounded-full"></span> Mentions Légales
            </Link>
            <Link href="/conditions-generales" onClick={closeMobile} className="hover:text-primary transition-colors flex items-center gap-2">
              <span className="w-1 h-1 bg-slate-400 rounded-full"></span> Conditions (CGU)
            </Link>
            <Link href="/disclaimer" onClick={closeMobile} className="hover:text-primary transition-colors flex items-center gap-2">
              <span className="w-1 h-1 bg-slate-400 rounded-full"></span> Disclaimer
            </Link>
            <Link href="/politique-de-confidentialite" onClick={closeMobile} className="hover:text-primary transition-colors flex items-center gap-2">
              <span className="w-1 h-1 bg-slate-400 rounded-full"></span> Confidentialité
            </Link>
          </div>
        </div>
        <p className="text-[10px] font-medium text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
          © 2026 MonCoachDev
        </p>
      </div>

      {/* User / Bottom info */}
      <div className="p-4 mt-auto border-t border-slate-200 dark:border-white/10">
        {user ? (
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-900 dark:text-blue-200 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
        ) : (
          <Link 
            href="/login"
            onClick={closeMobile}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-all duration-200"
          >
            <LogIn className="w-5 h-5" />
            <span>Se connecter</span>
          </Link>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Hamburger button (mobile only) */}
      <button 
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-[60] lg:hidden p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 hover:scale-105 transition-all"
      >
        <Menu className="w-6 h-6 text-slate-900 dark:text-white" />
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-900 text-slate-900 dark:text-white flex-col z-50 border-r border-slate-200 dark:border-slate-800 transition-colors duration-300">
        {navContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={closeMobile}
          />
          {/* Sidebar */}
          <aside className="absolute left-0 top-0 h-full w-72 bg-white dark:bg-slate-900 text-slate-900 dark:text-white flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
};
