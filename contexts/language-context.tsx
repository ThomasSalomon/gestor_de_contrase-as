"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "es" | "pt"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("es")

  useEffect(() => {
    // Cargar idioma guardado o detectar idioma del navegador
    const savedLanguage = localStorage.getItem("preferred-language") as Language
    if (savedLanguage && ["en", "es", "pt"].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    } else {
      // Detectar idioma del navegador
      const browserLang = navigator.language.toLowerCase()
      if (browserLang.startsWith("es")) {
        setLanguage("es")
      } else if (browserLang.startsWith("pt")) {
        setLanguage("pt")
      } else {
        setLanguage("en")
      }
    }
  }, [])

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("preferred-language", lang)
  }

  const t = (key: string): string => {
    return getTranslation(key, language)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

// Función para obtener traducciones
function getTranslation(key: string, language: Language): string {
  const translations = getTranslations()
  const keys = key.split(".")
  let value: any = translations[language]

  for (const k of keys) {
    value = value?.[k]
  }

  return value || key
}

// Todas las traducciones
function getTranslations() {
  return {
    en: {
      // Login Form
      login: {
        title: "Password Manager",
        subtitle: "Access your secure password vault",
        signIn: "Sign In",
        register: "Register",
        username: "Username",
        masterPassword: "Master Password",
        confirmPassword: "Confirm Password",
        signInButton: "Sign In",
        registerButton: "Register",
        signingIn: "Signing in...",
        creating: "Creating...",
        userNotFound: "User not found",
        incorrectPassword: "Incorrect password",
        loginError: "Login error",
        passwordsDontMatch: "Passwords don't match",
        weakPassword: "Weak password",
        userExists: "User already exists",
        createAccountError: "Error creating account",
      },
      // Security Notice
      security: {
        policyTitle: "Active Security Policy",
        loginRequired: "You must log in every time you open the application",
        autoLogout: "Session automatically closes after 30 minutes of inactivity",
        encryption: "All data is encrypted with AES-256",
        sessionActive: "Secure session active - Data encrypted with AES-256",
        sessionExpired: "Session expired due to inactivity",
      },
      // Dashboard
      dashboard: {
        title: "Password Manager",
        welcome: "Welcome",
        logout: "Sign Out",
        search: "Search by domain or username...",
        generatePassword: "Generate Password",
        newPassword: "New Password",
        myPasswords: "My Passwords",
        noPasswords: "No saved passwords",
        noPasswordsDesc: "Start by adding your first password using the 'New Password' button",
      },
      // Password List
      passwordList: {
        domain: "Domain/Site",
        username: "Username",
        password: "Password",
        notes: "Notes",
        actions: "Actions",
        deleteTitle: "Delete password?",
        deleteDescription: "This action cannot be undone. The password for {domain} will be permanently deleted.",
        cancel: "Cancel",
        delete: "Delete",
      },
      // Password Form
      passwordForm: {
        editTitle: "Edit Password",
        newTitle: "New Password",
        editDesc: "Modify existing password data",
        newDesc: "Add a new password to your secure vault",
        domainLabel: "Domain/Website *",
        domainPlaceholder: "example.com",
        usernameLabel: "Username/Email *",
        usernamePlaceholder: "user@example.com",
        passwordLabel: "Password *",
        passwordPlaceholder: "Secure password",
        notesLabel: "Notes (optional)",
        notesPlaceholder: "Additional notes...",
        update: "Update",
        save: "Save",
      },
      // Password Generator
      generator: {
        title: "Password Generator",
        description: "Create secure and customizable passwords",
        length: "Length: {length} characters",
        characterTypes: "Character types:",
        uppercase: "Uppercase (A-Z)",
        lowercase: "Lowercase (a-z)",
        numbers: "Numbers (0-9)",
        symbols: "Symbols (!@#$%^&*)",
        generated: "Generated password:",
        generate: "Generate",
        close: "Close",
        clickGenerate: "Click 'Generate' to create a password",
        selectCharacters: "Select at least one character type",
        strength: {
          weak: "Weak",
          medium: "Medium",
          strong: "Strong",
          veryStrong: "Very Strong",
        },
      },
      // Password Strength
      strength: {
        label: "Strength",
        requirements: {
          minLength: "Must be at least 8 characters",
          uppercase: "Must include at least one uppercase letter",
          lowercase: "Must include at least one lowercase letter",
          number: "Must include at least one number",
          symbol: "Must include at least one symbol",
        },
      },
      // Language Selector
      language: {
        select: "Language",
        english: "English",
        spanish: "Spanish",
        portuguese: "Portuguese",
      },
    },
    es: {
      // Login Form
      login: {
        title: "Gestor de Contraseñas",
        subtitle: "Accede a tu bóveda segura de contraseñas",
        signIn: "Iniciar Sesión",
        register: "Registrarse",
        username: "Usuario",
        masterPassword: "Contraseña Principal",
        confirmPassword: "Confirmar Contraseña",
        signInButton: "Iniciar Sesión",
        registerButton: "Crear Cuenta",
        signingIn: "Iniciando...",
        creating: "Creando...",
        userNotFound: "Usuario no encontrado",
        incorrectPassword: "Contraseña incorrecta",
        loginError: "Error al iniciar sesión",
        passwordsDontMatch: "Las contraseñas no coinciden",
        weakPassword: "Contraseña débil",
        userExists: "El usuario ya existe",
        createAccountError: "Error al crear la cuenta",
      },
      // Security Notice
      security: {
        policyTitle: "Política de Seguridad Activa",
        loginRequired: "Debes iniciar sesión cada vez que abras la aplicación",
        autoLogout: "La sesión se cierra automáticamente después de 30 minutos de inactividad",
        encryption: "Todos los datos están encriptados con AES-256",
        sessionActive: "Sesión segura activa - Datos encriptados con AES-256",
        sessionExpired: "Sesión expirada por inactividad",
      },
      // Dashboard
      dashboard: {
        title: "Gestor de Contraseñas",
        welcome: "Bienvenido",
        logout: "Cerrar Sesión",
        search: "Buscar por dominio o usuario...",
        generatePassword: "Generar Contraseña",
        newPassword: "Nueva Contraseña",
        myPasswords: "Mis Contraseñas",
        noPasswords: "No hay contraseñas guardadas",
        noPasswordsDesc: "Comienza agregando tu primera contraseña usando el botón 'Nueva Contraseña'",
      },
      // Password List
      passwordList: {
        domain: "Dominio/Sitio",
        username: "Usuario",
        password: "Contraseña",
        notes: "Notas",
        actions: "Acciones",
        deleteTitle: "¿Eliminar contraseña?",
        deleteDescription:
          "Esta acción no se puede deshacer. Se eliminará permanentemente la contraseña para {domain}.",
        cancel: "Cancelar",
        delete: "Eliminar",
      },
      // Password Form
      passwordForm: {
        editTitle: "Editar Contraseña",
        newTitle: "Nueva Contraseña",
        editDesc: "Modifica los datos de la contraseña existente",
        newDesc: "Agrega una nueva contraseña a tu bóveda segura",
        domainLabel: "Dominio/Sitio Web *",
        domainPlaceholder: "ejemplo.com",
        usernameLabel: "Usuario/Email *",
        usernamePlaceholder: "usuario@ejemplo.com",
        passwordLabel: "Contraseña *",
        passwordPlaceholder: "Contraseña segura",
        notesLabel: "Notas (opcional)",
        notesPlaceholder: "Notas adicionales...",
        update: "Actualizar",
        save: "Guardar",
      },
      // Password Generator
      generator: {
        title: "Generador de Contraseñas",
        description: "Crea contraseñas seguras y personalizables",
        length: "Longitud: {length} caracteres",
        characterTypes: "Tipos de caracteres:",
        uppercase: "Mayúsculas (A-Z)",
        lowercase: "Minúsculas (a-z)",
        numbers: "Números (0-9)",
        symbols: "Símbolos (!@#$%^&*)",
        generated: "Contraseña generada:",
        generate: "Generar",
        close: "Cerrar",
        clickGenerate: "Haz clic en 'Generar' para crear una contraseña",
        selectCharacters: "Selecciona al menos un tipo de carácter",
        strength: {
          weak: "Débil",
          medium: "Media",
          strong: "Fuerte",
          veryStrong: "Muy Fuerte",
        },
      },
      // Password Strength
      strength: {
        label: "Fortaleza",
        requirements: {
          minLength: "Debe tener al menos 8 caracteres",
          uppercase: "Debe incluir al menos una mayúscula",
          lowercase: "Debe incluir al menos una minúscula",
          number: "Debe incluir al menos un número",
          symbol: "Debe incluir al menos un símbolo",
        },
      },
      // Language Selector
      language: {
        select: "Idioma",
        english: "Inglés",
        spanish: "Español",
        portuguese: "Portugués",
      },
    },
    pt: {
      // Login Form
      login: {
        title: "Gerenciador de Senhas",
        subtitle: "Acesse seu cofre seguro de senhas",
        signIn: "Entrar",
        register: "Registrar",
        username: "Usuário",
        masterPassword: "Senha Principal",
        confirmPassword: "Confirmar Senha",
        signInButton: "Entrar",
        registerButton: "Criar Conta",
        signingIn: "Entrando...",
        creating: "Criando...",
        userNotFound: "Usuário não encontrado",
        incorrectPassword: "Senha incorreta",
        loginError: "Erro ao fazer login",
        passwordsDontMatch: "As senhas não coincidem",
        weakPassword: "Senha fraca",
        userExists: "O usuário já existe",
        createAccountError: "Erro ao criar conta",
      },
      // Security Notice
      security: {
        policyTitle: "Política de Segurança Ativa",
        loginRequired: "Você deve fazer login toda vez que abrir a aplicação",
        autoLogout: "A sessão fecha automaticamente após 30 minutos de inatividade",
        encryption: "Todos os dados são criptografados com AES-256",
        sessionActive: "Sessão segura ativa - Dados criptografados com AES-256",
        sessionExpired: "Sessão expirada por inatividade",
      },
      // Dashboard
      dashboard: {
        title: "Gerenciador de Senhas",
        welcome: "Bem-vindo",
        logout: "Sair",
        search: "Buscar por domínio ou usuário...",
        generatePassword: "Gerar Senha",
        newPassword: "Nova Senha",
        myPasswords: "Minhas Senhas",
        noPasswords: "Nenhuma senha salva",
        noPasswordsDesc: "Comece adicionando sua primeira senha usando o botão 'Nova Senha'",
      },
      // Password List
      passwordList: {
        domain: "Domínio/Site",
        username: "Usuário",
        password: "Senha",
        notes: "Notas",
        actions: "Ações",
        deleteTitle: "Excluir senha?",
        deleteDescription: "Esta ação não pode ser desfeita. A senha para {domain} será excluída permanentemente.",
        cancel: "Cancelar",
        delete: "Excluir",
      },
      // Password Form
      passwordForm: {
        editTitle: "Editar Senha",
        newTitle: "Nova Senha",
        editDesc: "Modifique os dados da senha existente",
        newDesc: "Adicione uma nova senha ao seu cofre seguro",
        domainLabel: "Domínio/Site *",
        domainPlaceholder: "exemplo.com",
        usernameLabel: "Usuário/Email *",
        usernamePlaceholder: "usuario@exemplo.com",
        passwordLabel: "Senha *",
        passwordPlaceholder: "Senha segura",
        notesLabel: "Notas (opcional)",
        notesPlaceholder: "Notas adicionais...",
        update: "Atualizar",
        save: "Salvar",
      },
      // Password Generator
      generator: {
        title: "Gerador de Senhas",
        description: "Crie senhas seguras e personalizáveis",
        length: "Comprimento: {length} caracteres",
        characterTypes: "Tipos de caracteres:",
        uppercase: "Maiúsculas (A-Z)",
        lowercase: "Minúsculas (a-z)",
        numbers: "Números (0-9)",
        symbols: "Símbolos (!@#$%^&*)",
        generated: "Senha gerada:",
        generate: "Gerar",
        close: "Fechar",
        clickGenerate: "Clique em 'Gerar' para criar uma senha",
        selectCharacters: "Selecione pelo menos um tipo de caractere",
        strength: {
          weak: "Fraca",
          medium: "Média",
          strong: "Forte",
          veryStrong: "Muito Forte",
        },
      },
      // Password Strength
      strength: {
        label: "Força",
        requirements: {
          minLength: "Deve ter pelo menos 8 caracteres",
          uppercase: "Deve incluir pelo menos uma letra maiúscula",
          lowercase: "Deve incluir pelo menos uma letra minúscula",
          number: "Deve incluir pelo menos um número",
          symbol: "Deve incluir pelo menos um símbolo",
        },
      },
      // Language Selector
      language: {
        select: "Idioma",
        english: "Inglês",
        spanish: "Espanhol",
        portuguese: "Português",
      },
    },
  }
}
