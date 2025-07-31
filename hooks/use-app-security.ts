"use client"

import { useEffect } from "react"
import { secureStorage } from "@/lib/secure-storage"

export function useAppSecurity() {
  useEffect(() => {
    // Limpiar cualquier sesión previa al cargar la aplicación
    secureStorage.clearSession()

    // Configurar limpieza al cerrar la aplicación
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      secureStorage.clearSession()

      // Opcional: mostrar confirmación al usuario
      const message = "¿Estás seguro de que quieres cerrar la aplicación? Se cerrará tu sesión por seguridad."
      event.returnValue = message
      return message
    }

    // Configurar limpieza al perder el foco (opcional, más estricto)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Opcional: limpiar sesión cuando se oculta la aplicación
        console.log("Aplicación oculta - manteniendo sesión activa")
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  return {
    clearAllSessions: () => {
      secureStorage.clearSession()
      sessionStorage.clear()
      // No limpiar localStorage porque contiene las cuentas de usuario
    },
  }
}
