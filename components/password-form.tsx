"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Eye, EyeOff, Key } from "lucide-react"
import type { PasswordEntry } from "@/types/password"

interface PasswordFormProps {
  password?: PasswordEntry | null
  onSave: (password: Omit<PasswordEntry, "id">) => void
  onCancel: () => void
}

export default function PasswordForm({ password, onSave, onCancel }: PasswordFormProps) {
  const [formData, setFormData] = useState({
    domain: "",
    username: "",
    password: "",
    notes: "",
  })
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (password) {
      setFormData({
        domain: password.domain,
        username: password.username,
        password: password.password,
        notes: password.notes || "",
      })
    } else {
      setFormData({
        domain: "",
        username: "",
        password: "",
        notes: "",
      })
    }
  }, [password])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Key className="h-5 w-5 mr-2" />
            {password ? "Editar Contraseña" : "Nueva Contraseña"}
          </DialogTitle>
          <DialogDescription>
            {password
              ? "Modifica los datos de la contraseña existente"
              : "Agrega una nueva contraseña a tu bóveda segura"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="domain">Dominio/Sitio Web *</Label>
            <Input
              id="domain"
              placeholder="ejemplo.com"
              value={formData.domain}
              onChange={(e) => handleChange("domain", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Usuario/Email *</Label>
            <Input
              id="username"
              placeholder="usuario@ejemplo.com"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña segura"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Notas adicionales..."
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">{password ? "Actualizar" : "Guardar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
