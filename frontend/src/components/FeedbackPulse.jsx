import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Zap, MessageSquare, Lock } from 'lucide-react';
import api from '../api';

const FeedbackPulse = ({ eventId, event, user }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !user) return;
    
    setLoading(true);
    try {
      await api.post(`/feedback/${eventId}`, { rating, comment });
      setSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Feedback submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel !py-12 text-center flex flex-col items-center gap-4 border-primary-neon/20"
      >
        <div className="w-16 h-16 rounded-full bg-primary-neon/10 flex items-center justify-center text-primary-neon shadow-[0_0_20px_rgba(144,171,255,0.2)]">
          <Zap size={32} />
        </div>
        <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Signal Received</h3>
        <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Your feedback has been integrated into the matrix pulse.</p>
      </motion.div>
    );
  }

  if (!user) {
    return (
      <div className="glass-card !bg-surface-low border-ghost-border !p-8 opacity-50">
        <div className="flex flex-col items-center gap-4 text-center">
           <Lock size={30} className="text-on-surface-variant" />
           <p className="text-[10px] font-black uppercase tracking-widest">Login to Provide Feedback</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card !bg-surface-low border-ghost-border !p-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-primary-neon/10 rounded-xl text-primary-neon border border-primary-neon/20">
          <Star size={20} />
        </div>
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Feedback Pulse</h3>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">Node Satisfaction Matrix</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex justify-center gap-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="relative group transition-transform hover:scale-125 disabled:opacity-50"
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
              disabled={loading}
            >
              <Star 
                size={32} 
                className={`transition-colors duration-300 ${
                  star <= (hover || rating) 
                  ? 'fill-primary-neon text-primary-neon filter drop-shadow-[0_0_8px_rgba(144,171,255,0.6)]' 
                  : 'text-surface-highest'
                }`} 
              />
            </button>
          ))}
        </div>

        <div className="relative">
          <div className="absolute top-4 left-4 text-on-surface-variant/40">
            <MessageSquare size={16} />
          </div>
          <textarea 
            placeholder="Additional telemetry feedback..." 
            className="w-full bg-bg-obsidian border border-ghost-border rounded-xl pl-12 pr-6 py-4 text-xs font-bold text-white placeholder:text-on-surface-variant/30 focus:border-primary-neon/30 outline-none transition-all uppercase tracking-widest min-h-[100px]"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={loading}
          />
        </div>

        <button 
          type="submit"
          disabled={!rating || loading}
          className="btn-nocturnal w-full !py-4 flex items-center justify-center gap-3 disabled:opacity-30 shadow-[0_0_20px_rgba(144,171,255,0.1)]"
        >
          {loading ? (
             <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
             <>
               <Zap size={16} />
               <span className="uppercase tracking-[0.2em] font-black text-xs">Transmit Feedback</span>
             </>
          )}
        </button>
      </form>
    </div>
  );
};

export default FeedbackPulse;
