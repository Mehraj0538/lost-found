'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Card } from '@/components/ui/card';
import { Leaf, Zap, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

const perks = [
  'Earn eco-points for every scan & recycle',
  'Unlock the eco-friendly store at 100 pts',
  'Track your environmental impact',
  'Get 25 welcome points instantly',
];

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      router.push('/rewards');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex items-center justify-center px-4 py-12">
      <div className="absolute top-20 right-1/4 w-72 h-72 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-1/4 w-56 h-56 bg-accent/6 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left — perks */}
        <div className="hidden md:block animate-slide-in">
          <Link href="/" className="inline-flex items-center gap-2.5 group mb-8">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 rounded-xl bg-primary/20 group-hover:bg-primary/30 transition-colors duration-200" />
              <Leaf className="w-5 h-5 text-primary relative z-10" />
              <Zap className="w-3 h-3 text-accent absolute bottom-1 right-1 z-20" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              Eco<span className="text-primary">Sort</span>
              <span className="text-accent text-sm font-semibold ml-0.5">AI</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Start recycling smarter.</h1>
          <p className="text-muted-foreground mb-8">Create your free account and start earning eco-points for every responsible action.</p>

          <div className="space-y-3">
            {perks.map((perk) => (
              <div key={perk} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                </div>
                <p className="text-sm text-foreground">{perk}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 rounded-xl bg-primary/8 border border-primary/15">
            <p className="text-sm text-primary font-bold mb-1">🎉 Welcome Bonus</p>
            <p className="text-2xl font-black text-foreground">+25 Eco-Points</p>
            <p className="text-xs text-muted-foreground mt-1">Instantly credited when you sign up</p>
          </div>
        </div>

        {/* Right — form */}
        <div className="animate-slide-in">
          <div className="md:hidden text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute inset-0 rounded-lg bg-primary/20" />
                <Leaf className="w-4 h-4 text-primary relative z-10" />
              </div>
              <span className="font-bold text-lg text-foreground">EcoSort <span className="text-primary">AI</span></span>
            </Link>
          </div>

          <Card className="p-7 border-border shadow-xl shadow-primary/5">
            <h2 className="text-xl font-bold text-foreground mb-1">Create your account</h2>
            <p className="text-sm text-muted-foreground mb-6">Free forever. No credit card needed.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground" htmlFor="name">Full Name</label>
                <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Johnson" className="w-full px-4 py-3 rounded-lg bg-input border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200" />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground" htmlFor="reg-email">Email address</label>
                <input id="reg-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-4 py-3 rounded-lg bg-input border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200" />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground" htmlFor="reg-password">Password</label>
                <div className="relative">
                  <input id="reg-password" type={showPw ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" className="w-full px-4 py-3 pr-11 rounded-lg bg-input border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground" htmlFor="confirm">Confirm Password</label>
                <input id="confirm" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 rounded-lg bg-input border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200" />
              </div>

              {error && (
                <div className="px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive font-medium animate-fade-in">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed mt-1">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>

            <div className="mt-5 pt-5 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-primary font-semibold hover:underline">Sign in</Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
