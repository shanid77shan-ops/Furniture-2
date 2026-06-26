/**
 * Material area from cupboard / wardrobe cabinets.
 * External dimensions (h, w, d) are in centimetres; thickness in mm.
 * Output area is in square feet.
 */

const num = (value) => {
  const n = typeof value === 'number' ? value : parseFloat(value)
  return Number.isFinite(n) ? n : 0
}

/** Convert centimetres to feet. */
export const cmToFeet = (cm) => num(cm) / 30.48

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

/** Internal shelf area: N × (W−2T) × (D−T). */
export function calcInnerArea(widthFt, depthFt, shelvesCount, thicknessMm) {
  const W = num(widthFt)
  const D = num(depthFt)
  const N = num(shelvesCount)
  const T = mmToFeet(thicknessMm)
  if (W <= 0 || D <= 0 || N <= 0) return 0
  const shelfWidth = Math.max(W - 2 * T, 0)
  const shelfDepth = Math.max(D - T, 0)
  return N * shelfWidth * shelfDepth
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
export function calcCabinet(cabinet) {
  const h = cmToFeet(cabinet?.dimensions?.h)
  const w = cmToFeet(cabinet?.dimensions?.w)
  const d = cmToFeet(cabinet?.dimensions?.d)
  const shelves = cabinet?.structure?.shelves
  const dividers = cabinet?.structure?.dividers
  const thickness = cabinet?.structure?.material_thickness ?? 18

  const outerArea = calcOuterArea(h, w, d)
  const innerArea = calcInnerArea(w, d, shelves, thickness)
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
export function calcMaterialFromCabinets(cabinets = [], { wastagePercent = 15, costPerSqFt = 0 } = {}) {
  const cabinetResults = (cabinets || []).map(calcCabinet)

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
