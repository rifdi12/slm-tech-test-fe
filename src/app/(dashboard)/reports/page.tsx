'use client';

import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Legend,
} from 'recharts';
import { api } from '@/lib/api';
import { DashboardSummary, InvoiceStats } from '@/types';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';

const COLORS = ['#006a61', '#2563eb', '#f59e0b', '#dc2626'];

export default function ReportsPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [stats, setStats] = useState<InvoiceStats | null>(null);

  useEffect(() => {
    Promise.all([
      api.get<DashboardSummary>('/dashboard/summary'),
      api.get<InvoiceStats>('/dashboard/invoice-stats'),
    ]).then(([s, st]) => { setSummary(s); setStats(st); }).catch(console.error);
  }, []);

  const pieData = stats
    ? [
        { name: 'Paid', value: stats.counts.paid },
        { name: 'Sent', value: stats.counts.sent },
        { name: 'Draft', value: stats.counts.draft },
        { name: 'Overdue', value: stats.counts.overdue },
      ].filter((d) => d.value > 0)
    : [];

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-headline-lg text-on-surface">Reports</h1>
        <p className="text-body-md text-on-surface-variant mt-1">Financial analytics and business insights.</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: formatCurrency(summary?.totalRevenue ?? 0) },
          { label: 'Total Outstanding', value: formatCurrency(stats?.totalOutstanding ?? 0) },
          { label: 'Overdue Balance', value: formatCurrency(stats?.overdueBalance ?? 0) },
          { label: 'Active Customers', value: String(summary?.activeCustomers ?? 0) },
        ].map(({ label, value }) => (
          <Card key={label}>
            <p className="text-label-md text-on-surface-variant uppercase tracking-wider mb-2">{label}</p>
            <p className="text-headline-sm font-mono text-on-surface">{value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <h2 className="text-headline-sm text-on-surface mb-5">Monthly Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={summary?.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e2e4" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#76777d' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#76777d' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip formatter={(value: number) => [formatCurrency(value), 'Revenue']} contentStyle={{ borderRadius: '8px', border: '1px solid #e4e2e4', fontSize: '13px' }} />
              <Bar dataKey="actual" fill="#006a61" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h2 className="text-headline-sm text-on-surface mb-5">Invoice Status Distribution</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend formatter={(v) => <span style={{ fontSize: '12px', color: '#45464d' }}>{v}</span>} />
              <Tooltip formatter={(value: number) => [`${value} invoices`, '']} contentStyle={{ borderRadius: '8px', border: '1px solid #e4e2e4', fontSize: '13px' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
