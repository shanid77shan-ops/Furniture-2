export const CURRENCY = '₹'

/**
 * Format a number as a currency string (Indian numbering by default).
 */
export const formatCurrency = (value) => {
  const n = Number.isFinite(value) ? value : 0
  return (
    CURRENCY +
    n.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  )
}

export const formatNumber = (value, digits = 2) => {
  const n = Number.isFinite(value) ? value : 0
  return n.toLocaleString('en-IN', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}
