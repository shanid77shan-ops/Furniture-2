import { Layers, Ruler } from 'lucide-react'
import SectionCard from '../ui/SectionCard'
import Field from '../ui/Field'
import { formatNumber, formatCurrency } from '../../utils/format'

export default function MaterialSection({ state, set, calc }) {
  return (
    <SectionCard
      icon={Layers}
      accent="indigo"
      title="Material — Particle Board & Edge Banding"
      description="Board area is adjusted for cutting wastage before costing."
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field
            label="Required Area"
            suffix="sq.ft."
            value={state.requiredArea}
            onChange={(v) => set('requiredArea', v)}
          />
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

        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm">
          <span className="flex items-center gap-2 text-slate-500">
            <Ruler size={16} /> Actual area (incl. wastage)
          </span>
          <span className="font-semibold text-slate-700">
            {formatNumber(calc.actualArea)} sq.ft.
          </span>
        </div>

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
