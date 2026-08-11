import React, { useState } from 'react';
import { Award, LogIn, UserPlus, Menu, X } from 'lucide-react';
import { authService } from '../../services/authService';

export default function Navbar({ currentView, setView }) {
  const user = authService.getCurrentUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    setView('login');
    setMobileMenuOpen(false);
  };

  const handleNavClick = (id) => {
    setView(id);
    setMobileMenuOpen(false);
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
    <header className="sticky top-0 z-50 bg-[#EFECE3]/95 backdrop-blur-md border-b border-[#E2DDD1] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button 
          onClick={() => handleNavClick(user ? 'dashboard' : 'home')}
          className="flex items-center gap-2.5 sm:gap-3 text-left group"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#1B3B2B] border border-[#C5A059] flex items-center justify-center text-[#C5A059] shadow-sm group-hover:scale-105 transition-transform shrink-0">
            <Award className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <span className="font-serif font-extrabold text-lg sm:text-xl text-[#1C1917] leading-none block">NMS Platform</span>
            <span className="text-[9px] sm:text-[10px] text-[#A37B34] font-bold uppercase tracking-widest block mt-0.5">Enterprise Member Portal</span>
          </div>
        </button>

        {/* Public Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${
                currentView === link.id
                  ? 'bg-[#1B3B2B] text-[#F7F4EF] border border-[#C5A059]'
                  : 'text-[#554F47] hover:text-[#1C1917] hover:bg-[#E2DDD1]'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Action Buttons & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <button 
                onClick={() => handleNavClick('dashboard')}
                className="btn-gold text-[11px] sm:text-xs py-1.5 px-3 sm:py-2.5 sm:px-4"
              >
                Dashboard
              </button>
              <button 
                onClick={handleLogout}
                className="hidden sm:inline-flex btn-secondary text-xs py-2 px-3"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => handleNavClick('login')}
                className={`btn-secondary text-[11px] sm:text-xs py-1.5 px-2.5 sm:py-2 sm:px-3.5 ${currentView === 'login' ? 'border-[#C5A059] bg-[#EAE4D8]' : ''}`}
              >
                <LogIn className="w-3.5 h-3.5" /> Sign In
              </button>
              <button 
                onClick={() => handleNavClick('register')}
                className={`btn-primary text-[11px] sm:text-xs py-1.5 px-2.5 sm:py-2 sm:px-3.5 ${currentView === 'register' ? 'border-[#C5A059]' : ''}`}
              >
                <UserPlus className="w-3.5 h-3.5" /> Register
              </button>
            </>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#1C1917] hover:bg-[#E2DDD1] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#EFECE3] border-b border-[#E2DDD1] px-4 py-3 space-y-1 shadow-md">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                currentView === link.id
                  ? 'bg-[#1B3B2B] text-[#F7F4EF] border border-[#C5A059]'
                  : 'text-[#554F47] hover:text-[#1C1917] hover:bg-[#E2DDD1]'
              }`}
            >
              {link.label}
            </button>
          ))}
          {user && (
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold text-[#8C2525] bg-[#FDF0F0] border border-[#F3C6C6] mt-2"
            >
              Sign Out
            </button>
          )}
        </div>
      )}
    </header>
  );
}
