import type { Metadata } from 'next';
import { Card } from '@/components/ui/card';
import {
  Cpu, Battery, Monitor, Cable, Smartphone, HardDrive,
  Printer, Headphones, AlertTriangle, CheckCircle2, Leaf,
  ChevronDown, Info, Globe, Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'E-Waste Guide',
  description:
    'Learn everything about e-waste — what it is, why it matters, and how to dispose of electronics responsibly.',
};

const wasteTypes = [
  {
    icon: Cpu,
    name: 'Circuit Boards & Chips',
    color: 'from-green-500/10 to-emerald-500/10 border-green-500/20',
    iconColor: 'text-green-500',
    hazard: 'High',
    tip: 'Contains lead, cadmium, and beryllium. Must go to certified e-recyclers only.',
    recyclable: true,
  },
  {
    icon: Battery,
    name: 'Batteries',
    color: 'from-yellow-500/10 to-amber-500/10 border-yellow-500/20',
    iconColor: 'text-yellow-500',
    hazard: 'Very High',
    tip: 'Never dispose in regular trash. Risk of fire and toxic leakage. Use designated battery drop-offs.',
    recyclable: true,
  },
  {
    icon: Monitor,
    name: 'Screens & Displays',
    color: 'from-blue-500/10 to-cyan-500/10 border-blue-500/20',
    iconColor: 'text-blue-500',
    hazard: 'High',
    tip: 'CRT monitors contain mercury. LED/LCD screens have recyclable metals and glass.',
    recyclable: true,
  },
  {
    icon: Cable,
    name: 'Cables & Wires',
    color: 'from-purple-500/10 to-violet-500/10 border-purple-500/20',
    iconColor: 'text-purple-500',
    hazard: 'Low',
    tip: 'Copper and plastic can both be recovered. Don\'t burn — releases toxic fumes.',
    recyclable: true,
  },
  {
    icon: Smartphone,
    name: 'Smartphones & Tablets',
    color: 'from-pink-500/10 to-rose-500/10 border-pink-500/20',
    iconColor: 'text-pink-500',
    hazard: 'Medium',
    tip: 'Wipe data before recycling. Precious metals like gold and silver can be recovered.',
    recyclable: true,
  },
  {
    icon: HardDrive,
    name: 'Hard Drives & Storage',
    color: 'from-orange-500/10 to-red-500/10 border-orange-500/20',
    iconColor: 'text-orange-500',
    hazard: 'Low',
    tip: 'Physically destroy or securely wipe before recycling to protect your data.',
    recyclable: true,
  },
  {
    icon: Printer,
    name: 'Printers & Scanners',
    color: 'from-teal-500/10 to-green-500/10 border-teal-500/20',
    iconColor: 'text-teal-500',
    hazard: 'Medium',
    tip: 'Remove ink cartridges separately — many stores accept them for refill/recycling.',
    recyclable: true,
  },
  {
    icon: Headphones,
    name: 'Audio Electronics',
    color: 'from-indigo-500/10 to-blue-500/10 border-indigo-500/20',
    iconColor: 'text-indigo-500',
    hazard: 'Low',
    tip: 'Contains small amounts of precious metals. Include in general e-waste collections.',
    recyclable: true,
  },
];

const steps = [
  {
    number: '01',
    title: 'Identify Your Device',
    desc: 'Use our AI scanner to classify your e-waste by type and assess damage.',
    icon: Cpu,
  },
  {
    number: '02',
    title: 'Prepare for Drop-off',
    desc: 'Wipe personal data, remove batteries if possible, and bag items safely.',
    icon: CheckCircle2,
  },
  {
    number: '03',
    title: 'Find a Center',
    desc: 'Use our directory to locate a certified recycling center near you.',
    icon: Leaf,
  },
];

const faqs = [
  {
    q: 'What exactly is e-waste?',
    a: 'E-waste (electronic waste) refers to any discarded electronic device or component — from smartphones and laptops to batteries, cables, and circuit boards. It is one of the fastest-growing waste streams globally.',
  },
  {
    q: 'Why can\'t I just throw electronics in the trash?',
    a: 'Electronics contain hazardous substances like lead, mercury, cadmium, and flame retardants. When landfilled, these toxins leach into soil and groundwater, causing serious environmental and health damage.',
  },
  {
    q: 'Is all e-waste recyclable?',
    a: 'About 80% of e-waste can be recycled and valuable materials recovered. Precious metals (gold, silver, copper, palladium) are extracted and reused in new products, reducing mining demand.',
  },
  {
    q: 'Do I need to wipe my device before recycling?',
    a: 'Yes — always perform a factory reset and remove SIM/SD cards before recycling smartphones or computers. For hard drives, use a certified data destruction service or physically damage the platters.',
  },
  {
    q: 'How does EcoSort AI help with e-waste management?',
    a: 'EcoSort AI classifies your e-waste from a photo, assessing type and damage level. It then provides disposal recommendations and links you to certified recycling centers in your area.',
  },
];

