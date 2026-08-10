import React, { useEffect, useState } from 'react';
import { incomeService } from '../../services/incomeService';
import { SkeletonTable } from '../../components/common/Skeleton';
import { Zap } from 'lucide-react';

export default function IncomeManagementPage() {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const loadIncomes = () => {
    setLoading(true);
    incomeService.getIncomes().then(res => {
      setIncomes(res.results || res || []);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadIncomes();
  }, []);

  const handleRunEngine = () => {
    setRunning(true);
    incomeService.runBinaryEngine().then(() => {
      setRunning(false);
      loadIncomes();
    });
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-serif font-bold text-[#1C1917]">Income Payout Engine & Ledger</h3>
          <p className="text-xs text-[#736C63]">Calculated direct referral bonuses & binary pair payout records</p>
        </div>

        <button onClick={handleRunEngine} disabled={running} className="btn-gold text-xs">
          <Zap className="w-4 h-4" /> {running ? 'Calculating Pairs...' : 'Run Binary Payout Engine'}
        </button>
      </div>

      {loading ? (
        <SkeletonTable rows={6} cols={8} />
      ) : (
        <div className="glass-card p-6">
          <div className="overflow-x-auto">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Member ID</th>
                  <th>Member Name</th>
                  <th>Income Type</th>
                  <th>Amount</th>
                  <th>Source Member</th>
                  <th>Date & Time</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {incomes.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-6 text-[#736C63]">No income transactions generated yet</td>
                  </tr>
                ) : (
                  incomes.map(inc => (
                    <tr key={inc.id}>
                      <td className="font-bold text-[#1C1917]">#{inc.id}</td>
                      <td className="font-mono text-[#1B3B2B] font-bold">{inc.member_id}</td>
                      <td className="font-semibold text-[#2C2824]">{inc.member_name}</td>
                      <td>
                        <span className="badge badge-plan">{inc.type}</span>
                      </td>
                      <td className="font-extrabold text-[#1B3B2B]">₹{parseFloat(inc.amount).toLocaleString()}</td>
                      <td className="font-mono text-xs text-[#A37B34]">{inc.source_member_id || '-'}</td>
                      <td className="text-xs text-[#736C63]">{new Date(inc.created_at).toLocaleString()}</td>
                      <td className="text-xs text-[#554F47] max-w-xs truncate">{inc.description}</td>
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
