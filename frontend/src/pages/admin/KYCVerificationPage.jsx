import React, { useEffect, useState } from 'react';
import { kycService } from '../../services/kycService';
import Modal from '../../components/common/Modal';
import { SkeletonTable } from '../../components/common/Skeleton';
import { ShieldCheck, CheckCircle2, XCircle, Eye, Image as ImageIcon, ExternalLink, FileText } from 'lucide-react';

export default function KYCVerificationPage() {
  const [kycs, setKycs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Inspection Modal State (Full Document View & Verification)
  const [inspectModal, setInspectModal] = useState(null); // kyc item object
  const [activeTab, setActiveTab] = useState('front'); // 'front' | 'back'
  const [remarks, setRemarks] = useState('');
  const [processing, setProcessing] = useState(false);

  // Quick Action Modal State (Approve / Reject directly)
  const [actionModal, setActionModal] = useState(null); // { type: 'approve'|'reject', id, member_id, title }

  const loadData = () => {
    setLoading(true);
    kycService.getKYC().then(res => {
      setKycs(res.results || res || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const openInspectionModal = (k) => {
    setInspectModal(k);
    setActiveTab('front');
    setRemarks(k.admin_remarks || 'Verified document copy matches member details');
  };

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
    setRemarks('Illegible document copy or mismatching details');
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

    const apiCall = actionModal.action === 'approve' 
      ? kycService.verifyKYC(actionModal.id, remarks)
      : kycService.rejectKYC(actionModal.id, remarks);

    apiCall.then(() => {
      setProcessing(false);
      setActionModal(null);
      loadData();
    }).catch(err => {
      console.error(err);
      setProcessing(false);
    });
  };

  const handleInspectVerify = (status) => {
    if (!inspectModal) return;
    setProcessing(true);

    const apiCall = status === 'VERIFIED'
      ? kycService.verifyKYC(inspectModal.id, remarks || 'Approved after document inspection')
      : kycService.rejectKYC(inspectModal.id, remarks || 'Rejected after document inspection');

    apiCall.then(() => {
      setProcessing(false);
      setInspectModal(null);
      loadData();
    }).catch(err => {
      console.error(err);
      setProcessing(false);
    });
  };

  return (
    <div className="space-y-6">
      {/* Quick Approval / Rejection Modal */}
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

      {/* Detailed Document Inspection & Verification Lightbox Modal */}
      {inspectModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setInspectModal(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-[#FAF7F2] border border-[#C5A059]/50 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#1C1917] text-[#FAF7F2] px-6 py-4 flex items-center justify-between border-b border-[#C5A059]/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-[#E6D5B8]">Inspect Identity Document</h3>
                  <p className="text-xs text-gray-400">Member: <span className="font-mono text-[#C5A059] font-bold">{inspectModal.member_id}</span> ({inspectModal.member_name})</p>
                </div>
              </div>

              <button 
                onClick={() => setInspectModal(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Content - Grid Layout */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-[#E2DDD1] space-y-1">
                  <span className="text-[#736C63] uppercase tracking-wider text-[10px] block">Document Type</span>
                  <span className="font-serif font-bold text-[#1C1917] text-sm">{inspectModal.document_type}</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-[#E2DDD1] space-y-1">
                  <span className="text-[#736C63] uppercase tracking-wider text-[10px] block">Document Number</span>
                  <span className="font-mono font-bold text-[#1B3B2B] text-sm">{inspectModal.document_number}</span>
                </div>
              </div>

              {/* Document Image Lightbox Container */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button 
                      type="button"
                      onClick={() => setActiveTab('front')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        activeTab === 'front' 
                          ? 'bg-[#1B3B2B] text-white shadow-sm' 
                          : 'bg-white text-[#554F47] border border-[#E2DDD1] hover:bg-gray-50'
                      }`}
                    >
                      Front Image Document
                    </button>
                    {inspectModal.back_image_url && (
                      <button 
                        type="button"
                        onClick={() => setActiveTab('back')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          activeTab === 'back' 
                            ? 'bg-[#1B3B2B] text-white shadow-sm' 
                            : 'bg-white text-[#554F47] border border-[#E2DDD1] hover:bg-gray-50'
                        }`}
                      >
                        Back Image Document
                      </button>
                    )}
                  </div>

                  {((activeTab === 'front' && inspectModal.front_image_url) || (activeTab === 'back' && inspectModal.back_image_url)) && (
                    <a 
                      href={activeTab === 'front' ? inspectModal.front_image_url : inspectModal.back_image_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-xs text-[#1B3B2B] hover:text-[#C5A059] flex items-center gap-1 font-semibold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Open Full Image
                    </a>
                  )}
                </div>

                <div className="relative min-h-[280px] max-h-[420px] bg-black/90 rounded-2xl p-3 flex items-center justify-center border border-[#E2DDD1] overflow-hidden">
                  {activeTab === 'front' ? (
                    inspectModal.front_image_url ? (
                      <img 
                        src={inspectModal.front_image_url} 
                        alt="Front Document Image" 
                        className="max-h-[380px] w-auto object-contain rounded-lg shadow-xl" 
                      />
                    ) : (
                      <div className="text-gray-400 text-xs flex flex-col items-center gap-2">
                        <ImageIcon className="w-8 h-8 opacity-40" />
                        <span>No Front Image uploaded for this record</span>
                      </div>
                    )
                  ) : (
                    inspectModal.back_image_url ? (
                      <img 
                        src={inspectModal.back_image_url} 
                        alt="Back Document Image" 
                        className="max-h-[380px] w-auto object-contain rounded-lg shadow-xl" 
                      />
                    ) : (
                      <div className="text-gray-400 text-xs flex flex-col items-center gap-2">
                        <ImageIcon className="w-8 h-8 opacity-40" />
                        <span>No Back Image uploaded for this record</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Remarks Field */}
              <div className="space-y-1.5">
                <label className="form-label text-xs">Admin Verification Remarks / Audit Note</label>
                <textarea 
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter remarks for approval or rejection..."
                  className="form-input text-xs h-16 bg-white"
                />
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="bg-[#F4EFE6] px-6 py-4 border-t border-[#E2DDD1] flex items-center justify-between gap-3 flex-wrap">
              <span className="text-xs text-[#736C63]">
                Submitted: <span className="font-semibold text-[#1C1917]">{new Date(inspectModal.submitted_at).toLocaleDateString()}</span>
              </span>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleInspectVerify('REJECTED')}
                  disabled={processing}
                  className="btn-danger text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" /> Reject KYC
                </button>
                <button 
                  onClick={() => handleInspectVerify('VERIFIED')}
                  disabled={processing}
                  className="btn-success text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve KYC
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Header Card */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-serif font-bold text-[#1C1917]">KYC Document Verification Queue</h3>
        <p className="text-xs text-[#736C63]">Review member uploaded identity document proofs & verify compliance approvals</p>
      </div>

      {loading ? (
        <SkeletonTable rows={5} cols={7} />
      ) : (
        <div className="glass-card p-6">
          <div className="overflow-x-auto">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Doc Image</th>
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
                    <td colSpan="7" className="text-center py-6 text-[#736C63]">No submitted KYC records found</td>
                  </tr>
                ) : (
                  kycs.map((k) => (
                    <tr key={k.id}>
                      <td>
                        <span className="font-bold text-[#1B3B2B] font-mono block">{k.member_id}</span>
                        <span className="text-xs text-[#554F47]">{k.member_name}</span>
                      </td>

                      {/* Doc Image Thumbnail Column */}
                      <td>
                        {k.front_image_url ? (
                          <button
                            onClick={() => openInspectionModal(k)}
                            className="relative group w-14 h-10 rounded-lg overflow-hidden border border-[#E2DDD1] bg-gray-100 hover:border-[#C5A059] transition-all flex items-center justify-center shrink-0"
                            title="Click to view & inspect full document"
                          >
                            <img src={k.front_image_url} alt="Doc thumbnail" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                              <Eye className="w-3.5 h-3.5" />
                            </div>
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#736C63] italic">No image</span>
                        )}
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
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => openInspectionModal(k)} 
                            className="btn-secondary text-xs py-1 px-2.5 flex items-center gap-1"
                            title="Inspect Document Image"
                          >
                            <Eye className="w-3.5 h-3.5" /> View Proof
                          </button>

                          {k.status === 'PENDING' && (
                            <>
                              <button onClick={() => openApproveModal(k)} className="btn-success text-xs py-1 px-2.5">
                                Approve
                              </button>
                              <button onClick={() => openRejectModal(k)} className="btn-danger text-xs py-1 px-2.5">
                                Reject
                              </button>
                            </>
                          )}
                        </div>
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
