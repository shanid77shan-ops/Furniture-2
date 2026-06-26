/** Default material rates — editable via Admin panel (localStorage). */

export const MATERIAL_TYPES = ['Particle Board', 'Laminate', 'MDF']

export const DEFAULT_MATERIAL_RATES = [
  { id: 'century-17-body', brand: 'Century', thickness: '17mm', type: 'Particle Board', panel: 'body', pricePerSqFt: 85 },
  { id: 'merino-17-body', brand: 'Merino', thickness: '17mm', type: 'Particle Board', panel: 'body', pricePerSqFt: 90 },
  { id: 'panalex-17-body', brand: 'Panalex', thickness: '17mm', type: 'Particle Board', panel: 'body', pricePerSqFt: 80 },
  { id: 'kboard-17-body', brand: 'K board', thickness: '17mm', type: 'Particle Board', panel: 'body', pricePerSqFt: 75 },
  { id: 'century-17-door', brand: 'Century', thickness: '17mm', type: 'Particle Board', panel: 'door', pricePerSqFt: 95 },
  { id: 'merino-17-door', brand: 'Merino', thickness: '17mm', type: 'Particle Board', panel: 'door', pricePerSqFt: 100 },
  { id: 'uv-17-door', brand: 'UV finish', thickness: '17mm', type: 'Laminate', panel: 'door', pricePerSqFt: 120 },
  { id: 'century-9-back', brand: 'Century', thickness: '9mm', type: 'Particle Board', panel: 'back', pricePerSqFt: 55 },
  { id: 'kboard-9-back', brand: 'K board', thickness: '9mm', type: 'Particle Board', panel: 'back', pricePerSqFt: 50 },
]

export const CUSHION_HEADBOARD_COST = 3500

export const BED_SIZES = {
  king: { label: 'King (72×78 in)', length: 72, width: 78 },
  queen: { label: 'Queen (60×78 in)', length: 60, width: 78 },
}

const STORAGE_KEY = 'inspire_material_rates_v1'

export const loadMaterialRates = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  return DEFAULT_MATERIAL_RATES.map((r) => ({ ...r }))
}

export const saveMaterialRates = (rates) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rates))
}

const num = (v) => {
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : 0
}

export const findRate = (rates, panel, brand, thickness) => {
  const match = rates.find(
    (r) =>
      r.panel === panel &&
      r.brand === brand &&
      r.thickness === thickness,
  )
  if (match) return num(match.pricePerSqFt)
  const fallback = rates.find((r) => r.panel === panel)
  return fallback ? num(fallback.pricePerSqFt) : 0
}

export const getBrandsForPanel = (rates, panel) =>
  [...new Set(rates.filter((r) => r.panel === panel).map((r) => r.brand))]

export const getThicknessForPanel = (rates, panel, brand) =>
  [
    ...new Set(
      rates
        .filter((r) => r.panel === panel && (!brand || r.brand === brand))
        .map((r) => r.thickness),
    ),
  ]
