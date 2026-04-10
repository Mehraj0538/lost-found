'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cpu, BarChart3, Trophy, ShoppingBag, BookOpen } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/',          label: 'Scanner',   icon: Cpu },
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/rewards',   label: 'Rewards',   icon: Trophy },
  { href: '/store',     label: 'Store',     icon: ShoppingBag },
  { href: '/guide',     label: 'Guide',     icon: BookOpen },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-2">
      <div className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-background/60 backdrop-blur-xl border border-border/60 shadow-xl shadow-black/10">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {/* Active pill background */}
              {isActive && (
                <span className="absolute inset-0 rounded-xl bg-primary/10" />
              )}
              <Icon className={`w-5 h-5 relative z-10 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
              <span className="text-[10px] font-semibold relative z-10 leading-none">{label}</span>
              {/* Active dot */}
              {isActive && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
