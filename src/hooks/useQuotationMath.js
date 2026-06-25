import { useMemo } from 'react'

/**
 * Safely coerce any form value (string | number | '') to a finite number.
 */
const num = (value) => {
  const n = typeof value === 'number' ? value : parseFloat(value)
  return Number.isFinite(n) ? n : 0
}

/**
 * useQuotationMath
 * -----------------
 * Pure calculation hook for a particle-board furniture quotation.
 * All business/industry math lives here so the UI stays presentational.
 *
 * @param {object} state - the full quotation form state.
 * @param {Array} catalog - hardware catalog (categories -> types).
 * @returns {object} a fully derived breakdown of the estimate.
 */
export function useQuotationMath(state, catalog = []) {
  return useMemo(() => {
    const {
      requiredArea,
      costPerSqFt,
      wastagePercent,
      runningMeters,
      edgeCostPerMeter,
      hardwareEntries = {},
      machiningPerSqFt,
      installationPerSqFt,
      profitMargin,
      taxPercent,
      shipping,
    } = state

    // 1. Particle Board ----------------------------------------------------
    const reqArea = num(requiredArea)
    const wastage = num(wastagePercent)
    const actualArea = reqArea + reqArea * (wastage / 100)
    const boardCost = actualArea * num(costPerSqFt)

    // 2. Edge Banding ------------------------------------------------------
    const edgeCost = num(runningMeters) * num(edgeCostPerMeter)

    // 3. Hardware & Accessories -------------------------------------------
    // Walk the whole catalog; only items with a quantity (and not flagged
    // "unused") contribute to the estimate. "missing" tracks items the user
    // neither quantified nor explicitly skipped.
    const hardwareLines = []
    const missingHardware = []

    ;(catalog || []).forEach((category) => {
      ;(category.types || []).forEach((type) => {
        const entry = hardwareEntries[type.id] || {}
        const quantity = num(entry.quantity)
        const unused = !!entry.unused
        const unitPrice = num(type.price)

        if (unused) return

        if (quantity > 0) {
          hardwareLines.push({
            id: type.id,
            categoryName: category.name,
            name: type.name,
            brand: type.brand,
            quantity,
            unitPrice,
            lineTotal: quantity * unitPrice,
          })
        } else {
          missingHardware.push({
            id: type.id,
            categoryName: category.name,
            name: type.name,
            brand: type.brand,
          })
        }
      })
    })

    const hardwareCost = hardwareLines.reduce((sum, i) => sum + i.lineTotal, 0)

    // 4. Labor & Machining -------------------------------------------------
    const laborRate = num(machiningPerSqFt) + num(installationPerSqFt)
    const laborCost = actualArea * laborRate

    // 5. Final Estimate Pricing -------------------------------------------
    const subtotal = boardCost + edgeCost + hardwareCost + laborCost
    const profitAmount = subtotal * (num(profitMargin) / 100)
    const preTaxTotal = subtotal + profitAmount
    const taxAmount = preTaxTotal * (num(taxPercent) / 100)
    // Transport / shipping is a flat pass-through added after tax.
    const shippingCharge = num(shipping)
    const grandTotal = preTaxTotal + taxAmount + shippingCharge

    return {
      actualArea,
      boardCost,
      edgeCost,
      hardwareLines,
      hardwareCost,
      missingHardware,
      laborCost,
      subtotal,
      profitAmount,
      preTaxTotal,
      taxAmount,
      shippingCharge,
      grandTotal,
    }
  }, [state, catalog])
}
