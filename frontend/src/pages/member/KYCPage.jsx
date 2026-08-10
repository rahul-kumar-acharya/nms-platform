import React, { useEffect, useState } from 'react';
import { kycService } from '../../services/kycService';
import { ShieldCheck, FileCheck, AlertCircle, UploadCloud } from 'lucide-react';

export default function KYCPage() {
  const [kyc, setKyc] = useState(null);
  const [docType, setDocType] = useState('PAN');
  const [docNum, setDocNum] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    kycService.getKYC().then(res => {
      const list = res.results || res || [];
      if (Array.isArray(list) && list.length > 0) {
        setKyc(list[0]);
      }
    }).catch(err => console.error(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    kycService.submitKYC({
      document_type: docType,
      document_number: docNum
    }).then(res => {
      setKyc(res);
      setLoading(false);
      setMsg('KYC documents submitted successfully! Pending admin approval.');
    }).catch(err => {
      setLoading(false);
      setMsg(err.response?.data?.detail || 'Failed to submit KYC details.');
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#1C1917]">KYC Document Verification</h2>
          <p className="text-xs text-[#736C63]">Verify your identity to enable wallet withdrawal payouts</p>
        </div>

        {kyc && (
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            kyc.status === 'VERIFIED' ? 'bg-[#EAF2EC] text-[#1B3B2B] border border-[#B8D4C1]' :
            kyc.status === 'REJECTED' ? 'bg-[#FDF0F0] text-[#8C2525] border border-[#F3C6C6]' :
            'bg-[#F4EFE6] text-[#A37B34] border border-[#D8C8AF]'
          }`}>
            Status: {kyc.status}
          </span>
        )}
      </div>

      {msg && (
        <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#C5A059] text-xs font-semibold text-[#1C1917]">
          {msg}
        </div>
      )}

      {kyc ? (
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-[#E2DDD1] pb-4">
            <ShieldCheck className="w-6 h-6 text-[#1B3B2B]" />
            <div>
              <h3 className="text-lg font-serif font-bold text-[#1C1917]">Submitted KYC Document</h3>
              <p className="text-xs text-[#736C63]">Submitted on {new Date(kyc.submitted_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[#736C63] block">Document Type</span>
              <span className="font-bold text-[#1C1917]">{kyc.document_type}</span>
            </div>
            <div>
              <span className="text-[#736C63] block">Document Number</span>
              <span className="font-bold font-mono text-[#1B3B2B]">{kyc.document_number}</span>
            </div>
          </div>

          {kyc.admin_remarks && (
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E2DDD1] text-xs space-y-1">
              <span className="font-bold text-[#736C63]">Admin Remarks:</span>
              <p className="text-[#1C1917]">{kyc.admin_remarks}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-card p-6 max-w-xl space-y-4">
          <h3 className="text-lg font-serif font-bold text-[#1C1917]">Submit Verification Details</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label text-xs">DOCUMENT TYPE</label>
              <select 
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="form-input text-xs"
              >
                <option value="PAN">PAN Card</option>
                <option value="AADHAAR">Aadhaar Card</option>
                <option value="PASSPORT">Passport</option>
                <option value="DRIVING_LICENSE">Driving License</option>
              </select>
            </div>

            <div>
              <label className="form-label text-xs">DOCUMENT NUMBER</label>
              <input
                type="text"
                placeholder="e.g. ABCDE1234F"
                value={docNum}
                onChange={(e) => setDocNum(e.target.value)}
                required
                className="form-input font-mono uppercase text-xs"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary text-xs py-2.5 w-full justify-center">
              <UploadCloud className="w-4 h-4" />
              {loading ? 'Submitting...' : 'Submit Verification Request'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
