import React, { useEffect, useState } from 'react';
import { reportService } from '../../services/reportService';
import { planService } from '../../services/planService';
import { epinService } from '../../services/epinService';
import { Award, CheckCircle2, ShieldCheck, ArrowUpRight, KeyRound } from 'lucide-react';

export default function MyPlanPage() {
  const [memberData, setMemberData] = useState(null);
  const [allPlans, setAllPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upgradeEpin, setUpgradeEpin] = useState('');
  const [upgrading, setUpgrading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    Promise.all([
      reportService.getDashboardOverview(),
      planService.getPlans()
    ]).then(([overview, plansRes]) => {
      setMemberData(overview);
      setAllPlans(plansRes.results || plansRes || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleUpgradePlan = (e) => {
    e.preventDefault();
    if (!upgradeEpin) return;
    setUpgrading(true);
    setMessage(null);

    epinService.validateEpin(upgradeEpin)
      .then(res => {
        setUpgrading(false);
        if (res.valid) {
          setMessage({ type: 'success', text: `EPIN validated for ${res.plan_name} (₹${res.plan_price})! Plan upgrade submitted.` });
          setUpgradeEpin('');
        }
      })
      .catch(err => {
        setUpgrading(false);
        setMessage({ type: 'error', text: err.response?.data?.message || 'Invalid or used EPIN key' });
      });
  };

  if (loading) return <div className="p-8 text-center text-[#736C63]">Loading Active Plan...</div>;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 bg-gradient-to-r from-[#1B3B2B] via-[#132B1F] to-[#2C2824] text-white border-[#C5A059]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#C5A059] uppercase tracking-widest">Active Membership</span>
            <h2 className="text-3xl font-serif font-extrabold text-white mt-1">{memberData?.plan_name || 'Standard Plan'}</h2>
            <p className="text-xs text-[#D8CEBE] mt-1">Member ID: <span className="text-[#C5A059] font-mono font-bold">{memberData?.member_id}</span></p>
          </div>

          <div className="flex items-center gap-3">
            <span className="badge badge-active px-3 py-1 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Active Status
            </span>
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border text-xs font-bold ${
          message.type === 'success' ? 'bg-[#EAF2EC] border-[#B8D4C1] text-[#1B3B2B]' : 'bg-[#FDF0F0] border-[#F3C6C6] text-[#8C2525]'
        }`}>
          {message.text}
        </div>
      )}

      {/* Plan Benefits & Rates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-card p-5 border-[#C5A059]">
          <span className="text-xs font-bold text-[#736C63] uppercase tracking-wider block">Direct Referral Bonus</span>
          <p className="text-3xl font-serif font-extrabold text-[#1B3B2B] mt-2">₹500.00</p>
          <p className="text-xs text-[#554F47] mt-1">Earned per direct sponsored member join</p>
        </div>

        <div className="glass-card p-5 border-[#C5A059]">
          <span className="text-xs font-bold text-[#736C63] uppercase tracking-wider block">Binary Pair Payout</span>
          <p className="text-3xl font-serif font-extrabold text-[#A37B34] mt-2">₹1,000.00</p>
          <p className="text-xs text-[#554F47] mt-1">Earned per matched 1 Left : 1 Right pair</p>
        </div>

        <div className="glass-card p-5 border-[#C5A059]">
          <span className="text-xs font-bold text-[#736C63] uppercase tracking-wider block">Daily Pair Capping Limit</span>
          <p className="text-3xl font-serif font-extrabold text-[#1C1917] mt-2">₹10,000.00</p>
          <p className="text-xs text-[#554F47] mt-1">Maximum pair payout limit per 24 hours</p>
        </div>
      </div>

      {/* Upgrade Plan Section */}
      <div className="glass-card p-6 space-y-4 border-[#C5A059] bg-[#FAF7F2]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1B3B2B] text-[#C5A059] flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-[#1C1917]">Upgrade Membership Tier</h3>
            <p className="text-xs text-[#736C63]">Redeem an upgraded EPIN key to boost your daily capping & payout rates</p>
          </div>
        </div>

        <form onSubmit={handleUpgradePlan} className="flex flex-wrap gap-3 max-w-xl pt-2">
          <input
            type="text"
            placeholder="Enter Upgrade EPIN Key (e.g. PLATINUM-9900)"
            value={upgradeEpin}
            onChange={(e) => setUpgradeEpin(e.target.value)}
            required
            className="form-input flex-1 font-mono uppercase text-xs"
          />
          <button type="submit" disabled={upgrading} className="btn-gold text-xs">
            <ArrowUpRight className="w-4 h-4" /> {upgrading ? 'Verifying...' : 'Upgrade Plan'}
          </button>
        </form>
      </div>

      {/* Available System Tiers created by Admin */}
      <div className="space-y-4">
        <h3 className="text-xl font-serif font-bold text-[#1C1917]">Available Platform Plans</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {allPlans.map(plan => (
            <div key={plan.id} className="glass-card p-6 space-y-3">
              <span className="badge badge-plan">{plan.is_active ? 'AVAILABLE' : 'INACTIVE'}</span>
              <h4 className="text-2xl font-serif font-extrabold text-[#1C1917]">{plan.name}</h4>
              <p className="text-3xl font-extrabold text-[#1B3B2B]">₹{parseFloat(plan.price).toLocaleString()}</p>
              <p className="text-xs text-[#554F47]">{plan.description}</p>

              <div className="pt-3 border-t border-[#E2DDD1] space-y-1.5 text-xs text-[#554F47]">
                <div className="flex justify-between">
                  <span>Referral Bonus:</span>
                  <span className="font-bold text-[#1B3B2B]">₹{parseFloat(plan.referral_bonus).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Binary Pair Payout:</span>
                  <span className="font-bold text-[#A37B34]">₹{parseFloat(plan.binary_pair_payout).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Daily Capping:</span>
                  <span className="font-bold text-[#1C1917]">₹{parseFloat(plan.daily_capping).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
