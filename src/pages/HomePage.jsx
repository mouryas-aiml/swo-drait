import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountdownTimer from '../components/CountdownTimer';
import EventCard from '../components/EventCard';
import { eventService } from '../services/services';
import { HiArrowRight, HiSparkles, HiLocationMarker, HiMail } from 'react-icons/hi';
import { FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';

/* ─────────────────────────── Floating particles canvas ─── */
const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let anim;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const COLORS = ['#f18b0a', '#7b6ef5', '#22c55e', '#f472b6', '#38bdf8', '#fde047'];
    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: -(Math.random() * 0.5 + 0.1),
      alpha: Math.random() * 0.6 + 0.2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life: Math.random() * 200,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.dx; p.y += p.dy; p.life++;
        if (p.y < -10 || p.life > 300) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + 10;
          p.life = 0;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (1 - p.life / 300);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      anim = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(anim); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="hp-canvas" />;
};

/* ─────────────────────────── Stat card ─── */
const StatCard = ({ value, label, icon, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="hp-stat-card"
  >
    <div className="hp-stat-icon">{icon}</div>
    <div className="hp-stat-value">{value}</div>
    <div className="hp-stat-label">{label}</div>
  </motion.div>
);

/* ─────────────────────────── Fest card ─── */
const FestCard = ({ fest, delay = 0 }) => {
  const isK = fest.id === 'kalarava';
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={`hp-fest-card ${isK ? 'hp-fest-kalarava' : 'hp-fest-sanskrithi'}`}
    >
      <div className="hp-fest-glow" />
      <div className="hp-fest-emoji">{isK ? '🪔' : '🎭'}</div>
      <span className={`hp-fest-date ${isK ? 'hp-date-k' : 'hp-date-s'}`}>
        {isK ? 'Apr 15–17, 2026' : 'Apr 22–24, 2026'}
      </span>
      <h3 className={`hp-fest-name ${isK ? 'hp-name-k' : 'hp-name-s'}`}>{fest.name}</h3>
      <p className={`hp-fest-tagline ${isK ? 'hp-tgl-k' : 'hp-tgl-s'}`}>{fest.tagline}</p>
      <p className="hp-fest-desc">{fest.description}</p>
      <div className="hp-fest-tags">
        {fest.tags.map(t => (
          <span key={t} className={`hp-tag ${isK ? 'hp-tag-k' : 'hp-tag-s'}`}>{t}</span>
        ))}
      </div>
      <Link to={`/events?fest=${encodeURIComponent(fest.name)}`} className={`hp-fest-link ${isK ? 'hp-link-k' : 'hp-link-s'}`}>
        Explore Events <HiArrowRight />
      </Link>
    </motion.div>
  );
};

/* ─────────────────────────── Category tile ─── */
const categories = [
  { icon: '💃', label: 'Dance', grad: 'hp-cat-pink' },
  { icon: '🎵', label: 'Music', grad: 'hp-cat-purple' },
  { icon: '🎭', label: 'Drama', grad: 'hp-cat-blue' },
  { icon: '👗', label: 'Fashion', grad: 'hp-cat-rose' },
  { icon: '📚', label: 'Literary', grad: 'hp-cat-green' },
  { icon: '🎨', label: 'Fine Arts', grad: 'hp-cat-yellow' },
  { icon: '❓', label: 'Quiz', grad: 'hp-cat-indigo' },
  { icon: '✨', label: 'Other', grad: 'hp-cat-gray' },
];

