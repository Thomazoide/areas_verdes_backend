# Áreas Verdes Backend (Pre-Alpha)

Backend construido con NestJS y TypeORM para gestionar cuadrillas de mantenimiento de áreas verdes, integrando portal web y aplicación móvil. El sistema centraliza usuarios, equipos, vehículos, beacons, órdenes de trabajo y formularios de visita, además de emitir eventos en tiempo real y almacenar evidencia fotográfica en AWS S3.

## Arquitectura
- **NestJS 10** con módulos por dominio (equipos, vehículos, zonas, beacons, órdenes de trabajo, formularios y usuarios).
- **TypeORM + MariaDB/MySQL** para persistencia; entidades sincronizadas automáticamente en `src/models`.
- **ConfigModule + TypeOrmModule** cargan variables de entorno y configuran la conexión en `src/config/dbConfig.ts`.
- **AWS S3** se usa para almacenar fotos de formularios mediante el servicio `VisitFormService`.
- **Socket.IO Gateway** (`VehicleGateway`) expone `namespace /position` para actualizar y difundir ubicaciones vehiculares.

## Casos de uso principales
- **Usuarios**: registro y login con contraseñas firmadas (HMAC) y emisión de JWT (`UserService`).
- **Equipos de trabajo**: creación, asignación de supervisores, empleados y vehículos (`TeamService`).
- **Órdenes de trabajo**: CRUD completo enlazado a equipos y formularios (`WorkOrderService`).
- **Formularios de visita**: carga vía `multipart/form-data` con fotos opcionales; S3 devuelve URL pública (`VisitFormController`).
- **Zonas y beacons**: administración de plazas, asignación de beacons y registros históricos (`ZoneService`, `BeaconService`).
- **Vehículos**: seguimiento y actualización de telemetría, consulta individual o global (`VehicleService`, `VehicleGateway`).

## Endpoints destacados
- `POST /users/sign-up` y `POST /users/log-in`: gestión de usuarios.
- `POST /equipos/sign-in`: autenticación de supervisores en field app.
- `POST /formularios` + `GET /formularios/zona/:zonaId`: formularios con evidencia.
- `POST /ordenes`, `GET /ordenes`, `GET /ordenes/equipo/:teamID`: flujo de órdenes de trabajo.
- `POST /plazas`, `POST /plazas/add-multiple`, `PUT /plazas/asignar-beacon/:bid/:zid`: administración de zonas.
- `POST /vehiculos`, `GET /vehiculos`: catálogo de vehículos.
- WebSocket `/position`: eventos `actualizar-posicion` y `obtener-posicion`.

## Requisitos y configuración
- Node.js 20+, npm.
- Base de datos MariaDB/MySQL accesible.
- Variables de entorno clave (`.env`):
	- `PORT`, `DBHOST`, `DBPORT`, `DBNAME`, `DBUSER`, `DBPASS`.
	- `AWS_REGION`, `BUCKET_NAME`, `S3_PUBLIC_URL_BASE`, `S3_OBJECT_ACL`.
	- `SECRET`, `PEPPER` para hashing/JWT.
- Instalar dependencias: `npm install`.
- Levantar servidor: `npm run start:dev` (CORS habilitado para entornos locales y túneles).

## Próximos pasos sugeridos
- Documentar esquemas de respuesta y validaciones (DTOs).
- Añadir pruebas unitarias/integrares por módulo (Team, VisitForm, WorkOrder, etc.).
- Desplegar políticas de bucket o CloudFront según ambiente.
- Completar autenticación/autorización para módulos restantes.

> Estado: Pre-alpha. Se recomienda revisar y ajustar la configuración antes de entornos productivos.