import { PasswordEntry } from '@/types/password';
import mockPasswordsData from '../test-data/mock-passwords.json';

/**
 * Utilidad para cargar datos ficticios en la aplicación durante las pruebas
 * IMPORTANTE: Solo usar en entorno de desarrollo/testing
 */

export interface MockPassword {
  id: string;
  domain: string;
  username: string;
  password: string;
  notes: string;
  category: string;
  createdAt: string;
  lastModified: string;
}

/**
 * Convierte los datos mock al formato esperado por la aplicación
 */
export function convertMockToPasswordFormat(mockPassword: MockPassword): PasswordEntry {
  return {
    id: mockPassword.id,
    domain: mockPassword.domain,
    username: mockPassword.username,
    password: mockPassword.password,
    notes: mockPassword.notes
  };
}

/**
 * Calcula la fortaleza de una contraseña (simulado)
 */
function calculatePasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (password.length < 8) return 'weak';
  if (password.length < 12) return 'medium';
  return 'strong';
}

/**
 * Obtiene todos los datos ficticios convertidos al formato de la aplicación
 */
export function getMockPasswords(): PasswordEntry[] {
  return mockPasswordsData.mockPasswords.map(convertMockToPasswordFormat);
}

/**
 * Obtiene un subconjunto de contraseñas ficticias por categoría
 */
export function getMockPasswordsByCategory(category: string): PasswordEntry[] {
  const mockPasswords = mockPasswordsData.mockPasswords.filter(p => 
    p.category.toLowerCase() === category.toLowerCase()
  );
  return mockPasswords.map(convertMockToPasswordFormat);
}

/**
 * Obtiene una contraseña ficticia específica por ID
 */
export function getMockPasswordById(id: string): PasswordEntry | undefined {
  const mockPassword = mockPasswordsData.mockPasswords.find(p => p.id === id);
  return mockPassword ? convertMockToPasswordFormat(mockPassword) : undefined;
}

/**
 * Genera datos adicionales para pruebas de rendimiento
 */
export function generateLargeMockDataset(count: number = 100): PasswordEntry[] {
  const basePasswords = getMockPasswords();
  const largeDataset: PasswordEntry[] = [];
  
  for (let i = 0; i < count; i++) {
    const basePassword = basePasswords[i % basePasswords.length];
    largeDataset.push({
      ...basePassword,
      id: `mock-${i + 1}`,
      domain: `${basePassword.domain.split('.')[0]}-${i + 1}.com`,
      username: `${basePassword.username.split('@')[0]}-${i + 1}@test.com`
    });
  }
  
  return largeDataset;
}

/**
 * Utilidad para limpiar datos de prueba (solo en desarrollo)
 */
export function clearMockData(): void {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('clearMockData solo debe usarse en entorno de desarrollo');
    return;
  }
  
  // Aquí se implementaría la lógica para limpiar los datos mock
  // del almacenamiento local o la base de datos de prueba
  console.log('Datos ficticios limpiados');
}

/**
 * Utilidad para exportar datos mock como JSON (solo en desarrollo)
 */
export function exportMockData(passwords: PasswordEntry[]): void {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('exportMockData solo debe usarse en entorno de desarrollo');
    return;
  }
  
  const dataStr = JSON.stringify(passwords, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `mock-passwords-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
  console.log('Datos mock exportados');
}

/**
 * Hook para usar en componentes React durante las pruebas
 */
export function useMockData() {
  const loadMockPasswords = () => getMockPasswords();
  const loadMockPasswordsByCategory = (category: string) => getMockPasswordsByCategory(category);
  const generateLargeDataset = (count?: number) => generateLargeMockDataset(count);
  
  return {
    loadMockPasswords,
    loadMockPasswordsByCategory,
    generateLargeDataset,
    clearMockData
  };
}

// Exportar los datos raw para casos especiales
export { mockPasswordsData };

/**
 * Configuración para diferentes escenarios de prueba
 */
export const TEST_SCENARIOS = {
  EMPTY_STATE: [],
  SMALL_DATASET: getMockPasswords().slice(0, 3),
  MEDIUM_DATASET: getMockPasswords(),
  LARGE_DATASET: generateLargeMockDataset(50),
  PERFORMANCE_TEST: generateLargeMockDataset(500)
} as const;

/**
 * Utilidad para simular operaciones asíncronas durante las pruebas
 */
export async function simulateAsyncOperation<T>(data: T, delay: number = 500): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
}

/**
 * Función para validar que estamos en un entorno de pruebas
 */
export function isTestEnvironment(): boolean {
  return process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
}

/**
 * Advertencia de seguridad para producción
 */
if (process.env.NODE_ENV === 'production') {
  console.warn('⚠️ ADVERTENCIA: Los datos ficticios no deben usarse en producción');
}