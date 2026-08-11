import React, { useState } from 'react';
import { authService } from '../../services/authService';
import { epinService } from '../../services/epinService';
import AuthLayout from '../../layouts/AuthLayout';
import SEO from '../../components/common/SEO';
import { UserPlus, CheckCircle2, ArrowRight, ShieldAlert, LogOut } from 'lucide-react';

export default function Register({ onNavigateLogin }) {
  const currentUser = authService.getCurrentUser();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [epinCode, setEpinCode] = useState('');
  const [sponsorId, setSponsorId] = useState('M00001');
  const [parentId, setParentId] = useState('M00001');
  const [position, setPosition] = useState('LEFT');

  const [epinValid, setEpinValid] = useState(null);
  const [validatingEpin, setValidatingEpin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const handleLogout = () => {
    authService.logout();
    window.location.reload();
  };

  const handleValidateEpin = () => {
    if (!epinCode) return;
    setValidatingEpin(true);
    setEpinValid(null);
    setError('');

    epinService.validateEpin(epinCode)
      .then(res => {
        setValidatingEpin(false);
        if (res.valid) {
          setEpinValid(res);
        }
      })
      .catch(err => {
        setValidatingEpin(false);
        setError(err.response?.data?.message || 'Invalid or used EPIN code');
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    authService.register({
      full_name: fullName,
      email,
      mobile,
      password,
      epin_code: epinCode,
      sponsor_id: sponsorId,
      parent_id: parentId,
      position
    }).then(res => {
      setLoading(false);
      setSuccess(res);
    }).catch(err => {
      setLoading(false);
      setError(err.response?.data?.detail || 'Registration failed. Please check inputs and try again.');
    });
  };

  if (success) {
    return (
      <AuthLayout title="Registration Complete" subtitle="Member account activated & binary tree placement saved.">
        <SEO 
          title="Registration Successful"
          description="Your NMS member account has been successfully activated with your verified EPIN key."
          canonicalPath="/register"
        />

        <div className="flex flex-col justify-between h-full py-4 text-center space-y-4">
          <div className="space-y-3 my-auto">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#EAF2EC] text-[#1B3B2B] border border-[#B8D4C1] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1917]">Registration Successful!</h2>
            <p className="text-xs text-[#554F47]">
              Welcome, <span className="font-bold text-[#1C1917]">{success.member?.full_name}</span>! Assigned Member ID:
            </p>
            <div className="p-3 sm:p-4 rounded-xl bg-[#F0ECE3] border border-[#C5A059] text-[#1B3B2B] font-mono text-xl sm:text-2xl font-extrabold tracking-wider">
              {success.member?.member_id}
            </div>
            <p className="text-xs text-[#736C63]">
              Plan Activated: <span className="text-[#1B3B2B] font-bold">{success.member?.plan_name}</span>
            </p>
          </div>

          <button 
            onClick={onNavigateLogin}
            className="btn-primary w-full justify-center py-2.5 sm:py-3"
          >
            Sign In Now
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Member Registration" subtitle="Activate plan using EPIN & specify binary network placement.">
      <SEO 
        title="Member Registration with EPIN"
        description="Activate your NMS membership plan using a valid EPIN key and specify your placement in the binary downline network tree."
        keywords="nms registration, epin activation, binary placement registration, join network"
        canonicalPath="/register"
      />

      <div className="space-y-3.5">
        {currentUser && (
          <div className="p-3 rounded-xl bg-[#EAF2EC] border border-[#B8D4C1] text-xs text-[#1B3B2B] space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs">
              <ShieldAlert className="w-4 h-4 text-[#1B3B2B]" /> Active Session Detected
            </div>
            <p className="text-[11px] text-[#2C2824]">
              You are currently signed in as <span className="font-bold font-mono">{currentUser.username}</span> ({currentUser.role}).
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button 
                type="button" 
                onClick={() => window.location.href = '/dashboard'}
                className="btn-primary text-[11px] py-1 px-2.5"
              >
                Go to Dashboard
              </button>
              <button 
                type="button" 
                onClick={handleLogout}
                className="btn-secondary text-[11px] py-1 px-2.5 text-[#8C2525]"
              >
                <LogOut className="w-3 h-3 text-[#8C2525]" /> Sign Out to Register New
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="border-b border-[#E2DDD1] pb-2">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1917]">Create Member Account</h2>
            <p className="text-xs text-[#736C63]">Enter account details and validated EPIN key</p>
          </div>

          {error && <div className="p-2.5 rounded-xl bg-[#FDF0F0] border border-[#F3C6C6] text-[#8C2525] text-xs font-semibold">{error}</div>}

          {/* EPIN Input & Validate */}
          <div>
            <label className="form-label text-xs">EPIN Key</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="e.g. GOLD-101-8842-00"
                value={epinCode}
                onChange={(e) => setEpinCode(e.target.value)}
                required
                className="form-input font-mono uppercase text-xs"
              />
              <button
                type="button"
                onClick={handleValidateEpin}
                disabled={validatingEpin}
                className="btn-secondary text-xs whitespace-nowrap py-2 px-3.5"
              >
                Verify Key
              </button>
            </div>
            {epinValid && (
              <p className="text-[11px] text-[#1B3B2B] font-bold mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1B3B2B]" /> Valid for {epinValid.plan_name} (₹{epinValid.plan_price})
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="form-label text-xs">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="form-input text-xs"
              />
            </div>
            <div>
              <label className="form-label text-xs">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="form-label text-xs">Email</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input text-xs"
              />
            </div>
            <div>
              <label className="form-label text-xs">Mobile</label>
              <input
                type="tel"
                placeholder="9876543210"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                className="form-input text-xs"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-[#E2DDD1]">
            <p className="text-[10px] sm:text-[11px] font-bold text-[#1C1917] mb-1.5 uppercase tracking-wider">Placement Settings</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="form-label text-xs">Sponsor ID</label>
                <input
                  type="text"
                  value={sponsorId}
                  onChange={(e) => setSponsorId(e.target.value)}
                  required
                  className="form-input font-mono text-xs"
                />
              </div>
              <div>
                <label className="form-label text-xs">Parent ID</label>
                <input
                  type="text"
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  required
                  className="form-input font-mono text-xs"
                />
              </div>
              <div>
                <label className="form-label text-xs">Position</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="form-input text-xs"
                >
                  <option value="LEFT">LEFT</option>
                  <option value="RIGHT">RIGHT</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-xs py-2.5 mt-1">
            <UserPlus className="w-4 h-4" />
            {loading ? 'Processing...' : 'Activate & Join Network'}
          </button>
        </form>

        {/* Bottom Login Navigation Link */}
        <div className="text-center pt-2 border-t border-[#E2DDD1]">
          <p className="text-xs text-[#736C63]">
            Already have an account?{' '}
            <button 
              type="button"
              onClick={onNavigateLogin}
              className="text-[#1B3B2B] hover:underline font-bold inline-flex items-center gap-1"
            >
              Sign In <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
