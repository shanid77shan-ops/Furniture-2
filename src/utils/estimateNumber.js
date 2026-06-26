const PREFIX = 'EST'

/** Format: EST-2026-06-01 (year-month-sequence, sequence resets each month). */
export function formatEstimateNumber(date = new Date(), sequence = 1) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const seq = String(sequence).padStart(2, '0')
  return `${PREFIX}-${year}-${month}-${seq}`
}

export function getEstimatePrefix(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${PREFIX}-${year}-${month}-`
}

export function parseEstimateNumber(value) {
  const match = String(value || '').match(/^EST-(\d{4})-(\d{2})-(\d+)$/)
  if (!match) return null
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    sequence: Number(match[3]),
  }
}

/** Find the next sequence for the current calendar month from saved numbers. */
export function getNextSequence(existingNumbers = [], date = new Date()) {
  const prefix = getEstimatePrefix(date)
  let max = 0

  existingNumbers.forEach((num) => {
    if (!num || !String(num).startsWith(prefix)) return
    const parsed = parseEstimateNumber(num)
    if (parsed) max = Math.max(max, parsed.sequence)
  })

  return max + 1
}

export function buildNextEstimateNumber(existingNumbers = [], date = new Date()) {
  return formatEstimateNumber(date, getNextSequence(existingNumbers, date))
}
