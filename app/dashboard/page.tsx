'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  Cpu, Leaf, TrendingUp, Clock, Trash2, BarChart2,
  Activity, Award, AlertTriangle,
} from 'lucide-react';

interface Prediction {
  id: string;
  timestamp: number;
  imageUrl: string;
  wasteType: string;
  confidence: number;
  damageLevel?: string;
  recommendation: string;
}

const WASTE_COLORS: Record<string, string> = {
  E_Waste: 'oklch(0.51 0.191 142.49)',
  Plastic:  'oklch(0.65 0.13 142.49)',
  Metal:    'oklch(0.78 0.067 142.49)',
  Glass:    'oklch(0.45 0.15 142.49)',
};
const WASTE_COLORS_ARRAY = Object.values(WASTE_COLORS);

const DAMAGE_COLORS: Record<string, string> = {
  Severe:   'oklch(0.577 0.245 27.325)',
  Moderate: 'oklch(0.65 0.13 142.49)',
  Slight:   'oklch(0.51 0.191 142.49)',
  None:     'oklch(0.78 0.067 142.49)',
};

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('en-IN', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-lg">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} style={{ color: entry.color }} className="font-medium">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function DashboardPage() {
  const [history, setHistory] = useState<Prediction[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ecosort-history');
    if (saved) setHistory(JSON.parse(saved));
    setMounted(true);
  }, []);

  const stats = useMemo(() => {
    if (!history.length) return null;

    const typeCounts = history.reduce<Record<string, number>>((acc, p) => {
      acc[p.wasteType] = (acc[p.wasteType] || 0) + 1;
      return acc;
    }, {});

    const damageCounts = history.reduce<Record<string, number>>((acc, p) => {
      const key = p.damageLevel || 'None';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const totalConfidence = history.reduce((s, p) => s + p.confidence, 0);
    const avgConfidence = totalConfidence / history.length;

    const mostCommon = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];

    const pieData = Object.entries(typeCounts).map(([name, value]) => ({ name: name.replace('_', ' '), value }));
    const barData = Object.entries(typeCounts).map(([name, value]) => ({ name: name.replace('_', ' '), count: value }));
    const damageData = Object.entries(damageCounts).map(([name, value]) => ({ name, value }));

    return { typeCounts, damageCounts, avgConfidence, mostCommon, pieData, barData, damageData };
  }, [history]);

  const handleClearHistory = () => {
    if (window.confirm('Clear all scan history?')) {
      localStorage.removeItem('ecosort-history');
      setHistory([]);
    }
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <span className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
          Loading dashboard...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-border bg-card/30">
        <div className="absolute -top-20 right-0 w-72 h-72 bg-primary/7 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-slide-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
              <Activity className="w-3.5 h-3.5" />
              Personal Impact Report
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-3">
              Impact Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Track your e-waste scans, material breakdown, and environmental contribution.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {history.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-28 text-center animate-fade-in">
            <div className="w-20 h-20 rounded-3xl bg-secondary/30 flex items-center justify-center mb-5">
              <BarChart2 className="w-9 h-9 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">No scan history yet</h2>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
              Use the AI Scanner to analyze e-waste items. Your scan history and impact metrics will appear here.
            </p>
            <a
              href="/"
              className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
            >
              Start Scanning
            </a>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-slide-in">
              <Card className="p-5 border-border">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Cpu className="w-4.5 h-4.5 text-primary" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-foreground">{history.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Total Scans</p>
              </Card>

              <Card className="p-5 border-border">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Award className="w-4.5 h-4.5 text-accent" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {(stats!.avgConfidence * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">Avg Confidence</p>
              </Card>

              <Card className="p-5 border-border">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-4.5 h-4.5 text-primary" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground truncate">
                  {stats!.mostCommon[0].replace('_', ' ')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Most Common Type</p>
              </Card>

              <Card className="p-5 border-border bg-primary/5 border-primary/20">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
                    <Leaf className="w-4.5 h-4.5 text-primary" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-primary">{history.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Items Responsibly Tracked</p>
              </Card>
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Bar chart */}
              <Card className="p-6 border-border">
                <h2 className="text-base font-bold text-foreground mb-4">Waste Type Breakdown</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stats!.barData} barSize={36}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Scans" radius={[6, 6, 0, 0]}>
                      {stats!.barData.map((_, i) => (
                        <Cell key={i} fill={WASTE_COLORS_ARRAY[i % WASTE_COLORS_ARRAY.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Pie chart */}
              <Card className="p-6 border-border">
                <h2 className="text-base font-bold text-foreground mb-4">Distribution</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={stats!.pieData}
                      cx="50%" cy="50%"
                      innerRadius={55} outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {stats!.pieData.map((_, i) => (
                        <Cell key={i} fill={WASTE_COLORS_ARRAY[i % WASTE_COLORS_ARRAY.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: '11px', color: 'var(--muted-foreground)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Damage assessment chart */}
            <Card className="p-6 border-border mb-8">
              <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-accent" />
                Damage Level Distribution
              </h2>
              <div className="flex flex-wrap gap-4">
                {stats!.damageData.map(({ name, value }) => {
                  const pct = Math.round((value / history.length) * 100);
                  return (
                    <div key={name} className="flex-1 min-w-32">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-foreground">{name}</span>
                        <span className="text-xs text-muted-foreground">{value} ({pct}%)</span>
                      </div>
                      <div className="h-2.5 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            background: DAMAGE_COLORS[name] || 'var(--primary)',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Full History Table */}
            <Card className="border-border overflow-hidden">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  Scan History
                </h2>
                <button
                  onClick={handleClearHistory}
                  className="flex items-center gap-1.5 text-xs text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-lg transition-colors duration-150"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/20">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">#</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Waste Type</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Confidence</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Damage</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {history.map((p, i) => (
                      <tr key={p.id} className="hover:bg-secondary/10 transition-colors duration-100">
                        <td className="px-5 py-3 text-xs text-muted-foreground">{i + 1}</td>
                        <td className="px-5 py-3">
                          <span className="inline-flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ background: WASTE_COLORS[p.wasteType] || 'var(--primary)' }} />
                            <span className="font-medium text-foreground text-xs">{p.wasteType.replace('_', ' ')}</span>
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${p.confidence * 100}%`, background: 'var(--primary)' }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">{(p.confidence * 100).toFixed(0)}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          {p.damageLevel ? (
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                p.damageLevel === 'Severe'
                                  ? 'bg-destructive/10 text-destructive'
                                  : p.damageLevel === 'Moderate'
                                  ? 'bg-yellow-500/10 text-yellow-600'
                                  : 'bg-primary/10 text-primary'
                              }`}
                            >
                              {p.damageLevel}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-xs text-muted-foreground">{formatDate(p.timestamp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}
