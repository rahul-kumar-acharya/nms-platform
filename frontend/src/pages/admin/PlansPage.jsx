import React, { useEffect, useState } from 'react';
import { planService } from '../../services/planService';
import Modal from '../../components/common/Modal';
import { SkeletonCard } from '../../components/common/Skeleton';
import { Award, Plus, ArrowLeft, CheckCircle2, Edit3, Trash2, Power } from 'lucide-react';

export default function PlansPage() {
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'create' or 'edit'
  const [plans, setPlans] = useState([]);
  
  // Form fields
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [referralBonus, setReferralBonus] = useState('');
  const [binaryPayout, setBinaryPayout] = useState('');
  const [dailyCapping, setDailyCapping] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');

  // Modal State for Actions & Confirmations
  const [modalConfig, setModalConfig] = useState(null);

  const loadPlans = () => {
    setLoading(true);
    planService.getPlans().then(res => {
      setPlans(res.results || res || []);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const openCreateForm = () => {
    setEditingId(null);
    setName('');
    setPrice('');
    setReferralBonus('');
    setBinaryPayout('');
    setDailyCapping('');
    setDescription('');
    setIsActive(true);
    setActiveTab('create');
  };

  const openEditForm = (plan) => {
    setEditingId(plan.id);
    setName(plan.name);
    setPrice(plan.price);
    setReferralBonus(plan.referral_bonus);
    setBinaryPayout(plan.binary_pair_payout);
    setDailyCapping(plan.daily_capping);
    setDescription(plan.description || '');
    setIsActive(plan.is_active);
    setActiveTab('edit');
  };

  const handleSavePlan = (e) => {
    e.preventDefault();
    setSuccess('');
    const planPayload = {
      name,
      price: parseFloat(price),
      referral_bonus: parseFloat(referralBonus),
      binary_pair_payout: parseFloat(binaryPayout),
      daily_capping: parseFloat(dailyCapping),
      description,
      is_active: isActive
    };

    if (editingId) {
      planService.updatePlan(editingId, planPayload).then(() => {
        setSuccess(`Plan "${name}" updated successfully!`);
        loadPlans();
        setTimeout(() => {
          setSuccess('');
          setActiveTab('list');
        }, 1200);
      });
    } else {
      planService.createPlan(planPayload).then(() => {
        setSuccess(`Plan "${name}" created successfully!`);
        loadPlans();
        setTimeout(() => {
          setSuccess('');
          setActiveTab('list');
        }, 1200);
      });
    }
  };

  const promptToggleStatus = (plan) => {
    const willDeactivate = plan.is_active;
    setModalConfig({
      type: willDeactivate ? 'warning' : 'confirm',
      title: willDeactivate ? `Deactivate Plan: ${plan.name}` : `Activate Plan: ${plan.name}`,
      message: willDeactivate 
        ? `Are you sure you want to deactivate "${plan.name}"? Deactivating this plan will hide it from new member registrations while preserving historical data.`
        : `Are you sure you want to activate "${plan.name}"? This plan will immediately become available for member onboarding and upgrades.`,
      confirmText: willDeactivate ? 'Deactivate Plan' : 'Activate Plan',
      onConfirm: () => executeToggleStatus(plan)
    });
  };

  const executeToggleStatus = (plan) => {
    planService.updatePlan(plan.id, { is_active: !plan.is_active }).then(() => {
      setModalConfig(null);
      loadPlans();
    });
  };

  const promptDeletePlan = (id, planName) => {
    setModalConfig({
      type: 'danger',
      title: 'Confirm Plan Deletion',
      message: `Are you sure you want to delete plan "${planName}"? This action cannot be undone.`,
      confirmText: 'Delete Plan',
      onConfirm: () => executeDeletePlan(id)
    });
  };

  const executeDeletePlan = (id) => {
    planService.deletePlan(id)
      .then(() => {
        setModalConfig(null);
        loadPlans();
      })
      .catch(err => {
        setModalConfig({
          type: 'warning',
          title: 'Cannot Delete Plan',
          message: err.response?.data?.detail || 'Cannot delete plan as it is in use by members. Consider deactivating it instead.',
          onConfirm: null
        });
      });
  };

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
          <h3 className="text-lg sm:text-xl font-serif font-bold text-[#1C1917]">Membership Plans & Pricing</h3>
          <p className="text-xs text-[#736C63]">Configure plan prices, referral bonuses & binary pair payouts</p>
        </div>

        {activeTab === 'list' ? (
          <button onClick={openCreateForm} className="btn-gold text-xs py-2 px-4 w-full sm:w-auto">
            <Plus className="w-4 h-4" /> Create New Plan
          </button>
        ) : (
          <button onClick={() => setActiveTab('list')} className="btn-secondary text-xs py-2 px-4 w-full sm:w-auto">
            <ArrowLeft className="w-4 h-4" /> Back to Plans List
          </button>
        )}
      </div>

      {activeTab === 'list' ? (
        loading ? (
          <SkeletonCard count={3} />
        ) : (
          /* Plans Directory Cards with Edit, Toggle & Delete Actions */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {plans.map(p => (
              <div key={p.id} className="glass-card p-5 sm:p-6 border-[#C5A059] flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center">
                    <span className={`badge ${p.is_active ? 'badge-active' : 'badge-rejected'}`}>
                      {p.is_active ? 'ACTIVE PLAN' : 'INACTIVE'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => openEditForm(p)} 
                        className="btn-secondary p-1.5 text-xs" 
                        title="Edit Plan"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#1B3B2B]" />
                      </button>
                      <button 
                        onClick={() => promptToggleStatus(p)} 
                        className="btn-secondary p-1.5 text-xs" 
                        title={p.is_active ? 'Deactivate Plan' : 'Activate Plan'}
                      >
                        <Power className={`w-3.5 h-3.5 ${p.is_active ? 'text-[#8C6200]' : 'text-[#1B3B2B]'}`} />
                      </button>
                      <button 
                        onClick={() => promptDeletePlan(p.id, p.name)} 
                        className="btn-danger p-1.5 text-xs" 
                        title="Delete Plan"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-[#8C2525]" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-xl sm:text-2xl font-serif font-extrabold text-[#1C1917] mt-3">{p.name}</h4>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#1B3B2B] mt-1">₹{parseFloat(p.price).toLocaleString()}</p>
                  <p className="text-xs text-[#554F47] mt-2 leading-relaxed">{p.description || 'Standard membership tier'}</p>
                </div>

                <div className="pt-3.5 border-t border-[#E2DDD1] space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#736C63]">Direct Referral Bonus:</span>
                    <span className="font-bold text-[#1B3B2B]">₹{parseFloat(p.referral_bonus).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#736C63]">Binary Pair Payout:</span>
                    <span className="font-bold text-[#A37B34]">₹{parseFloat(p.binary_pair_payout).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#736C63]">Daily Pair Capping:</span>
                    <span className="font-bold text-[#1C1917]">₹{parseFloat(p.daily_capping).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Dedicated Create/Edit Form View */
        <div className="glass-card p-5 sm:p-8 max-w-2xl mx-auto space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-[#E2DDD1]">
            <div className="w-10 h-10 rounded-xl bg-[#1B3B2B] text-[#C5A059] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-serif font-bold text-[#1C1917]">
                {editingId ? `Edit Plan: ${name}` : 'Create New Membership Plan'}
              </h4>
              <p className="text-xs text-[#736C63]">Specify price, referral bonus rate, binary payout rate & daily capping</p>
            </div>
          </div>

          {success && (
            <div className="p-3.5 rounded-xl bg-[#EAF2EC] border border-[#B8D4C1] text-[#1B3B2B] text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> {success}
            </div>
          )}

          <form onSubmit={handleSavePlan} className="space-y-4">
            <div>
              <label className="form-label text-xs">Plan Name</label>
              <input type="text" placeholder="e.g. Plan C (Elite)" value={name} onChange={e => setName(e.target.value)} required className="form-input text-xs" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="form-label text-xs">Price (₹)</label>
                <input type="number" placeholder="5000" value={price} onChange={e => setPrice(e.target.value)} required className="form-input text-xs" />
              </div>
              <div>
                <label className="form-label text-xs">Referral Bonus (₹)</label>
                <input type="number" placeholder="800" value={referralBonus} onChange={e => setReferralBonus(e.target.value)} required className="form-input text-xs" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="form-label text-xs">Binary Pair Payout (₹)</label>
                <input type="number" placeholder="1500" value={binaryPayout} onChange={e => setBinaryPayout(e.target.value)} required className="form-input text-xs" />
              </div>
              <div>
                <label className="form-label text-xs">Daily Capping Limit (₹)</label>
                <input type="number" placeholder="15000" value={dailyCapping} onChange={e => setDailyCapping(e.target.value)} required className="form-input text-xs" />
              </div>
            </div>

            <div>
              <label className="form-label text-xs">Plan Description</label>
              <textarea placeholder="Specify plan perks and benefits..." value={description} onChange={e => setDescription(e.target.value)} className="form-input text-xs h-24" />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input 
                type="checkbox" 
                id="isActive" 
                checked={isActive} 
                onChange={e => setIsActive(e.target.checked)} 
                className="w-4 h-4 accent-[#1B3B2B]"
              />
              <label htmlFor="isActive" className="text-xs font-bold text-[#1C1917]">Active Plan (Available for Member Registration)</label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#E2DDD1]">
              <button type="button" onClick={() => setActiveTab('list')} className="btn-secondary text-xs">
                Cancel
              </button>
              <button type="submit" className="btn-gold text-xs">
                <Plus className="w-4 h-4" /> {editingId ? 'Update Plan' : 'Save & Activate Plan'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
