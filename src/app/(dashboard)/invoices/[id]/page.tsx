'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Printer, Send, CheckCircle, AlertCircle, Edit } from 'lucide-react';
import { api } from '@/lib/api';
import { Invoice, InvoiceStatus } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { InvoiceStatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { formatCurrency, formatDate } from '@/lib/utils';

const STATUS_ACTIONS: Record<InvoiceStatus, { label: string; next: InvoiceStatus; icon: React.ReactNode }[]> = {
  DRAFT: [{ label: 'Send Invoice', next: 'SENT', icon: <Send className="w-4 h-4" /> }],
  SENT: [
    { label: 'Mark as Paid', next: 'PAID', icon: <CheckCircle className="w-4 h-4" /> },
    { label: 'Mark Overdue', next: 'OVERDUE', icon: <AlertCircle className="w-4 h-4" /> },
  ],
  PAID: [],
  OVERDUE: [{ label: 'Mark as Paid', next: 'PAID', icon: <CheckCircle className="w-4 h-4" /> }],
};

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    api.get<Invoice>(`/invoices/${id}`)
      .then(setInvoice)
      .catch(() => router.push('/invoices'))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleStatusChange = async (nextStatus: InvoiceStatus) => {
    if (!invoice) return;
    setUpdating(true);
    try {
      const updated = await api.patch<Invoice>(`/invoices/${invoice.id}/status`, { status: nextStatus });
      setInvoice(updated);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!invoice) return;
    if (!confirm('Delete this invoice permanently?')) return;
    try {
      await api.delete(`/invoices/${invoice.id}`);
      router.push('/invoices');
    } catch (e: any) {
      alert(e.message);
    }
  };

  if (loading) return <div className="p-8 flex justify-center items-center h-64"><div className="animate-spin w-8 h-8 border-2 border-secondary border-t-transparent rounded-full" /></div>;
  if (!invoice) return null;

  const actions = STATUS_ACTIONS[invoice.status] ?? [];

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/invoices" className="p-2 rounded-lg hover:bg-surface-high text-on-surface-variant hover:text-on-surface transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-headline-lg text-on-surface font-mono">{invoice.invoiceNumber}</h1>
            <InvoiceStatusBadge status={invoice.status} />
          </div>
          <div className="flex items-center gap-1 text-body-md text-on-surface-variant mt-0.5">
            <Link href="/invoices" className="hover:text-secondary">Invoices</Link>
            <span>›</span>
            <span>{invoice.invoiceNumber}</span>
          </div>
        </div>
        <div className="ml-auto flex gap-3">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Link href={`/invoices/${invoice.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </Link>
          {actions.map(({ label, next, icon }) => (
            <Button key={next} size="sm" onClick={() => handleStatusChange(next)} loading={updating}>
              {icon}
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Invoice Content */}
        <div className="col-span-2 space-y-5">
          {/* Customer & Dates */}
          <Card>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-label-md text-on-surface-variant uppercase mb-3">Bill To</p>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={invoice.customer.name} size="md" />
                  <div>
                    <p className="text-body-md font-semibold text-on-surface">{invoice.customer.name}</p>
                    <p className="text-label-md text-on-surface-variant">{invoice.customer.company}</p>
                  </div>
                </div>
                <div className="text-body-md text-on-surface-variant space-y-1">
                  <p>{invoice.customer.email}</p>
                  {invoice.customer.phone && <p>{invoice.customer.phone}</p>}
                  {invoice.customer.address && <p className="text-sm">{invoice.customer.address}</p>}
                </div>
              </div>
              <div>
                <p className="text-label-md text-on-surface-variant uppercase mb-3">Invoice Info</p>
                <div className="flex flex-col gap-2 text-body-md">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Invoice #</span>
                    <span className="font-mono text-on-surface">{invoice.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Issue Date</span>
                    <span className="text-on-surface">{formatDate(invoice.issueDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Due Date</span>
                    <span className={invoice.status === 'OVERDUE' ? 'text-status-overdue font-medium' : 'text-on-surface'}>
                      {formatDate(invoice.dueDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Status</span>
                    <InvoiceStatusBadge status={invoice.status} />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Line Items */}
          <Card padding="none">
            <div className="px-6 py-4 border-b border-outline-variant">
              <h3 className="text-headline-sm text-on-surface">Line Items</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="px-6 py-3 text-left text-label-md text-on-surface-variant">DESCRIPTION</th>
                  <th className="px-6 py-3 text-right text-label-md text-on-surface-variant">QTY</th>
                  <th className="px-6 py-3 text-right text-label-md text-on-surface-variant">UNIT PRICE</th>
                  <th className="px-6 py-3 text-right text-label-md text-on-surface-variant">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, i) => (
                  <tr key={i} className="border-b border-outline-variant last:border-0">
                    <td className="px-6 py-3.5 text-body-md text-on-surface">{item.description}</td>
                    <td className="px-6 py-3.5 text-body-md text-on-surface-variant text-right">{item.quantity}</td>
                    <td className="px-6 py-3.5 font-mono text-data-mono text-on-surface-variant text-right">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-data-mono text-on-surface text-right">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-4 border-t border-outline-variant flex justify-end">
              <div className="w-52 flex flex-col gap-2">
                <div className="flex justify-between text-body-md text-on-surface-variant">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatCurrency(invoice.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-body-md text-on-surface-variant">
                  <span>Tax (0%)</span>
                  <span className="font-mono">{formatCurrency(0)}</span>
                </div>
                <div className="flex justify-between text-headline-sm text-on-surface border-t border-outline-variant pt-2">
                  <span>Total</span>
                  <span className="font-mono">{formatCurrency(invoice.totalAmount)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Notes */}
          {invoice.notes && (
            <Card>
              <p className="text-label-md text-on-surface-variant uppercase mb-2">Notes</p>
              <p className="text-body-md text-on-surface">{invoice.notes}</p>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <p className="text-label-md text-on-surface-variant uppercase mb-3">Total Amount</p>
            <p className="text-headline-lg font-mono text-on-surface">{formatCurrency(invoice.totalAmount)}</p>
            <p className="text-label-md text-on-surface-variant mt-1">Due {formatDate(invoice.dueDate)}</p>
          </Card>

          <Card>
            <p className="text-label-md text-on-surface-variant uppercase mb-3">Customer</p>
            <Link href={`/customers/${invoice.customer.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Avatar name={invoice.customer.name} />
              <div>
                <p className="text-body-md font-medium text-on-surface">{invoice.customer.name}</p>
                <p className="text-label-md text-on-surface-variant">{invoice.customer.company}</p>
              </div>
            </Link>
          </Card>

          <Card>
            <p className="text-label-md text-on-surface-variant uppercase mb-3">Actions</p>
            <div className="flex flex-col gap-2">
              {actions.map(({ label, next, icon }) => (
                <Button
                  key={next}
                  variant={next === 'PAID' ? 'secondary' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => handleStatusChange(next)}
                  loading={updating}
                >
                  {icon}
                  {label}
                </Button>
              ))}
              <Link href={`/invoices/${invoice.id}/edit`}>
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="w-4 h-4" />
                  Edit Invoice
                </Button>
              </Link>
              <Button
                variant="danger"
                className="w-full justify-start"
                onClick={handleDelete}
              >
                Delete Invoice
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
