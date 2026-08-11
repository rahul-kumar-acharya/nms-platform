import React, { useEffect, useState } from 'react';
import { epinService } from '../../services/epinService';
import { planService } from '../../services/planService';
import Modal from '../../components/common/Modal';
import { SkeletonTable } from '../../components/common/Skeleton';
import { KeyRound, Plus, Download, CheckCircle2, Copy, ArrowLeft, Search, Trash2 } from 'lucide-react';

export default function EPINManagementPage() {
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'generate'
  const [epins, setEpins] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [quantity, setQuantity] = useState(10);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copiedCode, setCopiedCode] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');

  // Modal Popup State
  const [modalConfig, setModalConfig] = useState(null);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      epinService.getEpins(),
      planService.getPlans()
    ]).then(([epinRes, planRes]) => {
      setEpins(epinRes.results || epinRes || []);
      const planList = planRes.results || planRes || [];
      setPlans(planList);
      if (planList.length > 0) setSelectedPlan(planList[0].id);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerate = (e) => {
    e.preventDefault();
    setGenerating(true);
    setSuccess('');
    epinService.generateEpins(selectedPlan, quantity).then(() => {
      setGenerating(false);
      setSuccess(`Generated batch of ${quantity} EPIN keys successfully!`);
      loadData();
      setTimeout(() => {
        setSuccess('');
        setActiveTab('list');
      }, 1500);
    }).catch(err => {
      console.error(err);
      setGenerating(false);
    });
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const promptDeleteEpin = (id, code, isUsed) => {
    if (isUsed) {
      setModalConfig({
        type: 'warning',
        title: 'Redeemed Key Protection',
        message: 'Redeemed/Used EPIN keys cannot be deleted as they are part of active financial audit history.',
        onConfirm: null
      });
      return;
    }

    setModalConfig({
      type: 'danger',
      title: 'Confirm EPIN Deletion',
      message: `Are you sure you want to delete EPIN key ${code}? This action cannot be undone.`,
      confirmText: 'Delete EPIN',
      onConfirm: () => executeDeleteEpin(id)
    });
  };

  const executeDeleteEpin = (id) => {
    epinService.deleteEpin(id)
      .then(() => {
        setModalConfig(null);
        loadData();
      })
      .catch(err => {
        setModalConfig({
          type: 'warning',
          title: 'Deletion Failed',
          message: err.response?.data?.detail || 'Failed to delete EPIN key.',
          onConfirm: null
        });
      });
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Code,Plan,Status,Used By,Created At"].join(",") + "\n"
      + epins.map(e => `${e.code},"${e.plan_detail?.name}",${e.status},${e.used_by_member_id || ''},${e.created_at}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "NMS_EPIN_Batch.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredEpins = epins.filter(e => 
    e.code.toLowerCase().includes(search.toLowerCase()) ||
    (e.plan_detail?.name && e.plan_detail.name.toLowerCase().includes(search.toLowerCase())) ||
    (e.used_by_member_id && e.used_by_member_id.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Modal Popup */}
      <Modal
        isOpen={!!modalConfig}
        onClose={() => setModalConfig(null)}
        title={modalConfig?.title}
        message={modalConfig?.message}
        type={modalConfig?.type}
        confirmText={modalConfig?.confirmText}
        onConfirm={modalConfig?.onConfirm}
      />

      {/* Top Controls Bar */}
      <div className="glass-card p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-serif font-bold text-[#1C1917]">EPIN Management & Generator</h3>
          <p className="text-xs text-[#736C63]">Cryptographically generated activation keys for member onboarding</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
          {activeTab === 'list' ? (
            <>
              <button onClick={exportCSV} className="btn-secondary text-xs py-2 px-3 sm:px-4">
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
              <button onClick={() => setActiveTab('generate')} className="btn-gold text-xs py-2 px-3 sm:px-4">
                <Plus className="w-4 h-4" /> Generate EPIN Batch
              </button>
            </>
          ) : (
            <button onClick={() => setActiveTab('list')} className="btn-secondary text-xs py-2 px-3 sm:px-4">
              <ArrowLeft className="w-4 h-4" /> Back to EPIN Directory
            </button>
          )}
        </div>
      </div>

      {activeTab === 'list' ? (
        loading ? (
          <SkeletonTable rows={6} cols={6} />
        ) : (
          /* EPIN Directory Table Page View */
          <div className="glass-card p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h4 className="text-base sm:text-lg font-serif font-bold text-[#1C1917]">Generated Keys ({filteredEpins.length})</h4>

              <div className="relative flex items-center w-full sm:w-72">
                <Search className="w-4 h-4 text-[#736C63] absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search EPIN Code, Plan, Member ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-input form-input-icon text-xs py-2"
                />
              </div>
            </div>

            <div className="custom-table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>EPIN Code</th>
                    <th>Plan Tier</th>
                    <th>Status</th>
                    <th>Used By Member</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEpins.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-6 text-[#736C63]">No EPIN keys matching search criteria</td>
                    </tr>
                  ) : (
                    filteredEpins.map((e) => (
                      <tr key={e.id}>
                        <td className="font-bold text-[#1B3B2B] font-mono tracking-wider">{e.code}</td>
                        <td>
                          <span className="badge badge-plan">{e.plan_detail?.name || 'Standard'}</span>
                        </td>
                        <td>
                          {e.status === 'UNUSED' ? (
                            <span className="badge badge-active">UNUSED</span>
                          ) : (
                            <span className="badge badge-rejected">USED</span>
                          )}
                        </td>
                        <td className="text-xs text-[#A37B34] font-mono font-bold">{e.used_by_member_id || '-'}</td>
                        <td className="text-xs text-[#736C63]">{new Date(e.created_at).toLocaleDateString()}</td>
                        <td>
                          <div className="flex items-center gap-1.5">
                            <button 
                              onClick={() => handleCopy(e.code)}
                              className="btn-secondary text-xs px-2.5 py-1"
                              title="Copy EPIN Code"
                            >
                              {copiedCode === e.code ? (
                                <span className="text-[#1B3B2B] font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Copied</span>
                              ) : (
                                <span className="flex items-center gap-1"><Copy className="w-3.5 h-3.5" /> Copy</span>
                              )}
                            </button>
                            
                            {e.status === 'UNUSED' && (
                              <button 
                                onClick={() => promptDeleteEpin(e.id, e.code, false)}
                                className="btn-danger p-1 text-xs"
                                title="Delete Unused EPIN"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-[#8C2525]" />
                              </button>
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
        )
      ) : (
        /* Dedicated Generate EPIN Batch Page View */
        <div className="glass-card p-5 sm:p-8 max-w-xl mx-auto space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-[#E2DDD1]">
            <div className="w-10 h-10 rounded-xl bg-[#1B3B2B] text-[#C5A059] flex items-center justify-center shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-serif font-bold text-[#1C1917]">Generate EPIN Batch Keys</h4>
              <p className="text-xs text-[#736C63]">Cryptographically generate registration keys for membership onboarding</p>
            </div>
          </div>

          {success && (
            <div className="p-3.5 rounded-xl bg-[#EAF2EC] border border-[#B8D4C1] text-[#1B3B2B] text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> {success}
            </div>
          )}

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="form-label text-xs">Select Membership Plan Tier</label>
              <select 
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="form-input text-xs"
              >
                {plans.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (Price: ₹{parseFloat(p.price).toLocaleString()})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label text-xs">Quantity to Generate (1 - 100 Keys)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="form-input text-xs"
              />
              <p className="text-[11px] text-[#736C63] mt-1">Each key is assigned to the selected plan tier and can be exported via CSV.</p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#E2DDD1]">
              <button type="button" onClick={() => setActiveTab('list')} className="btn-secondary text-xs">
                Cancel
              </button>
              <button type="submit" disabled={generating} className="btn-gold text-xs">
                <Plus className="w-4 h-4" /> {generating ? 'Generating Keys...' : 'Generate Batch'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
