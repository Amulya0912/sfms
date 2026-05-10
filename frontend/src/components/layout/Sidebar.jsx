import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  LayoutDashboard, Users, UserPlus, GraduationCap, 
  IndianRupee, CreditCard, FileText, BarChart3, 
  Settings, LogOut, Receipt, BookOpen 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { setSidebarOpen } from '../../store/slices/uiSlice';
import { cn } from '../common/LoadingSpinner';

const Sidebar = () => {
  const { user, logout, hasRole } = useAuth();
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);

  const getNavItems = () => {
    const items = [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['super_admin', 'accountant', 'staff'] },
      
      // Admin / Staff
      { path: '/students', icon: Users, label: 'Students', roles: ['super_admin', 'staff'] },
      
      // Finance
      { path: '/fee-structures', icon: IndianRupee, label: 'Fee Structures', roles: ['super_admin', 'staff', 'accountant'] },
      { path: '/payments', icon: CreditCard, label: 'Payments', roles: ['super_admin', 'accountant'] },
      { path: '/receipts', icon: Receipt, label: 'Receipts', roles: ['super_admin', 'accountant', 'student'] },
      
      // Reports
      { path: '/reports', icon: BarChart3, label: 'Reports', roles: ['super_admin', 'accountant'] },
      
      // System
      { path: '/users', icon: Settings, label: 'User Management', roles: ['super_admin'] },
      
      // Student specific
      { path: '/my-fees', icon: FileText, label: 'My Fees', roles: ['student'] },
      { path: '/profile', icon: UserPlus, label: 'My Profile', roles: ['student'] },
    ];

    return items.filter(item => hasRole(item.roles));
  };

  const closeSidebar = () => dispatch(setSidebarOpen(false));

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform bg-surface border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center justify-center border-b border-border px-4">
          <div className="flex items-center gap-2 text-primary-600 dark:text-primary-500">
            <GraduationCap className="h-8 w-8" />
            <span className="text-xl font-bold tracking-tight">SFMS</span>
          </div>
        </div>

        <div className="flex flex-col h-[calc(100vh-4rem)]">
          {/* User Info */}
          <div className="p-4 border-b border-border">
            <p className="text-sm font-medium text-text truncate">{user?.full_name}</p>
            <p className="text-xs text-text-muted capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {getNavItems().map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400" 
                    : "text-text hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Footer Action */}
          <div className="p-4 border-t border-border">
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
