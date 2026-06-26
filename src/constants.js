import { buildNextEstimateNumber } from './utils/estimateNumber'

const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36)

/* -------------------------------------------------------------------------- */
/*  Hardware catalog                                                          */
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

/** Upgrade saved estimates from old cabinet-based form. */
export const migrateLegacyMaterial = (form = {}) => {
  if (form.productType) return form

  const first = form.cabinets?.[0]
  const dims = first?.dimensions || {}

  return {
    ...form,
    productType: 'wardrobe',
    sizeMode: 'custom',
    dimensionUnit: form.dimensionUnit || 'in',
    wardrobeDoors: 2,
    dimensions: {
      h: dims.h ?? form.height ?? '',
      w: dims.w ?? form.width ?? '',
      d: dims.d ?? form.depth ?? '',
    },
    structure: {
      racks_in_vertical:
        first?.structure?.racks_in_vertical ?? first?.structure?.shelves ?? '',
      dividers: first?.structure?.dividers ?? '',
    },
    material: form.material || {
      bodyBrand: 'Century',
      bodyThickness: '17mm',
      doorBrand: 'Century',
      doorThickness: '17mm',
      backBrand: 'Century',
      backThickness: '9mm',
    },
    gstEnabled: form.gstEnabled ?? true,
    marginPercent: form.marginPercent ?? form.profitMargin ?? 0,
    transportCharge: form.transportCharge ?? form.shipping ?? '',
    installationCharge: form.installationCharge ?? '',
    extraHardwareCost: form.extraHardwareCost ?? '',
  }
}

export const getInitialState = () => ({
  projectName: '',
  clientName: '',
  quoteNumber: buildNextEstimateNumber(),

  // Product & dimensions
  productType: 'wardrobe',
  sizeMode: 'custom',
  bedSize: 'king',
  cushionHeadboard: false,
  headboardHeight: 24,
  wardrobeDoors: 2,
  dimensionUnit: 'in',
  dimensions: { h: '', w: '', d: '' },
  structure: { racks_in_vertical: '', dividers: '' },

  // Material selection (brand + thickness per panel group)
  material: {
    bodyBrand: 'Century',
    bodyThickness: '17mm',
    doorBrand: 'Century',
    doorThickness: '17mm',
    backBrand: 'Century',
    backThickness: '9mm',
  },

  // Hardware
  hardwareEntries: {},
  enabledCategories: {},
  extraHardwareCost: '',

  // Overheads
  transportCharge: '',
  installationCharge: '',

  // Final pricing
  gstEnabled: true,
  taxPercent: 18,
  marginPercent: 0,

  // View mode
  clientView: false,
})
