import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/authStore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authService.login(email, senha)
      login(res.token, res.user)
      navigate(res.user.role === 'MANAGER' ? '/manager' : '/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Credenciais inválidas.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white tracking-widest">BANIF</h1>
          <p className="text-blue-200 mt-2 text-sm">Sistema Bancário Digital</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Acessar sua conta</h2>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors mt-2"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-xs text-slate-400 text-center mt-6">
            BANIF © {new Date().getFullYear()} — Sistema Bancário Seguro
          </p>
        </div>
      </div>
    </div>
  )
}
