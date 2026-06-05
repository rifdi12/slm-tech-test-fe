'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { Customer, InvoiceItem } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';

interface LineItem extends Omit<InvoiceItem, 'id' | 'invoiceId'> {}

const emptyItem = (): LineItem => ({
  description: '',
  quantity: 1,
  unitPrice: 0,
  amount: 0,
});

function CreateInvoiceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState(searchParams.get('customerId') ?? '');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().slice(0, 10);
  });
  const [status, setStatus] = useState('DRAFT');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<LineItem[]>([emptyItem()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<{ data: Customer[] }>('/customers?limit=100')
      .then((res) => setCustomers(res.data))
      .catch(console.error);
  }, []);

  const updateItem = (index: number, field: keyof LineItem, value: string | number) => {
    setItems((prev) => {
      const next = [...prev];
      const item = { ...next[index], [field]: value };
      item.amount = Number(item.quantity) * Number(item.unitPrice);
      next[index] = item;
      return next;
    });
  };

  const addItem = () => setItems((p) => [...p, emptyItem()]);
  const removeItem = (i: number) => setItems((p) => p.filter((_, idx) => idx !== i));

  const subtotal = items.reduce((s, i) => s + i.amount, 0);
  const tax = 0;
  const total = subtotal + tax;

  const handleSubmit = async (submitStatus = status) => {
    if (!customerId) { setError('Please select a customer'); return; }
    if (items.some((i) => !i.description)) { setError('All line items must have a description'); return; }
    setError('');
    setLoading(true);
    try {
      const invoice = await api.post<{ id: string }>('/invoices', {
        customerId,
        issueDate,
        dueDate,
        status: submitStatus,
        notes: notes || undefined,
        items: items.map(({ description, quantity, unitPrice }) => ({
          description,
          quantity: Number(quantity),
          unitPrice: Number(unitPrice),
        })),
      });
      router.push(`/invoices/${invoice.id}`);
    } catch (e: any) {
      setError(e.message || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/invoices" className="p-2 rounded-lg hover:bg-surface-high text-on-surface-variant hover:text-on-surface transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-headline-lg text-on-surface">Create Invoice</h1>
          <div className="flex items-center gap-1 text-body-md text-on-surface-variant mt-0.5">
            <Link href="/invoices" className="hover:text-secondary">Invoices</Link>
            <span>›</span>
            <span>New Invoice</span>
          </div>
        </div>
        <div className="ml-auto flex gap-3">
          <Button variant="ghost" onClick={() => router.push('/invoices')}>Cancel</Button>
          <Button variant="outline" onClick={() => handleSubmit('DRAFT')} loading={loading}>
            Save as Draft
          </Button>
          <Button onClick={() => handleSubmit('SENT')} loading={loading}>
            Send Invoice
          </Button>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-body-md text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Invoice Details */}
        <div className="col-span-2 space-y-5">
          {/* Basic Info */}
          <Card>
            <h2 className="text-headline-sm text-on-surface mb-4">Invoice Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Customer *"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              >
                <option value="">Select a customer...</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.company ? `— ${c.company}` : ''}
                  </option>
                ))}
              </Select>
              <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="DRAFT">Draft</option>
                <option value="SENT">Sent</option>
                <option value="PAID">Paid</option>
                <option value="OVERDUE">Overdue</option>
              </Select>
              <Input
                label="Issue Date *"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
              />
              <Input
                label="Due Date *"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </Card>

          {/* Line Items */}
          <Card>
            <h2 className="text-headline-sm text-on-surface mb-4">Line Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant">
                    <th className="pb-3 text-left text-label-md text-on-surface-variant w-[40%]">DESCRIPTION</th>
                    <th className="pb-3 text-right text-label-md text-on-surface-variant w-[15%]">QTY</th>
                    <th className="pb-3 text-right text-label-md text-on-surface-variant w-[20%]">UNIT PRICE</th>
                    <th className="pb-3 text-right text-label-md text-on-surface-variant w-[20%]">AMOUNT</th>
                    <th className="pb-3 w-[5%]" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i} className="border-b border-outline-variant last:border-0">
                      <td className="py-2 pr-3">
                        <input
                          value={item.description}
                          onChange={(e) => updateItem(i, 'description', e.target.value)}
                          placeholder="Service or product description"
                          className="w-full px-3 py-2 rounded border border-outline-variant text-body-md text-on-surface bg-surface-lowest focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 placeholder:text-outline"
                        />
                      </td>
                      <td className="py-2 pr-3">
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={item.quantity}
                          onChange={(e) => updateItem(i, 'quantity', e.target.value)}
                          className="w-full px-3 py-2 rounded border border-outline-variant text-body-md text-on-surface text-right bg-surface-lowest focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                        />
                      </td>
                      <td className="py-2 pr-3">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(i, 'unitPrice', e.target.value)}
                          className="w-full px-3 py-2 rounded border border-outline-variant text-body-md text-on-surface text-right bg-surface-lowest focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                        />
                      </td>
                      <td className="py-2 pr-3 text-right font-mono text-data-mono text-on-surface whitespace-nowrap">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="py-2">
                        <button
                          onClick={() => removeItem(i)}
                          disabled={items.length === 1}
                          className="p-1.5 rounded hover:bg-red-50 text-on-surface-variant hover:text-red-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={addItem}
              className="mt-4 flex items-center gap-2 text-body-md text-secondary hover:text-teal-700 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Line Item
            </button>

            {/* Totals */}
            <div className="mt-5 pt-4 border-t border-outline-variant flex flex-col items-end gap-2">
              <div className="flex justify-between w-48 text-body-md text-on-surface-variant">
                <span>Subtotal</span>
                <span className="font-mono">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between w-48 text-body-md text-on-surface-variant">
                <span>Tax (0%)</span>
                <span className="font-mono">{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between w-48 text-headline-sm text-on-surface border-t border-outline-variant pt-2 mt-1">
                <span>Total</span>
                <span className="font-mono">{formatCurrency(total)}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Notes */}
        <div className="space-y-5">
          <Card>
            <Textarea
              label="Notes / Payment Terms"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Payment due within 14 days. Thank you for your business."
              rows={5}
            />
          </Card>

          <Card>
            <h3 className="text-body-md font-semibold text-on-surface mb-3">Invoice Summary</h3>
            <div className="flex flex-col gap-2 text-body-md text-on-surface-variant">
              <div className="flex justify-between">
                <span>Items</span>
                <span className="text-on-surface font-medium">{items.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-on-surface">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between font-semibold text-on-surface border-t border-outline-variant pt-2">
                <span>Total Due</span>
                <span className="font-mono">{formatCurrency(total)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CreateInvoicePage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-40"><div className="animate-spin w-7 h-7 border-2 border-secondary border-t-transparent rounded-full" /></div>}>
      <CreateInvoiceContent />
    </Suspense>
  );
}
