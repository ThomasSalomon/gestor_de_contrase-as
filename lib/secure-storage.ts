import { encryptData, decryptData } from "./crypto"

export class SecureStorage {
  private static instance: SecureStorage
  private masterPassword: string | null = null
  private sessionActive = false
  private pendingOperations: Map<string, any> = new Map()
  private debounceTimer: NodeJS.Timeout | null = null
  private readonly DEBOUNCE_DELAY = 300 // 300ms debounce

  private constructor() {}

  static getInstance(): SecureStorage {
    if (!SecureStorage.instance) {
      SecureStorage.instance = new SecureStorage()
    }
    return SecureStorage.instance
  }

  /**
   * Inicializa la sesión segura con la contraseña maestra
   */
  async initSession(masterPassword: string): Promise<void> {
    this.masterPassword = masterPassword
    this.sessionActive = true

    // Configurar limpieza automática de sesión después de inactividad
    this.setupSessionTimeout()

    // Configurar limpieza al cerrar aplicación
    this.setupSessionCleanup()
  }

  /**
   * Termina la sesión segura
   */
  async endSession(): Promise<void> {
    // Procesar operaciones pendientes antes de cerrar sesión
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = null
    }
    await this.flushPendingOperations()
    
    this.masterPassword = null
    this.sessionActive = false
  }

  /**
   * Verifica si hay una sesión activa
   */
  isSessionActive(): boolean {
    return this.sessionActive && this.masterPassword !== null
  }

  /**
   * Almacena datos encriptados con debounce
   */
  async setSecureItem(key: string, data: any): Promise<void> {
    if (!this.isSessionActive()) {
      throw new Error("No active secure session")
    }

    // Agregar a operaciones pendientes
    this.pendingOperations.set(key, data)
    
    // Debounce las operaciones de escritura
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }
    
    this.debounceTimer = setTimeout(() => {
      this.flushPendingOperations()
    }, this.DEBOUNCE_DELAY)
  }

  /**
   * Almacena datos encriptados inmediatamente (sin debounce)
   */
  async setSecureItemImmediate(key: string, data: any): Promise<void> {
    if (!this.isSessionActive()) {
      throw new Error("No active secure session")
    }

    try {
      const jsonData = JSON.stringify(data)
      const encryptedData = await encryptData(jsonData, this.masterPassword!)

      // Agregar timestamp y checksum para integridad
      const secureItem = {
        data: encryptedData,
        timestamp: Date.now(),
        checksum: this.generateChecksum(encryptedData),
      }

      localStorage.setItem(`secure_${key}`, JSON.stringify(secureItem))
    } catch (error) {
      console.error("Error storing secure item:", error)
      throw new Error("Failed to store secure data")
    }
  }

  /**
   * Procesa todas las operaciones pendientes en lote
   */
  private async flushPendingOperations(): Promise<void> {
    if (this.pendingOperations.size === 0) return

    const operations = Array.from(this.pendingOperations.entries())
    this.pendingOperations.clear()
    
    // Procesar operaciones en lote
    const batchPromises = operations.map(async ([key, data]) => {
      try {
        await this.setSecureItemImmediate(key, data)
      } catch (error) {
        console.error(`Error in batch operation for key ${key}:`, error)
        // Re-agregar a pendientes si falla
        this.pendingOperations.set(key, data)
      }
    })
    
    await Promise.allSettled(batchPromises)
  }

  /**
   * Recupera datos desencriptados
   */
  async getSecureItem(key: string): Promise<any> {
    if (!this.isSessionActive()) {
      throw new Error("No active secure session")
    }

    try {
      const storedItem = localStorage.getItem(`secure_${key}`)
      if (!storedItem) {
        return null
      }

      const secureItem = JSON.parse(storedItem)

      // Verificar integridad
      if (!this.verifyChecksum(secureItem.data, secureItem.checksum)) {
        throw new Error("Data integrity check failed")
      }

      const decryptedData = await decryptData(secureItem.data, this.masterPassword!)
      return JSON.parse(decryptedData)
    } catch (error) {
      console.error("Error retrieving secure item:", error)
      throw new Error("Failed to retrieve secure data")
    }
  }

  /**
   * Elimina un elemento seguro
   */
  removeSecureItem(key: string): void {
    localStorage.removeItem(`secure_${key}`)
  }

  /**
   * Lista todas las claves seguras del usuario actual
   */
  getSecureKeys(userPrefix: string): string[] {
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(`secure_${userPrefix}_`)) {
        keys.push(key.replace(`secure_${userPrefix}_`, ""))
      }
    }
    return keys
  }

  /**
   * Genera un checksum para verificar integridad
   */
  private generateChecksum(data: string): string {
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return hash.toString(16)
  }

  /**
   * Verifica el checksum
   */
  private verifyChecksum(data: string, expectedChecksum: string): boolean {
    return this.generateChecksum(data) === expectedChecksum
  }

  /**
   * Configura timeout de sesión por inactividad
   */
  private setupSessionTimeout(): void {
    // Limpiar timeout anterior si existe
    if ((window as any).secureSessionTimeout) {
      clearTimeout((window as any).secureSessionTimeout)
    }
    // Configurar nuevo timeout (30 minutos de inactividad)
    ;(window as any).secureSessionTimeout = setTimeout(
      () => {
        this.endSession()
        // Aquí podrías disparar un evento para notificar a la UI
        window.dispatchEvent(new CustomEvent("sessionExpired"))
      },
      30 * 60 * 1000,
    ) // 30 minutos
  }

  /**
   * Resetea el timeout de sesión (llamar en actividad del usuario)
   */
  resetSessionTimeout(): void {
    if (this.isSessionActive()) {
      this.setupSessionTimeout()
    }
  }

  /**
   * Limpia completamente la sesión y datos temporales
   */
  async clearSession(): Promise<void> {
    await this.endSession()

    // Limpiar timeout si existe
    if ((window as any).secureSessionTimeout) {
      clearTimeout((window as any).secureSessionTimeout)
      delete (window as any).secureSessionTimeout
    }

    // Limpiar operaciones pendientes
    this.pendingOperations.clear()
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = null
    }

    // Limpiar datos de sesión temporal
    sessionStorage.clear()
  }

  /**
   * Configura limpieza automática al cerrar la ventana/pestaña
   */
  setupSessionCleanup(): void {
    // Limpiar sesión al cerrar ventana/pestaña
    window.addEventListener("beforeunload", () => {
      this.clearSession()
    })

    // Limpiar sesión al cambiar de pestaña (opcional, más estricto)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        // Opcional: terminar sesión cuando se oculta la pestaña
        // this.clearSession()
      }
    })
  }
}

export const secureStorage = SecureStorage.getInstance()
