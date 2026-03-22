import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, ArrowRight, Zap } from 'lucide-react';

const EventCard = ({ event }) => {
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  const isSoldOut = event.registrationsCount >= event.capacity;

  return (
    <motion.div 
      className="glass-card flex flex-col h-full relative group transition-all duration-700 overflow-hidden border border-ghost-border hover:border-primary-neon/30 !p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
    >
      {/* Visual Header */}
      <div className="relative w-full aspect-video overflow-hidden rounded-lg mb-5 bg-surface-highest">
        <motion.img
          src={event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=600'}
          alt={event.title}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full object-cover transition-all duration-700 grayscale-[0.5] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-obsidian/80 via-transparent to-transparent pointer-events-none" />
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3 flex gap-2">
          {isSoldOut ? (
            <div className="px-2.5 py-1 bg-bg-obsidian/80 backdrop-blur-md border border-error-neon/20 rounded-full text-[9px] font-bold text-error-neon uppercase tracking-widest">
              Sold Out
            </div>
          ) : (
            <div className="px-2.5 py-1 bg-bg-obsidian/80 backdrop-blur-md border border-primary-neon/20 rounded-full text-[9px] font-bold text-primary-neon uppercase tracking-widest flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-primary-neon animate-pulse"></span>
               Live
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow">
        <div className="flex gap-2 mb-3.5 flex-wrap">
          {(event.tags || ['Featured']).slice(0, 2).map((tag, i) => (
            <span key={i} className="text-[9px] font-bold px-2 py-0.5 bg-surface-highest text-on-surface-variant rounded border border-ghost-border uppercase tracking-widest">
              {tag}
            </span>
          ))}
        </div>

        <h3 className="text-xl font-bold mb-2.5 tracking-tighter text-on-surface group-hover:text-primary-neon transition-colors duration-500 line-clamp-1 italic uppercase">
          {event.title}
        </h3>
        
        <p className="text-on-surface-variant text-xs leading-relaxed mb-5 flex-grow font-medium line-clamp-2">
          {event.description}
        </p>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 p-3 bg-bg-obsidian/40 rounded-lg border border-ghost-border">
          <div className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
            <Calendar size={13} className="text-primary-neon" /> 
            {formattedDate}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
            <MapPin size={13} className="text-primary-neon" /> 
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        <Link 
          to={`/event/${event._id}`} 
          className="btn-nocturnal w-full flex items-center justify-center gap-3 group relative overflow-hidden !py-3.5"
        >
          <span className="relative z-10 uppercase tracking-[0.3em] text-[10px] font-black italic">View Details</span>
          <ArrowRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

export default EventCard;
