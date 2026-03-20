import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiLocationMarker, HiClock, HiUsers, HiStar } from 'react-icons/hi';

const CATEGORY_COLORS = {
  Dance: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  Music: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Drama: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Fashion: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  Literary: 'bg-green-500/20 text-green-300 border-green-500/30',
  'Fine Arts': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  Sports: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  Quiz: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  Other: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
};

const CATEGORY_ICONS = {
  Dance: '💃', Music: '🎵', Drama: '🎭', Fashion: '👗',
  Literary: '📚', 'Fine Arts': '🎨', Sports: '⚽', Quiz: '❓', Other: '✨',
};

const PLACEHOLDER_IMAGES = {
  Dance: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80',
  Music: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80',
  Drama: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&q=80',
  Fashion: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  Literary: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80',
  'Fine Arts': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&q=80',
  Sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80',
  Quiz: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80',
  Other: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80',
};

const EventCard = ({ event, index = 0 }) => {
  const isKalarava = event.festName === 'Kannada Kalarava';
  const festColor = isKalarava ? 'badge-kalarava' : 'badge-sanskrithi';
  const imgSrc = event.image || PLACEHOLDER_IMAGES[event.category] || PLACEHOLDER_IMAGES.Other;
  const spotsLeft = event.maxParticipants - (event.currentParticipants || 0);
  const isFull = spotsLeft <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="glass-panel group cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imgSrc}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { e.target.src = PLACEHOLDER_IMAGES.Other; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-transparent" />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${festColor}`}>
            {isKalarava ? '🪔 Kalarava' : '🎉 Sanskrithi'}
          </span>
          {event.isFeatured && (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
              <HiStar className="inline w-3 h-3 mr-0.5" />Featured
            </span>
          )}
        </div>
        {/* Category */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${CATEGORY_COLORS[event.category] || CATEGORY_COLORS.Other}`}>
            {CATEGORY_ICONS[event.category]} {event.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-white font-display font-semibold text-lg mb-2 group-hover:text-kalarava-400 transition-colors truncate">
          {event.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-2 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <HiLocationMarker className="w-4 h-4 text-kalarava-500 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <HiClock className="w-4 h-4 text-kalarava-500 shrink-0" />
            <span>{event.startTime}{event.endTime ? ` – ${event.endTime}` : ''}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HiUsers className="w-4 h-4 text-kalarava-500" />
              <span>{event.isGroup ? `${event.minTeamSize}–${event.maxTeamSize} members` : 'Solo'}</span>
            </div>
            <span className={`text-xs font-medium ${isFull ? 'text-red-400' : 'text-green-400'}`}>
              {isFull ? 'Full' : `${spotsLeft} spots left`}
            </span>
          </div>
        </div>

        {/* Prize */}
        {event.prizePool?.first && (
          <div className="mt-3 pt-3 border-t border-surface-border flex items-center justify-between">
            <span className="text-gray-500 text-xs">1st Prize</span>
            <span className="text-kalarava-400 font-semibold text-sm">{event.prizePool.first}</span>
          </div>
        )}

        {/* CTA */}
        <Link
          to={`/events/${event._id}`}
          className={`mt-4 w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-all block
            ${isFull ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : isKalarava ? 'btn-primary' : 'btn-secondary'}`}
        >
          {isFull ? 'Event Full' : 'View & Register →'}
        </Link>
      </div>
    </motion.div>
  );
};

export default EventCard;
