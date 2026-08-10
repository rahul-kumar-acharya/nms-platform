import React from 'react';
import { GitBranch, ShieldCheck, Zap, Lock, RefreshCw, Layers } from 'lucide-react';
import SEO from '../../components/common/SEO';

export default function Features({ setView }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
      <SEO 
        title="Platform Features & Binary Tree Visualizer"
        description="Explore advanced NMS platform features: interactive binary downline hierarchy tree, immutable double-entry ledger, daily pair capping enforcement, and instant withdrawal processing."
        keywords="binary tree visualizer, network hierarchy tree, double entry ledger, daily pair capping, instant withdrawal portal, mlm features"
        canonicalPath="/features"
      />

      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-bold text-[#A37B34] uppercase tracking-widest">Platform Engineering</span>
        <h1 className="text-4xl font-serif font-extrabold text-[#1C1917]">Advanced Platform Features</h1>
        <p className="text-sm text-[#554F47]">
          Built with Django 5 & React 18, NMS offers institutional security, interactive tree visualizations, and automated pair payouts.
        </p>
      </div>

      <div className="space-y-8">
        <div className="glass-card p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="badge badge-plan">Visual Tree Visualizer</span>
            <h2 className="text-2xl font-serif font-bold text-[#1C1917]">Interactive Binary Downline Tree</h2>
            <p className="text-xs text-[#554F47] leading-relaxed">
              Explore your downline network structure with zoom, pan, member search, left/right team counts, and direct slot activation triggers.
            </p>
            <button onClick={() => setView('register')} className="btn-gold text-xs">
              Try Binary Tree View
            </button>
          </div>
          <div className="p-6 rounded-2xl bg-[#F0ECE3] border border-[#D6CFB9] text-center font-mono text-xs text-[#1B3B2B] space-y-2">
            <p className="font-bold">ROOT M00001 (Victoria Sterling)</p>
            <div className="flex justify-between pt-4 border-t border-[#C5A059]/40">
              <span className="p-2 rounded bg-white border border-[#E2DDD1]">LEFT: M00002 (Arthur)</span>
              <span className="p-2 rounded bg-white border border-[#E2DDD1]">RIGHT: M00003 (Eleanor)</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="p-6 rounded-2xl bg-[#F0ECE3] border border-[#D6CFB9] space-y-2 text-xs">
            <div className="p-2 bg-white rounded border border-[#E2DDD1] flex justify-between font-mono">
              <span>CREDIT: Referral Bonus</span>
              <span className="text-[#1B3B2B] font-bold">+₹500.00</span>
            </div>
            <div className="p-2 bg-white rounded border border-[#E2DDD1] flex justify-between font-mono">
              <span>CREDIT: Binary Pair Payout</span>
              <span className="text-[#1B3B2B] font-bold">+₹1,000.00</span>
            </div>
            <div className="p-2 bg-white rounded border border-[#E2DDD1] flex justify-between font-mono">
              <span>DEBIT: Withdrawal Request</span>
              <span className="text-[#8C2525] font-bold">-₹1,500.00</span>
            </div>
          </div>
          <div className="space-y-4">
            <span className="badge badge-active">Double-Entry Security</span>
            <h2 className="text-2xl font-serif font-bold text-[#1C1917]">Immutable Wallet Ledger</h2>
            <p className="text-xs text-[#554F47] leading-relaxed">
              Balances are never directly mutated. Every credit and debit transaction creates an immutable log verified against total transaction history.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
