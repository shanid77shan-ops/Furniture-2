import { X, Settings, Plus, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { saveMaterialRates } from '../config/materialRates'

const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : 'r-' + Math.random().toString(36).slice(2)

export default function MaterialRatesAdmin({ open, onClose, rates, onSave }) {
  const [local, setLocal] = useState(rates)

  useEffect(() => {
    if (open) setLocal(rates)
  }, [open, rates])

  if (!open) return null

  const update = (id, key, value) => {
    setLocal((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [key]: value } : r)),
    )
  }

  const addRow = () => {
    setLocal((prev) => [
      ...prev,
      {
        id: uid(),
        brand: 'Century',
        thickness: '17mm',
        type: 'Particle Board',
        panel: 'body',
        pricePerSqFt: 0,
      },
    ])
  }

  const remove = (id) => setLocal((prev) => prev.filter((r) => r.id !== id))

  const handleSave = () => {
    saveMaterialRates(local)
    onSave(local)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <Settings size={18} className="text-indigo-600" />
            <h2 className="text-lg font-semibold text-slate-800">Material Rates Admin</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-5 space-y-2">
          <div className="hidden sm:grid grid-cols-6 gap-2 text-xs font-medium uppercase text-slate-400 px-1">
            <span>Panel</span>
            <span>Brand</span>
            <span>Thickness</span>
            <span>Type</span>
            <span>₹/sq ft</span>
            <span />
          </div>
          {local.map((r) => (
            <div key={r.id} className="grid grid-cols-2 sm:grid-cols-6 gap-2 items-center">
              <select
                value={r.panel}
                onChange={(e) => update(r.id, 'panel', e.target.value)}
                className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
              >
                <option value="body">Body</option>
                <option value="door">Door</option>
                <option value="back">Back</option>
              </select>
              <input
                value={r.brand}
                onChange={(e) => update(r.id, 'brand', e.target.value)}
                className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
              />
              <input
                value={r.thickness}
                onChange={(e) => update(r.id, 'thickness', e.target.value)}
                className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
              />
              <input
                value={r.type}
                onChange={(e) => update(r.id, 'type', e.target.value)}
                className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
              />
              <input
                type="number"
                min="0"
                value={r.pricePerSqFt}
                onChange={(e) => update(r.id, 'pricePerSqFt', parseFloat(e.target.value) || 0)}
                className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
              />
              <button
                type="button"
                onClick={() => remove(r.id)}
                className="justify-self-end rounded p-1.5 text-red-500 hover:bg-red-50"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addRow}
            className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline"
          >
            <Plus size={14} /> Add rate
          </button>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
          >
            Save rates
          </button>
        </div>
      </div>
    </div>
  )
}
