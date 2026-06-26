import { motion } from 'framer-motion'
import { Receipt, Printer, RotateCcw, Save, Loader2 } from 'lucide-react'
import { formatCurrency, formatNumber } from '../utils/format'

const COMPANY = {
  name: 'Inspire Furnitures',
  tagline: 'Particle Board Furniture Manufacturing',
  contact: 'hello@inspirefurnitures.example  •  +91 98765 43210',
}

function Row({ label, value, sub, strong }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <span className={`text-sm ${strong ? 'font-semibold text-slate-700' : 'text-slate-500'}`}>
        {label}
        {sub && <span className="ml-1 text-xs text-slate-400">{sub}</span>}
      </span>
      <span className={`tabular-nums text-sm ${strong ? 'font-semibold text-slate-800' : 'text-slate-700'}`}>
        {value}
      </span>
    </div>
  )
}

export default function QuotationSummary({
  state,
  calc,
  onPrint,
  onReset,
  onSave,
  saving,
  isEditing,
}) {
  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return (
    <motion.aside
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="print-area lg:sticky lg:top-6 rounded-2xl border border-slate-200 bg-white shadow-card"
    >
      {/* ---------- Invoice header (visible on screen + print) ---------- */}
      <div className="rounded-t-2xl bg-slate-900 px-6 py-5 text-white print:rounded-none">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Receipt size={20} className="no-print" />
              {COMPANY.name}
            </h2>
            <p className="text-xs text-slate-300">{COMPANY.tagline}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">Estimate No.</p>
            <p className="text-sm font-semibold">{state.quoteNumber}</p>
          </div>
        </div>
        <p className="print-only mt-2 text-[11px] text-slate-300">{COMPANY.contact}</p>
      </div>

      {/* ---------- Meta ---------- */}
      <div className="grid grid-cols-2 gap-3 border-b border-slate-100 px-6 py-4 text-sm">
        <div>
          <p className="text-xs text-slate-400">Product</p>
          <p className="font-medium text-slate-700">{state.projectName || '—'}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Client</p>
          <p className="font-medium text-slate-700">{state.clientName || '—'}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Date</p>
          <p className="font-medium text-slate-700">{today}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Board Area</p>
          <p className="font-medium text-slate-700">{formatNumber(calc.actualArea)} sq.ft.</p>
        </div>
      </div>

      {/* ---------- Cost breakdown ---------- */}
      <div className="px-6 py-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Cost Breakdown
        </p>
        <Row label="Particle Board" value={formatCurrency(calc.boardCost)} />
        {calc.totalMaterial > 0 && (
          <div className="my-1 border-l-2 border-slate-100 pl-3">
            {calc.cabinetResults?.map((cabinet, index) =>
              cabinet.calculated_area > 0 ? (
                <Row
                  key={cabinet.cabinet_id}
                  label={`Cabinet ${index + 1}`}
                  value={`${formatNumber(cabinet.calculated_area)} sq.ft.`}
                />
              ) : null,
            )}
            <Row label="Outer panels" value={`${formatNumber(calc.outerArea)} sq.ft.`} />
            <Row label="Shelf racks" value={`${formatNumber(calc.innerArea)} sq.ft.`} />
            {calc.dividerArea > 0 && (
              <Row label="Vertical dividers" value={`${formatNumber(calc.dividerArea)} sq.ft.`} />
            )}
          </div>
        )}
        <Row label="Edge Banding" value={formatCurrency(calc.edgeCost)} />

        {/* Hardware detail (mainly for the printed invoice) */}
        {calc.hardwareLines.length > 0 && (
          <div className="my-1 border-l-2 border-slate-100 pl-3">
            {calc.hardwareLines.map((l) => (
              <Row
                key={l.id}
                label={`${l.name || 'Hardware item'}${l.brand ? ` · ${l.brand}` : ''}`}
                sub={`(${formatNumber(l.quantity || 0, 0)} × ${formatCurrency(
                  Number(l.unitPrice) || 0,
                )})`}
                value={formatCurrency(l.lineTotal)}
              />
            ))}
          </div>
        )}
        <Row label="Hardware & Accessories" value={formatCurrency(calc.hardwareCost)} strong />
        <Row label="Labor & Machining" value={formatCurrency(calc.laborCost)} />

        <div className="my-2 border-t border-slate-100" />
        <Row label="Subtotal" value={formatCurrency(calc.subtotal)} strong />
        <Row
          label="Profit Margin"
          sub={`(${formatNumber(Number(state.profitMargin) || 0, 0)}%)`}
          value={formatCurrency(calc.profitAmount)}
        />
        <Row label="Pre-Tax Total" value={formatCurrency(calc.preTaxTotal)} strong />
        <Row
          label="Tax / GST"
          sub={`(${formatNumber(Number(state.taxPercent) || 0, 0)}%)`}
          value={formatCurrency(calc.taxAmount)}
        />
        {calc.shippingCharge > 0 && (
          <Row label="Transport / Shipping" value={formatCurrency(calc.shippingCharge)} />
        )}
      </div>

      {/* ---------- Grand total ---------- */}
      <div className="mx-6 mb-2 flex items-center justify-between rounded-xl bg-indigo-600 px-5 py-4 text-white print:bg-slate-900">
        <span className="text-sm font-medium">Grand Total</span>
        <span className="text-xl font-bold tabular-nums">{formatCurrency(calc.grandTotal)}</span>
      </div>

      <p className="print-only px-6 pb-4 pt-2 text-[11px] leading-relaxed text-slate-400">
        This is a system-generated estimate and is valid for 15 days from the date of issue. Prices
        are subject to change based on final measurements and material availability.
      </p>

      {/* ---------- Actions (hidden on print) ---------- */}
      <div className="no-print space-y-3 border-t border-slate-100 px-6 py-4">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-70"
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Saving…
            </>
          ) : (
            <>
              <Save size={16} /> {isEditing ? 'Update Estimate' : 'Save Estimate'}
            </>
          )}
        </button>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onPrint}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
          >
            <Printer size={16} /> Save & Print
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 active:scale-[0.98]"
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </div>
    </motion.aside>
  )
}
