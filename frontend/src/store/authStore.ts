import { create } from 'zustand'
import type { AuthState, User } from '../types'

const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem('banif_user')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('banif_token'),
  user: getStoredUser(),
  isAuthenticated: !!localStorage.getItem('banif_token'),

  login: (token: string, user: User) => {
    localStorage.setItem('banif_token', token)
    localStorage.setItem('banif_user', JSON.stringify(user))
    set({ token, user, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('banif_token')
    localStorage.removeItem('banif_user')
    set({ token: null, user: null, isAuthenticated: false })
  },
}))
