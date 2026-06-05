'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, total, limit, onPageChange }: PaginationProps) {
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const pages = buildPageList(page, totalPages);

  return (
    <div className="flex items-center justify-between px-1 py-3">
      <p className="text-body-md text-on-surface-variant">
        Showing {start} to {end} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded hover:bg-surface-high disabled:opacity-40 disabled:cursor-not-allowed text-on-surface-variant"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-1 text-on-surface-variant">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(Number(p))}
              className={cn(
                'w-8 h-8 rounded text-body-md font-medium transition-colors',
                page === p
                  ? 'bg-secondary text-white'
                  : 'hover:bg-surface-high text-on-surface-variant',
              )}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="p-1.5 rounded hover:bg-surface-high disabled:opacity-40 disabled:cursor-not-allowed text-on-surface-variant"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function buildPageList(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | '...')[] = [1];
  if (current > 3) pages.push('...');
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push('...');
  pages.push(total);
  return pages;
}
