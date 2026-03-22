import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, MessageSquare, Zap, Shield, Sparkles, Lock } from 'lucide-react';
import socket from '../utils/socket';
import api from '../api';

const NodeDiscussion = ({ user, eventId, isRegistered }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatRef = useRef(null);

  useEffect(() => {
    // Join room
    socket.emit('joinEvent', eventId);

    // Fetch history
    const fetchMessages = async () => {
      try {
        const { data } = await api.get(`/messages/${eventId}`);
        setMessages(data);
      } catch (err) {
        console.error('Failed to fetch messages', err);
      }
    };
    fetchMessages();

    // Listen for new ones
    socket.on('newMessage', (msg) => {
      if (msg.eventId === eventId) {
        setMessages(prev => [...prev, msg]);
      }
    });

    return () => {
      socket.off('newMessage');
    };
  }, [eventId]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || (!isRegistered && user.role !== 'admin')) return;

    try {
      const { data } = await api.post(`/messages/${eventId}`, { text: newMessage });

      const socketPayload = {
        _id: data._id,
        eventId,
        user: { _id: user._id, name: user.name },
        text: newMessage,
        type: user.role === 'admin' ? 'admin' : 'participant',
        createdAt: new Date()
      };

      socket.emit('sendMessage', socketPayload);
      setNewMessage('');
    } catch (err) {
      console.error('Message transmission failed', err);
    }
  };

  const statusAllowed = isRegistered || user?.role === 'admin';

  return (
    <div className="glass-card !bg-surface-low border-ghost-border flex flex-col h-[600px] overflow-hidden">
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-bg-obsidian/40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary-neon/10 rounded-lg text-primary-neon border border-primary-neon/20">
            <MessageSquare size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Attendee Chat Console</h3>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">Live Discussion Layer</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-primary-neon animate-pulse" />
          <span className="text-[9px] font-black text-primary-neon uppercase tracking-widest">Active Link</span>
        </div>
      </div>

      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scrollbar-thin scrollbar-thumb-primary-neon/10"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-30 gap-4">
            <MessageSquare size={40} />
            <p className="text-xs font-bold uppercase tracking-widest">No signals detected yet</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <motion.div
            key={msg._id || i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col ${msg.user?._id === user?._id ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-2 mb-2">
              {msg.user?.role === 'admin' && <Shield size={10} className="text-primary-neon" />}
              <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">
                {msg.user?.name} {msg.user?._id === user?._id && '(You)'}
              </span>
              <span className="text-[8px] text-on-surface-variant/40 font-bold uppercase">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className={`max-w-[85%] p-4 rounded-2xl text-xs font-medium leading-relaxed ${msg.user?._id === user?._id
                ? 'bg-primary-neon/10 border border-primary-neon/30 text-white rounded-tr-none'
                : 'bg-bg-obsidian/60 border border-ghost-border text-on-surface rounded-tl-none'
              }`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
      </div>

      {!statusAllowed ? (
        <div className="p-8 bg-black/40 backdrop-blur-md flex flex-col items-center gap-4 text-center border-t border-white/5">
          <div className="w-12 h-12 rounded-full bg-surface-highest flex items-center justify-center text-on-surface-variant">
            <Lock size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-1">Restricted Discussion Layer</p>
            <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest leading-relaxed">
              You must be a <span className="text-primary-neon">registered guest</span> to transmit signals in this event.
            </p>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSendMessage}
          className="p-6 bg-bg-obsidian/60 border-t border-white/5 flex gap-4"
        >
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-surface-highest/50 border border-ghost-border rounded-xl px-6 py-4 text-xs font-bold text-white placeholder:text-on-surface-variant/40 focus:border-primary-neon/30 outline-none transition-all"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-4 bg-primary-neon/10 rounded-xl text-primary-neon border border-primary-neon/20 hover:bg-primary-neon hover:text-bg-obsidian transition-all shadow-lg disabled:opacity-30 disabled:grayscale"
          >
            <Send size={18} />
          </button>
        </form>
      )}
    </div>
  );
};

export default NodeDiscussion;
