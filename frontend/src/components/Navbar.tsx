import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services/authService'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const isManager = user?.role === 'MANAGER'

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch {}
    logout()
    navigate('/login')
  }

  const clientLinks = [
    { to: '/dashboard', label: 'Início' },
    { to: '/pix', label: 'Pix' },
    { to: '/statement', label: 'Extrato' },
    { to: '/investments', label: 'Investimentos' },
  ]

  const managerLinks = [{ to: '/manager', label: 'Painel Gerente' }]

  const links = isManager ? managerLinks : clientLinks

  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to={isManager ? '/manager' : '/dashboard'} className="text-xl font-bold tracking-wide">
            BANIF
          </Link>
          <div className="hidden sm:flex gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-200 hover:text-white hover:bg-blue-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{user?.nomeCompleto}</p>
            <p className="text-xs text-blue-300">{user?.role === 'MANAGER' ? 'Gerente' : 'Cliente'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-blue-700 hover:bg-red-600 transition-colors text-white text-sm px-4 py-1.5 rounded font-medium"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  )
}
