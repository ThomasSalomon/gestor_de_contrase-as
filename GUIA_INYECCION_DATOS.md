# Guía de Inyección de Datos Ficticios

## Métodos para Inyectar Datos en la Aplicación

Una vez que hayas iniciado sesión en la aplicación, tienes varias opciones para cargar los datos ficticios de manera eficiente y segura:

## 1. 🎛️ Componente DevTools (Recomendado)

### Integración en el Dashboard

Agrega el componente `DevTools` a tu dashboard principal:

```tsx
// En components/dashboard.tsx
import DevTools from '@/components/dev-tools';

function Dashboard() {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);

  const handleLoadData = (newPasswords: PasswordEntry[]) => {
    setPasswords(newPasswords);
    // Opcional: guardar en localStorage o estado global
    localStorage.setItem('mockPasswords', JSON.stringify(newPasswords));
  };

  const handleClearData = () => {
    setPasswords([]);
    localStorage.removeItem('mockPasswords');
  };

  return (
    <div>
      {/* Tu contenido del dashboard */}
      
      {/* Solo visible en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <DevTools 
          onLoadData={handleLoadData}
          onClearData={handleClearData}
        />
      )}
    </div>
  );
}
```

### Ventajas:
- ✅ Interfaz visual intuitiva
- ✅ Múltiples escenarios predefinidos
- ✅ Solo visible en desarrollo
- ✅ Funciones de limpieza y exportación

## 2. 🪝 Hook useMockData

### Uso Directo en Componentes

```tsx
// En cualquier componente
import { useMockData } from '@/lib/mock-data-loader';

function PasswordList() {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const { loadMockPasswords, loadMockPasswordsByCategory } = useMockData();

  // Cargar todos los datos
  const loadAllMockData = () => {
    const mockData = loadMockPasswords();
    setPasswords(mockData);
  };

  // Cargar por categoría
  const loadSocialMedia = () => {
    const socialData = loadMockPasswordsByCategory('redes sociales');
    setPasswords(socialData);
  };

  return (
    <div>
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 space-x-2">
          <button onClick={loadAllMockData}>Cargar Todos</button>
          <button onClick={loadSocialMedia}>Solo Redes Sociales</button>
        </div>
      )}
      {/* Renderizar passwords */}
    </div>
  );
}
```

## 3. 📦 Importación Directa

### Para Casos Específicos

```tsx
// Importación directa de funciones
import { 
  getMockPasswords, 
  getMockPasswordsByCategory,
  generateLargeMockDataset,
  TEST_SCENARIOS 
} from '@/lib/mock-data-loader';

function TestComponent() {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);

  useEffect(() => {
    // Cargar automáticamente en desarrollo
    if (process.env.NODE_ENV === 'development') {
      // Opción 1: Conjunto mediano
      setPasswords(getMockPasswords());
      
      // Opción 2: Solo trabajo
      // setPasswords(getMockPasswordsByCategory('trabajo'));
      
      // Opción 3: Dataset grande para pruebas
      // setPasswords(generateLargeMockDataset(100));
      
      // Opción 4: Escenario predefinido
      // setPasswords(TEST_SCENARIOS.SMALL_DATASET);
    }
  }, []);

  return (
    // Tu componente
  );
}
```

## 4. 🔄 Carga Asíncrona con Simulación

### Para Probar Estados de Carga

```tsx
import { simulateAsyncOperation, getMockPasswords } from '@/lib/mock-data-loader';

function AsyncPasswordLoader() {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const loadDataWithDelay = async () => {
    setLoading(true);
    try {
      // Simula una carga de 2 segundos
      const mockData = await simulateAsyncOperation(
        getMockPasswords(), 
        2000
      );
      setPasswords(mockData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <div>Cargando contraseñas...</div>
      ) : (
        <div>
          <button onClick={loadDataWithDelay}>Cargar con Delay</button>
          {/* Renderizar passwords */}
        </div>
      )}
    </div>
  );
}
```

## 5. 💾 Persistencia en LocalStorage

### Mantener Datos Entre Sesiones

```tsx
function PersistentMockData() {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);

  // Cargar datos al iniciar
  useEffect(() => {
    const savedData = localStorage.getItem('mockPasswords');
    if (savedData) {
      setPasswords(JSON.parse(savedData));
    }
  }, []);

  // Guardar datos cuando cambien
  const saveMockData = (newPasswords: PasswordEntry[]) => {
    setPasswords(newPasswords);
    localStorage.setItem('mockPasswords', JSON.stringify(newPasswords));
  };

  const loadFreshMockData = () => {
    const freshData = getMockPasswords();
    saveMockData(freshData);
  };

  return (
    // Tu componente
  );
}
```

## 🛡️ Mejores Prácticas de Seguridad

### 1. Verificación de Entorno
```tsx
// Siempre verificar que estamos en desarrollo
if (process.env.NODE_ENV !== 'development') {
  console.warn('Los datos ficticios solo deben usarse en desarrollo');
  return;
}
```

### 2. Limpieza Automática
```tsx
// Limpiar datos al cambiar a producción
useEffect(() => {
  return () => {
    if (process.env.NODE_ENV === 'production') {
      localStorage.removeItem('mockPasswords');
    }
  };
}, []);
```

### 3. Indicadores Visuales
```tsx
// Mostrar claramente que son datos de prueba
{process.env.NODE_ENV === 'development' && passwords.length > 0 && (
  <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
    ⚠️ Usando datos ficticios para pruebas
  </div>
)}
```

## 📊 Escenarios de Prueba Disponibles

| Escenario | Descripción | Uso Recomendado |
|-----------|-------------|------------------|
| `EMPTY_STATE` | Sin datos | Probar UI vacía |
| `SMALL_DATASET` | 3 contraseñas | Pruebas básicas |
| `MEDIUM_DATASET` | 15 contraseñas | Desarrollo normal |
| `LARGE_DATASET` | 50 contraseñas | Pruebas de UI |
| `PERFORMANCE_TEST` | 500 contraseñas | Pruebas de rendimiento |

## 🎯 Casos de Uso Específicos

### Para Pruebas de Filtros
```tsx
const testFilters = () => {
  // Cargar datos por categoría
  const socialMedia = getMockPasswordsByCategory('redes sociales');
  const work = getMockPasswordsByCategory('trabajo');
  const finance = getMockPasswordsByCategory('finanzas');
};
```

### Para Pruebas de Búsqueda
```tsx
const testSearch = () => {
  const allData = getMockPasswords();
  // Buscar por dominio
  const gmailPasswords = allData.filter(p => p.domain.includes('gmail'));
};
```

### Para Pruebas de Rendimiento
```tsx
const testPerformance = () => {
  const largeDataset = generateLargeMockDataset(1000);
  // Medir tiempo de renderizado
  console.time('render');
  setPasswords(largeDataset);
  console.timeEnd('render');
};
```

## 🚀 Recomendación Final

**Para la mayoría de casos, usa el componente DevTools** ya que proporciona:
- Control visual completo
- Múltiples opciones de carga
- Funciones de limpieza
- Exportación de datos
- Seguridad automática (solo en desarrollo)

Simplemente agrégalo a tu dashboard y tendrás acceso completo a todas las funcionalidades de datos ficticios.