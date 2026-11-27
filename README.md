# Brasa Urbana

Proyecto académico con un frontend estático y un backend Express que utiliza Prisma ORM y SQL Server.

## Estructura

- `paginaComidaRapida/`: sitio HTML, CSS y JavaScript; GitHub Pages publica esta carpeta.
- `server/`: API Express, cliente Prisma y migraciones de SQL Server.
- `.github/workflows/pipeline.yml`: validaciones de frontend/backend, CodeQL y despliegue condicionado a que todas las comprobaciones pasen.

## Requisitos

- Node.js `>=22.18.0` para el backend.
- SQL Server 2017 o posterior para ejecutar consultas y migraciones.

## Backend

```bash
cd server
npm ci
```

Copia `.env.example` a `.env` y configura credenciales locales válidas. No subas `.env` al repositorio.

```bash
npm run db:validate
npm run db:generate
npm test
npm start
```

La API implementada actualmente expone `GET /api/health`. Las pruebas del adaptador verifican la configuración de SQL Server sin conectarse a una base real.

La migración Prisma actual define cuatro modelos básicos (`Producto`, `Usuario`, `Pedido` y `PedidoDetalle`); no es equivalente al esquema ERP SQL Server independiente.

## CI/CD

Cada push o pull request a `main` valida la sintaxis JavaScript, el catálogo JSON, las pruebas API, el esquema/generación de Prisma, dependencias y código con CodeQL. GitHub Pages despliega únicamente el frontend después de superar todas las comprobaciones.

Para habilitar el despliegue, configura en GitHub **Settings → Pages → Build and deployment → Source: GitHub Actions**.

El pipeline no ejecuta migraciones ni pruebas de integración contra SQL Server; se requiere una instancia configurada para esa validación.
