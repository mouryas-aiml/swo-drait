import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { eventService } from '../services/services';
import { useAuth } from '../context/AuthContext';
import { HiLocationMarker, HiClock, HiUsers, HiStar, HiChevronDown, HiChevronUp, HiCalendar, HiArrowLeft } from 'react-icons/hi';

const PLACEHOLDER_IMAGES = {
  Dance: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80',
  Music: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80',
  Drama: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80',
  Fashion:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  Default:'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
};

const EventDetailPage = () => {
  const { id }                    = useParams();
  const navigate                  = useNavigate();
  const { isAuthenticated } = useAuth();
  const [event, setEvent]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [rulesOpen, setRulesOpen] = useState(true);

  useEffect(() => {
    eventService.getEvent(id)
      .then(r => setEvent(r.data.event))
      .catch(() => navigate('/events'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return (
    <div className="min-h-screen bg-surface pt-24 px-4">
      <div className="max-w-4xl mx-auto animate-pulse space-y-4">
        <div className="h-80 bg-surface-card rounded-3xl" />
        <div className="h-8 bg-surface-card rounded w-3/4" />
        <div className="h-4 bg-surface-card rounded w-full" />
      </div>
    </div>
  );

  if (!event) return null;

  const isKalarava = event.festName === 'Kannada Kalarava';
  const imgSrc     = event.image || PLACEHOLDER_IMAGES[event.category] || PLACEHOLDER_IMAGES.Default;
  const spotsLeft  = event.maxParticipants - (event.currentParticipants || 0);
  const isFull     = spotsLeft <= 0;

  return (
    <div className="bg-surface min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors group">
          <HiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Events
        </button>

        {/* Hero Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-3xl overflow-hidden mb-8">
          <img src={imgSrc} alt={event.title} className="w-full h-72 md:h-96 object-cover" onError={e => { e.target.src = PLACEHOLDER_IMAGES.Default; }} />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={isKalarava ? 'badge-kalarava' : 'badge-sanskrithi'}>
                {isKalarava ? '🪔 Kannada Kalarava' : '🎭 Sanskrithi'}
              </span>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/10 text-white border border-white/20">{event.category}</span>
              {event.isFeatured && <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"><HiStar className="inline w-3 h-3 mr-0.5" />Featured</span>}
            </div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-white">{event.title}</h1>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Description */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="card p-6">
              <h2 className="text-white font-semibold text-xl mb-3">About this Event</h2>
              <p className="text-gray-400 leading-relaxed">{event.description}</p>
            </motion.div>

            {/* Rules */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="card overflow-hidden">
              <button
                onClick={() => setRulesOpen(!rulesOpen)}
                className="w-full flex items-center justify-between p-6 text-white hover:bg-white/5 transition-colors"
              >
                <h2 className="font-semibold text-xl">📋 Rules & Guidelines</h2>
                {rulesOpen ? <HiChevronUp className="w-5 h-5" /> : <HiChevronDown className="w-5 h-5" />}
              </button>
              {rulesOpen && (
                <div className="px-6 pb-6">
                  <ul className="space-y-2">
                    {event.rules?.length > 0 ? event.rules.map((rule, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-400 text-sm">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${isKalarava ? 'bg-kalarava-500/20 text-kalarava-400' : 'bg-sanskrithi-500/20 text-sanskrithi-400'}`}>{i + 1}</span>
                        {rule}
                      </li>
                    )) : <li className="text-gray-500">Rules will be announced soon.</li>}
                  </ul>
                </div>
              )}
            </motion.div>

            {/* Coordinators */}
            {event.coordinators?.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="card p-6">
                <h2 className="text-white font-semibold text-xl mb-4">📞 Coordinators</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {event.coordinators.map((coord, i) => (
                    <div key={i} className="glass rounded-xl p-4">
                      <div className="text-white font-medium">{coord.name}</div>
                      <div className="text-gray-400 text-sm">{coord.phone}</div>
                      <div className="text-gray-400 text-sm">{coord.email}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Event Info Card */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="card p-5 space-y-4">
              <h3 className="text-white font-semibold border-b border-surface-border pb-3">Event Details</h3>
              <InfoRow icon={<HiCalendar />} label="Date" value={event.date ? new Date(event.date).toDateString() : 'TBD'} />
              <InfoRow icon={<HiClock />} label="Time" value={`${event.startTime}${event.endTime ? ' – ' + event.endTime : ''}`} />
              <InfoRow icon={<HiLocationMarker />} label="Venue" value={event.venue} />
              <InfoRow icon={<HiUsers />} label="Participation" value={event.isGroup ? `Group (${event.minTeamSize}–${event.maxTeamSize})` : 'Solo'} />
              <InfoRow icon="🎟️" label="Entry Fee" value={event.entryFee > 0 ? `₹${event.entryFee}` : 'Free'} />
            </motion.div>

            {/* Prize Pool */}
            {(event.prizePool?.first || event.prizePool?.second) && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="card p-5">
                <h3 className="text-white font-semibold mb-4">🏆 Prize Pool</h3>
                {event.prizePool.first  && <PrizeRow pos="1st" val={event.prizePool.first}  color="text-yellow-400" />}
                {event.prizePool.second && <PrizeRow pos="2nd" val={event.prizePool.second} color="text-gray-300" />}
                {event.prizePool.third  && <PrizeRow pos="3rd" val={event.prizePool.third}  color="text-amber-600" />}
              </motion.div>
            )}

            {/* Spots */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="card p-5">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Spots Filled</span>
                <span className="text-white font-medium">{event.currentParticipants || 0}/{event.maxParticipants}</span>
              </div>
              <div className="w-full bg-surface-muted rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${isFull ? 'bg-red-500' : isKalarava ? 'bg-kalarava-500' : 'bg-sanskrithi-500'}`}
                  style={{ width: `${Math.min(((event.currentParticipants || 0) / event.maxParticipants) * 100, 100)}%` }}
                />
              </div>
              {!isFull && <p className="text-green-400 text-xs mt-2">{spotsLeft} spots remaining</p>}
            </motion.div>

            {/* Register CTA */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              {isFull ? (
                <div className="w-full py-4 rounded-xl text-center bg-gray-700 text-gray-500 font-semibold">Event Full</div>
              ) : !isAuthenticated ? (
                <Link to="/login" state={{ from: `/events/${id}` }} className={`block w-full py-4 rounded-xl text-center font-semibold transition-all ${isKalarava ? 'btn-primary' : 'btn-secondary'}`}>
                  Login to Register
                </Link>
              ) : (
                <Link to={`/register?event=${id}`} className={`block w-full py-4 rounded-xl text-center font-semibold transition-all ${isKalarava ? 'btn-primary' : 'btn-secondary'}`}>
                  Register for this Event →
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <span className={`${typeof icon === 'string' ? 'text-base' : 'w-4 h-4 text-kalarava-500'} mt-0.5`}>{icon}</span>
    <div>
      <div className="text-gray-500 text-xs">{label}</div>
      <div className="text-white text-sm">{value}</div>
    </div>
  </div>
);

const PrizeRow = ({ pos, val, color }) => (
  <div className="flex justify-between items-center py-2 border-b border-surface-border last:border-0">
    <span className="text-gray-400 text-sm">{pos} Place</span>
    <span className={`font-bold ${color}`}>{val}</span>
  </div>
);

export default EventDetailPage;
