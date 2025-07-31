"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Info } from "lucide-react"

export default function SecurityNotice() {
  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <div className="space-y-2">
          <div className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            <span className="font-medium">Política de Seguridad Activa</span>
          </div>
          <ul className="text-sm space-y-1 ml-6">
            <li>• Debes iniciar sesión cada vez que abras la aplicación</li>
            <li>• La sesión se cierra automáticamente después de 30 minutos de inactividad</li>
            <li>• Todos los datos están encriptados con AES-256</li>
          </ul>
        </div>
      </AlertDescription>
    </Alert>
  )
}
