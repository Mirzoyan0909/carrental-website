import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { Phone, Car, Menu, X, Plus, Edit, Trash2, LogOut, Settings, Fuel, Gauge, Calendar, ShieldAlert, Shield, Upload, Link as LinkIcon, Award, Users, Clock } from "lucide-react";
import { Toaster, toast } from "sonner";

const API = process.env.REACT_APP_BACKEND_URL + "/api";

// Telegram Icon Component
const TelegramIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
  </svg>
);

const Button = ({ children, className = "", variant = "default", size = "default", ...props }) => {
  const base = "inline-flex items-center justify-center font-medium transition-all duration-300";
  const variants = { 
    default: "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-xl", 
    outline: "border-2 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400", 
    destructive: "bg-red-600 text-white hover:bg-red-700 hover:shadow-xl" 
  };
  const sizes = { default: "h-10 px-4 py-2", sm: "h-8 px-3 text-sm" };
  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</button>;
};

const Input = ({ className = "", ...props }) => <input className={`w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-yellow-600 transition-all duration-300 ${className}`} {...props} />;
const Label = ({ children, className = "", ...props }) => <label className={`text-sm font-semibold text-gray-700 ${className}`} {...props}>{children}</label>;
const Textarea = ({ className = "", ...props }) => <textarea className={`w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-yellow-600 transition-all duration-300 ${className}`} {...props} />;

const Switch = ({ checked, onCheckedChange }) => (
  <button type="button" onClick={() => onCheckedChange(!checked)} className={`w-12 h-7 rounded-full transition-all duration-300 ${checked ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-lg' : 'bg-gray-300'}`}>
    <span className={`block w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-300 ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
  </button>
);

const Select = ({ value, onValueChange, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(!open)} className="w-full px-4 py-3 border-2 border-gray-300 text-left bg-white hover:border-gray-400 transition-all">{value}</button>
      {open && <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-300 shadow-2xl max-h-60 overflow-auto">{children.map((c, i) => <button key={i} type="button" onClick={() => { onValueChange(c.props.value); setOpen(false); }} className="w-full px-4 py-3 text-left hover:bg-yellow-50 transition-all">{c.props.children}</button>)}</div>}
    </div>
  );
};
const SelectItem = ({ value, children }) => null;

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  return (<div className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn"><div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => onOpenChange(false)} /><div className="relative bg-white max-w-3xl w-full mx-4 max-h-[90vh] overflow-auto shadow-2xl animate-fadeInUp">{children}</div></div>);
};

const AdminFAB = () => {
  const navigate = useNavigate();
  return (
    <button 
      onClick={() => navigate('/admin')} 
      className="admin-fab group"
      data-testid="admin-fab-button"
    >
      <Shield className="group-hover:rotate-12 transition-transform duration-300" />
    </button>
  );
};

const Header = ({ onMenuClick, menuOpen }) => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    onMenuClick && menuOpen && onMenuClick();
  };

  return (
    <header className={`bg-[#050505] text-white border-b border-white/10 sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'shadow-2xl backdrop-blur-xl bg-[#050505]/95' : ''}`}>
      <div className="container-custom flex items-center justify-between h-20">
        <a href="/" className="font-heading text-xl md:text-2xl font-bold italic flex items-center gap-3 group">
          <Car className="w-8 h-8 text-[#D4AF37] logo-icon" />
          <span className="transition-all duration-300">Premium<span className="text-[#D4AF37]">Auto</span></span>
        </a>
        <nav className="hidden md:flex items-center gap-10">
          <button onClick={() => scrollTo('catalog')} className="nav-link">Catalog</button>
          <button onClick={() => scrollTo('about')} className="nav-link">About</button>
          <button onClick={() => scrollTo('contact')} className="nav-link">Contact</button>
        </nav>
        <button className="md:hidden text-white p-2 hover:text-[#D4AF37] transition-colors" onClick={onMenuClick}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-[#050505] border-t border-white/10 py-6 animate-fadeIn">
          <nav className="flex flex-col items-center gap-6">
            <button onClick={() => scrollTo('catalog')} className="nav-link text-base">Catalog</button>
            <button onClick={() => scrollTo('about')} className="nav-link text-base">About</button>
            <button onClick={() => scrollTo('contact')} className="nav-link text-base">Contact</button>
          </nav>
        </div>
      )}
    </header>
  );
};

