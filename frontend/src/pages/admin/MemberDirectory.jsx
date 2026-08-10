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
          <h2 className="text-xl font-serif font-bold text-[#1C1917]">Member Directory</h2>
          <p className="text-xs text-[#736C63]">Inspect registered downline members, sponsor links & KYC status</p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-[#736C63] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ID, name or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input text-xs pl-9 pr-4 py-2 w-full sm:w-64"
          />
        </div>
      </div>

      {loading ? (
        <SkeletonTable rows={6} cols={9} />
      ) : (
        <div className="glass-card p-0 overflow-hidden border border-[#E2DDD1]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-[#736C63] font-serif uppercase tracking-wider border-b border-[#E2DDD1]">
                <tr>
                  <th className="p-3.5">Member ID</th>
                  <th className="p-3.5">Full Name</th>
                  <th className="p-3.5">Mobile</th>
                  <th className="p-3.5">Sponsor ID</th>
                  <th className="p-3.5">Parent ID</th>
                  <th className="p-3.5">Position</th>
                  <th className="p-3.5">Plan</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">KYC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DDD1] text-[#2C2824]">
                {members.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-[#736C63]">
                      No member records found matching your search.
                    </td>
                  </tr>
                ) : (
                  members.map((m) => (
                    <tr key={m.id} className="hover:bg-[#FDFBF7]">
                      <td className="p-3.5 font-bold font-mono text-[#1B3B2B]">{m.member_id}</td>
                      <td className="p-3.5 font-medium text-[#1C1917]">{m.full_name}</td>
                      <td className="p-3.5 text-[#554F47]">{m.mobile}</td>
                      <td className="p-3.5 font-mono text-[#736C63]">{m.sponsor_id || '-'}</td>
                      <td className="p-3.5 font-mono text-[#736C63]">{m.parent_id || '-'}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.position === 'LEFT' ? 'bg-[#EAF2EC] text-[#1B3B2B]' : 'bg-[#F4EFE6] text-[#A37B34]'
                        }`}>
                          {m.position || 'ROOT'}
                        </span>
                      </td>
                      <td className="p-3.5 text-[#554F47]">{m.current_plan_name || 'No Plan'}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.status === 'ACTIVE' ? 'bg-[#EAF2EC] text-[#1B3B2B]' : 'bg-[#FDF0F0] text-[#8C2525]'
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="p-3.5">
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
