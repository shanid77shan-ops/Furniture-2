import { Percent } from 'lucide-react'
import SectionCard from '../ui/SectionCard'
import Field from '../ui/Field'
import { formatCurrency } from '../../utils/format'

export default function MarginsSection({ state, set, calc }) {
  return (
    <SectionCard
      icon={Percent}
      accent="blue"
      title="Margins & Taxes"
      description="Applied on top of the cost subtotal."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Profit Margin"
          suffix="%"
          value={state.profitMargin}
          onChange={(v) => set('profitMargin', v)}
        />
        <Field
          label="Tax / GST"
          suffix="%"
          value={state.taxPercent}
          onChange={(v) => set('taxPercent', v)}
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-blue-50 px-4 py-3">
          <p className="text-slate-500">Profit Amount</p>
          <p className="font-semibold text-blue-700">{formatCurrency(calc.profitAmount)}</p>
        </div>
        <div className="rounded-lg bg-blue-50 px-4 py-3">
          <p className="text-slate-500">Tax Amount</p>
          <p className="font-semibold text-blue-700">{formatCurrency(calc.taxAmount)}</p>
        </div>
      </div>
    </SectionCard>
  )
}
