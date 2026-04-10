'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { Menu, X, Leaf, Zap, Trophy, ShoppingBag, LogOut, User, ChevronDown } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Scanner' },
  { href: '/recycling-centers', label: 'Centers' },
  { href: '/guide', label: 'Guide' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/rewards', label: 'Rewards' },
  { href: '/store', label: 'Store' },
  { href: '/about', label: 'About' },
];

const TIER_COLORS: Record<string, string> = {
  Seedling: 'text-slate-500',
  Green: 'text-green-600',
  EcoWarrior: 'text-teal-600',
  EarthChampion: 'text-yellow-600',
  PlanetGuardian: 'text-purple-600',
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    router.push('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/90 backdrop-blur-xl shadow-lg shadow-primary/5 border-b border-border'
          : 'bg-background/60 backdrop-blur-md border-b border-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors duration-200" />
            <Leaf className="w-4 h-4 text-primary relative z-10" />
            <Zap className="w-2.5 h-2.5 text-accent absolute bottom-0.5 right-0.5 z-20" />
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">
            Eco<span className="text-primary">Sort</span>
            <span className="text-accent text-sm font-semibold ml-0.5">AI</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-0.5">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`relative px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 group ${
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="relative z-10">{label}</span>
                  {isActive && <span className="absolute inset-0 rounded-md bg-primary/10" />}
                  <span className="absolute inset-0 rounded-md bg-secondary/0 group-hover:bg-secondary/30 transition-colors duration-200" />
                  {isActive && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-3">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-secondary/30 animate-pulse" />
          ) : user ? (
            <>
              {/* Points badge */}
              <Link href="/rewards" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors duration-150">
                <Leaf className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-bold text-primary">{user.ecoPoints.toLocaleString()} pts</span>
              </Link>

              {/* User dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-border hover:bg-secondary/30 transition-all duration-150 group"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {initials}
                  </div>
                  <span className="text-sm font-medium text-foreground max-w-20 truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-xl shadow-primary/5 overflow-hidden animate-fade-in z-50">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-semibold text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      <p className={`text-xs font-bold mt-0.5 ${TIER_COLORS[user.tier] ?? 'text-primary'}`}>
                        {user.tier.replace(/([A-Z])/g, ' $1').trim()} Tier
                      </p>
                    </div>
                    <div className="py-1">
                      <Link href="/rewards" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary/30 transition-colors duration-150">
                        <Trophy className="w-4 h-4 text-primary" /> My Rewards
                      </Link>
                      <Link href="/store" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary/30 transition-colors duration-150">
                        <ShoppingBag className="w-4 h-4 text-primary" /> Eco Store
                      </Link>
                      <Link href="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary/30 transition-colors duration-150">
                        <User className="w-4 h-4 text-primary" /> Dashboard
                      </Link>
                    </div>
                    <div className="border-t border-border py-1">
                      <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors duration-150">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="px-4 py-1.5 rounded-full text-sm font-semibold text-muted-foreground hover:text-foreground border border-border hover:bg-secondary/30 transition-all duration-200">
                Sign In
              </Link>
              <Link href="/auth/register" className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all duration-200 hover:shadow-md hover:shadow-primary/25 active:scale-95">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-all duration-200"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-background/95 backdrop-blur-xl border-t border-border px-4 py-3 flex flex-col gap-1">
          {user && (
            <div className="flex items-center gap-3 px-4 py-3 mb-1 border-b border-border">
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">{initials}</div>
              <div>
                <p className="text-sm font-semibold text-foreground">{user.name}</p>
                <p className="text-xs text-primary font-bold">{user.ecoPoints.toLocaleString()} pts · {user.tier.replace(/([A-Z])/g, ' $1').trim()}</p>
              </div>
            </div>
          )}

          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link key={href} href={href} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary/30 hover:text-foreground'}`}>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
                {label}
              </Link>
            );
          })}

          <div className="mt-2 pt-2 border-t border-border flex flex-col gap-2">
            {user ? (
              <button onClick={handleLogout} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm text-destructive border border-destructive/20 hover:bg-destructive/10 transition-colors duration-150">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            ) : (
              <>
                <Link href="/auth/login" className="px-4 py-2.5 rounded-lg border border-border text-foreground text-sm font-semibold text-center hover:bg-secondary/30 transition-colors duration-150">Sign In</Link>
                <Link href="/auth/register" className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold text-center hover:bg-primary/90 transition-colors duration-150">Get Started Free</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
