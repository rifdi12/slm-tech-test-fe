'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, Filter, Download, UserPlus, Eye, Pencil, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { Customer, PaginatedResponse } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CustomerStatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Pagination } from '@/components/ui/Pagination';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  status: string;
}

const emptyForm: CustomerFormData = {
  name: '', email: '', phone: '', company: '', address: '', status: 'ACTIVE',
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState<CustomerFormData>(emptyForm);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      if (search) params.set('search', search);
      const res = await api.get<PaginatedResponse<Customer>>(`/customers?${params}`);
      setCustomers(res.data);
      setMeta(res.meta);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (c: Customer) => {
    setEditing(c);
    setForm({ name: c.name, email: c.email, phone: c.phone ?? '', company: c.company ?? '', address: c.address ?? '', status: c.status });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    setFormLoading(true);
    setFormError('');
    try {
      const body = { ...form };
      if (editing) {
        await api.patch(`/customers/${editing.id}`, body);
      } else {
        await api.post('/customers', body);
      }
      setModalOpen(false);
      load();
    } catch (e: any) {
      setFormError(e.message || 'Something went wrong');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this customer? All associated invoices will also be removed.')) return;
    try {
      await api.delete(`/customers/${id}`);
      load();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const setField = (field: keyof CustomerFormData, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-headline-lg text-on-surface">Customers</h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            Manage and track your enterprise customer relations and billing status.
          </p>
        </div>
        <Button onClick={openCreate}>
          <UserPlus className="w-4 h-4" />
          Add Customer
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: meta.total, sub: '+12.5%', pos: true },
          { label: 'Active Contracts', value: customers.filter((c) => c.status === 'ACTIVE').length, sub: 'Last 30 days', pos: true },
          { label: 'Total Revenue', value: formatCurrency(customers.reduce((s, c) => s + (c.totalBilled ?? 0), 0)), sub: '+8.1%', pos: true },
          { label: 'Avg. LTV', value: formatCurrency(customers.length ? customers.reduce((s, c) => s + (c.totalBilled ?? 0), 0) / customers.length : 0), sub: '-2.4%', pos: false },
        ].map(({ label, value, sub, pos }) => (
          <Card key={label}>
            <p className="text-label-md text-on-surface-variant uppercase tracking-wider mb-2">{label}</p>
            <p className="text-headline-md text-on-surface">{value}</p>
            <p className={`text-label-md mt-1 flex items-center gap-1 ${pos ? 'text-status-paid' : 'text-status-overdue'}`}>
              <span>{pos ? '↑' : '↓'}</span>{sub}
            </p>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card padding="none">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Filter by name, email, or company..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-outline-variant text-body-md text-on-surface bg-surface-low placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
            />
          </div>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin w-7 h-7 border-2 border-secondary border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant">
                  {['NAME', 'EMAIL', 'PHONE', 'COMPANY', 'TOTAL BILLED', 'STATUS', 'ACTIONS'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-label-md text-on-surface-variant">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-outline-variant last:border-0 hover:bg-surface-low transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={customer.name} size="sm" />
                        <span className="text-body-md font-semibold text-on-surface">{customer.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-body-md text-on-surface-variant">{customer.email}</td>
                    <td className="px-5 py-3.5 text-body-md text-on-surface-variant">{customer.phone ?? '—'}</td>
                    <td className="px-5 py-3.5 text-body-md text-on-surface-variant">{customer.company ?? '—'}</td>
                    <td className="px-5 py-3.5 font-mono text-data-mono text-on-surface">
                      {formatCurrency(customer.totalBilled ?? 0)}
                    </td>
                    <td className="px-5 py-3.5">
                      <CustomerStatusBadge status={customer.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/customers/${customer.id}`}
                          className="p-1.5 rounded hover:bg-surface-high text-on-surface-variant hover:text-secondary transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => openEdit(customer)}
                          className="p-1.5 rounded hover:bg-surface-high text-on-surface-variant hover:text-on-surface transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id)}
                          className="p-1.5 rounded hover:bg-red-50 text-on-surface-variant hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Customer' : 'Add New Customer'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} loading={formLoading}>
              {editing ? 'Save Changes' : 'Add Customer'}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          {formError && (
            <div className="px-3 py-2.5 rounded-lg bg-red-50 border border-red-200 text-body-md text-red-600">
              {formError}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name" value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="Jane Doe" required />
            <Input label="Email Address" type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} placeholder="jane@company.com" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone" value={form.phone} onChange={(e) => setField('phone', e.target.value)} placeholder="+1 (555) 000-0000" />
            <Input label="Company" value={form.company} onChange={(e) => setField('company', e.target.value)} placeholder="Acme Corp" />
          </div>
          <Input label="Address" value={form.address} onChange={(e) => setField('address', e.target.value)} placeholder="123 Main St, City, State" />
          <Select label="Status" value={form.status} onChange={(e) => setField('status', e.target.value)}>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </Select>
        </div>
      </Modal>
    </div>
  );
}
