import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

export default function Toast({ message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className="no-print fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ type: 'spring', damping: 24, stiffness: 300 }}
        >
          <div className="flex items-center gap-2.5 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white shadow-2xl">
            <CheckCircle2 size={18} />
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
