import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import SEO from '../../components/common/SEO';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'What is an EPIN key and how do I get one?',
      a: 'An EPIN is a cryptographically generated 16-character key issued by system administrators. You can obtain an EPIN from your sponsor or direct administrator to activate your plan during registration.'
    },
    {
      q: 'How does the Binary Pair Payout Engine work?',
      a: 'The binary engine evaluates member volume under your Left and Right subtrees. For every matched pair (e.g. 1 Left : 1 Right), a pair payout is credited to your ledger wallet up to your plan daily capping limit.'
    },
    {
      q: 'What are the rules and requirements for withdrawals?',
      a: 'Withdrawal requests require a minimum balance of ₹500 and a VERIFIED KYC status (Aadhaar or PAN document verified by admin). Submitted requests reserve funds and undergo compliance review before bank transfer.'
    },
    {
      q: 'What is the difference between Sponsor ID and Parent ID?',
      a: 'Sponsor ID represents the member who directly referred you to the platform (Referral Tree). Parent ID represents your physical placement parent in the Binary Network Tree.'
    },
    {
      q: 'Is my financial data and wallet ledger secure?',
      a: 'Yes. All wallet balances are derived using double-entry ledger bookkeeping. Every credit, debit, or referral bonus produces an immutable audit record.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <SEO 
        title="FAQ & Help Center"
        description="Frequently asked questions about NMS platform registration, EPIN activation keys, binary pair payouts, withdrawal limits, and KYC document verification."
        keywords="nms faq, binary pair payout questions, epin activation help, withdrawal requirements, sponsor id vs parent id, kyc verification help"
        canonicalPath="/faq"
      />

      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#A37B34] uppercase tracking-widest">Help Center</span>
        <h1 className="text-4xl font-serif font-extrabold text-[#1C1917]">Frequently Asked Questions</h1>
        <p className="text-sm text-[#554F47]">Clear answers regarding plans, EPINs, pair payouts, and withdrawals.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="glass-card overflow-hidden">
              <button 
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full p-5 text-left flex items-center justify-between font-serif font-bold text-lg text-[#1C1917]"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp className="w-5 h-5 text-[#A37B34]" /> : <ChevronDown className="w-5 h-5 text-[#736C63]" />}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-[#554F47] leading-relaxed border-t border-[#E2DDD1]">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
