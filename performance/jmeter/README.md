# Prueba de coexistencia con JMeter

Este plan compara dos servicios que comparten la API Spring Boot y SQL Server:

- Servicio A: registro de despachos.
- Servicio B: consulta y generación de reportes de despachos.

Se ejecutan tres rondas de cada escenario:

1. A sin compartir recursos con B.
2. B sin compartir recursos con A.
3. A y B simultáneamente.

## Requisitos

- Backend local disponible en `http://localhost:8085`.
- Usuario Operador activo con permisos de despachos y reportes.
- JMeter 5.6.3 en `%USERPROFILE%\Tools\apache-jmeter-5.6.3`.
- Variables `E2E_OPERATOR_USER` y `E2E_OPERATOR_PASSWORD` definidas en la terminal.

## Ejecución

Desde la raíz del frontend:

```powershell
.\performance\jmeter\ejecutar-coexistencia.ps1
```

La configuración predeterminada usa 2 usuarios virtuales por servicio, 5 iteraciones y 3 repeticiones. Para cambiarla:

```powershell
.\performance\jmeter\ejecutar-coexistencia.ps1 `
  -UsuariosA 3 `
  -UsuariosB 3 `
  -Iteraciones 10 `
  -Repeticiones 3
```

Los archivos `.jtl`, logs e informes HTML quedan en `performance/results/coexistencia-fecha-hora`. Esa carpeta está excluida de Git porque puede contener datos de las respuestas.

