import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn.js';

export function Modal({ open, onClose, title, description, children, className }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            className={cn(
              'relative z-10 w-full max-w-lg rounded-3xl border border-slate-100 bg-white p-6 shadow-card dark:border-white/10 dark:bg-brand-800',
              className,
            )}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                {title && <h2 className="font-display text-xl font-bold">{title}</h2>}
                {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
              </div>
              <button onClick={onClose} className="btn-ghost -mr-2 -mt-2 p-2" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
