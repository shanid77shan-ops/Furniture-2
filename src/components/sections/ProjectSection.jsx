import { FileText } from 'lucide-react'
import SectionCard from '../ui/SectionCard'
import Field from '../ui/Field'

export default function ProjectSection({ state, set }) {
  return (
    <SectionCard
      icon={FileText}
      accent="violet"
      title="Estimate Details"
      description="Estimate number is auto-generated for the current month."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-600">Estimate No.</span>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700">
            {state.quoteNumber || '—'}
          </div>
          <span className="mt-1 block text-xs text-slate-400">
            Format: EST-YYYY-MM-01 — number continues each month, resets in a new month
          </span>
        </label>
        <div className="hidden sm:block" />
        <Field
          label="Product Name"
          type="text"
          placeholder="e.g. Modular Kitchen — Phase 1"
          value={state.projectName}
          onChange={(v) => set('projectName', v)}
        />
        <Field
          label="Client Name"
          type="text"
          placeholder="e.g. Mr. Sharma"
          value={state.clientName}
          onChange={(v) => set('clientName', v)}
        />
      </div>
    </SectionCard>
  )
}
