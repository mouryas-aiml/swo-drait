import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/services';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';
import { HiUsers, HiCalendar, HiChartBar } from 'react-icons/hi';

const COLORS = ['#f18b0a', '#7b6ef5', '#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6'];

const AdminDashboard = () => {
  const { user }    = useAuth();
  const [stats, setStats]   = useState(null);
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]       = useState('overview');
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    adminService.getStats()
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (tab === 'users') {
      adminService.getUsers({ search: userSearch, page: 1, limit: 20 })
        .then(r => setUsers(r.data.users))
        .catch(() => {});
    }
  }, [tab, userSearch]);

  const toggleUser = async (id, name) => {
    try {
      const r = await adminService.toggleUser(id);
      setUsers(prev => prev.map(u => u._id === id ? r.data.user : u));
      toast.success(`${name} ${r.data.user.isActive ? 'activated' : 'deactivated'}`);
    } catch { toast.error('Failed to update user'); }
  };

  const updateRole = async (id, role) => {
    try {
      const r = await adminService.updateUserRole(id, role);
      setUsers(prev => prev.map(u => u._id === id ? r.data.user : u));
      toast.success('Role updated');
    } catch { toast.error('Failed to update role'); }
  };

  const TABS = [
    { id: 'overview', label: 'Overview', icon: HiChartBar },
    { id: 'users',    label: 'Users',    icon: HiUsers },
    { id: 'events',   label: 'Analytics',icon: HiCalendar },
  ];

  return (
    <div className="bg-surface min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="mb-8">
          <h1 className="text-white font-display font-bold text-3xl">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm">{user?.email} · Full system access</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all
                ${tab === t.id ? 'bg-kalarava-500 text-white' : 'glass text-gray-400 hover:text-white'}`}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {loading && <div className="grid grid-cols-4 gap-4">{[...Array(4)].map((_,i) => <div key={i} className="card h-28 animate-pulse" />)}</div>}

        {/* ── OVERVIEW ── */}
        {!loading && tab === 'overview' && stats && (
          <div className="space-y-6">
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Students', val: stats.stats.totalUsers, icon: '👥', color: 'from-blue-900/40 to-surface-card' },
                { label: 'Active Events', val: stats.stats.activeEvents, icon: '🎪', color: 'from-kalarava-950/60 to-surface-card' },
                { label: 'Registrations', val: stats.stats.totalRegistrations, icon: '✅', color: 'from-green-900/40 to-surface-card' },
                { label: 'Total Events', val: stats.stats.totalEvents, icon: '📋', color: 'from-purple-900/40 to-surface-card' },
              ].map(s => (
                <motion.div key={s.label} initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
                  className={`card p-5 bg-gradient-to-br ${s.color}`}>
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className="text-white font-bold text-3xl">{s.val}</div>
                  <div className="text-gray-400 text-sm mt-1">{s.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Fest Distribution */}
            {stats.festStats?.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card p-5">
                  <h3 className="text-white font-semibold mb-4">Registrations by Fest</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={stats.festStats} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={80} label={({_id, count}) => `${_id}: ${count}`}>
                        {stats.festStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#16162a', border: '1px solid #2a2a4a', borderRadius: 8, color: '#fff' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="card p-5">
                  <h3 className="text-white font-semibold mb-4">Events by Category</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={stats.categoryStats}>
                      <XAxis dataKey="_id" stroke="#6b7280" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: '#16162a', border: '1px solid #2a2a4a', borderRadius: 8, color: '#fff' }} />
                      <Bar dataKey="count" fill="#f18b0a" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Daily Registrations */}
            {stats.dailyRegistrations?.length > 0 && (
              <div className="card p-5">
                <h3 className="text-white font-semibold mb-4">Daily Registrations (Last 30 Days)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={stats.dailyRegistrations}>
                    <XAxis dataKey="_id" stroke="#6b7280" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#6b7280" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: '#16162a', border: '1px solid #2a2a4a', borderRadius: 8, color: '#fff' }} />
                    <Line type="monotone" dataKey="count" stroke="#7b6ef5" strokeWidth={2} dot={{ fill: '#7b6ef5', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Recent Registrations */}
            {stats.recentRegistrations?.length > 0 && (
              <div className="card p-5">
                <h3 className="text-white font-semibold mb-4">Recent Registrations</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-gray-400"><tr>
                      <th className="text-left py-2 pr-4">Student</th><th className="text-left pr-4">Event</th>
                      <th className="text-left pr-4">Fest</th><th className="text-left">Time</th>
                    </tr></thead>
                    <tbody>
                      {stats.recentRegistrations.map(r => (
                        <tr key={r._id} className="border-t border-surface-border/40 text-gray-300">
                          <td className="py-2 pr-4"><div>{r.user?.name}</div><div className="text-xs text-gray-500">{r.user?.usn}</div></td>
                          <td className="pr-4">{r.event?.title}</td>
                          <td className="pr-4"><span className={r.event?.festName === 'Kannada Kalarava' ? 'text-kalarava-400' : 'text-sanskrithi-400'}>{r.event?.festName}</span></td>
                          <td className="text-gray-500 text-xs">{new Date(r.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── USERS ── */}
        {tab === 'users' && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search users by name, email, or USN..." className="input-field flex-1" />
            </div>
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-surface-border text-gray-400"><tr>
                  <th className="text-left px-4 py-3">Name</th><th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">USN</th><th className="text-left px-4 py-3">Role</th>
                  <th className="text-left px-4 py-3">Status</th><th className="text-left px-4 py-3">Department</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} className="border-t border-surface-border/40 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-white font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-gray-400">{u.email}</td>
                      <td className="px-4 py-3 text-gray-400">{u.usn || '-'}</td>
                      <td className="px-4 py-3">
                        <select value={u.role} onChange={e => updateRole(u._id, e.target.value)}
                          className="bg-surface-muted border border-surface-border rounded-lg px-2 py-1 text-white text-xs">
                          <option value="student">Student</option>
                          <option value="organizer">Organizer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${u.isActive ? 'text-green-400 bg-green-500/10 border-green-500/30' : 'text-red-400 bg-red-500/10 border-red-500/30'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400">{u.department || '-'}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleUser(u._id, u.name)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${u.isActive ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}>
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