const HeroSection = () => (
  <section className="hero-section" data-testid="hero-section">
    <div className="hero-background" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1920')" }} />
    <div className="hero-gradient" />
    <div className="hero-particles" />
    <div className="hero-content">
      <p className="text-[#D4AF37] uppercase tracking-[0.3em] text-sm md:text-base mb-6 font-semibold">Premium Automobiles</p>
      <h1 className="hero-title font-heading font-black mb-8">Sales & Rentals</h1>
      <p className="hero-subtitle max-w-3xl mx-auto mb-12">Exclusive collection of premium vehicles for the most discerning clients</p>
      <div className="flex flex-col sm:flex-row gap-6 justify-center">
        <button 
          onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })} 
          className="btn-gold px-12 py-5 uppercase tracking-widest text-sm font-bold shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105"
          data-testid="view-catalog-button"
        >
          View Catalog
        </button>
        <button 
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} 
          className="bg-transparent border-2 border-white/40 text-white px-12 py-5 uppercase tracking-widest text-sm font-bold hover:bg-white/10 hover:border-white transition-all duration-300 hover:scale-105"
          data-testid="contact-us-button"
        >
          Contact Us
        </button>
      </div>
    </div>
  </section>
);

const CarCard = ({ car, onContact }) => (
  <div className="car-card" data-testid={`car-card-${car.id}`}>
    <div className="aspect-[4/3] overflow-hidden bg-gray-100 relative">
      <img 
        src={car.image_url} 
        alt={car.title} 
        className="object-cover w-full h-full" 
        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800'; }} 
      />
      <div className="absolute top-4 left-4 flex gap-2">
        {car.for_sale && <span className="badge-sale text-xs px-4 py-2 uppercase tracking-wider font-semibold rounded-sm">For Sale</span>}
        {car.for_rent && <span className="badge-rent text-xs px-4 py-2 uppercase tracking-wider font-bold rounded-sm">For Rent</span>}
      </div>
    </div>
    <div className="p-6 space-y-4">
      <div>
        <p className="text-xs uppercase tracking-wider text-gray-400 mb-1 font-semibold">{car.brand}</p>
        <h3 className="font-heading text-2xl font-bold text-gray-900">{car.title}</h3>
      </div>
      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />{car.year}</span>
        <span className="flex items-center gap-2"><Gauge className="w-4 h-4" />{car.mileage?.toLocaleString()} mi</span>
        <span className="flex items-center gap-2"><Fuel className="w-4 h-4" />{car.fuel_type}</span>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{car.description}</p>
      <div className="pt-4 border-t-2 border-gray-100 space-y-3">
        {car.for_sale && car.price_sale && (
          <div className="flex items-center justify-between">
            <span className="price-tag text-2xl">${car.price_sale.toLocaleString()}</span>
            <button onClick={() => onContact(car, 'sale')} className="btn-dark px-8 py-3 text-xs uppercase font-bold rounded-sm hover:scale-105" data-testid={`buy-${car.id}`}>Buy Now</button>
          </div>
        )}
        {car.for_rent && car.price_rent && (
          <div className="flex items-center justify-between">
            <span className="price-tag text-2xl">${car.price_rent.toLocaleString()}/day</span>
            <button onClick={() => onContact(car, 'rent')} className="btn-gold px-8 py-3 text-xs uppercase font-bold rounded-sm hover:scale-105" data-testid={`rent-${car.id}`}>Rent Now</button>
          </div>
        )}
      </div>
    </div>
  </div>
);

