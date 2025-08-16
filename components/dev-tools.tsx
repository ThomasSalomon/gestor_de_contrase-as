'use client';

import React, { useState } from 'react';
import { PasswordEntry } from '@/types/password';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  getMockPasswords, 
  getMockPasswordsByCategory, 
  generateLargeMockDataset,
  clearMockData,
  exportMockData,
  simulateAsyncOperation,
  TEST_SCENARIOS,
  isTestEnvironment
} from '@/lib/mock-data-loader';
import { Database, Trash2, Download, TestTube, AlertTriangle } from 'lucide-react';

interface DevToolsProps {
  onLoadData?: (passwords: PasswordEntry[]) => void;
  onClearData?: () => void;
}

/**
 * Componente de herramientas de desarrollo para gestionar datos ficticios
 * SOLO VISIBLE EN ENTORNO DE DESARROLLO
 */
export function DevTools({ onLoadData, onClearData }: DevToolsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [lastAction, setLastAction] = useState<string>('');
  const [loadedCount, setLoadedCount] = useState<number>(0);

  // No mostrar en producción
  if (!isTestEnvironment()) {
    return null;
  }

  const handleLoadData = async (scenario: keyof typeof TEST_SCENARIOS) => {
    setIsLoading(true);
    try {
      const data = TEST_SCENARIOS[scenario];
      await new Promise(resolve => setTimeout(resolve, 500)); // Simular carga
      
      if (onLoadData) {
        onLoadData(data as PasswordEntry[]);
      }
      
      setLoadedCount(data.length);
      setLastAction(`Cargados ${data.length} registros (${scenario})`);
    } catch (error) {
      setLastAction('Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (onClearData) {
        onClearData();
      }
      
      clearMockData();
      setLoadedCount(0);
      setLastAction('Datos limpiados');
    } catch (error) {
      setLastAction('Error al limpiar datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadByCategory = async (category: string) => {
    setIsLoading(true);
    try {
      const data = getMockPasswordsByCategory(category);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (onLoadData) {
        onLoadData(data);
      }
      
      setLoadedCount(data.length);
      setLastAction(`Cargados ${data.length} registros de ${category}`);
    } catch (error) {
      setLastAction('Error al cargar por categoría');
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ['Financiero', 'Compras', 'Social', 'Trabajo', 'Entretenimiento', 'Productividad', 'Educación', 'Salud', 'Viajes'];

  return (
    <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TestTube className="h-5 w-5 text-orange-600" />
          <CardTitle className="text-orange-800 dark:text-orange-200">
            Herramientas de Desarrollo
          </CardTitle>
          <Badge variant="outline" className="text-orange-600 border-orange-300">
            DEV ONLY
          </Badge>
        </div>
        <CardDescription className="text-orange-700 dark:text-orange-300">
          Utilidades para cargar datos ficticios durante las pruebas
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert className="border-orange-300 bg-orange-100 dark:bg-orange-900">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800 dark:text-orange-200">
            Estas herramientas solo están disponibles en entorno de desarrollo.
            Los datos cargados son completamente ficticios y seguros para pruebas.
          </AlertDescription>
        </Alert>

        {lastAction && (
          <div className="text-sm text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900 p-2 rounded">
            <strong>Última acción:</strong> {lastAction}
            {loadedCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {loadedCount} registros
              </Badge>
            )}
          </div>
        )}

        <div className="space-y-3">
          <h4 className="font-medium text-orange-800 dark:text-orange-200">Escenarios de Prueba</h4>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLoadData('EMPTY_STATE')}
              disabled={isLoading}
              className="border-orange-300 text-orange-700 hover:bg-orange-100"
            >
              <Database className="h-4 w-4 mr-2" />
              Estado Vacío
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLoadData('SMALL_DATASET')}
              disabled={isLoading}
              className="border-orange-300 text-orange-700 hover:bg-orange-100"
            >
              <Database className="h-4 w-4 mr-2" />
              Dataset Pequeño (3)
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLoadData('MEDIUM_DATASET')}
              disabled={isLoading}
              className="border-orange-300 text-orange-700 hover:bg-orange-100"
            >
              <Database className="h-4 w-4 mr-2" />
              Dataset Mediano (10)
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLoadData('LARGE_DATASET')}
              disabled={isLoading}
              className="border-orange-300 text-orange-700 hover:bg-orange-100"
            >
              <Database className="h-4 w-4 mr-2" />
              Dataset Grande (50)
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleLoadData('PERFORMANCE_TEST')}
            disabled={isLoading}
            className="w-full border-orange-300 text-orange-700 hover:bg-orange-100"
          >
            <TestTube className="h-4 w-4 mr-2" />
            Prueba de Rendimiento (500 registros)
          </Button>
        </div>

        <Separator className="bg-orange-300" />

        <div className="space-y-3">
          <h4 className="font-medium text-orange-800 dark:text-orange-200">Cargar por Categoría</h4>
          
          <div className="grid grid-cols-3 gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant="ghost"
                size="sm"
                onClick={() => handleLoadByCategory(category)}
                disabled={isLoading}
                className="text-xs text-orange-700 hover:bg-orange-100"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <Separator className="bg-orange-300" />

        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleClearData}
            disabled={isLoading}
            className="flex-1"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Limpiar Datos
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const data = getMockPasswords();
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'mock-passwords.json';
              a.click();
              URL.revokeObjectURL(url);
              setLastAction('Datos exportados');
            }}
            disabled={isLoading}
            className="border-orange-300 text-orange-700 hover:bg-orange-100"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>

        <div className="text-xs text-orange-600 dark:text-orange-400 mt-4">
          💡 <strong>Tip:</strong> Usa estos datos para probar diferentes estados de la aplicación,
          rendimiento con grandes volúmenes de datos, y funcionalidades de búsqueda y filtrado.
        </div>
      </CardContent>
    </Card>
  );
}

export default DevTools;