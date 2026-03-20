import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import EventCard from '../components/EventCard';
import { eventService } from '../services/services';
import { HiSearch, HiX } from 'react-icons/hi';

const CATEGORIES = ['All', 'Dance', 'Music', 'Drama', 'Fashion', 'Literary', 'Fine Arts', 'Quiz', 'Other'];
const FESTS      = ['Both', 'Kannada Kalarava', 'Sanskrithi'];

const EventsPage = () => {
  const [searchParams] = useSearchParams();
  const [events, setEvents]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [total, setTotal]               = useState(0);
  const [search, setSearch]             = useState('');
  const [category, setCategory]         = useState(searchParams.get('category') || 'All');
  const [fest, setFest]                 = useState(searchParams.get('fest') || 'Both');
  const [page, setPage]                 = useState(1);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 12, page };
      if (category !== 'All') params.category = category;
      if (fest !== 'Both') params.fest = fest;
      if (search.trim()) params.search = search.trim();
      const { data } = await eventService.getEvents(params);
      setEvents(data.events);
      setTotal(data.total);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [category, fest, search, page]);

  // Debounce search
  useEffect(() => {
    const id = setTimeout(fetchEvents, 350);
    return () => clearTimeout(id);
  }, [fetchEvents]);

  const clearFilters = () => { setCategory('All'); setFest('Both'); setSearch(''); setPage(1); };
  const hasFilters   = category !== 'All' || fest !== 'Both' || search;

  return (
    <div className="bg-surface min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-3">
            All <span className="gradient-text-kalarava">Events</span>
          </h1>
          <p className="text-gray-400">Explore events from both Kannada Kalarava and Sanskrithi 2026</p>
        </motion.div>

        {/* Filters */}
        <div className="glass rounded-2xl p-5 mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="input-field pl-12"
            />
          </div>

          {/* Fest Toggle */}
          <div className="flex flex-wrap gap-2">
            {FESTS.map(f => (
              <button
                key={f}
                onClick={() => { setFest(f); setPage(1); }}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all
                  ${fest === f
                    ? f === 'Kannada Kalarava' ? 'bg-kalarava-500 text-white' : f === 'Sanskrithi' ? 'bg-sanskrithi-600 text-white' : 'bg-white/20 text-white'
                    : 'glass text-gray-300 hover:text-white'}`}
              >
                {f === 'Kannada Kalarava' ? '🪔 ' : f === 'Sanskrithi' ? '🎭 ' : ''}{f}
              </button>
            ))}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setPage(1); }}
                className={`px-4 py-1.5 rounded-lg text-sm transition-all
                  ${category === cat ? 'bg-kalarava-500/30 text-kalarava-300 border border-kalarava-500/50' : 'glass text-gray-400 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
            {hasFilters && (
              <button onClick={clearFilters} className="px-4 py-1.5 rounded-lg text-sm text-red-400 glass hover:bg-red-500/10 flex items-center gap-1">
                <HiX className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400 text-sm">
            {loading ? 'Loading...' : `Showing ${events.length} of ${total} events`}
          </p>
        </div>

        {/* Events Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="card h-96 animate-pulse">
                  <div className="h-48 bg-surface-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-surface-muted rounded w-3/4" />
                    <div className="h-3 bg-surface-muted rounded" />
                    <div className="h-3 bg-surface-muted rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-white text-xl font-semibold mb-2">No events found</h3>
              <p className="text-gray-400 mb-4">Try adjusting your filters or search terms</p>
              <button onClick={clearFilters} className="btn-outline">Clear Filters</button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {events.map((event, i) => (
                <EventCard key={event._id} event={event} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {!loading && total > 12 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: Math.ceil(total / 12) }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all
                  ${page === p ? 'bg-kalarava-500 text-white' : 'glass text-gray-400 hover:text-white'}`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
