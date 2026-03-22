import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api';
import EventCard from '../components/EventCard';
import { Search, Zap, Shield, Globe, BarChart3, Users, Calendar, ArrowRight, Activity } from 'lucide-react';

// Using the generated images moved to the public assets folder
const HERO_BG = '/assets/event_hero_bg_1773857873606.png';
const FEAT_NET = '/assets/feature_networking_1773857891636.png';
const FEAT_ANA = '/assets/feature_analytics_1773857910076.png';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get('/events');
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="container pt-32 md:pt-40"
    >
      {/* Hero Section */}
      <section className="relative mb-32 lg:mb-48">
        <div className="asymmetric-grid items-center">
          <motion.div variants={itemVariants} className="text-left flex flex-col gap-8">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary-electric/10 border border-primary-electric/20 rounded-full text-xs font-bold text-primary-neon tracking-[0.25em] uppercase w-fit">
              <Zap size={14} className="animate-pulse" />
               Event Excellence
            </div>
            
            <h1 className="hero-text">
               The Premier Platform for <br/>
               <span className="italic">Exclusive Events</span>
            </h1>
            
            <p className="text-lg md:text-xl text-on-surface-variant max-w-xl leading-relaxed font-medium">
               NEXUS is where design meets experience. Craft immersive digital environments, manage real-time attendance, and illuminate your brand.
            </p>

            <div className="glass-panel !p-2 flex flex-col sm:flex-row gap-2 max-w-xl shadow-2xl relative z-10">
              <div className="flex-1 flex items-center px-6 gap-4">
                <Search size={22} className="text-primary-neon opacity-70" />
                <input 
                  type="text" 
                  placeholder="Find your next experience..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none text-on-surface outline-none w-full text-lg font-medium placeholder:text-on-surface-variant/40"
                />
              </div>
              <button className="btn-nocturnal px-12 py-4 flex items-center gap-2 group">
                Explore <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="flex items-center gap-10 mt-4 h-16">
               <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-bg-obsidian bg-surface-highest overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-2 border-bg-obsidian bg-primary-electric flex items-center justify-center text-xs font-bold text-white">
                    +2k
                  </div>
               </div>
               <div className="text-sm font-semibold text-on-surface-variant leading-tight">
                  Trusted by <span className="text-on-surface font-bold">2,000+</span> <br/>
                  innovative organizations
               </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="relative group hidden lg:block">
            <div className="absolute -inset-10 bg-gradient-to-tr from-primary-electric/30 to-primary-neon/10 blur-[120px] rounded-full opacity-40 animate-pulse"></div>
            <div className="relative glass-panel !p-4 overflow-hidden transform rotate-2 group-hover:rotate-0 transition-all duration-1000">
              <img 
                src={HERO_BG} 
                alt="Event Dashboard Preview" 
                className="w-full rounded-[12px] shadow-2xl transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-obsidian/40 to-transparent pointer-events-none"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-40">
        {[
          { label: 'Active Events', value: `${events.length}+`, color: 'var(--primary-neon)' },
          { label: 'Total Attendees', value: '12k+', color: 'var(--primary-electric)' },
          { label: 'Global Stability', value: '99.9%', color: '#ff716c' },
          { label: 'Platform Trust', value: '4.9/5', color: '#10b981' }
        ].map((stat, i) => (
          <div key={i} className="glass-card flex flex-col gap-3 group">
            <div className="text-4xl md:text-5xl font-extrabold tracking-tighter" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em]">
              {stat.label}
            </div>
            <div className="mt-4 w-full h-[1px] bg-ghost-border group-hover:bg-primary-neon/20 transition-colors"></div>
          </div>
        ))}
      </motion.div>

      {/* Features Section */}
      <section className="mb-40">
        <div className="text-left mb-24 flex flex-col gap-6">
          <motion.h2 variants={itemVariants} className="text-5xl md:text-7xl font-black tracking-tighter max-w-3xl leading-[0.95]">
            Engineered for <br/> 
            <span className="text-primary-neon underline decoration-primary-neon/20 underline-offset-8">High Performance</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-xl text-on-surface-variant max-w-xl font-medium">
            We've distilled event management into a seamless, high-fidelity experience that scales with your ambition.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              title: 'Architectural Speed', 
              desc: 'Launch your event atmosphere in minutes with our intuitive builder tokens.',
              icon: <Zap size={28} />,
              img: null
            },
            { 
              title: 'Global Connectivity', 
              desc: 'Attract a nocturnal audience from all timezones with SEO-tuned event structures.',
              icon: <Globe size={28} />,
              img: FEAT_NET
            },
            { 
              title: 'Luminous Analytics', 
              desc: 'Track every interaction pulse with real-time data streams and telemetry.',
              icon: <BarChart3 size={28} />,
              img: FEAT_ANA
            }
          ].map((feat, i) => (
            <motion.div key={i} variants={itemVariants} className="glass-card flex flex-col gap-8 group hover:border-primary-neon/30">
              <div className="w-14 h-14 rounded-2xl bg-surface-highest flex items-center justify-center text-primary-neon group-hover:bg-primary-electric group-hover:text-white transition-all duration-500">
                {feat.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">{feat.title}</h3>
                <p className="text-on-surface-variant leading-relaxed font-medium">{feat.desc}</p>
              </div>
              {feat.img && (
                 <div className="mt-4 rounded-xl overflow-hidden border border-ghost-border h-40">
                    <img src={feat.img} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                 </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Events Grid */}
      <section id="events" className="scroll-mt-32 mb-40">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="flex flex-col gap-4">
             <div className="text-xs font-bold text-primary-neon uppercase tracking-[0.3em]">Curated Selection</div>
             <h2 className="text-5xl font-black tracking-tighter">Live Experiences</h2>
          </div>
          <div className="px-6 py-3 glass-panel !bg-surface-highest/20 text-sm font-bold text-on-surface flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-primary-neon animate-pulse"></span>
            {filteredEvents.length} Active Events
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-40">
             <div className="w-12 h-12 border-4 border-surface-highest border-t-primary-neon rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <motion.div key={event._id} variants={itemVariants}>
                  <EventCard event={event} />
                </motion.div>
              ))
            ) : (
              <div className="lg:col-span-3 glass-card !py-40 text-center flex flex-col items-center gap-8">
                <div className="w-24 h-24 rounded-full bg-surface-highest flex items-center justify-center text-on-surface-variant/20">
                   <Calendar size={48} />
                </div>
                <div>
                   <h3 className="text-3xl font-bold mb-2">No Active Events</h3>
                   <p className="text-on-surface-variant text-lg font-medium">The atmosphere is quiet. Try adjusting your exploration filters.</p>
                </div>
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="btn-secondary-glass"
                >
                   Clear Filters
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <motion.section 
        variants={itemVariants}
        className="mb-40 p-16 md:p-32 glass-panel !p-0 overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-electric to-primary-neon opacity-90"></div>
        <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.2)_0%,transparent_60%)] pointer-events-none" />
        
        <div className="relative z-10 text-center px-10 py-20 flex flex-col items-center gap-10">
           <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.85]">
              Ready to Craft <br className="hidden md:block"/>
              <span className="text-bg-obsidian italic">Immortality?</span>
           </h2>
           <p className="text-xl md:text-2xl text-white/90 max-w-2xl font-medium">
              Join the elite league of organizers already using NEXUS to illuminate their vision.
           </p>
           <button className="px-12 py-5 bg-bg-obsidian text-white font-black text-xl rounded-2xl shadow-3xl hover:scale-105 transition-transform flex items-center gap-3">
              Get Started Now <ArrowRight size={24} />
           </button>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Home;
