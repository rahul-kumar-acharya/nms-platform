import React, { useState, useEffect } from 'react';
import { memberService } from '../../services/memberService';
import { SkeletonTable } from '../../components/common/Skeleton';
import Modal from '../../components/common/Modal';
import { Search, UserCheck, Shield, Plus, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

export default function MemberDirectory() {
  const [activeSubTab, setActiveSubTab] = useState('members'); // 'members' or 'admins'
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Add Admin Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('ADMIN');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalSuccess, setModalSuccess] = useState('');
  const [modalError, setModalError] = useState('');

  const loadMembers = () => {
    setLoading(true);
    memberService.getMembers({ search })
      .then(res => {
        setMembers(res.results || res || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadMembers();
  }, [search]);

  const handleCreateAdmin = (e) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');
    setModalLoading(true);

    api.post('/auth/register/', {
      username: newUsername,
      email: newEmail,
      password: newPassword,
      role: newRole,
      full_name: newUsername,
      mobile: '0000000000',
      epin_code: 'ADMIN-DIRECT',
      sponsor_id: 'M00001',
      parent_id: 'M00001',
      position: 'LEFT'
    }).then(() => {
      setModalLoading(false);
      setModalSuccess(`Administrator account "${newUsername}" created successfully!`);
      setTimeout(() => {
        setShowAddModal(false);
        setModalSuccess('');
        setNewUsername('');
        setNewEmail('');
        setNewPassword('');
        loadMembers();
      }, 1500);
    }).catch(err => {
      setModalLoading(false);
      setModalError(err.response?.data?.detail || 'Failed to create admin user. Username or email may already exist.');
    });
  };

  return (
    <div className="space-y-6">
      {/* Create Admin Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Platform Owner / Administrator"
        type="info"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#736C63]">
            Create a main Administrator account to hand over management of plans, EPINs, withdrawals, and member directory to the client owner.
          </p>

          {modalSuccess && (
            <div className="p-3 rounded-xl bg-[#EAF2EC] border border-[#B8D4C1] text-[#1B3B2B] text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> {modalSuccess}
            </div>
          )}

          {modalError && (
            <div className="p-3 rounded-xl bg-[#FDF0F0] border border-[#F3C6C6] text-[#8C2525] text-xs font-bold">
              {modalError}
            </div>
          )}

          <form onSubmit={handleCreateAdmin} className="space-y-3 pt-2">
            <div>
              <label className="form-label text-xs">Username / Admin ID</label>
              <input 
                type="text" 
                placeholder="e.g. owner_admin" 
                value={newUsername} 
                onChange={e => setNewUsername(e.target.value)} 
                required 
                className="form-input text-xs" 
              />
            </div>

            <div>
              <label className="form-label text-xs">Email Address</label>
              <input 
                type="email" 
                placeholder="owner@nms.com" 
                value={newEmail} 
                onChange={e => setNewEmail(e.target.value)} 
                required 
                className="form-input text-xs" 
              />
            </div>

            <div>
              <label className="form-label text-xs">Initial Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                required 
                className="form-input text-xs" 
              />
            </div>

            <div>
              <label className="form-label text-xs">Account Role</label>
              <select 
                value={newRole} 
                onChange={e => setNewRole(e.target.value)} 
                className="form-input text-xs"
              >
                <option value="ADMIN">ADMIN (Platform Owner)</option>
                <option value="DEVELOPER">DEVELOPER (System Maintenance)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button 
                type="button" 
                onClick={() => setShowAddModal(false)} 
                className="btn-secondary text-xs py-2 px-3"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={modalLoading} 
                className="btn-gold text-xs py-2 px-4"
              >
                {modalLoading ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Header & Sub-Tab Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#1C1917]">Member & Admin Directory</h2>
          <p className="text-xs text-[#736C63]">Inspect registered downline members, sponsor links & system admin accounts</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#EAE4D8] p-1 rounded-xl border border-[#D8CEBE]">
            <button
              onClick={() => setActiveSubTab('members')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'members'
                  ? 'bg-[#1B3B2B] text-[#F7F4EF] shadow-xs'
                  : 'text-[#554F47] hover:text-[#1C1917]'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" /> Members ({members.length})
            </button>
            <button
              onClick={() => setActiveSubTab('admins')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'admins'
                  ? 'bg-[#5C1D24] text-[#F7F4EF] shadow-xs'
                  : 'text-[#554F47] hover:text-[#1C1917]'
              }`}
            >
              <Shield className="w-3.5 h-3.5" /> Admin Accounts
            </button>
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-gold text-xs py-2 px-3 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Admin / Owner
          </button>
        </div>
      </div>

      {activeSubTab === 'members' ? (
        <>
          {/* Member Search Bar */}
          <div className="relative flex items-center w-full sm:w-80 md:w-96">
            <Search className="w-4 h-4 text-[#736C63] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Search Member ID, name or mobile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input form-input-icon text-xs pl-10 pr-4 py-2.5 w-full"
            />
          </div>

          {loading ? (
            <SkeletonTable rows={6} cols={9} />
          ) : (
            <div className="glass-card p-0 overflow-hidden border border-[#E2DDD1]">
              <div className="custom-table-wrapper">
                <table className="custom-table text-xs">
                  <thead>
                    <tr>
                      <th>Member ID</th>
                      <th>Full Name</th>
                      <th>Mobile</th>
                      <th>Sponsor ID</th>
                      <th>Parent ID</th>
                      <th>Position</th>
                      <th>Plan</th>
                      <th>Status</th>
                      <th>KYC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-[#736C63]">
                          No member records found matching your search.
                        </td>
                      </tr>
                    ) : (
                      members.map((m) => (
                        <tr key={m.id}>
                          <td className="font-bold font-mono text-[#1B3B2B]">{m.member_id}</td>
                          <td className="font-medium text-[#1C1917]">{m.full_name}</td>
                          <td className="text-[#554F47]">{m.mobile}</td>
                          <td className="font-mono text-[#736C63]">{m.sponsor_id || '-'}</td>
                          <td className="font-mono text-[#736C63]">{m.parent_id || '-'}</td>
                          <td>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              m.position === 'LEFT' ? 'bg-[#EAF2EC] text-[#1B3B2B]' : 'bg-[#F4EFE6] text-[#A37B34]'
                            }`}>
                              {m.position || 'ROOT'}
                            </span>
                          </td>
                          <td className="text-[#554F47]">{m.current_plan_name || 'No Plan'}</td>
                          <td>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              m.status === 'ACTIVE' ? 'bg-[#EAF2EC] text-[#1B3B2B]' : 'bg-[#FDF0F0] text-[#8C2525]'
                            }`}>
                              {m.status}
                            </span>
                          </td>
                          <td>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              m.kyc_status === 'VERIFIED' ? 'bg-[#EAF2EC] text-[#1B3B2B]' :
                              m.kyc_status === 'REJECTED' ? 'bg-[#FDF0F0] text-[#8C2525]' : 'bg-[#F4EFE6] text-[#A37B34]'
                            }`}>
                              {m.kyc_status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Admin Accounts & Handover Directory */
        <div className="glass-card p-6 space-y-4 border border-[#E2DDD1]">
          <div className="flex justify-between items-center pb-3 border-b border-[#E2DDD1]">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#1C1917]">System Administrators & Handover Accounts</h3>
              <p className="text-xs text-[#736C63]">Platform owner and developer support access accounts</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn-gold text-xs py-2 px-3 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add New Admin
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#F0ECE3] border border-[#C5A059] space-y-2">
              <div className="flex items-center justify-between">
                <span className="badge badge-active bg-[#1B3B2B] text-white">PLATFORM OWNER</span>
                <span className="text-[10px] font-mono text-[#736C63]">Main Administrator</span>
              </div>
              <h4 className="font-serif font-bold text-lg text-[#1C1917]">owner</h4>
              <p className="text-xs text-[#554F47]">Email: <span className="font-semibold text-[#1C1917]">owner@nms.com</span></p>
              <p className="text-xs text-[#554F47]">Privileges: <span className="font-bold text-[#1B3B2B]">Full Business Management</span></p>
            </div>

            <div className="p-4 rounded-xl bg-[#F4EFE6] border border-[#D8C8AF] space-y-2">
              <div className="flex items-center justify-between">
                <span className="badge badge-plan bg-[#5C1D24] text-white">SYSTEM DEVELOPER</span>
                <span className="text-[10px] font-mono text-[#736C63]">Engineering & Support</span>
              </div>
              <h4 className="font-serif font-bold text-lg text-[#1C1917]">admin</h4>
              <p className="text-xs text-[#554F47]">Email: <span className="font-semibold text-[#1C1917]">admin@gmail.com</span></p>
              <p className="text-xs text-[#554F47]">Privileges: <span className="font-bold text-[#5C1D24]">Superuser & Database Access</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
