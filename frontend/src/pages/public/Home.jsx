import React, { useEffect, useState } from 'react';
import { 
  Award, ShieldCheck, GitBranch, KeyRound, Wallet, 
  ArrowRight, Users, CheckCircle2, Zap 
} from 'lucide-react';
import { reportService } from '../../services/reportService';
import SEO from '../../components/common/SEO';

export default function Home({ setView }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    reportService.getDashboardOverview()
      .then(res => setStats(res))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-16 py-8">
      <SEO 
        title="Best Enterprise Network Management System | Binary Tree & EPIN Portal"
        description="Everything you need to run a modern network management platform: cryptographic EPIN activations, automated binary pair payouts, double-entry wallet ledger, and real-time visual downline hierarchy."
        keywords="network management system, binary tree visualizer, epin activation keys, binary pair payout engine, mlm software, double entry wallet ledger, network portal"
        canonicalPath="/"
      />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 text-center space-y-6 pt-6 pb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F4EFE6] border border-[#D8C8AF] text-[#8C6200] text-xs font-bold uppercase tracking-wider shadow-xs">
          <Award className="w-4 h-4 text-[#A37B34]" /> Institutional Binary Network Platform
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-[#1C1917] leading-tight max-w-4xl mx-auto">
          Precision Network Management & Automated Income Engine
        </h1>

        <p className="text-base sm:text-lg text-[#554F47] max-w-2xl mx-auto leading-relaxed">
          Manage downline tree placement, validate cryptographic EPIN keys, track double-entry wallet balance, and execute automated binary pair payouts with institutional transparency.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button 
            onClick={() => setView('register')}
            className="btn-primary text-sm py-3 px-6"
          >
            Activate Plan with EPIN <ArrowRight className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setView('features')}
            className="btn-secondary text-sm py-3 px-6"
          >
            Explore Platform Features
          </button>
        </div>
      </section>

      {/* Database Active Stats - High Contrast Forest & Gold Theme */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="p-8 rounded-2xl bg-[#1B3B2B] text-white border border-[#C5A059] shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-[#C5A059]/40">
            <div className="p-2">
              <span className="text-xs font-bold text-[#E6C687] uppercase tracking-widest block">Active Members</span>
              <p className="text-4xl font-serif font-extrabold text-white mt-2">{stats?.total_members || '6+'}</p>
              <span className="text-xs text-[#E2DDD1] mt-1 block">Registered in Database</span>
            </div>
            <div className="p-2">
              <span className="text-xs font-bold text-[#E6C687] uppercase tracking-widest block">Income Distributed</span>
              <p className="text-4xl font-serif font-extrabold text-white mt-2">₹{parseFloat(stats?.total_income_distributed || 7500).toLocaleString()}</p>
              <span className="text-xs text-[#E2DDD1] mt-1 block">Total Payouts Credited</span>
            </div>
            <div className="p-2">
              <span className="text-xs font-bold text-[#E6C687] uppercase tracking-widest block">Unused EPIN Keys</span>
              <p className="text-4xl font-serif font-extrabold text-white mt-2">{stats?.unused_epins || '8'}</p>
              <span className="text-xs text-[#E2DDD1] mt-1 block">Ready for Activation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillar Features */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-serif font-bold text-[#1C1917]">System Pillars & Capabilities</h2>
          <p className="text-xs text-[#736C63] uppercase tracking-wider font-semibold">Engineered for Reliability & Auditability</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 glass-card-interactive space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#1B3B2B] text-[#C5A059] flex items-center justify-center font-bold">
              <GitBranch className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#1C1917]">Binary Placement Engine</h3>
            <p className="text-xs text-[#554F47] leading-relaxed">
              Strict backend enforcement of left and right child nodes. Ensures no cyclical loops or orphan nodes exist in the tree structure.
            </p>
          </div>

          <div className="glass-card p-6 glass-card-interactive space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#A37B34] text-white flex items-center justify-center font-bold">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#1C1917]">Cryptographic EPIN Keys</h3>
            <p className="text-xs text-[#554F47] leading-relaxed">
              Batch EPIN generation for plan activations. Atomic database transaction lock ensures zero duplicate redemptions.
            </p>
          </div>

          <div className="glass-card p-6 glass-card-interactive space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#5C1D24] text-[#F7F4EF] flex items-center justify-center font-bold">
              <Wallet className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#1C1917]">Double-Entry Ledger</h3>
            <p className="text-xs text-[#554F47] leading-relaxed">
              Wallets derive balances from immutable transaction logs. Every referral credit, binary payout, and withdrawal request is audited.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="glass-card p-10 text-center space-y-4 border-[#C5A059] bg-[#FAF7F2]">
          <h2 className="text-3xl font-serif font-bold text-[#1C1917]">Ready to Join the Network?</h2>
          <p className="text-sm text-[#554F47] max-w-xl mx-auto">
            Get an EPIN key from your sponsor, activate your preferred plan, and track your downline growth in real time.
          </p>
          <button 
            onClick={() => setView('register')}
            className="btn-gold text-sm py-3 px-8"
          >
            Register with EPIN Key
          </button>
        </div>
      </section>
    </div>
  );
}
