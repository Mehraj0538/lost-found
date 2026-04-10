import Link from 'next/link';
import { Leaf, Zap, Github, Twitter, Mail, Heart } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'AI Scanner', href: '/' },
    { label: 'Recycling Centers', href: '/recycling-centers' },
    { label: 'Impact Dashboard', href: '/dashboard' },
  ],
  Learn: [
    { label: 'E-Waste Guide', href: '/guide' },
    { label: 'About EcoSort', href: '/about' },
    { label: 'How It Works', href: '/about#how-it-works' },
  ],
  Resources: [
    { label: 'Submit a Center', href: '/recycling-centers#submit' },
    { label: 'Report an Issue', href: 'mailto:support@ecosort.ai' },
    { label: 'Privacy Policy', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group mb-4">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute inset-0 rounded-lg bg-primary/20" />
                <Leaf className="w-4.5 h-4.5 text-primary relative z-10" />
                <Zap className="w-2.5 h-2.5 text-accent absolute bottom-0.5 right-0.5 z-20" />
              </div>
              <span className="font-bold text-lg tracking-tight text-foreground">
                Eco<span className="text-primary">Sort</span>
                <span className="text-accent text-sm font-semibold ml-0.5">AI</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              AI-powered e-waste classification and responsible recycling guidance for a greener planet.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-secondary/30 text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all duration-200"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-secondary/30 text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all duration-200"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="mailto:hello@ecosort.ai"
                className="p-2 rounded-lg bg-secondary/30 text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all duration-200"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-sm font-semibold text-foreground mb-4 tracking-wide uppercase">
                {group}
              </h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} EcoSort AI. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            Made with <Heart className="w-3 h-3 text-primary fill-primary" /> for the planet
          </p>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-primary">Carbon Neutral Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
