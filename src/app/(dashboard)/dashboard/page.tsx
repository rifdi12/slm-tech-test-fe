'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  DollarSign, FileText, Users, Plus, Upload, ArrowRight, AlertTriangle,
} from 'lucide-react';
import { api } from '@/lib/api';
import { DashboardSummary } from '@/types';
import { Card, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { InvoiceStatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { formatCurrency, formatDate } from '@/lib/utils';
import { getStoredUser } from '@/lib/auth';

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const user = getStoredUser();

  useEffect(() => {
    api.get<DashboardSummary>('/dashboard/summary')
      .then(setSummary)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-secondary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-headline-lg text-on-surface">Financial Overview</h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            {greeting}, {user?.name?.split(' ')[0]}. Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4" />
            Last 30 Days
          </Button>
          <Button size="sm">
            <Upload className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(summary?.totalRevenue ?? 0)}
          trend={{
            value: `+${summary?.revenueGrowth ?? 0}% from last month`,
            positive: (summary?.revenueGrowth ?? 0) >= 0,
          }}
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatCard
          title="Pending Invoices"
          value={summary?.pendingInvoices ?? 0}
          subtitle={
            summary?.overdueInvoices
              ? `⚠ ${summary.overdueInvoices} overdue by 1+ week`
              : 'All on time'
          }
          icon={<FileText className="w-5 h-5" />}
        />
        <StatCard
          title="Active Customers"
          value={summary?.activeCustomers ?? 0}
          trend={{
            value: `+${summary?.newCustomersThisWeek ?? 0} new this week`,
            positive: true,
          }}
          icon={<Users className="w-5 h-5" />}
        />
      </div>

      {/* Chart + Quick Actions */}
      <div className="grid grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="col-span-2">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-headline-sm text-on-surface">Monthly Revenue</h2>
              <p className="text-body-md text-on-surface-variant mt-0.5">
                Projection vs Actual earnings
              </p>
            </div>
            <div className="flex items-center gap-4 text-label-md text-on-surface-variant">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                Actual
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
                Target
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={summary?.monthlyRevenue} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e2e4" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#76777d' }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 12, fill: '#76777d' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v / 1000}k`}
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), '']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e4e2e4', fontSize: '13px' }}
              />
              <Bar dataKey="target" fill="#e4e2e4" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="actual" fill="#006a61" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Quick Actions */}
        <div className="flex flex-col gap-4">
          <Card>
            <h2 className="text-headline-sm text-on-surface mb-1">Quick Actions</h2>
            <p className="text-body-md text-on-surface-variant mb-4">
              Streamline your daily workflow with rapid entry tools.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/invoices/create"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-low transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg border border-outline-variant bg-surface-low flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-body-md font-medium text-on-surface">Create Invoice</p>
                  <p className="text-label-md text-on-surface-variant">New billing document</p>
                </div>
                <ArrowRight className="w-4 h-4 text-outline group-hover:text-on-surface transition-colors" />
              </Link>

              <Link
                href="/customers"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-low transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg border border-outline-variant bg-surface-low flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-body-md font-medium text-on-surface">Add Customer</p>
                  <p className="text-label-md text-on-surface-variant">Onboard new client</p>
                </div>
                <ArrowRight className="w-4 h-4 text-outline group-hover:text-on-surface transition-colors" />
              </Link>

              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-low transition-colors group cursor-pointer">
                <div className="w-8 h-8 rounded-lg border border-outline-variant bg-surface-low flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                  <Upload className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-body-md font-medium text-on-surface">Import Expenses</p>
                  <p className="text-label-md text-on-surface-variant">Upload CSV or XLSX</p>
                </div>
                <ArrowRight className="w-4 h-4 text-outline group-hover:text-on-surface transition-colors" />
              </div>
            </div>
          </Card>

          {/* Fiscal Year Progress */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <p className="text-body-md font-semibold text-on-surface">Fiscal Year Progress</p>
              <span className="text-headline-sm text-on-surface font-bold">68%</span>
            </div>
            <div className="w-full bg-surface-highest rounded-full h-2 mb-2">
              <div className="bg-secondary h-2 rounded-full" style={{ width: '68%' }} />
            </div>
            <p className="text-label-md text-on-surface-variant">GOAL: $200K</p>
          </Card>
        </div>
      </div>

      {/* Recent Invoices */}
      <Card padding="none">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
          <h2 className="text-headline-sm text-on-surface">Recent Invoices</h2>
          <Link href="/invoices" className="text-body-md text-secondary hover:underline font-medium">
            View All Invoices
          </Link>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant">
              {['INVOICE ID', 'CUSTOMER', 'DATE', 'AMOUNT', 'STATUS', 'ACTION'].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-label-md text-on-surface-variant">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {summary?.recentInvoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-outline-variant last:border-0 hover:bg-surface-low transition-colors">
                <td className="px-6 py-4">
                  <Link
                    href={`/invoices/${invoice.id}`}
                    className="font-mono text-data-mono text-secondary hover:underline"
                  >
                    {invoice.invoiceNumber}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={invoice.customer.name} size="sm" />
                    <span className="text-body-md font-medium text-on-surface">
                      {invoice.customer.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-body-md text-on-surface-variant">
                  {formatDate(invoice.issueDate)}
                </td>
                <td className="px-6 py-4 font-mono text-data-mono text-on-surface">
                  {formatCurrency(invoice.totalAmount)}
                </td>
                <td className="px-6 py-4">
                  <InvoiceStatusBadge status={invoice.status} />
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/invoices/${invoice.id}`}
                    className="p-1.5 rounded hover:bg-surface-high text-on-surface-variant hover:text-on-surface transition-colors inline-flex"
                  >
                    ⋮
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
