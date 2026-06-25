import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, Lock, User, Loader2 } from 'lucide-react'
import { signIn, signUp } from '../lib/api'

export default function LoginScreen({ onAuthed }) {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = mode === 'signin' ? await signIn(username, password) : await signUp(username, password)
      onAuthed(user)
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-7 shadow-card"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Calculator size={24} />
          </span>
          <h1 className="text-lg font-bold text-slate-800">Quotation Calculator</h1>
          <p className="text-sm text-slate-500">
            {mode === 'signin' ? 'Sign in to continue' : 'Create an account'}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-600">Username</span>
            <div className="flex items-center rounded-lg border border-slate-300 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
              <span className="pl-3 text-slate-400">
                <User size={16} />
              </span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="e.g. admin"
                className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
                required
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-600">Password</span>
            <div className="flex items-center rounded-lg border border-slate-300 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
              <span className="pl-3 text-slate-400">
                <Lock size={16} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                placeholder="••••••••"
                className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
                required
              />
            </div>
          </label>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() => {
              setMode((m) => (m === 'signin' ? 'signup' : 'signin'))
              setError('')
            }}
            className="font-semibold text-indigo-600 hover:text-indigo-700"
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </motion.div>
    </div>
  )
}
