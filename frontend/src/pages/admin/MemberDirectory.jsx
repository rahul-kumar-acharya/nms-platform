import React, { useState, useEffect } from 'react';
import { memberService } from '../../services/memberService';
import { SkeletonTable } from '../../components/common/Skeleton';
import { Search } from 'lucide-react';

export default function MemberDirectory() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#1C1917]">Member Directory & Team</h2>
          <p className="text-xs text-[#736C63]">Inspect registered downline members, sponsor links & KYC status</p>
        </div>

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
    </div>
  );
}
