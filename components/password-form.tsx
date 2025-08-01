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
import { useLanguage } from "@/contexts/language-context"

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
  const { t } = useLanguage()

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
            {password ? t("passwordForm.editTitle") : t("passwordForm.newTitle")}
          </DialogTitle>
          <DialogDescription>{password ? t("passwordForm.editDesc") : t("passwordForm.newDesc")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="domain">{t("passwordForm.domainLabel")}</Label>
            <Input
              id="domain"
              placeholder={t("passwordForm.domainPlaceholder")}
              value={formData.domain}
              onChange={(e) => handleChange("domain", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">{t("passwordForm.usernameLabel")}</Label>
            <Input
              id="username"
              placeholder={t("passwordForm.usernamePlaceholder")}
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("passwordForm.passwordLabel")}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t("passwordForm.passwordPlaceholder")}
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
            <Label htmlFor="notes">{t("passwordForm.notesLabel")}</Label>
            <Textarea
              id="notes"
              placeholder={t("passwordForm.notesPlaceholder")}
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              {t("passwordList.cancel")}
            </Button>
            <Button type="submit">{password ? t("passwordForm.update") : t("passwordForm.save")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
