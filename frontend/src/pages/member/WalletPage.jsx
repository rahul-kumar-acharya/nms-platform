import React, { useEffect, useState } from 'react';
import { walletService } from '../../services/walletService';
import { Wallet, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';

export default function WalletPage() {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWalletData = () => {
    setLoading(true);
    Promise.all([
      walletService.getMyWallet(),
      walletService.getTransactions()
    ]).then(([wRes, tRes]) => {
      setWallet(wRes);
      setTransactions(tRes.results || tRes || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadWalletData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Wallet Balance Header */}
      <div className="glass-card p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase">Personal Wallet Balance</span>
          <h2 className="text-3xl font-extrabold text-white mt-1">₹{parseFloat(wallet?.balance || 0).toLocaleString()}</h2>
          <p className="text-xs text-slate-400 mt-1">Total Lifetime Earnings: ₹{parseFloat(wallet?.total_earnings || 0).toLocaleString()}</p>
        </div>

        <button onClick={loadWalletData} className="btn-secondary">
          <RefreshCw className="w-4 h-4" /> Refresh Balance
        </button>
      </div>

      {/* Ledger Transactions Table */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-white mb-4">Immutable Wallet Ledger Log</h3>
        
        {loading ? (
          <p className="text-slate-400 text-sm py-4">Loading ledger transactions...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Balance After</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-slate-400">No transactions recorded yet</td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="text-slate-300 text-xs font-mono">{new Date(tx.created_at).toLocaleString()}</td>
                      <td>
                        <span className="badge badge-plan">{tx.category}</span>
                      </td>
                      <td>
                        {tx.type === 'CREDIT' ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1 text-xs">
                            <ArrowUpRight className="w-3.5 h-3.5" /> CREDIT
                          </span>
                        ) : (
                          <span className="text-rose-400 font-bold flex items-center gap-1 text-xs">
                            <ArrowDownRight className="w-3.5 h-3.5" /> DEBIT
                          </span>
                        )}
                      </td>
                      <td className={`font-bold ${tx.type === 'CREDIT' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {tx.type === 'CREDIT' ? '+' : '-'}₹{parseFloat(tx.amount).toLocaleString()}
                      </td>
                      <td className="font-semibold text-white">₹{parseFloat(tx.balance_after).toLocaleString()}</td>
                      <td className="text-slate-300 text-xs max-w-xs truncate">{tx.description}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
