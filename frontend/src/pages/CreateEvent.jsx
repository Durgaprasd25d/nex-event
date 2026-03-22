import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../api';
import { 
  Plus, Image as ImageIcon, MapPin, Calendar, Type, Users, Save, X, 
  ChevronRight, ChevronLeft, Zap, Activity, Box, LayoutGrid, Globe, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CreateEvent = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: '',
    image: null,
    imagePreview: null,
    rows: 10,
    cols: 10,
    tags: '',
    entryCutoff: '',
    timeline: [{ time: '18:00', activity: 'Doors Open' }]
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const addTimelineItem = () => {
    setFormData({
      ...formData,
      timeline: [...formData.timeline, { time: '', activity: '' }]
    });
  };

  const removeTimelineItem = (index) => {
    const newTimeline = formData.timeline.filter((_, i) => i !== index);
    setFormData({ ...formData, timeline: newTimeline });
  };

  const handleTimelineChange = (index, field, value) => {
    const newTimeline = [...formData.timeline];
    newTimeline[index][field] = value;
    setFormData({ ...formData, timeline: newTimeline });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ 
        ...formData, 
        image: file, 
        imagePreview: URL.createObjectURL(file) 
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('capacity', formData.capacity);
      formDataToSend.append('rows', formData.rows);
      formDataToSend.append('cols', formData.cols);
      formDataToSend.append('entryCutoff', formData.entryCutoff);
      formDataToSend.append('timeline', JSON.stringify(formData.timeline));
      
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      tagsArray.forEach(tag => formDataToSend.append('tags[]', tag));

      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      await api.post('/events', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="bg-bg-obsidian min-h-screen pt-32 pb-20 overflow-hidden relative">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-electric/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-neon/5 blur-[120px] pointer-events-none" />

      <div className="container max-w-4xl relative z-10">
        <div className="mb-16 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
               <div className="w-8 h-[1px] bg-primary-neon"></div>
               <span className="text-[10px] font-bold text-primary-neon uppercase tracking-[0.4em]">Event Setup</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white italic uppercase leading-none">
               Create <br className="md:hidden" /> Event<span className="text-primary-neon">.</span>
            </h1>
          </div>
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-4 bg-surface-low p-2 rounded-2xl border border-ghost-border shadow-inner">
             {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                   <div 
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all duration-500 border ${
                         step >= s 
                         ? 'bg-primary-neon/10 border-primary-neon text-primary-neon shadow-[0_0_15px_rgba(144,171,255,0.3)]' 
                         : 'bg-surface-highest border-ghost-border text-on-surface-variant/40'
                      }`}
                   >
                      0{s}
                   </div>
                   {s < 3 && <div className={`w-6 h-[1px] ${step > s ? 'bg-primary-neon' : 'bg-ghost-border'}`} />}
                </div>
             ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="glass-panel !p-12 space-y-12"
              >
                <div className="flex items-center gap-4 mb-4 border-b border-ghost-border pb-8">
                   <div className="w-12 h-12 rounded-xl bg-primary-neon/10 flex items-center justify-center text-primary-neon">
                      <Type size={20} />
                   </div>
                   <div>
                      <h3 className="text-xl font-bold text-white tracking-widest uppercase italic">Core Identity</h3>
                      <p className="text-on-surface-variant text-sm font-medium uppercase tracking-wider">Define the base parameters of your experience</p>
                   </div>
                </div>

                <div className="space-y-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] ml-1">Event Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-surface-low border border-ghost-border rounded-xl py-5 px-8 text-xl font-bold text-white outline-none focus:border-primary-neon/50 focus:bg-surface-highest transition-all placeholder:text-on-surface-variant/20 shadow-inner" 
                      placeholder="e.g. Neon Nights Rooftop Gathering" 
                      required 
                      value={formData.title} 
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] ml-1">Event Description</label>
                    <textarea
                      className="w-full bg-surface-low border border-ghost-border rounded-xl py-6 px-8 text-lg font-medium text-white outline-none focus:border-primary-neon/50 focus:bg-surface-highest transition-all min-h-[180px] resize-none placeholder:text-on-surface-variant/20 shadow-inner"
                      placeholder="Detail the event atmosphere and attendee experience..."
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] ml-1">Event Tags (Comma Separated)</label>
                    <div className="relative group">
                      <Globe size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary-neon transition-colors" />
                      <input 
                        type="text" 
                        className="w-full bg-surface-low border border-ghost-border rounded-xl py-5 pl-16 pr-8 text-sm font-bold text-white outline-none focus:border-primary-neon/50 focus:bg-surface-highest transition-all shadow-inner uppercase tracking-widest" 
                         placeholder="NETWORKING, TECHNOLOGY, ART, LONDON" 
                        value={formData.tags} 
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })} 
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8 flex justify-end">
                   <button 
                      type="button" 
                      onClick={nextStep}
                      className="btn-nocturnal flex items-center gap-4 group"
                   >
                      <span className="uppercase tracking-[0.2em] text-xs font-bold">Set Date & Venue</span>
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="glass-panel !p-12 space-y-12"
              >
                <div className="flex items-center gap-4 mb-4 border-b border-ghost-border pb-8">
                   <div className="w-12 h-12 rounded-xl bg-primary-neon/10 flex items-center justify-center text-primary-neon">
                      <LayoutGrid size={20} />
                   </div>
                   <div>
                      <h3 className="text-xl font-bold text-white tracking-widest uppercase italic">Logistics & Grid</h3>
                      <p className="text-on-surface-variant text-sm font-medium uppercase tracking-wider">Spatial and temporal mapping</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] ml-1">Event Start Time</label>
                    <div className="relative group">
                      <Calendar size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary-neon transition-colors" />
                      <input 
                        type="datetime-local" 
                        className="w-full bg-surface-low border border-ghost-border rounded-xl py-5 pl-16 pr-8 text-sm font-bold text-white outline-none focus:border-primary-neon/50 focus:bg-surface-highest transition-all shadow-inner" 
                        required 
                        value={formData.date} 
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })} 
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] ml-1">Entry Cutoff Time</label>
                    <div className="relative group">
                      <Clock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary-neon transition-colors" />
                      <input 
                        type="datetime-local" 
                        className="w-full bg-surface-low border border-ghost-border rounded-xl py-5 pl-16 pr-8 text-sm font-bold text-white outline-none focus:border-primary-neon/50 focus:bg-surface-highest transition-all shadow-inner" 
                        required 
                        value={formData.entryCutoff} 
                        onChange={(e) => setFormData({ ...formData, entryCutoff: e.target.value })} 
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] ml-1">Venue Location</label>
                    <div className="relative group">
                      <MapPin size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary-neon transition-colors" />
                      <input 
                        type="text" 
                        className="w-full bg-surface-low border border-ghost-border rounded-xl py-5 pl-16 pr-8 text-sm font-bold text-white outline-none focus:border-primary-neon/50 focus:bg-surface-highest transition-all shadow-inner" 
                        placeholder="Cyber Hub / Augmented Space" 
                        required 
                        value={formData.location} 
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] ml-1">Max Population (Capacity)</label>
                    <div className="relative group">
                      <Users size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary-neon transition-colors" />
                      <input 
                        type="number" 
                        className="w-full bg-surface-low border border-ghost-border rounded-xl py-5 pl-16 pr-8 text-sm font-bold text-white outline-none focus:border-primary-neon/50 focus:bg-surface-highest transition-all shadow-inner" 
                        placeholder="500" 
                        required 
                        value={formData.capacity} 
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] ml-1">Grid: Rows</label>
                      <input 
                        type="number" 
                        className="w-full bg-surface-low border border-ghost-border rounded-xl py-5 px-6 text-sm font-bold text-white outline-none focus:border-primary-neon/50 focus:bg-surface-highest transition-all shadow-inner text-center" 
                        value={formData.rows} 
                        onChange={(e) => setFormData({ ...formData, rows: parseInt(e.target.value) })} 
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] ml-1">Grid: Cols</label>
                      <input 
                        type="number" 
                        className="w-full bg-surface-low border border-ghost-border rounded-xl py-5 px-6 text-sm font-bold text-white outline-none focus:border-primary-neon/50 focus:bg-surface-highest transition-all shadow-inner text-center" 
                        value={formData.cols} 
                        onChange={(e) => setFormData({ ...formData, cols: parseInt(e.target.value) })} 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-10 border-t border-ghost-border">
                   <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-primary-neon uppercase tracking-[0.3em] ml-1 italic">Event Itinerary (Timeline)</label>
                      <button type="button" onClick={addTimelineItem} className="text-[9px] font-black text-white bg-primary-neon/10 border border-primary-neon/30 px-4 py-1.5 rounded-full uppercase tracking-widest hover:bg-primary-neon hover:text-bg-obsidian transition-all">
                         + Add Phase
                      </button>
                   </div>
                   
                   <div className="space-y-3">
                      {formData.timeline.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-end group">
                           <div className="w-24 shrink-0 space-y-2">
                              {idx === 0 && <label className="text-[8px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Time</label>}
                              <input 
                                type="text"
                                placeholder="18:00"
                                className="w-full bg-bg-obsidian border border-ghost-border rounded-lg py-2 px-3 text-[10px] font-bold text-white outline-none focus:border-primary-neon/30 transition-all uppercase"
                                value={item.time}
                                onChange={(e) => handleTimelineChange(idx, 'time', e.target.value)}
                              />
                           </div>
                           <div className="flex-1 space-y-2">
                              {idx === 0 && <label className="text-[8px] font-bold text-on-surface-variant/40 uppercase tracking-widest">Activity Name</label>}
                              <input 
                                type="text"
                                placeholder="Keynote Address"
                                className="w-full bg-bg-obsidian border border-ghost-border rounded-lg py-2 px-4 text-[10px] font-bold text-white outline-none focus:border-primary-neon/30 transition-all"
                                value={item.activity}
                                onChange={(e) => handleTimelineChange(idx, 'activity', e.target.value)}
                              />
                           </div>
                           <button type="button" onClick={() => removeTimelineItem(idx)} className="p-2.5 text-on-surface-variant/30 hover:text-error-neon transition-colors">
                              <X size={14} />
                           </button>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="pt-8 flex justify-between items-center">
                   <button type="button" onClick={prevStep} className="btn-secondary-glass flex items-center gap-3 !py-3 !px-6 text-[10px] uppercase tracking-widest font-bold">
                      <ChevronLeft size={16} /> Back to Identity
                   </button>
                   <button 
                      type="button" 
                      onClick={nextStep}
                      className="btn-nocturnal flex items-center gap-4 group"
                   >
                      <span className="uppercase tracking-[0.2em] text-xs font-bold">Add Event Banner</span>
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="glass-panel !p-12 space-y-12"
              >
                <div className="flex items-center gap-4 mb-4 border-b border-ghost-border pb-8">
                   <div className="w-12 h-12 rounded-xl bg-primary-neon/10 flex items-center justify-center text-primary-neon">
                      <ImageIcon size={20} />
                   </div>
                   <div>
                      <h3 className="text-xl font-bold text-white tracking-widest uppercase italic">Visual Identity</h3>
                      <p className="text-on-surface-variant text-sm font-medium uppercase tracking-wider">Holographic projection & branding</p>
                   </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] ml-1">Artifact Projection (Banner)</label>
                    <div 
                       onClick={() => document.getElementById('image-upload').click()}
                       className={`w-full aspect-video rounded-2xl border-2 border-dashed transition-all cursor-pointer relative overflow-hidden flex flex-col items-center justify-center gap-4 ${
                          formData.imagePreview ? 'border-primary-neon/30' : 'border-ghost-border hover:border-primary-neon/30 bg-surface-low/50'
                       }`}
                    >
                       {formData.imagePreview ? (
                          <>
                             <img src={formData.imagePreview} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Preview" />
                             <div className="absolute inset-0 bg-gradient-to-t from-bg-obsidian via-transparent to-transparent" />
                             <div className="relative z-10 flex flex-col items-center gap-2">
                                <Zap size={32} className="text-primary-neon animate-pulse" />
                                <span className="text-xs font-black text-white uppercase tracking-[0.2em]">Projection Loaded</span>
                                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Click to Reconfigure</span>
                             </div>
                          </>
                       ) : (
                          <>
                             <div className="p-6 rounded-full bg-surface-highest border border-ghost-border text-on-surface-variant/40">
                                <ImageIcon size={40} strokeWidth={1} />
                             </div>
                             <div className="text-center">
                                <p className="text-white font-bold tracking-widest uppercase text-sm mb-1">Upload Visual Matrix</p>
                                <p className="text-[10px] text-on-surface-variant uppercase font-medium tracking-widest">Supports JPG, PNG, WEBP (Max 5MB)</p>
                             </div>
                          </>
                       )}
                       <input 
                         id="image-upload"
                         type="file" 
                         className="hidden" 
                         accept="image/*"
                         onChange={handleImageChange} 
                       />
                    </div>
                  </div>

                  <div className="p-8 bg-surface-highest/40 rounded-2xl border border-ghost-border">
                     <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary-neon/10 flex items-center justify-center text-primary-neon shrink-0">
                           <Zap size={18} />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-white uppercase tracking-widest mb-2">Final Validation</p>
                           <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                              By launching this experience, you confirm all mission parameters are correct. The node will be broadcasted to the discovery matrix immediately.
                           </p>
                        </div>
                     </div>
                  </div>
                </div>

                <div className="pt-8 flex justify-between items-center">
                   <button type="button" onClick={prevStep} className="btn-secondary-glass flex items-center gap-3 !py-3 !px-6 text-[10px] uppercase tracking-widest font-bold">
                      <ChevronLeft size={16} /> Back to Logistics
                   </button>
                   <button 
                      type="submit" 
                      disabled={loading}
                      className="btn-nocturnal flex items-center justify-center gap-4 group min-w-[200px]" 
                   >
                     {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                         <>
                           <span className="uppercase tracking-[0.3em] text-xs font-black italic">Launch Event</span>
                           <Zap size={18} className="group-hover:rotate-12 transition-transform text-white shadow-glow" />
                         </>
                      )}
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
