import { FileText } from 'lucide-react'
import SectionCard from '../ui/SectionCard'
import Field from '../ui/Field'

export default function ProjectSection({ state, set }) {
  return (
    <SectionCard
      icon={FileText}
      accent="violet"
      title="Project Details"
      description="Basic information shown on the quotation header."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Invoice No."
          type="text"
          placeholder="e.g. INV-2026-1234"
          value={state.quoteNumber}
          onChange={(v) => set('quoteNumber', v)}
        />
        <div className="hidden sm:block" />
        <Field
          label="Project Name"
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
