import React, { useState } from 'react';
import { User, ChevronRight, ChevronDown } from 'lucide-react';

function ReferralNode({ node }) {
  const [open, setOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="ml-4 my-2 border-l border-[#C5A059]/30 pl-4">
      <div className="flex items-center gap-3 p-3 glass-card glass-card-interactive max-w-lg bg-white border-[#E2DDD1]">
        {hasChildren && (
          <button 
            onClick={() => setOpen(!open)}
            className="p-1 text-[#736C63] hover:text-[#1C1917]"
          >
            {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        )}
        <div className="w-8 h-8 rounded-full bg-[#1B3B2B] text-[#C5A059] flex items-center justify-center font-bold text-xs">
          <User className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-[#1C1917] text-sm">{node.member_id}</span>
            <span className="badge badge-plan">{node.plan_name}</span>
          </div>
          <p className="text-xs text-[#554F47]">{node.full_name}</p>
        </div>
        <div className="text-right text-xs">
          <span className="text-[#1B3B2B] font-extrabold">{node.direct_referrals_count} Directs</span>
        </div>
      </div>

      {hasChildren && open && (
        <div className="space-y-1">
          {node.children.map((child) => (
            <ReferralNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ReferralTree({ treeData }) {
  if (!treeData) {
    return (
      <div className="glass-card p-12 text-center text-[#736C63]">
        <p>No referral downline hierarchy data found</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-serif font-bold text-[#1C1917] mb-4">Direct & Downline Referral Hierarchy</h3>
      <ReferralNode node={treeData} />
    </div>
  );
}
