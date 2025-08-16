"use client"

import { useState, useEffect, useMemo, lazy, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, Plus, Search, Key } from "lucide-react"
import PasswordList from "@/components/password-list"
import SecurityStatus from "@/components/security-status"
import LanguageSelector from "@/components/language-selector"
import type { PasswordEntry } from "@/types/password"
import { secureStorage } from "@/lib/secure-storage"
import { useLanguage } from "@/contexts/language-context"

// Lazy loading para componentes modales
const PasswordForm = lazy(() => import("@/components/password-form"))
const PasswordGenerator = lazy(() => import("@/components/password-generator"))
const DevTools = lazy(() => import("@/components/dev-tools"))

interface DashboardProps {
  currentUser: string
  onLogout: () => void
}

export default function Dashboard({ currentUser, onLogout }: DashboardProps) {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [showGenerator, setShowGenerator] = useState(false)
  const [editingPassword, setEditingPassword] = useState<PasswordEntry | null>(null)
  const { t } = useLanguage()

  useEffect(() => {
    loadPasswords()

    return () => {
      setPasswords([])
      setSearchTerm("")
    }
  }, [currentUser])

  const loadPasswords = async () => {
    try {
      const passwords = await secureStorage.getSecureItem(`passwords_${currentUser}`)
      setPasswords(passwords || [])
    } catch (error) {
      console.error("Error loading passwords:", error)
      setPasswords([])
    }
  }

  // Funciones para DevTools (solo en desarrollo)
  const handleLoadMockData = async (mockPasswords: PasswordEntry[]) => {
    try {
      setPasswords(mockPasswords)
      // Opcional: guardar en almacenamiento seguro para persistencia
      await secureStorage.setSecureItem(`passwords_${currentUser}`, mockPasswords)
      console.log(`Cargados ${mockPasswords.length} datos ficticios`)
    } catch (error) {
      console.error("Error loading mock data:", error)
    }
  }

  const handleClearMockData = async () => {
    try {
      setPasswords([])
      await secureStorage.removeSecureItem(`passwords_${currentUser}`)
      console.log("Datos ficticios limpiados")
    } catch (error) {
      console.error("Error clearing mock data:", error)
    }
  }

  const savePasswords = async (newPasswords: PasswordEntry[]) => {
    try {
      await secureStorage.setSecureItem(`passwords_${currentUser}`, newPasswords)
      setPasswords(newPasswords)
    } catch (error) {
      console.error("Error saving passwords:", error)
    }
  }

  const handleAddPassword = (passwordData: Omit<PasswordEntry, "id">) => {
    const newPassword: PasswordEntry = {
      ...passwordData,
      id: Date.now().toString(),
    }
    const updatedPasswords = [...passwords, newPassword]
    savePasswords(updatedPasswords)
    setShowForm(false)
  }

  const handleEditPassword = (passwordData: Omit<PasswordEntry, "id">) => {
    if (!editingPassword) return

    const updatedPasswords = passwords.map((p) =>
      p.id === editingPassword.id ? { ...passwordData, id: editingPassword.id } : p,
    )
    savePasswords(updatedPasswords)
    setEditingPassword(null)
    setShowForm(false)
  }

  const handleDeletePassword = (id: string) => {
    const updatedPasswords = passwords.filter((p) => p.id !== id)
    savePasswords(updatedPasswords)
  }

  const filteredPasswords = useMemo(() => {
    return passwords.filter(
      (password) =>
        password.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        password.username.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [passwords, searchTerm])

  const startEdit = (password: PasswordEntry) => {
    setEditingPassword(password)
    setShowForm(true)
  }

  const cancelEdit = () => {
    setEditingPassword(null)
    setShowForm(false)
  }

  const handleLogout = () => {
    setPasswords([])
    setSearchTerm("")
    secureStorage.clearSession()
    onLogout()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Key className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">{t("dashboard.title")}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <span className="text-sm text-gray-600">
                {t("dashboard.welcome")}, {currentUser}
              </span>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                {t("dashboard.logout")}
              </Button>
            </div>
          </div>
        </div>
      </header>
      <SecurityStatus />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t("dashboard.search")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowGenerator(true)} variant="outline">
                <Key className="h-4 w-4 mr-2" />
                {t("dashboard.generatePassword")}
              </Button>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t("dashboard.newPassword")}
              </Button>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {t("dashboard.myPasswords")} ({filteredPasswords.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PasswordList passwords={filteredPasswords} onEdit={startEdit} onDelete={handleDeletePassword} />
          </CardContent>
        </Card>

        {showForm && (
          <Suspense fallback={<div className="flex items-center justify-center p-4">Cargando...</div>}>
            <PasswordForm
              password={editingPassword}
              onSave={editingPassword ? handleEditPassword : handleAddPassword}
              onCancel={cancelEdit}
            />
          </Suspense>
        )}

        {showGenerator && (
          <Suspense fallback={<div className="flex items-center justify-center p-4">Cargando...</div>}>
            <PasswordGenerator onClose={() => setShowGenerator(false)} />
          </Suspense>
        )}

        {/* Herramientas de desarrollo - Solo visible en desarrollo */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8">
            <Suspense fallback={<div className="flex items-center justify-center p-4">Cargando DevTools...</div>}>
              <DevTools 
                onLoadData={handleLoadMockData}
                onClearData={handleClearMockData}
              />
            </Suspense>
          </div>
        )}
      </main>
    </div>
  )
}
