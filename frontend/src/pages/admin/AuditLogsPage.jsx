import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { SkeletonTable } from '../../components/common/Skeleton';
import { FileText, Shield } from 'lucide-react';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/audit/').then(res => {
      setLogs(res.data.results || res.data || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h3 className="text-xl font-serif font-bold text-[#1C1917]">System Audit Logs</h3>
        <p className="text-xs text-[#736C63]">Security & operational audit trail of system events</p>
      </div>

      {loading ? (
        <SkeletonTable rows={6} cols={8} />
      ) : (
        <div className="glass-card p-6">
          <div className="overflow-x-auto">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Log ID</th>
                  <th>Administrator</th>
                  <th>Action</th>
                  <th>Target Model</th>
                  <th>Target ID</th>
                  <th>IP Address</th>
                  <th>Timestamp</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-6 text-[#736C63]">No audit logs recorded</td>
                  </tr>
                ) : (
                  logs.map(log => (
                    <tr key={log.id}>
                      <td className="font-bold text-[#1C1917]">#{log.id}</td>
                      <td className="font-semibold text-[#5C1D24]">{log.username || 'System'}</td>
                      <td>
                        <span className="badge badge-plan">{log.action}</span>
                      </td>
                      <td className="text-xs text-[#554F47]">{log.target_model}</td>
                      <td className="text-xs font-mono text-[#A37B34]">{log.target_id}</td>
                      <td className="text-xs text-[#736C63] font-mono">{log.ip_address || '127.0.0.1'}</td>
                      <td className="text-xs text-[#736C63]">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="text-xs text-[#554F47] max-w-xs truncate">{log.details}</td>
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
