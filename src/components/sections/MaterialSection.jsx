import { Plus, Trash2, Layers, Ruler } from 'lucide-react'
import SectionCard from '../ui/SectionCard'
import { formatCurrency, formatNumber } from '../../utils/format'
import { calcCabinet, DIMENSION_UNITS, DIMENSION_UNIT_LABELS } from '../../utils/materialCalc'

const dimKeys = [
  { key: 'h', name: 'Height' },
  { key: 'w', name: 'Width' },
  { key: 'd', name: 'Depth' },
]

export default function MaterialSection({
  state,
  set,
  calc,
  addCabinet,
  updateCabinetDimensions,
  updateCabinetStructure,
  removeCabinet,
  setDimensionUnit,
}) {
  const cabinets = state.cabinets?.length ? state.cabinets : []
  const unit = state.dimensionUnit || 'cm'

  return (
    <SectionCard
      icon={Layers}
      accent="blue"
      title="1. Material (Particle Board)"
      description="Add cabinets and choose cm, inches, or feet for dimensions; area is calculated in sq ft."
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1">
          <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-700">
            <Ruler className="h-4 w-4 text-slate-400" />
            Measurement unit
          </label>
          <select
            value={unit}
            onChange={(e) => setDimensionUnit(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:max-w-xs"
          >
            {DIMENSION_UNITS.map((u) => (
              <option key={u} value={u}>
                {DIMENSION_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </div>
        <p className="text-xs text-slate-500 sm:pb-2">
          Changing unit converts existing cabinet dimensions automatically.
        </p>
      </div>

      <div className="space-y-4">
        {cabinets.map((cabinet, index) => {
          const result = calcCabinet(cabinet, unit)
          const canRemove = cabinets.length > 1

          return (
            <div
              key={cabinet.cabinet_id}
              className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-800">
                  Cabinet {index + 1}
                  {result.calculated_area > 0 && (
                    <span className="ml-2 text-xs font-normal text-emerald-700">
                      {formatNumber(result.calculated_area, 2)} sq ft
                    </span>
                  )}
                </p>
                {canRemove && (
                  <button
                    type="button"
                    onClick={() => removeCabinet(cabinet.cabinet_id)}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {dimKeys.map(({ key, name }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      {name} ({unit})
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={cabinet.dimensions?.[key] ?? ''}
                      onChange={(e) => updateCabinetDimensions(cabinet.cabinet_id, key, e.target.value)}
                      placeholder="0"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Shelves</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={cabinet.structure?.shelves ?? ''}
                    onChange={(e) =>
                      updateCabinetStructure(cabinet.cabinet_id, 'shelves', e.target.value)
                    }
                    placeholder="0"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Vertical dividers
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={cabinet.structure?.dividers ?? ''}
                    onChange={(e) =>
                      updateCabinetStructure(cabinet.cabinet_id, 'dividers', e.target.value)
                    }
                    placeholder="0"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Thickness (mm)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={cabinet.structure?.material_thickness ?? 18}
                    onChange={(e) =>
                      updateCabinetStructure(
                        cabinet.cabinet_id,
                        'material_thickness',
                        e.target.value,
                      )
                    }
                    placeholder="18"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              {result.calculated_area > 0 && (
                <div className="rounded-lg bg-white border border-slate-100 px-3 py-2 text-xs text-slate-600 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <span>Outer: {formatNumber(result.outerArea, 2)} sq ft</span>
                  <span>Shelves: {formatNumber(result.innerArea, 2)} sq ft</span>
                  <span>Dividers: {formatNumber(result.dividerArea, 2)} sq ft</span>
                  <span className="font-medium text-emerald-700">
                    Total: {formatNumber(result.calculated_area, 2)} sq ft
                  </span>
                </div>
              )}
            </div>
          )
        })}

        <button
          type="button"
          onClick={addCabinet}
          className="inline-flex items-center gap-2 rounded-lg border border-dashed border-emerald-300 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
        >
          <Plus className="h-4 w-4" />
          Add cabinet
        </button>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Cost per sq ft (₹)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={state.costPerSqFt}
              onChange={(e) => set('costPerSqFt', e.target.value)}
              placeholder="0.00"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Wastage (%)
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={state.wastagePercent}
              onChange={(e) => set('wastagePercent', e.target.value)}
              placeholder="15"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        {calc.totalMaterial > 0 && (
          <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm space-y-1">
            <div className="flex justify-between text-slate-600">
              <span>Combined material area</span>
              <span>{formatNumber(calc.totalMaterial, 2)} sq ft</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>With wastage ({state.wastagePercent || 0}%)</span>
              <span>{formatNumber(calc.actualArea, 2)} sq ft</span>
            </div>
            <div className="flex justify-between font-semibold text-emerald-800 pt-1 border-t border-emerald-100">
              <span>Board cost</span>
              <span>{formatCurrency(calc.boardCost)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100">
        <p className="text-sm font-medium text-slate-700 mb-3">Edge Banding</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Running meters
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={state.runningMeters}
              onChange={(e) => set('runningMeters', e.target.value)}
              placeholder="0"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Cost per meter (₹)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={state.edgeCostPerMeter}
              onChange={(e) => set('edgeCostPerMeter', e.target.value)}
              placeholder="0.00"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>
        {calc.edgeCost > 0 && (
          <p className="mt-2 text-sm text-slate-600">
            Edge banding total: <span className="font-semibold">{formatCurrency(calc.edgeCost)}</span>
          </p>
        )}
      </div>
    </SectionCard>
  )
}
