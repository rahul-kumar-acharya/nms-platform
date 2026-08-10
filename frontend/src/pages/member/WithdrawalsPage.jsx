import React, { useEffect, useState } from 'react';
import { withdrawalService } from '../../services/withdrawalService';
import { walletService } from '../../services/walletService';
import { ArrowDownRight, Send, AlertCircle, CheckCircle2, Clock, PlusCircle, History, ShieldCheck } from 'lucide-react';

export default function WithdrawalsPage() {
  const [activeTab, setActiveTab] = useState('request'); // 'request' or 'history'
  const [withdrawals, setWithdrawals] = useState([]);
  const [balance, setBalance] = useState('0');
  const [amount, setAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [upi, setUpi] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = () => {
    walletService.getMyWallet().then(res => setBalance(res.balance));
    withdrawalService.getWithdrawals().then(res => setWithdrawals(res.results || res || []));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    withdrawalService.createWithdrawal({
      amount: parseFloat(amount),
      bank_account_no: bankAccount,
      ifsc_code: ifsc,
      upi_id: upi
    }).then(res => {
      setSuccess(`Withdrawal request of ₹${parseFloat(res.amount).toLocaleString()} submitted successfully for admin compliance verification!`);
      setAmount('');
      setLoading(false);
      loadData();
    }).catch(err => {
      setError(err.response?.data?.detail || 'Failed to submit withdrawal request');
      setLoading(false);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-[#1B3B2B] via-[#132B1F] to-[#2C2824] text-white border-[#C5A059]">
        <div>
          <span className="text-xs font-bold text-[#C5A059] uppercase tracking-widest">Financial Treasury</span>
          <h2 className="text-3xl font-serif font-extrabold text-white mt-1">Payout & Withdrawal Portal</h2>
          <p className="text-xs text-[#D8CEBE] mt-1">Submit bank transfer requests & audit compliance status</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('request')}
            className={`btn-gold text-xs ${activeTab === 'request' ? 'ring-2 ring-white' : ''}`}
          >
            <PlusCircle className="w-4 h-4" /> Request Payout
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`btn-secondary text-xs bg-[#F4F0E8] text-[#1C1917] ${activeTab === 'history' ? 'border-[#C5A059] bg-[#EAE4D8]' : ''}`}
          >
            <History className="w-4 h-4" /> Payout History
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-[#E2DDD1] pb-3">
        <button
          onClick={() => setActiveTab('request')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'request'
              ? 'bg-[#1B3B2B] text-[#F7F4EF] border border-[#C5A059]'
              : 'text-[#554F47] hover:text-[#1C1917] hover:bg-[#EAE4D8]'
          }`}
        >
          Submit Withdrawal Request
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'history'
              ? 'bg-[#1B3B2B] text-[#F7F4EF] border border-[#C5A059]'
              : 'text-[#554F47] hover:text-[#1C1917] hover:bg-[#EAE4D8]'
          }`}
        >
          Request History ({withdrawals.length})
        </button>
      </div>

      {activeTab === 'request' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Balance & Compliance Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-card p-6 border-[#C5A059]">
              <span className="text-xs font-bold text-[#736C63] uppercase tracking-wider block">Available Balance for Payout</span>
              <p className="text-4xl font-serif font-extrabold text-[#1B3B2B] mt-2">₹{parseFloat(balance).toLocaleString()}</p>
              <div className="mt-4 pt-4 border-t border-[#E2DDD1] text-xs text-[#554F47] space-y-2">
                <div className="flex justify-between">
                  <span>Minimum Threshold:</span>
                  <span className="font-bold text-[#1C1917]">₹500.00</span>
                </div>
                <div className="flex justify-between">
                  <span>KYC Status:</span>
                  <span className="font-bold text-[#1B3B2B] inline-flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FDF8E7] border border-[#F0DFA8] text-xs text-[#554F47] space-y-2">
              <p className="font-bold text-[#8C6200] uppercase tracking-wider text-[11px]">Payout Guidelines:</p>
              <p>• Requests submitted are placed in the admin compliance approval queue.</p>
              <p>• Funds are reserved immediately from your available wallet balance upon submission.</p>
            </div>
          </div>

          {/* Dedicated Request Withdrawal Form */}
          <div className="lg:col-span-7">
            <div className="glass-card p-8 bg-white space-y-4">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#1C1917]">Request Payout Transfer</h3>
                <p className="text-xs text-[#736C63]">Specify withdrawal amount and receiving bank/UPI account</p>
              </div>

              {error && <div className="p-3.5 rounded-xl bg-[#FDF0F0] border border-[#F3C6C6] text-[#8C2525] text-xs font-semibold">{error}</div>}
              {success && <div className="p-3.5 rounded-xl bg-[#EAF2EC] border border-[#B8D4C1] text-[#1B3B2B] text-xs font-semibold">{success}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="form-label">Withdrawal Amount (₹)</label>
                  <input
                    type="number"
                    min="500"
                    step="100"
                    placeholder="e.g. 1500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="form-input text-sm"
                  />
                  <p className="text-[11px] text-[#736C63] mt-1">Minimum ₹500 up to available balance</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Bank Account Number</label>
                    <input
                      type="text"
                      placeholder="Account Number"
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      required
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">IFSC Code</label>
                    <input
                      type="text"
                      placeholder="SBIN0001234"
                      value={ifsc}
                      onChange={(e) => setIfsc(e.target.value)}
                      required
                      className="form-input font-mono uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">UPI ID (Optional)</label>
                  <input
                    type="text"
                    placeholder="member@upi"
                    value={upi}
                    onChange={(e) => setUpi(e.target.value)}
                    className="form-input"
                  />
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-sm py-3 mt-2">
                  <Send className="w-4 h-4" />
                  {loading ? 'Submitting Request...' : 'Submit Payout Request'}
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        /* History View */
        <div className="glass-card p-6">
          <h3 className="text-xl font-serif font-bold text-[#1C1917] mb-4">Withdrawal Request History</h3>
          <div className="overflow-x-auto">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Bank Account</th>
                  <th>Admin Notes</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-[#736C63]">No withdrawal requests submitted yet</td>
                  </tr>
                ) : (
                  withdrawals.map((w) => (
                    <tr key={w.id}>
                      <td className="font-bold text-[#1C1917]">#{w.id}</td>
                      <td className="text-xs text-[#736C63]">{new Date(w.created_at).toLocaleDateString()}</td>
                      <td className="font-extrabold text-[#1B3B2B]">₹{parseFloat(w.amount).toLocaleString()}</td>
                      <td>
                        {w.status === 'APPROVED' && <span className="badge badge-active flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Approved</span>}
                        {w.status === 'PENDING' && <span className="badge badge-pending flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Pending</span>}
                        {w.status === 'REJECTED' && <span className="badge badge-rejected flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Rejected</span>}
                      </td>
                      <td className="text-xs font-mono text-[#554F47]">{w.bank_account_no || w.upi_id || '-'}</td>
                      <td className="text-xs text-[#736C63] max-w-xs truncate">{w.admin_notes || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
