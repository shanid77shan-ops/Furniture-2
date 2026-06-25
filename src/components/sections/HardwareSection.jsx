import { Wrench, Settings2, Tag, Ban, AlertTriangle } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import SectionCard from '../ui/SectionCard'
import { formatCurrency } from '../../utils/format'

const num = (v) => {
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : 0
}

function HardwareRow({ category, type, entry, setHardwareEntry }) {
  const quantity = entry.quantity ?? ''
  const unused = !!entry.unused
  const lineTotal = unused ? 0 : num(quantity) * num(type.price)
  const missing = !unused && num(quantity) <= 0

  return (
    <motion.div
      layout
      className={`grid grid-cols-12 items-center gap-2 rounded-lg px-2 py-2 transition sm:gap-3 ${
        unused ? 'bg-slate-50 opacity-60' : missing ? 'bg-amber-50/40' : 'bg-white'
      }`}
    >
      {/* Item */}
      <div className="col-span-12 sm:col-span-5">
        <p className={`text-sm font-medium ${unused ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
          {type.name}
        </p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-400">
          {type.brand && (
            <span className="inline-flex items-center gap-1">
              <Tag size={11} /> {type.brand}
            </span>
          )}
          <span>· {formatCurrency(type.price)}/unit</span>
        </div>
      </div>

      {/* Qty */}
      <div className="col-span-4 sm:col-span-2">
        <input
          type="number"
          min="0"
          placeholder="Qty"
          value={quantity}
          disabled={unused}
          onChange={(e) => setHardwareEntry(type.id, { quantity: e.target.value })}
          className={`w-full rounded-lg border px-3 py-2 text-center text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100 ${
            missing ? 'border-amber-300 bg-amber-50/50' : 'border-slate-300 bg-white'
          }`}
        />
      </div>

      {/* Line total */}
      <div className="col-span-4 text-right text-sm font-semibold text-slate-700 sm:col-span-2">
        {formatCurrency(lineTotal)}
      </div>

      {/* Unused tick */}
      <div className="col-span-4 flex justify-end sm:col-span-3">
        <label
          className={`inline-flex cursor-pointer select-none items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
            unused
              ? 'border-slate-300 bg-slate-200 text-slate-600'
              : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:text-slate-600'
          }`}
        >
          <input
            type="checkbox"
            checked={unused}
            onChange={(e) =>
              setHardwareEntry(type.id, {
                unused: e.target.checked,
                ...(e.target.checked ? { quantity: '' } : {}),
              })
            }
            className="h-3.5 w-3.5 accent-slate-500"
          />
          <Ban size={12} /> Unused
        </label>
      </div>
    </motion.div>
  )
}

export default function HardwareSection({
  state,
  calc,
  catalog,
  setHardwareEntry,
  onManageCatalog,
}) {
  const entries = state.hardwareEntries || {}
  const missingCount = calc.missingHardware.length

  return (
    <SectionCard
      icon={Wrench}
      accent="amber"
      title="Hardware & Accessories"
      description="Every catalog item is listed. Enter a quantity, or tick “Unused” to skip it."
    >
      {/* Column headers (desktop) */}
      <div className="mb-1 hidden grid-cols-12 gap-3 px-2 text-xs font-medium uppercase tracking-wide text-slate-400 sm:grid">
        <span className="col-span-5">Item</span>
        <span className="col-span-2 text-center">Qty</span>
        <span className="col-span-2 text-right">Total</span>
        <span className="col-span-3 text-right">Skip</span>
      </div>

      <div className="space-y-4">
        {catalog.map((category) => (
          <div key={category.id}>
            <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-amber-600">
              {category.name}
            </p>
            <div className="space-y-1">
              <AnimatePresence initial={false}>
                {category.types.map((type) => (
                  <HardwareRow
                    key={type.id}
                    category={category}
                    type={type}
                    entry={entries[type.id] || {}}
                    setHardwareEntry={setHardwareEntry}
                  />
                ))}
              </AnimatePresence>
              {category.types.length === 0 && (
                <p className="rounded-lg bg-slate-50 px-3 py-2 text-center text-xs text-slate-400">
                  No types in this item yet — add some in “Manage Catalog”.
                </p>
              )}
            </div>
          </div>
        ))}

        {catalog.length === 0 && (
          <p className="rounded-lg bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">
            No hardware items yet. Use “Manage Catalog” to add some.
          </p>
        )}
      </div>

      {/* Hint about un-filled items */}
      {missingCount > 0 && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <span>
            {missingCount} item{missingCount > 1 ? 's have' : ' has'} no quantity yet. Add a quantity
            or tick <strong>Unused</strong> before generating the invoice.
          </span>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onManageCatalog}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          <Settings2 size={16} /> Manage Catalog
        </button>
        <div className="text-right">
          <p className="text-xs text-slate-400">Hardware Subtotal</p>
          <p className="text-sm font-semibold text-amber-600">
            {formatCurrency(calc.hardwareCost)}
          </p>
        </div>
      </div>
    </SectionCard>
  )
}
