"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Eye, EyeOff, Edit, Trash2, Copy, Globe } from "lucide-react"
import type { PasswordEntry } from "@/types/password"
import { useLanguage } from "@/contexts/language-context"

interface PasswordListProps {
  passwords: PasswordEntry[]
  onEdit: (password: PasswordEntry) => void
  onDelete: (id: string) => void
}

export default function PasswordList({ passwords, onEdit, onDelete }: PasswordListProps) {
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set())
  const { t } = useLanguage()

  const togglePasswordVisibility = (id: string) => {
    const newVisible = new Set(visiblePasswords)
    if (newVisible.has(id)) {
      newVisible.delete(id)
    } else {
      newVisible.add(id)
    }
    setVisiblePasswords(newVisible)
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  if (passwords.length === 0) {
    return (
      <div className="text-center py-12">
        <Globe className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{t("dashboard.noPasswords")}</h3>
        <p className="text-gray-500">{t("dashboard.noPasswordsDesc")}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("passwordList.domain")}</TableHead>
            <TableHead>{t("passwordList.username")}</TableHead>
            <TableHead>{t("passwordList.password")}</TableHead>
            <TableHead>{t("passwordList.notes")}</TableHead>
            <TableHead className="text-right">{t("passwordList.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {passwords.map((password) => (
            <TableRow key={password.id}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <Globe className="h-4 w-4 text-gray-400 mr-2" />
                  {password.domain}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-between">
                  <span>{password.username}</span>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(password.username, "usuario")}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-between max-w-xs">
                  <span className="font-mono">
                    {visiblePasswords.has(password.id) ? password.password : "••••••••••••"}
                  </span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => togglePasswordVisibility(password.id)}>
                      {visiblePasswords.has(password.id) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(password.password, "contraseña")}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {password.notes && (
                  <Badge variant="secondary" className="text-xs">
                    {password.notes.length > 20 ? `${password.notes.substring(0, 20)}...` : password.notes}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(password)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t("passwordList.deleteTitle")}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("passwordList.deleteDescription").replace("{domain}", password.domain)}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t("passwordList.cancel")}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(password.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {t("passwordList.delete")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
