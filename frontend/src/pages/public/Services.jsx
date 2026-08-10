import React from 'react';
import { ShieldCheck, GitBranch, KeyRound, Wallet, Zap, FileText } from 'lucide-react';
import SEO from '../../components/common/SEO';

export default function Services({ setView }) {
  const servicesList = [
    {
      icon: GitBranch,
      title: 'Binary Tree Placement Authority',
      description: 'Automated downline parent/child assignment with strict left/right position validation and recursion depth tracking.'
    },
    {
      icon: KeyRound,
      title: 'Cryptographic EPIN Management',
      description: 'Batch generation of secure 16-character keys for membership plan activation, CSV exporting, and status audit.'
    },
    {
      icon: Zap,
      title: 'Automated Binary & Referral Payout Engine',
      description: 'Real-time calculation of direct referral bonuses and binary pair payouts with daily capping limit protection.'
    },
    {
      icon: Wallet,
      title: 'Double-Entry Wallet Ledger',
      description: 'Financial ledger system recording every transaction credit and debit atomically for audit compliance.'
    },
    {
      icon: ShieldCheck,
      title: 'KYC Document Verification',
      description: 'Secure Aadhaar/PAN identification document processing for withdrawal eligibility and compliance verification.'
    },
    {
      icon: FileText,
      title: 'Audit Logging & Reporting',
      description: 'Complete audit trail recording all administrative actions, system payouts, and withdrawal approvals.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      <SEO 
        title="Services & Membership Plans"
        description="Comprehensive network management services: binary downline placement engines, cryptographic EPIN key generation, automated pair payout calculations, and double-entry wallet ledgers."
        keywords="network management services, binary placement engine, epin batch generation, referral bonus engine, double entry wallet ledger, kyc compliance"
        canonicalPath="/services"
      />

      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-bold text-[#A37B34] uppercase tracking-widest">Platform Capabilities</span>
        <h1 className="text-4xl font-serif font-extrabold text-[#1C1917]">System Services & Architectural Features</h1>
        <p className="text-sm text-[#554F47]">
          NMS provides complete end-to-end technology infrastructure for member management, tree visualization, and financial ledger accuracy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesList.map((srv, idx) => {
          const Icon = srv.icon;
          return (
            <div key={idx} className="glass-card p-6 glass-card-interactive space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#1B3B2B] text-[#C5A059] flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#1C1917]">{srv.title}</h3>
              <p className="text-xs text-[#554F47] leading-relaxed">{srv.description}</p>
            </div>
          );
        })}
      </div>

      <div className="glass-card p-8 bg-[#F4F0E8] border-[#C5A059] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-serif font-bold text-[#1C1917]">Need Custom Integration?</h3>
          <p className="text-xs text-[#554F47]">Our development team provides custom business rule setups & reporting engines.</p>
        </div>
        <button onClick={() => setView('contact')} className="btn-primary text-xs">
          Contact Development Team
        </button>
      </div>
    </div>
  );
}
