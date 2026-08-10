import React from 'react';
import SEO from '../../components/common/SEO';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <SEO 
        title="Terms & Conditions"
        description="Official NMS Platform terms of service governing member plan activation, cryptographic EPIN redemptions, daily pair capping limits, and withdrawal compliance."
        keywords="nms terms and conditions, epin terms of service, binary pair capping rules, withdrawal compliance"
        canonicalPath="/terms"
      />

      <div className="space-y-3">
        <span className="text-xs font-bold text-[#A37B34] uppercase tracking-widest">Legal</span>
        <h1 className="text-4xl font-serif font-extrabold text-[#1C1917]">Terms & Conditions</h1>
        <p className="text-xs text-[#736C63]">Effective Date: August 2026</p>
      </div>

      <div className="glass-card p-8 space-y-6 text-xs text-[#554F47] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-serif font-bold text-[#1C1917]">1. Network Participation & EPIN Registration</h2>
          <p>
            Membership requires plan activation via a valid cryptographic EPIN key. EPIN keys are non-refundable once redeemed. Each member is assigned a unique Member ID and placement position in the binary network tree.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-serif font-bold text-[#1C1917]">2. Income & Pair Capping Rules</h2>
          <p>
            Direct referral bonuses and binary pair payouts are computed according to your active plan rules. Pair payouts are strictly capped at your plan's daily capping limit. Frontend displays are informational; payouts are authoritatively computed on the backend server.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-serif font-bold text-[#1C1917]">3. Withdrawal Eligibility & KYC</h2>
          <p>
            Members must complete KYC document verification prior to submitting withdrawal requests. Minimum withdrawal threshold is ₹500. System administrators reserve the right to audit and reject invalid banking details.
          </p>
        </section>
      </div>
    </div>
  );
}
