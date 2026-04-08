import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { Mail, Lock, AlertCircle, ArrowRight, Shield, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const HERO_BG = '/assets/nexus_login_visual.png';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', formData);
      if (data.needsVerification) {
        setShowOTP(true);
      } else {
        login(data.user, data.token);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { email: formData.email, otp });
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await api.post('/auth/resend-otp', { email: formData.email });
      setError('A fresh pulse has been emitted to your email.');
    } catch (err) {
      setError('Resend failed. Please wait.');
    }
  };

  return (
    <div className="min-h-screen bg-bg-obsidian flex items-center justify-center p-4 md:p-12 relative overflow-x-hidden pt-24 lg:pt-32">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-electric/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-neon/5 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-[1400px] lg:h-[780px] flex flex-col lg:flex-row gap-0 relative z-10 items-stretch shadow-4xl rounded-2xl overflow-hidden border border-ghost-border">

        {/* Left Panel: Visual Hub */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex-1 min-h-[300px] lg:min-h-0 overflow-hidden group"
        >
          <img
            src={HERO_BG}
            alt="Atmosphere"
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 group-hover:scale-105 transition-transform duration-[2s]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-obsidian via-bg-obsidian/40 to-transparent" />

          <div className="absolute bottom-0 left-0 p-8 lg:p-14 flex flex-col gap-6 w-full">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black tracking-[0.3em] uppercase w-fit backdrop-blur-md">
              <Shield size={14} className="text-primary-neon" />
              Identity Verification
            </div>

            <div className="flex flex-col gap-4">
              <h1 className="text-4xl lg:text-7xl font-black tracking-tighter text-white leading-[0.85] drop-shadow-2xl">
                {showOTP ? "Verify" : "Illuminate"} <br />
                Your <span className="italic text-primary-neon underline decoration-primary-neon/10 decoration-8 underline-offset-[-2px]">Ambition.</span>
              </h1>
              <p className="text-base lg:text-xl text-on-surface-variant max-w-lg font-medium leading-relaxed italic opacity-80">
                {showOTP ? "A secure pulse has been sent to your identity email." : "The sanctuary for world-class organizers and experience seekers."}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Panel: Auth Hub */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 bg-surface-panel p-8 lg:p-14 flex flex-col justify-between"
        >
          <div className="flex flex-col gap-8 lg:gap-12 h-full">
            {/* Panel Header */}
            <div className="flex items-center gap-4">
              <img src="/assets/nexus_logo.png" alt="Logo" className="w-8 h-8 object-contain" />
              <span className="text-lg font-black tracking-[0.25em] uppercase text-on-surface">
                NEXUS<span className="text-primary-neon">.</span>
              </span>
            </div>

            {/* Form Title */}
            <div className="space-y-2">
              <h2 className="text-4xl lg:text-6xl font-bold tracking-tighter text-on-surface leading-none">
                {showOTP ? "Pulse Auth" : "Welcome Back"}
              </h2>
              <p className="text-on-surface-variant font-medium text-base lg:text-lg tracking-tight italic opacity-70">
                {showOTP ? "Enter the 6-digit code to authorize access." : "Verify your credentials to enter the console."}
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex items-center gap-4 p-5 rounded-2xl text-[11px] font-black uppercase tracking-widest ${
                  error.includes('pulse') ? 'bg-primary-neon/5 border border-primary-neon/20 text-primary-neon' : 'bg-error-neon/5 border border-error-neon/20 text-error-neon'
                }`}
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            {!showOTP ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 lg:gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/60 ml-1 italic">Identity (Email)</label>
                  <div className="relative group">
                    <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary-neon transition-colors" />
                    <input
                      type="email"
                      className="input-nocturnal !bg-bg-obsidian/50 !border-ghost-border !rounded-2xl !pl-16 !py-5 font-bold text-base placeholder:text-on-surface-variant/20"
                      placeholder="name@nexus.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/60 ml-1 italic">Secure Key</label>
                  <div className="relative group">
                    <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary-neon transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="input-nocturnal !bg-bg-obsidian/50 !border-ghost-border !rounded-2xl !pl-16 !pr-14 !py-5 font-bold text-base placeholder:text-on-surface-variant/20"
                      placeholder="••••••••"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-primary-neon transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
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
                      <span className="uppercase tracking-[0.4em] text-[11px] font-black italic">Authenticate Node</span>
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="flex flex-col gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/60 ml-1 italic">Verification Pulse</label>
                  <input
                    type="text"
                    maxLength="6"
                    className="w-full bg-bg-obsidian/50 border-2 border-primary-neon/30 rounded-2xl py-8 text-center text-4xl font-black tracking-[0.5em] text-primary-neon focus:border-primary-neon focus:ring-0 outline-none transition-all"
                    placeholder="000000"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <div className="flex justify-between items-center px-1">
                    <button 
                      type="button"
                      onClick={handleResendOTP}
                      className="text-[10px] font-black uppercase tracking-widest text-primary-neon/60 hover:text-primary-neon transition-colors"
                    >
                      Resend Pulse
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowOTP(false)}
                      className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 hover:text-on-surface transition-colors"
                    >
                      Change Account
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-nocturnal w-full !rounded-2xl !py-5 flex items-center justify-center gap-4 group disabled:opacity-50 !bg-primary-neon !text-black shadow-2xl shadow-primary-neon/20 hover:shadow-primary-neon/40"
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="uppercase tracking-[0.4em] text-[11px] font-black italic font-bold">Verify Identity</span>
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-8 lg:mt-4 pt-4 border-t border-ghost-border">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/50">
              New to the ecosystem?
              <Link to="/register" className="ml-4 text-on-surface hover:text-primary-neon transition-colors decoration-primary-neon/20 underline underline-offset-[10px] decoration-1">
                Join the Collective
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
