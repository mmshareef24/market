
import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Megaphone, 
  Users, 
  MessageCircle, 
  Share2, 
  Workflow, 
  Settings, 
  Menu,
  X,
  LogOut,
  Crown
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';
import { Button } from '../components/Button';
import { PlanTier } from '../types';

interface DashboardLayoutProps {
  onLogout: () => void;
  plan: PlanTier;
  setPlan: (plan: PlanTier) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onLogout, plan, setPlan }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Campaigns', icon: Megaphone, path: '/dashboard/campaigns' },
    { label: 'Contacts', icon: Users, path: '/dashboard/contacts' },
    { label: 'Audience', icon: Users, path: '/dashboard/audience' },
    { label: 'WhatsApp', icon: MessageCircle, path: '/dashboard/whatsapp' },
    { label: 'Integrations', icon: Share2, path: '/dashboard/integrations' },
    { label: 'Automation', icon: Workflow, path: '/dashboard/automation' },
    { label: 'Settings', icon: Settings, path: '/dashboard/settings' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-brand-darker text-slate-900 dark:text-slate-100">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col
          ${isSidebarOpen ? 'w-64' : 'w-20 hidden lg:flex'}
          ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          <div className={`${!isSidebarOpen && 'hidden'} transition-opacity duration-200`}>
             <Logo />
          </div>
          {/* Logo icon only when collapsed */}
          {!isSidebarOpen && <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-cyan to-brand-blue mx-auto" />}
          
          <button className="lg:hidden" onClick={() => setMobileMenuOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'} // exact match for root
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative group
                ${isActive 
                  ? 'bg-brand-cyan/10 text-brand-cyan font-medium' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'}
              `}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isSidebarOpen ? '' : 'mx-auto'}`} />
              <span className={`whitespace-nowrap ${!isSidebarOpen && 'hidden'}`}>
                {item.label}
              </span>
              
              {/* Tooltip for collapsed state */}
              {!isSidebarOpen && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
           {isSidebarOpen && (
              <div className={`p-4 rounded-xl text-white ${plan === 'Starter' ? 'bg-slate-700' : 'bg-gradient-to-br from-brand-cyan to-brand-blue'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-4 h-4 text-yellow-300" />
                  <p className="text-sm font-bold">{plan} Plan</p>
                </div>
                <div className="w-full bg-white/20 rounded-full h-1.5 mb-2">
                  <div className="bg-white h-1.5 rounded-full w-[70%]"></div>
                </div>
                <p className="text-xs text-opacity-80 text-white">
                    {plan === 'Starter' ? '850 / 1,000 contacts' : '15,000 / 25,000 contacts'}
                </p>
                {plan === 'Starter' && (
                  <a href="#/pricing?from=sidebar" className="block mt-3 w-full">
                    <button className="w-full py-1.5 bg-white text-slate-900 text-xs font-bold rounded shadow-sm hover:bg-slate-100 transition-colors">
                      Upgrade to Growth
                    </button>
                  </a>
                )}
              </div>
           )}
           <div className={`flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center flex-col gap-4'}`}>
              <ThemeToggle />
              <button 
                onClick={onLogout}
                className="p-2 text-slate-500 hover:text-red-500 transition-colors" 
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
            <h2 className="font-semibold text-lg hidden sm:block">Workspace</h2>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="primary" size="sm" className="hidden sm:flex">
              <Megaphone className="w-4 h-4 mr-2" /> New Campaign
            </Button>
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border border-slate-300 dark:border-slate-600">
               {/* User Avatar */}
               <img src="https://picsum.photos/100/100" alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {/* Pass plan context to child routes */}
          <Outlet context={{ plan, setPlan }} />
        </div>
      </main>
    </div>
  );
};
