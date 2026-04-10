'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MapPin, Phone, Clock, Search, Filter,
  Recycle, Cpu, Battery, Monitor, CheckCircle2, ExternalLink, Plus,
} from 'lucide-react';

interface Center {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
  accepts: string[];
  verified: boolean;
  distance: string;
  mapsUrl: string;
}

const CENTERS: Center[] = [
  {
    id: '1', name: 'GreenTech Recyclers', address: '12 Eco Park Road', city: 'Mumbai',
    phone: '+91 98765 43210', hours: 'Mon–Sat, 9 AM – 6 PM',
    accepts: ['E-Waste', 'Batteries', 'Screens'], verified: true, distance: '1.2 km',
    mapsUrl: 'https://maps.google.com',
  },
  {
    id: '2', name: 'E-Cycle Hub', address: '45 Industrial Estate', city: 'Pune',
    phone: '+91 87654 32109', hours: 'Mon–Fri, 8 AM – 5 PM',
    accepts: ['E-Waste', 'Metals', 'Cables', 'Batteries'], verified: true, distance: '3.7 km',
    mapsUrl: 'https://maps.google.com',
  },
  {
    id: '3', name: 'EcoWaste Solutions', address: '78 Green Valley', city: 'Bangalore',
    phone: '+91 76543 21098', hours: 'Tue–Sun, 10 AM – 7 PM',
    accepts: ['Screens', 'Laptops', 'Phones'], verified: false, distance: '5.1 km',
    mapsUrl: 'https://maps.google.com',
  },
  {
    id: '4', name: 'CleanCircle India', address: '9 Tech Park Avenue', city: 'Hyderabad',
    phone: '+91 65432 10987', hours: 'Mon–Sat, 7 AM – 8 PM',
    accepts: ['E-Waste', 'Batteries', 'Metals', 'Screens', 'Cables'], verified: true, distance: '2.4 km',
    mapsUrl: 'https://maps.google.com',
  },
  {
    id: '5', name: 'Metal-X Recyclers', address: '33 Recycle Street', city: 'Chennai',
    phone: '+91 54321 09876', hours: 'Mon–Fri, 9 AM – 5 PM',
    accepts: ['Metals', 'Cables', 'Batteries'], verified: true, distance: '7.8 km',
    mapsUrl: 'https://maps.google.com',
  },
  {
    id: '6', name: 'BatteryBack', address: '21 Power Block', city: 'Delhi',
    phone: '+91 43210 98765', hours: 'Mon–Sun, 8 AM – 9 PM',
    accepts: ['Batteries'], verified: false, distance: '0.8 km',
    mapsUrl: 'https://maps.google.com',
  },
  {
    id: '7', name: 'ScreenSafe Recycling', address: '56 Display Lane', city: 'Mumbai',
    phone: '+91 32109 87654', hours: 'Wed–Mon, 10 AM – 6 PM',
    accepts: ['Screens', 'Laptops', 'Phones', 'E-Waste'], verified: true, distance: '4.3 km',
    mapsUrl: 'https://maps.google.com',
  },
  {
    id: '8', name: 'Prakruthi Eco Centre', address: '88 Nature Park', city: 'Bangalore',
    phone: '+91 21098 76543', hours: 'Mon–Sat, 9 AM – 7 PM',
    accepts: ['E-Waste', 'Metals', 'Cables', 'Phones'], verified: true, distance: '6.2 km',
    mapsUrl: 'https://maps.google.com',
  },
];

const MATERIAL_FILTERS = ['All', 'E-Waste', 'Batteries', 'Screens', 'Metals', 'Cables'];
const CITY_FILTERS = ['All Cities', 'Mumbai', 'Pune', 'Bangalore', 'Hyderabad', 'Chennai', 'Delhi'];

const materialIcons: Record<string, React.ReactNode> = {
  'E-Waste': <Cpu className="w-3 h-3" />,
  'Batteries': <Battery className="w-3 h-3" />,
  'Screens': <Monitor className="w-3 h-3" />,
  'Metals': <Recycle className="w-3 h-3" />,
};

