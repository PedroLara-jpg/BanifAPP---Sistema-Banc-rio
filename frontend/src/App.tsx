import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import ManagerDashboard from './pages/manager/ManagerDashboard'
import ClientDashboard from './pages/client/ClientDashboard'
import Pix from './pages/client/Pix'
import Statement from './pages/client/Statement'
import Investments from './pages/client/Investments'

export default function App() {
  const { isAuthenticated, user } = useAuthStore()

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={user?.role === 'MANAGER' ? '/manager' : '/dashboard'} replace />
            ) : (
              <Login />
            )
          }
        />

        {/* Rotas do Gerente */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute role="MANAGER">
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Rotas do Cliente */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="CLIENT">
              <ClientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pix"
          element={
            <ProtectedRoute role="CLIENT">
              <Pix />
            </ProtectedRoute>
          }
        />
        <Route
          path="/statement"
          element={
            <ProtectedRoute role="CLIENT">
              <Statement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/investments"
          element={
            <ProtectedRoute role="CLIENT">
              <Investments />
            </ProtectedRoute>
          }
        />

        {/* Raiz */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to={user?.role === 'MANAGER' ? '/manager' : '/dashboard'} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
