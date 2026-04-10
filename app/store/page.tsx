'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/auth-context';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import {
  ShoppingBag, Leaf, Lock, CheckCircle2, Loader2, Star,
  Filter, Zap, ChevronRight, X, Trophy,
} from 'lucide-react';

const TIER_ORDER = ['Seedling', 'Green', 'EcoWarrior', 'EarthChampion', 'PlanetGuardian'];
const TIER_THRESHOLDS: Record<string, number> = { Seedling: 0, Green: 100, EcoWarrior: 500, EarthChampion: 1000, PlanetGuardian: 2500 };
const TIER_DISCOUNTS: Record<string, number> = { Seedling: 0, Green: 0, EcoWarrior: 10, EarthChampion: 20, PlanetGuardian: 30 };
const CATEGORIES = ['All', 'Home', 'Tech', 'Apparel', 'Wellness'];

interface StoreItem {
  _id: string;
  name: string;
  description: string;
  ecoBenefit: string;
  category: string;
  pointsCost: number;
  tierRequired: string;
  stock: number;
  emoji: string;
  featured: boolean;
  exclusive: boolean;
}

export default function StorePage() {
  const { user, refreshUser } = useAuth();
  const [items, setItems] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [recentlyRedeemed, setRecentlyRedeemed] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('/api/store/items')
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .finally(() => setLoading(false));
  }, []);

  const discount = user ? TIER_DISCOUNTS[user.tier] ?? 0 : 0;
  const userTierLevel = user ? TIER_THRESHOLDS[user.tier] ?? 0 : 0;

  const filtered = useMemo(() =>
    items.filter((i) => category === 'All' || i.category === category),
    [items, category]
  );

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  };

  const handleRedeem = async (item: StoreItem) => {
    if (!user) { showToast('Sign in to redeem items', false); return; }
    setRedeeming(item._id);
    try {
      const res = await fetch('/api/store/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item._id }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Redemption failed', false);
      } else {
        setRecentlyRedeemed((prev) => new Set([...prev, item._id]));
        showToast(`🎉 "${item.name}" redeemed for ${data.pointsSpent} pts!`, true);
        // Refresh user points/tier without full page reload
        await refreshUser();
      }
    } catch {
      showToast('Network error — please try again', false);
    } finally {
      setRedeeming(null);
    }
  };

  const getItemState = (item: StoreItem) => {
    if (!user) return 'locked-auth';
    const requiredLevel = TIER_THRESHOLDS[item.tierRequired] ?? 0;
    if (userTierLevel < requiredLevel) return 'locked-tier';
    const finalCost = Math.round(item.pointsCost * (1 - discount / 100));
    if (user.ecoPoints < finalCost) return 'insufficient';
    return 'available';
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border animate-slide-in ${toast.ok ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-destructive/10 border-destructive/30 text-destructive'}`}>
          <span className="text-sm font-semibold">{toast.msg}</span>
          <button onClick={() => setToast(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-card/30">
        <div className="absolute -top-20 right-0 w-80 h-80 bg-primary/7 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="animate-slide-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
                <ShoppingBag className="w-3.5 h-3.5" /> Eco-Friendly Store
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-2">Eco Store</h1>
              <p className="text-muted-foreground">Spend your eco-points on sustainable products. Every purchase supports the planet.</p>
            </div>

            {/* User balance widget */}
            {user ? (
              <Card className="flex-shrink-0 p-5 bg-primary/5 border-primary/20 min-w-52">
                <p className="text-xs text-muted-foreground mb-1">Your Balance</p>
                <p className="text-2xl font-black text-primary">{user.ecoPoints.toLocaleString()} <span className="text-sm font-semibold">pts</span></p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">Tier: <span className="font-semibold text-foreground">{user.tier.replace(/([A-Z])/g, ' $1').trim()}</span></span>
                  {discount > 0 && <span className="text-xs font-bold text-primary">{discount}% off</span>}
                </div>
                <Link href="/rewards" className="flex items-center gap-1 text-xs text-primary mt-3 hover:underline font-medium">
                  <Trophy className="w-3 h-3" /> View Rewards <ChevronRight className="w-3 h-3" />
                </Link>
              </Card>
            ) : (
              <Card className="flex-shrink-0 p-5 border-border text-center min-w-48">
                <Lock className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-semibold text-foreground mb-3">Sign in to redeem items</p>
                <Link href="/auth/login" className="text-xs font-semibold text-primary hover:underline">Sign In</Link>
              </Card>
            )}
          </div>

          {/* Store notice for locked users */}
          {user && user.tier === 'Seedling' && (
            <div className="mt-6 flex items-center gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <Star className="w-4 h-4 text-yellow-600 flex-shrink-0" />
              <p className="text-sm text-yellow-700 dark:text-yellow-500">
                <span className="font-bold">Store unlocks at 100 pts (Green tier).</span> You have {user.ecoPoints} pts — only {100 - user.ecoPoints} more needed! Scan and recycle items to earn points.
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Category filters */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${category === cat ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((item) => {
              const state = getItemState(item);
              const finalCost = user ? Math.round(item.pointsCost * (1 - discount / 100)) : item.pointsCost;
              const isLocked = state === 'locked-auth' || state === 'locked-tier';
              const isRedeemed = recentlyRedeemed.has(item._id);
              const isRedeeming = redeeming === item._id;

              return (
                <Card
                  key={item._id}
                  className={`overflow-hidden border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${isLocked ? 'opacity-75' : ''} ${item.featured ? 'ring-1 ring-primary/30' : ''}`}
                >
                  {/* Image/emoji area */}
                  <div className={`relative h-36 flex items-center justify-center text-5xl ${isLocked ? 'bg-secondary/30 grayscale' : 'bg-gradient-to-br from-primary/8 to-accent/8'}`}>
                    {item.emoji}
                    {item.featured && !isLocked && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-current" /> Featured
                      </span>
                    )}
                    {item.exclusive && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-500 border border-purple-500/30 text-xs font-bold">
                        VIP
                      </span>
                    )}
                    {isLocked && (
                      <div className="absolute inset-0 bg-background/40 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    {/* Category + tier tags */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary/40 text-muted-foreground">{item.category}</span>
                      {item.tierRequired !== 'Green' && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {item.tierRequired.replace(/([A-Z])/g, ' $1').trim()}+
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-foreground mb-1.5">{item.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">{item.description}</p>

                    {/* Eco benefit */}
                    <div className="flex items-start gap-1.5 mb-4">
                      <Leaf className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-primary/80 leading-relaxed">{item.ecoBenefit}</p>
                    </div>

                    {/* Price + action */}
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-black text-primary">{finalCost.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground">pts</span>
                        </div>
                        {discount > 0 && (
                          <p className="text-xs text-muted-foreground line-through">{item.pointsCost.toLocaleString()} pts</p>
                        )}
                      </div>

                      {isRedeemed ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Redeemed
                        </div>
                      ) : isLocked ? (
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          {state === 'locked-tier'
                            ? `Need ${item.tierRequired.replace(/([A-Z])/g, ' $1').trim()}`
                            : 'Sign in'}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleRedeem(item)}
                          disabled={isRedeeming || state === 'insufficient'}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                            state === 'insufficient'
                              ? 'bg-secondary/30 text-muted-foreground cursor-not-allowed'
                              : 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95'
                          }`}
                        >
                          {isRedeeming ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                          {state === 'insufficient' ? 'Need more pts' : 'Redeem'}
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
