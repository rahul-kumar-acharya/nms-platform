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
      <div className="glass-card p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-serif font-bold text-[#1C1917]">Member Directory & Downlines</h3>
          <p className="text-xs text-[#736C63]">Inspect network members, binary tree positions & KYC statuses</p>
        </div>

        <div className="relative flex items-center w-72">
          <Search className="w-4 h-4 text-[#736C63] absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Member ID, Name, Mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input form-input-icon text-xs"
          />
        </div>
      </div>

      <div className="glass-card p-6">
        {loading ? (
          <SkeletonTable rows={6} cols={9} />
        ) : (
          <div className="overflow-x-auto">
            <table className="custom-table">
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
                    <td colSpan="9" className="text-center py-6 text-[#736C63]">No members matching search criteria</td>
                  </tr>
                ) : (
                  members.map((m) => (
                    <tr key={m.id}>
                      <td className="font-bold text-[#1C1917] font-mono">{m.member_id}</td>
                      <td className="font-semibold text-[#2C2824]">{m.full_name}</td>
                      <td className="text-xs text-[#736C63]">{m.mobile}</td>
                      <td className="text-xs text-[#1B3B2B] font-mono font-bold">{m.sponsor_id || '-'}</td>
                      <td className="text-xs text-[#A37B34] font-mono font-bold">{m.parent_id || '-'}</td>
                      <td>
                        <span className="text-xs font-bold text-[#1C1917]">{m.position || 'ROOT'}</span>
                      </td>
                      <td>
                        <span className="badge badge-plan">{m.current_plan_detail?.name || 'Standard'}</span>
                      </td>
                      <td>
                        <span className="badge badge-active">{m.status}</span>
                      </td>
                      <td>
                        {m.kyc_status === 'VERIFIED' && <span className="badge badge-active">VERIFIED</span>}
                        {m.kyc_status === 'PENDING' && <span className="badge badge-pending">PENDING</span>}
                        {m.kyc_status === 'REJECTED' && <span className="badge badge-rejected">REJECTED</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
