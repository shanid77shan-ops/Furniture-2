const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36)

/* -------------------------------------------------------------------------- */
/*  Hardware catalog                                                          */
/*  Structure: Category (main item) -> Types (name + optional brand + price)  */
/* -------------------------------------------------------------------------- */

export const createCatalogType = (overrides = {}) => ({
  id: uid(),
  name: '',
  brand: '',
  price: 0,
  ...overrides,
})

export const createCatalogCategory = (overrides = {}) => ({
  id: uid(),
  name: '',
  types: [],
  ...overrides,
})

const t = (name, brand = '') => createCatalogType({ name, brand, price: 0 })
const sizes = (brand, list) => list.map((s) => t(s, brand))
const plain = (list) => list.map((name) => t(name, name))

/** Inspire Furnitures — main items (@) and types (:). Prices default to 0. */
export const getInitialCatalog = () => [
  createCatalogCategory({
    name: 'Box 17 mm Particle Board',
    types: plain(['Century', 'Merino', 'Panalex', 'K board']),
  }),
  createCatalogCategory({
    name: 'DOOR 17 mm Particle Board',
    types: plain(['Century', 'Merino', 'Panalex', 'K board', 'UV finish']),
  }),
  createCatalogCategory({
    name: '9 mm Particle Board',
    types: plain(['Century', 'K board']),
  }),
  createCatalogCategory({
    name: 'Multi Wood',
    types: [t('17 mm'), t('12 mm'), t('4 mm')],
  }),
  createCatalogCategory({
    name: 'L-clamp',
    types: [t('4 hole'), t('2 hole')],
  }),
  createCatalogCategory({
    name: 'Screw',
    types: [t('Standard')],
  }),
  createCatalogCategory({
    name: 'Edge Band',
    types: [t('2 mm'), t('1.3 mm'), t('0.5 mm')],
  }),
  createCatalogCategory({
    name: 'Glue',
    types: [t('Standard')],
  }),
  createCatalogCategory({
    name: 'Foam Fix Glue',
    types: [t('Standard')],
  }),
  createCatalogCategory({
    name: 'Lock',
    types: plain(['Champion', 'Elephant', 'Bonus']),
  }),
  createCatalogCategory({
    name: 'Lock Clamp',
    types: [t('Steel'), t('Normal')],
  }),
  createCatalogCategory({
    name: 'Hinges',
    types: plain(['Germo', 'Normal', 'Spider', 'Soft close']),
  }),
  createCatalogCategory({
    name: 'Bushes',
    types: [t('Wardrobe'), t('Cot'), t('Cabinet')],
  }),
  createCatalogCategory({
    name: 'Sliders',
    types: [
      ...sizes('Germo', ['10 inch', '12 inch', '14 inch']),
      ...sizes('Spider', ['10 inch', '12 inch', '14 inch']),
      ...sizes('Ebco', ['10 inch', '12 inch', '14 inch']),
    ],
  }),
  createCatalogCategory({
    name: 'Mirror',
    types: [
      ...sizes('3 mm', ['3 ft', '4 ft', '5 ft', '6 ft']),
      ...sizes('4 mm', ['3 ft', '4 ft', '5 ft', '6 ft']),
      ...sizes('6 mm', ['5 ft', '6 ft']),
    ],
  }),
  createCatalogCategory({
    name: 'Handles',
    types: [
      ...sizes('Cabinet', ['3"', '4"']),
      ...sizes('Pipe model', ['6"', '8"', '16"']),
      ...sizes('V type black', ['2"', '4"', '6"', '12"', '18"', '24"']),
      ...sizes('Wooden', ['6"', '8"', '12"', '18"', '24"']),
      ...sizes('Premium black', ['4"', '6"', '12"', '18"', '24"', '36"']),
      ...sizes('Premium gold', ['4"', '6"', '12"', '18"', '24"', '36"']),
    ],
  }),
  createCatalogCategory({
    name: 'Magnet',
    types: [t('Heavy'), t('Normal')],
  }),
  createCatalogCategory({
    name: 'Hanger Socket',
    types: [t('Premium'), t('Normal')],
  }),
  createCatalogCategory({
    name: 'Legs',
    types: [t('Black'), t('Wood'), t('Gold')],
  }),
  createCatalogCategory({
    name: 'Labour',
    types: [t('Standard')],
  }),
  createCatalogCategory({
    name: 'Goods',
    types: [t('Standard')],
  }),
]

/* -------------------------------------------------------------------------- */
/*  Hardware usage                                                            */
/*  Every catalog type is shown to the user. Per type we only store the       */
/*  quantity the user enters and whether they marked it as "unused".          */
/*  Shape: { [typeId]: { quantity: string|number, unused: boolean } }         */
/* -------------------------------------------------------------------------- */

export const getInitialState = () => ({
  // Project meta
  projectName: '',
  clientName: '',
  quoteNumber: 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),

  // 1. Particle Board
  requiredArea: '',
  costPerSqFt: '',
  wastagePercent: 15,

  // 2. Edge Banding
  runningMeters: '',
  edgeCostPerMeter: '',

  // 3. Hardware & Accessories (quantities keyed by catalog type id)
  hardwareEntries: {},
  // Main items the user has ticked to show types { [categoryId]: true }
  enabledCategories: {},

  // 4. Labor & Machining
  machiningPerSqFt: '',
  installationPerSqFt: '',

  // 5. Final Pricing
  profitMargin: 20,
  taxPercent: 18,
  shipping: '',
})
