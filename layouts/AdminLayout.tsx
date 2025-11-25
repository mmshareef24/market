
import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  DollarSign, 
  Image, 
  Settings, 
  LogOut,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';

interface AdminLayoutProps {
  onLogout: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onLogout }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Overview', icon: LayoutDashboard, path: '/admin' },
    { label: 'Content Manager', icon: FileText, path: '/admin/content' },
    { label: 'Pricing Plans', icon: DollarSign, path: '/admin/pricing' },
    { label: 'Media Library', icon: Image, path: '/admin/media' },
    { label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen bg-slate-900 text-white border-r border-slate-800 transition-all duration-300 flex flex-col
          ${isSidebarOpen ? 'w-64' : 'w-20 hidden lg:flex'}
          ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div className={`${!isSidebarOpen && 'hidden'} transition-opacity duration-200`}>
             <div className="flex items-center gap-2 font-bold text-xl">
                <ShieldCheck className="w-6 h-6 text-brand-cyan" />
                <span>Admin</span>
             </div>
          </div>
          {!isSidebarOpen && <ShieldCheck className="w-6 h-6 text-brand-cyan mx-auto" />}
          
          <button className="lg:hidden text-slate-400" onClick={() => setMobileMenuOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative group
                ${isActive 
                  ? 'bg-brand-cyan text-slate-900 font-medium' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isSidebarOpen ? '' : 'mx-auto'}`} />
              <span className={`whitespace-nowrap ${!isSidebarOpen && 'hidden'}`}>
                {item.label}
              </span>
              
              {!isSidebarOpen && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-slate-700">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-4">
           <div className={`flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center flex-col gap-4'}`}>
              <ThemeToggle />
              <button 
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-red-400 transition-colors" 
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <header className="h-16 sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                if(window.innerWidth >= 1024) setSidebarOpen(!isSidebarOpen);
                else setMobileMenuOpen(true);
              }}
              className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-semibold text-lg hidden sm:block">Admin Console</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-xs font-bold rounded-full uppercase tracking-wide">
                Administrator
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold">
               AD
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
