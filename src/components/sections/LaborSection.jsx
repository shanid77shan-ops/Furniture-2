import { Hammer } from 'lucide-react'
import SectionCard from '../ui/SectionCard'
import Field from '../ui/Field'
import { formatCurrency } from '../../utils/format'

export default function LaborSection({ state, set, calc }) {
  return (
    <SectionCard
      icon={Hammer}
      accent="emerald"
      title="Labor & Machining"
      description="Cutting, edge-banding, CNC drilling, assembly & installation."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Machining Cost per sq.ft."
          prefix="₹"
          hint="Cutting, edge-banding, CNC, assembly"
          value={state.machiningPerSqFt}
          onChange={(v) => set('machiningPerSqFt', v)}
        />
        <Field
          label="Installation Cost per sq.ft."
          prefix="₹"
          hint="On-site fitting & finishing"
          value={state.installationPerSqFt}
          onChange={(v) => set('installationPerSqFt', v)}
        />
      </div>

      <div className="mt-5 flex items-center justify-between rounded-lg bg-emerald-50 px-4 py-3 text-sm">
        <span className="text-slate-500">
          Total Labor Cost (on {`${calc.actualArea ? calc.actualArea.toFixed(2) : '0.00'} sq.ft.`})
        </span>
        <span className="font-semibold text-emerald-700">{formatCurrency(calc.laborCost)}</span>
      </div>
    </SectionCard>
  )
}
