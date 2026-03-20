import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { eventService, registrationService } from '../services/services';
import toast from 'react-hot-toast';
import { HiPlus, HiPencil, HiTrash, HiDownload, HiUsers } from 'react-icons/hi';

const OrganizerDashboard = () => {
  const { user }                        = useAuth();
  const [events, setEvents]             = useState([]);
  const [participants, setParticipants] = useState({});
  const [loading, setLoading]           = useState(true);
  const [showForm, setShowForm]         = useState(false);
  const [editEvent, setEditEvent]       = useState(null);
  const [expandedEv, setExpandedEv]     = useState(null);
  const [form, setForm]                 = useState({ title:'', festName:'Kannada Kalarava', category:'Dance', description:'', rules:'', venue:'', date:'', startTime:'', endTime:'', maxParticipants:50, isGroup:false, minTeamSize:1, maxTeamSize:5, prizeFirst:'', prizeSecond:'', prizeThird:'', day:1 });

  useEffect(() => {
    eventService.getEvents({ limit: 100 })
      .then(r => setEvents(r.data.events))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleInput = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const openForm = (ev = null) => {
    if (ev) {
      setEditEvent(ev);
      setForm({ title: ev.title, festName: ev.festName, category: ev.category, description: ev.description, rules: ev.rules?.join('\n') || '', venue: ev.venue, date: ev.date ? ev.date.split('T')[0] : '', startTime: ev.startTime, endTime: ev.endTime || '', maxParticipants: ev.maxParticipants, isGroup: ev.isGroup, minTeamSize: ev.minTeamSize || 1, maxTeamSize: ev.maxTeamSize || 5, prizeFirst: ev.prizePool?.first || '', prizeSecond: ev.prizePool?.second || '', prizeThird: ev.prizePool?.third || '', day: ev.day || 1 });
    } else { setEditEvent(null); setForm({ title:'', festName:'Kannada Kalarava', category:'Dance', description:'', rules:'', venue:'', date:'', startTime:'', endTime:'', maxParticipants:50, isGroup:false, minTeamSize:1, maxTeamSize:5, prizeFirst:'', prizeSecond:'', prizeThird:'', day:1 }); }
    setShowForm(true);
  };

  const saveEvent = async () => {
    if (!form.title || !form.venue || !form.description || !form.startTime || !form.date) { toast.error('Fill all required fields'); return; }
    try {
      const payload = { ...form, rules: form.rules.split('\n').filter(r => r.trim()), prizePool: { first: form.prizeFirst, second: form.prizeSecond, third: form.prizeThird }, date: new Date(form.date) };
      if (editEvent) { const r = await eventService.updateEvent(editEvent._id, payload); setEvents(prev => prev.map(e => e._id === editEvent._id ? r.data.event : e)); toast.success('Event updated!'); }
      else { const r = await eventService.createEvent(payload); setEvents(prev => [r.data.event, ...prev]); toast.success('Event created!'); }
      setShowForm(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving event'); }
  };

  const deleteEv = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try { await eventService.deleteEvent(id); setEvents(prev => prev.filter(e => e._id !== id)); toast.success('Deleted!'); }
    catch { toast.error('Error deleting'); }
  };

  const loadParticipants = async (eventId) => {
    if (expandedEv === eventId) { setExpandedEv(null); return; }
    setExpandedEv(eventId);
    if (!participants[eventId]) {
      try { const r = await registrationService.getParticipants(eventId); setParticipants(prev => ({ ...prev, [eventId]: r.data.registrations }));  }
      catch { toast.error('Failed to load participants'); }
    }
  };

  const exportCSV = async (eventId) => {
    try {
      const r = await registrationService.exportParticipants(eventId);
      const url = window.URL.createObjectURL(new Blob([r.data]));
      const a   = document.createElement('a');
      a.href    = url; a.download = `participants-${eventId}.csv`; a.click();
    } catch { toast.error('Export failed'); }
  };

  return (
    <div className="bg-surface min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white font-display font-bold text-3xl">Organizer Dashboard</h1>
            <p className="text-gray-400 text-sm">{user?.name} · {user?.email}</p>
          </div>
          <button onClick={() => openForm()} className="btn-primary flex items-center gap-2">
            <HiPlus className="w-5 h-5" /> New Event
          </button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-5 text-center"><div className="text-2xl mb-1">🎪</div><div className="text-white font-bold text-2xl">{events.length}</div><div className="text-gray-400 text-xs">Total Events</div></div>
          <div className="card p-5 text-center"><div className="text-2xl mb-1">🪔</div><div className="text-white font-bold text-2xl">{events.filter(e => e.festName === 'Kannada Kalarava').length}</div><div className="text-gray-400 text-xs">Kalarava</div></div>
          <div className="card p-5 text-center"><div className="text-2xl mb-1">🎭</div><div className="text-white font-bold text-2xl">{events.filter(e => e.festName === 'Sanskrithi').length}</div><div className="text-gray-400 text-xs">Sanskrithi</div></div>
          <div className="card p-5 text-center"><div className="text-2xl mb-1">👥</div><div className="text-white font-bold text-2xl">{events.reduce((s, e) => s + (e.currentParticipants || 0), 0)}</div><div className="text-gray-400 text-xs">Total Registrations</div></div>
        </div>

        {/* Event Create/Edit Form */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 pt-16 px-4 overflow-y-auto" onClick={() => setShowForm(false)}>
            <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} onClick={e => e.stopPropagation()}
              className="card p-6 w-full max-w-2xl mb-8">
              <h2 className="text-white font-bold text-xl mb-4">{editEvent ? 'Edit Event' : 'Create Event'}</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><label className="text-gray-400 text-sm mb-1 block">Title *</label><input name="title" value={form.title} onChange={handleInput} className="input-field" placeholder="Event title" /></div>
                <div><label className="text-gray-400 text-sm mb-1 block">Fest *</label><select name="festName" value={form.festName} onChange={handleInput} className="input-field bg-surface-muted"><option>Kannada Kalarava</option><option>Sanskrithi</option></select></div>
                <div><label className="text-gray-400 text-sm mb-1 block">Category *</label><select name="category" value={form.category} onChange={handleInput} className="input-field bg-surface-muted">{['Dance','Music','Drama','Fashion','Literary','Fine Arts','Quiz','Other'].map(c => <option key={c}>{c}</option>)}</select></div>
                <div className="col-span-2"><label className="text-gray-400 text-sm mb-1 block">Description *</label><textarea name="description" value={form.description} onChange={handleInput} rows={3} className="input-field resize-none" placeholder="Event description" /></div>
                <div className="col-span-2"><label className="text-gray-400 text-sm mb-1 block">Rules (one per line)</label><textarea name="rules" value={form.rules} onChange={handleInput} rows={3} className="input-field resize-none text-sm" placeholder="Rule 1&#10;Rule 2&#10;Rule 3" /></div>
                <div><label className="text-gray-400 text-sm mb-1 block">Venue *</label><input name="venue" value={form.venue} onChange={handleInput} className="input-field" placeholder="Main Auditorium" /></div>
                <div><label className="text-gray-400 text-sm mb-1 block">Day</label><select name="day" value={form.day} onChange={handleInput} className="input-field bg-surface-muted"><option value={1}>Day 1</option><option value={2}>Day 2</option><option value={3}>Day 3</option></select></div>
                <div><label className="text-gray-400 text-sm mb-1 block">Date *</label><input type="date" name="date" value={form.date} onChange={handleInput} className="input-field" /></div>
                <div><label className="text-gray-400 text-sm mb-1 block">Start Time *</label><input name="startTime" value={form.startTime} onChange={handleInput} className="input-field" placeholder="10:00 AM" /></div>
                <div><label className="text-gray-400 text-sm mb-1 block">End Time</label><input name="endTime" value={form.endTime} onChange={handleInput} className="input-field" placeholder="1:00 PM" /></div>
                <div><label className="text-gray-400 text-sm mb-1 block">Max Participants</label><input type="number" name="maxParticipants" value={form.maxParticipants} onChange={handleInput} className="input-field" /></div>
                <div className="flex items-center gap-2 pt-5"><input type="checkbox" name="isGroup" id="isGroup" checked={form.isGroup} onChange={handleInput} className="w-4 h-4" /><label htmlFor="isGroup" className="text-gray-300 text-sm">Group Participation</label></div>
                {form.isGroup && (<><div><label className="text-gray-400 text-sm mb-1 block">Min Team Size</label><input type="number" name="minTeamSize" value={form.minTeamSize} onChange={handleInput} className="input-field" /></div><div><label className="text-gray-400 text-sm mb-1 block">Max Team Size</label><input type="number" name="maxTeamSize" value={form.maxTeamSize} onChange={handleInput} className="input-field" /></div></>)}
                <div><label className="text-gray-400 text-sm mb-1 block">1st Prize</label><input name="prizeFirst" value={form.prizeFirst} onChange={handleInput} className="input-field" placeholder="₹5,000" /></div>
                <div><label className="text-gray-400 text-sm mb-1 block">2nd Prize</label><input name="prizeSecond" value={form.prizeSecond} onChange={handleInput} className="input-field" placeholder="₹3,000" /></div>
                <div><label className="text-gray-400 text-sm mb-1 block">3rd Prize</label><input name="prizeThird" value={form.prizeThird} onChange={handleInput} className="input-field" placeholder="₹1,500" /></div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowForm(false)} className="flex-1 btn-outline">Cancel</button>
                <button onClick={saveEvent} className="flex-1 btn-primary">{editEvent ? 'Update Event' : 'Create Event'}</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Events Table */}
        {loading ? (
          <div className="space-y-3">{[...Array(5)].map((_,i) => <div key={i} className="card h-16 animate-pulse" />)}</div>
        ) : (
          <div className="space-y-3">
            {events.map((ev, i) => {
              const isKalarava = ev.festName === 'Kannada Kalarava';
              const isExpanded = expandedEv === ev._id;
              return (
                <motion.div key={ev._id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.03 }}
                  className={`card border-l-4 ${isKalarava ? 'border-l-kalarava-500' : 'border-l-sanskrithi-500'}`}>
                  <div className="p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold">{ev.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${isKalarava ? 'badge-kalarava' : 'badge-sanskrithi'}`}>{ev.category}</span>
                      </div>
                      <p className="text-gray-400 text-xs">{ev.venue} · {ev.startTime} · Day {ev.day}</p>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-300">{ev.currentParticipants || 0}/{ev.maxParticipants} registered</span>
                      <button onClick={() => loadParticipants(ev._id)} className="p-2 glass rounded-lg text-blue-400 hover:bg-blue-500/10" title="Participants"><HiUsers className="w-4 h-4" /></button>
                      <button onClick={() => exportCSV(ev._id)} className="p-2 glass rounded-lg text-green-400 hover:bg-green-500/10" title="Export CSV"><HiDownload className="w-4 h-4" /></button>
                      <button onClick={() => openForm(ev)} className="p-2 glass rounded-lg text-yellow-400 hover:bg-yellow-500/10" title="Edit"><HiPencil className="w-4 h-4" /></button>
                      <button onClick={() => deleteEv(ev._id)} className="p-2 glass rounded-lg text-red-400 hover:bg-red-500/10" title="Delete"><HiTrash className="w-4 h-4" /></button>
                    </div>
                  </div>
                  {/* Participants List */}
                  {isExpanded && (
                    <div className="border-t border-surface-border p-4">
                      {!participants[ev._id] ? <p className="text-gray-500 text-sm">Loading...</p> :
                        participants[ev._id].length === 0 ? <p className="text-gray-500 text-sm">No registrations yet</p> : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                              <thead className="text-gray-400"><tr>
                                <th className="text-left py-2 pr-4">Name</th><th className="text-left pr-4">USN</th>
                                <th className="text-left pr-4">Email</th><th className="text-left pr-4">Phone</th>
                                <th className="text-left pr-4">Dept</th><th className="text-left pr-4">Type</th>
                                <th className="text-left">Reg ID</th>
                              </tr></thead>
                              <tbody>
                                {participants[ev._id].map(reg => (
                                  <tr key={reg._id} className="border-t border-surface-border/40 text-gray-300">
                                    <td className="py-2 pr-4 font-medium">{reg.user?.name}</td>
                                    <td className="pr-4">{reg.user?.usn || '-'}</td>
                                    <td className="pr-4">{reg.user?.email}</td>
                                    <td className="pr-4">{reg.user?.phone || '-'}</td>
                                    <td className="pr-4">{reg.user?.department || '-'}</td>
                                    <td className="pr-4 capitalize">{reg.participationType}</td>
                                    <td className="text-kalarava-400">{reg.registrationId}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )
                      }
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;
