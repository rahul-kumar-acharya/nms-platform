import React, { useState, useEffect } from 'react';
import { epinService } from '../../services/epinService';
import { walletService } from '../../services/walletService';
import { planService } from '../../services/planService';
import { memberService } from '../../services/memberService';
import { authService } from '../../services/authService';
import SEO from '../../components/common/SEO';
import Modal from '../../components/common/Modal';
import { 
  KeyRound, ShoppingCart, Send, Copy, Check, 
  ExternalLink, ShieldCheck, AlertCircle, RefreshCw,
  Clock, ArrowRight, UserCheck, CheckCircle2
} from 'lucide-react';

export default function MyEpinsPage() {
  const currentUser = authService.getCurrentUser();
  const memberId = currentUser?.member_profile?.member_id || currentUser?.username || 'M00001';

  const [epins, setEpins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [plans, setPlans] = useState([]);
  const [members, setMembers] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);
  const [copiedLinkId, setCopiedLinkId] = useState(null);

  // Buy EPIN Modal state
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [purchasing, setPurchasing] = useState(false);
  const [buyError, setBuyError] = useState('');
  const [buySuccess, setBuySuccess] = useState('');

  // Transfer Modal state
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferEpin, setTransferEpin] = useState(null);
  const [targetMemberId, setTargetMemberId] = useState('');
  const [transferring, setTransferring] = useState(false);
  const [transferError, setTransferError] = useState('');
  const [transferSuccess, setTransferSuccess] = useState('');

  const loadData = () => {
    setLoading(true);
    Promise.all([
      epinService.getMyEpins(),
      walletService.getMyWallet(),
      planService.getPlans(),
      memberService.getMembers()
    ]).then(([epinsData, walletData, plansData, membersData]) => {
      setEpins(Array.isArray(epinsData) ? epinsData : epinsData.results || []);
      setWallet(walletData);
      const activePlans = (Array.isArray(plansData) ? plansData : plansData.results || []).filter(p => p.is_active);
      setPlans(activePlans);
      if (activePlans.length > 0 && !selectedPlanId) {
        setSelectedPlanId(activePlans[0].id);
      }
      const memberList = Array.isArray(membersData) ? membersData : membersData.results || [];
      setMembers(memberList);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopyCode = (epin) => {
    navigator.clipboard.writeText(epin.code);
    setCopiedId(epin.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyRegistrationLink = (epin) => {
    const origin = window.location.origin;
    const link = `${origin}/register?sponsor=${memberId}&parent=${memberId}&epin=${epin.code}&position=LEFT`;
    navigator.clipboard.writeText(link);
    setCopiedLinkId(epin.id);
    setTimeout(() => setCopiedLinkId(null), 2500);
  };

  const handleBuySubmit = (e) => {
    e.preventDefault();
    if (!selectedPlanId) return;
    setBuyError('');
    setBuySuccess('');
    setPurchasing(true);

    epinService.purchaseWithWallet(Number(selectedPlanId), Number(buyQuantity))
      .then(res => {
        setPurchasing(false);
        setBuySuccess(res.message || 'EPIN(s) purchased successfully!');
        loadData();
        setTimeout(() => {
          setBuyModalOpen(false);
          setBuySuccess('');
        }, 1800);
      })
      .catch(err => {
        setPurchasing(false);
        setBuyError(err.response?.data?.detail || err.message || 'Purchase failed');
      });
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    if (!transferEpin || !targetMemberId) return;
    setTransferError('');
    setTransferSuccess('');
    setTransferring(true);

    epinService.transferEpin(transferEpin.id, targetMemberId.trim().toUpperCase())
      .then(res => {
        setTransferring(false);
        setTransferSuccess(res.message || 'EPIN transferred successfully!');
        loadData();
        setTimeout(() => {
          setTransferModalOpen(false);
          setTransferSuccess('');
          setTransferEpin(null);
          setTargetMemberId('');
        }, 1800);
      })
      .catch(err => {
        setTransferring(false);
        setTransferError(err.response?.data?.detail || err.message || 'Transfer failed');
      });
  };

  const filteredEpins = epins.filter(e => {
    if (statusFilter === 'ALL') return true;
    return e.status === statusFilter;
  });

  const unusedCount = epins.filter(e => e.status === 'UNUSED').length;
  const usedCount = epins.filter(e => e.status === 'USED').length;
  const walletBalance = Number(wallet?.balance || 0);

  const selectedPlan = plans.find(p => p.id === Number(selectedPlanId)) || plans[0];
  const totalCost = selectedPlan ? Number(selectedPlan.price) * Number(buyQuantity) : 0;
  const hasSufficientBalance = walletBalance >= totalCost;

  return (
    <div className="space-y-6">
      <SEO 
        title="My EPINs Inventory | NMS Member"
        description="Manage your assigned EPIN activation keys, purchase new keys with wallet balance, and share referral registration links."
      />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#1B3B2B] to-[#254F3A] p-6 rounded-2xl text-white shadow-sm border border-[#C5A059]/30">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#C5A059]/20 text-[#E5C378] text-xs font-semibold">
            <KeyRound className="w-3.5 h-3.5" />
            Activation Inventory
          </div>
          <h1 className="text-2xl font-serif font-bold !text-white text-white tracking-tight" style={{ color: '#FFFFFF' }}>My EPIN Keys</h1>
          <p className="text-xs text-[#B8D4C1] max-w-xl">
            View your active registration keys, purchase new plan activation keys directly from your wallet balance, or transfer keys to your team members.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setBuyModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#D4AF67] text-[#1C1917] font-semibold text-xs transition-all shadow-md active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            Buy with Wallet
          </button>
          <button
            onClick={loadData}
            title="Refresh list"
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#E7E2D9] shadow-xs">
          <span className="text-xs text-[#736C63] font-medium block">Wallet Balance</span>
          <div className="text-xl font-bold font-mono text-[#1B3B2B] mt-1">
            ₹{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-[#A37B34] font-semibold block mt-1">Available for EPIN purchases</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E7E2D9] shadow-xs">
          <span className="text-xs text-[#736C63] font-medium block">Unused / Active Keys</span>
          <div className="text-xl font-bold font-mono text-[#2B5E3F] mt-1">{unusedCount}</div>
          <span className="text-[10px] text-[#2B5E3F] font-semibold block mt-1">Ready for new joins</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E7E2D9] shadow-xs">
          <span className="text-xs text-[#736C63] font-medium block">Redeemed Keys</span>
          <div className="text-xl font-bold font-mono text-[#736C63] mt-1">{usedCount}</div>
          <span className="text-[10px] text-[#736C63] block mt-1">Joined your network</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E7E2D9] shadow-xs">
          <span className="text-xs text-[#736C63] font-medium block">Total Assigned</span>
          <div className="text-xl font-bold font-mono text-[#1C1917] mt-1">{epins.length}</div>
          <span className="text-[10px] text-[#736C63] block mt-1">Lifetime allocation</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-[#E7E2D9] shadow-xs overflow-hidden">
        {/* Table Filters & Toolbar */}
        <div className="p-4 border-b border-[#E7E2D9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            {['ALL', 'UNUSED', 'USED'].map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === tab 
                    ? 'bg-[#1B3B2B] text-white shadow-xs' 
                    : 'bg-white text-[#736C63] hover:bg-[#F0ECE3] border border-[#E7E2D9]'
                }`}
              >
                {tab === 'ALL' ? 'All Keys' : tab === 'UNUSED' ? 'Active / Unused' : 'Redeemed'}
              </button>
            ))}
          </div>

          <div className="text-xs text-[#736C63]">
            Showing <span className="font-bold text-[#1C1917]">{filteredEpins.length}</span> key(s)
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="p-12 text-center text-xs text-[#736C63]">Loading EPIN inventory...</div>
        ) : filteredEpins.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#F0ECE3] text-[#736C63] flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-[#1C1917] text-base">No EPINs Found</h3>
            <p className="text-xs text-[#736C63] max-w-sm mx-auto">
              {statusFilter === 'ALL' 
                ? 'You do not have any EPIN keys assigned yet. Buy keys with your wallet balance or request from admin.'
                : `No ${statusFilter.toLowerCase()} EPIN keys match this filter.`}
            </p>
            {statusFilter === 'ALL' && (
              <button
                onClick={() => setBuyModalOpen(true)}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B3B2B] text-white text-xs font-semibold hover:bg-[#254F3A]"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Purchase First EPIN
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[#736C63] border-b border-[#E7E2D9] font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">EPIN Code</th>
                  <th className="py-3 px-4">Plan Name</th>
                  <th className="py-3 px-4">Value</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Redeemed By</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E2D9]">
                {filteredEpins.map((epin) => {
                  const isUnused = epin.status === 'UNUSED';
                  return (
                    <tr key={epin.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#1B3B2B] select-all">
                        {epin.code}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#1C1917]">
                        {epin.plan_detail?.name || `Plan #${epin.plan}`}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#1C1917]">
                        ₹{Number(epin.plan_detail?.price || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isUnused
                            ? 'bg-[#EAF2EC] text-[#2B5E3F] border border-[#B8D4C1]'
                            : 'bg-[#F0ECE3] text-[#736C63] border border-[#D8CEBE]'
                        }`}>
                          {isUnused ? <ShieldCheck className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                          {epin.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#554F47]">
                        {epin.used_by_member_id ? (
                          <span className="text-[#1B3B2B] font-bold">{epin.used_by_member_id}</span>
                        ) : (
                          <span className="text-[#A8A29E]">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-[#736C63]">
                        {new Date(epin.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isUnused ? (
                            <>
                              <button
                                onClick={() => handleCopyCode(epin)}
                                title="Copy EPIN key"
                                className="px-2.5 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#EAE4D7] text-[#1B3B2B] border border-[#D8CEBE] font-medium text-[11px] inline-flex items-center gap-1 transition-colors"
                              >
                                {copiedId === epin.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-[#2B5E3F]" />
                                    Copied!
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    Copy Key
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() => handleCopyRegistrationLink(epin)}
                                title="Copy direct sign-up link with this EPIN"
                                className="px-2.5 py-1.5 rounded-lg bg-[#1B3B2B] hover:bg-[#254F3A] text-white font-medium text-[11px] inline-flex items-center gap-1 transition-colors"
                              >
                                {copiedLinkId === epin.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-[#A3E635]" />
                                    Link Copied!
                                  </>
                                ) : (
                                  <>
                                    <ExternalLink className="w-3 h-3" />
                                    Referral Link
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() => {
                                  setTransferEpin(epin);
                                  setTransferError('');
                                  setTransferSuccess('');
                                  setTargetMemberId('');
                                  setTransferModalOpen(true);
                                }}
                                title="Transfer EPIN to another member"
                                className="p-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#EAE4D7] text-[#736C63] hover:text-[#1C1917] border border-[#D8CEBE] transition-colors"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <span className="text-[11px] text-[#A8A29E] italic">Redeemed</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Purchase EPIN */}
      <Modal
        isOpen={buyModalOpen}
        onClose={() => setBuyModalOpen(false)}
        title="Purchase EPIN Key"
        hideFooter={true}
      >
        <form onSubmit={handleBuySubmit} className="space-y-4">
          <p className="text-xs text-[#736C63]">
            Deduct plan activation amount directly from your wallet balance to generate instant cryptographic keys.
          </p>

          {buyError && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{buyError}</span>
            </div>
          )}

          {buySuccess && (
            <div className="p-3 rounded-xl bg-green-50 text-green-700 border border-green-200 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{buySuccess}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1C1917] block">Select Plan</label>
            <select
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#D8CEBE] bg-[#FAF8F5] text-xs font-medium focus:outline-hidden focus:border-[#C5A059]"
            >
              {plans.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} — ₹{Number(p.price).toLocaleString('en-IN')} (Referral Bonus: ₹{Number(p.referral_bonus)})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1C1917] block">Quantity</label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 5, 10].map(qty => (
                <button
                  type="button"
                  key={qty}
                  onClick={() => setBuyQuantity(qty)}
                  className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                    buyQuantity === qty 
                      ? 'bg-[#1B3B2B] text-white border-[#1B3B2B]' 
                      : 'bg-[#FAF8F5] text-[#736C63] border-[#D8CEBE] hover:bg-[#EAE4D7]'
                  }`}
                >
                  {qty} Key{qty > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Summary Box */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] space-y-2">
            <div className="flex justify-between text-xs text-[#736C63]">
              <span>Plan Unit Price:</span>
              <span className="font-mono text-[#1C1917]">₹{Number(selectedPlan?.price || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-xs text-[#736C63]">
              <span>Quantity:</span>
              <span className="font-mono text-[#1C1917]">{buyQuantity}</span>
            </div>
            <div className="border-t border-[#E7E2D9] pt-2 flex justify-between text-sm font-bold">
              <span className="text-[#1C1917]">Total Debit:</span>
              <span className="font-mono text-[#1B3B2B]">₹{totalCost.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[#736C63]">Your Current Balance:</span>
              <span className={`font-mono font-bold ${hasSufficientBalance ? 'text-[#2B5E3F]' : 'text-red-600'}`}>
                ₹{walletBalance.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {!hasSufficientBalance && (
            <p className="text-[11px] text-red-600 font-medium">
              * Insufficient wallet balance to complete this purchase. Earn commissions or request keys from admin.
            </p>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setBuyModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#D8CEBE] text-xs font-semibold text-[#736C63] hover:bg-[#FAF8F5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={purchasing || !hasSufficientBalance}
              className="px-5 py-2 rounded-xl bg-[#1B3B2B] hover:bg-[#254F3A] disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              {purchasing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Confirm & Buy
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Transfer EPIN */}
      <Modal
        isOpen={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        title="Transfer EPIN to Downline Member"
        hideFooter={true}
      >
        <form onSubmit={handleTransferSubmit} className="space-y-4">
          <p className="text-xs text-[#736C63]">
            Transfer ownership of this unused key directly to another member by selecting them from the list.
          </p>

          {transferError && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{transferError}</span>
            </div>
          )}

          {transferSuccess && (
            <div className="p-3 rounded-xl bg-green-50 text-green-700 border border-green-200 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{transferSuccess}</span>
            </div>
          )}

          {transferEpin && (
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] space-y-1">
              <span className="text-[10px] text-[#736C63] uppercase tracking-wider block font-semibold">Selected Key</span>
              <div className="font-mono font-bold text-[#1B3B2B] text-sm">{transferEpin.code}</div>
              <span className="text-xs text-[#554F47] block">{transferEpin.plan_detail?.name} (₹{Number(transferEpin.plan_detail?.price || 0)})</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1C1917] block">Select Recipient Member</label>
            <select
              required
              value={targetMemberId}
              onChange={(e) => setTargetMemberId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#D8CEBE] bg-[#FAF8F5] text-xs font-bold text-[#1C1917] focus:outline-hidden focus:border-[#C5A059]"
            >
              <option value="">-- Choose Member from Network --</option>
              {members.filter(m => m.member_id !== memberId).map(m => (
                <option key={m.id} value={m.member_id}>
                  {m.member_id} — {m.full_name} ({m.mobile || 'No Mobile'})
                </option>
              ))}
            </select>
            <span className="text-[10px] text-[#736C63]">The recipient member will immediately see this key in their &quot;My EPINs&quot; dashboard.</span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setTransferModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#D8CEBE] text-xs font-semibold text-[#736C63] hover:bg-[#FAF8F5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={transferring || !targetMemberId}
              className="px-5 py-2 rounded-xl bg-[#1B3B2B] hover:bg-[#254F3A] disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              {transferring ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Transferring...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Confirm Transfer
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
