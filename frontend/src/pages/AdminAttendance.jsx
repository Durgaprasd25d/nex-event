import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, CheckCircle, XCircle, ArrowLeft, 
  Filter, Ticket, Mail, User, Check
} from 'lucide-react';
import api from '../api';

const AdminAttendance = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [attendees, setAttendees] = useState([]);
  const [filteredAttendees, setFilteredAttendees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState(null);
  const [stats, setStats] = useState({ total: 0, checkedIn: 0 });
  const [actionLoading, setActionLoading] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventRes, attendeesRes] = await Promise.all([
        api.get(`/events/${eventId}`),
        api.get(`/registrations/event/${eventId}`)
      ]);
      
      setEventData(eventRes.data);
      setAttendees(attendeesRes.data);
      setFilteredAttendees(attendeesRes.data);
      
      const checkedIn = attendeesRes.data.filter(a => a.isUsed).length;
      setStats({ total: attendeesRes.data.length, checkedIn });
    } catch (err) {
      console.error('Failed to fetch attendance data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = attendees.filter(a => 
      a.user.name.toLowerCase().includes(term) ||
      a.user.email.toLowerCase().includes(term) ||
      a._id.toLowerCase().includes(term)
    );
    setFilteredAttendees(filtered);
  }, [searchTerm, attendees]);

  const handleCheckIn = async (registrationId) => {
    try {
      setActionLoading(registrationId);
      await api.post(`/registrations/validate/${eventId}`, { registrationId });
      
      // Update local state
      setAttendees(prev => prev.map(a => 
        a._id === registrationId ? { ...a, isUsed: true, scannedAt: new Date() } : a
      ));
      
      setStats(prev => ({ ...prev, checkedIn: prev.checkedIn + 1 }));
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 2000);
    } catch (err) {
      console.error('Check-in failed:', err);
      alert(err.response?.data?.message || 'Failed to check-in attendee');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-bg-obsidian min-h-screen pt-32 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 border-4 border-surface-highest border-t-primary-neon rounded-full animate-spin mb-6"></div>
        <p className="text-primary-neon font-black uppercase tracking-[0.4em] animate-pulse">Loading Attendance...</p>
      </div>
    );
  }

  return (
    <div className="bg-bg-obsidian min-h-screen pt-28 pb-32">
      <div className="container max-w-4xl px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-3 bg-surface-highest/50 rounded-xl hover:bg-surface-highest transition-colors text-on-surface-variant"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="text-[10px] font-bold text-primary-neon uppercase tracking-[0.4em] mb-1">Attendance Control</div>
              <h2 className="text-2xl font-black text-white italic truncate max-w-md">{eventData?.title}</h2>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-4">
            <div className="px-6 py-3 bg-surface-highest/30 rounded-2xl border border-ghost-border flex flex-col items-center min-w-[100px]">
              <div className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Checked In</div>
              <div className="text-xl font-black text-primary-neon italic">{stats.checkedIn}</div>
            </div>
            <div className="px-6 py-3 bg-surface-highest/30 rounded-2xl border border-ghost-border flex flex-col items-center min-w-[100px]">
              <div className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Total Booked</div>
              <div className="text-xl font-black text-white italic">{stats.total}</div>
            </div>
            <div className="px-6 py-3 bg-primary-neon/10 rounded-2xl border border-primary-neon/30 flex flex-col items-center min-w-[100px]">
              <div className="text-[8px] font-bold text-primary-neon uppercase tracking-widest mb-1">Progress</div>
              <div className="text-xl font-black text-primary-neon italic">{Math.round((stats.checkedIn / stats.total) * 100) || 0}%</div>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-on-surface-variant">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Search by name, email, or Ticket ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-highest/40 border-2 border-ghost-border rounded-2xl py-4 pl-14 pr-6 focus:border-primary-neon/50 focus:outline-none transition-all text-white placeholder:text-on-surface-variant/50 font-bold tracking-wide"
          />
        </div>

        {/* Attendance List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredAttendees.length > 0 ? (
              filteredAttendees.map((attendee) => (
                <motion.div
                  key={attendee._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-5 rounded-3xl border-2 transition-all duration-300 flex items-center justify-between gap-4 ${
                    attendee.isUsed 
                    ? 'bg-primary-neon/5 border-primary-neon/20 opacity-80' 
                    : 'bg-surface-highest/20 border-ghost-border hover:border-surface-highest'
                  }`}
                >
                  <div className="flex items-center gap-5 overflow-hidden">
                    <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center ${
                      attendee.isUsed ? 'bg-primary-neon/20 text-primary-neon' : 'bg-surface-highest/50 text-on-surface-variant'
                    }`}>
                      <User size={24} />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-black text-white italic uppercase truncate tracking-tight">{attendee.user.name}</h4>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">
                        <span className="flex items-center gap-1.5"><Mail size={12} /> {attendee.user.email}</span>
                        <span className="hidden sm:flex items-center gap-1.5"><Ticket size={12} /> #{attendee._id.slice(-6)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {attendee.isUsed ? (
                      <div className="flex items-center gap-2 px-4 py-2 bg-primary-neon/10 rounded-xl text-primary-neon">
                        <Check size={16} strokeWidth={3} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Occupied</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCheckIn(attendee._id)}
                        disabled={actionLoading === attendee._id}
                        className="btn-nocturnal !py-2.5 !px-6 !rounded-xl !text-[10px] flex items-center gap-2"
                      >
                        {actionLoading === attendee._id ? (
                          <div className="w-3 h-3 border-2 border-primary-neon border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <CheckCircle size={14} />
                        )}
                        <span>Seat Guest</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center flex flex-col items-center gap-6 opacity-30"
              >
                <Users size={64} strokeWidth={1} />
                <p className="font-black uppercase tracking-[0.4em] text-xs">No entries found matching "{searchTerm}"</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 px-8 py-4 bg-primary-neon text-bg-obsidian rounded-2xl shadow-[0_0_30px_rgba(144,171,255,0.6)] flex items-center gap-3"
          >
            <CheckCircle size={24} strokeWidth={3} />
            <span className="font-black uppercase tracking-widest text-sm italic">Access Granted</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminAttendance;
