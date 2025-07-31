"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, Shield } from "lucide-react"
import { hashPassword, verifyPassword } from "@/lib/crypto"
import { useSecureSession } from "@/hooks/use-secure-session"

interface LoginFormProps {
  onLogin: (username: string) => void
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Agregar al inicio del componente:
  const { initSession, validatePassword } = useSecureSession()
  const [passwordStrength, setPasswordStrength] = useState<any>(null)

  // Reemplazar la función handleLogin:
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const users = JSON.parse(localStorage.getItem("users") || "{}")
      const user = users[username]

      if (!user) {
        setError("Usuario no encontrado")
        return
      }

      const isValid = await verifyPassword(password, user.hashedPassword)
      if (!isValid) {
        setError("Contraseña incorrecta")
        return
      }

      // Inicializar sesión segura
      await initSession(password)
      onLogin(username)
    } catch (err) {
      setError("Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  // Reemplazar la función handleRegister:
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validar fortaleza de contraseña
    const strength = validatePassword(password)
    if (!strength.isValid) {
      setError(`Contraseña débil: ${strength.feedback.join(", ")}`)
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    try {
      const users = JSON.parse(localStorage.getItem("users") || "{}")

      if (users[username]) {
        setError("El usuario ya existe")
        return
      }

      const hashedPassword = await hashPassword(password)
      users[username] = {
        hashedPassword,
        createdAt: new Date().toISOString(),
      }
      localStorage.setItem("users", JSON.stringify(users))

      // Inicializar sesión segura
      await initSession(password)
      onLogin(username)
    } catch (err) {
      setError("Error al crear la cuenta")
    } finally {
      setIsLoading(false)
    }
  }

  // Agregar función para mostrar fortaleza de contraseña en tiempo real:
  const handlePasswordChange = (value: string) => {
    setPassword(value)
    if (value.length > 0) {
      setPasswordStrength(validatePassword(value))
    } else {
      setPasswordStrength(null)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Gestor de Contraseñas</CardTitle>
          <CardDescription>Accede a tu bóveda segura de contraseñas</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Usuario</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña Principal</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  <Lock className="mr-2 h-4 w-4" />
                  {isLoading ? "Iniciando..." : "Iniciar Sesión"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-username">Usuario</Label>
                  <Input
                    id="new-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                {/* En el JSX del registro, reemplaza el input de contraseña: */}
                <div className="space-y-2">
                  <Label htmlFor="new-password">Contraseña Principal</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    required
                  />
                  {passwordStrength && (
                    <div className="text-xs space-y-1">
                      <div
                        className={`font-medium ${
                          passwordStrength.score >= 4
                            ? "text-green-600"
                            : passwordStrength.score >= 3
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        Fortaleza:{" "}
                        {passwordStrength.score >= 4 ? "Fuerte" : passwordStrength.score >= 3 ? "Media" : "Débil"}
                      </div>
                      {passwordStrength.feedback.length > 0 && (
                        <ul className="text-red-600 space-y-1">
                          {passwordStrength.feedback.map((item, index) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  <Shield className="mr-2 h-4 w-4" />
                  {isLoading ? "Creando..." : "Crear Cuenta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
