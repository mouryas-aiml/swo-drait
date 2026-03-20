import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  { id:1, src:'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80', title:'Opening Ceremony', fest:'Sanskrithi', year:'2025', span:'col-span-2' },
  { id:2, src:'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80', title:'Bharatanatyam', fest:'Kannada Kalarava', year:'2025' },
  { id:3, src:'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&q=80', title:'Battle of Bands', fest:'Sanskrithi', year:'2025' },
  { id:4, src:'https://images.unsplash.com/photo-1503095396549-807759245b35?w=600&q=80', title:'One Act Play', fest:'Sanskrithi', year:'2024' },
  { id:5, src:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', title:'Fashion Fiesta', fest:'Sanskrithi', year:'2025', span:'col-span-2' },
  { id:6, src:'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80', title:'Rangoli Competition', fest:'Kannada Kalarava', year:'2024' },
  { id:7, src:'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80', title:'Literary Events', fest:'Sanskrithi', year:'2024' },
  { id:8, src:'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80', title:'Cultural Workshop', fest:'Kannada Kalarava', year:'2025' },
  { id:9, src:'https://images.unsplash.com/photo-1431440869543-efaf3388c585?w=600&q=80', title:'Folk Dance', fest:'Kannada Kalarava', year:'2024', span:'col-span-2' },
];

const GalleryPage = () => {
  const [lightbox, setLightbox] = useState(null);
  const [filter, setFilter]     = useState('All');

  const filters = ['All', 'Kannada Kalarava', 'Sanskrithi', '2025', '2024'];
  const filtered = images.filter(img => filter === 'All' || img.fest === filter || img.year === filter);

  return (
    <div className="bg-surface min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="text-center mb-10">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-3">
            Event <span className="gradient-text-kalarava">Gallery</span>
          </h1>
          <p className="text-gray-400">Relive the magic of our past fests</p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${filter === f ? 'bg-kalarava-500 text-white' : 'glass text-gray-400 hover:text-white'}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 auto-rows-[200px]">
          {filtered.map((img, i) => (
            <motion.div
              key={img.id}
              layout
              initial={{ opacity:0, scale:0.9 }}
              animate={{ opacity:1, scale:1 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setLightbox(img)}
              className={`relative overflow-hidden rounded-2xl cursor-pointer group ${img.span || ''}`}
            >
              <img src={img.src} alt={img.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-end p-4">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white font-semibold text-sm">{img.title}</p>
                  <p className="text-gray-300 text-xs">{img.fest} · {img.year}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {lightbox && (
            <motion.div
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={() => setLightbox(null)}
            >
              <motion.div
                initial={{ scale:0.8 }} animate={{ scale:1 }} exit={{ scale:0.8 }}
                onClick={e => e.stopPropagation()}
                className="relative max-w-3xl w-full"
              >
                <img src={lightbox.src} alt={lightbox.title} className="w-full rounded-2xl" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-2xl">
                  <p className="text-white font-semibold text-lg">{lightbox.title}</p>
                  <p className="text-gray-300 text-sm">{lightbox.fest} · {lightbox.year}</p>
                </div>
                <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/80 flex items-center justify-center">✕</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GalleryPage;
