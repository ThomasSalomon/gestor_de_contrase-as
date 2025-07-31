import CryptoJS from "crypto-js"
import bcrypt from "bcryptjs"

// Configuración de seguridad
const SALT_ROUNDS = 12
const KEY_SIZE = 256 / 32 // 256 bits
const IV_SIZE = 128 / 32 // 128 bits

/**
 * Genera una clave derivada usando PBKDF2
 */
function deriveKey(password: string, salt: string): string {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: KEY_SIZE,
    iterations: 10000,
    hasher: CryptoJS.algo.SHA256,
  }).toString()
}

/**
 * Hash seguro de contraseñas usando bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    const hash = await bcrypt.hash(password, salt)
    return hash
  } catch (error) {
    console.error("Error hashing password:", error)
    throw new Error("Failed to hash password")
  }
}

/**
 * Verificación de contraseñas usando bcrypt
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword)
  } catch (error) {
    console.error("Error verifying password:", error)
    return false
  }
}

/**
 * Encriptación AES-256-CBC con clave derivada
 */
export async function encryptData(data: string, masterPassword: string): Promise<string> {
  try {
    // Generar salt e IV aleatorios
    const salt = CryptoJS.lib.WordArray.random(256 / 8).toString()
    const iv = CryptoJS.lib.WordArray.random(128 / 8)

    // Derivar clave del master password
    const key = deriveKey(masterPassword, salt)

    // Encriptar datos
    const encrypted = CryptoJS.AES.encrypt(data, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })

    // Combinar salt, IV y datos encriptados
    const result = {
      salt: salt,
      iv: iv.toString(),
      encrypted: encrypted.toString(),
    }

    return btoa(JSON.stringify(result))
  } catch (error) {
    console.error("Error encrypting data:", error)
    throw new Error("Failed to encrypt data")
  }
}

/**
 * Desencriptación AES-256-CBC
 */
export async function decryptData(encryptedData: string, masterPassword: string): Promise<string> {
  try {
    // Decodificar datos
    const data = JSON.parse(atob(encryptedData))
    const { salt, iv, encrypted } = data

    // Derivar la misma clave
    const key = deriveKey(masterPassword, salt)

    // Desencriptar
    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })

    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8)

    if (!decryptedText) {
      throw new Error("Invalid password or corrupted data")
    }

    return decryptedText
  } catch (error) {
    console.error("Error decrypting data:", error)
    throw new Error("Failed to decrypt data - invalid password or corrupted data")
  }
}

/**
 * Genera una clave maestra temporal para la sesión
 */
export function generateSessionKey(): string {
  return CryptoJS.lib.WordArray.random(256 / 8).toString()
}

/**
 * Valida la fortaleza de una contraseña
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0

  // Longitud mínima
  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push("Debe tener al menos 8 caracteres")
  }

  // Mayúsculas
  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    feedback.push("Debe incluir al menos una mayúscula")
  }

  // Minúsculas
  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push("Debe incluir al menos una minúscula")
  }

  // Números
  if (/[0-9]/.test(password)) {
    score += 1
  } else {
    feedback.push("Debe incluir al menos un número")
  }

  // Símbolos
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1
  } else {
    feedback.push("Debe incluir al menos un símbolo")
  }

  // Longitud adicional
  if (password.length >= 12) {
    score += 1
  }

  return {
    isValid: score >= 4,
    score,
    feedback,
  }
}

/**
 * Limpia datos sensibles de la memoria (simulado)
 */
export function clearSensitiveData(data: string): void {
  // En un entorno real, esto sería más complejo
  // Por ahora, simplemente sobrescribimos la referencia
  data = ""
}
