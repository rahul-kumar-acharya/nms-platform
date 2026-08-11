import React, { useState, useEffect } from 'react';
import { authService } from './services/authService';
import { networkService } from './services/networkService';

// Layouts & Global Public Header/Footer
import MemberLayout from './layouts/MemberLayout';
import AdminLayout from './layouts/AdminLayout';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Modal from './components/common/Modal';
import { SkeletonTree } from './components/common/Skeleton';

// Public Pages
import Home from './pages/public/Home';
import Services from './pages/public/Services';
import Features from './pages/public/Features';
import FAQ from './pages/public/FAQ';
import Privacy from './pages/public/Privacy';
import Terms from './pages/public/Terms';
import Contact from './pages/public/Contact';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Member Pages
import MemberDashboard from './pages/member/Dashboard';
import WalletPage from './pages/member/WalletPage';
import WithdrawalsPage from './pages/member/WithdrawalsPage';
import KYCPage from './pages/member/KYCPage';
import MyPlanPage from './pages/member/MyPlanPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import MemberDirectory from './pages/admin/MemberDirectory';
import EPINManagementPage from './pages/admin/EPINManagementPage';
import WithdrawalApprovalsPage from './pages/admin/WithdrawalApprovalsPage';
import KYCVerificationPage from './pages/admin/KYCVerificationPage';
import PlansPage from './pages/admin/PlansPage';
import IncomeManagementPage from './pages/admin/IncomeManagementPage';
import AuditLogsPage from './pages/admin/AuditLogsPage';

// Tree Visualizer
import BinaryTree from './components/tree/BinaryTree';
import ReferralTree from './components/tree/ReferralTree';

