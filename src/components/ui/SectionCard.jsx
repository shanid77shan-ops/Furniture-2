import { motion } from 'framer-motion'

export default function SectionCard({ icon: Icon, title, description, accent = 'indigo', children }) {
  const accents = {
    indigo: 'bg-indigo-50 text-indigo-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    violet: 'bg-violet-50 text-violet-600',
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6"
    >
      <div className="mb-5 flex items-start gap-3">
        {Icon && (
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accents[accent]}`}>
            <Icon size={20} />
          </span>
        )}
        <div>
          <h2 className="text-base font-semibold text-slate-800">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
        </div>
      </div>
      {children}
    </motion.section>
  )
}
