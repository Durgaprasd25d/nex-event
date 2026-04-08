import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import EventCard from '../components/EventCard';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, MapPin, Users, ArrowRight, Trash2, Edit, ExternalLink, Activity,
  Zap, TrendingUp, Shield, ChevronLeft, Download, Clock, PieChart, QrCode
} from 'lucide-react';
import socket from '../utils/socket';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [selectedEventLogs, setSelectedEventLogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pulseCount, setPulseCount] = useState(142);

  const handleDownload = async (regId) => {
    try {
      const response = await api.get(`/registrations/${regId}/ticket`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `NEXUS-TICKET-${regId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to download ticket');
    }
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      if (isAdmin) {
        const { data } = await api.get('/events');
        setMyEvents(data.filter(e => (e.creator._id === user.id || e.creator === user.id)));
      } else {
        const { data } = await api.get('/registrations/my');
        setRegistrations(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, user.id]);

  useEffect(() => {
    fetchDashboardData();
    
    // Use shared singleton socket
    
    if (isAdmin) {
      // Listen for global pulse or specific events
      socket.on('seatScanned', (data) => {
        setPulseCount(prev => prev + 1);
        // If we are currently viewing this event's logs, update them
        setSelectedEventLogs(prev => {
          if (prev && prev.event._id === data.eventId) {
            return {
              ...prev,
              logs: [data, ...prev.logs]
            };
          }
          return prev;
        });
      });
    }

    const interval = setInterval(() => {
      setPulseCount(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 10000); // Slow down random pulse now that we have real data

    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
  }, [fetchDashboardData, isAdmin]);

  const viewParticipants = async (eventId) => {
    try {
      const { data } = await api.get(`/registrations/event/${eventId}`);
      setSelectedEventLogs({ event: myEvents.find(e => e._id === eventId), logs: data });
    } catch (err) {
      alert('Failed to fetch participants');
    }
  };

  const dashboardStats = [
    { label: isAdmin ? 'Events Hosted' : 'Events Joined', value: isAdmin ? myEvents.length : registrations.length, icon: Calendar, color: 'text-primary-neon' },
    { label: 'Security Level', value: user.role?.toUpperCase() === 'ADMIN' ? 'ORGANIZER' : 'GUEST', icon: Shield, color: 'text-primary-electric' },
    { label: 'Platform Status', value: 'ONLINE', icon: Activity, color: 'text-secondary-neon' },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-bg-obsidian">
       <div className="w-16 h-16 border-4 border-surface-highest border-t-primary-neon rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-bg-obsidian min-h-screen pb-32 pt-28">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16 border-b border-ghost-border pb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <div className="flex items-center gap-3 mb-4">
               <div className="w-1px h-6 bg-primary-neon"></div>
               <span className="text-[10px] font-bold text-primary-neon uppercase tracking-[0.4em]">Management Console</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none italic uppercase">
               Event Dashboard<span className="text-primary-neon">.</span>
            </h1>
            <p className="mt-6 text-on-surface-variant text-lg font-medium max-w-lg">
               {isAdmin ? `Welcome, ${user.name}. Overview of your hosted events.` : `Welcome, ${user.name}. Your upcoming event bookings.`}
            </p>
          </motion.div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel !py-4 !px-6 border-primary-neon/20 flex items-center gap-6 shadow-[0_0_30px_rgba(144,171,255,0.1)]"
            >
              <div className="relative">
                <Activity size={32} className="text-primary-neon" />
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-primary-neon rounded-full blur-md"
                />
              </div>
              <div>
                <div className="text-[9px] font-black text-primary-neon uppercase tracking-[0.3em] mb-1">Live Attendance</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white tracking-tighter italic">{pulseCount}</span>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase">Guests Present</span>
                </div>
              </div>
            </motion.div>

            {isAdmin && (
              <motion.button 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="btn-nocturnal flex items-center justify-center gap-4 group !py-5 !px-8" 
                  onClick={() => navigate('/create-event')}
              >
                  <span className="uppercase tracking-[0.2em] text-xs font-bold whitespace-nowrap">Create New Event</span>
                  <Zap size={18} className="group-hover:rotate-12 transition-transform" />
              </motion.button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {dashboardStats.map((stat, i) => (
            <motion.div 
               key={i} 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="glass-panel group hover:border-primary-neon/30 transition-all duration-500"
            >
              <div className="flex items-center gap-6">
                <div className={`p-4 rounded-xl bg-surface-highest ${stat.color} shadow-lg group-hover:shadow-primary-neon/20 transition-all`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{stat.label}</div>
                  <div className="text-3xl font-black text-white tracking-tighter italic">
                    {stat.value}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {selectedEventLogs ? (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="glass-card !bg-surface-low border-ghost-border !p-12 mb-12"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-12 mb-16 border-b border-ghost-border pb-12">
                <div className="flex-1">
                  <button
                    className="flex items-center gap-3 text-on-surface-variant hover:text-primary-neon transition-colors mb-8 font-bold text-[10px] uppercase tracking-[0.3em] group"
                    onClick={() => setSelectedEventLogs(null)}
                  >
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Console
                  </button>
                  <h2 className="text-4xl font-bold tracking-tighter text-white italic truncate max-w-2xl">{selectedEventLogs.event.title}</h2>
                  <p className="text-on-surface-variant font-medium mt-2">Live guest participation & seating report</p>
                </div>
                <div className="flex gap-4">
                  <button className="btn-secondary-glass !py-3 !px-6 text-[10px] font-bold tracking-widest uppercase">
                     <Download size={14} className="mr-2" /> Guest List Export
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-surface-highest">
                   <div className="inline-flex items-center gap-3 mb-6">
                      <Users size={16} className="text-primary-neon" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Validated Guests</span>
                   </div>
                   <table className="w-full border-separate border-spacing-y-4">
                    <thead>
                      <tr className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-left">
                        <th className="px-6 py-2">Guest Name</th>
                        <th className="px-4 py-2">Email Address</th>
                        <th className="px-4 py-2 text-center">Assigned Seat</th>
                        <th className="px-4 py-2 text-right">Check-in Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEventLogs.logs.map((reg, idx) => (
                        <tr key={idx} className="bg-bg-obsidian/40 hover:bg-surface-highest transition-colors rounded-xl border border-ghost-border relative group">
                          <td className="px-6 py-6 rounded-l-xl border-l border-y border-ghost-border group-hover:border-primary-neon/20 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-surface-highest flex items-center justify-center text-xs font-bold text-primary-neon border border-ghost-border shadow-inner uppercase tracking-wider">
                                {reg.user.name.substring(0,2)}
                              </div>
                              <span className="font-bold text-white tracking-tight">{reg.user.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-6 border-y border-ghost-border group-hover:border-primary-neon/20 transition-colors">
                             <span className="text-sm font-medium text-on-surface-variant/80">{reg.user.email}</span>
                          </td>
                          <td className="px-4 py-6 border-y border-ghost-border group-hover:border-primary-neon/20 transition-colors text-center">
                            <span className="px-3 py-1.5 bg-primary-neon/10 rounded-md text-primary-neon font-black text-xs border border-primary-neon/20 italic tracking-tighter">
                               SEAT-{reg.seatNumber}
                            </span>
                          </td>
                          <td className="px-6 py-6 border-y border-r border-ghost-border group-hover:border-primary-neon/20 transition-colors rounded-r-xl text-right">
                             <div className="flex items-center justify-end gap-2 text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">
                                <Clock size={12} className="text-primary-neon" />
                                {new Date(reg.createdAt).toLocaleDateString()}
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {selectedEventLogs.logs.length === 0 && (
                    <div className="text-center py-24 glass-panel flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-surface-highest flex items-center justify-center text-on-surface-variant/50 mb-6">
                         <Users size={32} />
                      </div>
                      <p className="text-lg font-bold text-on-surface-variant uppercase tracking-widest">No signals detected</p>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-4 flex flex-col gap-8">
                  <div className="glass-panel !py-10 !px-8 border-primary-neon/20 shadow-2xl shadow-primary-neon/5">
                    <div className="text-[10px] font-bold text-primary-neon uppercase tracking-widest mb-6 border-b border-primary-neon/10 pb-4">Event Capacity</div>
                    <div className="flex items-baseline gap-2 mb-8">
                      <h3 className="text-6xl font-black text-white tracking-tighter italic">{selectedEventLogs.logs.length}</h3>
                      <p className="text-2xl text-on-surface-variant/40 font-bold">/</p>
                      <p className="text-2xl text-on-surface-variant font-bold">{selectedEventLogs.event.capacity}</p>
                    </div>
                    <div className="w-full h-1.5 bg-surface-highest rounded-full overflow-hidden mb-4">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(selectedEventLogs.logs.length / selectedEventLogs.event.capacity) * 100}%` }}
                        className="h-full bg-gradient-to-r from-primary-electric to-primary-neon shadow-[0_0_15px_rgba(144,171,255,0.6)]" 
                      />
                    </div>
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest text-center mt-6 italic">
                       {Math.round((selectedEventLogs.logs.length / selectedEventLogs.event.capacity) * 100)}% Booked
                    </p>
                  </div>

                  <div className="glass-panel !py-8 !px-6 border-ghost-border flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                       <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Attendance Trends</div>
                       <TrendingUp size={14} className="text-primary-neon" />
                    </div>
                    <div className="h-24 w-full relative overflow-hidden bg-bg-obsidian/40 rounded-lg border border-ghost-border p-2">
                       <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40">
                          <motion.path 
                            d="M0,40 L0,30 Q25,10 50,30 T100,20 L100,40 Z" 
                            className="fill-primary-neon/10 stroke-primary-neon stroke-1"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 2 }}
                          />
                          <circle cx="50" cy="30" r="2" className="fill-primary-neon animate-pulse" />
                       </svg>
                    </div>
                    <p className="text-[9px] font-medium text-on-surface-variant leading-relaxed">
                       Live projection suggests <span className="text-primary-neon font-black italic">FULL CAPACITY</span> within 14 hours.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="catalog"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
            >
               <div className="flex items-center gap-4 mb-12">
                  <div className="w-12 h-[1px] bg-ghost-border"></div>
                  <h2 className="text-2xl font-bold tracking-[0.1em] text-white uppercase italic">
                     {isAdmin ? 'My Events' : 'My Bookings'}
                  </h2>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {isAdmin ? (
                    myEvents.map(event => (
                      <div key={event._id} className="flex flex-col gap-4 group">
                        <EventCard event={event} />
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            className="btn-nocturnal !py-3 !bg-surface-highest hover:!bg-primary-electric !text-white flex items-center justify-center gap-2 transition-all duration-500 rounded-xl"
                            onClick={() => viewParticipants(event._id)}
                          >
                            <Activity size={16} className="text-primary-neon group-hover:text-white" />
                            <span className="uppercase tracking-[0.2em] text-[10px] font-black">Analytics</span>
                          </button>
                          <Link
                            to={`/admin/attendance/${event._id}`}
                            className="btn-nocturnal !py-3 !bg-primary-neon/10 border border-primary-neon/20 hover:!bg-primary-neon !text-primary-neon hover:!text-bg-obsidian flex items-center justify-center gap-2 transition-all duration-500 rounded-xl"
                          >
                            <Users size={16} />
                            <span className="uppercase tracking-[0.2em] text-[10px] font-black">Attendance</span>
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    registrations.map(reg => (
                      <div key={reg._id} className="relative group">
                         <EventCard event={reg.event} />
                         <div className="absolute top-6 right-6 z-20">
                            <div className="px-5 py-2.5 bg-primary-electric border border-primary-neon shadow-[0_0_20px_rgba(49,107,243,0.5)] rounded-xl text-[10px] font-black tracking-[0.2em] text-white uppercase italic transform group-hover:-rotate-3 transition-transform">
                                 SEAT CODE: {reg.seatNumber}
                             </div>
                           </div>
                           <button 
                             onClick={() => handleDownload(reg._id)}
                             className="absolute bottom-6 right-6 z-20 btn-nocturnal !py-3 !px-6 !bg-bg-obsidian/80 backdrop-blur-md border border-ghost-border hover:border-primary-neon text-white flex items-center justify-center gap-2 group shadow-2xl"
                           >
                             <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
                             <span className="uppercase tracking-widest text-[9px] font-black">Get Ticket</span>
                           </button>
                      </div>
                    ))
                  )}

                  {((isAdmin && myEvents.length === 0) || (!isAdmin && registrations.length === 0)) && (
                    <div className="lg:col-span-3 py-32 text-center glass-panel border-dashed border-ghost-border opacity-50 flex flex-col items-center">
                       <Zap size={64} className="mb-6 text-on-surface-variant/30" />
                       <p className="text-xl font-bold text-on-surface-variant tracking-widest mb-10 uppercase italic">No Events Found</p>
                       <Link to="/" className="btn-nocturnal !px-12">Explore Events</Link>
                    </div>
                  )}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
