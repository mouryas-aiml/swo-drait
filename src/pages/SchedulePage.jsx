import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { eventService } from '../services/services';
import { HiLocationMarker, HiUsers, HiTable, HiViewList } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const CATEGORY_COLORS = {
  Dance:'bg-pink-500/20 border-pink-500/40 text-pink-300',
  Music:'bg-purple-500/20 border-purple-500/40 text-purple-300',
  Drama:'bg-blue-500/20 border-blue-500/40 text-blue-300',
  Fashion:'bg-rose-500/20 border-rose-500/40 text-rose-300',
  Literary:'bg-green-500/20 border-green-500/40 text-green-300',
  'Fine Arts':'bg-yellow-500/20 border-yellow-500/40 text-yellow-300',
  Quiz:'bg-indigo-500/20 border-indigo-500/40 text-indigo-300',
  Other:'bg-gray-500/20 border-gray-500/40 text-gray-300',
};

const SchedulePage = () => {
  const [schedule, setSchedule] = useState({ 1: [], 2: [], 3: [] });
  const [loading, setLoading]   = useState(true);
  const [day, setDay]           = useState(1);
  const [view, setView]         = useState('timeline'); // timeline | table
  const [fest, setFest]         = useState('Both');

  useEffect(() => {
    eventService.getSchedule({ festName: fest === 'Both' ? undefined : fest })
      .then(r => setSchedule(r.data.schedule))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [fest]);

  const dayEvents = schedule[day] || [];

  const dayLabels = {
    1: { kalarava: 'Day 1 – Apr 15', sanskrithi: 'Day 1 – Apr 22', both: 'Day 1' },
    2: { kalarava: 'Day 2 – Apr 16', sanskrithi: 'Day 2 – Apr 23', both: 'Day 2' },
    3: { kalarava: 'Day 3 – Apr 17', sanskrithi: 'Day 3 – Apr 24', both: 'Day 3' },
  };

  return (
    <div className="bg-surface min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="text-center mb-10">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-3">
            Event <span className="gradient-text-kalarava">Schedule</span>
          </h1>
          <p className="text-gray-400">Plan your day at the fests</p>
        </motion.div>

        {/* Controls */}
        <div className="glass rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Fest filter */}
          <div className="flex gap-2 flex-wrap">
            {['Both', 'Kannada Kalarava', 'Sanskrithi'].map(f => (
              <button key={f} onClick={() => { setFest(f); setLoading(true); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${fest === f ? (f === 'Kannada Kalarava' ? 'bg-kalarava-500 text-white' : f === 'Sanskrithi' ? 'bg-sanskrithi-600 text-white' : 'bg-white/20 text-white') : 'glass text-gray-300 hover:text-white'}`}>
                {f === 'Kannada Kalarava' ? '🪔 ' : f === 'Sanskrithi' ? '🎭 ' : ''}{f}
              </button>
            ))}
          </div>
          {/* View toggle */}
          <div className="flex gap-2 glass rounded-xl p-1">
            <button onClick={() => setView('timeline')} className={`p-2 rounded-lg transition-all ${view === 'timeline' ? 'bg-white/10 text-white' : 'text-gray-500'}`}><HiViewList className="w-5 h-5" /></button>
            <button onClick={() => setView('table')} className={`p-2 rounded-lg transition-all ${view === 'table' ? 'bg-white/10 text-white' : 'text-gray-500'}`}><HiTable className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Day tabs */}
        <div className="flex gap-3 mb-8">
          {[1, 2, 3].map(d => (
            <button key={d} onClick={() => setDay(d)}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${day === d ? 'bg-gradient-to-r from-kalarava-500 to-kalarava-600 text-white shadow-glow-kalarava' : 'glass text-gray-400 hover:text-white'}`}>
              {dayLabels[d][fest === 'Kannada Kalarava' ? 'kalarava' : fest === 'Sanskrithi' ? 'sanskrithi' : 'both']}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card h-24 animate-pulse flex items-center gap-4 p-5">
                <div className="w-16 h-16 bg-surface-muted rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-surface-muted rounded w-1/3" />
                  <div className="h-3 bg-surface-muted rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && dayEvents.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <div className="text-5xl mb-3">📅</div>
            <p>No events scheduled for this day yet.</p>
            <p className="text-sm mt-2">Events will be added by organizers soon.</p>
          </div>
        )}

        {/* Timeline View */}
        {!loading && view === 'timeline' && dayEvents.length > 0 && (
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-kalarava-500 to-sanskrithi-600 opacity-20" />
            <div className="space-y-4">
              {dayEvents.map((event, i) => {
                const isKalarava = event.festName === 'Kannada Kalarava';
                return (
                  <motion.div key={event._id}
                    initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay: i * 0.05 }}
                    className="flex gap-6 group"
                  >
                    {/* Timeline dot */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`w-4 h-4 rounded-full border-2 mt-5 ${isKalarava ? 'border-kalarava-500 bg-kalarava-500/20' : 'border-sanskrithi-500 bg-sanskrithi-500/20'}`} />
                    </div>
                    {/* Card */}
                    <div className={`card flex-1 p-5 group-hover:border-white/20 border-l-4 ${isKalarava ? 'border-l-kalarava-500' : 'border-l-sanskrithi-500'}`}>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border mr-2 ${CATEGORY_COLORS[event.category] || CATEGORY_COLORS.Other}`}>{event.category}</span>
                          <span className={`text-xs ${isKalarava ? 'text-kalarava-400' : 'text-sanskrithi-400'}`}>{isKalarava ? '🪔 Kalarava' : '🎭 Sanskrithi'}</span>
                          <h3 className="text-white font-semibold text-lg mt-1">{event.title}</h3>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-bold ${isKalarava ? 'text-kalarava-400' : 'text-sanskrithi-400'}`}>{event.startTime}</div>
                          {event.endTime && <div className="text-gray-500 text-xs">{event.endTime}</div>}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><HiLocationMarker className="text-kalarava-500" />{event.venue}</span>
                        <span className="flex items-center gap-1"><HiUsers className="text-kalarava-500" />{event.isGroup ? `Group ${event.minTeamSize}–${event.maxTeamSize}` : 'Solo'}</span>
                        {event.prizePool?.first && <span className="text-yellow-400">🏆 {event.prizePool.first}</span>}
                      </div>
                      <Link to={`/events/${event._id}`} className="inline-block mt-3 text-kalarava-400 hover:text-kalarava-300 text-sm font-medium transition-colors">View details →</Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Table View */}
        {!loading && view === 'table' && dayEvents.length > 0 && (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-surface-border">
                <tr className="text-left text-gray-400">
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Fest</th>
                  <th className="px-4 py-3">Venue</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Prize</th>
                </tr>
              </thead>
              <tbody>
                {dayEvents.map((event, i) => {
                  const isKalarava = event.festName === 'Kannada Kalarava';
                  return (
                    <tr key={event._id} className="border-b border-surface-border/50 hover:bg-white/5 transition-colors">
                      <td className={`px-4 py-3 font-bold ${isKalarava ? 'text-kalarava-400' : 'text-sanskrithi-400'}`}>{event.startTime}</td>
                      <td className="px-4 py-3">
                        <Link to={`/events/${event._id}`} className="text-white hover:text-kalarava-400 font-medium transition-colors">{event.title}</Link>
                      </td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs border ${CATEGORY_COLORS[event.category] || CATEGORY_COLORS.Other}`}>{event.category}</span></td>
                      <td className="px-4 py-3 text-xs">{isKalarava ? '🪔 Kalarava' : '🎭 Sanskrithi'}</td>
                      <td className="px-4 py-3 text-gray-400">{event.venue}</td>
                      <td className="px-4 py-3 text-gray-400">{event.isGroup ? `Group(${event.minTeamSize}–${event.maxTeamSize})` : 'Solo'}</td>
                      <td className="px-4 py-3 text-yellow-400 font-medium">{event.prizePool?.first || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePage;
