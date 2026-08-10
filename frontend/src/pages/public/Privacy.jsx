import React from 'react';
import SEO from '../../components/common/SEO';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <SEO 
        title="Privacy Policy"
        description="NMS Platform privacy policy governing member data protection, KYC identification security, double-entry wallet ledger integrity, and compliance standards."
        keywords="nms privacy policy, member data security, kyc document protection, double entry ledger security"
        canonicalPath="/privacy"
      />

      <div className="space-y-3">
        <span className="text-xs font-bold text-[#A37B34] uppercase tracking-widest">Compliance</span>
        <h1 className="text-4xl font-serif font-extrabold text-[#1C1917]">Privacy Policy</h1>
        <p className="text-xs text-[#736C63]">Last Updated: August 2026</p>
      </div>

      <div className="glass-card p-8 space-y-6 text-xs text-[#554F47] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-serif font-bold text-[#1C1917]">1. Data Collection</h2>
          <p>
            Network Management System (NMS) collects member information necessary for account administration, downline network tree placement, KYC compliance, and automated financial ledger processing. Information collected includes full name, contact mobile, email address, bank account details, and identification documents.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-serif font-bold text-[#1C1917]">2. Financial Ledger & EPIN Integrity</h2>
          <p>
            All financial activities, referral payouts, binary pair payouts, and EPIN key redemptions are recorded as double-entry ledger transactions. Data is encrypted using industry standards and retained for regulatory compliance.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-serif font-bold text-[#1C1917]">3. Data Sharing & Disclosure</h2>
          <p>
            NMS does not sell, lease, or share member personal data with third-party marketers. Information is disclosed solely for authorized bank payout processing or as required by law.
          </p>
        </section>
      </div>
    </div>
  );
}
