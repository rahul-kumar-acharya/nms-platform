import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, GitBranch, KeyRound, Award, 
  Zap, Wallet, ArrowDownRight, ShieldCheck, HelpCircle, 
  FileText, LogOut, Menu, X, ShieldAlert
} from 'lucide-react';
import { authService } from '../services/authService';

export default function AdminLayout({ children, currentTab, setCurrentTab }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  const menuItems = [
    { id: 'dashboard', label: 'Admin Control', icon: LayoutDashboard },
    { id: 'members', label: 'Member Directory', icon: Users },
    { id: 'binary_tree', label: 'Network Binary Tree', icon: GitBranch },
    { id: 'plans', label: 'Plans & Pricing', icon: Award },
    { id: 'epins', label: 'EPIN Generator', icon: KeyRound },
    { id: 'income_engine', label: 'Income Engine', icon: Zap },
    { id: 'wallets', label: 'Wallet Management', icon: Wallet },
    { id: 'withdrawals', label: 'Withdrawal Approvals', icon: ArrowDownRight },
    { id: 'kyc', label: 'KYC Verification', icon: ShieldCheck },
    { id: 'support', label: 'Support Tickets', icon: HelpCircle },
    { id: 'audit', label: 'System Audit Logs', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#F7F4EF] flex text-[#2C2824]">
      {/* 
        Grid Wireframe Layout matching user diagram:
        Region 1: Top-Left Brand Box (h-16, border-b)
        Region 2: Middle-Left Navigation Box (flex-1, overflow-y-auto)
        Region 3: Bottom-Left Admin User Box (h-auto, border-t)
        Region 4: Top-Right Full Horizontal Header Bar (h-16, border-b)
        Region 5: Main Bottom-Right Workspace
      */}

      {/* Sidebar Desktop (Regions 1, 2, 3) */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#EFECE3] border-r border-[#D8CEBE] fixed h-full z-20 shadow-xs">
        
        {/* Region 1: Top-Left Brand Box (Aligned h-16 with header) */}
        <div className="h-16 px-5 border-b border-[#D8CEBE] flex items-center justify-between bg-[#E5DFD1]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#5C1D24] border border-[#C5A059] flex items-center justify-center text-[#F7F4EF] shadow-xs">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-[#1C1917] text-base leading-none">NMS Control</h2>
              <span className="text-[9px] text-[#5C1D24] font-extrabold uppercase tracking-widest block mt-0.5">ADMINISTRATION</span>
            </div>
          </div>
        </div>

        {/* Region 2: Middle-Left Navigation Box */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-xs tracking-wide transition-all ${
                  active 
                    ? 'bg-[#5C1D24] text-[#F7F4EF] border border-[#C5A059] shadow-xs' 
                    : 'text-[#554F47] hover:text-[#1C1917] hover:bg-[#E2DDD1]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Region 3: Bottom-Left Admin User / Logout Box */}
        <div className="p-4 border-t border-[#D8CEBE] bg-[#E5DFD1] space-y-2.5">
          <div className="p-2.5 rounded-lg bg-white border border-[#E2DDD1] flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#5C1D24] text-[#F7F4EF] flex items-center justify-center font-bold text-xs shrink-0">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-[#1C1917] truncate">{user?.username || 'Admin'}</p>
              <p className="text-[10px] text-[#5C1D24] font-bold truncate">System Administrator</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-[#8C2525] bg-[#FDF0F0] hover:bg-[#F8DCDC] border border-[#F3C6C6] transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Workspace (Regions 4 & 5) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        
        {/* Region 4: Top-Right Full Horizontal Header Bar (h-16, border-b) */}
        <header className="h-16 border-b border-[#D8CEBE] bg-white px-6 flex items-center justify-between sticky top-0 z-10 shadow-xs">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-[#554F47] hover:text-[#1C1917]"
            >
              {mobileOpen ? <X /> : <Menu />}
            </button>
            <h1 className="text-xl font-serif font-bold text-[#1C1917] capitalize">{currentTab.replace('_', ' ')}</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="px-3 py-1 rounded-full bg-[#FDF0F0] border border-[#F3C6C6] text-[#8C2525] text-xs font-bold uppercase tracking-wider">
              ADMINISTRATIVE MODE
            </span>
          </div>
        </header>

        {/* Region 5: Main Content Container */}
        <main className="p-6 flex-1 overflow-x-hidden">
          {children}
        </main>

      </div>
    </div>
  );
}
