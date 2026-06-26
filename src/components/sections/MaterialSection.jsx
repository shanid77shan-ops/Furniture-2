import { Layers, Ruler, Box } from 'lucide-react'
import SectionCard from '../ui/SectionCard'
import Field from '../ui/Field'
import { formatNumber, formatCurrency } from '../../utils/format'

function CalcRow({ label, value, sub }) {
  return (
    <div className="flex items-baseline justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-sm">
      <span className="text-slate-500">
        {label}
        {sub && <span className="ml-1 text-xs text-slate-400">{sub}</span>}
      </span>
      <span className="font-semibold text-slate-700">{value}</span>
    </div>
  )
}

export default function MaterialSection({ state, set, calc }) {
  return (
    <SectionCard
      icon={Layers}
      accent="indigo"
      title="Material — Particle Board"
      description="Enter cupboard dimensions; outer panels, shelves & dividers are calculated automatically."
    >
      <div className="space-y-5">
        {/* External dimensions */}
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-600">
            <Box size={14} /> External dimensions
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field
              label="Height"
              suffix="ft"
              value={state.height}
              onChange={(v) => set('height', v)}
            />
            <Field
              label="Width"
              suffix="ft"
              value={state.width}
              onChange={(v) => set('width', v)}
            />
            <Field
              label="Depth"
              suffix="ft"
              value={state.depth}
              onChange={(v) => set('depth', v)}
            />
          </div>
        </div>

        {/* Internal layout */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-600">
            Internal layout
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field
              label="Shelves count"
              value={state.shelvesCount}
              onChange={(v) => set('shelvesCount', v)}
              placeholder="0"
            />
            <Field
              label="Vertical dividers"
              value={state.verticalDividers}
              onChange={(v) => set('verticalDividers', v)}
              placeholder="0"
            />
            <Field
              label="Board thickness"
              suffix="mm"
              value={state.thicknessMm}
              onChange={(v) => set('thicknessMm', v)}
              hint="Default 18 mm"
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Cost per sq.ft."
            prefix="₹"
            value={state.costPerSqFt}
            onChange={(v) => set('costPerSqFt', v)}
          />
          <Field
            label="Wastage"
            suffix="%"
            value={state.wastagePercent}
            onChange={(v) => set('wastagePercent', v)}
          />
        </div>

        {/* Calculated breakdown */}
        <div className="space-y-2 border-t border-dashed border-slate-200 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Calculated material
          </p>
          <CalcRow
            label="Outer area"
            sub="(front, back, sides, top, bottom)"
            value={`${formatNumber(calc.outerArea)} sq.ft.`}
          />
          <CalcRow
            label="Inner shelves"
            sub="(N × shelf area)"
            value={`${formatNumber(calc.innerArea)} sq.ft.`}
          />
          <CalcRow
            label="Vertical dividers"
            value={`${formatNumber(calc.dividerArea)} sq.ft.`}
          />
          <CalcRow
            label="Total material"
            sub="(outer + inner + dividers)"
            value={`${formatNumber(calc.totalMaterial)} sq.ft.`}
          />
          <div className="flex items-center justify-between rounded-lg bg-indigo-50 px-4 py-3 text-sm">
            <span className="flex items-center gap-2 font-medium text-indigo-700">
              <Ruler size={16} /> Total incl. wastage
            </span>
            <span className="font-bold text-indigo-800">
              {formatNumber(calc.actualArea)} sq.ft.
            </span>
          </div>
        </div>

        {/* Edge banding */}
        <div className="border-t border-dashed border-slate-200 pt-5">
          <p className="mb-3 text-sm font-medium text-slate-600">Edge Banding (incl. glue)</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Total Running Meters"
              suffix="m"
              value={state.runningMeters}
              onChange={(v) => set('runningMeters', v)}
            />
            <Field
              label="Cost per meter"
              prefix="₹"
              value={state.edgeCostPerMeter}
              onChange={(v) => set('edgeCostPerMeter', v)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-indigo-50 px-4 py-3">
            <p className="text-slate-500">Board Cost</p>
            <p className="font-semibold text-indigo-700">{formatCurrency(calc.boardCost)}</p>
          </div>
          <div className="rounded-lg bg-indigo-50 px-4 py-3">
            <p className="text-slate-500">Edge Cost</p>
            <p className="font-semibold text-indigo-700">{formatCurrency(calc.edgeCost)}</p>
          </div>
        </div>
      </div>
    </SectionCard>
  )
}
