import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Plus, Trash2, Layers, RotateCcw, PackagePlus } from 'lucide-react'

const fieldClass =
  'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'

function CategoryBlock({
  category,
  updateCategory,
  commitCategory,
  removeCategory,
  addType,
  updateType,
  commitType,
  removeType,
}) {
  const [newType, setNewType] = useState({ name: '', brand: '', price: 100 })

  const handleAddType = () => {
    if (!newType.name.trim()) return
    addType(category.id, {
      name: newType.name.trim(),
      brand: newType.brand.trim(),
      price: newType.price === '' ? 0 : Number(newType.price),
    })
    setNewType({ name: '', brand: '', price: 100 })
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      {/* Category header */}
      <div className="flex items-center gap-2 border-b border-slate-100 p-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
          <Layers size={16} />
        </span>
        <input
          value={category.name}
          onChange={(e) => updateCategory(category.id, { name: e.target.value })}
          onBlur={(e) => commitCategory(category.id, { name: e.target.value })}
          placeholder="Main item name"
          className={`${fieldClass} flex-1 font-semibold text-slate-800`}
        />
        <button
          type="button"
          onClick={() => removeCategory(category.id)}
          title="Delete main item"
          className="shrink-0 rounded-md p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Types */}
      <div className="space-y-2 p-3">
        <div className="hidden grid-cols-12 gap-2 px-1 text-[11px] font-medium uppercase tracking-wide text-slate-400 sm:grid">
          <span className="col-span-5">Type</span>
          <span className="col-span-4">Brand</span>
          <span className="col-span-2">Price</span>
          <span className="col-span-1" />
        </div>

        <AnimatePresence initial={false}>
          {category.types.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-12 items-center gap-2"
            >
              <input
                value={t.name}
                onChange={(e) => updateType(category.id, t.id, { name: e.target.value })}
                onBlur={(e) => commitType(t.id, { name: e.target.value })}
                placeholder="Type name"
                className={`${fieldClass} col-span-12 sm:col-span-5`}
              />
              <input
                value={t.brand}
                onChange={(e) => updateType(category.id, t.id, { brand: e.target.value })}
                onBlur={(e) => commitType(t.id, { brand: e.target.value })}
                placeholder="Brand"
                className={`${fieldClass} col-span-7 sm:col-span-4`}
              />
              <div className="col-span-4 flex items-center rounded-lg border border-slate-300 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 sm:col-span-2">
                <span className="pl-2 text-sm text-slate-400">₹</span>
                <input
                  type="number"
                  min="0"
                  value={t.price}
                  onChange={(e) =>
                    updateType(category.id, t.id, {
                      price: e.target.value === '' ? '' : Number(e.target.value),
                    })
                  }
                  onBlur={(e) =>
                    commitType(t.id, { price: e.target.value === '' ? 0 : Number(e.target.value) })
                  }
                  className="w-full bg-transparent px-2 py-2 text-sm outline-none"
                />
              </div>
              <div className="col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeType(category.id, t.id)}
                  title="Delete type"
                  className="rounded-md p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {category.types.length === 0 && (
          <p className="rounded-lg bg-slate-50 px-3 py-3 text-center text-xs text-slate-400">
            No types yet. Add one below.
          </p>
        )}

        {/* Add type row */}
        <div className="grid grid-cols-12 items-center gap-2 border-t border-dashed border-slate-200 pt-3">
          <input
            value={newType.name}
            onChange={(e) => setNewType((p) => ({ ...p, name: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && handleAddType()}
            placeholder="New type name"
            className={`${fieldClass} col-span-12 sm:col-span-5`}
          />
          <input
            value={newType.brand}
            onChange={(e) => setNewType((p) => ({ ...p, brand: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && handleAddType()}
            placeholder="Brand"
            className={`${fieldClass} col-span-7 sm:col-span-4`}
          />
          <div className="col-span-3 flex items-center rounded-lg border border-slate-300 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 sm:col-span-2">
            <span className="pl-2 text-sm text-slate-400">₹</span>
            <input
              type="number"
              min="0"
              value={newType.price}
              onChange={(e) => setNewType((p) => ({ ...p, price: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && handleAddType()}
              className="w-full bg-transparent px-2 py-2 text-sm outline-none"
            />
          </div>
          <div className="col-span-2 flex justify-end sm:col-span-1">
            <button
              type="button"
              onClick={handleAddType}
              title="Add type"
              className="rounded-lg bg-indigo-600 p-2 text-white transition hover:bg-indigo-700 disabled:opacity-40"
              disabled={!newType.name.trim()}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CatalogManager({
  open,
  onClose,
  catalog,
  addCategory,
  updateCategory,
  commitCategory,
  removeCategory,
  addType,
  updateType,
  commitType,
  removeType,
  resetCatalog,
}) {
  const [newCategory, setNewCategory] = useState('')

  const handleAddCategory = () => {
    addCategory(newCategory.trim() || 'New Category')
    setNewCategory('')
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="no-print fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-slate-50 shadow-2xl sm:rounded-2xl"
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
                  <PackagePlus size={18} />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-slate-800">Hardware Catalog</h2>
                  <p className="text-xs text-slate-500">
                    Manage main items, brands, types & prices.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {catalog.map((category) => (
                <CategoryBlock
                  key={category.id}
                  category={category}
                  updateCategory={updateCategory}
                  commitCategory={commitCategory}
                  removeCategory={removeCategory}
                  addType={addType}
                  updateType={updateType}
                  commitType={commitType}
                  removeType={removeType}
                />
              ))}

              {catalog.length === 0 && (
                <p className="rounded-xl bg-white px-4 py-8 text-center text-sm text-slate-400">
                  No main items yet. Add your first one below.
                </p>
              )}

              {/* Add category */}
              <div className="flex items-center gap-2 rounded-xl border border-dashed border-indigo-300 bg-indigo-50/40 p-3">
                <input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                  placeholder="New main item (e.g. Hinges, Channels…)"
                  className={`${fieldClass} flex-1`}
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                >
                  <Plus size={16} /> Add Item
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-200 bg-white px-5 py-3">
              <button
                type="button"
                onClick={resetCatalog}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-700"
              >
                <RotateCcw size={15} /> Restore defaults
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-slate-800 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-900"
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
