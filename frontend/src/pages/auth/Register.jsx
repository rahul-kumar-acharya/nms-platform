import React, { useEffect, useState } from 'react';
import { authService } from '../../services/authService';
import { epinService } from '../../services/epinService';
import AuthLayout from '../../layouts/AuthLayout';
import SEO from '../../components/common/SEO';
import { UserPlus, CheckCircle2, ShieldAlert, LogOut, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function Register({ onRegisterSuccess, onNavigateLogin, prefilledSponsorId, prefilledParentId, prefilledPosition }) {
  const currentUser = authService.getCurrentUser();
  const [epinCode, setEpinCode] = useState('');
  const [epinValid, setEpinValid] = useState(null);
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [sponsorId, setSponsorId] = useState('');
  const [parentId, setParentId] = useState('');
  const [position, setPosition] = useState('LEFT');
  const [loading, setLoading] = useState(false);
  const [validatingEpin, setValidatingEpin] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (prefilledSponsorId) setSponsorId(prefilledSponsorId);
    if (prefilledParentId) setParentId(prefilledParentId);
    if (prefilledPosition) setPosition(prefilledPosition);
  }, [prefilledSponsorId, prefilledParentId, prefilledPosition]);

  const handleLogout = () => {
    authService.logout();
    window.location.reload();
  };

  const handleValidateEpin = () => {
    if (!epinCode.trim()) {
      setError('Please enter an EPIN key to validate.');
      return;
    }
    setError('');
    setValidatingEpin(true);
    epinService.validateEPIN(epinCode.trim().toUpperCase())
      .then(data => {
        setValidatingEpin(false);
        if (data.valid) {
          setEpinValid(data);
        } else {
          setEpinValid(null);
          setError(data.detail || 'Invalid or already used EPIN key.');
        }
      })
      .catch(err => {
        setValidatingEpin(false);
        setEpinValid(null);
        setError(err.response?.data?.detail || 'EPIN validation failed.');
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      epin: epinCode.trim().toUpperCase(),
      full_name: fullName,
      password,
      email,
      mobile,
      sponsor_id: sponsorId.trim(),
      parent_id: parentId.trim(),
      position
    };

    authService.register(payload)
      .then(data => {
        setLoading(false);
        setSuccess(data);
        if (onRegisterSuccess) onRegisterSuccess(data);
      })
      .catch(err => {
        setLoading(false);
        const detail = err.response?.data?.detail || err.response?.data || 'Registration failed.';
        if (typeof detail === 'object') {
          setError(Object.entries(detail).map(([key, value]) => `${key}: ${value}`).join(' | '));
        } else {
          setError(detail);
        }
      });
  };

  if (success) {
    return (
      <AuthLayout title="Registration Successful" subtitle="Welcome to NMS Platform network.">
        <SEO title="Registration Successful" description="Account activated successfully with EPIN." canonicalPath="/register" />
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-[#EAF2EC] text-[#1B3B2B] flex items-center justify-center mx-auto border border-[#B8D4C1]">
            <CheckCircle2 className="w-6 h-6 text-[#1B3B2B]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-serif font-bold text-[#1C1917]">Account Activated</h3>
            <p className="text-xs text-[#736C63]">Your member account is ready to use.</p>
          </div>
          <button type="button" onClick={onNavigateLogin} className="btn-primary w-full justify-center text-xs py-2.5">
            Continue to Sign In <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Create Member Account" subtitle="Activate your NMS Platform membership with a valid EPIN.">
      <SEO title="Register Your Account" description="Create an NMS Platform member account with a validated EPIN." canonicalPath="/register" />

      {currentUser && (
        <div className="mb-4 p-3 rounded-xl bg-[#EAF2EC] border border-[#B8D4C1] text-xs text-[#1B3B2B] space-y-2">
          <div className="flex items-center gap-2 font-bold"><ShieldAlert className="w-4 h-4" /> Active Session Detected</div>
          <p className="text-[11px] text-[#2C2824]">You are currently signed in as <span className="font-bold font-mono">{currentUser.username}</span>.</p>
          <button type="button" onClick={handleLogout} className="btn-secondary text-[11px] py-1.5 px-3 text-[#8C2525]"><LogOut className="w-3 h-3" /> Sign Out to Switch</button>
        </div>
      )}

      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {error && <div className="p-2.5 rounded-xl bg-[#FDF0F0] border border-[#F3C6C6] text-[#8C2525] text-xs font-semibold">{error}</div>}

          <div>
            <label className="form-label text-xs">EPIN Key</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input type="text" placeholder="e.g. GOLD-101-8842-00" value={epinCode} onChange={(e) => setEpinCode(e.target.value)} required className="form-input font-mono uppercase text-xs" />
              <button type="button" onClick={handleValidateEpin} disabled={validatingEpin} className="btn-secondary text-xs whitespace-nowrap py-2 px-3.5">{validatingEpin ? 'Verifying...' : 'Verify Key'}</button>
            </div>
            {epinValid && <p className="text-[11px] text-[#1B3B2B] font-bold mt-1 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Valid for {epinValid.plan_name} (₹{epinValid.plan_price})</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div><label className="form-label text-xs">Full Name</label><input type="text" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="form-input text-xs" /></div>
            <div>
              <label className="form-label text-xs">Password</label>
              <div className="relative flex items-center">
                <input type={showPassword ? 'text' : 'password'} placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required className="form-input text-xs pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-[#736C63] hover:text-[#1C1917] focus:outline-none" title={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div><label className="form-label text-xs">Email</label><input type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-input text-xs" /></div>
            <div><label className="form-label text-xs">Mobile</label><input type="tel" placeholder="9876543210" value={mobile} onChange={(e) => setMobile(e.target.value)} required className="form-input text-xs" /></div>
          </div>

          <div className="pt-2 border-t border-[#E2DDD1]">
            <p className="text-[10px] sm:text-[11px] font-bold text-[#1C1917] mb-1.5 uppercase tracking-wider">Placement Settings</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div><label className="form-label text-xs">Sponsor ID</label><input type="text" value={sponsorId} onChange={(e) => setSponsorId(e.target.value)} required className="form-input font-mono text-xs" /></div>
              <div><label className="form-label text-xs">Parent ID</label><input type="text" value={parentId} onChange={(e) => setParentId(e.target.value)} required className="form-input font-mono text-xs" /></div>
              <div><label className="form-label text-xs">Position</label><select value={position} onChange={(e) => setPosition(e.target.value)} className="form-input text-xs"><option value="LEFT">LEFT</option><option value="RIGHT">RIGHT</option></select></div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-xs py-2.5 mt-1"><UserPlus className="w-4 h-4" />{loading ? 'Processing...' : 'Activate & Join Network'}</button>
        </form>

        <div className="text-center pt-2 border-t border-[#E2DDD1]"><p className="text-xs text-[#736C63]">Already have an account?{' '}<button type="button" onClick={onNavigateLogin} className="text-[#1B3B2B] hover:underline font-bold inline-flex items-center gap-1">Sign In <ArrowRight className="w-3.5 h-3.5" /></button></p></div>
      </div>
    </AuthLayout>
  );
}
