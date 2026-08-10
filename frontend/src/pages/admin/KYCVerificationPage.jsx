import React, { useEffect, useState } from 'react';
import { kycService } from '../../services/kycService';
import Modal from '../../components/common/Modal';
import { SkeletonTable } from '../../components/common/Skeleton';
import { ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';

export default function KYCVerificationPage() {
  const [kycs, setKycs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Action Modal State
  const [actionModal, setActionModal] = useState(null); // { type: 'approve'|'reject', id: number, member_id: string, defaultRemarks: string }
  const [remarks, setRemarks] = useState('');
  const [processing, setProcessing] = useState(false);

  const loadData = () => {
    setLoading(true);
    kycService.getKYC().then(res => {
      setKycs(res.results || res || []);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const openApproveModal = (k) => {
    setRemarks('Documents verified successfully');
    setActionModal({
      action: 'approve',
      id: k.id,
      member_id: k.member_id,
      title: `Approve KYC: ${k.member_id}`
    });
  };

  const openRejectModal = (k) => {
    setRemarks('Illegible document copy');
    setActionModal({
      action: 'reject',
      id: k.id,
      member_id: k.member_id,
      title: `Reject KYC: ${k.member_id}`
    });
  };

  const handleConfirmAction = () => {
    if (!actionModal) return;
    setProcessing(true);

    if (actionModal.action === 'approve') {
      kycService.verifyKYC(actionModal.id, remarks).then(() => {
        setProcessing(false);
        setActionModal(null);
        loadData();
      });
    } else {
      kycService.rejectKYC(actionModal.id, remarks).then(() => {
        setProcessing(false);
        setActionModal(null);
        loadData();
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Modal Popup for Approval / Rejection Remarks */}
      <Modal
        isOpen={!!actionModal}
        onClose={() => setActionModal(null)}
        title={actionModal?.title}
        type={actionModal?.action === 'approve' ? 'success' : 'danger'}
        confirmText={actionModal?.action === 'approve' ? 'Approve KYC' : 'Reject KYC'}
        onConfirm={handleConfirmAction}
        loading={processing}
      >
        <div className="space-y-3">
          <p className="text-xs text-[#554F47]">
            {actionModal?.action === 'approve'
              ? 'Specify administrative verification remarks for approving member document.'
              : 'Specify reason for document rejection. The member will be notified to resubmit.'}
          </p>
          <div>
            <label className="form-label">Admin Remarks / Notes</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              required
              className="form-input text-xs h-20"
            />
          </div>
        </div>
      </Modal>

      <div className="glass-card p-6">
        <h3 className="text-xl font-serif font-bold text-[#1C1917]">KYC Document Verification Queue</h3>
        <p className="text-xs text-[#736C63]">Review submitted member identity documents for compliance approval</p>
      </div>

      {loading ? (
        <SkeletonTable rows={5} cols={6} />
      ) : (
        <div className="glass-card p-6">
        <div className="overflow-x-auto">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Doc Type</th>
                <th>Doc Number</th>
                <th>Status</th>
                <th>Submitted Date</th>
                <th>Admin Actions</th>
              </tr>
            </thead>
            <tbody>
              {kycs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-[#736C63]">No submitted KYC records found</td>
                </tr>
              ) : (
                kycs.map((k) => (
                  <tr key={k.id}>
                    <td>
                      <span className="font-bold text-[#1B3B2B] font-mono block">{k.member_id}</span>
                      <span className="text-xs text-[#554F47]">{k.member_name}</span>
                    </td>
                    <td className="font-semibold text-[#1C1917]">{k.document_type}</td>
                    <td className="font-mono text-[#A37B34] text-xs font-bold">{k.document_number}</td>
                    <td>
                      {k.status === 'VERIFIED' && <span className="badge badge-active">VERIFIED</span>}
                      {k.status === 'PENDING' && <span className="badge badge-pending">PENDING</span>}
                      {k.status === 'REJECTED' && <span className="badge badge-rejected">REJECTED</span>}
                    </td>
                    <td className="text-xs text-[#736C63]">{new Date(k.submitted_at).toLocaleDateString()}</td>
                    <td>
                      {k.status === 'PENDING' ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => openApproveModal(k)} className="btn-success text-xs py-1 px-2.5">
                            Approve
                          </button>
                          <button onClick={() => openRejectModal(k)} className="btn-danger text-xs py-1 px-2.5">
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-[#736C63] max-w-xs truncate">{k.admin_remarks || 'Reviewed'}</span>
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
