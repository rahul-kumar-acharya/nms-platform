import React from 'react';
import { Award, LogIn, UserPlus } from 'lucide-react';
import { authService } from '../../services/authService';

export default function Navbar({ currentView, setView }) {
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    setView('login');
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'features', label: 'Features' },
    { id: 'faq', label: 'FAQ' },
    { id: 'terms', label: 'Terms' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#EFECE3]/90 backdrop-blur-md border-b border-[#E2DDD1] shadow-xs">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button 
          onClick={() => setView(user ? 'dashboard' : 'home')}
          className="flex items-center gap-3 text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#1B3B2B] border border-[#C5A059] flex items-center justify-center text-[#C5A059] shadow-sm group-hover:scale-105 transition-transform">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif font-extrabold text-xl text-[#1C1917] leading-none block">NMS Platform</span>
            <span className="text-[10px] text-[#A37B34] font-bold uppercase tracking-widest block mt-0.5">Enterprise Member Portal</span>
          </div>
        </button>

        {/* Public Nav Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setView(link.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${
                currentView === link.id
                  ? 'bg-[#1B3B2B] text-[#F7F4EF] border border-[#C5A059]'
                  : 'text-[#554F47] hover:text-[#1C1917] hover:bg-[#E2DDD1]'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <button 
                onClick={() => setView('dashboard')}
                className="btn-gold text-xs"
              >
                Go to Dashboard
              </button>
              <button 
                onClick={handleLogout}
                className="btn-secondary text-xs"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setView('login')}
                className={`btn-secondary text-xs ${currentView === 'login' ? 'border-[#C5A059] bg-[#EAE4D8]' : ''}`}
              >
                <LogIn className="w-3.5 h-3.5" /> Sign In
              </button>
              <button 
                onClick={() => setView('register')}
                className={`btn-primary text-xs ${currentView === 'register' ? 'border-[#C5A059]' : ''}`}
              >
                <UserPlus className="w-3.5 h-3.5" /> Register EPIN
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
