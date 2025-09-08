import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';


const App = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="sticky top-0 z-50 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">Open Tails</Link>
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Toggle menu"
            aria-expanded={isMobileOpen}
            onClick={() => setIsMobileOpen(prev => !prev)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <nav className="hidden md:flex gap-4 text-white/70">
            <NavLink to="/" end className={({ isActive }) => `px-3 py-1 rounded-full ${isActive ? 'bg-white/15 text-white' : 'hover:text-white hover:bg-white/10'}`}>Home</NavLink>
            <NavLink to="/explore" className={({ isActive }) => `px-3 py-1 rounded-full ${isActive ? 'bg-white/15 text-white' : 'hover:text-white hover:bg-white/10'}`}>Explore</NavLink>
            <NavLink to="/usage" className={({ isActive }) => `px-3 py-1 rounded-full ${isActive ? 'bg-white/15 text-white' : 'hover:text-white hover:bg-white/10'}`}>Usage</NavLink>
            <NavLink to="/about" className={({ isActive }) => `px-3 py-1 rounded-full ${isActive ? 'bg-white/15 text-white' : 'hover:text-white hover:bg-white/10'}`}>About</NavLink>
          </nav>
        </div>
        {isMobileOpen && (
          <div className="md:hidden border-t border-white/10">
            <nav className="px-4 py-3 flex flex-col gap-2 text-white/90">
              <NavLink to="/" end onClick={() => setIsMobileOpen(false)} className={({ isActive }) => `px-3 py-2 rounded-lg ${isActive ? 'bg-white/15 text-white' : 'hover:text-white hover:bg-white/10'}`}>Home</NavLink>
              <NavLink to="/explore" onClick={() => setIsMobileOpen(false)} className={({ isActive }) => `px-3 py-2 rounded-lg ${isActive ? 'bg-white/15 text-white' : 'hover:text-white hover:bg-white/10'}`}>Explore</NavLink>
              <NavLink to="/usage" onClick={() => setIsMobileOpen(false)} className={({ isActive }) => `px-3 py-2 rounded-lg ${isActive ? 'bg-white/15 text-white' : 'hover:text-white hover:bg-white/10'}`}>Usage</NavLink>
              <NavLink to="/about" onClick={() => setIsMobileOpen(false)} className={({ isActive }) => `px-3 py-2 rounded-lg ${isActive ? 'bg-white/15 text-white' : 'hover:text-white hover:bg-white/10'}`}>About</NavLink>
            </nav>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </div>

      <div className="text-center py-8 text-white/40 text-sm">
        Created By Gulchetan Singh with Gemini powered AI Integration
      </div>

      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default App;