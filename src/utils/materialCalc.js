/**
 * Material area from cupboard / wardrobe cabinets.
 * External dimensions (h, w, d) use the selected unit; thickness in mm.
 * Output area is in square feet.
 */

export const DIMENSION_UNITS = ['cm', 'in', 'ft']

export const DIMENSION_UNIT_LABELS = {
  cm: 'Centimetres (cm)',
  in: 'Inches (in)',
  ft: 'Feet (ft)',
}

const num = (value) => {
  const n = typeof value === 'number' ? value : parseFloat(value)
  return Number.isFinite(n) ? n : 0
}

/** Convert a length in the given unit to feet. */
export function toFeet(value, unit = 'cm') {
  const n = num(value)
  if (n <= 0) return 0
  switch (unit) {
    case 'ft':
      return n
    case 'in':
      return n / 12
    case 'cm':
    default:
      return n / 30.48
  }
}

/** Convert feet to the given unit. */
export function fromFeet(feet, unit = 'cm') {
  const n = num(feet)
  switch (unit) {
    case 'ft':
      return n
    case 'in':
      return n * 12
    case 'cm':
    default:
      return n * 30.48
  }
}

/** Convert a dimension value between units (preserves empty input). */
export function convertDimension(value, fromUnit, toUnit) {
  if (fromUnit === toUnit) return value ?? ''
  const raw = value ?? ''
  const n = parseFloat(raw)
  if (!Number.isFinite(n)) return raw
  const feet = toFeet(n, fromUnit)
  return Math.round(fromFeet(feet, toUnit) * 100) / 100
}

/** @deprecated Use toFeet(value, 'cm') */
export const cmToFeet = (cm) => toFeet(cm, 'cm')

/** Convert millimetres to feet. */
export const mmToFeet = (mm) => num(mm) / 304.8

/**
 * Outer panel area — front, back, sides, top, bottom.
 * Outer = 2×H×W + 2×H×D + 2×W×D  (H, W, D in feet)
 */
export function calcOuterArea(heightFt, widthFt, depthFt) {
  const H = num(heightFt)
  const W = num(widthFt)
  const D = num(depthFt)
  if (H <= 0 || W <= 0 || D <= 0) return 0
  return 2 * H * W + 2 * H * D + 2 * W * D
}

/** Internal shelf area: N × W × D (depth × width per shelf). */
export function calcInnerArea(widthFt, depthFt, shelvesCount) {
  const W = num(widthFt)
  const D = num(depthFt)
  const N = num(shelvesCount)
  if (W <= 0 || D <= 0 || N <= 0) return 0
  return N * W * D
}

/** Vertical divider panels: V × H × (D−T). */
export function calcDividerArea(heightFt, depthFt, dividerCount, thicknessMm) {
  const H = num(heightFt)
  const D = num(depthFt)
  const V = num(dividerCount)
  const T = mmToFeet(thicknessMm)
  if (H <= 0 || D <= 0 || V <= 0) return 0
  return V * H * Math.max(D - T, 0)
}

/**
 * Calculate one cabinet entry:
 * {
 *   cabinet_id, dimensions: {h,w,d}, structure: {shelves, dividers, material_thickness},
 *   calculated_area, outerArea, innerArea, dividerArea
 * }
 */
export function calcCabinet(cabinet, unit = 'cm') {
  const h = toFeet(cabinet?.dimensions?.h, unit)
  const w = toFeet(cabinet?.dimensions?.w, unit)
  const d = toFeet(cabinet?.dimensions?.d, unit)
  const shelves = cabinet?.structure?.shelves
  const dividers = cabinet?.structure?.dividers
  const thickness = cabinet?.structure?.material_thickness ?? 18

  const outerArea = calcOuterArea(h, w, d)
  const innerArea = calcInnerArea(w, d, shelves)
  const dividerArea = calcDividerArea(h, d, dividers, thickness)
  const calculated_area = outerArea + innerArea + dividerArea

  return {
    cabinet_id: cabinet.cabinet_id,
    dimensions: cabinet.dimensions,
    structure: cabinet.structure,
    outerArea,
    innerArea,
    dividerArea,
    calculated_area,
  }
}

/** Sum all cabinets, apply wastage and cost. */
export function calcMaterialFromCabinets(
  cabinets = [],
  { dimensionUnit = 'cm', wastagePercent = 15, costPerSqFt = 0 } = {},
) {
  const cabinetResults = (cabinets || []).map((cabinet) => calcCabinet(cabinet, dimensionUnit))

  const outerArea = cabinetResults.reduce((s, c) => s + c.outerArea, 0)
  const innerArea = cabinetResults.reduce((s, c) => s + c.innerArea, 0)
  const dividerArea = cabinetResults.reduce((s, c) => s + c.dividerArea, 0)
  const totalMaterial = cabinetResults.reduce((s, c) => s + c.calculated_area, 0)

  const wastage = num(wastagePercent)
  const actualArea = totalMaterial + totalMaterial * (wastage / 100)
  const boardCost = actualArea * num(costPerSqFt)

  return {
    cabinets: cabinetResults,
    outerArea,
    innerArea,
    dividerArea,
    totalMaterial,
    actualArea,
    boardCost,
  }
}
