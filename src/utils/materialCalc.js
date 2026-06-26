/**
 * Material area from cupboard / wardrobe dimensions.
 * All external dimensions (H, W, D) are in feet; thickness T is in mm.
 */

const num = (value) => {
  const n = typeof value === 'number' ? value : parseFloat(value)
  return Number.isFinite(n) ? n : 0
}

/** Convert millimetres to feet. */
export const mmToFeet = (mm) => num(mm) / 304.8

/**
 * Outer panel area — front, back, sides, top, bottom.
 * Outer = 2×H×W + 2×H×D + 2×W×D
 */
export function calcOuterArea(height, width, depth) {
  const H = num(height)
  const W = num(width)
  const D = num(depth)
  if (H <= 0 || W <= 0 || D <= 0) return 0
  return 2 * H * W + 2 * H * D + 2 * W * D
}

/**
 * Internal shelf area.
 * Shelf width = W − 2T, depth = D − T, total = N × shelf area.
 */
export function calcInnerArea(width, depth, shelvesCount, thicknessMm) {
  const W = num(width)
  const D = num(depth)
  const N = num(shelvesCount)
  const T = mmToFeet(thicknessMm)
  if (W <= 0 || D <= 0 || N <= 0) return 0
  const shelfWidth = Math.max(W - 2 * T, 0)
  const shelfDepth = Math.max(D - T, 0)
  return N * shelfWidth * shelfDepth
}

/**
 * Vertical divider panels — each full height × internal depth.
 */
export function calcDividerArea(height, depth, dividerCount, thicknessMm) {
  const H = num(height)
  const D = num(depth)
  const V = num(dividerCount)
  const T = mmToFeet(thicknessMm)
  if (H <= 0 || D <= 0 || V <= 0) return 0
  const internalDepth = Math.max(D - T, 0)
  return V * H * internalDepth
}

/** Full material calculation used by the estimate hook. */
export function calcMaterialFromDimensions({
  height,
  width,
  depth,
  shelvesCount,
  verticalDividers,
  thicknessMm = 18,
  wastagePercent = 15,
  costPerSqFt = 0,
}) {
  const outerArea = calcOuterArea(height, width, depth)
  const innerArea = calcInnerArea(width, depth, shelvesCount, thicknessMm)
  const dividerArea = calcDividerArea(height, depth, verticalDividers, thicknessMm)
  const totalMaterial = outerArea + innerArea + dividerArea
  const wastage = num(wastagePercent)
  const actualArea = totalMaterial + totalMaterial * (wastage / 100)
  const boardCost = actualArea * num(costPerSqFt)

  return {
    outerArea,
    innerArea,
    dividerArea,
    totalMaterial,
    actualArea,
    boardCost,
  }
}
