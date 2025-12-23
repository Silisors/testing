# ComprasBot

Sistema de Gestión de Compras con IA - Software SaaS multi-idioma para automatizar el proceso de compras empresariales.

## 🚀 Características

- **📝 Gestión de Licitaciones**: Crea listados de productos con especificaciones detalladas
- **🔍 Búsqueda Inteligente con IA**: Encuentra proveedores locales, nacionales e internacionales
- **📧 Contacto Automatizado**: Envía solicitudes de cotización personalizadas
- **📊 Análisis de Cotizaciones**: Compara precios, tiempos y condiciones automáticamente
- **🌐 Multi-idioma**: Español, Inglés y Portugués

## 📋 Requisitos

- Node.js 18+
- PostgreSQL 14+
- (Opcional) API Key de OpenAI para funciones de IA

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <repo-url>
cd comprasbot
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

4. **Configurar la base de datos**
```bash
npx prisma generate
npx prisma db push
```

5. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

6. **Abrir en el navegador**
```
http://localhost:3000
```

## ⚙️ Variables de Entorno

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `DATABASE_URL` | URL de conexión a PostgreSQL | ✅ |
| `NEXTAUTH_URL` | URL base de la aplicación | ✅ |
| `NEXTAUTH_SECRET` | Secret para JWT | ✅ |
| `OPENAI_API_KEY` | API key de OpenAI | ❌ |
| `RESEND_API_KEY` | API key de Resend (emails) | ❌ |

## 🏗️ Estructura del Proyecto

```
comprasbot/
├── prisma/                 # Esquema de base de datos
├── src/
│   ├── app/               # App Router de Next.js
│   │   ├── [locale]/      # Rutas con i18n
│   │   │   ├── dashboard/ # Panel de control
│   │   │   ├── login/     # Autenticación
│   │   │   └── register/  # Registro
│   │   └── api/           # API Routes
│   ├── components/        # Componentes React
│   │   ├── ui/           # Componentes base
│   │   └── dashboard/    # Componentes del dashboard
│   ├── lib/              # Utilidades y servicios
│   │   ├── ai/           # Motores de IA
│   │   └── prisma.ts     # Cliente de BD
│   └── i18n/             # Internacionalización
│       └── messages/     # Traducciones
└── public/               # Archivos estáticos
```

## 🤖 Funcionalidades de IA

### Sin API Key de OpenAI
El sistema funciona con datos de demostración:
- Proveedores de ejemplo pre-configurados
- Análisis básico de cotizaciones
- Templates de email estándar

### Con API Key de OpenAI
Funcionalidades completas:
- Búsqueda inteligente de proveedores por categoría
- Análisis semántico de productos
- Generación de emails personalizados
- Comparación avanzada de cotizaciones con recomendaciones

## 📝 Uso Básico

1. **Registrar empresa**: Crea una cuenta con los datos de tu empresa
2. **Crear licitación**: Define los productos que necesitas
3. **Buscar proveedores**: El sistema busca proveedores según el alcance
4. **Recibir cotizaciones**: Los proveedores envían sus ofertas
5. **Comparar y decidir**: El sistema te muestra las mejores opciones

## 🔒 Seguridad

- Autenticación con NextAuth.js
- Contraseñas hasheadas con bcrypt
- Sesiones JWT
- Validación de datos con Zod

## 📄 Licencia

MIT
