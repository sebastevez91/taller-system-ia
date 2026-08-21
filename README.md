# Taller System IA

Web app para gestión de mantenimiento de vehículos con predicción de fallas mediante Machine Learning.

Permite registrar vehículos, sus componentes instalados y el historial de mantenimientos, y usa un modelo de IA entrenado para estimar el riesgo de falla de cada componente en base a su desgaste — generando alertas automáticas antes de que ocurra una falla real.

## Arquitectura

```
┌──────────────────┐      ┌───────────────────────┐      ┌──────────────────────┐
│  React (frontend) │ ───▶ │  Node + Express (API)  │ ───▶ │ PostgreSQL (Prisma)   │
└──────────────────┘      └───────────┬───────────┘      └──────────────────────┘
                                       │
                                       ▼
                            ┌───────────────────────┐
                            │ FastAPI + scikit-learn │
                            │  (microservicio de IA)  │
                            └───────────────────────┘
```

El servicio de IA está separado del backend principal a propósito: Python tiene el ecosistema de ML (pandas, scikit-learn) que Node no tiene, y en un sistema real el componente de IA suele evolucionar y escalar de forma independiente del backend de negocio.

## Stack y decisiones técnicas

| Capa | Tecnología | Por qué |
|---|---|---|
| Frontend | React + Vite + TypeScript + Tailwind | Desarrollo rápido, tipado estático, estilos utilitarios sin overhead de CSS a mano |
| Backend | Node.js + Express + TypeScript + Prisma | ORM tipado end-to-end, migraciones versionadas, integridad referencial |
| Base de datos | PostgreSQL | Modelo de datos fuertemente relacional (vehículos, componentes, mantenimientos con dependencias entre sí) |
| IA | Python + scikit-learn + FastAPI | Ecosistema estándar de ML; FastAPI valida tipos automáticamente vía Pydantic |
| Auth | JWT + bcrypt | Autenticación stateless con autorización por rol (ADMIN / MECANICO / DUENIO) |

**Enfoque de IA**: el modelo (`RandomForestClassifier`) se entrena con un dataset sintético generado con reglas de desgaste realistas (probabilidad de falla creciente según el porcentaje de vida útil consumido, con ruido aleatorio para simular variabilidad real). El pipeline completo de generación, entrenamiento y evaluación está en `ml-service/train_model.py`, reproducible con un solo comando.

## Funcionalidades

- Autenticación JWT con 3 roles (ADMIN, MECANICO, DUENIO), cada uno con permisos distintos sobre cada recurso
- CRUD de vehículos, catálogo de componentes, y mantenimientos (con actualización automática de kilometraje vía transacción)
- Predicción de riesgo de falla por componente instalado, generada por un modelo de ML propio
- Dashboard con vehículos ordenados por nivel de riesgo
- Sistema de notificaciones para alertas de riesgo alto, con deduplicación
- Panel de administración de usuarios y roles

## Cómo correrlo localmente

### Requisitos
- Node.js 20+
- Python 3.12+
- Docker

### 1. Base de datos
```bash
docker compose up -d
```

### 2. Backend
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### 3. Servicio de IA
```bash
cd ml-service
python -m venv venv
source venv/Scripts/activate  # Windows (Git Bash) — usar `source venv/bin/activate` en Mac/Linux
pip install -r requirements.txt
python train_model.py         # genera y entrena el modelo (una sola vez)
uvicorn main:app --reload --port 8001
```

### 4. Frontend
```bash
cd frontend
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

## Capturas

_(pendiente)_

## Autor

Sebastián Tevez — [GitHub](https://github.com/sebastevez91)