const globalStats = [
  { value: '62M', label: 'Tonnes of e-waste generated globally per year', icon: Globe },
  { value: '17%', label: 'Of e-waste properly recycled worldwide in 2023', icon: Recycle },
  { value: '$62B', label: 'Worth of raw materials lost annually to landfills', icon: Zap },
  { value: '800+', label: 'Toxic substances found in e-waste', icon: AlertTriangle },
];

function Recycle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-2.16l2.36-8.42A2 2 0 0 1 7.54 7h8.92a2 2 0 0 1 1.93 1.42L20.75 17A1.83 1.83 0 0 1 19.185 19H17" />
      <path d="M7 15h10" />
      <path d="m17 19-2 2 2 2" />
      <path d="m7 19 2 2-2 2" />
    </svg>
  );
}

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-card/30">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/7 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="animate-slide-in max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
              <BookOpenIcon className="w-3.5 h-3.5" />
              Knowledge Base
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
              The E-Waste Guide
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Everything you need to know about electronic waste — from identification and hazards
              to responsible disposal and recycling. Make informed choices for a healthier planet.
            </p>
          </div>
        </div>
      </section>

      {/* Global Impact Stats */}
      <section className="bg-primary/5 border-b border-border py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6 text-center">
            The Global E-Waste Crisis
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {globalStats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors duration-200">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-3xl font-bold text-primary mb-1">{value}</p>
                <p className="text-xs text-muted-foreground leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Dispose */}
      <section className="container mx-auto px-4 py-14">
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">How to Dispose Responsibly</h2>
          <p className="text-muted-foreground">Follow these 3 steps to recycle your electronics safely.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map(({ number, title, desc, icon: Icon }) => (
            <div key={number} className="relative">
              <Card className="p-6 h-full border-border hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-primary/60 tracking-widest">{number}</span>
                    <h3 className="text-base font-bold text-foreground mt-0.5 mb-2">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              </Card>
              {/* Connector arrow (hidden on last) */}
            </div>
          ))}
        </div>
      </section>

      {/* E-Waste Types */}
      <section className="bg-secondary/10 border-y border-border py-14">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Types of E-Waste</h2>
            <p className="text-muted-foreground">Understand hazard levels and proper handling for each type.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {wasteTypes.map(({ icon: Icon, name, color, iconColor, hazard, tip, recyclable }) => (
              <Card
                key={name}
                className={`p-5 border bg-gradient-to-br ${color} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-background/60 flex items-center justify-center ${iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${hazard === 'Very High'
                        ? 'bg-destructive/15 text-destructive'
                        : hazard === 'High'
                          ? 'bg-orange-500/15 text-orange-500'
                          : hazard === 'Medium'
                            ? 'bg-yellow-500/15 text-yellow-600'
                            : 'bg-green-500/15 text-green-600'
                        }`}
                    >
                      {hazard} Risk
                    </span>
                    {recyclable && (
                      <span className="text-xs font-medium text-primary flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Recyclable
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="text-sm font-bold text-foreground mb-2">{name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{tip}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-14">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Common questions about e-waste and responsible disposal.</p>
          </div>
          <div className="space-y-3">
            {faqs.map(({ q, a }, i) => (
              <details
                key={i}
                className="group border border-border rounded-xl overflow-hidden bg-card"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-secondary/20 transition-colors duration-150">
                  <div className="flex items-start gap-3">
                    <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-semibold text-foreground">{q}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 group-open:rotate-180 transition-transform duration-200" />
                </summary>
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="container mx-auto px-4 pb-14">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 to-accent/10 border border-primary/20 p-8 md:p-12 text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Ready to recycle your e-waste?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Use our AI scanner to identify your items, then find a certified drop-off near you.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="/"
                className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
              >
                Scan My Device
              </a>
              <a
                href="/recycling-centers"
                className="px-6 py-3 rounded-full border border-border text-foreground font-semibold text-sm hover:bg-secondary/30 transition-all duration-200"
              >
                Find Centers
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function BookOpenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
