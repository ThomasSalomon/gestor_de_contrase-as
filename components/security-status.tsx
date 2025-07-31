"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertTriangle, CheckCircle } from "lucide-react"
import { useSecureSession } from "@/hooks/use-secure-session"

export default function SecurityStatus() {
  const { isSessionActive, sessionError } = useSecureSession()
  const [lastActivity, setLastActivity] = useState(Date.now())

  useEffect(() => {
    const updateActivity = () => setLastActivity(Date.now())

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"]
    events.forEach((event) => {
      document.addEventListener(event, updateActivity, true)
    })

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, updateActivity, true)
      })
    }
  }, [])

  if (sessionError) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{sessionError}</AlertDescription>
      </Alert>
    )
  }

  if (!isSessionActive) {
    return null
  }

  return (
    <Alert className="mb-4 border-green-200 bg-green-50">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-800">
        <div className="flex items-center justify-between">
          <span>Sesión segura activa - Datos encriptados con AES-256</span>
          <Shield className="h-4 w-4 text-green-600" />
        </div>
      </AlertDescription>
    </Alert>
  )
}
