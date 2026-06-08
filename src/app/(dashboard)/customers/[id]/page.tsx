'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Building2, MapPin, FileText } from 'lucide-react';
import { api } from '@/lib/api';
import { Customer } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { InvoiceStatusBadge, CustomerStatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Customer>(`/customers/${id}`)
      .then(setCustomer)
      .catch(() => router.push('/customers'))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) return <div className="p-8 flex justify-center items-center h-64"><div className="animate-spin w-8 h-8 border-2 border-secondary border-t-transparent rounded-full" /></div>;
  if (!customer) return null;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/customers" className="p-2 rounded-lg hover:bg-surface-high text-on-surface-variant hover:text-on-surface transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-headline-lg text-on-surface">{customer.name}</h1>
          <p className="text-body-md text-on-surface-variant">{customer.company}</p>
        </div>
        <div className="ml-auto flex gap-3">
          <CustomerStatusBadge status={customer.status} />
          <Button variant="outline" size="sm">Edit Customer</Button>
          <Link href={`/invoices/create?customerId=${customer.id}`}>
            <Button size="sm">
              <FileText className="w-4 h-4" />
              Create Invoice
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Profile */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Avatar name={customer.name} size="lg" />
            <div>
              <p className="text-headline-sm text-on-surface">{customer.name}</p>
              <p className="text-body-md text-on-surface-variant">{customer.company}</p>
            </div>
          </div>
          <hr className="border-outline-variant" />
          <div className="flex flex-col gap-3 text-body-md text-on-surface-variant">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 shrink-0 text-secondary" />
              <a href={`mailto:${customer.email}`} className="hover:text-secondary">{customer.email}</a>
            </div>
            {customer.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-secondary" />
                <span>{customer.phone}</span>
              </div>
            )}
            {customer.company && (
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 shrink-0 text-secondary" />
                <span>{customer.company}</span>
              </div>
            )}
            {customer.address && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-secondary" />
                <span>{customer.address}</span>
              </div>
            )}
          </div>
          <hr className="border-outline-variant" />
          <div className="text-label-md text-on-surface-variant">
            Customer since {formatDate(customer.createdAt)}
          </div>
        </Card>

        {/* Invoices */}
        <div className="col-span-2 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <p className="text-label-md text-on-surface-variant uppercase mb-2">Total Billed</p>
              <p className="text-headline-sm font-mono text-on-surface">{formatCurrency(customer.totalBilled ?? 0)}</p>
            </Card>
            <Card>
              <p className="text-label-md text-on-surface-variant uppercase mb-2">Total Invoices</p>
              <p className="text-headline-sm text-on-surface">{customer.invoices?.length ?? 0}</p>
            </Card>
            <Card>
              <p className="text-label-md text-on-surface-variant uppercase mb-2">Outstanding</p>
              <p className="text-headline-sm font-mono text-on-surface">
                {formatCurrency(
                  (customer.invoices ?? [])
                    .filter((i) => i.status !== 'PAID')
                    .reduce((s, i) => s + i.totalAmount, 0),
                )}
              </p>
            </Card>
          </div>

          <Card padding="none">
            <div className="px-5 py-4 border-b border-outline-variant">
              <h3 className="text-headline-sm text-on-surface">Invoice History</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant">
                  {['INVOICE #', 'DATE', 'DUE DATE', 'AMOUNT', 'STATUS'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-label-md text-on-surface-variant">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(customer.invoices ?? []).map((inv) => (
                  <tr key={inv.id} className="border-b border-outline-variant last:border-0 hover:bg-surface-low">
                    <td className="px-5 py-3">
                      <Link href={`/invoices/${inv.id}`} className="font-mono text-data-mono text-secondary hover:underline">
                        {inv.invoiceNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-body-md text-on-surface-variant">{formatDate(inv.issueDate)}</td>
                    <td className="px-5 py-3 text-body-md text-on-surface-variant">{formatDate(inv.dueDate)}</td>
                    <td className="px-5 py-3 font-mono text-data-mono text-on-surface">{formatCurrency(inv.totalAmount)}</td>
                    <td className="px-5 py-3"><InvoiceStatusBadge status={inv.status} /></td>
                  </tr>
                ))}
                {(customer.invoices ?? []).length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-body-md text-on-surface-variant">
                      No invoices yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  );
}
