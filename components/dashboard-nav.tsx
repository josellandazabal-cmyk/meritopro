'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ClipboardCheck, BookOpen, Bot, User, type LucideIcon } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Inicio', icon: Home },
  { href: '/dashboard/diagnostico', label: 'Mi Diagnóstico', icon: ClipboardCheck },
  { href: '/dashboard/modulos', label: 'Módulos', icon: BookOpen },
  { href: '/dashboard/tutor', label: 'Tutor Virtual', icon: Bot },
  { href: '/dashboard/perfil', label: 'Mi Perfil', icon: User },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') return pathname === '/dashboard';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:shrink-0 md:fixed md:inset-y-0 md:left-0 bg-white border-r border-slate-100 px-6 py-8 z-40">
      <Link href="/dashboard" className="mb-10 block">
        <span className="text-lg font-extrabold tracking-tight text-slate-900">
          Mérito<span className="text-yellow-400">Pro</span>
        </span>
        <span className="block text-[11px] font-semibold uppercase tracking-widest text-slate-400 mt-1">
          PGN 2026
        </span>
      </Link>
      <nav className="flex flex-col gap-1">
        {ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
                active
                  ? 'text-yellow-400 font-bold bg-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function DashboardBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-slate-100 px-4 py-2 pb-5 z-50 flex items-center justify-between">
      {ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-2 py-1 transition ${
              active ? 'text-yellow-400 font-bold' : 'text-slate-500 font-medium'
            }`}
          >
            <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
            <span className="text-[10px] leading-none">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
