"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Copy, RefreshCw, Key } from "lucide-react"

interface PasswordGeneratorProps {
  onClose: () => void
}

export default function PasswordGenerator({ onClose }: PasswordGeneratorProps) {
  const [length, setLength] = useState([16])
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [generatedPassword, setGeneratedPassword] = useState("")

  const generatePassword = () => {
    let charset = ""

    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz"
    if (includeNumbers) charset += "0123456789"
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"

    if (charset === "") {
      setGeneratedPassword("Selecciona al menos un tipo de carácter")
      return
    }

    let password = ""
    for (let i = 0; i < length[0]; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }

    setGeneratedPassword(password)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword)
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const getPasswordStrength = () => {
    if (!generatedPassword || generatedPassword.includes("Selecciona")) return ""

    let score = 0
    if (length[0] >= 12) score += 1
    if (includeUppercase) score += 1
    if (includeLowercase) score += 1
    if (includeNumbers) score += 1
    if (includeSymbols) score += 1

    if (score <= 2) return "Débil"
    if (score <= 3) return "Media"
    if (score <= 4) return "Fuerte"
    return "Muy Fuerte"
  }

  const getStrengthColor = () => {
    const strength = getPasswordStrength()
    switch (strength) {
      case "Débil":
        return "text-red-600"
      case "Media":
        return "text-yellow-600"
      case "Fuerte":
        return "text-blue-600"
      case "Muy Fuerte":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Key className="h-5 w-5 mr-2" />
            Generador de Contraseñas
          </DialogTitle>
          <DialogDescription>Crea contraseñas seguras y personalizables</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Longitud: {length[0]} caracteres</Label>
            <Slider value={length} onValueChange={setLength} max={50} min={4} step={1} className="w-full" />
          </div>

          <div className="space-y-3">
            <Label>Tipos de caracteres:</Label>

            <div className="flex items-center space-x-2">
              <Checkbox id="uppercase" checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
              <Label htmlFor="uppercase">Mayúsculas (A-Z)</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="lowercase" checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
              <Label htmlFor="lowercase">Minúsculas (a-z)</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="numbers" checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
              <Label htmlFor="numbers">Números (0-9)</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="symbols" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
              <Label htmlFor="symbols">Símbolos (!@#$%^&*)</Label>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Contraseña generada:</Label>
              {generatedPassword && (
                <span className={`text-sm font-medium ${getStrengthColor()}`}>{getPasswordStrength()}</span>
              )}
            </div>
            <div className="flex space-x-2">
              <Input
                value={generatedPassword}
                readOnly
                placeholder="Haz clic en 'Generar' para crear una contraseña"
                className="font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
                disabled={!generatedPassword || generatedPassword.includes("Selecciona")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button onClick={generatePassword}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Generar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
