'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}

export function Modal({ open, onClose, title, children, className, footer }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        className={cn(
          'bg-surface-lowest rounded-xl shadow-modal w-full max-h-[90vh] flex flex-col',
          className ?? 'max-w-lg',
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
          <h2 className="text-headline-sm text-on-surface">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-surface-high text-outline hover:text-on-surface transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin">
          {children}
        </div>

        {footer && (
          <div className="px-6 py-4 border-t border-outline-variant flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
