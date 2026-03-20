import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  HiMenu, HiX,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import './Navbar.css';

/* ── nav links ─────────────────────────────────────────────── */
const navLinks = [
  { to: '/',         label: 'Home'     },
  { to: '/about',    label: 'About'    },
  { to: '/events',   label: 'Events'   },
  { to: '/schedule', label: 'Schedule' },
  { to: '/gallery',  label: 'Gallery'  },
  { to: '/#contact',  label: 'Contact Us' },
];

/* ── tiny inline countdown (Xd Xh Xm Xs format) ───────────── */
const InlineCountdown = ({ targetDate }) => {
  const [t, setT] = useState({});
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) { setExpired(true); return; }
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (expired) return <span className="text-green-400 font-bold text-sm">🎉 Event is LIVE!</span>;

  const pad = (n) => String(n).padStart(2, '0');
  return (
    <span className="font-mono font-semibold text-white text-sm tracking-wide">
      {pad(t.d)}d {pad(t.h)}h {pad(t.m)}m{' '}
      <span className="text-green-400">{pad(t.s)}s</span>
    </span>
  );
};

/* ── scrolling marquee ticker ──────────────────────────────── */
const tickers = [
  { label: 'STAY CONNECTED:', detail: 'Follow us on LinkedIn, Instagram & Telegram', highlight: false },
  { label: 'Click here to view shortlisted teams', detail: '', highlight: true, link: '/events' },
  { label: 'EVENT DATE:', detail: '6th & 7th March 2026 🔥', highlight: false },
  { label: 'REGISTRATION:', detail: 'Now Open – Register before the deadline!', highlight: false },
  { label: 'VENUE:', detail: 'Dr. Ambedkar Institute of Technology, Bangalore', highlight: false },
];

const MarqueeTicker = () => {

  return (
    <div className="navbar-ticker">
      <div className="ticker-inner">
        {[...Array(3)].map((_, i) => (
          <span key={i} className="ticker-segment">
            {tickers.map((item, j) => (
              <span key={j}>
                <span className="ticker-dot">•</span>
                {item.highlight ? (
                  <Link to={item.link || '#'} className="ticker-link">{item.label}</Link>
                ) : (
                  <>
                    <span className="ticker-bold">{item.label}</span>
                    {' '}{item.detail}
                  </>
                )}
                {'        '}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ── main Navbar component ─────────────────────────────────── */
const Navbar = () => {
  const [isOpen, setIsOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location  = useLocation();
  const navigate  = useNavigate();

  /* next event date – adjust as needed */
  const nextEventDate = '2026-04-15T00:00:00';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const getDashboardPath = () => {
    if (user?.role === 'admin')     return '/admin';
    if (user?.role === 'organizer') return '/organizer';
    return '/dashboard';
  };


  return (
    <nav className={`navbar-root ${scrolled ? 'navbar-scrolled' : ''}`}>
      {/* ── top bar ─── */}
      <div className="navbar-topbar">
        <div className="navbar-inner">

          {/* LEFT – logo + college name */}
          <Link to="/" className="navbar-brand">
            <img
              src="/logo.png"
              alt="DRAIT Logo"
              className="navbar-logo"
            />
            <div className="navbar-brand-text">
              <span className="navbar-title">SWO – DRAIT</span>
              <span className="navbar-subtitle">Cultural Events</span>
            </div>
          </Link>

          {/* CENTER – event countdown (hidden on small) */}
          <div className="navbar-center hidden md:flex">
            <span className="navbar-event-label">
              <span className="navbar-event-dot" />
              Event starts in:
            </span>
            <InlineCountdown targetDate={nextEventDate} />
          </div>

          {/* RIGHT – action buttons + hamburger */}
          <div className="navbar-right flex items-center gap-4">
            <div className="hidden xl:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link to={getDashboardPath()} style={{ backgroundColor: 'transparent', border: '2px solid #22c55e', color: '#22c55e', padding: '8px 20px', borderRadius: '8px', fontWeight: '700', fontSize: '15px', textDecoration: 'none', display: 'inline-block' }}>Dashboard</Link>
                  <button onClick={handleLogout} style={{ backgroundColor: 'transparent', border: '2px solid #ef4444', color: '#ef4444', padding: '8px 20px', borderRadius: '8px', fontWeight: '700', fontSize: '15px', textDecoration: 'none', display: 'inline-block', cursor: 'pointer' }}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" style={{ backgroundColor: 'transparent', border: '2px solid #22c55e', color: '#22c55e', padding: '8px 20px', borderRadius: '8px', fontWeight: '700', fontSize: '15px', textDecoration: 'none', display: 'inline-block' }}>Login</Link>
                  <Link to="/register" style={{ backgroundColor: '#22c55e', border: '2px solid #22c55e', color: '#ffffff', padding: '8px 20px', borderRadius: '8px', fontWeight: '700', fontSize: '15px', textDecoration: 'none', display: 'inline-block' }}>Register</Link>
                </>
              )}
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              style={{
                backgroundColor: '#181b25',
                border: '1px solid #374151',
                borderRadius: '8px',
                padding: '12px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                cursor: 'pointer',
                marginLeft: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
              }}
            >
              {isOpen ? (
                <div style={{ width: '28px', height: '22px', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '9px', left: '0', width: '28px', height: '4px', backgroundColor: '#e5e7eb', borderRadius: '4px', transform: 'rotate(45deg)', transition: 'transform 0.2s' }} />
                  <div style={{ position: 'absolute', top: '9px', left: '0', width: '28px', height: '4px', backgroundColor: '#e5e7eb', borderRadius: '4px', transform: 'rotate(-45deg)', transition: 'transform 0.2s' }} />
                </div>
              ) : (
                <>
                  <div style={{ width: '28px', height: '4px', backgroundColor: '#cbd5e1', borderRadius: '4px' }} />
                  <div style={{ width: '28px', height: '4px', backgroundColor: '#cbd5e1', borderRadius: '4px' }} />
                  <div style={{ width: '28px', height: '4px', backgroundColor: '#cbd5e1', borderRadius: '4px' }} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── marquee ticker ─── */}
      <MarqueeTicker />

      {/* ── full width expanded menu ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="navbar-mobile-menu absolute top-[88px] left-0 right-0 bg-[#07090f] border-b border-white/5 shadow-2xl z-50 overflow-hidden"
          >
            <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col items-center justify-center gap-8">
              {/* The Advanced CSS Menu inside Dropdown (now visible on all screens) */}
              <nav className="desktop-adv-nav w-full grid">
                {navLinks.map((link, i) => (
                  <Link key={i} to={link.to} id={`nav-item-${i}`} onClick={() => setIsOpen(false)}>
                    {link.label}
                  </Link>
                ))}
              </nav>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
