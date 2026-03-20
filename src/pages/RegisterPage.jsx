import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { HiEye, HiEyeOff } from 'react-icons/hi';

const departments = ['CSE','ISE','ECE','ME','CE','EEE','AI & ML','Data Science','Other'];
const years = ['1st Year','2nd Year','3rd Year','4th Year','Faculty','Other'];

const RegisterPage = () => {
  const { register: signup } = useAuth();
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await signup({ ...data, role: 'student' });
      toast.success(`Welcome to DRAIT Cultural Events, ${user.name.split(' ')[0]}! 🎉`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-16">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-10 -right-40 w-[500px] h-[500px] bg-sanskrithi-600/15 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '9s' }} />
        <div className="absolute -bottom-10 -left-40 w-[500px] h-[500px] bg-kalarava-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '11s' }} />
      </div>

      <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} className="w-full max-w-lg">
        <Link to="/" className="flex items-center gap-3 justify-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-kalarava-500 to-kalarava-700 rounded-xl flex items-center justify-center shadow-glow-kalarava">
            <span className="text-white font-bold">SWO</span>
          </div>
          <div className="text-white">
            <div className="font-display font-bold text-lg">DRAIT Cultural</div>
            <div className="text-gray-500 text-xs">Create Account</div>
          </div>
        </Link>

        <div className="glass-panel p-10 border-t border-white/20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent blur-2xl pointer-events-none" />
          <h1 className="font-display font-bold text-3xl text-white mb-2 tracking-tight">Join the Fest! 🎉</h1>
          <p className="text-gray-400 text-sm mb-6">Create your student account to register for events</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-gray-400 text-sm mb-1 block">Full Name *</label>
                <input type="text" placeholder="Rahul Kumar" {...register('name', { required: 'Name required' })} className={`input-field ${errors.name ? 'border-red-500' : ''}`} />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div className="col-span-2">
                <label className="text-gray-400 text-sm mb-1 block">Email Address *</label>
                <input type="email" placeholder="rahul@drait.edu" {...register('email', { required: 'Email required' })} className={`input-field ${errors.email ? 'border-red-500' : ''}`} />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">USN</label>
                <input type="text" placeholder="1DA22CS001" {...register('usn')} className="input-field" style={{ textTransform: 'uppercase' }} />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Phone</label>
                <input type="tel" placeholder="9876543210" {...register('phone')} className="input-field" />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Department</label>
                <select {...register('department')} className="input-field bg-surface-muted">
                  <option value="">Select...</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Year</label>
                <select {...register('year')} className="input-field bg-surface-muted">
                  <option value="">Select...</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-gray-400 text-sm mb-1 block">Password *</label>
                <div className="relative">
                  <input type={showPwd ? 'text' : 'password'} placeholder="Min. 6 characters"
                    {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 characters' } })}
                    className={`input-field pr-12 ${errors.password ? 'border-red-500' : ''}`} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                    {showPwd ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
              </div>
            </div>

            <button type="submit" disabled={loading} className={`w-full btn-primary py-3.5 text-base mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-gray-500 text-sm text-center mt-5">
            Already have an account? <Link to="/login" className="text-kalarava-400 hover:text-kalarava-300 font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