export default function RecyclingCentersPage() {
  const [centers, setCenters] = useState<Center[]>(CENTERS);
  const [search, setSearch] = useState('');
  const [activeMaterial, setActiveMaterial] = useState('All');
  const [activeCity, setActiveCity] = useState('All Cities');

  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: 'Mumbai',
    phone: '',
    hours: 'Mon-Fri, 9 AM - 6 PM',
    accepts: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMaterialToggle = (material: string) => {
    setFormData(prev => ({
      ...prev,
      accepts: prev.accepts.includes(material)
        ? prev.accepts.filter(m => m !== material)
        : [...prev.accepts, material]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.phone || formData.accepts.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const newCenter: Center = {
        id: Date.now().toString(),
        name: formData.name,
        address: formData.address,
        city: formData.city,
        phone: formData.phone,
        hours: formData.hours,
        accepts: formData.accepts,
        verified: false,
        distance: 'Nearby',
        mapsUrl: 'https://maps.google.com'
      };
      
      setCenters(prev => [newCenter, ...prev]);
      setIsSubmitOpen(false);
      setFormData({
        name: '',
        address: '',
        city: 'Mumbai',
        phone: '',
        hours: 'Mon-Fri, 9 AM - 6 PM',
        accepts: [],
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = useMemo(() => {
    return centers.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.address.toLowerCase().includes(search.toLowerCase()) ||
        c.city.toLowerCase().includes(search.toLowerCase());
      const matchMaterial =
        activeMaterial === 'All' || c.accepts.includes(activeMaterial);
      const matchCity = activeCity === 'All Cities' || c.city === activeCity;
      return matchSearch && matchMaterial && matchCity;
    });
  }, [search, activeMaterial, activeCity]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Page Hero */}
      <section className="relative overflow-hidden border-b border-border bg-card/30">
        <div className="absolute -top-20 right-0 w-72 h-72 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="animate-slide-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
              <MapPin className="w-3.5 h-3.5" />
              Certified Drop-off Points
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-3">
              Recycling Centers
            </h1>
            <p className="text-muted-foreground text-lg max-w-lg">
              Find verified e-waste collection points near you. Filter by city or accepted materials.
            </p>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap gap-6 mt-8">
            {[
              { value: '8+', label: 'Verified Centers' },
              { value: '6', label: 'Cities Covered' },
              { value: '5', label: 'Material Types' },
            ].map(({ value, label }) => (
              <div key={label} className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary">{value}</span>
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Search + Filters */}
        <div className="mb-8 space-y-4 animate-slide-in">
          {/* Search bar */}
          <div className="relative max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, city, or address…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200"
            />
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1"><Filter className="w-3 h-3" /> Material:</span>
              {MATERIAL_FILTERS.map((m) => (
                <button
                  key={m}
                  onClick={() => setActiveMaterial(m)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150 ${activeMaterial === m
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                    }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1"><MapPin className="w-3 h-3" /> City:</span>
              {CITY_FILTERS.map((city) => (
                <button
                  key={city}
                  onClick={() => setActiveCity(city)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150 ${activeCity === city
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                    }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filtered.length}</span> centers
          </p>
        </div>

        {/* Center cards grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((center) => (
              <Card
                key={center.id}
                className="overflow-hidden border-border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-sm font-bold text-foreground truncate">{center.name}</h2>
                        {center.verified && (
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{center.city}</p>
                    </div>
                    <span className="ml-2 flex-shrink-0 text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {center.distance}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground">{center.address}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <a href={`tel:${center.phone}`} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                        {center.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <p className="text-xs text-muted-foreground">{center.hours}</p>
                    </div>
                  </div>

                  {/* Accepted materials */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-foreground mb-2">Accepts:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {center.accepts.map((m) => (
                        <span
                          key={m}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-secondary/50 text-foreground border border-border"
                        >
                          {materialIcons[m] ?? <Recycle className="w-3 h-3" />}
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action */}
                  <a
                    href={center.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all duration-200 group-hover:shadow-sm"
                  >
                    Get Directions
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-secondary/30 flex items-center justify-center mb-4">
              <MapPin className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-foreground font-semibold mb-1">No centers found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters or search term.</p>
          </div>
        )}

        {/* Submit a Center CTA */}
        <div id="submit" className="mt-12 p-8 rounded-2xl border border-dashed border-primary/30 bg-primary/5 flex flex-col sm:flex-row items-center justify-between gap-6 animate-slide-in">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-1">Know a recycling center?</h3>
            <p className="text-sm text-muted-foreground">
              Help the community by submitting a center that isn't listed yet.
            </p>
          </div>
          <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
            <DialogTrigger asChild>
              <button className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/25">
                <Plus className="w-4 h-4" />
                Submit a Center
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Submit a Recycling Center</DialogTitle>
                <DialogDescription>
                  Help others by sharing a drop-off location you know.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Eco Recyclers..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Address</label>
                  <input required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="123 Green St..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">City</label>
                    <select required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      {CITY_FILTERS.filter(c => c !== 'All Cities').map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="+91..." />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Materials Accepted</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {MATERIAL_FILTERS.filter(m => m !== 'All').map(m => (
                      <button type="button" key={m} onClick={() => handleMaterialToggle(m)} className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150 ${formData.accepts.includes(m) ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:border-primary/40'}`}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsSubmitOpen(false)} className="h-10 px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors">Cancel</button>
                  <button type="submit" disabled={isSubmitting || formData.accepts.length === 0} className="h-10 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors disabled:opacity-50">
                    {isSubmitting ? 'Submitting...' : 'Submit Center'}
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </main>
  );
}
