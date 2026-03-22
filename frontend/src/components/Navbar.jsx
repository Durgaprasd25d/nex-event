import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { 
  LogOut, User, LayoutDashboard, Sparkles, 
  Menu, X, Bell, Zap, Shield, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, text: "New event allocation available in Sector 7", type: 'alert' },
    { id: 2, text: "Live Pulse: 24 new participants joined the event", type: 'pulse' },
    { id: 3, text: "Event 'Design Summit' reaching saturation", type: 'warning' }
  ]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 nav-glass py-5 transition-all duration-300">
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center gap-4 no-underline group px-4">
          <img src="/assets/nexus_logo.png" alt="Nexus" className="w-8 h-8 object-contain shadow-glow" />
          <span className="text-xl font-black tracking-tighter text-on-surface">
            NEXUS<span className="text-primary-neon">.</span>
          </span>
        </Link>

          <div className="hidden md:flex items-center space-x-10">
            <Link to="/" className="text-[10px] font-black text-on-surface-variant hover:text-primary-neon tracking-[0.25em] uppercase transition-colors italic">Explore</Link>
            
            {user ? (
              <div className="flex items-center space-x-6">
                {/* Notification Pulse */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 bg-surface-highest/50 rounded-lg border border-ghost-border text-on-surface-variant hover:text-primary-neon hover:border-primary-neon/30 transition-all relative group"
                  >
                    <Bell size={18} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary-neon rounded-full animate-pulse shadow-[0_0_10px_rgba(144,171,255,0.8)]" />
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-80 glass-card !bg-surface-low border-primary-neon/20 shadow-2xl z-[100] !p-4"
                      >
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-neon">Live Activity</h4>
                          <Zap size={12} className="text-primary-neon" />
                        </div>
                        <div className="flex flex-col gap-3">
                          {notifications.map(n => (
                            <div key={n.id} className="p-3 bg-bg-obsidian/40 rounded-xl border border-ghost-border hover:border-primary-neon/10 transition-colors">
                              <p className="text-[11px] font-medium text-on-surface leading-relaxed italic">{n.text}</p>
                            </div>
                          ))}
                        </div>
                        <button className="w-full mt-4 py-2 bg-primary-neon/10 text-primary-neon text-[9px] font-bold uppercase tracking-widest rounded-lg border border-primary-neon/20 hover:bg-primary-neon/20 transition-all">
                          Clear All Updates
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link to="/dashboard" className="flex items-center gap-4 group">
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-0.5">{user.name}</span>
                    <div className={`px-2 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-widest italic flex items-center gap-1 ${
                      user.role === 'admin' 
                      ? 'bg-primary-neon/10 border-primary-neon/30 text-primary-neon shadow-[0_0_10px_rgba(144,171,255,0.2)]' 
                      : 'bg-primary-electric/10 border-primary-electric/30 text-primary-electric'
                    }`}>
                      {user.role === 'admin' ? <Shield size={8} /> : <Zap size={8} />}
                      {user.role === 'admin' ? 'Organizer' : 'Attendee'}
                    </div>
                  </div>
                  <div className="p-2 bg-primary-neon/10 rounded-lg border border-primary-neon/20 text-primary-neon group-hover:bg-primary-neon transition-all group-hover:text-bg-obsidian shadow-[0_0_15px_rgba(144,171,255,0.1)]">
                    <LayoutDashboard size={18} />
                  </div>
                </Link>
                {isAdmin && (
                  <Link to="/create-event" className="btn-nocturnal !px-5 !py-2 !text-xs uppercase tracking-wider flex items-center gap-2">
                    <Plus size={16} /> <span>Create</span>
                  </Link>
                )}
                <div className="w-[1px] h-5 bg-ghost-border hidden md:block" />
                <button 
                  onClick={handleLogout} 
                  className="btn-secondary-glass !p-2 flex items-center justify-center hover:text-error-neon hover:border-error-neon/30 transition-all"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-10">
                <Link to="/login" className="text-[10px] font-black text-on-surface-variant hover:text-primary-neon tracking-[0.25em] uppercase transition-colors italic">Sign In</Link>
                <Link to="/register" className="btn-nocturnal !px-8 !py-2.5 !text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary-electric/20">
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    );
  };
  
  export default Navbar;