const ContactModal = ({ open, onClose, car, type, contact }) => (
  <Dialog open={open} onOpenChange={onClose}>
    <div className="bg-gradient-to-r from-[#050505] to-[#1a1a1a] text-white p-10">
      <h2 className="font-heading text-3xl font-bold mb-2">{type === 'rent' ? 'Rent' : 'Buy'} {car?.title}</h2>
      <p className="text-white/80 text-lg">Contact us to {type === 'rent' ? 'rent' : 'purchase'} this vehicle</p>
    </div>
    <div className="p-10 space-y-6">
      <a href={`tel:${contact?.phone || '+1 (555) 123-4567'}`} className="contact-link">
        <div className="w-14 h-14 bg-gradient-to-br from-[#050505] to-[#1a1a1a] flex items-center justify-center rounded-lg shadow-lg">
          <Phone className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-xs uppercase text-gray-400 mb-1 font-semibold tracking-wider">Call Us</p>
          <p className="text-xl font-bold text-gray-900">{contact?.phone || '+1 (555) 123-4567'}</p>
        </div>
      </a>
      <a href={`https://t.me/${(contact?.telegram || '@premium_auto').replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="contact-link">
        <div className="w-14 h-14 bg-[#0088cc] flex items-center justify-center rounded-lg shadow-lg">
          <TelegramIcon className="w-7 h-7 text-white" />
        </div>
        <div>
          <p className="text-xs uppercase text-gray-400 mb-1 font-semibold tracking-wider">Telegram</p>
          <p className="text-xl font-bold text-gray-900">{contact?.telegram || '@premium_auto'}</p>
        </div>
      </a>
    </div>
  </Dialog>
);

const CatalogSection = ({ cars, onContact }) => {
  const [filter, setFilter] = useState('all');
  const filteredCars = cars.filter(car => filter === 'sale' ? car.for_sale : filter === 'rent' ? car.for_rent : true);
  
  return (
    <section id="catalog" className="section-padding bg-gradient-to-b from-gray-50 to-white" data-testid="catalog-section">
      <div className="container-custom">
        <div className="text-center mb-20 section-title">
          <p className="text-[#D4AF37] uppercase tracking-[0.3em] text-sm mb-4 font-bold">Our Inventory</p>
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-gray-900 mb-4">Vehicles</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">Premium collection for you</p>
        </div>
        <div className="flex justify-center mb-16">
          <div className="inline-flex bg-white border-2 border-gray-200 shadow-xl rounded-sm overflow-hidden">
            <button className={`filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')} data-testid="filter-all">All</button>
            <button className={`filter-tab ${filter === 'sale' ? 'active' : ''}`} onClick={() => setFilter('sale')} data-testid="filter-sale">For Sale</button>
            <button className={`filter-tab ${filter === 'rent' ? 'active' : ''}`} onClick={() => setFilter('rent')} data-testid="filter-rent">For Rent</button>
          </div>
        </div>
        {filteredCars.length === 0 ? (
          <div className="text-center py-24">
            <Car className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 text-xl">No vehicles found</p>
          </div>
        ) : (
          <div className="car-card-container">{filteredCars.map(car => <CarCard key={car.id} car={car} onContact={onContact} />)}</div>
        )}
      </div>
    </section>
  );
};

