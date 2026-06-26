import { supabase } from './supabase'
import { buildNextEstimateNumber } from '../utils/estimateNumber'

/* ----------------------------- Simple auth ------------------------------- */
/* NOTE: This is an app-level username/password gate stored in `app_users`.
   It is intentionally simple ("for now") and is NOT production-grade auth.   */

export async function signUp(username, password) {
  const uname = username.trim()
  if (!uname || !password) throw new Error('Username and password are required.')

  const { data: existing } = await supabase
    .from('app_users')
    .select('id')
    .eq('username', uname)
    .maybeSingle()
  if (existing) throw new Error('That username already exists. Try signing in.')

  const { data, error } = await supabase
    .from('app_users')
    .insert({ username: uname, password })
    .select('id, username')
    .single()
  if (error) throw new Error(error.message)
  return { id: data.id, username: data.username }
}

export async function signIn(username, password) {
  const uname = username.trim()
  const { data, error } = await supabase
    .from('app_users')
    .select('id, username, password')
    .eq('username', uname)
    .maybeSingle()
  if (error) throw new Error(error.message)
  if (!data || data.password !== password) {
    throw new Error('Invalid username or password.')
  }
  return { id: data.id, username: data.username }
}

/* ------------------------------- Catalog --------------------------------- */

const num = (v) => {
  const n = typeof v === 'number' ? v : parseFloat(v)
  return Number.isFinite(n) ? n : 0
}

export async function fetchCatalog() {
  const [{ data: categories, error: cErr }, { data: types, error: tErr }] = await Promise.all([
    supabase.from('catalog_categories').select('*').order('position').order('created_at'),
    supabase.from('catalog_types').select('*').order('position').order('created_at'),
  ])
  if (cErr) throw new Error(cErr.message)
  if (tErr) throw new Error(tErr.message)

  return (categories || []).map((c) => ({
    id: c.id,
    name: c.name,
    position: c.position,
    types: (types || [])
      .filter((t) => t.category_id === c.id)
      .map((t) => ({
        id: t.id,
        name: t.name,
        brand: t.brand || '',
        price: num(t.price),
        position: t.position,
      })),
  }))
}

export async function addCategory(name, position = 0) {
  const { data, error } = await supabase
    .from('catalog_categories')
    .insert({ name: name || 'New Category', position })
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function updateCategory(id, patch) {
  const { error } = await supabase.from('catalog_categories').update(patch).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function removeCategory(id) {
  const { error } = await supabase.from('catalog_categories').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function addType(categoryId, { name, brand = '', price = 100 }, position = 0) {
  const { data, error } = await supabase
    .from('catalog_types')
    .insert({ category_id: categoryId, name, brand, price: num(price), position })
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function updateType(id, patch) {
  const clean = { ...patch }
  if ('price' in clean) clean.price = num(clean.price)
  const { error } = await supabase.from('catalog_types').update(clean).eq('id', id)
  if (error) throw new Error(error.message)
}

/** Persist unit prices from a saved invoice back to the catalog. */
export async function syncCatalogPrices(catalog, hardwareEntries = {}) {
  const num = (v) => {
    const n = typeof v === 'number' ? v : parseFloat(v)
    return Number.isFinite(n) ? n : 0
  }
  const updates = []

  ;(catalog || []).forEach((category) => {
    ;(category.types || []).forEach((type) => {
      const entry = hardwareEntries[type.id] || {}
      if (entry.unused || num(entry.quantity) <= 0) return

      const price =
        entry.unitPrice !== undefined && entry.unitPrice !== ''
          ? num(entry.unitPrice)
          : num(type.price)

      // Only write when the user entered an amount on this invoice.
      if (entry.unitPrice !== undefined && entry.unitPrice !== '') {
        updates.push({ id: type.id, categoryId: category.id, price })
      }
    })
  })

  await Promise.all(updates.map((u) => updateType(u.id, { price: u.price })))
  return updates
}

export async function removeType(id) {
  const { error } = await supabase.from('catalog_types').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

/* ------------------------------- Invoices -------------------------------- */

export async function saveInvoice({ quoteNumber, projectName, clientName, grandTotal, data }) {
  const { data: row, error } = await supabase
    .from('invoices')
    .insert({
      quote_number: quoteNumber,
      project_name: projectName,
      client_name: clientName,
      grand_total: num(grandTotal),
      data,
    })
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  return row
}

export async function updateInvoice(id, { quoteNumber, projectName, clientName, grandTotal, data }) {
  const { data: row, error } = await supabase
    .from('invoices')
    .update({
      quote_number: quoteNumber,
      project_name: projectName,
      client_name: clientName,
      grand_total: num(grandTotal),
      data,
    })
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  return row
}

export async function getNextEstimateNumber() {
  const { data, error } = await supabase.from('invoices').select('quote_number')
  if (error) throw new Error(error.message)
  const numbers = (data || []).map((row) => row.quote_number).filter(Boolean)
  return buildNextEstimateNumber(numbers)
}

export async function listInvoices() {
  const { data, error } = await supabase
    .from('invoices')
    .select('id, quote_number, project_name, client_name, grand_total, created_at')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data || []
}

export async function getInvoice(id) {
  const { data, error } = await supabase.from('invoices').select('*').eq('id', id).single()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteInvoice(id) {
  const { error } = await supabase.from('invoices').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

/* ------------------------------- Realtime -------------------------------- */

export function subscribeCatalog(onChange) {
  const channel = supabase
    .channel('catalog-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'catalog_categories' }, onChange)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'catalog_types' }, onChange)
    .subscribe()
  return () => supabase.removeChannel(channel)
}

export function subscribeInvoices(onChange) {
  const channel = supabase
    .channel('invoice-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, onChange)
    .subscribe()
  return () => supabase.removeChannel(channel)
}
