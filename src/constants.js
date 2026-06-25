const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36)

/* -------------------------------------------------------------------------- */
/*  Hardware catalog                                                          */
/*  Structure: Category (main item) -> Types (with brand + price)            */
/* -------------------------------------------------------------------------- */

export const createCatalogType = (overrides = {}) => ({
  id: uid(),
  name: '',
  brand: '',
  price: 100, // default test price
  ...overrides,
})

export const createCatalogCategory = (overrides = {}) => ({
  id: uid(),
  name: '',
  types: [],
  ...overrides,
})

// All sub-items default to 100 for testing purposes.
export const getInitialCatalog = () => [
  createCatalogCategory({
    name: 'Hinges',
    types: [
      createCatalogType({ name: 'Soft-close Hinges', brand: 'Hettich', price: 100 }),
      createCatalogType({ name: 'Auto-close Hinges', brand: 'Ebco', price: 100 }),
      createCatalogType({ name: 'Hydraulic Hinges', brand: 'Hafele', price: 100 }),
    ],
  }),
  createCatalogCategory({
    name: 'Channels',
    types: [
      createCatalogType({ name: 'Telescopic Channels', brand: 'Hettich', price: 100 }),
      createCatalogType({ name: 'Ball Bearing Channels', brand: 'Ebco', price: 100 }),
      createCatalogType({ name: 'Soft-close Channels', brand: 'Hafele', price: 100 }),
    ],
  }),
  createCatalogCategory({
    name: 'Handles',
    types: [
      createCatalogType({ name: 'SS Handle', brand: 'Generic', price: 100 }),
      createCatalogType({ name: 'Profile Handle', brand: 'Generic', price: 100 }),
      createCatalogType({ name: 'Gola Profile', brand: 'Hafele', price: 100 }),
    ],
  }),
  createCatalogCategory({
    name: 'Minifix & Fittings',
    types: [
      createCatalogType({ name: 'Minifix Cam', brand: 'Hafele', price: 100 }),
      createCatalogType({ name: 'Dowel', brand: 'Generic', price: 100 }),
      createCatalogType({ name: 'Wall Bracket', brand: 'Ebco', price: 100 }),
    ],
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

  // 4. Labor & Machining
  machiningPerSqFt: '',
  installationPerSqFt: '',

  // 5. Final Pricing
  profitMargin: 20,
  taxPercent: 18,
  shipping: '',
})