/* ─────────────────────────── Main component ─── */
const HomePage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#contact') {
      const el = document.getElementById('contact');
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } else if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  const KALARAVA_DATE = '2026-04-15T00:00:00';
  const SANSKRITHI_DATE = '2026-04-22T00:00:00';

  useEffect(() => {
    eventService.getEvents({ featured: true, limit: 6 })
      .then(r => setFeaturedEvents(r.data.events))
      .catch(() => { })
      .finally(() => setEventsLoading(false));
  }, []);

  const fests = [
    {
      id: 'kalarava', name: 'Kannada Kalarava',
      tagline: 'ಕನ್ನಡ ಕಲೆಯ ಮಹೋತ್ಸವ',
      description: 'A grand celebration of Kannada culture, heritage, and art. Classical dances, folk performances, Yakshagana, and more.',
      tags: ['Bharatanatyam', 'Folk Dance', 'Yakshagana', 'Haadu', 'Rangoli'],
    },
    {
      id: 'sanskrithi', name: 'Sanskrithi',
      tagline: 'Where Tradition Meets Creativity',
      description: "DRAIT's flagship inter-college fest featuring western dance, band battles, fashion shows, and literary events.",
      tags: ['Western Dance', 'Battle of Bands', 'Fashion Show', 'Drama', 'Debate'],
    },
  ];

  const galleryImages = [
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80',
    'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80',
    'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80',
    'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80',
    'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800&q=80',
  ];

  return (
    <div className="hp-root">

      {/* ══════════════ HERO ══════════════ */}
      <section className="hp-hero">
        {/* Animated BG */}
        <div className="hp-hero-bg">
          {/* Deep radial gradient */}
          <div className="hp-hero-gradient" />
          {/* Glowing orbs */}
          <div className="hp-orb hp-orb-1" />
          <div className="hp-orb hp-orb-2" />
          <div className="hp-orb hp-orb-3" />
          <div className="hp-orb hp-orb-4" />
          {/* Grid */}
          <div className="hp-grid" />
          {/* Diagonal light shafts */}
          <div className="hp-shaft hp-shaft-1" />
          <div className="hp-shaft hp-shaft-2" />
          {/* Floating particles */}
          <ParticleCanvas />
        </div>

        <div className="hp-hero-content">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="hp-badge">
              <HiSparkles className="hp-badge-icon" />
              Dr.AIT Student Welfare Organization Presents
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="hp-hero-title"
          >
            <span className="hp-title-kannada">Kannada</span>
            {' '}
            <span className="hp-title-kalarava">Kalarava</span>
            <span className="hp-title-amp">&</span>
            <span className="hp-title-sanskrithi">Sanskruthi</span>
            {' '}
            <span className="hp-title-year">2026</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="hp-hero-tagline"
          >
            Two magnificent cultural fests. Unlimited talent. One unforgettable experience.
            <br />
            <span className="hp-hero-college">Dr. Ambedkar Institute of Technology, Bangalore</span>
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="hp-hero-btns"
          >
            <Link to="/events" className="hp-btn-primary">Explore All Events →</Link>
            <Link to="/register" className="hp-btn-outline">Register Now</Link>
          </motion.div>

          {/* Dual countdown */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="hp-countdown-grid"
          >
            <div className="hp-countdown-card hp-cd-k">
              <p className="hp-cd-label hp-cd-label-k">🪔 Kannada Kalarava — April 15</p>
              <CountdownTimer targetDate={KALARAVA_DATE} colorClass="text-kalarava-400" />
            </div>
            <div className="hp-countdown-card hp-cd-s">
              <p className="hp-cd-label hp-cd-label-s">🎭 Sanskrithi — April 22</p>
              <CountdownTimer targetDate={SANSKRITHI_DATE} colorClass="text-sanskrithi-400" />
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="hp-scroll-indicator">
          <div className="hp-scroll-mouse"><div className="hp-scroll-dot" /></div>
          <span className="hp-scroll-text">Scroll to explore</span>
        </div>
      </section>

      {/* ══════════════ STATS ══════════════ */}
      <section className="hp-stats-section">
        <div className="hp-stats-inner">
          <StatCard value="12+" label="Events" icon="🎪" delay={0} />
          <StatCard value="500+" label="Participants" icon="👥" delay={0.07} />
          <StatCard value="₹1L+" label="Prize Pool" icon="🏆" delay={0.14} />
          <StatCard value="2" label="Grand Fests" icon="🎊" delay={0.21} />
        </div>
      </section>

      {/* ══════════════ FESTS ══════════════ */}
      <section className="hp-section hp-fests-section">
        <div className="hp-section-inner">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="hp-section-header">
            <h2 className="hp-section-title">Our <span className="hp-hl-k">Grand Fests</span></h2>
            <p className="hp-section-sub">Two distinct celebrations, each with its own unique identity and cultural richness</p>
          </motion.div>
          <div className="hp-fests-grid">
            {fests.map((f, i) => <FestCard key={f.id} fest={f} delay={i * 0.15} />)}
          </div>
        </div>
      </section>

      {/* ══════════════ CATEGORIES ══════════════ */}
      <section className="hp-section hp-cats-section">
        <div className="hp-section-inner">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="hp-section-header">
            <h2 className="hp-section-title">Event <span className="hp-hl-k">Categories</span></h2>
            <p className="hp-section-sub">Something for every talent</p>
          </motion.div>
          <div className="hp-cats-grid">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Link to={`/events?category=${cat.label}`} className={`hp-cat-tile ${cat.grad}`}>
                  <span className="hp-cat-icon">{cat.icon}</span>
                  <span className="hp-cat-label">{cat.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ FEATURED EVENTS ══════════════ */}
      <section className="hp-section hp-events-section">
        <div className="hp-section-inner">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="hp-events-header">
            <div>
              <h2 className="hp-section-title">Featured <span className="hp-hl-s">Events</span></h2>
              <p className="hp-section-sub">Don't miss these star-studded performances</p>
            </div>
            <Link to="/events" className="hp-view-all hidden md:flex">View All <HiArrowRight /></Link>
          </motion.div>

          {eventsLoading ? (
            <div className="hp-events-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="hp-skeleton-card">
                  <div className="hp-skeleton-img" />
                  <div className="hp-skeleton-body">
                    <div className="hp-skeleton-line hp-sk-lg" />
                    <div className="hp-skeleton-line hp-sk-md" />
                    <div className="hp-skeleton-line hp-sk-sm" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredEvents.length > 0 ? (
            <div className="hp-events-grid">
              {featuredEvents.map((e, i) => <EventCard key={e._id} event={e} index={i} />)}
            </div>
          ) : (
            <div className="hp-empty-events">
              <div className="hp-empty-icon">🎪</div>
              <p className="hp-empty-title">Featured events coming soon!</p>
              <p className="hp-empty-sub">Start the backend to see live data.</p>
              <Link to="/events" className="hp-btn-primary mt-4">Browse All Events</Link>
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link to="/events" className="hp-btn-outline">View All Events</Link>
          </div>
        </div>
      </section>

      {/* ══════════════ GALLERY ══════════════ */}
      <section className="hp-section hp-gallery-section">
        <div className="hp-section-inner">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="hp-events-header">
            <div>
              <h2 className="hp-section-title">Past <span className="hp-hl-k">Memories</span></h2>
              <p className="hp-section-sub">Relive the moments from our previous fests</p>
            </div>
            <Link to="/gallery" className="hp-view-all hidden md:flex">View Gallery <HiArrowRight /></Link>
          </motion.div>
          <div className="hp-gallery-grid">
            {galleryImages.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`hp-gallery-item ${i === 0 ? 'hp-gallery-wide' : ''}`}
              >
                <img src={src} alt={`Gallery ${i + 1}`} className="hp-gallery-img" />
                <div className="hp-gallery-overlay">🔍</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section className="hp-section hp-cta-section">
        <div className="hp-cta-inner">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="hp-cta-card">
            <div className="hp-cta-glow-k" />
            <div className="hp-cta-glow-s" />
            <div className="hp-cta-body">
              <div className="hp-cta-icon">🎪</div>
              <h2 className="hp-section-title">Ready to Shine?</h2>
              <p className="hp-cta-desc">Register for your favourite events and get your shot at the spotlight!</p>
              <div className="hp-hero-btns">
                <Link to="/events" className="hp-btn-primary px-10 py-4 text-base">Browse Events</Link>
                <Link to="/register" className="hp-btn-outline  px-10 py-4 text-base">Create Account</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════ CONTACT US ══════════════ */}
      <section id="contact" className="contact section">
        <div className="section-background">
          <div className="grid-overlay"></div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10 py-16">
          <div className="section-header text-center mb-12">
            <h2 className="section-title text-4xl font-bold text-white uppercase tracking-wide">
              Contact <span className="green text-[#22c55e]">Us</span>
            </h2>
          </div>

          <div className="contact-grid">
            {/* Map */}
            <div className="contact-map">
              <iframe
                title="Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.1278150063117!2d77.50345577593006!3d12.963672087350956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3e9c40000001%3A0x2d368cebf691c5fb!2sDr.%20Ambedkar%20Institute%20Of%20Technology!5e0!3m2!1sen!2sin!4v1761238580451!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '12px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Contact Info */}
            <div className="contact-info">
              <div className="contact-card">
                <div className="contact-icon">
                  <FaMapMarkerAlt />
                </div>
                <h3 className="text-white">Our Address</h3>
                <p>
                  Dr. Ambedkar Institute of Technology,<br />
                  Outer Ring Rd, near Gnana Bharathi,<br />
                  Naagarabhaavi, Bengaluru,<br />
                  Karnataka 560056
                </p>
              </div>

              <div className="contact-card">
                <div className="contact-icon">
                  <FaEnvelope />
                </div>
                <h3 className="text-white">Email Us</h3>
                <p>
                  <a href="mailto:astrava@drait.edu.in">astrava@drait.edu.in</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