const AboutSection = () => (
  <section id="about" className="section-padding bg-white" data-testid="about-section">
    <div className="container-custom">
      <div className="grid md:grid-cols-2 gap-20 items-center">
        <div className="section-title">
          <p className="text-[#D4AF37] uppercase tracking-[0.3em] text-sm mb-4 font-bold">About Us</p>
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">Premium Quality & Service</h2>
          <p className="text-gray-600 mb-6 text-lg leading-relaxed">We offer an exclusive collection of premium vehicles for sale and rent. Each car is carefully selected and inspected.</p>
          <div className="grid grid-cols-3 gap-8 mt-12">
            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-white rounded-lg shadow-lg hover:shadow-xl transition-all">
              <Award className="w-10 h-10 text-[#D4AF37] mx-auto mb-3" />
              <p className="font-heading text-5xl font-bold text-[#D4AF37] mb-2">50+</p>
              <p className="text-sm text-gray-600 uppercase font-semibold">Vehicles</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-white rounded-lg shadow-lg hover:shadow-xl transition-all">
              <Users className="w-10 h-10 text-[#D4AF37] mx-auto mb-3" />
              <p className="font-heading text-5xl font-bold text-[#D4AF37] mb-2">500+</p>
              <p className="text-sm text-gray-600 uppercase font-semibold">Clients</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-white rounded-lg shadow-lg hover:shadow-xl transition-all">
              <Clock className="w-10 h-10 text-[#D4AF37] mx-auto mb-3" />
              <p className="font-heading text-5xl font-bold text-[#D4AF37] mb-2">5</p>
              <p className="text-sm text-gray-600 uppercase font-semibold">Years</p>
            </div>
          </div>
        </div>
        <div className="relative about-image-container">
          <img 
            src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800" 
            alt="Mercedes-Benz S-Class Black"
            className="w-full h-[500px] object-cover shadow-2xl" 
          />
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#D4AF37] to-[#C5A028] opacity-80 rounded-lg" />
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-[#D4AF37] to-[#C5A028] opacity-60 rounded-lg" />
        </div>
      </div>
    </div>
  </section>
);

const ContactSection = ({ contact }) => (
  <section id="contact" className="section-padding bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#050505] text-white" data-testid="contact-section">
    <div className="container-custom">
      <div className="text-center mb-20 section-title">
        <p className="text-[#D4AF37] uppercase tracking-[0.3em] text-sm mb-4 font-bold">Get In Touch</p>
        <h2 className="font-heading text-4xl md:text-6xl font-bold mb-4">Contact Us</h2>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">We're always happy to help</p>
      </div>
      <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8">
        <a 
          href={`tel:${contact?.phone}`} 
          className="p-10 border-2 border-white/10 hover:border-[#D4AF37] transition-all duration-500 bg-white/5 backdrop-blur-sm hover:scale-105 group"
          data-testid="contact-phone"
        >
          <Phone className="w-12 h-12 text-[#D4AF37] mb-6 group-hover:scale-110 transition-transform" />
          <p className="text-xs uppercase text-white/50 mb-2 font-semibold tracking-wider">Phone</p>
          <p className="text-2xl font-bold">{contact?.phone || '+1 (555) 123-4567'}</p>
        </a>
        <a 
          href={`https://t.me/${(contact?.telegram || '').replace('@', '')}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="p-10 border-2 border-white/10 hover:border-[#0088cc] transition-all duration-500 bg-white/5 backdrop-blur-sm hover:scale-105 group"
          data-testid="contact-telegram"
        >
          <div className="w-12 h-12 bg-[#0088cc] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <TelegramIcon className="w-7 h-7 text-white" />
          </div>
          <p className="text-xs uppercase text-white/50 mb-2 font-semibold tracking-wider">Telegram</p>
          <p className="text-2xl font-bold">{contact?.telegram || '@premium_auto'}</p>
        </a>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-[#050505] text-white py-16 border-t border-white/10">
    <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-3 group">
        <Car className="w-8 h-8 text-[#D4AF37] logo-icon" />
        <span className="font-heading text-2xl font-bold italic">Premium<span className="text-[#D4AF37]">Auto</span></span>
      </div>
      <p className="text-white/50 text-sm">© {new Date().getFullYear()} Premium Auto. All rights reserved.</p>
    </div>
  </footer>
);

const Home = () => {
  const [cars, setCars] = useState([]);
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactModal, setContactModal] = useState({ open: false, car: null, type: null });

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        if (token) {
          try { await axios.post(`${API}/seed`, {}, { headers: { Authorization: `Bearer ${token}` } }); } catch (e) { console.log('Seed error:', e); }
        }
        const [c, ct] = await Promise.all([axios.get(`${API}/cars`), axios.get(`${API}/contacts`)]);
        setCars(c.data);
        setContact(ct.data);
      } catch (e) {
        console.error(e);
        toast.error('Error loading data');
      }
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#050505] to-[#1a1a1a]">
      <div className="text-center">
        <div className="spinner mx-auto mb-4" />
        <p className="text-white text-lg">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Header onMenuClick={() => setMenuOpen(!menuOpen)} menuOpen={menuOpen} />
      <HeroSection />
      <CatalogSection cars={cars} onContact={(car, type) => setContactModal({ open: true, car, type })} />
      <AboutSection />
      <ContactSection contact={contact} />
      <Footer />
      <ContactModal 
        open={contactModal.open} 
        onClose={() => setContactModal({ open: false, car: null, type: null })} 
        car={contactModal.car} 
        type={contactModal.type} 
        contact={contact} 
      />
      <AdminFAB />
    </div>
  );
};

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API}/auth/login`, { username, password });
      localStorage.setItem('admin_token', res.data.access_token);
      onLogin();
      toast.success('Login successful!');
    } catch (e) {
      const msg = e.response?.data?.detail || 'Login error';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="w-full max-w-md animate-fadeInUp">
        <div className="bg-gradient-to-r from-[#050505] to-[#1a1a1a] p-10 text-center shadow-2xl">
          <Shield className="w-16 h-16 text-[#D4AF37] mx-auto mb-4 animate-glow" />
          <h1 className="font-heading text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-white/70">Management System Login</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-10 shadow-2xl space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-200 text-red-700 text-sm flex items-center gap-2 rounded-sm">
              <ShieldAlert className="w-5 h-5" />
              {error}
            </div>
          )}
          <div>
            <Label className="text-xs uppercase text-gray-600 mb-2 block">Username</Label>
            <Input 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Enter username"
              required 
              data-testid="admin-username-input"
            />
          </div>
          <div>
            <Label className="text-xs uppercase text-gray-600 mb-2 block">Password</Label>
            <Input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter password"
              required 
              data-testid="admin-password-input"
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full btn-dark h-14 uppercase text-sm font-bold shadow-xl hover:shadow-2xl disabled:opacity-50"
            data-testid="admin-login-button"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </Button>
        </form>
        <div className="text-center mt-8">
          <a href="/" className="text-sm text-gray-600 hover:text-[#D4AF37] transition-colors font-semibold">
            ← Back to website
          </a>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = ({ onLogout }) => {
  const [cars, setCars] = useState([]);
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editCar, setEditCar] = useState(null);
  const [showCarForm, setShowCarForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const token = localStorage.getItem('admin_token');
  const headers = { Authorization: `Bearer ${token}` };

  const loadData = async () => {
    try {
      const [c, ct] = await Promise.all([axios.get(`${API}/cars`), axios.get(`${API}/contacts`)]);
      setCars(c.data);
      setContact(ct.data);
    } catch (e) {
      if (e.response?.status === 401) onLogout();
      toast.error('Error loading data');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteCar = async (carId) => {
    if (!window.confirm('Delete this vehicle?')) return;
    try {
      await axios.delete(`${API}/cars/${carId}`, { headers });
      toast.success('Vehicle deleted');
      loadData();
    } catch (e) {
      toast.error('Delete error');
    }
  };

  const handleSaveCar = async (data) => {
    try {
      if (editCar) {
        await axios.put(`${API}/cars/${editCar.id}`, data, { headers });
        toast.success('Vehicle updated');
      } else {
        await axios.post(`${API}/cars`, data, { headers });
        toast.success('Vehicle added');
      }
      setShowCarForm(false);
      setEditCar(null);
      loadData();
    } catch (e) {
      toast.error('Save error');
    }
  };

  const handleSaveContact = async (data) => {
    try {
      await axios.put(`${API}/contacts`, data, { headers });
      toast.success('Contacts updated');
      setShowContactForm(false);
      loadData();
    } catch (e) {
      toast.error('Save error');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="spinner mx-auto mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-gradient-to-r from-[#050505] to-[#1a1a1a] text-white h-20 flex items-center px-8 sticky top-0 z-50 shadow-2xl">
        <div className="flex items-center gap-3">
          <Shield className="w-7 h-7 text-[#D4AF37]" />
          <span className="font-heading text-xl font-bold">Admin Panel</span>
        </div>
        <div className="ml-auto flex items-center gap-6">
          <a href="/" className="text-sm text-white/70 hover:text-white transition-colors font-semibold">
            ← Back to website
          </a>
          <button 
            onClick={onLogout} 
            className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors font-semibold"
            data-testid="admin-logout-button"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>
      <div className="p-8 md:p-12">
        <div className="bg-white border-2 border-gray-200 p-8 mb-10 shadow-xl rounded-lg">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-2xl font-bold text-gray-900">Contact Information</h2>
            <Button onClick={() => setShowContactForm(true)} variant="outline" className="hover:scale-105" data-testid="edit-contacts-button">
              <Settings className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200">
              <p className="text-xs uppercase text-gray-500 mb-2 font-semibold tracking-wider">Phone</p>
              <p className="text-xl font-bold text-gray-900">{contact?.phone}</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200">
              <p className="text-xs uppercase text-gray-500 mb-2 font-semibold tracking-wider">Telegram</p>
              <p className="text-xl font-bold text-gray-900">{contact?.telegram}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border-2 border-gray-200 p-8 shadow-xl rounded-lg">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-heading text-2xl font-bold text-gray-900">Vehicles</h2>
              <p className="text-gray-600 mt-1">Total: {cars.length}</p>
            </div>
            <Button 
              onClick={() => { setEditCar(null); setShowCarForm(true); }} 
              className="btn-gold hover:scale-105 shadow-lg"
              data-testid="add-car-button"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Vehicle
            </Button>
          </div>
          <div className="overflow-x-auto rounded-lg border-2 border-gray-200">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Title</th>
                  <th>Year</th>
                  <th>Sale</th>
                  <th>Rent</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.map(car => (
                  <tr key={car.id} data-testid={`admin-car-row-${car.id}`}>
                    <td>
                      <img src={car.image_url} alt="" className="w-24 h-16 object-cover rounded shadow" />
                    </td>
                    <td className="font-bold text-gray-900">{car.title}</td>
                    <td className="text-gray-700">{car.year}</td>
                    <td className="font-semibold text-[#D4AF37]">{car.for_sale ? `$${car.price_sale?.toLocaleString()}` : '—'}</td>
                    <td className="font-semibold text-[#D4AF37]">{car.for_rent ? `$${car.price_rent}/day` : '—'}</td>
                    <td>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => { setEditCar(car); setShowCarForm(true); }}
                          className="hover:scale-110"
                          data-testid={`edit-car-${car.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDeleteCar(car.id)}
                          className="hover:scale-110"
                          data-testid={`delete-car-${car.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <CarFormModal open={showCarForm} onClose={() => { setShowCarForm(false); setEditCar(null); }} car={editCar} onSave={handleSaveCar} />
      <ContactFormModal open={showContactForm} onClose={() => setShowContactForm(false)} contact={contact} onSave={handleSaveContact} />
    </div>
  );
};

const CarFormModal = ({ open, onClose, car, onSave }) => {
  const [form, setForm] = useState({
    title: '', brand: '', model: '', year: 2024, price_sale: '', price_rent: '', 
    for_sale: true, for_rent: true, image_url: '', description: '', 
    mileage: 0, fuel_type: 'Gasoline', transmission: 'Automatic'
  });
  const [uploadMode, setUploadMode] = useState('url');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (car) {
      setForm({ ...car, price_sale: car.price_sale || '', price_rent: car.price_rent || '' });
    } else {
      setForm({
        title: '', brand: '', model: '', year: 2024, price_sale: '', price_rent: '',
        for_sale: true, for_rent: true, image_url: '', description: '',
        mileage: 0, fuel_type: 'Gasoline', transmission: 'Automatic'
      });
    }
  }, [car, open]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    
    setUploading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.post(`${API}/upload`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      setForm({ ...form, image_url: res.data.url });
      toast.success('Photo uploaded!');
    } catch (e) {
      toast.error('Upload error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      price_sale: form.price_sale ? Number(form.price_sale) : null,
      price_rent: form.price_rent ? Number(form.price_rent) : null,
      year: Number(form.year),
      mileage: Number(form.mileage)
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div className="bg-gradient-to-r from-[#050505] to-[#1a1a1a] text-white p-8">
        <h2 className="font-heading text-2xl font-bold">{car ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
      </div>
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 block">Title*</Label>
            <Input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required data-testid="car-title-input" />
          </div>
          <div>
            <Label className="mb-2 block">Brand*</Label>
            <Input value={form.brand} onChange={(e) => setForm({...form, brand: e.target.value})} required data-testid="car-brand-input" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="mb-2 block">Model*</Label>
            <Input value={form.model} onChange={(e) => setForm({...form, model: e.target.value})} required data-testid="car-model-input" />
          </div>
          <div>
            <Label className="mb-2 block">Year*</Label>
            <Input type="number" value={form.year} onChange={(e) => setForm({...form, year: e.target.value})} required data-testid="car-year-input" />
          </div>
          <div>
            <Label className="mb-2 block">Mileage (mi)</Label>
            <Input type="number" value={form.mileage} onChange={(e) => setForm({...form, mileage: e.target.value})} data-testid="car-mileage-input" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 block">Fuel</Label>
            <Select value={form.fuel_type} onValueChange={(v) => setForm({...form, fuel_type: v})}>
              <SelectItem value="Gasoline">Gasoline</SelectItem>
              <SelectItem value="Diesel">Diesel</SelectItem>
              <SelectItem value="Electric">Electric</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
            </Select>
          </div>
          <div>
            <Label className="mb-2 block">Transmission</Label>
            <Select value={form.transmission} onValueChange={(v) => setForm({...form, transmission: v})}>
              <SelectItem value="Automatic">Automatic</SelectItem>
              <SelectItem value="Manual">Manual</SelectItem>
            </Select>
          </div>
        </div>
        
        <div>
          <Label className="mb-3 block">Vehicle Photo*</Label>
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setUploadMode('url')}
              className={`flex-1 py-3 px-4 border-2 transition-all font-semibold rounded-sm ${uploadMode === 'url' ? 'border-[#D4AF37] bg-yellow-50 text-[#D4AF37]' : 'border-gray-300 text-gray-600'}`}
              data-testid="upload-mode-url"
            >
              <LinkIcon className="w-4 h-4 inline mr-2" />
              URL Link
            </button>
            <button
              type="button"
              onClick={() => setUploadMode('file')}
              className={`flex-1 py-3 px-4 border-2 transition-all font-semibold rounded-sm ${uploadMode === 'file' ? 'border-[#D4AF37] bg-yellow-50 text-[#D4AF37]' : 'border-gray-300 text-gray-600'}`}
              data-testid="upload-mode-file"
            >
              <Upload className="w-4 h-4 inline mr-2" />
              Upload from Device
            </button>
          </div>
          
          {uploadMode === 'url' ? (
            <Input 
              value={form.image_url} 
              onChange={(e) => setForm({...form, image_url: e.target.value})} 
              placeholder="https://example.com/image.jpg"
              required 
              data-testid="car-image-url-input"
            />
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#D4AF37] transition-all">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                disabled={uploading}
                data-testid="car-image-file-input"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-semibold mb-1">
                  {uploading ? 'Uploading...' : 'Click to select file'}
                </p>
                <p className="text-sm text-gray-400">PNG, JPG, JPEG up to 10MB</p>
                <p className="text-xs text-gray-400 mt-2">📱 Works from phone camera too!</p>
              </label>
            </div>
          )}
        </div>

        {form.image_url && (
          <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
            <img src={form.image_url} alt="Preview" className="w-full h-48 object-cover" />
          </div>
        )}

        <div>
          <Label className="mb-2 block">Description</Label>
          <Textarea 
            value={form.description} 
            onChange={(e) => setForm({...form, description: e.target.value})} 
            rows={3} 
            placeholder="Brief description of the vehicle..."
            data-testid="car-description-input"
          />
        </div>

        <div className="grid grid-cols-2 gap-8 pt-6 border-t-2 border-gray-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <Label className="font-bold">Available for Sale</Label>
              <Switch checked={form.for_sale} onCheckedChange={(v) => setForm({...form, for_sale: v})} />
            </div>
            {form.for_sale && (
              <div>
                <Label className="mb-2 block">Price ($)</Label>
                <Input 
                  type="number" 
                  value={form.price_sale} 
                  onChange={(e) => setForm({...form, price_sale: e.target.value})} 
                  placeholder="150000"
                  data-testid="car-price-sale-input"
                />
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <Label className="font-bold">Available for Rent</Label>
              <Switch checked={form.for_rent} onCheckedChange={(v) => setForm({...form, for_rent: v})} />
            </div>
            {form.for_rent && (
              <div>
                <Label className="mb-2 block">Price ($/day)</Label>
                <Input 
                  type="number" 
                  value={form.price_rent} 
                  onChange={(e) => setForm({...form, price_rent: e.target.value})} 
                  placeholder="500"
                  data-testid="car-price-rent-input"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-14 font-bold" data-testid="car-form-cancel">
            Cancel
          </Button>
          <Button type="submit" className="flex-1 btn-dark h-14 font-bold shadow-xl" data-testid="car-form-submit">
            {car ? 'Save Changes' : 'Add Vehicle'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

const ContactFormModal = ({ open, onClose, contact, onSave }) => {
  const [phone, setPhone] = useState('');
  const [telegram, setTelegram] = useState('');

  useEffect(() => {
    if (contact) {
      setPhone(contact.phone || '');
      setTelegram(contact.telegram || '');
    }
  }, [contact, open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div className="bg-gradient-to-r from-[#050505] to-[#1a1a1a] text-white p-8">
        <h2 className="font-heading text-2xl font-bold">Contact Information</h2>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onSave({ phone, telegram }); }} className="p-8 space-y-6">
        <div>
          <Label className="mb-2 block">Phone</Label>
          <Input 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            placeholder="+1 (555) 123-4567"
            data-testid="contact-phone-input"
          />
        </div>
        <div>
          <Label className="mb-2 block">Telegram</Label>
          <Input 
            value={telegram} 
            onChange={(e) => setTelegram(e.target.value)} 
            placeholder="@premium_auto"
            data-testid="contact-telegram-input"
          />
        </div>
        <div className="flex gap-4 pt-6">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-14 font-bold" data-testid="contact-form-cancel">
            Cancel
          </Button>
          <Button type="submit" className="flex-1 btn-dark h-14 font-bold shadow-xl" data-testid="contact-form-submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

const AdminPage = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      setChecking(false);
      return;
    }
    axios.get(`${API}/auth/check`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => setIsAuth(true))
      .catch(() => localStorage.removeItem('admin_token'))
      .finally(() => setChecking(false));
  }, []);

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="spinner mx-auto mb-4" />
        <p className="text-gray-600">Checking...</p>
      </div>
    </div>
  );

  if (!isAuth) return <AdminLogin onLogin={() => setIsAuth(true)} />;
  return <AdminDashboard onLogout={() => { localStorage.removeItem('admin_token'); setIsAuth(false); }} />;
};

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
