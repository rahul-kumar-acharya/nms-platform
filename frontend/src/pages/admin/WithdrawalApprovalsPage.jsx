import React, { useEffect, useState } from 'react';
import { withdrawalService } from '../../services/withdrawalService';
import Modal from '../../components/common/Modal';
import { SkeletonTable } from '../../components/common/Skeleton';
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

export default function WithdrawalApprovalsPage() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Action Modal State
  const [actionModal, setActionModal] = useState(null); // { action: 'approve'|'reject', id: number, member_id: string, amount: string }
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  const loadData = () => {
    setLoading(true);
    withdrawalService.getWithdrawals().then(res => {
      setWithdrawals(res.results || res || []);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const openApproveModal = (w) => {
    setNotes('Approved & transferred to bank account');
    setActionModal({
      action: 'approve',
      id: w.id,
      member_id: w.member_id,
      amount: w.amount,
      title: `Approve Withdrawal #${w.id} (₹${parseFloat(w.amount).toLocaleString()})`
    });
  };

  const openRejectModal = (w) => {
    setNotes('KYC / Bank details mismatch');
    setActionModal({
      action: 'reject',
      id: w.id,
      member_id: w.member_id,
      amount: w.amount,
      title: `Reject Withdrawal #${w.id}`
    });
  };

  const handleConfirmAction = () => {
    if (!actionModal) return;
    setProcessing(true);

    if (actionModal.action === 'approve') {
      withdrawalService.approveWithdrawal(actionModal.id, notes).then(() => {
        setProcessing(false);
        setActionModal(null);
        loadData();
      });
    } else {
      withdrawalService.rejectWithdrawal(actionModal.id, notes).then(() => {
        setProcessing(false);
        setActionModal(null);
        loadData();
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Modal Popup for Approval Notes / Rejection Reason */}
      <Modal
        isOpen={!!actionModal}
        onClose={() => setActionModal(null)}
        title={actionModal?.title}
        type={actionModal?.action === 'approve' ? 'success' : 'danger'}
        confirmText={actionModal?.action === 'approve' ? 'Approve Transfer' : 'Reject & Refund'}
        onConfirm={handleConfirmAction}
        loading={processing}
      >
        <div className="space-y-3">
          <p className="text-xs text-[#554F47]">
            {actionModal?.action === 'approve'
              ? `Confirm payout transfer of ₹${parseFloat(actionModal?.amount || 0).toLocaleString()} for member ${actionModal?.member_id}.`
              : `Reject payout request for member ${actionModal?.member_id}. Funds will be refunded back to the member's wallet.`}
          </p>
          <div>
            <label className="form-label">Admin Transfer Notes / Reason</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
              className="form-input text-xs h-20"
            />
          </div>
        </div>
      </Modal>

      <div className="glass-card p-6">
        <h3 className="text-xl font-serif font-bold text-[#1C1917]">Withdrawal Approval Queue</h3>
        <p className="text-xs text-[#736C63]">Review member payout requests & process banking transfers</p>
      </div>

      {loading ? (
        <SkeletonTable rows={5} cols={7} />
      ) : (
        <div className="glass-card p-6">
        <div className="overflow-x-auto">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Member</th>
                <th>Amount</th>
                <th>Payout Info</th>
                <th>Status</th>
                <th>Request Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-[#736C63]">No withdrawal requests found</td>
                </tr>
              ) : (
                withdrawals.map((w) => (
                  <tr key={w.id}>
                    <td className="font-bold text-[#1C1917]">#{w.id}</td>
                    <td>
                      <span className="font-bold text-[#1B3B2B] font-mono block">{w.member_id}</span>
                      <span className="text-xs text-[#554F47]">{w.member_name}</span>
                    </td>
                    <td className="font-extrabold text-[#1B3B2B]">₹{parseFloat(w.amount).toLocaleString()}</td>
                    <td className="text-xs text-[#554F47]">
                      {w.upi_id && <div>UPI: <code className="font-mono text-[#A37B34]">{w.upi_id}</code></div>}
                      {w.bank_account_no && <div>Acc: <code className="font-mono">{w.bank_account_no}</code> ({w.ifsc_code})</div>}
                    </td>
                    <td>
                      {w.status === 'APPROVED' && <span className="badge badge-active">APPROVED</span>}
                      {w.status === 'PENDING' && <span className="badge badge-pending">PENDING</span>}
                      {w.status === 'REJECTED' && <span className="badge badge-rejected">REJECTED</span>}
                    </td>
                    <td className="text-xs text-[#736C63]">{new Date(w.created_at).toLocaleDateString()}</td>
                    <td>
                      {w.status === 'PENDING' ? (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => openApproveModal(w)}
                            className="btn-success text-xs py-1 px-2.5"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => openRejectModal(w)}
                            className="btn-danger text-xs py-1 px-2.5"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-[#736C63] max-w-xs truncate">{w.admin_notes || 'Processed'}</span>
                      )}
                    </td>
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
