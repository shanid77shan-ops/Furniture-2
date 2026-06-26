import { Package, Ruler } from 'lucide-react'
import SectionCard from '../ui/SectionCard'
import { formatCurrency, formatNumber } from '../../utils/format'
import {
  getBrandsForPanel,
  getThicknessForPanel,
  BED_SIZES,
} from '../../config/materialRates'
import { DIMENSION_UNIT_LABELS, DIMENSION_UNITS } from '../../utils/materialCalc'

const inputClass =
  'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'

function MaterialSelect({ label, panel, state, setMaterial, materialRates }) {
  const brands = getBrandsForPanel(materialRates, panel)
  const brandKey = `${panel}Brand`
  const thickKey = `${panel}Thickness`
  const brand = state.material?.[brandKey] || brands[0] || ''
  const thicknesses = getThicknessForPanel(materialRates, panel, brand)

  return (
    <div className="rounded-lg border border-slate-100 bg-white p-3 space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <select
        value={brand}
        onChange={(e) => setMaterial(brandKey, e.target.value)}
        className={inputClass}
      >
        {brands.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>
      <select
        value={state.material?.[thickKey] || thicknesses[0] || ''}
        onChange={(e) => setMaterial(thickKey, e.target.value)}
        className={inputClass}
      >
        {thicknesses.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  )
}

export default function MaterialModuleSection({
  state,
  set,
  setDimension,
  setStructure,
  setMaterial,
  setDimensionUnit,
  calc,
  materialRates,
}) {
  const unit = state.dimensionUnit || 'in'
  const isWardrobe = state.productType === 'wardrobe'
  const isBed = state.productType === 'bed'
  const isStandard = state.sizeMode === 'standard'

  return (
    <SectionCard
      icon={Package}
      accent="indigo"
      title="Material Module"
      description="Select product type, dimensions, and material brand/thickness. Area uses (L × W) / 144 sq.ft."
    >
      {/* Product type */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {['wardrobe', 'bed'].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => set('productType', type)}
            className={`rounded-xl border px-4 py-3 text-sm font-medium capitalize transition ${
              state.productType === type
                ? 'border-indigo-400 bg-indigo-50 text-indigo-800'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Standard vs Custom */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-sm font-medium text-slate-700">Size mode</span>
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="radio"
            checked={isStandard}
            onChange={() => set('sizeMode', 'standard')}
            className="accent-indigo-600"
          />
          Standard
        </label>
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="radio"
            checked={!isStandard}
            onChange={() => set('sizeMode', 'custom')}
            className="accent-indigo-600"
          />
          Custom
        </label>
      </div>

      {isBed && isStandard && (
        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-600 mb-1">Bed size</label>
          <select
            value={state.bedSize || 'king'}
            onChange={(e) => set('bedSize', e.target.value)}
            className={inputClass}
          >
            {Object.entries(BED_SIZES).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {isBed && (
        <label className="mb-4 flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
          <input
            type="checkbox"
            checked={!!state.cushionHeadboard}
            onChange={(e) => set('cushionHeadboard', e.target.checked)}
            className="accent-indigo-600"
          />
          Cushion Headboard (adds fixed cost)
        </label>
      )}

      {isWardrobe && (
        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-600 mb-1">Wardrobe doors</label>
          <select
            value={state.wardrobeDoors || 2}
            onChange={(e) => set('wardrobeDoors', Number(e.target.value))}
            className={inputClass}
          >
            <option value={2}>2 Door</option>
            <option value={3}>3 Door</option>
            <option value={4}>4 Door</option>
          </select>
        </div>
      )}

      {/* Dimensions (custom or bed override) */}
      {(!isStandard || isWardrobe) && (
        <>
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1">
              <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <Ruler className="h-4 w-4 text-slate-400" />
                Measurement unit
              </label>
              <select
                value={unit}
                onChange={(e) => setDimensionUnit(e.target.value)}
                className={`${inputClass} sm:max-w-xs`}
              >
                {DIMENSION_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {DIMENSION_UNIT_LABELS[u]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { key: 'h', label: isBed ? 'Length' : 'Height' },
              { key: 'w', label: 'Width' },
              { key: 'd', label: 'Depth' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  {label} ({unit})
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={state.dimensions?.[key] ?? ''}
                  onChange={(e) => setDimension(key, e.target.value)}
                  placeholder="0"
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {isBed && isStandard && (
        <p className="mb-4 text-xs text-slate-500">
          Using standard {BED_SIZES[state.bedSize || 'king']?.label} dimensions.
          Switch to Custom to override.
        </p>
      )}

      {isWardrobe && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Racks inside vertical
            </label>
            <input
              type="number"
              min="0"
              value={state.structure?.racks_in_vertical ?? ''}
              onChange={(e) => setStructure('racks_in_vertical', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Vertical dividers
            </label>
            <input
              type="number"
              min="0"
              value={state.structure?.dividers ?? ''}
              onChange={(e) => setStructure('dividers', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      )}

      {/* Material selection */}
      <p className="text-sm font-medium text-slate-700 mb-2">Material selection</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mb-4">
        <MaterialSelect
          label="Body panels"
          panel="body"
          state={state}
          setMaterial={setMaterial}
          materialRates={materialRates}
        />
        {isWardrobe && (
          <MaterialSelect
            label="Doors"
            panel="door"
            state={state}
            setMaterial={setMaterial}
            materialRates={materialRates}
          />
        )}
        {isWardrobe && (
          <MaterialSelect
            label="Backing"
            panel="back"
            state={state}
            setMaterial={setMaterial}
            materialRates={materialRates}
          />
        )}
      </div>

      {/* Material breakdown */}
      {calc.material?.components?.length > 0 && (
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 space-y-2">
          <p className="text-sm font-semibold text-indigo-900">Material breakdown</p>
          {calc.material.components.map((c) => (
            <div key={c.name} className="flex justify-between text-xs text-slate-600">
              <span>
                {c.name}{' '}
                <span className="text-slate-400">
                  ({formatNumber(c.area, 2)} sq ft × {formatCurrency(c.rate)})
                </span>
              </span>
              <span className="font-medium">{formatCurrency(c.cost)}</span>
            </div>
          ))}
          {calc.material.extraCost > 0 && (
            <div className="flex justify-between text-xs text-slate-600">
              <span>Cushion Headboard</span>
              <span className="font-medium">{formatCurrency(calc.material.extraCost)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-indigo-100 pt-2 text-sm font-semibold text-indigo-800">
            <span>Total material ({formatNumber(calc.totalArea, 2)} sq ft)</span>
            <span>{formatCurrency(calc.materialCost)}</span>
          </div>
        </div>
      )}
    </SectionCard>
  )
}
