'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Plus, Filter, Download, MoreVertical } from 'lucide-react';
import { api } from '@/lib/api';
import { Invoice, InvoiceStats, PaginatedResponse } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { InvoiceStatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Pagination } from '@/components/ui/Pagination';
import { formatCurrency, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

const STATUS_TABS = ['All', 'Draft', 'Sent', 'Paid', 'Overdue'] as const;

function InvoicesContent() {
  const searchParams = useSearchParams();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [stats, setStats] = useState<InvoiceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(searchParams.get('search') ?? '');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      if (activeTab !== 'All') params.set('status', activeTab.toUpperCase());
      if (search) params.set('search', search);
      const [res, statsRes] = await Promise.all([
        api.get<PaginatedResponse<Invoice>>(`/invoices?${params}`),
        api.get<InvoiceStats>('/dashboard/invoice-stats'),
      ]);
      setInvoices(res.data);
      setMeta(res.meta);
      setStats(statsRes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, activeTab, search]);

  useEffect(() => { load(); }, [load]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-headline-lg text-on-surface">Invoices</h1>
          <div className="flex items-center gap-1 text-body-md text-on-surface-variant mt-1">
            <Link href="/dashboard" className="hover:text-secondary">Dashboard</Link>
            <span>›</span>
            <span>History</span>
          </div>
        </div>
        <Link href="/invoices/create">
          <Button>
            <Plus className="w-4 h-4" />
            Create New
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <p className="text-label-md text-on-surface-variant uppercase tracking-wider mb-2">Total Outstanding</p>
          <div className="flex items-baseline gap-2">
            <p className="text-headline-md font-mono text-on-surface">{formatCurrency(stats?.totalOutstanding ?? 0)}</p>
            <span className="text-label-md text-status-paid bg-status-paid-bg px-1.5 py-0.5 rounded-full">+12%</span>
          </div>
        </Card>
        <Card>
          <p className="text-label-md text-on-surface-variant uppercase tracking-wider mb-2">Paid Invoices</p>
          <div className="flex items-baseline gap-2">
            <p className="text-headline-md font-mono text-on-surface">{formatCurrency(stats?.totalPaid ?? 0)}</p>
            <span className="text-label-md text-status-paid bg-status-paid-bg px-1.5 py-0.5 rounded-full">{stats?.counts.paid ?? 0} Units</span>
          </div>
        </Card>
        <Card>
          <p className="text-label-md text-on-surface-variant uppercase tracking-wider mb-2">Overdue Balance</p>
          <div className="flex items-baseline gap-2">
            <p className="text-headline-md font-mono text-status-overdue">{formatCurrency(stats?.overdueBalance ?? 0)}</p>
            <span className="text-label-md text-status-overdue bg-status-overdue-bg px-1.5 py-0.5 rounded-full">{stats?.counts.overdue ?? 0} Overdue</span>
          </div>
        </Card>
        <Card>
          <p className="text-label-md text-on-surface-variant uppercase tracking-wider mb-2">Drafts</p>
          <p className="text-headline-md text-on-surface">{stats?.counts.draft ?? 0}</p>
          <p className="text-label-md text-on-surface-variant mt-1">Ready to send</p>
        </Card>
      </div>

      {/* Table Card */}
      <Card padding="none">
        {/* Tabs + Toolbar */}
        <div className="px-5 pt-4 border-b border-outline-variant">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={cn(
                    'px-4 py-1.5 rounded-lg text-body-md font-medium transition-colors',
                    activeTab === tab
                      ? 'bg-on-surface text-white'
                      : 'text-on-surface-variant hover:bg-surface-high',
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin w-7 h-7 border-2 border-secondary border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant">
                  {['INVOICE #', 'CUSTOMER', 'ISSUE DATE', 'DUE DATE', 'TOTAL AMOUNT', 'STATUS', 'ACTIONS'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-label-md text-on-surface-variant">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-outline-variant last:border-0 hover:bg-surface-low transition-colors">
                    <td className="px-5 py-4">
                      <Link href={`/invoices/${invoice.id}`} className="font-mono text-data-mono text-secondary hover:underline">
                        {invoice.invoiceNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={invoice.customer.name} size="sm" />
                        <div>
                          <p className="text-body-md font-semibold text-on-surface">{invoice.customer.name}</p>
                          <p className="text-label-md text-on-surface-variant">{invoice.customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-body-md text-on-surface-variant">{formatDate(invoice.issueDate)}</td>
                    <td className={cn(
                      'px-5 py-4 text-body-md font-medium',
                      invoice.status === 'OVERDUE' ? 'text-status-overdue' : 'text-on-surface-variant',
                    )}>
                      {formatDate(invoice.dueDate)}
                    </td>
                    <td className="px-5 py-4 font-mono text-data-mono text-on-surface">
                      {formatCurrency(invoice.totalAmount)}
                    </td>
                    <td className="px-5 py-4">
                      <InvoiceStatusBadge status={invoice.status} />
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/invoices/${invoice.id}`}
                        className="p-1.5 rounded hover:bg-surface-high text-on-surface-variant hover:text-on-surface transition-colors inline-flex"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
                {invoices.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-body-md text-on-surface-variant">
                      No invoices found.{' '}
                      <Link href="/invoices/create" className="text-secondary hover:underline">Create one</Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            </div>
            <div className="px-5">
              <Pagination
                page={meta.page}
                totalPages={meta.totalPages}
                total={meta.total}
                limit={meta.limit}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

export default function InvoicesPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-40"><div className="animate-spin w-7 h-7 border-2 border-secondary border-t-transparent rounded-full" /></div>}>
      <InvoicesContent />
    </Suspense>
  );
}
