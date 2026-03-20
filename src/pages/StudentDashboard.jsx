import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { registrationService } from '../services/services';
import { QRCodeCanvas } from 'qrcode.react';
import toast from 'react-hot-toast';
import { HiCalendar, HiLocationMarker, HiQrcode, HiX, HiDownload } from 'react-icons/hi';

const STATUS_COLORS = { confirmed:'text-green-400 bg-green-500/10 border-green-500/30', cancelled:'text-red-400 bg-red-500/10 border-red-500/30', pending:'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' };

const StudentDashboard = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [qrModal, setQrModal]             = useState(null);

  useEffect(() => {
    registrationService.getMyRegistrations()
      .then(r => setRegistrations(r.data.registrations))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cancelReg = async (id) => {
    if (!window.confirm('Cancel this registration?')) return;
    try {
      await registrationService.cancelRegistration(id);
      setRegistrations(prev => prev.map(r => r._id === id ? { ...r, status: 'cancelled' } : r));
      toast.success('Registration cancelled');
    } catch (err) { toast.error('Failed to cancel'); }
  };

  const downloadQR = () => {
    const canvas = document.getElementById('dash-qr');
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `pass-${qrModal?.registrationId}.png`;
    a.click();
  };

  return (
    <div className="bg-surface min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-kalarava-500 to-kalarava-700 flex items-center justify-center shadow-glow-kalarava">
              <span className="text-white font-bold text-xl">{user?.name?.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-white font-display font-bold text-2xl">Welcome, {user?.name?.split(' ')[0]}! 👋</h1>
              <p className="text-gray-400 text-sm">{user?.usn || user?.email} · {user?.department}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Registered Events', val: registrations.filter(r => r.status !== 'cancelled').length, icon: '🎪' },
            { label: 'Confirmed', val: registrations.filter(r => r.status === 'confirmed').length, icon: '✅' },
            { label: 'Kalarava Events', val: registrations.filter(r => r.event?.festName === 'Kannada Kalarava' && r.status !== 'cancelled').length, icon: '🪔' },
            { label: 'Sanskrithi Events', val: registrations.filter(r => r.event?.festName === 'Sanskrithi' && r.status !== 'cancelled').length, icon: '🎭' },
          ].map(s => (
            <div key={s.label} className="card p-5 text-center">
              <div className="text-3xl mb-1">{s.icon}</div>
              <div className="text-white font-bold text-2xl">{s.val}</div>
              <div className="text-gray-400 text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Registrations */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-xl">My Registrations</h2>
            <Link to="/events" className="text-kalarava-400 hover:text-kalarava-300 text-sm">+ Register for more</Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_,i) => <div key={i} className="card h-24 animate-pulse" />)}
            </div>
          ) : registrations.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="text-5xl mb-4">🎪</div>
              <p className="text-white font-semibold mb-2">No registrations yet</p>
              <p className="text-gray-400 text-sm mb-4">Browse events and register for the ones you love!</p>
              <Link to="/events" className="btn-primary">Browse Events</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {registrations.map((reg, i) => {
                const isKalarava = reg.event?.festName === 'Kannada Kalarava';
                return (
                  <motion.div key={reg._id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.05 }}
                    className={`card p-5 flex flex-col md:flex-row items-start md:items-center gap-4 border-l-4 ${isKalarava ? 'border-l-kalarava-500' : 'border-l-sanskrithi-500'}`}>
                    {/* Image */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isKalarava ? 'bg-kalarava-500/20' : 'bg-sanskrithi-500/20'}`}>
                      <span className="text-2xl">{isKalarava ? '🪔' : '🎭'}</span>
                    </div>
                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{reg.event?.title}</h3>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-1">
                        <span className="flex items-center gap-1"><HiCalendar />{reg.event?.date ? new Date(reg.event.date).toDateString() : 'TBD'}</span>
                        <span className="flex items-center gap-1"><HiLocationMarker />{reg.event?.venue}</span>
                        <span>ID: <span className={isKalarava ? 'text-kalarava-400' : 'text-sanskrithi-400'}>{reg.registrationId}</span></span>
                      </div>
                    </div>
                    {/* Status + Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full border capitalize ${STATUS_COLORS[reg.status] || ''}`}>{reg.status}</span>
                      {reg.status === 'confirmed' && (
                        <button onClick={() => setQrModal(reg)} className="p-2 glass rounded-lg text-kalarava-400 hover:bg-kalarava-500/10 transition-all" title="View QR Pass">
                          <HiQrcode className="w-4 h-4" />
                        </button>
                      )}
                      {reg.status !== 'cancelled' && (
                        <button onClick={() => cancelReg(reg._id)} className="p-2 glass rounded-lg text-red-400 hover:bg-red-500/10 transition-all" title="Cancel">
                          <HiX className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* QR Modal */}
      {qrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={() => setQrModal(null)}>
          <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} onClick={e => e.stopPropagation()}
            className="card p-8 text-center max-w-sm w-full">
            <h3 className="text-white font-bold text-lg mb-1">Entry Pass</h3>
            <p className="text-gray-400 text-sm mb-4">{qrModal.event?.title}</p>
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white rounded-2xl">
                <QRCodeCanvas id="dash-qr" value={qrModal.qrData || qrModal.registrationId} size={160} level="H" />
              </div>
            </div>
            <p className="text-kalarava-400 font-mono font-bold mb-4">{qrModal.registrationId}</p>
            <div className="flex gap-2">
              <button onClick={downloadQR} className="flex-1 flex items-center justify-center gap-2 btn-primary py-2.5 text-sm">
                <HiDownload /> Download
              </button>
              <button onClick={() => setQrModal(null)} className="flex-1 btn-outline py-2.5 text-sm">Close</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
