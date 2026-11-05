# Sistema de Despacho Agrihusa

Proyecto académico desarrollado para gestionar los procesos relacionados con el despacho de productos agrícolas de la empresa Agrihusa.

Esta primera versión funciona únicamente en el frontend y utiliza `localStorage` para simular el almacenamiento de información. En una segunda etapa se realizará la conexión con un backend y una base de datos.

## Objetivo del proyecto

Desarrollar una aplicación web que permita administrar los catálogos, usuarios, permisos y registros necesarios para realizar el seguimiento de los despachos de productos agrícolas.

## Tecnologías utilizadas

- Angular 18
- TypeScript 5.5
- Bootstrap 5
- ng-select
- RxJS
- ExcelJS
- HTML
- SCSS
- localStorage
- Git y GitHub

## Módulos del sistema

El sistema cuenta con los siguientes módulos:

- Roles
- Usuarios
- Bitácora
- Perfil de usuario
- Clientes
- Navieras
- Destinos
- Operadores logísticos
- Puertos de llegada
- Productos
- Variedades
- Vías
- Situaciones
- Registro de despacho
- Reporte de despacho

## Funcionalidades principales

- Inicio y cierre de sesión.
- Administración de usuarios.
- Administración de roles y permisos.
- Cambio obligatorio de contraseña temporal.
- Protección de opciones según los permisos del usuario.
- Registro de acciones en la bitácora.
- Gestión de los catálogos del sistema.
- Creación y edición de despachos.
- Relación entre productos y variedades.
- Búsqueda y filtrado de registros.
- Paginación de resultados.
- Activación y desactivación de registros.
- Generación de reportes de despacho.
- Exportación de reportes en formato Excel.

## Organización del proyecto

```text
src/
└── app/
    ├── core/
    │   ├── constants/
    │   ├── models/
    │   └── services/
    │
    ├── features/
    │   ├── auditoria/
    │   ├── clientes/
    │   ├── destinos/
    │   ├── navieras/
    │   ├── operadores-logisticos/
    │   ├── perfil-usuario/
    │   ├── productos/
    │   ├── puertos-llegada/
    │   ├── registro-despacho/
    │   ├── reporte-despacho/
    │   ├── roles/
    │   ├── situaciones/
    │   ├── usuarios/
    │   ├── variedades/
    │   └── vias/
    │
    └── shared/
        ├── components/
        └── enums/
```

Cada módulo puede contener las siguientes carpetas:

```text
nombre-del-modulo/
├── components/
├── data/
├── models/
├── services/
└── views/
```

## Requisitos

Antes de ejecutar el proyecto se debe tener instalado:

- Node.js 20.19.1 o una versión compatible.
- npm.
- Git.
- Visual Studio Code u otro editor.

Para comprobar las versiones instaladas:

```bash
node --version
npm --version
git --version
```

## Instalación del proyecto

Clonar el repositorio:

```bash
git clone https://github.com/carloss1901/agrihusa-integrador-ui.git
```

Ingresar a la carpeta:

```bash
cd agrihusa-integrador-ui
```

Cambiar a la rama de desarrollo:

```bash
git checkout develop
```

Instalar las dependencias:

```bash
npm ci
```

## Ejecución

Para iniciar el proyecto:

```bash
npm start
```

Después, abrir en el navegador:

```text
http://localhost:4200
```

## Compilación

Para comprobar que el proyecto compile correctamente:

```bash
npm run build
```

Los archivos generados se almacenarán en la carpeta `dist`.

## Almacenamiento local

Durante el Sprint 1, los datos se almacenan en `localStorage`.

Los datos iniciales se cargan mediante archivos `seed` cuando la aplicación se ejecuta por primera vez en el navegador.

Cada computadora y navegador mantiene sus propios datos. La información todavía no se comparte entre diferentes usuarios o equipos.

## Seguridad

La primera versión incluye una simulación local de:

- Autenticación.
- Sesión de usuario.
- Hash de contraseñas.
- Roles.
- Permisos.
- Protección de navegación.
- Cambio obligatorio de contraseña.
- Registro de acciones en la bitácora.

Esta seguridad es únicamente demostrativa porque toda la información se encuentra en el navegador.

## Reportes

El módulo Reporte de despacho permite consultar información mediante filtros y exportar los resultados a un archivo Excel.

El archivo generado contiene:

- Título del reporte.
- Fecha de generación.
- Resumen de resultados.
- Encabezados con formato.
- Filtros por columna.
- Bordes y colores.
- Información consolidada del despacho.

## Próxima etapa

En el Sprint 2 se tiene previsto implementar:

- Backend del sistema.
- Base de datos.
- Servicios HTTP.
- Autenticación real.
- Tokens de acceso.
- Validación de permisos en el servidor.
- Bitácora centralizada.
- Integración entre frontend y backend.

## Trabajo colaborativo

El proyecto utiliza GitHub para el control de versiones.

Las nuevas funcionalidades deben desarrollarse en ramas independientes y posteriormente integrarse en `develop` mediante Pull Requests.

Ejemplo:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nombre-integrante
```

## Estado del proyecto

Sprint 1 completado:

- Frontend implementado.
- Persistencia local implementada.
- Módulos principales verificados.
- Reporte Excel verificado.
- Compilación realizada correctamente.


## Proyecto académico

Este sistema fue desarrollado con fines académicos como parte del curso de Proyecto Integrador.