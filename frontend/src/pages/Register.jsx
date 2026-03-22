import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { Mail, Lock, User, AlertCircle, Zap, ArrowRight, Shield, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const HERO_BG = '/assets/nexus_login_visual.png';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', formData);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-bg-obsidian flex items-center justify-center p-6 md:p-12 relative overflow-hidden pt-24 lg:pt-32">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-electric/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-neon/5 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-[1400px] h-full max-h-[85vh] lg:max-h-[820px] flex flex-col lg:flex-row gap-0 relative z-10 items-stretch shadow-4xl">

        {/* Left Panel: Visual Hub */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex-1 min-h-0 rounded-none overflow-hidden border border-ghost-border group order-2 lg:order-1"
        >
          <img
            src={HERO_BG}
            alt="Atmosphere"
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 group-hover:scale-105 transition-transform duration-[2s]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-obsidian via-bg-obsidian/40 to-transparent" />

          <div className="absolute bottom-0 left-0 p-10 lg:p-14 flex flex-col gap-6 w-full">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black tracking-[0.3em] uppercase w-fit backdrop-blur-md">
              <Zap size={14} className="text-primary-neon" />
              The Future Awaits
            </div>

            <div className="flex flex-col gap-4">
              <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white leading-[0.85] drop-shadow-2xl">
                Begin Your <br />
                <span className="italic text-primary-neon underline decoration-primary-neon/10 decoration-8 underline-offset-[-2px]">Odyssey.</span>
              </h1>
              <p className="text-lg lg:text-xl text-on-surface-variant max-w-lg font-medium leading-relaxed italic opacity-80">
                Join the most exclusive collective of event architects and explorers.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Panel: Auth Hub */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 bg-surface-panel rounded-none border border-ghost-border p-8 lg:p-12 flex flex-col justify-between order-1 lg:order-2 overflow-y-auto lg:overflow-visible"
        >
          <div className="flex flex-col gap-8 h-full">
            {/* Panel Header */}
            <div className="flex items-center gap-4">
              <img src="/assets/nexus_logo.png" alt="Logo" className="w-8 h-8 object-contain" />
              <span className="text-base font-black tracking-[0.25em] uppercase text-on-surface">
                NEXUS<span className="text-primary-neon">.</span>
              </span>
            </div>

            {/* Form Title */}
            <div className="space-y-1">
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter text-on-surface leading-none">New Identity</h2>
              <p className="text-on-surface-variant font-medium text-sm lg:text-base tracking-tight italic opacity-70">Initialize your account status within the nexus.</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-4 p-5 bg-error-neon/5 border border-error-neon/20 rounded-2xl text-error-neon text-[11px] font-black uppercase tracking-widest"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/60 ml-1 italic">Full Name</label>
                <div className="relative group">
                  <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary-neon transition-colors" />
                  <input
                    type="text"
                    className="input-nocturnal !bg-bg-obsidian/50 !border-ghost-border !rounded-2xl !pl-16 !py-5 font-bold text-base placeholder:text-on-surface-variant/20"
                    placeholder="Julian Thorne"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/60 ml-1 italic">Identity (Email)</label>
                <div className="relative group">
                  <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary-neon transition-colors" />
                  <input
                    type="email"
                    className="input-nocturnal !bg-bg-obsidian/50 !border-ghost-border !rounded-2xl !pl-16 !py-5 font-bold text-base placeholder:text-on-surface-variant/20"
                    placeholder="julian@nexus.dev"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/60 ml-1 italic">Secure Key</label>
                <div className="relative group">
                  <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary-neon transition-colors" />
                  <input
                    type="password"
                    className="input-nocturnal !bg-bg-obsidian/50 !border-ghost-border !rounded-2xl !pl-16 !py-5 font-bold text-base placeholder:text-on-surface-variant/20"
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/60 ml-1 italic">Node Permissions</label>
                <div className="relative group">
                  <Shield size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary-neon transition-colors pointer-events-none" />
                  <select
                    className="input-nocturnal !bg-bg-obsidian/50 !border-ghost-border !rounded-2xl !pl-16 !py-4 font-bold text-base appearance-none cursor-pointer"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="user" className="bg-bg-obsidian text-white">Standard Discovery</option>
                    <option value="admin" className="bg-bg-obsidian text-white">Organizer Status</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="btn-nocturnal w-full !rounded-2xl !py-5 mt-2 flex items-center justify-center gap-4 group disabled:opacity-50 !bg-primary-electric !text-white shadow-2xl shadow-primary-electric/20 hover:shadow-primary-electric/40"
                disabled={loading}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="uppercase tracking-[0.4em] text-[11px] font-black italic">Initialize Node</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer Info */}
          <div className="mt-4 pt-4 border-t border-ghost-border">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/50">
              Already initialized?
              <Link to="/login" className="ml-4 text-on-surface hover:text-primary-neon transition-colors decoration-primary-neon/20 underline underline-offset-[10px] decoration-1">
                Verify Access
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
