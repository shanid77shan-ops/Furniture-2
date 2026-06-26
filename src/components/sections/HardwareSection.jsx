import { useMemo, useState } from 'react'
import { Wrench, Settings2, Tag, Ban, AlertTriangle, Search, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import SectionCard from '../ui/SectionCard'
import { formatCurrency } from '../../utils/format'

const num = (v) => {
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : 0
}

const effectivePrice = (entry, catalogPrice) =>
  entry.unitPrice !== undefined && entry.unitPrice !== '' ? num(entry.unitPrice) : num(catalogPrice)

function HardwareRow({ type, entry, setHardwareEntry }) {
  const quantity = entry.quantity ?? ''
  const unused = !!entry.unused
  const hasManualPrice = entry.unitPrice !== undefined && entry.unitPrice !== ''
  const displayAmount = hasManualPrice ? entry.unitPrice : type.price || ''
  const price = effectivePrice(entry, type.price)
  const lineTotal = unused ? 0 : num(quantity) * price
  const missing = !unused && num(quantity) <= 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className={`grid grid-cols-12 items-center gap-2 rounded-lg px-2 py-2 transition sm:gap-3 ${
        unused ? 'bg-slate-50 opacity-60' : missing ? 'bg-amber-50/40' : 'bg-white'
      }`}
    >
      <div className="col-span-12 sm:col-span-4">
        <p className={`text-sm font-medium ${unused ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
          {type.name}
        </p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-400">
          {type.brand && (
            <span className="inline-flex items-center gap-1">
              <Tag size={11} /> {type.brand}
            </span>
          )}
          {num(type.price) > 0 && <span>· catalog {formatCurrency(type.price)}</span>}
        </div>
      </div>

      <div className="col-span-3 sm:col-span-2">
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

      <div className="col-span-4 sm:col-span-2">
        <div
          className={`flex items-center rounded-lg border bg-white transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 ${
            unused ? 'border-slate-200 bg-slate-100' : 'border-slate-300'
          }`}
        >
          <span className="select-none pl-2 text-sm text-slate-400">₹</span>
          <input
            type="number"
            min="0"
            step="any"
            placeholder="Amount"
            value={displayAmount}
            disabled={unused}
            onChange={(e) => setHardwareEntry(type.id, { unitPrice: e.target.value })}
            className="w-full bg-transparent px-2 py-2 text-right text-sm outline-none disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <div className="col-span-5 text-right text-sm font-semibold text-slate-700 sm:col-span-2">
        {formatCurrency(lineTotal)}
      </div>

      <div className="col-span-12 flex justify-end sm:col-span-2">
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
                ...(e.target.checked ? { quantity: '', unitPrice: '' } : {}),
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
  setCategoryEnabled,
  onManageCatalog,
}) {
  const entries = state.hardwareEntries || {}
  const enabled = state.enabledCategories || {}
  const missingCount = calc.missingHardware.length
  const enabledCount = Object.values(enabled).filter(Boolean).length
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCatalog = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return catalog

    return catalog.filter((category) => {
      if (category.name.toLowerCase().includes(q)) return true
      return category.types.some(
        (type) =>
          type.name.toLowerCase().includes(q) ||
          (type.brand && type.brand.toLowerCase().includes(q)),
      )
    })
  }, [catalog, searchQuery])

  const isSearching = searchQuery.trim().length > 0

  return (
    <SectionCard
      icon={Wrench}
      accent="amber"
      title="Hardware & Accessories"
      description="Search or tick a main item to show its types, then enter quantity and amount."
    >
      <div className="relative mb-4">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search main items (e.g. hinges, handles, channels)…"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isSearching && (
        <p className="mb-3 text-xs text-slate-500">
          {filteredCatalog.length} main item{filteredCatalog.length !== 1 ? 's' : ''} matching
          &ldquo;{searchQuery.trim()}&rdquo;
        </p>
      )}
      <div className="mb-1 hidden grid-cols-12 gap-3 px-2 text-xs font-medium uppercase tracking-wide text-slate-400 sm:grid">
        <span className="col-span-4">Main item</span>
        <span className="col-span-2 text-center">Qty</span>
        <span className="col-span-2 text-right">Amount</span>
        <span className="col-span-2 text-right">Total</span>
        <span className="col-span-2 text-right">Skip</span>
      </div>

      <div className="space-y-3">
        {filteredCatalog.map((category) => {
          const isEnabled = !!enabled[category.id]
          return (
            <div
              key={category.id}
              className={`rounded-xl border transition ${
                isEnabled ? 'border-amber-200 bg-amber-50/30' : 'border-slate-200 bg-white'
              }`}
            >
              <label className="flex cursor-pointer items-center gap-3 px-3 py-3">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={(e) => setCategoryEnabled(category.id, e.target.checked)}
                  className="h-4 w-4 shrink-0 accent-amber-600"
                />
                <span className="text-sm font-semibold uppercase tracking-wide text-amber-700">
                  {category.name}
                </span>
                <span className="ml-auto text-xs text-slate-400">
                  {category.types.length} type{category.types.length !== 1 ? 's' : ''}
                </span>
              </label>

              <AnimatePresence initial={false}>
                {isEnabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden border-t border-amber-100"
                  >
                    <div className="space-y-1 px-2 py-2">
                      {category.types.length === 0 ? (
                        <p className="rounded-lg bg-white px-3 py-2 text-center text-xs text-slate-400">
                          No types yet — add some in “Manage Catalog”.
                        </p>
                      ) : (
                        category.types.map((type) => (
                          <HardwareRow
                            key={type.id}
                            type={type}
                            entry={entries[type.id] || {}}
                            setHardwareEntry={setHardwareEntry}
                          />
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}

        {filteredCatalog.length === 0 && catalog.length > 0 && isSearching && (
          <p className="rounded-lg bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">
            No main items match your search. Try a different keyword.
          </p>
        )}

        {catalog.length === 0 && (
          <p className="rounded-lg bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">
            No hardware items yet. Use “Manage Catalog” to add some.
          </p>
        )}
      </div>

      {enabledCount === 0 && catalog.length > 0 && (
        <div className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
          Tick the main items you need for this estimate to show their types.
        </div>
      )}

      {missingCount > 0 && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <span>
            {missingCount} item{missingCount > 1 ? 's need' : ' needs'} a quantity or{' '}
            <strong>Unused</strong> tick in the enabled sections above.
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