export default function App() {
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());

  // Sync live user profile from backend on app startup
  useEffect(() => {
    if (localStorage.getItem('nms_token')) {
      authService.getMe()
        .then(user => {
          if (user) {
            localStorage.setItem('nms_user', JSON.stringify(user));
            setCurrentUser(user);
          }
        })
        .catch(() => {});
    }
  }, []);

  // Modal State for Member Node Inspection
  const [selectedNode, setSelectedNode] = useState(null);

  // Determine initial view from URL path cleanly
  const getInitialView = () => {
    const path = window.location.pathname.replace('/', '');
    if (!path || path === '') return 'home'; // Root URL '/' always opens Home page!
    if (['home', 'services', 'features', 'faq', 'terms', 'privacy', 'contact', 'login', 'register', 'dashboard', 'members', 'team', 'epins', 'plans', 'my_plan', 'income_engine', 'audit', 'wallet', 'wallets', 'withdrawals', 'kyc', 'binary_tree', 'referral_tree'].includes(path)) {
      return path;
    }
    return currentUser ? 'dashboard' : 'home';
  };

  const [view, setViewState] = useState(getInitialView());

  // Helper to set view & sync URL in browser address bar
  const setView = (newView) => {
    setViewState(newView);
    const targetPath = newView === 'home' ? '/' : `/${newView}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  };

  // Listen for browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace('/', '');
      setViewState(path || 'home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Tree Data state
  const [binaryTreeData, setBinaryTreeData] = useState(null);
  const [referralTreeData, setReferralTreeData] = useState(null);
  const [loadingTree, setLoadingTree] = useState(false);

  useEffect(() => {
    if (currentUser && (view === 'binary_tree' || view === 'referral_tree')) {
      setLoadingTree(true);
      if (view === 'binary_tree') {
        networkService.getBinaryTree().then(res => {
          setBinaryTreeData(res);
          setLoadingTree(false);
        }).catch(() => setLoadingTree(false));
      } else if (view === 'referral_tree') {
        networkService.getReferralTree().then(res => {
          setReferralTreeData(res);
          setLoadingTree(false);
        }).catch(() => setLoadingTree(false));
      }
    }
  }, [currentUser, view]);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setView('dashboard');
  };

  // Check if current view is a public or auth page
  const publicViews = ['home', 'services', 'features', 'faq', 'terms', 'privacy', 'contact', 'login', 'register'];
  const isPublicOrAuthPage = publicViews.includes(view) || !currentUser;

  // Render Public & Auth Pages wrapper with Navbar & Footer
  if (isPublicOrAuthPage) {
    const renderPublicContent = () => {
      switch (view) {
        case 'services':
          return <Services setView={setView} />;
        case 'features':
          return <Features setView={setView} />;
        case 'faq':
          return <FAQ />;
        case 'privacy':
          return <Privacy />;
        case 'terms':
          return <Terms />;
        case 'contact':
          return <Contact />;
        case 'register':
          return <Register onNavigateLogin={() => setView('login')} />;
        case 'login':
          return <Login onLoginSuccess={handleLoginSuccess} onNavigateRegister={() => setView('register')} />;
        case 'home':
        default:
          return <Home setView={setView} />;
      }
    };

    return (
      <div className="min-h-screen flex flex-col bg-[#F7F4EF] text-[#2C2824]">
        <Navbar currentView={view} setView={setView} />
        <main className="flex-1">
          {renderPublicContent()}
        </main>
        <Footer setView={setView} />
      </div>
    );
  }

  const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.is_superuser || currentUser?.is_staff;

  // Render Logged-in Dashboard Pages
  const renderDashboardContent = () => {
    if (view === 'dashboard') {
      return isAdmin ? (
        <AdminDashboard onNavigate={setView} />
      ) : (
        <MemberDashboard onNavigate={setView} />
      );
    }

    if (view === 'members' || view === 'team') return <MemberDirectory />;
    if (view === 'epins') return <EPINManagementPage />;
    if (view === 'plans' || view === 'my_plan') {
      return isAdmin ? <PlansPage /> : <MyPlanPage />;
    }
    if (view === 'income_engine') return <IncomeManagementPage />;
    if (view === 'audit') return <AuditLogsPage />;
    if (view === 'wallet' || view === 'wallets') return <WalletPage />;
    if (view === 'withdrawals') {
      return isAdmin ? <WithdrawalApprovalsPage /> : <WithdrawalsPage />;
    }
    if (view === 'kyc') {
      return isAdmin ? <KYCVerificationPage /> : <KYCPage />;
    }

    if (view === 'binary_tree') {
      return (
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-2xl font-serif font-bold text-[#1C1917]">Interactive Binary Network Tree</h3>
            <p className="text-xs text-[#736C63]">Real-time downline placement structure, left/right team counts & direct slots from database</p>
          </div>
          {loadingTree ? (
            <SkeletonTree />
          ) : (
            <BinaryTree 
              treeData={binaryTreeData} 
              onSelectNode={(node) => setSelectedNode(node)}
              onAddMemberSlot={() => setView('register')}
            />
          )}

          {/* Reusable Popup Modal for Member Node Detail */}
          <Modal
            isOpen={!!selectedNode}
            onClose={() => setSelectedNode(null)}
            title={`Member Node: ${selectedNode?.member_id}`}
            type="info"
          >
            {selectedNode && (
              <div className="space-y-2 text-xs text-[#2C2824]">
                <p><span className="text-[#736C63] font-semibold">Full Name:</span> <strong className="text-[#1C1917]">{selectedNode.full_name}</strong></p>
                <p><span className="text-[#736C63] font-semibold">Member ID:</span> <code className="font-mono text-[#1B3B2B] font-bold">{selectedNode.member_id}</code></p>
                <p><span className="text-[#736C63] font-semibold">Active Plan:</span> <span className="badge badge-plan">{selectedNode.plan_name}</span></p>
                <div className="pt-2 border-t border-[#E2DDD1] flex justify-between font-bold">
                  <span className="text-[#1B3B2B]">Left Team Count: {selectedNode.left_count}</span>
                  <span className="text-[#A37B34]">Right Team Count: {selectedNode.right_count}</span>
                </div>
              </div>
            )}
          </Modal>
        </div>
      );
    }

    if (view === 'referral_tree') {
      return (
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-2xl font-serif font-bold text-[#1C1917]">Referral Downline Hierarchy</h3>
            <p className="text-xs text-[#736C63]">Directly sponsored referral network tree loaded live from database</p>
          </div>
          {loadingTree ? (
            <SkeletonTree />
          ) : (
            <ReferralTree treeData={referralTreeData} />
          )}
        </div>
      );
    }

    return (
      <div className="glass-card p-12 text-center text-[#736C63]">
        <h3 className="text-lg font-serif font-bold text-[#1C1917] mb-2">Module Loaded</h3>
        <p className="text-xs">The {view.replace('_', ' ')} view is connected to database API.</p>
      </div>
    );
  };

  return isAdmin ? (
    <AdminLayout currentTab={view} setCurrentTab={setView}>
      {renderDashboardContent()}
    </AdminLayout>
  ) : (
    <MemberLayout currentTab={view} setCurrentTab={setView}>
      {renderDashboardContent()}
    </MemberLayout>
  );
}
