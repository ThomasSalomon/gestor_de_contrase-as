"use client"

import { useState, useEffect, useCallback } from "react"
import { secureStorage } from "@/lib/secure-storage"
import { validatePasswordStrength } from "@/lib/crypto"

export function useSecureSession() {
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [sessionError, setSessionError] = useState<string | null>(null)

  useEffect(() => {
    // Verificar si hay una sesión activa al montar
    setIsSessionActive(secureStorage.isSessionActive())

    // Escuchar eventos de expiración de sesión
    const handleSessionExpired = () => {
      setIsSessionActive(false)
      setSessionError("Sesión expirada por inactividad")
    }

    window.addEventListener("sessionExpired", handleSessionExpired)

    // Resetear timeout en actividad del usuario
    const resetTimeout = () => {
      secureStorage.resetSessionTimeout()
    }

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"]
    events.forEach((event) => {
      document.addEventListener(event, resetTimeout, true)
    })

    return () => {
      window.removeEventListener("sessionExpired", handleSessionExpired)
      events.forEach((event) => {
        document.removeEventListener(event, resetTimeout, true)
      })
    }
  }, [])

  const initSession = useCallback(async (masterPassword: string) => {
    try {
      setSessionError(null)
      await secureStorage.initSession(masterPassword)
      setIsSessionActive(true)
    } catch (error) {
      setSessionError("Error al inicializar sesión segura")
      throw error
    }
  }, [])

  const endSession = useCallback(() => {
    secureStorage.endSession()
    setIsSessionActive(false)
    setSessionError(null)
  }, [])

  const validatePassword = useCallback((password: string) => {
    return validatePasswordStrength(password)
  }, [])

  return {
    isSessionActive,
    sessionError,
    initSession,
    endSession,
    validatePassword,
    clearError: () => setSessionError(null),
  }
}
