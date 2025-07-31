"use client"

import { useState } from "react"
import LoginForm from "@/components/login-form"
import Dashboard from "@/components/dashboard"
import { useAppSecurity } from "@/hooks/use-app-security"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<string | null>(null)

  // Hook de seguridad para limpiar sesiones
  const { clearAllSessions } = useAppSecurity()

  const handleLogin = (username: string) => {
    setCurrentUser(username)
    setIsAuthenticated(true)
    // NO guardamos en localStorage para forzar login en cada sesión
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setIsAuthenticated(false)
    // Limpiar todas las sesiones
    clearAllSessions()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {!isAuthenticated ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <Dashboard currentUser={currentUser!} onLogout={handleLogout} />
      )}
    </div>
  )
}
