import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { HiEye, HiEyeOff } from 'react-icons/hi';

const LoginPage = () => {
  const { login }                                    = useAuth();
  const navigate                                     = useNavigate();
  const location                                     = useLocation();
  const [showPwd, setShowPwd]                        = useState(false);
  const [loading, setLoading]                        = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const from = location.state?.from || '/';

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data.email, data.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}! 👋`);
      const dashMap = { admin: '/admin', organizer: '/organizer', student: '/dashboard' };
      navigate(dashMap[user.role] || from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      {/* Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-10 -left-40 w-[500px] h-[500px] bg-kalarava-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-10 -right-40 w-[500px] h-[500px] bg-sanskrithi-600/15 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 justify-center mb-8 group">
          <div className="w-12 h-12 bg-gradient-to-br from-kalarava-500 to-kalarava-700 rounded-xl flex items-center justify-center shadow-glow-kalarava">
            <span className="text-white font-bold">SWO</span>
          </div>
          <div className="text-white">
            <div className="font-display font-bold text-lg">DRAIT Cultural</div>
            <div className="text-gray-500 text-xs">Student Portal</div>
          </div>
        </Link>

        <div className="glass-panel p-10 border-t border-white/20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent blur-2xl pointer-events-none" />
          <h1 className="font-display font-bold text-3xl text-white mb-2 tracking-tight">Welcome back 👋</h1>
          <p className="text-gray-400 text-sm mb-6">Sign in to your account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                {...register('email', { required: 'Email is required' })}
                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required' })}
                  className={`input-field pr-12 ${errors.password ? 'border-red-500' : ''}`}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  {showPwd ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading} className={`w-full btn-primary py-3.5 text-base ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 p-5 bg-white/[0.03] rounded-xl border border-white/10 backdrop-blur-sm">
            <p className="text-gray-400 text-xs mb-3 font-semibold uppercase tracking-wider">Demo Accounts</p>
            {[['admin@drait.edu','Admin'],['swo@drait.edu','Organizer'],['student@drait.edu','Student']].map(([em, role]) => (
              <button key={role} onClick={() => { document.querySelector('input[type=email]').value=em; }}
                className="block text-xs text-kalarava-400 hover:text-kalarava-300 transition-colors mb-0.5 text-left">
                {role}: <span className="font-mono">{em}</span> / password123
              </button>
            ))}
          </div>

          <p className="text-gray-500 text-sm text-center mt-5">
            No account? <Link to="/register" className="text-kalarava-400 hover:text-kalarava-300 font-medium">Create one</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
