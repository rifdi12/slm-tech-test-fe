'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, FileText, BarChart3,
  Settings, Plus, LogOut, Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { clearAuth, getStoredUser } from '@/lib/auth';
import { Avatar } from '@/components/ui/Avatar';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/customers', icon: Users, label: 'Customers' },
  { href: '/invoices', icon: FileText, label: 'Invoices' },
  { href: '/reports', icon: BarChart3, label: 'Reports' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = getStoredUser();

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[200px] bg-sidebar flex flex-col z-30">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Mini ERP</p>
            <p className="text-sidebar-text text-[10px] uppercase tracking-widest">Enterprise Manager</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-secondary/20 text-white'
                  : 'text-sidebar-text hover:bg-white/5 hover:text-white',
              )}
            >
              <Icon className={cn('w-4 h-4 shrink-0', active && 'text-secondary-light')} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Create Invoice CTA */}
      <div className="px-3 pb-4">
        <Link
          href="/invoices/create"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-secondary hover:bg-teal-600 text-white text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Invoice
        </Link>
      </div>

      {/* User */}
      <div className="px-4 py-4 border-t border-white/10 flex items-center gap-3">
        {user && <Avatar name={user.name} size="sm" />}
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">{user?.name ?? 'Admin'}</p>
          <p className="text-sidebar-text text-[11px] truncate">Admin Account</p>
        </div>
        <button
          onClick={handleLogout}
          className="p-1.5 rounded hover:bg-white/10 text-sidebar-text hover:text-white transition-colors"
          title="Sign out"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
