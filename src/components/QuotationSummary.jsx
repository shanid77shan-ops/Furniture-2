import { motion } from 'framer-motion'
import { Receipt, Printer, RotateCcw, Save, Loader2, Download, Eye, EyeOff } from 'lucide-react'
import { formatCurrency, formatNumber } from '../utils/format'

const COMPANY = {
  name: 'Inspire Furnitures',
  tagline: 'Particle Board Furniture Manufacturing',
  contact: 'hello@inspirefurnitures.example  •  +91 98765 43210',
}

function Row({ label, value, sub, strong, hidden }) {
  if (hidden) return null
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
  onDownloadPdf,
  onToggleClientView,
  saving,
  isEditing,
}) {
  const clientView = !!state.clientView
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
          <p className="text-xs text-slate-400">Type / Area</p>
          <p className="font-medium text-slate-700 capitalize">
            {state.productType || '—'} · {formatNumber(calc.totalArea)} sq.ft.
          </p>
        </div>
      </div>

      <div className="px-6 py-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
          {clientView ? 'Quotation Summary' : 'Cost Breakdown'}
        </p>

        <Row label="Material Cost" value={formatCurrency(calc.materialCost)} strong />

        {!clientView && calc.material?.components?.length > 0 && (
          <div className="my-1 border-l-2 border-slate-100 pl-3">
            {calc.material.components.map((c) => (
              <Row
                key={c.name}
                label={c.name}
                sub={`${formatNumber(c.area, 2)} sq.ft.`}
                value={formatCurrency(c.cost)}
              />
            ))}
          </div>
        )}

        <Row
          label={clientView ? 'Labor & Fabrication' : 'Labor (45% of material)'}
          value={formatCurrency(calc.laborTotal)}
          strong={clientView}
        />

        {!clientView && (
          <div className="my-1 border-l-2 border-slate-100 pl-3">
            <Row label="Cutting" sub="(15%)" value={formatCurrency(calc.laborCutting)} />
            <Row label="Edge Banding" sub="(15%)" value={formatCurrency(calc.laborEdgeBanding)} />
            <Row label="Assembling" sub="(15%)" value={formatCurrency(calc.laborAssembling)} />
          </div>
        )}

        {!clientView && calc.hardwareLines.length > 0 && (
          <div className="my-1 border-l-2 border-slate-100 pl-3">
            {calc.hardwareLines.map((l) => (
              <Row
                key={l.id}
                label={`${l.name}${l.brand ? ` · ${l.brand}` : ''}`}
                sub={`(${formatNumber(l.quantity, 0)} × ${formatCurrency(l.unitPrice)})`}
                value={formatCurrency(l.lineTotal)}
              />
            ))}
          </div>
        )}
        <Row label="Hardware & Accessories" value={formatCurrency(calc.hardwareCost)} strong />

        {calc.extraCharges > 0 && (
          <>
            {calc.transport > 0 && (
              <Row label="Transport" value={formatCurrency(calc.transport)} />
            )}
            {calc.installation > 0 && (
              <Row label="Installation" value={formatCurrency(calc.installation)} />
            )}
          </>
        )}

        <div className="my-2 border-t border-slate-100" />
        <Row label="Subtotal" value={formatCurrency(calc.subtotal)} strong />

        {state.gstEnabled && (
          <Row
            label="GST"
            sub={`(${formatNumber(Number(state.taxPercent) || 0, 0)}%)`}
            value={formatCurrency(calc.taxAmount)}
          />
        )}

        {calc.marginAmount !== 0 && (
          <Row
            label="Margin / Discount"
            sub={`(${formatNumber(Number(state.marginPercent) || 0, 0)}%)`}
            value={formatCurrency(calc.marginAmount)}
          />
        )}
      </div>

      <div className="mx-6 mb-2 flex items-center justify-between rounded-xl bg-indigo-600 px-5 py-4 text-white print:bg-slate-900">
        <span className="text-sm font-medium">Grand Total</span>
        <span className="text-xl font-bold tabular-nums">{formatCurrency(calc.grandTotal)}</span>
      </div>

      <p className="print-only px-6 pb-4 pt-2 text-[11px] leading-relaxed text-slate-400">
        This is a system-generated estimate and is valid for 15 days from the date of issue.
      </p>

      <div className="no-print space-y-3 border-t border-slate-100 px-6 py-4">
        <button
          type="button"
          onClick={onToggleClientView}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          {clientView ? <EyeOff size={16} /> : <Eye size={16} />}
          {clientView ? 'Show internal breakdown' : 'Client view (hide labor detail)'}
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-70"
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

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onDownloadPdf}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Download size={16} /> PDF
          </button>
          <button
            type="button"
            onClick={onPrint}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Printer size={16} /> Print
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </motion.aside>
  )
}
