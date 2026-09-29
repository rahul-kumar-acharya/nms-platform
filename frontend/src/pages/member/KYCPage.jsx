import React, { useEffect, useState } from 'react';
import { kycService } from '../../services/kycService';
import { ShieldCheck, FileCheck, AlertCircle, UploadCloud, Eye, Image as ImageIcon, CheckCircle2, XCircle, RefreshCw, Trash2 } from 'lucide-react';

export default function KYCPage() {
  const [kyc, setKyc] = useState(null);
  const [docType, setDocType] = useState('PAN');
  const [docNum, setDocNum] = useState('');
  const [frontImage, setFrontImage] = useState('');
  const [backImage, setBackImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [msg, setMsg] = useState('');
  const [previewImageModal, setPreviewImageModal] = useState(null);
  const [isResubmitting, setIsResubmitting] = useState(false);

  const fetchKYC = () => {
    setFetching(true);
    kycService.getKYC().then(res => {
      const list = res.results || res || [];
      if (Array.isArray(list) && list.length > 0) {
        setKyc(list[0]);
      } else if (res && res.id) {
        setKyc(res);
      } else {
        setKyc(null);
      }
      setFetching(false);
    }).catch(err => {
      console.error(err);
      setFetching(false);
    });
  };

  useEffect(() => {
    fetchKYC();
  }, []);

  const handleFileChange = (e, isBack = false) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMsg('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setMsg('File size must be less than 8MB.');
      return;
    }

    setMsg('');
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        if (isBack) {
          setBackImage(dataUrl);
        } else {
          setFrontImage(dataUrl);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!frontImage) {
      setMsg('Please upload a clear front image of your document.');
      return;
    }

    setLoading(true);
    setMsg('');

    kycService.submitKYC({
      document_type: docType,
      document_number: docNum,
      front_image_url: frontImage,
      back_image_url: backImage
    }).then(res => {
      setKyc(res);
      setLoading(false);
      setIsResubmitting(false);
      setMsg('KYC document & proof image submitted successfully! Pending verification by Admin & Owner.');
    }).catch(err => {
      setLoading(false);
      setMsg(err.response?.data?.detail || 'Failed to submit KYC verification details.');
    });
  };

  return (
    <div className="space-y-6">
      {/* Full Image Preview Lightbox */}
      {previewImageModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewImageModal(null)}
        >
          <div className="relative max-w-3xl w-full bg-[#1C1917] border border-[#C5A059]/40 rounded-2xl p-4 overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-sm font-semibold text-[#E6D5B8]">{previewImageModal.title}</span>
              <button 
                onClick={() => setPreviewImageModal(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 flex items-center justify-center bg-black/50 rounded-xl p-2 min-h-[300px]">
              <img 
                src={previewImageModal.url} 
                alt="KYC Document Preview" 
                className="max-h-[70vh] object-contain rounded-lg shadow-lg" 
              />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#1C1917]">KYC Document Verification</h2>
          <p className="text-xs text-[#736C63]">Upload official identity document images to verify account compliance & unlock payouts</p>
        </div>

        {kyc && (
          <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
            kyc.status === 'VERIFIED' ? 'bg-[#EAF2EC] text-[#1B3B2B] border border-[#B8D4C1]' :
            kyc.status === 'REJECTED' ? 'bg-[#FDF0F0] text-[#8C2525] border border-[#F3C6C6]' :
            'bg-[#F4EFE6] text-[#A37B34] border border-[#D8C8AF]'
          }`}>
            {kyc.status === 'VERIFIED' && <CheckCircle2 className="w-3.5 h-3.5 text-[#1B3B2B]" />}
            {kyc.status === 'REJECTED' && <XCircle className="w-3.5 h-3.5 text-[#8C2525]" />}
            {kyc.status === 'PENDING' && <ShieldCheck className="w-3.5 h-3.5 text-[#A37B34]" />}
            Status: {kyc.status}
          </span>
        )}
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#C5A059] text-xs font-semibold text-[#1C1917] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#C5A059] shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {fetching ? (
        <div className="glass-card p-8 text-center text-xs text-[#736C63]">
          Loading verification record...
        </div>
      ) : kyc && !isResubmitting ? (
        <div className="glass-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#E2DDD1] pb-4 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1B3B2B]/10 flex items-center justify-center text-[#1B3B2B]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-[#1C1917]">Submitted KYC Identity Document</h3>
                <p className="text-xs text-[#736C63]">Submitted on {new Date(kyc.submitted_at).toLocaleDateString()} at {new Date(kyc.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>

            {kyc.status === 'REJECTED' && (
              <button 
                onClick={() => {
                  setDocType(kyc.document_type || 'PAN');
                  setDocNum(kyc.document_number || '');
                  setFrontImage(kyc.front_image_url || '');
                  setBackImage(kyc.back_image_url || '');
                  setIsResubmitting(true);
                }}
                className="btn-primary text-xs py-2 px-3 flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Resubmit Document
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E2DDD1]">
              <span className="text-[#736C63] block font-medium uppercase tracking-wider text-[10px]">Document Type</span>
              <span className="font-serif font-bold text-[#1C1917] text-base">{kyc.document_type}</span>
            </div>
            <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E2DDD1]">
              <span className="text-[#736C63] block font-medium uppercase tracking-wider text-[10px]">Document Identification Number</span>
              <span className="font-mono font-bold text-[#1B3B2B] text-base">{kyc.document_number}</span>
            </div>
          </div>

          {/* Attached Document Images Preview */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#1C1917] uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-[#1B3B2B]" />
              Attached Proof Images
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {kyc.front_image_url ? (
                <div className="relative group border border-[#E2DDD1] rounded-xl overflow-hidden bg-black/5 p-2 transition-all hover:border-[#C5A059]">
                  <p className="text-[11px] font-semibold text-[#554F47] mb-2 px-1">Front Image Document</p>
                  <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    <img 
                      src={kyc.front_image_url} 
                      alt="Front Document" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button 
                      onClick={() => setPreviewImageModal({ title: `${kyc.document_type} - Front Image`, url: kyc.front_image_url })}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium text-xs gap-1.5"
                    >
                      <Eye className="w-4 h-4" /> View Full Image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 border border-dashed border-[#D8C8AF] rounded-xl text-center text-xs text-[#736C63]">
                  No Front Document Image attached
                </div>
              )}

              {kyc.back_image_url ? (
                <div className="relative group border border-[#E2DDD1] rounded-xl overflow-hidden bg-black/5 p-2 transition-all hover:border-[#C5A059]">
                  <p className="text-[11px] font-semibold text-[#554F47] mb-2 px-1">Back Image Document</p>
                  <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    <img 
                      src={kyc.back_image_url} 
                      alt="Back Document" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button 
                      onClick={() => setPreviewImageModal({ title: `${kyc.document_type} - Back Image`, url: kyc.back_image_url })}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium text-xs gap-1.5"
                    >
                      <Eye className="w-4 h-4" /> View Full Image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 border border-dashed border-[#D8C8AF] rounded-xl text-center text-xs text-[#736C63] flex flex-col items-center justify-center min-h-[140px]">
                  <span>No Back Document Image provided</span>
                </div>
              )}
            </div>
          </div>

          {kyc.admin_remarks && (
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E2DDD1] text-xs space-y-1">
              <span className="font-bold text-[#736C63] block">Admin & Compliance Verification Remarks:</span>
              <p className="text-[#1C1917] font-medium">{kyc.admin_remarks}</p>
            </div>
          )}
        </div>
      ) : (
        /* KYC Submission Form */
        <div className="glass-card p-6 max-w-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#E2DDD1] pb-3">
            <div>
              <h3 className="text-lg font-serif font-bold text-[#1C1917]">
                {isResubmitting ? 'Resubmit Identity Document' : 'Submit KYC Verification Details'}
              </h3>
              <p className="text-xs text-[#736C63]">Enter document information and upload clear photos of your ID</p>
            </div>
            {isResubmitting && (
              <button 
                onClick={() => setIsResubmitting(false)}
                className="text-xs text-[#736C63] hover:text-[#1C1917] underline"
              >
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label text-xs">DOCUMENT TYPE <span className="text-red-500">*</span></label>
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
                <label className="form-label text-xs">DOCUMENT NUMBER <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. ABCDE1234F"
                  value={docNum}
                  onChange={(e) => setDocNum(e.target.value)}
                  required
                  className="form-input font-mono uppercase text-xs"
                />
              </div>
            </div>

            {/* Image Upload Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Front Image Upload */}
              <div className="space-y-2">
                <label className="form-label text-xs flex items-center justify-between">
                  <span>DOCUMENT FRONT IMAGE <span className="text-red-500">*</span></span>
                  {frontImage && <span className="text-[10px] text-emerald-600 font-semibold">Attached ✓</span>}
                </label>
                
                {frontImage ? (
                  <div className="relative border border-[#B8D4C1] rounded-xl p-2 bg-[#EAF2EC]/40 group">
                    <div className="aspect-[4/3] rounded-lg overflow-hidden relative bg-gray-200">
                      <img src={frontImage} alt="Front Document Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewImageModal({ title: 'Front Image Preview', url: frontImage })}
                          className="p-1.5 bg-white/90 text-gray-800 rounded-lg text-xs font-semibold hover:bg-white flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                        <button
                          type="button"
                          onClick={() => setFrontImage('')}
                          className="p-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-[#D8C8AF] hover:border-[#C5A059] rounded-xl cursor-pointer bg-[#FAF7F2]/50 hover:bg-[#FAF7F2] transition-colors min-h-[160px] text-center">
                    <UploadCloud className="w-8 h-8 text-[#A37B34] mb-2" />
                    <span className="text-xs font-bold text-[#1C1917]">Click to upload Front Image</span>
                    <span className="text-[10px] text-[#736C63] mt-1">PNG, JPG, WEBP up to 8MB</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleFileChange(e, false)} 
                      className="hidden" 
                    />
                  </label>
                )}
              </div>

              {/* Back Image Upload */}
              <div className="space-y-2">
                <label className="form-label text-xs flex items-center justify-between">
                  <span>DOCUMENT BACK IMAGE <span className="text-gray-400">(OPTIONAL)</span></span>
                  {backImage && <span className="text-[10px] text-emerald-600 font-semibold">Attached ✓</span>}
                </label>

                {backImage ? (
                  <div className="relative border border-[#B8D4C1] rounded-xl p-2 bg-[#EAF2EC]/40 group">
                    <div className="aspect-[4/3] rounded-lg overflow-hidden relative bg-gray-200">
                      <img src={backImage} alt="Back Document Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewImageModal({ title: 'Back Image Preview', url: backImage })}
                          className="p-1.5 bg-white/90 text-gray-800 rounded-lg text-xs font-semibold hover:bg-white flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                        <button
                          type="button"
                          onClick={() => setBackImage('')}
                          className="p-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-[#D8C8AF] hover:border-[#C5A059] rounded-xl cursor-pointer bg-[#FAF7F2]/50 hover:bg-[#FAF7F2] transition-colors min-h-[160px] text-center">
                    <UploadCloud className="w-8 h-8 text-[#736C63] mb-2" />
                    <span className="text-xs font-bold text-[#1C1917]">Click to upload Back Image</span>
                    <span className="text-[10px] text-[#736C63] mt-1">PNG, JPG, WEBP up to 8MB</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleFileChange(e, true)} 
                      className="hidden" 
                    />
                  </label>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary text-xs py-3 w-full justify-center text-sm font-semibold tracking-wide">
              <UploadCloud className="w-4 h-4" />
              {loading ? 'Submitting Identity Verification...' : 'Submit KYC Document for Verification'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
