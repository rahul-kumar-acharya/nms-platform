import React, { useEffect, useState } from 'react';
import { 
  Wallet, Users, ArrowUpRight, Award, GitBranch, 
  PlusCircle, Share2, ShieldCheck, CheckCircle2, Search 
} from 'lucide-react';
import { reportService } from '../../services/reportService';
import SEO from '../../components/common/SEO';
import { SkeletonDashboard } from '../../components/common/Skeleton';

export default function MemberDashboard({ onNavigate }) {
  const [data, setData] = useState(null);
  const [searchMember, setSearchMember] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportService.getDashboardOverview()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <SEO title="Loading Dashboard Portal" />
        <SkeletonDashboard />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SEO 
        title="Member Dashboard Portal"
        description="Track wallet ledger balances, direct referral earnings, binary pair payouts, and downline hierarchy structure in real time."
        canonicalPath="/dashboard"
      />
      {/* Welcome Banner */}
      <div className="glass-card p-6 relative overflow-hidden bg-gradient-to-r from-[#1B3B2B] via-[#132B1F] to-[#2C2824] text-white border-[#C5A059]">
        <div className="flex flex-wrap items-center justify-between gap-4 z-10 relative">
          <div>
            <span className="text-xs font-bold text-[#C5A059] uppercase tracking-widest">Member Portfolio</span>
            <h2 className="text-3xl font-serif font-extrabold text-white mt-1">Welcome back, {data?.full_name || 'Member'}!</h2>
            <p className="text-xs text-[#D8CEBE] mt-1">Member Identifier: <span className="text-[#C5A059] font-mono font-bold">{data?.member_id}</span></p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate('binary_tree')}
              className="btn-gold"
            >
              <PlusCircle className="w-4 h-4" />
              Add Placement
            </button>
            <button 
              onClick={() => onNavigate('wallet')}
              className="btn-secondary bg-[#F4F0E8] text-[#1C1917]"
            >
              <Wallet className="w-4 h-4" />
              View Ledger
            </button>
          </div>
        </div>
      </div>

      {/* Quick Search Downline Input */}
      <div className="glass-card p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="font-serif font-bold text-sm text-[#1C1917]">Quick Downline Member Lookup</h4>
          <p className="text-xs text-[#736C63]">Search network downline members by ID or name</p>
        </div>

        <div className="relative flex items-center w-72">
          <Search className="w-4 h-4 text-[#736C63] absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Downline Member ID or Name..."
            value={searchMember}
            onChange={(e) => setSearchMember(e.target.value)}
            className="form-input form-input-icon text-xs"
          />
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-5 glass-card-interactive">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#736C63] uppercase tracking-wider">Available Balance</span>
            <div className="w-10 h-10 rounded-xl bg-[#EAF2EC] border border-[#B8D4C1] flex items-center justify-center text-[#1B3B2B]">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-serif font-extrabold text-[#1C1917] mt-3">₹{parseFloat(data?.balance || 0).toLocaleString()}</p>
          <span className="text-xs text-[#1B3B2B] font-bold mt-2 inline-flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Eligible for Withdrawal
          </span>
        </div>

        <div className="glass-card p-5 glass-card-interactive">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#736C63] uppercase tracking-wider">Lifetime Earnings</span>
            <div className="w-10 h-10 rounded-xl bg-[#F4EFE6] border border-[#D8C8AF] flex items-center justify-center text-[#A37B34]">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-serif font-extrabold text-[#1C1917] mt-3">₹{parseFloat(data?.total_earnings || 0).toLocaleString()}</p>
          <span className="text-xs text-[#A37B34] font-bold mt-2 inline-block">Cumulative Payouts</span>
        </div>

        <div className="glass-card p-5 glass-card-interactive">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#736C63] uppercase tracking-wider">Direct Referrals</span>
            <div className="w-10 h-10 rounded-xl bg-[#F0ECE3] border border-[#D6CFB9] flex items-center justify-center text-[#1C1917]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-serif font-extrabold text-[#1C1917] mt-3">{data?.direct_referrals_count || 0}</p>
          <span className="text-xs text-[#554F47] font-semibold mt-2 inline-block">Sponsored Downlines</span>
        </div>

        <div className="glass-card p-5 glass-card-interactive">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#736C63] uppercase tracking-wider">Active Plan</span>
            <div className="w-10 h-10 rounded-xl bg-[#FDF8E7] border border-[#F0DFA8] flex items-center justify-center text-[#8C6200]">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xl font-bold text-[#1C1917] mt-3 truncate">{data?.plan_name || 'Standard'}</p>
          <span className="text-xs text-[#8C6200] font-bold mt-2 inline-block">KYC: {data?.kyc_status}</span>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div 
          onClick={() => onNavigate('binary_tree')}
          className="glass-card p-6 glass-card-interactive cursor-pointer flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#1B3B2B] text-[#C5A059] flex items-center justify-center">
            <GitBranch className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-[#1C1917] text-base">Binary Tree View</h3>
            <p className="text-xs text-[#736C63]">Inspect left/right team counts & nodes</p>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('referral_tree')}
          className="glass-card p-6 glass-card-interactive cursor-pointer flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#A37B34] text-white flex items-center justify-center">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-[#1C1917] text-base">Referral Downline</h3>
            <p className="text-xs text-[#736C63]">Track sponsored direct referral hierarchy</p>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('kyc')}
          className="glass-card p-6 glass-card-interactive cursor-pointer flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#5C1D24] text-[#F7F4EF] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-[#1C1917] text-base">KYC Status</h3>
            <p className="text-xs text-[#736C63]">Verify documents for withdrawal compliance</p>
          </div>
        </div>
      </div>
    </div>
  );
}
