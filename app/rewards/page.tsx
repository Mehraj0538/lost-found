'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import {
  Leaf, Trophy, ShoppingBag, ArrowRight,
  Recycle, Scan, Gift, Clock, Loader2, Zap,
  ChevronRight, Star, Lock,
} from 'lucide-react';

const TIERS = [
  {
    name: 'Seedling', points: 0, emoji: '🌱',
    gradient: 'from-slate-400 to-slate-500',
    bg: 'bg-slate-500/10', border: 'border-slate-500/20', text: 'text-slate-500',
    benefit: 'Access to AI scanner',
    discount: 0,
  },
  {
    name: 'Green', points: 100, emoji: '🥉',
    gradient: 'from-green-500 to-emerald-500',
    bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-600',
    benefit: 'Eco Store unlocked',
    discount: 0,
  },
  {
    name: 'Eco Warrior', points: 500, emoji: '🥈',
    gradient: 'from-teal-400 to-cyan-500',
    bg: 'bg-teal-500/10', border: 'border-teal-500/20', text: 'text-teal-600',
    benefit: '10% store discount',
    discount: 10,
  },
  {
    name: 'Earth Champion', points: 1000, emoji: '🥇',
    gradient: 'from-yellow-400 to-amber-500',
    bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-600',
    benefit: '20% store discount',
    discount: 20,
  },
  {
    name: 'Planet Guardian', points: 2500, emoji: '🌟',
    gradient: 'from-purple-400 to-violet-500',
    bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-600',
    benefit: '30% discount + VIP',
    discount: 30,
  },
];

const EARN_WAYS = [
  { icon: Scan,    label: 'Scan an item',      points: '+5',       suffix: 'pts', desc: 'Per AI classification scan' },
  { icon: Recycle, label: 'Mark as recycled',  points: '+50–150',  suffix: 'pts', desc: 'Depends on waste type' },
  { icon: Gift,    label: 'Welcome bonus',     points: '+25',      suffix: 'pts', desc: 'One-time on sign-up' },
];

const ACTION_ICON: Record<string, React.ReactNode> = {
  register: <Gift    className="w-4 h-4 text-primary" />,
  scan:     <Scan    className="w-4 h-4 text-primary" />,
  recycle:  <Recycle className="w-4 h-4 text-primary" />,
  redeem:   <ShoppingBag className="w-4 h-4 text-destructive" />,
};

