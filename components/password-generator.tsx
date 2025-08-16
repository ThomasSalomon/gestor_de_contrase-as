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
import { useLanguage } from "@/contexts/language-context"

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
  const { t } = useLanguage()

  const generatePassword = () => {
    let charset = ""

    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz"
    if (includeNumbers) charset += "0123456789"
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"

    if (charset === "") {
      setGeneratedPassword(t("generator.selectCharacters"))
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
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const getPasswordStrength = () => {
    if (!generatedPassword || generatedPassword.includes(t("generator.selectCharacters"))) return ""

    let score = 0
    if (length[0] >= 12) score += 1
    if (includeUppercase) score += 1
    if (includeLowercase) score += 1
    if (includeNumbers) score += 1
    if (includeSymbols) score += 1

    if (score <= 2) return t("generator.strength.weak")
    if (score <= 3) return t("generator.strength.medium")
    if (score <= 4) return t("generator.strength.strong")
    return t("generator.strength.veryStrong")
  }

  const getStrengthColor = () => {
    const strength = getPasswordStrength()
    if (strength === t("generator.strength.weak")) return "text-red-600"
    if (strength === t("generator.strength.medium")) return "text-yellow-600"
    if (strength === t("generator.strength.strong")) return "text-blue-600"
    if (strength === t("generator.strength.veryStrong")) return "text-green-600"
    return "text-gray-600"
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Key className="h-5 w-5 mr-2" />
            {t("generator.title")}
          </DialogTitle>
          <DialogDescription>{t("generator.description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>{t("generator.length").replace("{length}", length[0].toString())}</Label>
            <Slider value={length} onValueChange={setLength} max={50} min={4} step={1} className="w-full" />
          </div>

          <div className="space-y-3">
            <Label>{t("generator.characterTypes")}</Label>

            <div className="flex items-center space-x-2">
              <Checkbox id="uppercase" checked={includeUppercase} onCheckedChange={(checked) => setIncludeUppercase(checked === true)} />
              <Label htmlFor="uppercase">{t("generator.uppercase")}</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="lowercase" checked={includeLowercase} onCheckedChange={(checked) => setIncludeLowercase(checked === true)} />
              <Label htmlFor="lowercase">{t("generator.lowercase")}</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="numbers" checked={includeNumbers} onCheckedChange={(checked) => setIncludeNumbers(checked === true)} />
              <Label htmlFor="numbers">{t("generator.numbers")}</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="symbols" checked={includeSymbols} onCheckedChange={(checked) => setIncludeSymbols(checked === true)} />
              <Label htmlFor="symbols">{t("generator.symbols")}</Label>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>{t("generator.generated")}</Label>
              {generatedPassword && !generatedPassword.includes(t("generator.selectCharacters")) && (
                <span className={`text-sm font-medium ${getStrengthColor()}`}>{getPasswordStrength()}</span>
              )}
            </div>
            <div className="flex space-x-2">
              <Input
                value={generatedPassword}
                readOnly
                placeholder={t("generator.clickGenerate")}
                className="font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
                disabled={!generatedPassword || generatedPassword.includes(t("generator.selectCharacters"))}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("generator.close")}
          </Button>
          <Button onClick={generatePassword}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("generator.generate")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
