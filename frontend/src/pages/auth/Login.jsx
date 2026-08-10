import React, { useState } from 'react';
import { authService } from '../../services/authService';
import AuthLayout from '../../layouts/AuthLayout';
import SEO from '../../components/common/SEO';
import { LogIn, Key, User, ArrowRight, ShieldAlert, LogOut } from 'lucide-react';

export default function Login({ onLoginSuccess, onNavigateRegister }) {
  const currentUser = authService.getCurrentUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = () => {
    authService.logout();
    window.location.reload();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    authService.login(username, password)
      .then(data => {
        setLoading(false);
        if (onLoginSuccess) onLoginSuccess(data.user);
      })
      .catch(err => {
        setLoading(false);
        setError(err.response?.data?.detail || 'Invalid login credentials. Please try again.');
      });
  };

  return (
    <AuthLayout 
      title="Member & Admin Sign In" 
      subtitle="Access your network downline tree, double-entry wallet, and withdrawal portal."
    >
      <SEO 
        title="Sign In to Your Account"
        description="Secure login portal for NMS Platform members and system administrators. Inspect downline trees, view wallet ledgers, and manage payouts."
        keywords="nms login, member login, admin portal sign in, binary network login"
        canonicalPath="/login"
      />

      <div className="flex flex-col justify-between h-full space-y-5">
        {currentUser && (
          <div className="p-3.5 rounded-xl bg-[#EAF2EC] border border-[#B8D4C1] text-xs text-[#1B3B2B] space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <ShieldAlert className="w-4 h-4 text-[#1B3B2B]" /> Active Session Detected
            </div>
            <p className="text-[11px] text-[#2C2824]">
              You are currently signed in as <span className="font-bold font-mono">{currentUser.username}</span> ({currentUser.role}).
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button 
                type="button" 
                onClick={() => window.location.href = '/dashboard'}
                className="btn-primary text-[11px] py-1.5 px-3"
              >
                Go to Dashboard
              </button>
              <button 
                type="button" 
                onClick={handleLogout}
                className="btn-secondary text-[11px] py-1.5 px-3 text-[#8C2525]"
              >
                <LogOut className="w-3 h-3 text-[#8C2525]" /> Sign Out to Switch
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-b border-[#E2DDD1] pb-3">
            <h2 className="text-2xl font-serif font-bold text-[#1C1917] mb-1">Sign In to Account</h2>
            <p className="text-xs text-[#736C63]">Enter your Member ID / Admin Handle & Password</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-[#FDF0F0] border border-[#F3C6C6] text-[#8C2525] text-xs font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="form-label">Username / Member ID</label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-[#736C63] absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="e.g. admin or M00001"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="form-input form-input-icon"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Password</label>
            <div className="relative flex items-center">
              <Key className="w-4 h-4 text-[#736C63] absolute left-3.5 pointer-events-none" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input form-input-icon"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-sm py-3 mt-1">
            <LogIn className="w-4 h-4" />
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="space-y-4 pt-2">
          <div className="p-3.5 rounded-xl bg-[#FDF8E7] border border-[#F0DFA8] text-xs text-[#554F47] space-y-1">
            <p className="font-bold text-[#8C6200] uppercase tracking-wider text-[10px]">Seeded Quick Credentials:</p>
            <p>• Admin: <code className="text-[#1C1917] font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-[#E2DDD1]">admin</code> / <code className="text-[#1C1917] font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-[#E2DDD1]">admin123</code></p>
            <p>• Root Member: <code className="text-[#1C1917] font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-[#E2DDD1]">root</code> / <code className="text-[#1C1917] font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-[#E2DDD1]">root123</code></p>
          </div>

          <div className="text-center pt-3 border-t border-[#E2DDD1]">
            <p className="text-xs text-[#736C63]">
              Don't have an active account?{' '}
              <button 
                type="button"
                onClick={onNavigateRegister}
                className="text-[#1B3B2B] hover:underline font-bold inline-flex items-center gap-1"
              >
                Register with EPIN <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
