'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import UploadBox from '@/components/upload-box';
import ImagePreview from '@/components/image-preview';
import ResultsCard from '@/components/results-card';
import HistoryPanel from '@/components/history-panel';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import {
  ArrowRight, Cpu, MapPin, BookOpen, BarChart3,
  Recycle, CheckCircle2, Leaf, X, Loader2,
} from 'lucide-react';

interface Prediction {
  id: string;
  dbId?: string; // MongoDB _id for eco-points API
  timestamp: number;
  imageUrl: string;
  wasteType: string;
  confidence: number;
  damageLevel?: string;
  recommendation: string;
  recycled?: boolean;
}

const features = [
  { icon: Cpu, title: 'AI Classification', desc: 'Instantly identify e-waste type and condition', href: '/' },
  { icon: MapPin, title: 'Recycling Centers', desc: 'Find certified drop-off points near you', href: '/recycling-centers' },
  { icon: BookOpen, title: 'E-Waste Guide', desc: 'Learn responsible disposal practices', href: '/guide' },
  { icon: BarChart3, title: 'Impact Dashboard', desc: 'Track your recycling history & metrics', href: '/dashboard' },
];

const recommendations: Record<string, string> = {
  E_Waste: 'Send to a certified e-waste recycling facility. This item contains hazardous materials that must not go to landfill.',
  Battery: 'Do NOT dispose in regular trash. Take to a battery collection point — most electronics stores and supermarkets accept them.',
  General_Recyclable: 'This item can go into your general recycling bin. Clean it before recycling to avoid contamination.',
  Non_Recyclable: 'This item cannot be recycled through standard programs. Check for specialist waste disposal routes in your area.',
};


