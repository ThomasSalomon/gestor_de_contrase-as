# Integración Rápida de Datos Ficticios

## 🚀 Opción 1: Panel DevTools Completo (Ya Integrado)

El componente `DevTools` ya está integrado en tu dashboard y aparecerá automáticamente al final de la página cuando estés en modo desarrollo.

### Características:
- ✅ **Automático**: Se muestra solo en `NODE_ENV=development`
- ✅ **Completo**: Todos los escenarios de prueba disponibles
- ✅ **Seguro**: Se oculta automáticamente en producción
- ✅ **Persistente**: Los datos se guardan en el almacenamiento seguro

### Cómo usar:
1. Inicia la aplicación en modo desarrollo: `npm run dev`
2. Inicia sesión en la aplicación
3. Desplázate al final del dashboard
4. Verás el panel "Herramientas de Desarrollo"
5. Haz clic en cualquier botón para cargar datos ficticios

---

## ⚡ Opción 2: Botón Rápido de Carga

Si prefieres una opción más discreta, puedes agregar un botón rápido en la barra de herramientas:

### Implementación:

```tsx
// En components/dashboard.tsx, agregar después de los imports existentes:
import { getMockPasswords } from '@/lib/mock-data-loader';

// Dentro del componente Dashboard, agregar esta función:
const quickLoadMockData = async () => {
  if (process.env.NODE_ENV === 'development') {
    const mockData = getMockPasswords();
    await handleLoadMockData(mockData);
  }
};

// En el JSX, agregar este botón junto a los botones existentes:
{process.env.NODE_ENV === 'development' && (
  <Button 
    onClick={quickLoadMockData} 
    variant="outline" 
    size="sm"
    className="bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100"
  >
    🧪 Datos Test
  </Button>
)}
```

### Ubicación sugerida:
Junto a los botones "Generar Contraseña" y "Nueva Contraseña" en la barra de herramientas.

---

## 🎯 Opción 3: Carga Automática en Desarrollo

Para cargar automáticamente datos ficticios cada vez que inicies la aplicación en desarrollo:

### Implementación:

```tsx
// En components/dashboard.tsx, modificar el useEffect existente:
useEffect(() => {
  loadPasswords()
  
  // Cargar datos ficticios automáticamente en desarrollo si no hay datos
  if (process.env.NODE_ENV === 'development') {
    setTimeout(async () => {
      try {
        const existingPasswords = await secureStorage.getSecureItem(`passwords_${currentUser}`);
        if (!existingPasswords || existingPasswords.length === 0) {
          const mockData = getMockPasswords();
          await handleLoadMockData(mockData);
          console.log('🧪 Datos ficticios cargados automáticamente');
        }
      } catch (error) {
        console.error('Error loading auto mock data:', error);
      }
    }, 1000); // Esperar 1 segundo después de cargar
  }

  return () => {
    setPasswords([])
    setSearchTerm("")
  }
}, [currentUser])
```

### Ventajas:
- ✅ **Sin intervención**: Los datos aparecen automáticamente
- ✅ **Inteligente**: Solo carga si no hay datos existentes
- ✅ **Rápido**: Ideal para desarrollo continuo

---

## 🔧 Opción 4: Atajo de Teclado

Para desarrolladores que prefieren atajos de teclado:

### Implementación:

```tsx
// En components/dashboard.tsx, agregar este useEffect:
useEffect(() => {
  const handleKeyPress = async (event: KeyboardEvent) => {
    // Ctrl + Shift + M para cargar datos mock
    if (event.ctrlKey && event.shiftKey && event.key === 'M') {
      if (process.env.NODE_ENV === 'development') {
        event.preventDefault();
        const mockData = getMockPasswords();
        await handleLoadMockData(mockData);
        console.log('🧪 Datos ficticios cargados via atajo de teclado');
      }
    }
    
    // Ctrl + Shift + C para limpiar datos
    if (event.ctrlKey && event.shiftKey && event.key === 'C') {
      if (process.env.NODE_ENV === 'development') {
        event.preventDefault();
        await handleClearMockData();
        console.log('🧹 Datos ficticios limpiados via atajo de teclado');
      }
    }
  };

  if (process.env.NODE_ENV === 'development') {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }
}, []);
```

### Atajos disponibles:
- **Ctrl + Shift + M**: Cargar datos ficticios
- **Ctrl + Shift + C**: Limpiar datos ficticios

---

## 📱 Indicador Visual de Datos Ficticios

Para saber cuándo estás usando datos de prueba, agrega este indicador:

### Implementación:

```tsx
// En components/dashboard.tsx, agregar después del SecurityStatus:
{process.env.NODE_ENV === 'development' && passwords.length > 0 && (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-yellow-600">🧪</span>
          <span className="text-sm font-medium text-yellow-800">
            Usando {passwords.length} datos ficticios para pruebas
          </span>
        </div>
        <Button 
          onClick={handleClearMockData}
          variant="ghost" 
          size="sm"
          className="text-yellow-700 hover:text-yellow-900 hover:bg-yellow-100"
        >
          Limpiar
        </Button>
      </div>
    </div>
  </div>
)}
```

---

## 🎨 Personalización de Datos

Puedes personalizar qué datos cargar según tus necesidades:

### Ejemplos:

```tsx
// Solo redes sociales
const loadSocialMedia = async () => {
  const socialData = getMockPasswordsByCategory('redes sociales');
  await handleLoadMockData(socialData);
};

// Solo trabajo
const loadWorkData = async () => {
  const workData = getMockPasswordsByCategory('trabajo');
  await handleLoadMockData(workData);
};

// Dataset grande para pruebas de rendimiento
const loadPerformanceData = async () => {
  const largeData = generateLargeMockDataset(100);
  await handleLoadMockData(largeData);
};

// Mezcla personalizada
const loadCustomMix = async () => {
  const social = getMockPasswordsByCategory('redes sociales').slice(0, 2);
  const work = getMockPasswordsByCategory('trabajo').slice(0, 3);
  const finance = getMockPasswordsByCategory('finanzas').slice(0, 1);
  
  const customData = [...social, ...work, ...finance];
  await handleLoadMockData(customData);
};
```

---

## 🚀 Recomendación

**Para empezar rápidamente**: Usa el panel DevTools que ya está integrado. Es la opción más completa y segura.

**Para desarrollo avanzado**: Combina el panel DevTools con la carga automática para tener datos disponibles inmediatamente al iniciar la aplicación.

**Para equipos**: Usa el indicador visual para que todos sepan cuándo están trabajando con datos de prueba.

¡Los datos ficticios están listos para usar! 🎉