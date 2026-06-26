import { useMemo } from 'react'
import { calcProductMaterial } from '../utils/productMaterialCalc'

const num = (value) => {
  const n = typeof value === 'number' ? value : parseFloat(value)
  return Number.isFinite(n) ? n : 0
}

/**
 * Full estimation engine:
 * Material → Labor (45%) → Hardware + Extras → GST → Margin → Grand Total
 */
export function useQuotationMath(state, catalog = [], materialRates = []) {
  return useMemo(() => {
    const {
      hardwareEntries = {},
      enabledCategories = {},
      extraHardwareCost = '',
      transportCharge = '',
      installationCharge = '',
      gstEnabled = true,
      taxPercent = 18,
      marginPercent = 0,
    } = state

    // A. Material cost -------------------------------------------------------
    const material = calcProductMaterial(state, materialRates)
    const materialCost = material.materialCost

    // B. Labor = 45% of material (15% + 15% + 15%) ---------------------------
    const laborTotal = materialCost * 0.45
    const laborCutting = materialCost * 0.15
    const laborEdgeBanding = materialCost * 0.15
    const laborAssembling = materialCost * 0.15

    // C. Hardware ------------------------------------------------------------
    const hardwareLines = []
    const missingHardware = []

    ;(catalog || []).forEach((category) => {
      if (!enabledCategories[category.id]) return

      ;(category.types || []).forEach((type) => {
        const entry = hardwareEntries[type.id] || {}
        const quantity = num(entry.quantity)
        const unused = !!entry.unused
        const unitPrice =
          entry.unitPrice !== undefined && entry.unitPrice !== ''
            ? num(entry.unitPrice)
            : num(type.price)

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

    const catalogHardwareCost = hardwareLines.reduce((sum, i) => sum + i.lineTotal, 0)
    const customHardwareCost = num(extraHardwareCost)
    const hardwareCost = catalogHardwareCost + customHardwareCost

    const transport = num(transportCharge)
    const installation = num(installationCharge)
    const extraCharges = transport + installation

    // D. Subtotal ------------------------------------------------------------
    const subtotal = materialCost + laborTotal + hardwareCost + extraCharges

    // E. GST (optional) ------------------------------------------------------
    const taxAmount = gstEnabled ? subtotal * (num(taxPercent) / 100) : 0
    const afterTax = subtotal + taxAmount

    // F. Margin / discount at end --------------------------------------------
    const marginAmount = afterTax * (num(marginPercent) / 100)
    const grandTotal = afterTax + marginAmount

    return {
      material,
      materialCost,
      laborTotal,
      laborCutting,
      laborEdgeBanding,
      laborAssembling,
      laborCost: laborTotal,
      hardwareLines,
      hardwareCost,
      catalogHardwareCost,
      customHardwareCost,
      missingHardware,
      transport,
      installation,
      extraCharges,
      subtotal,
      gstEnabled,
      taxAmount,
      afterTax,
      marginAmount,
      marginPercent: num(marginPercent),
      grandTotal,
      // legacy aliases for summary compatibility
      boardCost: materialCost,
      totalArea: material.totalArea,
      actualArea: material.totalArea,
    }
  }, [state, catalog, materialRates])
}
