import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  HiMenu, HiX,
} from 'react-icons/hi';
import toast from 'react-hot-toast';

/* ── nav links ─────────────────────────────────────────────── */
const navLinks = [
  { to: '/',         label: 'Home'     },
  { to: '/events',   label: 'Events'   },
  { to: '/schedule', label: 'Schedule' },
  { to: '/gallery',  label: 'Gallery'  },
  { to: '/about',    label: 'About'    },
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
          {/* RIGHT – hamburger only */}
          <div className="navbar-right">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="navbar-hamburger text-white bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-colors border border-white/10"
            >
              {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
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
            <div className="max-w-4xl mx-auto px-4 py-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`text-sm font-medium transition-colors
                    ${location.pathname === to
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'}`}
                >
                  {label}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link to={getDashboardPath()} className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">Login</Link>
                  <Link to="/register" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">Register</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
