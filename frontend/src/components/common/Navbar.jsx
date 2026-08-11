import React, { useState } from 'react';
import { Award, LogIn, UserPlus, Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
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
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 h-14 sm:h-20 flex items-center justify-between">
        {/* Brand Logo - Compact & Non-overlapping on Mobile */}
        <button 
          onClick={() => handleNavClick(user ? 'dashboard' : 'home')}
          className="flex items-center gap-2 sm:gap-3 text-left group shrink-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#1B3B2B] border border-[#C5A059] flex items-center justify-center text-[#C5A059] shadow-sm group-hover:scale-105 transition-transform shrink-0">
            <Award className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <span className="font-serif font-extrabold text-base sm:text-xl text-[#1C1917] leading-none block">NMS Platform</span>
            <span className="hidden sm:block text-[10px] text-[#A37B34] font-bold uppercase tracking-widest mt-0.5">Enterprise Member Portal</span>
          </div>
        </button>

        {/* Public Desktop Nav Links (Hidden on Mobile) */}
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

        {/* Desktop Action Buttons (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-2.5 sm:gap-3">
          {user ? (
            <>
              <button 
                onClick={() => handleNavClick('dashboard')}
                className="btn-gold text-xs py-2 px-4"
              >
                Dashboard
              </button>
              <button 
                onClick={handleLogout}
                className="btn-secondary text-xs py-2 px-3.5"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => handleNavClick('login')}
                className={`btn-secondary text-xs py-2 px-3.5 ${currentView === 'login' ? 'border-[#C5A059] bg-[#EAE4D8]' : ''}`}
              >
                <LogIn className="w-3.5 h-3.5" /> Sign In
              </button>
              <button 
                onClick={() => handleNavClick('register')}
                className={`btn-primary text-xs py-2 px-3.5 ${currentView === 'register' ? 'border-[#C5A059]' : ''}`}
              >
                <UserPlus className="w-3.5 h-3.5" /> Register
              </button>
            </>
          )}
        </div>

        {/* Mobile-Only Clean Action & Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2 shrink-0">
          {user ? (
            <button 
              onClick={() => handleNavClick('dashboard')}
              className="btn-gold text-[11px] py-1 px-2.5 flex items-center gap-1"
            >
              <LayoutDashboard className="w-3 h-3" /> Dashboard
            </button>
          ) : (
            <button 
              onClick={() => handleNavClick('login')}
              className="btn-secondary text-[11px] py-1 px-2.5 flex items-center gap-1"
            >
              <LogIn className="w-3 h-3" /> Sign In
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-[#1C1917] hover:bg-[#E2DDD1] transition-colors border border-[#D8CEBE]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#8C2525]" /> : <Menu className="w-5 h-5 text-[#1C1917]" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu Drawer (Full Width Clean Dropdown) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#EFECE3] border-b border-[#E2DDD1] px-4 py-3 space-y-1.5 shadow-lg animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                currentView === link.id
                  ? 'bg-[#1B3B2B] text-[#F7F4EF] border border-[#C5A059]'
                  : 'text-[#554F47] hover:text-[#1C1917] hover:bg-[#E2DDD1]'
              }`}
            >
              {link.label}
            </button>
          ))}
          
          <div className="pt-2 border-t border-[#E2DDD1] flex flex-col gap-2">
            {user ? (
              <>
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="btn-gold text-xs w-full py-2.5 justify-center"
                >
                  <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-xs w-full py-2 justify-center text-[#8C2525] bg-[#FDF0F0] border-[#F3C6C6]"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className="btn-secondary text-xs py-2 justify-center"
                >
                  <LogIn className="w-3.5 h-3.5" /> Sign In
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="btn-primary text-xs py-2 justify-center"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