export default function Home() {
  const { user, awardPoints } = useAuth();
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modelStatus, setModelStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [history, setHistory] = useState<Prediction[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [recycleLoading, setRecycleLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('ecosort-history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  };

  const handleImageSelect = (imageUrl: string) => {
    setCurrentImage(imageUrl);
    setPrediction(null);
  };

  const handleAnalyze = async () => {
    if (!currentImage) return;
    setIsLoading(true);
    try {
      // ── Real TensorFlow.js inference ──────────────────────────────────────
      let result: { wasteType: string; confidence: number; damageLevel?: string };

      try {
        if (modelStatus !== 'ready') setModelStatus('loading');
        const { runFullPrediction } = await import('@/lib/ml-utils');
        result = await runFullPrediction(currentImage);
        setModelStatus('ready');
      } catch (mlErr: any) {
        console.error('[ML] Inference failed:', mlErr);
        setModelStatus('error');
        showToast(mlErr.message || 'AI analysis failed. Please try a different image.', false);
        return;
      }

      // Map model class keys to recommendation keys
      const recKey =
        result.wasteType === 'Battery' ? 'Battery' :
        result.wasteType === 'General_Recyclable' ? 'General_Recyclable' :
        result.wasteType === 'Non_Recyclable' ? 'Non_Recyclable' :
        result.wasteType; // E_Waste stays as-is

      const newPrediction: Prediction = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        imageUrl: currentImage,
        wasteType: result.wasteType,
        confidence: result.confidence,
        damageLevel: result.damageLevel,
        recommendation: recommendations[recKey] ?? recommendations['E_Waste'],
        recycled: false,
      };

      const apiRes = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wasteType: newPrediction.wasteType,
          confidence: newPrediction.confidence,
          damageLevel: newPrediction.damageLevel,
          recommendation: newPrediction.recommendation,
        }),
      }).catch(() => null);

      if (apiRes?.ok) {
        const apiData = await apiRes.json();
        newPrediction.dbId = apiData.id;
      }

      setPrediction(newPrediction);
      const updated = [newPrediction, ...history].slice(0, 20);
      setHistory(updated);
      localStorage.setItem('ecosort-history', JSON.stringify(updated));

      // Award scan points if logged in
      if (user) {
        try {
          const pts = await awardPoints('scan', newPrediction.wasteType);
          if (pts.pointsAwarded) {
            showToast(`+${pts.pointsAwarded} eco-points for scanning!`, true);
          }
        } catch {
          // Points award failure shouldn't block the scan result
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkRecycled = async () => {
    if (!prediction) return;

    if (!user) {
      showToast('Sign in to earn eco-points for recycling!', false);
      return;
    }

    if (prediction.recycled) {
      showToast('Already marked as recycled!', false);
      return;
    }

    setRecycleLoading(true);
    try {
      const result = await awardPoints('recycle', prediction.wasteType, prediction.dbId);
      if (result.error) {
        showToast(result.error, false);
      } else {
        const updated = { ...prediction, recycled: true };
        setPrediction(updated);
        // Update in history
        const updatedHistory = history.map((p) =>
          p.id === prediction.id ? updated : p
        );
        setHistory(updatedHistory);
        localStorage.setItem('ecosort-history', JSON.stringify(updatedHistory));
        showToast(`🌿 +${result.pointsAwarded} eco-points earned for recycling!`, true);
      }
    } finally {
      setRecycleLoading(false);
    }
  };

  const handleClear = () => {
    setCurrentImage(null);
    setPrediction(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl border animate-slide-in max-w-sm ${toast.ok ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-orange-500/10 border-orange-500/30 text-orange-600'}`}>
          <span className="text-sm font-semibold">{toast.msg}</span>
          <button onClick={() => setToast(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Hero — always visible */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-16 right-0 w-80 h-80 bg-accent/6 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl animate-slide-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              AI-Powered E-Waste Analysis
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight leading-tight mb-5">
              Sort E-Waste
              <span className="block text-primary">Intelligently.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed mb-8">
              Upload a photo of any electronic waste and our AI instantly classifies it,
              assesses damage, and gives you responsible disposal guidance.
              {!user && <span className="text-primary font-semibold"> Sign up to earn eco-points!</span>}
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => document.getElementById('scanner-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 active:scale-95"
              >
                Start Scanning <ArrowRight className="w-4 h-4" />
              </button>
              <Link href="/recycling-centers" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-foreground font-semibold text-sm hover:bg-secondary/30 transition-all duration-200">
                <MapPin className="w-4 h-4 text-primary" /> Find Centers
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div id="scanner-section" className="container mx-auto px-4 py-10">
        {/* Feature cards — always visible */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 animate-slide-in">
          {features.map(({ icon: Icon, title, desc, href }) => (
            <Link key={title} href={href}>
              <Card className="p-4 h-full hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer border-border group">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors duration-200">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
                <p className="text-xs text-muted-foreground leading-snug">{desc}</p>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Fixed-height scanner area — upload box or image preview */}
            <div className="h-[28rem]">
              {!currentImage ? (
                <div className="animate-slide-in h-full">
                  <UploadBox onImageSelect={handleImageSelect} />
                </div>
              ) : (
                <div className="animate-fade-in h-full">
                  <ImagePreview imageUrl={currentImage} />
                </div>
              )}
            </div>

            {/* Analyze / Clear buttons — shown once image is selected */}
            {currentImage && (
              <div className="flex gap-4">
                <Button
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-semibold"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                      {modelStatus === 'loading' ? 'Loading AI Model…' : 'Running AI Analysis…'}
                    </span>
                  ) : 'Analyze Image'}
                </Button>
                <Button onClick={handleClear} variant="outline" className="flex-1 h-12 font-semibold hover:bg-secondary/20">
                  Clear
                </Button>
              </div>
            )}


            {prediction && (
              <div className="animate-slide-in space-y-4">
                <ResultsCard prediction={prediction} />

                {/* Mark as Recycled CTA */}
                {!prediction.recycled ? (
                  <Card className="p-5 border-primary/20 bg-gradient-to-r from-primary/8 to-accent/5">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                          <Recycle className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">Did you recycle this item?</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {user
                              ? `Earn up to +150 eco-points for responsibly recycling ${prediction.wasteType.replace('_', ' ')}.`
                              : 'Sign in to earn eco-points for recycling actions.'}
                          </p>
                        </div>
                      </div>
                      {user ? (
                        <button
                          onClick={handleMarkRecycled}
                          disabled={recycleLoading}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 active:scale-95 disabled:opacity-60"
                        >
                          {recycleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Leaf className="w-4 h-4" />}
                          Mark as Recycled
                        </button>
                      ) : (
                        <Link href="/auth/register" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all duration-200">
                          <ArrowRight className="w-4 h-4" /> Sign Up to Earn Points
                        </Link>
                      )}
                    </div>
                  </Card>
                ) : (
                  <Card className="p-5 border-primary/30 bg-primary/8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-primary">Recycled & Points Earned! 🌿</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Thank you for recycling responsibly. Check your balance in Rewards.</p>
                      </div>
                      <Link href="/rewards" className="ml-auto flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                        View Rewards <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <HistoryPanel
              history={history}
              isOpen={showHistory}
              onToggle={() => setShowHistory(!showHistory)}
              onSelectPrediction={(pred) => {
                setCurrentImage(pred.imageUrl);
                setPrediction(pred);
                setShowHistory(false);
              }}
              onClearHistory={() => setHistory([])}
            />
            {history.length > 0 && (
              <Link href="/dashboard" className="block mt-4">
                <Card className="p-4 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors duration-200 group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">View Full Dashboard</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Charts & impact metrics</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </Card>
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
