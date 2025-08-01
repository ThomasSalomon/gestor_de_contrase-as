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
import SecurityNotice from "@/components/security-notice"
import LanguageSelector from "@/components/language-selector"
import { useLanguage } from "@/contexts/language-context"

interface LoginFormProps {
  onLogin: (username: string) => void
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { initSession, validatePassword } = useSecureSession()
  const [passwordStrength, setPasswordStrength] = useState<any>(null)
  const { t } = useLanguage()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const users = JSON.parse(localStorage.getItem("users") || "{}")
      const user = users[username]

      if (!user) {
        setError(t("login.userNotFound"))
        return
      }

      const isValid = await verifyPassword(password, user.hashedPassword)
      if (!isValid) {
        setError(t("login.incorrectPassword"))
        return
      }

      await initSession(password)
      onLogin(username)
    } catch (err) {
      setError(t("login.loginError"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const strength = validatePassword(password)
    if (!strength.isValid) {
      setError(`${t("login.weakPassword")}: ${strength.feedback.join(", ")}`)
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError(t("login.passwordsDontMatch"))
      setIsLoading(false)
      return
    }

    try {
      const users = JSON.parse(localStorage.getItem("users") || "{}")

      if (users[username]) {
        setError(t("login.userExists"))
        return
      }

      const hashedPassword = await hashPassword(password)
      users[username] = {
        hashedPassword,
        createdAt: new Date().toISOString(),
      }
      localStorage.setItem("users", JSON.stringify(users))

      await initSession(password)
      onLogin(username)
    } catch (err) {
      setError(t("login.createAccountError"))
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    if (value.length > 0) {
      setPasswordStrength(validatePassword(value))
    } else {
      setPasswordStrength(null)
    }
  }

  const getStrengthText = (score: number) => {
    if (score >= 4) return t("generator.strength.strong")
    if (score >= 3) return t("generator.strength.medium")
    return t("generator.strength.weak")
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      {/* Language Selector - Fixed position in top right */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSelector />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">{t("login.title")}</CardTitle>
          <CardDescription>{t("login.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <SecurityNotice />
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{t("login.signIn")}</TabsTrigger>
              <TabsTrigger value="register">{t("login.register")}</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">{t("login.username")}</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t("login.masterPassword")}</Label>
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
                  {isLoading ? t("login.signingIn") : t("login.signInButton")}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-username">{t("login.username")}</Label>
                  <Input
                    id="new-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">{t("login.masterPassword")}</Label>
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
                        {t("strength.label")}: {getStrengthText(passwordStrength.score)}
                      </div>
                      {passwordStrength.feedback.length > 0 && (
                        <ul className="text-red-600 space-y-1">
                          {passwordStrength.feedback.map((item: string, index: number) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">{t("login.confirmPassword")}</Label>
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
                  {isLoading ? t("login.creating") : t("login.registerButton")}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
