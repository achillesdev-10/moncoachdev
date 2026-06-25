'use client';

import React from 'react';
import { LayoutDashboard, BookOpen, Trophy, Settings, Sword, LogOut, Terminal, Mail } from 'lucide-react';
import Link from 'next/link';

import { usePathname } from 'next/navigation';

const SidebarItem = ({ icon: Icon, label, href }: { icon: any, label: string, href: string }) => {
  const pathname = usePathname();
  const active = pathname === href;
  
  return (
    <Link 
      href={href}
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
  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-900 text-slate-900 dark:text-white flex flex-col z-50 border-r border-slate-200 dark:border-slate-800 transition-colors duration-300">
      {/* Logo */}
      <div className="p-6 mb-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary dark:bg-white rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white dark:text-slate-900 font-bold text-2xl">M</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">MonCoachDev</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-grow px-4 space-y-2">
        <SidebarItem icon={LayoutDashboard} label="Tableau de bord" href="/" />
        <SidebarItem icon={Sword} label="Catalogue Défis" href="/challenges" />
        <SidebarItem icon={Terminal} label="Playground" href="/playground" />
        <SidebarItem icon={BookOpen} label="Mes Cours" href="/cours" />
        <SidebarItem icon={Trophy} label="Leaderboard" href="/leaderboard" />
        <SidebarItem icon={Mail} label="Contact" href="/contact" />
        <SidebarItem icon={Settings} label="Paramètres" href="/settings" />
      </nav>

      {/* Legal Links & Footer */}
      <div className="px-8 py-6 space-y-4">
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 mb-1">Légal</p>
          <div className="flex flex-col gap-2 text-[11px] font-bold text-slate-500">
            <Link href="/mentions-legales" className="hover:text-primary transition-colors flex items-center gap-2">
              <span className="w-1 h-1 bg-slate-400 rounded-full"></span> Mentions Légales
            </Link>
            <Link href="/conditions-generales" className="hover:text-primary transition-colors flex items-center gap-2">
              <span className="w-1 h-1 bg-slate-400 rounded-full"></span> Conditions (CGU)
            </Link>
            <Link href="/disclaimer" className="hover:text-primary transition-colors flex items-center gap-2">
              <span className="w-1 h-1 bg-slate-400 rounded-full"></span> Disclaimer
            </Link>
            <Link href="/politique-de-confidentialite" className="hover:text-primary transition-colors flex items-center gap-2">
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
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-900 dark:text-blue-200 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200">
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};
