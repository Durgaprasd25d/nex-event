import Navbar from './Navbar';
import { Sparkles, Heart } from 'lucide-react';

const Layout = ({ children }) => {
  return (
    <div className="layout-root bg-bg-obsidian min-h-screen relative selection:bg-primary-neon/30 selection:text-white">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-electric/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-neon/5 blur-[150px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(144,171,255,0.02)_0%,transparent_70%)]" />
      </div>
      
      <Navbar />
      
      <main className="relative z-10">
        {children}
      </main>
      
      <footer className="relative z-10 border-t border-ghost-border bg-surface-low/30 backdrop-blur-xl py-12">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
            <div className="p-2 bg-surface-highest rounded-lg border border-ghost-border">
               <Sparkles size={16} className="text-primary-neon" />
            </div>
            <span className="text-sm font-black tracking-tighter text-white uppercase italic">
               EVENTLY<span className="text-primary-neon">.</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">
             Crafted with <Heart size={10} className="text-error-neon fill-error-neon animate-pulse" /> for the <span className="text-white">Neo-Social Matrix</span>
          </div>

          <div className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
            &copy; 2026 Architectural Syndicate. All signals reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
