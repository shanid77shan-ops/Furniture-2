import { AnimatePresence, motion } from 'framer-motion'
import { X, FileText, Trash2, FolderOpen, Loader2, Inbox } from 'lucide-react'
import { formatCurrency } from '../utils/format'

export default function InvoicesModal({ open, onClose, invoices, loading, onLoad, onDelete }) {
  const fmtDate = (d) =>
    new Date(d).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="no-print fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl bg-slate-50 shadow-2xl sm:rounded-2xl"
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
                  <FileText size={18} />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-slate-800">Saved Invoices</h2>
                  <p className="text-xs text-slate-500">Load a past quotation or remove it.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-400">
                  <Loader2 size={18} className="animate-spin" /> Loading…
                </div>
              ) : invoices.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-12 text-center text-sm text-slate-400">
                  <Inbox size={28} />
                  No saved invoices yet.
                </div>
              ) : (
                <ul className="space-y-2">
                  {invoices.map((inv) => (
                    <li
                      key={inv.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {inv.quote_number || 'Quotation'}
                          {inv.project_name ? ` · ${inv.project_name}` : ''}
                        </p>
                        <p className="truncate text-xs text-slate-400">
                          {inv.client_name ? `${inv.client_name} · ` : ''}
                          {fmtDate(inv.created_at)}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-sm font-bold text-slate-700">
                          {formatCurrency(Number(inv.grand_total) || 0)}
                        </span>
                        <button
                          type="button"
                          onClick={() => onLoad(inv.id)}
                          title="Load into form"
                          className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-medium text-indigo-600 transition hover:bg-indigo-100"
                        >
                          <FolderOpen size={14} /> Load
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(inv.id)}
                          title="Delete invoice"
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
