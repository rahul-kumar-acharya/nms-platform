import React, { useEffect, useState } from 'react';
import { reportService } from '../../services/reportService';
import { incomeService } from '../../services/incomeService';
import SEO from '../../components/common/SEO';
import { SkeletonDashboard } from '../../components/common/Skeleton';
import { 
  Users, KeyRound, Wallet, ArrowDownRight, Zap, 
  RefreshCw 
} from 'lucide-react';

export default function AdminDashboard({ onNavigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [engineResult, setEngineResult] = useState(null);
  const [runningEngine, setRunningEngine] = useState(false);

  const loadMetrics = () => {
    setLoading(true);
    reportService.getDashboardOverview()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const handleRunBinaryEngine = () => {
    setRunningEngine(true);
    setEngineResult(null);
    incomeService.runBinaryEngine()
      .then(res => {
        setEngineResult(res);
        setRunningEngine(false);
        loadMetrics();
      })
      .catch(err => {
        console.error(err);
        setRunningEngine(false);
      });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SEO title="Loading Admin Control Center" />
        <SkeletonDashboard />
      </div>
    );
  } return (
    <div className="space-y-6">
      {/* Control Banner */}
      <div className="glass-card p-6 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-[#5C1D24] via-[#3D1318] to-[#1C1917] text-white border-[#C5A059]">
        <div>
          <span className="text-xs font-bold text-[#C5A059] uppercase tracking-widest">Admin Control Center</span>
          <h2 className="text-3xl font-serif font-extrabold text-white mt-1">Platform Operations & Treasury</h2>
          <p className="text-xs text-[#E2DDD1] mt-1">Manage network integrity, EPIN keys, pair payouts & withdrawals</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleRunBinaryEngine}
            disabled={runningEngine}
            className="btn-gold"
          >
            <Zap className="w-4 h-4" />
            {runningEngine ? 'Processing Pairs...' : 'Run Binary Pair Engine'}
          </button>
          <button onClick={loadMetrics} className="btn-secondary bg-[#F4F0E8] text-[#1C1917]">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {engineResult && (
        <div className="p-4 rounded-xl bg-[#EAF2EC] border border-[#B8D4C1] text-[#1B3B2B] text-sm flex items-center justify-between font-medium">
          <span>
            Binary Engine Execution Complete: {engineResult.members_processed} member payouts processed (Total ₹{engineResult.total_payout_credited})
          </span>
          <button onClick={() => setEngineResult(null)} className="text-xs font-bold underline">Dismiss</button>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div 
          onClick={() => onNavigate('members')}
          className="glass-card p-5 glass-card-interactive cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#736C63] uppercase tracking-wider">Total Members</span>
            <div className="w-10 h-10 rounded-xl bg-[#1B3B2B] text-[#C5A059] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-serif font-extrabold text-[#1C1917] mt-3">{data?.total_members || 0}</p>
          <span className="text-xs text-[#1B3B2B] font-bold mt-2 inline-block">{data?.active_members || 0} Active Network Members</span>
        </div>

        <div 
          onClick={() => onNavigate('epins')}
          className="glass-card p-5 glass-card-interactive cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#736C63] uppercase tracking-wider">Unused EPINs</span>
            <div className="w-10 h-10 rounded-xl bg-[#F4EFE6] text-[#A37B34] flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-serif font-extrabold text-[#1C1917] mt-3">{data?.unused_epins || 0}</p>
          <span className="text-xs text-[#736C63] font-semibold mt-2 inline-block">Out of {data?.total_epins || 0} generated keys</span>
        </div>

        <div 
          onClick={() => onNavigate('withdrawals')}
          className="glass-card p-5 glass-card-interactive cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#736C63] uppercase tracking-wider">Pending Withdrawals</span>
            <div className="w-10 h-10 rounded-xl bg-[#FDF8E7] text-[#8C6200] flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-serif font-extrabold text-[#1C1917] mt-3">₹{parseFloat(data?.pending_withdrawals || 0).toLocaleString()}</p>
          <span className="text-xs text-[#8C6200] font-bold mt-2 inline-block">Requires Admin Approval</span>
        </div>

        <div 
          onClick={() => onNavigate('income_engine')}
          className="glass-card p-5 glass-card-interactive cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#736C63] uppercase tracking-wider">Total Income Paid</span>
            <div className="w-10 h-10 rounded-xl bg-[#EAF2EC] text-[#1B3B2B] flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-serif font-extrabold text-[#1C1917] mt-3">₹{parseFloat(data?.total_income_distributed || 0).toLocaleString()}</p>
          <span className="text-xs text-[#1B3B2B] font-bold mt-2 inline-block">Distributed Across Network</span>
        </div>
      </div>
    </div>
  );
}
