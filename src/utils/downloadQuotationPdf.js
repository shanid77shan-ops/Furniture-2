import { jsPDF } from 'jspdf'

const COMPANY = {
  name: 'Inspire Furnitures',
  tagline: 'Particle Board Furniture Manufacturing',
  contact: 'hello@inspirefurnitures.example  |  +91 98765 43210',
}

export function downloadQuotationPdf({ state, calc, clientView = false }) {
  const doc = new jsPDF()
  const today = new Date().toLocaleDateString('en-IN')
  let y = 20

  const line = (text, size = 10, style = 'normal') => {
    doc.setFont('helvetica', style)
    doc.setFontSize(size)
    doc.text(text, 14, y)
    y += size * 0.5 + 4
  }

  line(COMPANY.name, 16, 'bold')
  line(COMPANY.tagline, 9)
  line(COMPANY.contact, 8)
  y += 4
  line(`Estimate No: ${state.quoteNumber || '—'}`, 10, 'bold')
  line(`Date: ${today}`, 9)
  line(`Product: ${state.projectName || '—'}`, 9)
  line(`Client: ${state.clientName || '—'}`, 9)
  line(`Type: ${(state.productType || 'wardrobe').toUpperCase()}`, 9)
  y += 4

  line('— Cost Summary —', 11, 'bold')

  line(`Material Cost: ₹${calc.materialCost.toFixed(2)}`, 10)

  if (!clientView) {
    line(`  Labor (45%): ₹${calc.laborTotal.toFixed(2)}`, 9)
    line(`    Cutting (15%): ₹${calc.laborCutting.toFixed(2)}`, 8)
    line(`    Edge Banding (15%): ₹${calc.laborEdgeBanding.toFixed(2)}`, 8)
    line(`    Assembling (15%): ₹${calc.laborAssembling.toFixed(2)}`, 8)
  } else {
    line(`Labor & Fabrication: ₹${calc.laborTotal.toFixed(2)}`, 10)
  }

  line(`Hardware: ₹${calc.hardwareCost.toFixed(2)}`, 10)
  if (calc.extraCharges > 0) {
    line(`Transport & Installation: ₹${calc.extraCharges.toFixed(2)}`, 9)
  }
  line(`Subtotal: ₹${calc.subtotal.toFixed(2)}`, 10)

  if (state.gstEnabled && calc.taxAmount > 0) {
    line(`GST (${state.taxPercent || 18}%): ₹${calc.taxAmount.toFixed(2)}`, 10)
  }
  if (calc.marginAmount !== 0) {
    line(`Margin/Discount (${state.marginPercent || 0}%): ₹${calc.marginAmount.toFixed(2)}`, 10)
  }

  y += 2
  line(`GRAND TOTAL: ₹${calc.grandTotal.toFixed(2)}`, 14, 'bold')

  y += 8
  doc.setFontSize(8)
  doc.setTextColor(120)
  doc.text(
    'This is a system-generated estimate valid for 15 days. Prices subject to final measurements.',
    14,
    y,
  )

  doc.save(`${state.quoteNumber || 'estimate'}.pdf`)
}
