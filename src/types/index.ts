export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  totalBilled?: number;
  _count?: { invoices: number };
  invoices?: Invoice[];
}

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE';

export interface InvoiceItem {
  id?: string;
  invoiceId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customer: Customer;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  notes?: string;
  items: InvoiceItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DashboardSummary {
  totalRevenue: number;
  revenueGrowth: number;
  pendingInvoices: number;
  overdueInvoices: number;
  activeCustomers: number;
  newCustomersThisWeek: number;
  monthlyRevenue: { month: string; actual: number; target: number }[];
  recentInvoices: Invoice[];
}

export interface InvoiceStats {
  counts: { draft: number; sent: number; paid: number; overdue: number };
  totalOutstanding: number;
  totalPaid: number;
  overdueBalance: number;
}
