import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import {
  Calendar, MapPin, Users, ArrowLeft, CheckCircle,
  Map as MapIcon, X, Check, Activity, Shield, Clock, Info, Share2, TrendingUp, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SeatMap from '../components/SeatMap';
import VirtualTicket from '../components/VirtualTicket';
import NodeDiscussion from '../components/NodeDiscussion';
import FeedbackPulse from '../components/FeedbackPulse';
import html2canvas from 'html2canvas';
import socket from '../utils/socket';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [userSeat, setUserSeat] = useState(null);
  const [showTicket, setShowTicket] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const [scannedSeats, setScannedSeats] = useState([]);
  const [isEntryExpired, setIsEntryExpired] = useState(false);

  const fetchEvent = useCallback(async () => {
    try {
      const { data } = await api.get(`/events/${id}`);
      setEvent(data);
      // Check if entry is expired
      if (data.entryCutoff && new Date() > new Date(data.entryCutoff)) {
        setIsEntryExpired(true);
      }

      // Fetch scanned seats for this event
      const regRes = await api.get(`/registrations/event/${id}`);
      const scanned = regRes.data.filter(r => r.isUsed).map(r => r.seatNumber);
      setScannedSeats(scanned);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const checkRegistration = useCallback(async () => {
    try {
      const { data } = await api.get('/registrations/my');
      const registered = data.find(reg => reg.event._id === id);
      if (registered) {
        setIsRegistered(true);
        setUserSeat(registered.seatNumber);
        setRegistrationData(registered);
      }
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
    if (user) checkRegistration();

    // Socket listeners
    socket.emit('joinEvent', id);
    socket.on('seatScanned', (data) => {
      if (data.eventId === id) {
        setScannedSeats(prev => [...new Set([...prev, data.seatNumber])]);
      }
    });

    return () => {
      socket.off('seatScanned');
    };
  }, [fetchEvent, checkRegistration, user, id]);

  const handleRegister = async () => {
    if (!user) return navigate('/login');
    if (!selectedSeat) return alert('Please select a seat');
    if (isEntryExpired) return alert('Entry for this event has closed.');

    setRegistering(true);
    try {
      const { data } = await api.post(`/registrations/${id}`, { seatNumber: selectedSeat });
      setIsRegistered(true);
      setUserSeat(selectedSeat);
      setRegistrationData(data);
      fetchEvent();
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  const shareEvent = async () => {
    const element = document.getElementById('event-hero-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#060e20',
        scale: 2
      });
      const link = document.createElement('a');
      link.download = `event-card-${id}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (err) {
      console.error('Share failed', err);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-bg-obsidian">
      <div className="w-16 h-16 border-4 border-surface-highest border-t-primary-neon rounded-full animate-spin"></div>
    </div>
  );

  if (!event) return (
    <div className="min-h-screen flex items-center justify-center bg-bg-obsidian">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-on-surface mb-4">Event Not Found</h2>
        <Link to="/" className="btn-secondary-glass">Return Explore</Link>
      </div>
    </div>
  );

  const availabilityPercentage = ((event.capacity - event.registrationsCount) / event.capacity) * 100;

  return (
    <div className="bg-bg-obsidian min-h-screen pb-20 pt-24">
      {/* Immersive Hero Header */}
      <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <div id="event-hero-content" className="absolute inset-0 z-0">
          <img
            src={event.image || 'https://images.unsplash.com/photo-1540575861501-7ad0586b2b93?auto=format&fit=crop&q=80&w=1200'}
            alt={event.title}
            className="w-full h-full object-cover scale-110 blur-[2px] opacity-40 grayscale-[0.3]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-obsidian via-bg-obsidian/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-bg-obsidian to-transparent" />
        </div>

        <div className="container relative z-10 h-full flex flex-col justify-end pb-20">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="group mb-12 flex items-center gap-2 text-on-surface-variant font-bold text-xs uppercase tracking-[0.3em] hover:text-primary-neon transition-colors"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Explore
          </motion.button>

          <div className="asymmetric-grid items-end">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col gap-6"
            >
              <div className="flex gap-3">
                {(event.tags?.length > 0 ? event.tags : ['Conference', 'Exclusive Event']).map((tag, i) => (
                  <span key={i} className="px-4 py-1.5 bg-primary-electric/20 border border-primary-electric/30 backdrop-blur-xl rounded-full text-[10px] font-bold text-primary-neon uppercase tracking-widest">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.9]">
                {event.title}
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden lg:flex justify-end"
            >
              <div className="flex flex-col gap-5 items-end">
                <div className={`glass-panel !p-8 flex flex-col gap-4 w-full ${isEntryExpired ? 'border-error-neon/20' : 'border-primary-neon/10'}`}>
                  <div className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Event Status</div>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isEntryExpired ? 'bg-error-neon/10 text-error-neon' : 'bg-primary-neon/10 text-primary-neon'}`}>
                      {isEntryExpired ? <Lock size={24} /> : <Clock size={24} />}
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white uppercase tracking-tighter">
                        {isEntryExpired ? 'Entry Closed' : 'Registration Open'}
                      </div>
                      <div className="text-xs font-medium text-on-surface-variant">
                        {isEntryExpired ? 'Maximum entry window exceeded' : 'Book your seat before it is full'}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={shareEvent}
                  className="flex items-center gap-3 py-3 px-6 bg-surface-highest/50 border border-ghost-border rounded-xl text-on-surface-variant hover:text-primary-neon hover:border-primary-neon/30 transition-all group"
                >
                  <Share2 size={16} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Share Event Details</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="container mt-[-60px] relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-20">
          {/* Main Content */}
          <div className="lg:col-span-8 flex flex-col gap-12">
            <div className="glass-card !bg-surface-low border-ghost-border !p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-primary-neon/10 rounded-xl text-primary-neon border border-primary-neon/20">
                  <Info size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Event Information</h3>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">Detailed Schedule & Overview</p>
                </div>
              </div>

              <div className="space-y-6 text-on-surface-variant font-medium leading-relaxed">
                <p className="text-lg text-white font-medium">{event.description}</p>
                <p>Welcome to an exclusive gathering designed for high-impact social and professional networking. All guests must provide their digital seat credentials at the entrance.</p>

                <div className="p-6 bg-bg-obsidian border border-ghost-border rounded-xl">
                  <div className="flex items-center gap-3 mb-4 text-white font-bold text-xs uppercase tracking-widest">
                    <Clock size={14} className="text-primary-neon" />
                    Dynamic Event Timeline
                  </div>
                  <ul className="space-y-3 text-[11px] font-bold uppercase tracking-wider">
                    {event.timeline?.length > 0 ? (
                      event.timeline.map((item, idx) => (
                        <li key={idx} className={`flex justify-between border-b border-white/5 pb-2 last:border-0 ${idx === 0 ? 'text-primary-neon' : ''}`}>
                          <span>{item.activity}</span>
                          <span className="italic">{item.time}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-on-surface-variant/40 italic">Timeline being finalized by organizer...</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <NodeDiscussion user={user} eventId={id} isRegistered={isRegistered} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-10">
            {/* Intel Panel */}
            <div className="glass-card !bg-surface-low border-ghost-border !p-6 flex flex-col gap-5">
              <h3 className="text-sm font-bold tracking-[0.3em] uppercase text-primary-neon mb-1 italic font-black">Event Logistics</h3>

              <div className="flex flex-col gap-3">
                <div className="flex gap-4 items-center p-3.5 bg-bg-obsidian/40 rounded-xl border border-ghost-border transition-colors hover:border-primary-neon/20">
                  <div className="p-2.5 bg-surface-highest rounded-lg text-primary-neon shadow-lg">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-0.5">Date & Time</div>
                    <div className="text-xs font-bold text-white">
                      {new Date(event.date).toLocaleString([], { dateStyle: 'long', timeStyle: 'short' })}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 items-center p-3.5 bg-bg-obsidian/40 rounded-xl border border-ghost-border transition-colors hover:border-primary-neon/20">
                  <div className="p-2.5 bg-surface-highest rounded-lg text-primary-neon shadow-lg">
                    <MapPin size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-0.5">Venue Location</div>
                    <div className="text-xs font-bold text-white truncate">{event.location}</div>
                  </div>
                </div>

                <div className="p-4 bg-bg-obsidian/40 rounded-xl border border-ghost-border">
                  <div className="flex justify-between items-center mb-2.5">
                    <div className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Attendance</div>
                    <div className="text-[9px] font-black text-primary-neon uppercase tracking-widest italic">
                      {Math.round(availabilityPercentage)}% Capacity Available
                    </div>
                  </div>
                  <div className="w-full h-1 bg-surface-highest rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${availabilityPercentage}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-primary-electric to-primary-neon"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel !py-10 !px-8 border-primary-neon/10">
              <div className="text-[10px] font-black text-primary-neon uppercase tracking-[0.3em] mb-8 border-b border-primary-neon/10 pb-4">Live Seating Status</div>
              <SeatMap
                rows={event.rows || 10}
                cols={event.cols || 10}
                bookedSeats={event.bookedSeats || []}
                scannedSeats={scannedSeats}
                onSelect={setSelectedSeat}
                selectedSeat={selectedSeat}
              />
              {!isRegistered && (
                <p className="mt-8 text-[9px] font-bold text-on-surface-variant uppercase tracking-widest text-center leading-relaxed">
                  Select an available <span className="text-primary-neon">seat unit</span> to reserve your spot.
                </p>
              )}
            </div>

            {/* Registration Console */}
            <div className="glass-card !bg-primary-neon/[0.03] border-primary-neon/20 !p-8 shadow-2xl shadow-primary-neon/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Shield size={120} strokeWidth={1} />
              </div>

              <h3 className="text-lg font-bold tracking-[0.2em] uppercase text-white mb-8 border-b border-white/10 pb-4">
                Reservation Center
              </h3>

              {!isRegistered ? (
                <div className="flex flex-col gap-8 relative z-10">
                  <div className={`flex justify-between items-center p-5 rounded-2xl border ${isEntryExpired ? 'bg-error-neon/5 border-error-neon/10' : 'bg-bg-obsidian/60 border-ghost-border'}`}>
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Seat Selected</span>
                    <span className={`text-2xl font-black tracking-tighter italic ${isEntryExpired ? 'text-error-neon' : 'text-primary-neon'}`}>
                      {isEntryExpired ? 'EXPIRED' : (selectedSeat || '---')}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      className="btn-nocturnal w-full !py-5 uppercase tracking-[0.2em] text-sm font-bold flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale transition-all"
                      onClick={handleRegister}
                      disabled={!selectedSeat || registering || isEntryExpired}
                    >
                      {registering ? (
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        isEntryExpired ? (
                          <>Entry Closed <Lock size={18} /></>
                        ) : availabilityPercentage <= 0 ? (
                          <>Join Waiting List <TrendingUp size={18} /></>
                        ) : (
                          <>Confirm Booking <Shield size={18} /></>
                        )
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-6 text-center py-4 relative z-10">
                  <div className="text-primary-neon font-black text-4xl italic tracking-tighter mb-2">
                    SEAT {userSeat}
                  </div>
                  <div className="p-4 bg-primary-neon/10 border border-primary-neon/20 rounded-xl text-primary-neon text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <Check size={16} /> Booking Finalized
                  </div>
                  <button
                    onClick={() => setShowTicket(true)}
                    className="btn-nocturnal !bg-surface-highest !text-on-surface hover:!bg-surface-high !py-4 !w-full !text-xs uppercase tracking-widest font-black italic mt-4"
                  >
                    View My Ticket
                  </button>
                </div>
              )}
            </div>

            <FeedbackPulse eventId={id} event={event} user={user} />
          </div>
        </div>
      </div>

      {/* Virtual Ticket Modal */}
      <AnimatePresence>
        {showTicket && registrationData && (
          <VirtualTicket
            event={event}
            registration={registrationData}
            onClose={() => setShowTicket(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventDetails;
