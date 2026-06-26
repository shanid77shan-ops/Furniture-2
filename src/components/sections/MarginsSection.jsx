import { Percent } from 'lucide-react'
import SectionCard from '../ui/SectionCard'
import Field from '../ui/Field'
import { formatCurrency } from '../../utils/format'

export default function MarginsSection({ state, set, calc }) {
  return (
    <SectionCard
      icon={Percent}
      accent="blue"
      title="Final Pricing"
      description="Transport, installation, optional GST (18%), and dealer/customer margin."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Transport / Shipping"
          prefix="₹"
          value={state.transportCharge}
          onChange={(v) => set('transportCharge', v)}
        />
        <Field
          label="Installation"
          prefix="₹"
          value={state.installationCharge}
          onChange={(v) => set('installationCharge', v)}
        />
        <Field
          label="Extra / Custom Hardware"
          prefix="₹"
          hint="Additional hardware not in catalog"
          value={state.extraHardwareCost}
          onChange={(v) => set('extraHardwareCost', v)}
        />
        <Field
          label="Margin / Discount"
          suffix="%"
          hint="Dealer commission or customer discount applied at end"
          value={state.marginPercent}
          onChange={(v) => set('marginPercent', v)}
        />
      </div>

      <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
        <input
          type="checkbox"
          checked={!!state.gstEnabled}
          onChange={(e) => set('gstEnabled', e.target.checked)}
          className="h-4 w-4 accent-blue-600"
        />
        <div>
          <p className="text-sm font-medium text-slate-700">Apply GST (18%)</p>
          <p className="text-xs text-slate-500">Adds tax to subtotal before margin</p>
        </div>
      </label>

      {state.gstEnabled && (
        <div className="mt-3">
          <Field
            label="GST Rate"
            suffix="%"
            value={state.taxPercent}
            onChange={(v) => set('taxPercent', v)}
          />
        </div>
      )}

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-blue-50 px-4 py-3">
          <p className="text-slate-500">Subtotal</p>
          <p className="font-semibold text-blue-700">{formatCurrency(calc.subtotal)}</p>
        </div>
        <div className="rounded-lg bg-blue-50 px-4 py-3">
          <p className="text-slate-500">GST Amount</p>
          <p className="font-semibold text-blue-700">{formatCurrency(calc.taxAmount)}</p>
        </div>
        <div className="rounded-lg bg-blue-50 px-4 py-3 col-span-2">
          <p className="text-slate-500">Margin / Discount</p>
          <p className="font-semibold text-blue-700">{formatCurrency(calc.marginAmount)}</p>
        </div>
      </div>
    </SectionCard>
  )
}
