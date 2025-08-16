# Datos Ficticios para Pruebas

Este directorio contiene datos simulados para facilitar las pruebas y el desarrollo de la aplicación de gestión de contraseñas.

## 📁 Archivos Incluidos

### `mock-passwords.json`
Contiene 10 contraseñas ficticias para diferentes tipos de sitios web:

- **Financiero**: Banco ficticio
- **Compras**: Tienda online simulada
- **Social**: Red social de prueba
- **Trabajo**: Correo empresarial
- **Entretenimiento**: Streaming y juegos
- **Productividad**: Almacenamiento en la nube
- **Educación**: Plataforma educativa
- **Salud**: Portal médico
- **Viajes**: Agencia de viajes

## 🛠️ Cómo Usar los Datos Ficticios

### 1. Importación Directa
```typescript
import { getMockPasswords } from '@/lib/mock-data-loader';

const mockData = getMockPasswords();
```

### 2. Usando el Hook de React
```typescript
import { useMockData } from '@/lib/mock-data-loader';

function MyComponent() {
  const { loadMockPasswords, loadMockPasswordsByCategory } = useMockData();
  
  const handleLoadData = () => {
    const passwords = loadMockPasswords();
    // Usar los datos...
  };
}
```

### 3. Componente de Herramientas de Desarrollo
```typescript
import DevTools from '@/components/dev-tools';

function DashboardPage() {
  const handleLoadData = (passwords) => {
    // Cargar datos en el estado de la aplicación
  };
  
  return (
    <div>
      {/* Tu contenido */}
      <DevTools onLoadData={handleLoadData} />
    </div>
  );
}
```

## 🎯 Escenarios de Prueba Disponibles

### Estados de Datos
- **EMPTY_STATE**: Sin contraseñas (para probar estado vacío)
- **SMALL_DATASET**: 3 contraseñas (pruebas básicas)
- **MEDIUM_DATASET**: 10 contraseñas (conjunto completo)
- **LARGE_DATASET**: 50 contraseñas (pruebas de rendimiento)
- **PERFORMANCE_TEST**: 500 contraseñas (pruebas de estrés)

### Filtros por Categoría
- Financiero
- Compras
- Social
- Trabajo
- Entretenimiento
- Productividad
- Educación
- Salud
- Viajes

## 🔧 Funciones Utilitarias

### `getMockPasswords()`
Retorna todas las contraseñas ficticias convertidas al formato de la aplicación.

### `getMockPasswordsByCategory(category: string)`
Filtra las contraseñas por categoría específica.

### `getMockPasswordById(id: string)`
Obtiene una contraseña específica por su ID.

### `generateLargeMockDataset(count: number)`
Genera un dataset grande para pruebas de rendimiento.

### `simulateAsyncOperation(data, delay)`
Simula operaciones asíncronas con retraso configurable.

## 🔒 Seguridad y Mejores Prácticas

### ✅ Datos Seguros
- Todas las contraseñas son completamente ficticias
- Los dominios no existen realmente
- Los emails son de prueba
- No contienen información sensible real

### ⚠️ Restricciones de Entorno
- Solo disponible en `development` y `test`
- Advertencias automáticas en producción
- Validación de entorno integrada

### 🚫 NO Hacer
- No usar estos datos en producción
- No modificar para incluir datos reales
- No commitear datos sensibles reales

## 📊 Estructura de Datos

Cada contraseña ficticia incluye:

```typescript
interface MockPassword {
  id: string;              // Identificador único
  domain: string;          // Dominio del sitio web
  username: string;        // Nombre de usuario o email
  password: string;        // Contraseña (ficticia pero realista)
  notes: string;           // Notas descriptivas
  category: string;        // Categoría del sitio
  createdAt: string;       // Fecha de creación (ISO)
  lastModified: string;    // Última modificación (ISO)
}
```

## 🧪 Casos de Uso para Pruebas

### Desarrollo de UI
- Probar diferentes estados de la lista
- Validar componentes con datos variados
- Verificar responsive design

### Funcionalidad
- Búsqueda y filtrado
- Ordenamiento
- Paginación
- CRUD operations

### Rendimiento
- Carga de grandes volúmenes
- Virtual scrolling
- Optimizaciones de memoria

### Accesibilidad
- Navegación por teclado
- Screen readers
- Contraste y legibilidad

## 🔄 Actualización de Datos

Para añadir nuevos datos ficticios:

1. Edita `mock-passwords.json`
2. Mantén el formato existente
3. Usa dominios ficticios (`.com`, `.test`, etc.)
4. Incluye contraseñas realistas pero ficticias
5. Asigna categorías apropiadas

## 📝 Logging y Debugging

El sistema incluye logging automático:
- Carga de datos
- Operaciones de limpieza
- Advertencias de seguridad
- Validaciones de entorno

## 🤝 Contribución

Al añadir nuevos datos ficticios:
- Mantén la consistencia en el formato
- Usa datos realistas pero ficticios
- Documenta nuevas categorías
- Actualiza este README si es necesario

---

**Recuerda**: Estos datos son solo para desarrollo y pruebas. Nunca uses información real o sensible en estos archivos.