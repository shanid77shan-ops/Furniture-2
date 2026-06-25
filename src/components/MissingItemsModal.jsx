import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, X, Ban, Printer } from 'lucide-react'

export default function MissingItemsModal({
  open,
  items = [],
  onClose,
  onMarkUnusedAndPrint,
  onPrintAnyway,
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="no-print fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            initial={{ y: 30, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.97 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <AlertTriangle size={20} />
              </span>
              <div className="flex-1">
                <h2 className="text-base font-semibold text-slate-800">Some items are not added</h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  These hardware items have no quantity and aren’t marked “Unused”.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* List */}
            <div className="max-h-64 overflow-y-auto px-5 py-3">
              <ul className="divide-y divide-slate-100">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-2 py-2">
                    <span className="text-sm font-medium text-slate-700">{item.name}</span>
                    <span className="text-xs text-slate-400">
                      {item.categoryName}
                      {item.brand ? ` · ${item.brand}` : ''}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-2 border-t border-slate-100 bg-slate-50 px-5 py-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Go Back & Review
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onMarkUnusedAndPrint}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                >
                  <Ban size={15} /> Mark all Unused & Print
                </button>
                <button
                  type="button"
                  onClick={onPrintAnyway}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                >
                  <Printer size={15} /> Print Anyway
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
