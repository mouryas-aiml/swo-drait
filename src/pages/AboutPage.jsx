import React from 'react';
import { motion } from 'framer-motion';
import { HiLocationMarker, HiMail } from 'react-icons/hi';

const AboutPage = () => (
  <div className="bg-surface min-h-screen pt-24 pb-16 px-4">
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-3">About <span className="gradient-text-kalarava">DRAIT SWO</span></h1>
        <p className="text-gray-400 max-w-xl mx-auto">The Student Welfare Organization of Dr. Ambedkar Institute of Technology, Bangalore</p>
      </motion.div>

      {/* About College */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-panel p-8 mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-kalarava-500 to-sanskrithi-500" />
        <h2 className="text-white font-display font-bold text-2xl mb-4">🎓 About DRAIT</h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Dr. Ambedkar Institute of Technology (Dr.AIT), Bangaluru, is a premier engineering college affiliated to Visvesvaraya Technological University (VTU).
          With a strong academic tradition and vibrant campus life, DRAIT is known for producing well-rounded engineers who excel both technically and culturally.
        </p>
        <p className="text-gray-400 leading-relaxed">
          The Student Welfare Organization (SWO) is the backbone of all cultural and extracurricular activities on campus,
          organizing two magnificent annual fests that celebrate the spirit of art, culture, and youth.
        </p>
      </motion.div>

      {/* Fests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6 border-l-4 border-l-kalarava-500 hover:shadow-2xl hover:shadow-kalarava-500/20">
          <div className="text-4xl mb-3">🪔</div>
          <h3 className="text-white font-display font-bold text-xl mb-2 gradient-text-kalarava">Kannada Kalarava</h3>
          <p className="text-kalarava-400 text-sm font-kannada mb-3">ಕನ್ನಡ ಕಲೆಯ ಮಹೋತ್ಸವ</p>
          <p className="text-gray-400 text-sm leading-relaxed">
            A grand celebration of Karnataka's rich cultural heritage. From classical Bharatanatyam to vibrant folk dances,
            Yakshagana to Haadu Gaana — Kannada Kalarava is a tribute to the soul of Kannada art and tradition.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6 border-l-4 border-l-sanskrithi-500 hover:shadow-2xl hover:shadow-sanskrithi-500/20">
          <div className="text-4xl mb-3">🎭</div>
          <h3 className="text-white font-display font-bold text-xl mb-2 gradient-text-sanskrithi">Sanskrithi</h3>
          <p className="text-sanskrithi-400 text-sm mb-3">Where Tradition Meets Creativity</p>
          <p className="text-gray-400 text-sm leading-relaxed">
            DRAIT's flagship inter-college cultural extravaganza. Featuring western dance battles, battle of bands,
            fashion shows, drama, literary events, and much more — Sanskrithi is where talent takes center stage.
          </p>
        </motion.div>
      </div>

      {/* Team */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-panel p-8 mb-6">
        <h2 className="text-white font-display font-bold text-2xl mb-6">👥 SWO Team 2025–26</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: 'Prof. Chethan', role: 'Student Welfare Officer', dept: 'IEM' },
            { name: 'Mr. Mourya S', role: 'President, SW', dept: 'AIML – 3th Year' },
            { name: 'Priya Nair', role: 'Vice President', dept: 'ECE – 4th Year' },
            { name: 'Rahul Kumar', role: 'Cultural Head', dept: 'ISE – 3rd Year' },
            { name: 'Sneha Rao', role: 'Events Coordinator', dept: 'ME – 3rd Year' },
            { name: 'Kiran Reddy', role: 'Tech & Media', dept: 'CSE – 3rd Year' },
          ].map((m, i) => (
            <div key={i} className="glass rounded-xl p-4 hover:-translate-y-2 hover:shadow-xl hover:shadow-white/10 transition-all duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-kalarava-500 to-sanskrithi-600 rounded-full flex items-center justify-center text-white font-bold mb-3">
                {m.name.charAt(0)}
              </div>
              <div className="text-white font-medium text-sm">{m.name}</div>
              <div className="text-kalarava-400 text-xs">{m.role}</div>
              <div className="text-gray-500 text-xs">{m.dept}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Contact */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-16 mb-8">
        <h2 className="text-center font-display font-bold text-3xl md:text-4xl text-white mb-10 uppercase tracking-wide">
          Contact <span className="text-[#22c55e]">Us</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Left: Map */}
          <div className="rounded-2xl overflow-hidden glass-panel min-h-[400px]">
            <iframe
              title="Dr. AIT Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0827170196887!2d77.50508541531778!3d12.966547618501173!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3c32fd2b0ddf%3A0xe5a363d6b0409a63!2sDr.%20Ambedkar%20Institute%20Of%20Technology!5e0!3m2!1sen!2sin!4v1711204052069!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Right: Info Cards */}
          <div className="flex flex-col gap-6">
            {/* Address Card */}
            <div className="glass-panel p-8 flex flex-col items-start gap-5 flex-1 group hover:-translate-y-2 hover:border-green-500/30">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-green-400 text-2xl shadow-lg border border-green-500/30 group-hover:scale-110 group-hover:bg-green-500 group-hover:text-white transition-all duration-300 shrink-0">
                <HiLocationMarker />
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-bold text-xl">Our Address</h3>
                <p className="text-gray-300 leading-relax text-sm">
                  Dr. Ambedkar Institute of Technology,<br />
                  Outer Ring Rd, near Gnana Bharathi,<br />
                  Naagarabhaavi, Bengaluru,<br />
                  Karnataka 560056
                </p>
              </div>
            </div>

            {/* Email Card */}
            <div className="glass-panel p-8 flex flex-col items-start gap-5 flex-1 group hover:-translate-y-2 hover:border-green-500/30">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-green-400 text-2xl shadow-lg border border-green-500/30 group-hover:scale-110 group-hover:bg-green-500 group-hover:text-white transition-all duration-300 shrink-0">
                <HiMail />
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-bold text-xl">Email Us</h3>
                <a href="mailto:astrava@drait.edu.in" className="text-[#22c55e] font-medium hover:text-green-400 transition-colors block text-sm">
                  astrava@drait.edu.in
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
);
export default AboutPage;