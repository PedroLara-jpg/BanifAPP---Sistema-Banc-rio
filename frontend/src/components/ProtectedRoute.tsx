import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

interface Props {
  children: React.ReactNode
  role?: 'MANAGER' | 'CLIENT'
}

export default function ProtectedRoute({ children, role }: Props) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (role && user?.role !== role) {
    const redirect = user?.role === 'MANAGER' ? '/manager' : '/dashboard'
    return <Navigate to={redirect} replace />
  }

  return <>{children}</>
}
