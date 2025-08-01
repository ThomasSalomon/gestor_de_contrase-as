"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Info } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function SecurityNotice() {
  const { t } = useLanguage()

  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <div className="space-y-2">
          <div className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            <span className="font-medium">{t("security.policyTitle")}</span>
          </div>
          <ul className="text-sm space-y-1 ml-6">
            <li>• {t("security.loginRequired")}</li>
            <li>• {t("security.autoLogout")}</li>
            <li>• {t("security.encryption")}</li>
          </ul>
        </div>
      </AlertDescription>
    </Alert>
  )
}
