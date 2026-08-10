import React from 'react';
import { Award, ShieldCheck, GitBranch, KeyRound, Wallet } from 'lucide-react';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-[calc(100vh-160px)] bg-[#F7F4EF] flex flex-col justify-center items-center p-4 sm:p-8 relative overflow-hidden text-[#2C2824]">
      {/* Decorative Vintage Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1B3B2B]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-5xl z-10 my-auto py-4">
        {/* Unified 2-Column Card Box with Identical Width & Min-Height */}
        <div className="glass-card bg-white border border-[#E2DDD1] shadow-[0_12px_36px_-4px_rgba(35,30,25,0.08)] overflow-hidden min-h-[580px] grid grid-cols-1 lg:grid-cols-12 p-0">
          
          {/* Left Column: Fixed Content & Branding (5 cols) */}
          <div className="lg:col-span-5 bg-[#EFECE3] border-b lg:border-b-0 lg:border-r border-[#E2DDD1] p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4EFE6] border border-[#D8C8AF] text-[#8C6200] text-[11px] font-bold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5 text-[#A37B34]" /> Institutional Binary Portal
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-[#1C1917] leading-tight">
                  {title || 'Network Management System'}
                </h1>
                <p className="text-xs text-[#554F47] leading-relaxed">
                  {subtitle || 'Enterprise binary network placement, double-entry wallet ledger, and automated pair payouts.'}
                </p>
              </div>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EAF2EC] text-[#1B3B2B] flex items-center justify-center shrink-0 mt-0.5">
                    <GitBranch className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xs text-[#1C1917]">Binary Tree Placement</h4>
                    <p className="text-[11px] text-[#736C63]">Real-time node visualizer with left & right team tracking.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F4EFE6] text-[#A37B34] flex items-center justify-center shrink-0 mt-0.5">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xs text-[#1C1917]">EPIN Activation Key</h4>
                    <p className="text-[11px] text-[#736C63]">Cryptographic key validation for plan activations.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EAF2EC] text-[#1B3B2B] flex items-center justify-center shrink-0 mt-0.5">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xs text-[#1C1917]">Double-Entry Ledger</h4>
                    <p className="text-[11px] text-[#736C63]">Immutable transaction logs derived from pair payouts.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-[#E2DDD1] text-[11px] text-[#554F47] flex items-center gap-2.5 mt-6">
              <ShieldCheck className="w-4 h-4 text-[#1B3B2B] shrink-0" />
              <span>Compliant with bank payout protocols & KYC verification.</span>
            </div>
          </div>

          {/* Right Column: Form Container (7 cols) - Same Height */}
          <div className="lg:col-span-7 p-8 flex flex-col justify-between bg-white min-h-[580px]">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
}
