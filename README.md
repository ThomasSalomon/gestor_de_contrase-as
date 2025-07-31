# 🔐 Gestor de Contraseñas

Un gestor de contraseñas moderno y seguro construido con Next.js, React y TypeScript. Esta aplicación permite a los usuarios almacenar, generar y gestionar sus contraseñas de forma segura con una interfaz intuitiva y moderna.

## ✨ Características

- 🔑 **Gestión segura de contraseñas** - Almacena y organiza todas tus contraseñas
- 🎲 **Generador de contraseñas** - Crea contraseñas seguras personalizables
- 👁️ **Visualización controlada** - Muestra/oculta contraseñas según necesites
- 📋 **Copia al portapapeles** - Copia usuarios y contraseñas con un clic
- 🗂️ **Organización por dominio** - Agrupa contraseñas por sitio web
- 📝 **Notas adicionales** - Agrega comentarios y notas a cada entrada
- 🎨 **Interfaz moderna** - UI elegante construida con shadcn/ui
- 🌙 **Tema claro/oscuro** - Soporte completo para temas
- 📱 **Responsive** - Funciona perfectamente en móviles y desktop
- 🔒 **Autenticación local** - Sistema de login seguro

## 🚀 Tecnologías Utilizadas

- **Next.js 15** - Framework de React con App Router
- **React 19** - Biblioteca de interfaces de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS** - Framework de CSS utilitario
- **shadcn/ui** - Componentes de UI modernos y accesibles
- **Lucide React** - Iconos modernos y escalables
- **React Hook Form** - Manejo eficiente de formularios
- **Zod** - Validación de esquemas TypeScript-first

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18.0 o superior)
- **npm** (viene incluido con Node.js)
- **Git** (para clonar el repositorio)

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/ThomasSalomon/gestor_de_contrase-as.git
cd gestor_de_contrase-as
```

### 2. Instalar dependencias

```bash
npm install
```

*Nota: Si encuentras conflictos de dependencias, usa:*
```bash
npm install --legacy-peer-deps
```

### 3. Ejecutar en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 📝 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter para revisar el código

## 🔧 Configuración

### Variables de Entorno (Opcional)

Crea un archivo `.env.local` en la raíz del proyecto si necesitas configuraciones específicas:

```env
# Ejemplo de variables de entorno
NEXT_PUBLIC_APP_NAME="Gestor de Contraseñas"
NEXT_PUBLIC_VERSION="1.0.0"
```

## 📖 Cómo Usar

### Primer Uso

1. **Abrir la aplicación** en tu navegador
2. **Crear una cuenta** introduciendo un nombre de usuario
3. **Iniciar sesión** con tus credenciales

### Gestionar Contraseñas

1. **Agregar nueva contraseña:**
   - Haz clic en "Nueva Contraseña"
   - Completa el formulario con dominio, usuario y contraseña
   - Opcionalmente agrega notas
   - Guarda la entrada

2. **Generar contraseña segura:**
   - Usa el generador integrado
   - Personaliza longitud y caracteres
   - Copia la contraseña generada

3. **Visualizar contraseñas:**
   - Haz clic en el ícono del ojo para mostrar/ocultar
   - Usa el botón de copiar para portapapeles

4. **Editar/Eliminar:**
   - Usa los iconos de edición y eliminación
   - Confirma las acciones destructivas

## 🏗️ Estructura del Proyecto

```
📦 gestor_de_contrase-as/
├── 📁 app/                    # App Router de Next.js
│   ├── globals.css           # Estilos globales
│   ├── layout.tsx            # Layout principal
│   └── page.tsx              # Página principal
├── 📁 components/            # Componentes React
│   ├── 📁 ui/               # Componentes UI base (shadcn)
│   ├── dashboard.tsx        # Panel principal
│   ├── login-form.tsx       # Formulario de login
│   ├── password-form.tsx    # Formulario de contraseñas
│   ├── password-generator.tsx # Generador de contraseñas
│   ├── password-list.tsx    # Lista de contraseñas
│   └── security-status.tsx  # Estado de seguridad
├── 📁 hooks/                # Custom hooks
├── 📁 lib/                  # Utilidades y configuración
├── 📁 types/                # Definiciones de TypeScript
├── 📁 public/               # Archivos estáticos
└── 📁 styles/               # Estilos adicionales
```

## 🔒 Seguridad

- **Almacenamiento local:** Las contraseñas se almacenan localmente en el navegador
- **No hay servidor:** Toda la información permanece en tu dispositivo
- **Cifrado:** Se recomienda usar HTTPS en producción
- **Mejores prácticas:** Usa contraseñas únicas y fuertes para cada sitio

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio de GitHub a Vercel
2. La aplicación se desplegará automáticamente
3. Vercel detectará que es un proyecto Next.js

### Otros Proveedores

Para desplegar en otros servicios:

```bash
npm run build
```

Luego sube la carpeta `.next` y archivos estáticos a tu proveedor de hosting.

## 🤝 Contribuir

1. Fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Thomas Salomon** - [GitHub](https://github.com/ThomasSalomon)

## 🐛 Reportar Bugs

Si encuentras algún bug o tienes sugerencias, por favor abre un [issue](https://github.com/ThomasSalomon/gestor_de_contrase-as/issues) en GitHub.

## 📞 Soporte

Para soporte técnico o preguntas:
- Abre un issue en GitHub
- Revisa la documentación
- Consulta la sección de FAQ (próximamente)

---

⭐ **¡No olvides dar una estrella al proyecto si te ha sido útil!**
