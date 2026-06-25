import { useCallback, useEffect, useRef, useState } from 'react'
import { Calculator, LogOut, FileText, Loader2, AlertCircle, Pencil } from 'lucide-react'
import { getInitialState, getInitialCatalog } from './constants'
import { useQuotationMath } from './hooks/useQuotationMath'
import { isSupabaseConfigured } from './lib/supabase'
import * as api from './lib/api'
import ProjectSection from './components/sections/ProjectSection'
import MaterialSection from './components/sections/MaterialSection'
import HardwareSection from './components/sections/HardwareSection'
import LaborSection from './components/sections/LaborSection'
import MarginsSection from './components/sections/MarginsSection'
import QuotationSummary from './components/QuotationSummary'
import CatalogManager from './components/CatalogManager'
import MissingItemsModal from './components/MissingItemsModal'
import LoginScreen from './components/LoginScreen'
import InvoicesModal from './components/InvoicesModal'
import Toast from './components/Toast'

const USER_KEY = 'wc_user_v1'

const mapType = (row) => ({
  id: row.id,
  name: row.name,
  brand: row.brand || '',
  price: Number(row.price) || 0,
  position: row.position,
})

const loadUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export default function App() {
  const [user, setUser] = useState(loadUser)

  const [state, setState] = useState(getInitialState)
  const [catalog, setCatalog] = useState([])
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [catalogError, setCatalogError] = useState('')

  const [catalogOpen, setCatalogOpen] = useState(false)
  const [missingOpen, setMissingOpen] = useState(false)
  const [missingContext, setMissingContext] = useState('print') // 'print' | 'save'

  const [invoicesOpen, setInvoicesOpen] = useState(false)
  const [invoices, setInvoices] = useState([])
  const [invoicesLoading, setInvoicesLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [toast, setToast] = useState('')

  const catalogOpenRef = useRef(catalogOpen)
  catalogOpenRef.current = catalogOpen

  const calc = useQuotationMath(state, catalog)

  /* ------------------------------- Data load ------------------------------ */
  const refreshCatalog = useCallback(async () => {
    try {
      const data = await api.fetchCatalog()
      setCatalog(data)
      setCatalogError('')
    } catch (err) {
      setCatalogError(err.message || 'Failed to load catalog.')
    } finally {
      setCatalogLoading(false)
    }
  }, [])

  const refreshInvoices = useCallback(async () => {
    setInvoicesLoading(true)
    try {
      const data = await api.listInvoices()
      setInvoices(data)
    } catch {
      /* ignore */
    } finally {
      setInvoicesLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!user || !isSupabaseConfigured) return
    setCatalogLoading(true)
    refreshCatalog()
    refreshInvoices()

    const unsubCatalog = api.subscribeCatalog(() => {
      if (!catalogOpenRef.current) refreshCatalog()
    })
    const unsubInvoices = api.subscribeInvoices(() => refreshInvoices())
    return () => {
      unsubCatalog()
      unsubInvoices()
    }
  }, [user, refreshCatalog, refreshInvoices])

  // Auto-dismiss the success toast.
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2800)
    return () => clearTimeout(t)
  }, [toast])

  /* --------------------------------- Auth --------------------------------- */
  const handleAuthed = useCallback((u) => {
    setUser(u)
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(u))
    } catch {
      /* ignore */
    }
  }, [])

  const handleLogout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(USER_KEY)
  }, [])

  /* ------------------------------ Form fields ----------------------------- */
  const set = useCallback((key, value) => {
    setState((prev) => ({ ...prev, [key]: value }))
  }, [])

  const setHardwareEntry = useCallback((typeId, patch) => {
    setState((prev) => ({
      ...prev,
      hardwareEntries: {
        ...prev.hardwareEntries,
        [typeId]: { ...(prev.hardwareEntries[typeId] || {}), ...patch },
      },
    }))
  }, [])

  /* ----------------------------- Catalog CRUD ----------------------------- */
  const addCategory = useCallback(
    async (name) => {
      try {
        const row = await api.addCategory(name, catalog.length)
        setCatalog((prev) => [...prev, { id: row.id, name: row.name, position: row.position, types: [] }])
      } catch (err) {
        alert(err.message)
      }
    },
    [catalog.length],
  )

  const updateCategory = useCallback((id, patch) => {
    setCatalog((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }, [])

  const commitCategory = useCallback(async (id, patch) => {
    try {
      await api.updateCategory(id, patch)
    } catch (err) {
      alert(err.message)
    }
  }, [])

  const removeCategory = useCallback(async (id) => {
    setCatalog((prev) => prev.filter((c) => c.id !== id))
    try {
      await api.removeCategory(id)
    } catch (err) {
      alert(err.message)
    }
  }, [])

  const addType = useCallback((categoryId, type) => {
    const cat = catalog.find((c) => c.id === categoryId)
    const position = cat ? cat.types.length : 0
    api
      .addType(categoryId, type, position)
      .then((row) => {
        setCatalog((prev) =>
          prev.map((c) =>
            c.id === categoryId ? { ...c, types: [...c.types, mapType(row)] } : c,
          ),
        )
      })
      .catch((err) => alert(err.message))
  }, [catalog])

  const updateType = useCallback((categoryId, typeId, patch) => {
    setCatalog((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? { ...c, types: c.types.map((t) => (t.id === typeId ? { ...t, ...patch } : t)) }
          : c,
      ),
    )
  }, [])

  const commitType = useCallback(async (typeId, patch) => {
    try {
      await api.updateType(typeId, patch)
    } catch (err) {
      alert(err.message)
    }
  }, [])

  const removeType = useCallback(async (categoryId, typeId) => {
    setCatalog((prev) =>
      prev.map((c) =>
        c.id === categoryId ? { ...c, types: c.types.filter((t) => t.id !== typeId) } : c,
      ),
    )
    try {
      await api.removeType(typeId)
    } catch (err) {
      alert(err.message)
    }
  }, [])

  const resetCatalog = useCallback(async () => {
    if (!window.confirm('Restore the default catalog? This replaces ALL current items on the server.'))
      return
    try {
      const current = await api.fetchCatalog()
      await Promise.all(current.map((c) => api.removeCategory(c.id)))
      const defaults = getInitialCatalog()
      for (let i = 0; i < defaults.length; i += 1) {
        const d = defaults[i]
        const cat = await api.addCategory(d.name, i)
        for (let j = 0; j < d.types.length; j += 1) {
          const t = d.types[j]
          await api.addType(cat.id, { name: t.name, brand: t.brand, price: t.price }, j)
        }
      }
      await refreshCatalog()
    } catch (err) {
      alert(err.message)
    }
  }, [refreshCatalog])

  /* ------------------------------- Invoices ------------------------------- */
  // Persist the invoice, optionally print it, then start a fresh invoice.
  const commitInvoice = useCallback(
    async ({ print }) => {
      setSaving(true)
      const number = state.quoteNumber
      const wasEditing = Boolean(editingId)
      const payload = {
        quoteNumber: state.quoteNumber,
        projectName: state.projectName,
        clientName: state.clientName,
        grandTotal: calc.grandTotal,
        data: { version: 1, form: state },
      }
      try {
        if (editingId) {
          await api.updateInvoice(editingId, payload)
        } else {
          await api.saveInvoice(payload)
        }
        refreshInvoices()
        // Print the current invoice (DOM still reflects this quote) before reset.
        if (print) window.print()
        setToast(`Invoice ${number} ${wasEditing ? 'updated' : 'saved'} successfully`)
        setEditingId(null)
        setState(getInitialState())
      } catch (err) {
        alert(err.message)
      } finally {
        setSaving(false)
      }
    },
    [state, calc.grandTotal, editingId, refreshInvoices],
  )

  // Both "Save Invoice" and "Print / PDF" persist the invoice. They are
  // blocked (with a reminder) until every hardware item is resolved.
  const handleSaveInvoice = useCallback(() => {
    if (calc.missingHardware.length > 0) {
      setMissingContext('save')
      setMissingOpen(true)
    } else {
      commitInvoice({ print: false })
    }
  }, [calc.missingHardware.length, commitInvoice])

  const handleEditInvoice = useCallback(async (id) => {
    try {
      const row = await api.getInvoice(id)
      const form = row?.data?.form
      if (form) {
        setState({ ...getInitialState(), ...form })
        setEditingId(id)
        setInvoicesOpen(false)
        setToast(`Editing invoice ${row.quote_number || ''}`.trim())
      }
    } catch (err) {
      alert(err.message)
    }
  }, [])

  const handleDeleteInvoice = useCallback(
    async (id) => {
      if (!window.confirm('Delete this saved invoice?')) return
      setInvoices((prev) => prev.filter((i) => i.id !== id))
      if (id === editingId) setEditingId(null)
      try {
        await api.deleteInvoice(id)
      } catch (err) {
        alert(err.message)
      }
    },
    [editingId],
  )

  /* ------------------------------- Actions -------------------------------- */
  const handleReset = useCallback(() => {
    if (window.confirm('Clear all inputs and start a new quotation?')) {
      setState(getInitialState())
      setEditingId(null)
    }
  }, [])

  const handleGenerate = useCallback(() => {
    if (calc.missingHardware.length > 0) {
      setMissingContext('print')
      setMissingOpen(true)
    } else {
      commitInvoice({ print: true })
    }
  }, [calc.missingHardware.length, commitInvoice])

  /* -------------------------------- Render -------------------------------- */
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
          <AlertCircle className="mx-auto mb-2" />
          Supabase isn’t configured. Add <code>VITE_SUPABASE_URL</code> and{' '}
          <code>VITE_SUPABASE_ANON_KEY</code> to your <code>.env</code> file and restart the dev
          server.
        </div>
      </div>
    )
  }

  if (!user) return <LoginScreen onAuthed={handleAuthed} />

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="no-print sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Calculator size={20} />
          </span>
          <div className="mr-auto">
            <h1 className="text-base font-bold text-slate-800 sm:text-lg">
              Quotation & Estimate Calculator
            </h1>
            <p className="hidden text-sm text-slate-500 sm:block">
              Particle Board Furniture Manufacturing
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setInvoicesOpen(true)
              refreshInvoices()
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <FileText size={16} /> <span className="hidden sm:inline">Invoices</span>
          </button>
          <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm">
            <span className="font-medium text-slate-600">{user.username}</span>
            <button
              type="button"
              onClick={handleLogout}
              title="Log out"
              className="text-slate-400 transition hover:text-red-500"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {catalogError && (
          <div className="no-print mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={16} /> {catalogError}
          </div>
        )}
        {editingId && (
          <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <span className="flex items-center gap-2">
              <Pencil size={15} /> Editing invoice <strong>{state.quoteNumber}</strong> — “Update
              Invoice” saves your changes.
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-md border border-amber-300 bg-white px-3 py-1 text-xs font-medium text-amber-700 transition hover:bg-amber-100"
            >
              Cancel & start new
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Left: Inputs */}
          <div className="no-print space-y-6">
            <ProjectSection state={state} set={set} />
            <MaterialSection state={state} set={set} calc={calc} />
            {catalogLoading ? (
              <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-400">
                <Loader2 size={18} className="animate-spin" /> Loading hardware catalog…
              </div>
            ) : (
              <HardwareSection
                state={state}
                calc={calc}
                catalog={catalog}
                setHardwareEntry={setHardwareEntry}
                onManageCatalog={() => setCatalogOpen(true)}
              />
            )}
            <LaborSection state={state} set={set} calc={calc} />
            <MarginsSection state={state} set={set} calc={calc} />
          </div>

          {/* Right: Live summary / invoice */}
          <div>
            <QuotationSummary
              state={state}
              calc={calc}
              onPrint={handleGenerate}
              onReset={handleReset}
              onSave={handleSaveInvoice}
              saving={saving}
              isEditing={Boolean(editingId)}
            />
          </div>
        </div>
      </main>

      <footer className="no-print mx-auto max-w-6xl px-4 pb-8 text-center text-xs text-slate-400 sm:px-6">
        Data syncs live with your Supabase backend. Saved invoices are available on any device.
      </footer>

      <CatalogManager
        open={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        catalog={catalog}
        addCategory={addCategory}
        updateCategory={updateCategory}
        commitCategory={commitCategory}
        removeCategory={removeCategory}
        addType={addType}
        updateType={updateType}
        commitType={commitType}
        removeType={removeType}
        resetCatalog={resetCatalog}
      />

      <MissingItemsModal
        open={missingOpen}
        context={missingContext}
        items={calc.missingHardware}
        onClose={() => setMissingOpen(false)}
      />

      <InvoicesModal
        open={invoicesOpen}
        onClose={() => setInvoicesOpen(false)}
        invoices={invoices}
        loading={invoicesLoading}
        editingId={editingId}
        onEdit={handleEditInvoice}
        onDelete={handleDeleteInvoice}
      />

      <Toast message={toast} />
    </div>
  )
}
