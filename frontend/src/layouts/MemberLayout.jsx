import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, GitBranch, Share2, Award, 
  Wallet, ArrowDownRight, ShieldCheck, HelpCircle, 
  LogOut, Menu, X, Bell
} from 'lucide-react';
import { authService } from '../services/authService';

export default function MemberLayout({ children, currentTab, setCurrentTab }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'team', label: 'My Team', icon: Users },
    { id: 'binary_tree', label: 'Binary Tree', icon: GitBranch },
    { id: 'referral_tree', label: 'Referral Downline', icon: Share2 },
    { id: 'my_plan', label: 'Active Plan', icon: Award },
    { id: 'wallet', label: 'Wallet Ledger', icon: Wallet },
    { id: 'withdrawals', label: 'Withdrawals', icon: ArrowDownRight },
    { id: 'kyc', label: 'KYC Verification', icon: ShieldCheck },
    { id: 'support', label: 'Support Tickets', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-[#F7F4EF] flex text-[#2C2824]">
      {/* 
        Grid Wireframe Layout matching user diagram:
        Region 1: Top-Left Logo Box (h-16, border-b)
        Region 2: Middle-Left Navigation Box (flex-1, overflow-y-auto)
        Region 3: Bottom-Left Profile Box (h-auto, border-t)
        Region 4: Top-Right Header Bar (h-16, border-b)
        Region 5: Main Bottom-Right Workspace
      */}

      {/* Sidebar Desktop (Regions 1, 2, 3) */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#ECE7DD] border-r border-[#D8CEBE] fixed h-full z-20 shadow-xs">
        
        {/* Region 1: Top-Left Logo Box (Aligned h-16 with header) */}
        <div className="h-16 px-5 border-b border-[#D8CEBE] flex items-center justify-between bg-[#E8E2D7]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1B3B2B] border border-[#C5A059] flex items-center justify-center text-[#C5A059] shadow-xs">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-[#1C1917] text-base leading-none">NMS Member</h2>
              <span className="text-[9px] text-[#A37B34] font-extrabold uppercase tracking-widest block mt-0.5">PORTAL</span>
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
                    ? 'bg-[#1B3B2B] text-[#F7F4EF] border border-[#C5A059] shadow-xs' 
                    : 'text-[#554F47] hover:text-[#1C1917] hover:bg-[#E0D9CB]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Region 3: Bottom-Left User Profile / Logout Box */}
        <div className="p-4 border-t border-[#D8CEBE] bg-[#E8E2D7] space-y-2.5">
          <div className="p-2.5 rounded-lg bg-white border border-[#E2DDD1] flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#1B3B2B] text-[#C5A059] flex items-center justify-center font-serif font-bold text-xs shrink-0">
              {user?.username?.substring(0, 2).toUpperCase() || 'M'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-[#1C1917] truncate">{user?.username || 'Member'}</p>
              <p className="text-[10px] text-[#736C63] font-mono truncate">{user?.member_id || 'M00001'}</p>
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
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF2EC] border border-[#B8D4C1] text-[#1B3B2B] text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-[#1B3B2B]"></span>
              Plan: {user?.plan_name || 'Active'}
            </div>
            <button className="p-2 text-[#736C63] hover:text-[#1C1917] relative">
              <Bell className="w-5 h-5" />
            </button>
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
