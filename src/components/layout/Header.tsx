'use client';

import { Search, Bell, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { getStoredUser } from '@/lib/auth';

export function Header() {
  const user = getStoredUser();
  const router = useRouter();
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/invoices?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <header className="h-14 bg-surface-lowest border-b border-outline-variant flex items-center gap-4 px-6">
      <form onSubmit={handleSearch} className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="search"
            placeholder="Search invoices, clients..."
            className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-outline-variant bg-surface-low text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-colors"
          />
        </div>
      </form>

      <div className="flex items-center gap-3 ml-auto">
        <button className="p-2 rounded-lg hover:bg-surface-high text-on-surface-variant transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
        <button className="p-2 rounded-lg hover:bg-surface-high text-on-surface-variant transition-colors">
          <HelpCircle className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-outline-variant">
          {user && <Avatar name={user.name} size="sm" />}
          <div>
            <p className="text-body-md font-semibold text-on-surface leading-none">{user?.name ?? 'Admin'}</p>
            <p className="text-label-md text-on-surface-variant mt-0.5">ADMIN</p>
          </div>
        </div>
      </div>
    </header>
  );
}
