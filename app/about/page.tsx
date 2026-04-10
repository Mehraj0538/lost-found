import type { Metadata } from 'next';
import { Card } from '@/components/ui/card';
import {
  Cpu, Leaf, Zap, Globe, Shield, Upload, Scan, CheckCircle2,
  Brain, Code2, Database, BarChart3, ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about EcoSort AI — our mission, how the AI works, and the technology behind intelligent e-waste classification.',
};

const howItWorks = [
  {
    step: '01',
    icon: Upload,
    title: 'Upload or Capture',
    desc: 'Take a photo of your electronic waste or upload one from your device. Any angle works — our AI handles it.',
  },
  {
    step: '02',
    icon: Scan,
    title: 'AI Analysis',
    desc: 'Our deep learning model classifies the waste type, assesses damage level, and generates a confidence score in seconds.',
  },
  {
    step: '03',
    icon: CheckCircle2,
    title: 'Responsible Action',
    desc: 'Receive tailored disposal recommendations and locate the nearest certified recycling center to drop off your item.',
  },
];

const techStack = [
  { name: 'Next.js 16', desc: 'React framework for the web app', icon: Code2 },
  { name: 'TensorFlow.js', desc: 'In-browser ML model inference', icon: Brain },
  { name: 'Recharts', desc: 'Impact data visualization', icon: BarChart3 },
  { name: 'Radix UI', desc: 'Accessible UI primitives', icon: Shield },
  { name: 'Vercel', desc: 'Edge deployment & analytics', icon: Globe },
  { name: 'LocalStorage', desc: 'Client-side history persistence', icon: Database },
];

const values = [
  {
    icon: Leaf,
    title: 'Sustainability First',
    desc: 'Every feature we build is designed to reduce environmental harm and promote circular economy principles.',
  },
  {
    icon: Brain,
    title: 'Accessible Intelligence',
    desc: 'Our AI runs entirely in your browser — no server uploads, no privacy concerns, no internet dependency for core features.',
  },
  {
    icon: Shield,
    title: 'Privacy by Design',
    desc: 'Your images are never stored on our servers. Analysis is local-first. Your data stays yours.',
  },
  {
    icon: Globe,
    title: 'Global Impact',
    desc: 'We partner with certified recyclers across cities to ensure every scan leads to real-world responsible disposal.',
  },
];

const impactNumbers = [
  { value: '50M+', label: 'Tonnes of e-waste generated yearly in Asia', icon: Globe },
  { value: '80%', label: 'Of e-waste components can be recovered and reused', icon: Zap },
  { value: '1 ton', label: 'Of circuit boards yields 250g of gold vs. 5g from ore', icon: Cpu },
  { value: '3x', label: 'Faster identification with AI vs. manual sorting', icon: Brain },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-card/30">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="max-w-3xl animate-slide-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
              <Leaf className="w-3.5 h-3.5" />
              Our Mission
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight mb-5">
              Technology for a
              <span className="text-primary"> Greener Future</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              EcoSort AI was built to solve one of the most underappreciated environmental crises of our time:
              the global e-waste epidemic. We combine artificial intelligence with accessible design to help
              individuals and organizations responsibly manage electronic waste — one scan at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Impact numbers */}
      <section className="bg-primary/5 border-b border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactNumbers.map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center group">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors duration-200">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-3xl font-bold text-primary mb-1">{value}</p>
                <p className="text-xs text-muted-foreground leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto px-4 py-16">
        <div className="max-w-xl mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">How EcoSort AI Works</h2>
          <p className="text-muted-foreground">
            From photo to recycling action in three simple steps.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {howItWorks.map(({ step, icon: Icon, title, desc }, i) => (
            <div key={step} className="relative flex gap-5 md:flex-col md:gap-0">
              <Card className="p-6 w-full border-border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-3xl font-black text-primary/20">{step}</span>
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </Card>
              {/* Arrow connector */}
              {i < howItWorks.length - 1 && (
                <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-background border border-border rounded-full items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-secondary/10 border-y border-border py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Our Values</h2>
            <p className="text-muted-foreground">The principles that guide every decision we make.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="p-6 border-border hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex gap-5">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground mb-1.5">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-xl mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Built With</h2>
          <p className="text-muted-foreground">
            Modern, open technologies that prioritize performance and privacy.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {techStack.map(({ name, desc, icon: Icon }) => (
            <Card key={name} className="p-4 border-border hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-center group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors duration-200">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs font-bold text-foreground mb-1">{name}</p>
              <p className="text-xs text-muted-foreground leading-snug">{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-16">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-accent p-8 md:p-14 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
              Join the Movement
            </h2>
            <p className="text-primary-foreground/80 mb-7 max-w-md mx-auto text-sm leading-relaxed">
              Every responsible disposal decision adds up. Start scanning and tracking your impact today — it only takes a photo.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/"
                className="px-7 py-3 rounded-full bg-white text-primary font-bold text-sm hover:bg-white/90 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
              >
                Scan Now
              </Link>
              <Link
                href="/guide"
                className="px-7 py-3 rounded-full border-2 border-white/40 text-white font-semibold text-sm hover:bg-white/10 transition-all duration-200"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
