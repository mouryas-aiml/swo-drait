import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { eventService, registrationService } from '../services/services';
import { HiCheck, HiDownload } from 'react-icons/hi';
import { QRCodeCanvas } from 'qrcode.react';

const STEPS = ['Select Event', 'Your Details', 'Team Info', 'Review', 'Confirmation'];

const RegistrationPage = () => {
  const [searchParams]             = useSearchParams();
  const navigate                   = useNavigate();
  const { user, isAuthenticated }  = useAuth();
  const [step, setStep]            = useState(searchParams.get('event') ? 1 : 0);
  const [events, setEvents]        = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [participationType, setParticipationType] = useState('solo');
  const [teamMembers, setTeamMembers] = useState([{ name: '', usn: '', email: '', phone: '' }]);
  const [loading, setLoading]      = useState(false);
  const [registration, setRegistration] = useState(null);

  const { register } = useForm({
    defaultValues: {
      teamName: '',
    }
  });

  // Load events or pre-select from query
  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    const eventId = searchParams.get('event');
    if (eventId) {
      eventService.getEvent(eventId).then(r => {
        setSelectedEvent(r.data.event);
        setParticipationType(r.data.event.isGroup ? 'group' : 'solo');
        if (r.data.event.isGroup) {
          setTeamMembers(Array.from({ length: r.data.event.minTeamSize - 1 }, () => ({ name: '', usn: '', email: '', phone: '' })));
        }
        setStep(1);
      }).catch(() => {});
    } else {
      eventService.getEvents({ limit: 50 }).then(r => setEvents(r.data.events)).catch(() => {});
    }
  }, [isAuthenticated, navigate, searchParams]);

  const addMember = () => {
    if (teamMembers.length < (selectedEvent?.maxTeamSize || 10) - 1)
      setTeamMembers(prev => [...prev, { name: '', usn: '', email: '', phone: '' }]);
  };

  const removeMember = (i) => setTeamMembers(prev => prev.filter((_, idx) => idx !== i));

  const updateMember = (i, field, value) => {
    setTeamMembers(prev => prev.map((m, idx) => idx === i ? { ...m, [field]: value } : m));
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const vals = { teamName: register('teamName').value || '' };
      const payload = {
        eventId: selectedEvent._id,
        participationType,
        teamName: vals.teamName,
        teamMembers: participationType === 'group' ? teamMembers : [],
      };
      const { data } = await registrationService.register(payload);
      setRegistration(data.registration);
      setStep(4);
      toast.success('Registration successful! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const downloadQR = () => {
    const canvas = document.getElementById('qr-canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a   = document.createElement('a');
    a.href    = url;
    a.download= `pass-${registration?.registrationId}.png`;
    a.click();
  };

  const isKalarava = selectedEvent?.festName === 'Kannada Kalarava';

  return (
    <div className="bg-surface min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="text-center mb-10">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-2">
            Event <span className="gradient-text-kalarava">Registration</span>
          </h1>
          <p className="text-gray-400">Complete the steps below to register</p>
        </motion.div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-10 px-2">
          {STEPS.map((s, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                  ${i < step ? 'bg-green-500 text-white' : i === step ? (isKalarava ? 'bg-kalarava-500 text-white' : 'bg-sanskrithi-600 text-white') : 'bg-surface-muted text-gray-500'}`}>
                  {i < step ? <HiCheck className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs hidden md:block ${i === step ? 'text-white' : 'text-gray-500'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-green-500' : 'bg-surface-border'}`} />}
            </React.Fragment>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0: Select Event */}
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} className="card p-6">
              <h2 className="text-white font-semibold text-xl mb-4">Select an Event</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {events.map(ev => (
                  <button key={ev._id} onClick={() => { setSelectedEvent(ev); setParticipationType(ev.isGroup ? 'group' : 'solo'); setStep(1); }}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${selectedEvent?._id === ev._id ? 'border-kalarava-500 bg-kalarava-500/10' : 'border-surface-border hover:border-white/20 bg-surface-muted'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">{ev.title}</div>
                        <div className="text-gray-400 text-xs">{ev.festName} · {ev.category} · {ev.venue}</div>
                      </div>
                      <span className={ev.festName === 'Kannada Kalarava' ? 'badge-kalarava' : 'badge-sanskrithi'}>{ev.category}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 1: Your Details */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} className="space-y-4">
              {selectedEvent && (
                <div className={`rounded-2xl p-4 border ${isKalarava ? 'border-kalarava-500/30 bg-kalarava-950/40' : 'border-sanskrithi-500/30 bg-sanskrithi-950/40'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-xs font-semibold ${isKalarava ? 'text-kalarava-400' : 'text-sanskrithi-400'}`}>{selectedEvent.festName}</p>
                      <p className="text-white font-bold text-lg">{selectedEvent.title}</p>
                    </div>
                    <span className="text-gray-400 text-sm">{selectedEvent.venue}</span>
                  </div>
                </div>
              )}
              <div className="card p-6 space-y-4">
                <h2 className="text-white font-semibold text-xl">Your Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Full Name</label>
                    <input defaultValue={user?.name} className="input-field" readOnly />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">USN</label>
                    <input defaultValue={user?.usn} className="input-field" readOnly />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Email</label>
                    <input defaultValue={user?.email} className="input-field" readOnly />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Phone</label>
                    <input defaultValue={user?.phone} className="input-field" readOnly />
                  </div>
                </div>

                {/* Participation type */}
                {selectedEvent?.isGroup && (
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Participation Type</label>
                    <div className="flex gap-3">
                      {['solo', 'group'].map(t => (
                        <button key={t} onClick={() => setParticipationType(t)}
                          className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all capitalize
                            ${participationType === t ? 'border-kalarava-500 bg-kalarava-500/20 text-kalarava-300' : 'border-surface-border text-gray-400 hover:border-white/20'}`}>
                          {t === 'solo' ? '👤 Solo' : '👥 Group'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <button onClick={() => setStep(participationType === 'group' ? 2 : 3)} className={`w-full  py-3 rounded-xl font-semibold transition-all ${isKalarava ? 'btn-primary' : 'btn-secondary'}`}>
                  Continue →
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Team Members */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} className="card p-6 space-y-5">
              <div>
                <h2 className="text-white font-semibold text-xl mb-1">Team Members</h2>
                <p className="text-gray-500 text-sm">Add your team members (excluding yourself)</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Team Name</label>
                <input {...register('teamName')} placeholder="e.g. The Avengers" className="input-field" />
              </div>
              <div className="space-y-4">
                {teamMembers.map((m, i) => (
                  <div key={i} className="glass rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm font-medium">Member {i + 1}</span>
                      {teamMembers.length > 1 && (
                        <button onClick={() => removeMember(i)} className="text-red-400 text-xs hover:text-red-300">✕ Remove</button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input placeholder="Full Name *" value={m.name} onChange={e => updateMember(i, 'name', e.target.value)} className="input-field text-sm" />
                      <input placeholder="USN *" value={m.usn} onChange={e => updateMember(i, 'usn', e.target.value)} className="input-field text-sm" />
                      <input placeholder="Email" value={m.email} onChange={e => updateMember(i, 'email', e.target.value)} className="input-field text-sm" />
                      <input placeholder="Phone" value={m.phone} onChange={e => updateMember(i, 'phone', e.target.value)} className="input-field text-sm" />
                    </div>
                  </div>
                ))}
                {teamMembers.length < (selectedEvent?.maxTeamSize || 10) - 1 && (
                  <button onClick={addMember} className="w-full py-3 border-2 border-dashed border-surface-border text-gray-500 hover:border-kalarava-500 hover:text-kalarava-400 rounded-xl transition-all text-sm">
                    + Add Member
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 btn-outline">← Back</button>
                <button onClick={() => setStep(3)} className={`flex-1 py-3 rounded-xl font-semibold ${isKalarava ? 'btn-primary' : 'btn-secondary'}`}>Review →</button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} className="card p-6 space-y-5">
              <h2 className="text-white font-semibold text-xl">Review Registration</h2>
              <div className="glass rounded-xl p-4 space-y-3">
                <Row label="Event" val={selectedEvent?.title} />
                <Row label="Fest" val={selectedEvent?.festName} />
                <Row label="Venue" val={selectedEvent?.venue} />
                <Row label="Date" val={selectedEvent?.date ? new Date(selectedEvent.date).toDateString() : 'TBD'} />
                <Row label="Time" val={selectedEvent?.startTime} />
                <Row label="Your Name" val={user?.name} />
                <Row label="USN" val={user?.usn || '-'} />
                <Row label="Email" val={user?.email} />
                <Row label="Type" val={participationType} />
                {teamMembers.length > 0 && participationType === 'group' && (
                  <Row label="Team Members" val={teamMembers.filter(m => m.name).map(m => m.name).join(', ') || '-'} />
                )}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(participationType === 'group' ? 2 : 1)} className="flex-1 btn-outline">← Back</button>
                <button onClick={handleRegister} disabled={loading}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${isKalarava ? 'btn-primary' : 'btn-secondary'} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                  {loading ? 'Registering...' : '✅ Confirm Registration'}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 4 && registration && (
            <motion.div key="s4" initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} className="card p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <HiCheck className="w-10 h-10 text-green-400" />
              </div>
              <div>
                <h2 className="text-white font-display font-bold text-2xl mb-2">Registration Confirmed! 🎉</h2>
                <p className="text-gray-400">You're all set for <span className={isKalarava ? 'text-kalarava-400' : 'text-sanskrithi-400'}>{selectedEvent?.title}</span></p>
              </div>
              
              {/* Registration ID */}
              <div className={`py-4 px-6 rounded-2xl border ${isKalarava ? 'border-kalarava-500/30 bg-kalarava-950/40' : 'border-sanskrithi-500/30 bg-sanskrithi-950/40'}`}>
                <p className="text-gray-400 text-sm">Registration ID</p>
                <p className={`font-display font-bold text-xl ${isKalarava ? 'text-kalarava-400' : 'text-sanskrithi-400'}`}>{registration.registrationId}</p>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center gap-4">
                <p className="text-gray-400 text-sm">Your Entry Pass QR Code</p>
                <div className="p-4 bg-white rounded-2xl">
                  <QRCodeCanvas
                    id="qr-canvas"
                    value={registration.qrData || registration.registrationId}
                    size={180}
                    level="H"
                  />
                </div>
                <button onClick={downloadQR} className="flex items-center gap-2 btn-outline py-2 px-6 text-sm">
                  <HiDownload className="w-4 h-4" /> Download Pass
                </button>
              </div>

              <div className="flex gap-3">
                <button onClick={() => navigate('/dashboard')} className="flex-1 btn-outline">My Registrations</button>
                <button onClick={() => navigate('/events')} className={`flex-1 py-3 rounded-xl font-semibold ${isKalarava ? 'btn-primary' : 'btn-secondary'}`}>Browse More Events</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Row = ({ label, val }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-400">{label}</span>
    <span className="text-white font-medium capitalize">{val || '-'}</span>
  </div>
);

export default RegistrationPage;
