import React, { useState } from 'react';
import { X, Zap, Type, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

const CreateCategoryModal = ({ isOpen, onClose, onCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/categories', { name, description });
      onCreated(data);
      onClose();
      setName('');
      setDescription('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-bg-obsidian/80 backdrop-blur-xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg glass-panel !p-8 border border-ghost-border overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-neon via-primary-electric to-primary-neon animate-shimmer" />
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-neon/10 flex items-center justify-center text-primary-neon">
                  <Tag size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-widest uppercase italic">New Classification</h3>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Initialize discovery node</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-surface-highest rounded-lg text-on-surface-variant transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] ml-1">Category Name</label>
                <div className="relative group">
                  <Type size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary-neon transition-colors" />
                  <input
                    type="text"
                    required
                    className="w-full bg-surface-low border border-ghost-border rounded-xl py-4 pl-16 pr-6 text-sm font-bold text-white outline-none focus:border-primary-neon/50 focus:bg-surface-highest transition-all shadow-inner uppercase tracking-widest"
                    placeholder="e.g. TECHNOLOGY"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.3em] ml-1">Context (Description)</label>
                <textarea
                  className="w-full bg-surface-low border border-ghost-border rounded-xl py-4 px-6 text-sm font-bold text-white outline-none focus:border-primary-neon/50 focus:bg-surface-highest transition-all shadow-inner h-32 resize-none"
                  placeholder="Define the scope of this classification node..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {error && (
                <div className="p-4 bg-error-neon/10 border border-error-neon/20 rounded-xl text-error-neon text-[10px] font-bold uppercase tracking-widest">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-nocturnal w-full flex items-center justify-center gap-3 relative group overflow-hidden !py-5"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="uppercase tracking-[0.4em] text-xs font-black italic">Initialize Node</span>
                    <Zap size={18} className="group-hover:rotate-12 transition-transform shadow-glow" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateCategoryModal;
