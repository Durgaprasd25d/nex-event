import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Sparkles, Shield, MapPin, Calendar, Users } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const VirtualTicket = ({ event, registration, onClose }) => {
  const ticketRef = useRef(null);

  const downloadImage = async () => {
    if (!ticketRef.current) return;
    const canvas = await html2canvas(ticketRef.current, {
      backgroundColor: '#060e20',
      scale: 2,
    });
    const link = document.createElement('a');
    link.download = `Evently_Ticket_${event._id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const downloadPDF = async () => {
    if (!ticketRef.current) return;
    const canvas = await html2canvas(ticketRef.current, {
      backgroundColor: '#060e20',
      scale: 2,
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
    pdf.save(`Evently_Ticket_${event._id}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-bg-obsidian/90 backdrop-blur-2xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-4xl flex flex-col items-center gap-8"
      >
        {/* Ticket Container (The Hidden Capture Target) */}
        <div 
          ref={ticketRef}
          className="relative w-full aspect-[21/9] bg-bg-obsidian border-[1px] border-primary-neon/30 rounded-[32px] overflow-hidden flex shadow-[0_0_50px_rgba(144,171,255,0.15)]"
        >
          {/* Left Slice: Main Intel */}
          <div className="flex-[2] p-12 flex flex-col justify-between relative overflow-hidden border-r border-dashed border-primary-neon/20">
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary-electric/10 blur-[100px] rounded-full" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-surface-highest rounded-xl border border-ghost-border">
                  <Sparkles size={24} className="text-primary-neon" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
                   EVENTLY<span className="text-primary-neon">.</span>
                </span>
              </div>
              
              <h2 className="text-5xl font-black tracking-tighter text-white mb-4 uppercase italic leading-none max-w-lg">
                {event.title}
              </h2>
              
              <div className="flex gap-8 mt-10">
                <div className="flex flex-col gap-1">
                   <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Temporal Node</span>
                   <span className="text-sm font-bold text-white uppercase">{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-col gap-1">
                   <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Spatial Vector</span>
                   <span className="text-sm font-bold text-white uppercase">{event.location}</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between pt-8 border-t border-ghost-border mt-auto">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-primary-neon/30 p-1">
                     <div className="w-full h-full rounded-full bg-surface-highest flex items-center justify-center text-xs font-black text-primary-neon uppercase">
                        {registration.user?.name?.substring(0,2) || 'ID'}
                     </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Pilot Identity</div>
                    <div className="text-sm font-black text-white italic uppercase tracking-wider">{registration.user?.name || 'Authorized User'}</div>
                  </div>
               </div>
               <div className="text-right">
                  <div className="text-[9px] font-bold text-primary-neon uppercase tracking-[0.3em] bg-primary-neon/10 px-3 py-1 rounded-full border border-primary-neon/20 mb-2">Validated Protocol</div>
                  <div className="text-xs font-bold text-on-surface-variant tracking-widest uppercase">NODE ID: {registration._id?.substring(0,12).toUpperCase()}</div>
               </div>
            </div>
          </div>

          {/* Right Slice: QR & Access */}
          <div className="flex-1 bg-surface-low/50 p-12 flex flex-col items-center justify-center gap-6 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-neon/5 blur-[60px] rounded-full" />
            
            <div className="p-4 bg-white rounded-2xl shadow-2xl relative z-10">
               <QRCodeSVG 
                value={JSON.stringify({ regId: registration._id, eventId: event._id, seat: registration.seatNumber })} 
                size={140}
                level="H"
               />
            </div>
            
            <div className="text-center relative z-10">
               <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Assigned Matrix Node</div>
               <div className="text-4xl font-black text-primary-neon tracking-tighter italic">#{registration.seatNumber}</div>
            </div>

            {/* Aesthetic Perforations */}
            <div className="absolute top-[-10px] left-[-10px] w-5 h-5 bg-bg-obsidian rounded-full" />
            <div className="absolute bottom-[-10px] left-[-10px] w-5 h-5 bg-bg-obsidian rounded-full" />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
           <button 
             onClick={downloadImage}
             className="btn-nocturnal flex-1 sm:max-w-xs flex items-center justify-center gap-3 !py-4.5"
           >
             <Download size={18} />
             <span className="uppercase tracking-[0.2em] text-xs font-bold">Export as Image</span>
           </button>
           <button 
             onClick={downloadPDF}
             className="btn-secondary-glass flex-1 sm:max-w-xs flex items-center justify-center gap-3 !py-4.5"
           >
             <Download size={18} />
             <span className="uppercase tracking-[0.2em] text-xs font-bold">Export as PDF</span>
           </button>
           <button 
             onClick={onClose}
             className="px-6 py-4.5 bg-error-neon/10 border border-error-neon/20 rounded-xl text-error-neon font-bold uppercase text-xs tracking-widest hover:bg-error-neon hover:text-white transition-all"
           >
             Terminate
           </button>
        </div>
      </motion.div>
    </div>
  );
};

export default VirtualTicket;
