import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Cpu, Zap, Radio, Shield, Fingerprint } from 'lucide-react';

const SeatMap = ({ rows, cols, bookedSeats = [], scannedSeats = [], onSelect, selectedSeat }) => {
  const rowLabels = Array.from({ length: rows || 1}, (_, i) => String.fromCharCode(65 + i));
  const colLabels = Array.from({ length: cols || 1}, (_, i) => i + 1);

  return (
    <div className="glass-panel !bg-bg-obsidian/40 border-ghost-border !p-8 flex flex-col items-center relative overflow-hidden group">
      {/* Decorative background grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Header Info */}
      <div className="w-full flex justify-between items-center mb-10 relative z-10">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-neon/10 flex items-center justify-center text-primary-neon">
               <Cpu size={14} />
            </div>
            <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-white">Live Grid Synchronization</h3>
         </div>
         <div className="px-3 py-1 bg-surface-highest rounded-full text-[8px] font-bold text-on-surface-variant uppercase tracking-widest border border-ghost-border flex items-center gap-2">
            <Radio size={10} className="text-primary-neon animate-pulse" />
            Active Sync
         </div>
      </div>

      {/* Grid Area with Headers */}
      <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-primary-neon/10 relative z-10">
        <div 
          className="grid gap-2.5 mx-auto"
          style={{ 
            gridTemplateColumns: `28px repeat(${cols}, minmax(24px, 1fr))`, 
            minWidth: `${cols * 32 + 50}px`,
          }}
        >
          {/* Column Headers */}
          <div />
          {colLabels.map(col => (
            <div key={col} className="text-[8px] font-black text-on-surface-variant/40 text-center uppercase tracking-widest">
              {col < 10 ? `0${col}` : col}
            </div>
          ))}

          {rowLabels.map((row) => (
            <React.Fragment key={row}>
              {/* Row Label */}
              <div className="flex items-center justify-center text-[10px] font-black text-on-surface-variant/60 uppercase tracking-widest bg-surface-low border border-ghost-border rounded-lg aspect-square">
                {row}
              </div>

              {colLabels.map((col) => {
                const seatId = `${row}-${col}`;
                const isScanned = scannedSeats.includes(seatId);
                const isBooked = bookedSeats.includes(seatId);
                const isSelected = selectedSeat === seatId;

                return (
                  <motion.button
                    key={seatId}
                    initial={false}
                    animate={{
                      scale: isSelected ? 1.1 : 1,
                      backgroundColor: isScanned 
                        ? 'rgba(74, 222, 128, 0.25)' // More vibrant green for Occupied
                        : (isBooked ? 'rgba(255, 113, 108, 0.15)' : isSelected ? 'rgba(144, 171, 255, 0.2)' : 'rgba(25, 37, 63, 0.8)'),
                      borderColor: isScanned
                        ? '#4ade80' // Vibrant Neon Green
                        : (isBooked ? 'rgba(255, 113, 108, 0.4)' : isSelected ? 'rgba(144, 171, 255, 0.6)' : 'rgba(64, 72, 92, 0.4)')
                    }}
                    whileHover={!isBooked && !isScanned ? { 
                       scale: 1.15, 
                       borderColor: 'rgb(144, 171, 255, 0.5)',
                       boxShadow: '0 0 15px rgba(144, 171, 255, 0.3)'
                    } : {}}
                    whileTap={!isBooked && !isScanned ? { scale: 0.9 } : {}}
                    onClick={() => !isBooked && !isScanned && onSelect(seatId)}
                    className={`
                      aspect-square rounded-lg flex items-center justify-center transition-all duration-300 border
                      ${(isBooked || isScanned) ? 'cursor-not-allowed' :
                        isSelected ? 'shadow-[0_0_20px_rgba(144,171,255,0.4)] z-10' :
                        'hover:bg-primary-neon/5'}
                      ${isScanned ? 'shadow-[0_0_15px_rgba(74,222,128,0.3)]' : ''}
                    `}
                  >
                    <AnimatePresence mode="wait">
                      {isScanned ? (
                        <motion.div
                          key="occupied"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-green-400"
                        >
                          <Check size={12} strokeWidth={3} />
                        </motion.div>
                      ) : isSelected ? (
                        <motion.div
                          key="selected"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                        >
                          <Check size={12} className="text-primary-neon stroke-[3.5]" />
                        </motion.div>
                      ) : isBooked ? (
                        <motion.div
                          key="booked"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-error-neon/50"
                        >
                          <Shield size={10} />
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-8 p-4 bg-surface-low/50 border border-ghost-border rounded-xl w-full">
        <div className="flex items-center gap-2.5 group">
          <div className="w-3.5 h-3.5 rounded-md bg-white/5 border border-ghost-border" />
          <span className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant group-hover:text-white transition-colors">Available</span>
        </div>
        
        <div className="flex items-center gap-2.5 group">
          <div className="w-3.5 h-3.5 rounded-md bg-error-neon/10 border border-error-neon/40 flex items-center justify-center">
             <div className="w-1 h-1 rounded-full bg-error-neon" />
          </div>
          <span className="text-[8px] font-black uppercase tracking-widest text-error-neon">Booked</span>
        </div>

        <div className="flex items-center gap-2.5 group">
          <div className="w-3.5 h-3.5 rounded-md bg-green-500/10 border border-green-500/40 flex items-center justify-center shadow-[0_0_8px_rgba(74,222,128,0.3)]">
             <Check size={8} strokeWidth={3} className="text-green-400" />
          </div>
          <span className="text-[8px] font-black uppercase tracking-widest text-green-400">Occupied</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