export default function RewardsPage() {
  const { user, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [txLoading, setTxLoading] = useState(true);

  useEffect(() => {
    if (!user) { setTxLoading(false); return; }
    fetch('/api/eco-points')
      .then((r) => r.json())
      .then((d) => setTransactions(d.transactions ?? []))
      .finally(() => setTxLoading(false));
  }, [user]);

  if (authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md animate-slide-in">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Sign in to view your rewards</h1>
          <p className="text-muted-foreground mb-7 text-sm leading-relaxed">
            Create a free account and start earning eco-points for every scan and recycle action.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/auth/login" className="px-5 py-2.5 rounded-full border border-border text-sm font-semibold text-foreground hover:bg-secondary/30 transition-all duration-200">
              Sign In
            </Link>
            <Link href="/auth/register" className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all duration-200">
              Get Started Free
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const currentTierIdx = TIERS.findIndex((t) => t.name.replace(' ', '') === user.tier || t.name === user.tier.replace(/([A-Z])/g, ' $1').trim());
  const safeTierIdx = currentTierIdx === -1 ? 0 : currentTierIdx;
  const currentTier = TIERS[safeTierIdx];
  const nextTier = TIERS[safeTierIdx + 1];
  const progressPct = nextTier
    ? Math.min(100, ((user.ecoPoints - currentTier.points) / (nextTier.points - currentTier.points)) * 100)
    : 100;
  const ptsToNext = nextTier ? nextTier.points - user.ecoPoints : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">

      {/* ── Hero banner ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/5 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">

            {/* Left — greeting */}
            <div className="animate-slide-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
                <Leaf className="w-3.5 h-3.5" /> Eco-Points Rewards
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-2">
                Your Rewards
              </h1>
              <p className="text-muted-foreground text-base">
                Hey {user.name.split(' ')[0]} 👋 — keep scanning and recycling to level up!
              </p>
            </div>

            {/* Right — stats row */}
            <div className="flex flex-wrap gap-4 animate-slide-in">
              {/* Points */}
              <div className="flex flex-col items-center justify-center px-8 py-5 rounded-2xl bg-primary/10 border border-primary/20 min-w-36 text-center">
                <Zap className="w-5 h-5 text-primary mb-1" />
                <p className="text-3xl font-black text-primary leading-none">{user.ecoPoints.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">eco-points</p>
              </div>

              {/* Current tier */}
              <div className={`flex flex-col items-center justify-center px-8 py-5 rounded-2xl border min-w-36 text-center ${currentTier.bg} ${currentTier.border}`}>
                <span className="text-2xl mb-1">{currentTier.emoji}</span>
                <p className={`text-sm font-black leading-none ${currentTier.text}`}>{currentTier.name}</p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">current tier</p>
              </div>

              {/* Scans */}
              <div className="flex flex-col items-center justify-center px-8 py-5 rounded-2xl bg-secondary/30 border border-border min-w-36 text-center">
                <Scan className="w-5 h-5 text-muted-foreground mb-1" />
                <p className="text-3xl font-black text-foreground leading-none">{user.scanCount ?? 0}</p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">total scans</p>
              </div>

              {/* Recycled */}
              <div className="flex flex-col items-center justify-center px-8 py-5 rounded-2xl bg-secondary/30 border border-border min-w-36 text-center">
                <Recycle className="w-5 h-5 text-muted-foreground mb-1" />
                <p className="text-3xl font-black text-foreground leading-none">{user.recycledCount ?? 0}</p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">recycled</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 space-y-10">

        {/* ── Tier journey ────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-foreground">Tier Journey</h2>
            {nextTier && (
              <span className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{ptsToNext.toLocaleString()} pts</span> to {nextTier.emoji} {nextTier.name}
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="relative mb-8">
            <div className="h-3 bg-border rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
                style={{ width: `${((safeTierIdx / (TIERS.length - 1)) + (progressPct / 100) / (TIERS.length - 1)) * 100}%` }}
              />
            </div>
            {/* Tier markers */}
            <div className="flex justify-between mt-2">
              {TIERS.map((t) => (
                <span key={t.name} className="text-xs text-muted-foreground" style={{ fontSize: '10px' }}>
                  {t.points === 0 ? '0' : `${t.points >= 1000 ? `${t.points / 1000}k` : t.points}`}
                </span>
              ))}
            </div>
          </div>

          {/* Tier cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {TIERS.map((tier, i) => {
              const isActive = i === safeTierIdx;
              const isUnlocked = user.ecoPoints >= tier.points;
              return (
                <div
                  key={tier.name}
                  className={`relative rounded-2xl border p-5 transition-all duration-200 ${
                    isActive
                      ? `${tier.bg} ${tier.border} ring-2 ring-offset-2 ring-offset-background ${tier.border.replace('border-', 'ring-')}`
                      : isUnlocked
                      ? 'bg-card border-border'
                      : 'bg-secondary/20 border-border opacity-60'
                  }`}
                >
                  {isActive && (
                    <span className={`absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs font-bold px-2.5 py-0.5 rounded-full ${tier.bg} ${tier.text} border ${tier.border}`}>
                      You
                    </span>
                  )}
                  <div className="text-3xl mb-3">{tier.emoji}</div>
                  <p className="text-sm font-bold text-foreground mb-0.5">{tier.name}</p>
                  <p className="text-xs text-muted-foreground mb-3">{tier.points.toLocaleString()} pts</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tier.benefit}</p>
                  {!isUnlocked && (
                    <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                      <Lock className="w-3 h-3" /> Locked
                    </div>
                  )}
                  {isUnlocked && !isActive && (
                    <div className="mt-3 text-xs font-semibold text-primary">✓ Unlocked</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── How to earn + CTA row ────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {EARN_WAYS.map(({ icon: Icon, label, points, suffix, desc }) => (
            <Card key={label} className="p-6 border-border flex items-start gap-4 hover:shadow-md transition-shadow duration-200">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-0.5">{label}</p>
                <p className="text-2xl font-black text-primary leading-none">
                  {points} <span className="text-sm font-semibold">{suffix}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">{desc}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* ── Store CTA banner ─────────────────────────────────────────── */}
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border border-primary/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-base font-bold text-foreground">Ready to spend your points?</p>
              <p className="text-sm text-muted-foreground">Browse eco-friendly products in the store.</p>
            </div>
          </div>
          <Link
            href="/store"
            className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
          >
            Go to Store <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ── Points history ───────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Clock className="w-4.5 h-4.5 text-muted-foreground" /> Points History
            </h2>
            {transactions.length > 0 && (
              <span className="text-xs text-muted-foreground">{transactions.length} transactions</span>
            )}
          </div>

          <Card className="border-border overflow-hidden">
            {txLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <div className="w-14 h-14 rounded-2xl bg-secondary/30 flex items-center justify-center mb-4">
                  <Star className="w-7 h-7 text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold text-foreground mb-1">No transactions yet</p>
                <p className="text-xs text-muted-foreground mb-5">Start scanning e-waste to earn your first points.</p>
                <Link href="/" className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                  Go to Scanner <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {transactions.map((tx: any) => (
                  <div key={tx._id} className="flex items-center gap-4 px-5 py-4 hover:bg-secondary/10 transition-colors duration-100">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${tx.points > 0 ? 'bg-primary/10' : 'bg-destructive/10'}`}>
                      {ACTION_ICON[tx.action] ?? <Zap className="w-4 h-4 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{tx.description}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(tx.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <span className={`text-sm font-bold flex-shrink-0 ${tx.points > 0 ? 'text-primary' : 'text-destructive'}`}>
                      {tx.points > 0 ? '+' : ''}{tx.points} pts
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

      </div>
    </main>
  );
}
