export default function Field({
  label,
  value,
  onChange,
  type = 'number',
  prefix,
  suffix,
  placeholder = '0',
  min = 0,
  step = 'any',
  hint,
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-600">{label}</span>
      <div className="group flex items-center rounded-lg border border-slate-300 bg-white transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
        {prefix && (
          <span className="select-none pl-3 text-sm font-medium text-slate-400">{prefix}</span>
        )}
        <input
          type={type}
          inputMode={type === 'number' ? 'decimal' : undefined}
          value={value}
          min={type === 'number' ? min : undefined}
          step={type === 'number' ? step : undefined}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent px-3 py-2.5 text-sm text-slate-800 placeholder-slate-300 outline-none"
        />
        {suffix && (
          <span className="select-none whitespace-nowrap pr-3 text-sm font-medium text-slate-400">
            {suffix}
          </span>
        )}
      </div>
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  )
}
