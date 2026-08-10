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
      if (res && res.length > 0) {
        setKyc(res[0]);
      }
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    kycService.submitKYC({
      document_type: docType,
      document_number: docNum
    }).then(res => {
      setKyc(res);
      setMsg('KYC documents submitted for admin verification!');
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">KYC Verification Portal</h3>
            <p className="text-xs text-slate-400">Required for processed withdrawals & financial compliance</p>
          </div>
        </div>

        {kyc ? (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block uppercase">Document Type & Number</span>
                <span className="text-base font-bold text-white">{kyc.document_type}: {kyc.document_number}</span>
              </div>
              <div>
                {kyc.status === 'VERIFIED' && <span className="badge badge-active">VERIFIED</span>}
                {kyc.status === 'PENDING' && <span className="badge badge-pending">PENDING VERIFICATION</span>}
                {kyc.status === 'REJECTED' && <span className="badge badge-rejected">REJECTED</span>}
              </div>
            </div>

            {kyc.admin_remarks && (
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
                <strong>Admin Remarks:</strong> {kyc.admin_remarks}
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {msg && <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs">{msg}</div>}
            
            <div>
              <label className="form-label">Document Type</label>
              <select 
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="form-input"
              >
                <option value="PAN">PAN Card</option>
                <option value="AADHAAR">Aadhaar Card</option>
                <option value="PASSPORT">Passport</option>
              </select>
            </div>

            <div>
              <label className="form-label">Document Identification Number</label>
              <input
                type="text"
                placeholder="ABCDE1234F"
                value={docNum}
                onChange={(e) => setDocNum(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              <UploadCloud className="w-4 h-4" /> Submit Documents for Verification
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
