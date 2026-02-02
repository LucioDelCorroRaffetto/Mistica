# Mistica

Un proyecto full-stack con arquitectura limpia, TDD y buenas prácticas.

## 🚀 Quick Start

### Requisitos previos

- Node.js 18+
- Docker y Docker Compose (para la base de datos)
- npm o yarn

### Configuración en 4 pasos

```bash
# 1. Clonar el repositorio
git clone <tu-repo-url>
cd Mistica

# 2. Instalar dependencias
yarn install
# o
npm install

# 3. Compilar paquetes
yarn build
# o
npm run build

# 4. Levantar el proyecto
# Terminal 1 - Base de datos
docker compose up -d

# Terminal 2 - Backend
npm run dev:backend

# Terminal 3 - Frontend
npm run dev:frontend
```

**¡Listo!** 🎉

- Frontend: http://localhost:5174
- Backend API: http://localhost:3000

---

## 📁 Estructura del Proyecto

```
Mistica/
├── apps/
│   ├── backend/          # API REST con Express
│   │   └── .env          # ✅ Pre-configurado (sin servicios externos)
│   └── frontend/         # SPA con Vite + React
│       └── .env.local    # ✅ Pre-configurado
├── domain/               # Lógica de negocio pura (Clean Architecture)
└── package.json          # Workspace root
```

---

## 🛠️ Comandos Útiles

### Desarrollo

```bash
# Compilar solo domain (si haces cambios en la lógica de negocio)
npm run build:domain

# Frontend solo
npm run dev:frontend

# Backend solo
npm run dev:backend
```

### Testing (TDD)

```bash
# Ejecutar todos los tests
npm run test

# Tests por paquete
npm run test:domain
npm run test:backend
npm run test:frontend

# Watch mode para TDD
cd domain && npx vitest
```

### Base de Datos

```bash
# Levantar PostgreSQL
docker compose up -d

# Detener y limpiar
docker compose down -v
```

---

## 🏗️ Arquitectura y Buenas Prácticas

### Clean Architecture

El proyecto sigue los principios de **Clean Architecture**:

- **Domain** (`domain/`): Lógica de negocio pura, sin dependencias de infraestructura
  - Entidades, casos de uso, interfaces
  - Framework-agnostic
  - 100% testeable en aislamiento

- **Application** (`apps/backend`, `apps/frontend`): Capas de infraestructura
  - Backend: Express, base de datos, APIs externas
  - Frontend: React, UI, estado

### Test-Driven Development (TDD)

Todo el código crítico está testeado:

- **Domain**: Tests unitarios puros (mocks para todas las dependencias)
- **Backend**: Tests de integración y unitarios
- **Frontend**: Tests de componentes

**Flujo TDD recomendado:**

1. Escribe el test primero (Red)
2. Implementa el código mínimo (Green)
3. Refactoriza (Refactor)

### Principios de Clean Code

- ✅ Funciones pequeñas y con un solo propósito
- ✅ Nombres descriptivos y consistentes
- ✅ Sin comentarios innecesarios (el código se auto-documenta)
- ✅ DRY (Don't Repeat Yourself)
- ✅ Inyección de dependencias para testeabilidad

---

## 🔧 Configuración de Entorno

Los archivos `.env` ya están pre-configurados para desarrollo local:

### Backend (`apps/backend/.env`)

- Puerto: 3000
- Base de datos: PostgreSQL (Docker)
- JWT secrets: Pre-configurados para desarrollo

### Frontend (`apps/frontend/.env.local`)

- API URL: http://localhost:3000

> **Nota de Seguridad**: Los secrets actuales son solo para desarrollo. En producción, genera nuevos secretos seguros:
>
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

---

---

## 📚 Recursos y Documentación

### Aprender más sobre la arquitectura

- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [TDD - Kent Beck](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530)

### Stack Tecnológico

- **Frontend**: React + Vite + TypeScript
- **Backend**: Express + TypeScript
- **Database**: PostgreSQL
- **Testing**: Vitest
- **Monorepo**: npm workspaces / yarn workspaces

---

## 💡 Próximos Pasos

Después de levantar el proyecto:

1. Explora la estructura en `domain/` para entender la lógica de negocio
2. Revisa los tests existentes para ver ejemplos de TDD
3. Crea nuevas features siguiendo el flujo TDD (Red-Green-Refactor)

---

## ❓ Troubleshooting

**Error: Puerto 3000 ya está en uso**

```bash
# Encontrar y matar el proceso
lsof -ti:3000 | xargs kill -9
# o en Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Error: No se puede conectar a la base de datos**

```bash
# Verificar que Docker esté corriendo
docker ps

# Reiniciar contenedores
docker compose down -v && docker compose up -d
```

**Tests fallan después de pull**

```bash
# Reinstalar y recompilar
yarn install && yarn build
```
