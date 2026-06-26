import { Hammer } from 'lucide-react'
import SectionCard from '../ui/SectionCard'
import { formatCurrency } from '../../utils/format'

export default function LaborSection({ calc }) {
  return (
    <SectionCard
      icon={Hammer}
      accent="emerald"
      title="Labor Costing"
      description="Automatically calculated as 45% of material cost (15% cutting + 15% edge banding + 15% assembling)."
    >
      <div className="space-y-2">
        {[
          { label: 'Cutting', value: calc.laborCutting, pct: '15%' },
          { label: 'Edge Banding', value: calc.laborEdgeBanding, pct: '15%' },
          { label: 'Assembling', value: calc.laborAssembling, pct: '15%' },
        ].map(({ label, value, pct }) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-lg bg-emerald-50 px-4 py-2.5 text-sm"
          >
            <span className="text-slate-600">
              {label}{' '}
              <span className="text-xs text-slate-400">({pct} of material)</span>
            </span>
            <span className="font-semibold text-emerald-700">{formatCurrency(value)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm">
        <span className="font-medium text-slate-700">Total Labor (45% of material)</span>
        <span className="text-lg font-bold text-emerald-700">{formatCurrency(calc.laborTotal)}</span>
      </div>
    </SectionCard>
  )
}
