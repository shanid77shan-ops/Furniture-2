/**
 * Material estimation for Wardrobe and Bed products.
 * Area in sq.ft from inch dimensions: (L × W) / 144
 */

import { BED_SIZES, CUSHION_HEADBOARD_COST, findRate } from '../config/materialRates'

const num = (value) => {
  const n = typeof value === 'number' ? value : parseFloat(value)
  return Number.isFinite(n) ? n : 0
}

export const toInches = (value, unit = 'in') => {
  const n = num(value)
  if (n <= 0) return 0
  switch (unit) {
    case 'in':
      return n
    case 'ft':
      return n * 12
    case 'cm':
      return n / 2.54
    default:
      return n
  }
}

/** Convert inches area to sq ft: (L × W) / 144 */
export const sqFtFromInches = (lengthIn, widthIn) => (num(lengthIn) * num(widthIn)) / 144

export function calcWardrobeMaterial(state, materialRates = []) {
  const unit = state.dimensionUnit || 'in'
  const H = toInches(state.dimensions?.h ?? state.dimensions?.l, unit)
  const W = toInches(state.dimensions?.w, unit)
  const D = toInches(state.dimensions?.d, unit)
  const R = num(state.structure?.racks_in_vertical)
  const V = num(state.structure?.dividers)
  const doors = num(state.wardrobeDoors) || 2

  if (H <= 0 || W <= 0 || D <= 0) {
    return emptyResult('wardrobe')
  }

  const sidePanels = 2 * sqFtFromInches(H, D)
  const topBottom = 2 * sqFtFromInches(W, D)
  const backPanel = sqFtFromInches(W, H)
  const partitions = V > 0 ? V * sqFtFromInches(H, D) : 0
  const shelves = R > 0 && V > 0 ? (R * sqFtFromInches(W, D)) / V : 0
  const doorWidth = W / doors
  const doorPanels = doors * sqFtFromInches(H, doorWidth)

  const bodyArea = sidePanels + topBottom + partitions + shelves
  const doorArea = doorPanels
  const backArea = backPanel

  const bodyRate = findRate(
    materialRates,
    'body',
    state.material?.bodyBrand,
    state.material?.bodyThickness,
  )
  const doorRate = findRate(
    materialRates,
    'door',
    state.material?.doorBrand,
    state.material?.doorThickness,
  )
  const backRate = findRate(
    materialRates,
    'back',
    state.material?.backBrand,
    state.material?.backThickness,
  )

  const components = [
    { name: 'Side Panels', area: sidePanels, panel: 'body', rate: bodyRate },
    { name: 'Top / Bottom', area: topBottom, panel: 'body', rate: bodyRate },
    { name: 'Partitions', area: partitions, panel: 'body', rate: bodyRate },
    { name: 'Shelves / Racks', area: shelves, panel: 'body', rate: bodyRate },
    { name: 'Doors', area: doorPanels, panel: 'door', rate: doorRate },
    { name: 'Back Panel', area: backPanel, panel: 'back', rate: backRate },
  ].map((c) => ({
    ...c,
    cost: c.area * c.rate,
  }))

  const bodyCost = bodyArea * bodyRate
  const doorCost = doorArea * doorRate
  const backCost = backArea * backRate
  const totalArea = bodyArea + doorArea + backArea
  const materialCost = bodyCost + doorCost + backCost

  return {
    productType: 'wardrobe',
    components,
    bodyArea,
    doorArea,
    backArea,
    totalArea,
    bodyCost,
    doorCost,
    backCost,
    materialCost,
    extraCost: 0,
  }
}

export function calcBedMaterial(state, materialRates = []) {
  const unit = state.dimensionUnit || 'in'
  let length = toInches(state.dimensions?.l ?? state.dimensions?.h, unit)
  let width = toInches(state.dimensions?.w, unit)
  const depth = toInches(state.dimensions?.d, unit) || 6

  if (state.sizeMode === 'standard' && state.bedSize) {
    const preset = BED_SIZES[state.bedSize]
    if (preset) {
      length = preset.length
      width = preset.width
    }
  }

  if (length <= 0 || width <= 0) {
    return emptyResult('bed')
  }

  const platform = sqFtFromInches(length, width)
  const sideRails = 2 * sqFtFromInches(length, depth)
  const endRail = sqFtFromInches(width, depth)
  const headboard = sqFtFromInches(width, num(state.headboardHeight) || 24)

  const bodyRate = findRate(
    materialRates,
    'body',
    state.material?.bodyBrand,
    state.material?.bodyThickness,
  )

  const components = [
    { name: 'Platform / Base', area: platform, panel: 'body', rate: bodyRate },
    { name: 'Side Rails', area: sideRails, panel: 'body', rate: bodyRate },
    { name: 'End Rail', area: endRail, panel: 'body', rate: bodyRate },
    { name: 'Headboard', area: headboard, panel: 'body', rate: bodyRate },
  ].map((c) => ({
    ...c,
    cost: c.area * c.rate,
  }))

  const bodyArea = components.reduce((s, c) => s + c.area, 0)
  const materialCost = components.reduce((s, c) => s + c.cost, 0)
  const cushionCost = state.cushionHeadboard ? CUSHION_HEADBOARD_COST : 0

  return {
    productType: 'bed',
    components,
    bodyArea,
    doorArea: 0,
    backArea: 0,
    totalArea: bodyArea,
    bodyCost: materialCost,
    doorCost: 0,
    backCost: 0,
    materialCost: materialCost + cushionCost,
    extraCost: cushionCost,
    cushionHeadboard: state.cushionHeadboard,
  }
}

function emptyResult(productType) {
  return {
    productType,
    components: [],
    bodyArea: 0,
    doorArea: 0,
    backArea: 0,
    totalArea: 0,
    bodyCost: 0,
    doorCost: 0,
    backCost: 0,
    materialCost: 0,
    extraCost: 0,
  }
}

export function calcProductMaterial(state, materialRates = []) {
  if (state.productType === 'bed') {
    return calcBedMaterial(state, materialRates)
  }
  return calcWardrobeMaterial(state, materialRates)
}
