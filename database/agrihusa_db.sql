-- ============================================================
-- SISTEMA DE DESPACHO AGRIHUSA
-- Script inicial de base de datos para MySQL 8
-- ============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE DATABASE IF NOT EXISTS agrihusa_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE agrihusa_db;

-- ============================================================
-- 1. SEGURIDAD Y AUDITORÍA
-- ============================================================

CREATE TABLE IF NOT EXISTS permiso (
  id INT AUTO_INCREMENT,
  modulo VARCHAR(50) NOT NULL,
  accion VARCHAR(50) NOT NULL,
  descripcion VARCHAR(150) NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME NULL DEFAULT NULL
    ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_permiso PRIMARY KEY (id),
  CONSTRAINT uq_permiso_modulo_accion UNIQUE (modulo, accion),
  CONSTRAINT chk_permiso_activo CHECK (activo IN (0, 1))
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS rol (
  id INT AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(250) NULL,
  es_sistema TINYINT(1) NOT NULL DEFAULT 0,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME NULL DEFAULT NULL
    ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_rol PRIMARY KEY (id),
  CONSTRAINT uq_rol_nombre UNIQUE (nombre),
  CONSTRAINT chk_rol_es_sistema CHECK (es_sistema IN (0, 1)),
  CONSTRAINT chk_rol_activo CHECK (activo IN (0, 1))
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS rol_permiso (
  rol_id INT NOT NULL,
  permiso_id INT NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME NULL DEFAULT NULL
    ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_rol_permiso PRIMARY KEY (rol_id, permiso_id),
  CONSTRAINT chk_rol_permiso_activo CHECK (activo IN (0, 1)),
  CONSTRAINT fk_rol_permiso_rol
    FOREIGN KEY (rol_id) REFERENCES rol (id)
    ON UPDATE RESTRICT ON DELETE CASCADE,
  CONSTRAINT fk_rol_permiso_permiso
    FOREIGN KEY (permiso_id) REFERENCES permiso (id)
    ON UPDATE RESTRICT ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS usuario (
  id INT AUTO_INCREMENT,
  rol_id INT NOT NULL,
  nombre_usuario VARCHAR(50) NOT NULL,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  correo VARCHAR(150) NOT NULL,
  telefono VARCHAR(30) NULL,
  password_hash VARCHAR(255) NOT NULL,
  es_sistema TINYINT(1) NOT NULL DEFAULT 0,
  debe_cambiar_password TINYINT(1) NOT NULL DEFAULT 1,
  ultimo_acceso DATETIME NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME NULL DEFAULT NULL
    ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_usuario PRIMARY KEY (id),
  CONSTRAINT uq_usuario_nombre_usuario UNIQUE (nombre_usuario),
  CONSTRAINT uq_usuario_correo UNIQUE (correo),
  KEY idx_usuario_rol (rol_id),
  KEY idx_usuario_activo (activo),
  CONSTRAINT chk_usuario_es_sistema CHECK (es_sistema IN (0, 1)),
  CONSTRAINT chk_usuario_cambiar_password
    CHECK (debe_cambiar_password IN (0, 1)),
  CONSTRAINT chk_usuario_activo CHECK (activo IN (0, 1)),
  CONSTRAINT fk_usuario_rol
    FOREIGN KEY (rol_id) REFERENCES rol (id)
    ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS sesion_usuario (
  id BIGINT AUTO_INCREMENT,
  usuario_id INT NOT NULL,
  refresh_token_hash VARCHAR(255) NOT NULL,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_expiracion DATETIME NOT NULL,
  fecha_revocacion DATETIME NULL,
  direccion_ip VARCHAR(45) NULL,
  agente_usuario VARCHAR(500) NULL,
  CONSTRAINT pk_sesion_usuario PRIMARY KEY (id),
  CONSTRAINT uq_sesion_refresh_token UNIQUE (refresh_token_hash),
  KEY idx_sesion_usuario (usuario_id),
  KEY idx_sesion_expiracion (fecha_expiracion),
  CONSTRAINT chk_sesion_fechas
    CHECK (fecha_expiracion > fecha_creacion),
  CONSTRAINT fk_sesion_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuario (id)
    ON UPDATE RESTRICT ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS bitacora (
  id BIGINT AUTO_INCREMENT,
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  usuario_id INT NULL,
  nombre_usuario VARCHAR(50) NOT NULL,
  modulo VARCHAR(50) NOT NULL,
  accion VARCHAR(50) NOT NULL,
  entidad VARCHAR(100) NULL,
  registro_id INT NULL,
  detalle VARCHAR(500) NULL,
  resultado VARCHAR(20) NOT NULL,
  CONSTRAINT pk_bitacora PRIMARY KEY (id),
  KEY idx_bitacora_fecha (fecha),
  KEY idx_bitacora_usuario (usuario_id),
  KEY idx_bitacora_modulo (modulo),
  KEY idx_bitacora_accion (accion),
  KEY idx_bitacora_resultado (resultado),
  CONSTRAINT chk_bitacora_resultado
    CHECK (resultado IN ('EXITO', 'ERROR')),
  CONSTRAINT fk_bitacora_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuario (id)
    ON UPDATE RESTRICT ON DELETE SET NULL
) ENGINE = InnoDB;

-- ============================================================
-- 2. CATÁLOGOS
-- ============================================================

CREATE TABLE IF NOT EXISTS cliente (
  id INT AUTO_INCREMENT,
  tipo_documento VARCHAR(30) NOT NULL,
  numero_documento VARCHAR(30) NOT NULL,
  razon_social VARCHAR(200) NOT NULL,
  nombre_comercial VARCHAR(200) NULL,
  contacto VARCHAR(150) NULL,
  correo VARCHAR(150) NULL,
  telefono VARCHAR(30) NULL,
  direccion VARCHAR(250) NULL,
  pais VARCHAR(100) NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME NULL DEFAULT NULL
    ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_cliente PRIMARY KEY (id),
  CONSTRAINT uq_cliente_numero_documento UNIQUE (numero_documento),
  CONSTRAINT uq_cliente_razon_social UNIQUE (razon_social),
  KEY idx_cliente_activo (activo),
  CONSTRAINT chk_cliente_tipo_documento
    CHECK (
      tipo_documento IN (
        'RUC',
        'DNI',
        'CARNET_EXTRANJERIA',
        'PASAPORTE',
        'OTRO'
      )
    ),
  CONSTRAINT chk_cliente_activo CHECK (activo IN (0, 1))
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS naviera (
  id INT AUTO_INCREMENT,
  codigo VARCHAR(30) NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  pais VARCHAR(100) NULL,
  contacto VARCHAR(150) NULL,
  correo VARCHAR(150) NULL,
  telefono VARCHAR(30) NULL,
  sitio_web VARCHAR(250) NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME NULL DEFAULT NULL
    ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_naviera PRIMARY KEY (id),
  CONSTRAINT uq_naviera_codigo UNIQUE (codigo),
  CONSTRAINT uq_naviera_nombre UNIQUE (nombre),
  KEY idx_naviera_activo (activo),
  CONSTRAINT chk_naviera_activo CHECK (activo IN (0, 1))
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS destino (
  id INT AUTO_INCREMENT,
  pais VARCHAR(100) NOT NULL,
  ciudad VARCHAR(100) NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME NULL DEFAULT NULL
    ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_destino PRIMARY KEY (id),
  CONSTRAINT uq_destino_pais_ciudad UNIQUE (pais, ciudad),
  KEY idx_destino_activo (activo),
  CONSTRAINT chk_destino_activo CHECK (activo IN (0, 1))
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS operador_logistico (
  id INT AUTO_INCREMENT,
  ruc VARCHAR(11) NOT NULL,
  razon_social VARCHAR(200) NOT NULL,
  nombre_comercial VARCHAR(200) NULL,
  contacto VARCHAR(150) NULL,
  correo VARCHAR(150) NULL,
  telefono VARCHAR(30) NULL,
  direccion VARCHAR(250) NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME NULL DEFAULT NULL
    ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_operador_logistico PRIMARY KEY (id),
  CONSTRAINT uq_operador_ruc UNIQUE (ruc),
  CONSTRAINT uq_operador_razon_social UNIQUE (razon_social),
  KEY idx_operador_activo (activo),
  CONSTRAINT chk_operador_activo CHECK (activo IN (0, 1))
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS puerto_llegada (
  id INT AUTO_INCREMENT,
  codigo VARCHAR(30) NOT NULL,
  puerto VARCHAR(150) NOT NULL,
  pais VARCHAR(100) NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME NULL DEFAULT NULL
    ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_puerto_llegada PRIMARY KEY (id),
  CONSTRAINT uq_puerto_codigo UNIQUE (codigo),
  CONSTRAINT uq_puerto_pais UNIQUE (puerto, pais),
  KEY idx_puerto_activo (activo),
  CONSTRAINT chk_puerto_activo CHECK (activo IN (0, 1))
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS producto (
  id INT AUTO_INCREMENT,
  codigo VARCHAR(30) NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  descripcion VARCHAR(500) NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME NULL DEFAULT NULL
    ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_producto PRIMARY KEY (id),
  CONSTRAINT uq_producto_codigo UNIQUE (codigo),
  CONSTRAINT uq_producto_nombre UNIQUE (nombre),
  KEY idx_producto_activo (activo),
  CONSTRAINT chk_producto_activo CHECK (activo IN (0, 1))
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS variedad (
  id INT AUTO_INCREMENT,
  producto_id INT NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME NULL DEFAULT NULL
    ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_variedad PRIMARY KEY (id),
  CONSTRAINT uq_variedad_producto_nombre UNIQUE (producto_id, nombre),
  CONSTRAINT uq_variedad_id_producto UNIQUE (id, producto_id),
  KEY idx_variedad_activo (activo),
  CONSTRAINT chk_variedad_activo CHECK (activo IN (0, 1)),
  CONSTRAINT fk_variedad_producto
    FOREIGN KEY (producto_id) REFERENCES producto (id)
    ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS via (
  id INT AUTO_INCREMENT,
  descripcion VARCHAR(100) NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME NULL DEFAULT NULL
    ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_via PRIMARY KEY (id),
  CONSTRAINT uq_via_descripcion UNIQUE (descripcion),
  KEY idx_via_activo (activo),
  CONSTRAINT chk_via_activo CHECK (activo IN (0, 1))
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS situacion (
  id INT AUTO_INCREMENT,
  descripcion VARCHAR(100) NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME NULL DEFAULT NULL
    ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_situacion PRIMARY KEY (id),
  CONSTRAINT uq_situacion_descripcion UNIQUE (descripcion),
  KEY idx_situacion_activo (activo),
  CONSTRAINT chk_situacion_activo CHECK (activo IN (0, 1))
) ENGINE = InnoDB;

-- ============================================================
-- 3. GESTIÓN DE DESPACHOS
-- ============================================================

CREATE TABLE IF NOT EXISTS despacho (
  id INT AUTO_INCREMENT,
  codigo VARCHAR(30) NOT NULL,
  fecha_despacho DATE NOT NULL,
  fecha_estimada_llegada DATE NOT NULL,
  cliente_id INT NOT NULL,
  naviera_id INT NOT NULL,
  destino_id INT NOT NULL,
  operador_logistico_id INT NOT NULL,
  puerto_llegada_id INT NOT NULL,
  producto_id INT NOT NULL,
  variedad_id INT NOT NULL,
  via_id INT NOT NULL,
  situacion_id INT NOT NULL,
  cantidad DECIMAL(12,2) NOT NULL,
  unidad_medida VARCHAR(20) NOT NULL,
  numero_contenedor VARCHAR(20) NULL,
  observaciones VARCHAR(500) NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion DATETIME NULL DEFAULT NULL
    ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_despacho PRIMARY KEY (id),
  CONSTRAINT uq_despacho_codigo UNIQUE (codigo),
  KEY idx_despacho_fecha (fecha_despacho),
  KEY idx_despacho_cliente (cliente_id),
  KEY idx_despacho_naviera (naviera_id),
  KEY idx_despacho_destino (destino_id),
  KEY idx_despacho_operador (operador_logistico_id),
  KEY idx_despacho_puerto (puerto_llegada_id),
  KEY idx_despacho_producto (producto_id),
  KEY idx_despacho_variedad_producto (variedad_id, producto_id),
  KEY idx_despacho_via (via_id),
  KEY idx_despacho_situacion (situacion_id),
  KEY idx_despacho_activo (activo),
  CONSTRAINT chk_despacho_cantidad CHECK (cantidad > 0),
  CONSTRAINT chk_despacho_fechas
    CHECK (fecha_estimada_llegada >= fecha_despacho),
  CONSTRAINT chk_despacho_unidad
    CHECK (
      unidad_medida IN (
        'CAJAS',
        'KILOGRAMOS',
        'TONELADAS',
        'PALETS'
      )
    ),
  CONSTRAINT chk_despacho_activo CHECK (activo IN (0, 1)),
  CONSTRAINT fk_despacho_cliente
    FOREIGN KEY (cliente_id) REFERENCES cliente (id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT fk_despacho_naviera
    FOREIGN KEY (naviera_id) REFERENCES naviera (id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT fk_despacho_destino
    FOREIGN KEY (destino_id) REFERENCES destino (id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT fk_despacho_operador
    FOREIGN KEY (operador_logistico_id)
    REFERENCES operador_logistico (id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT fk_despacho_puerto
    FOREIGN KEY (puerto_llegada_id) REFERENCES puerto_llegada (id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT fk_despacho_producto
    FOREIGN KEY (producto_id) REFERENCES producto (id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT fk_despacho_variedad_producto
    FOREIGN KEY (variedad_id, producto_id)
    REFERENCES variedad (id, producto_id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT fk_despacho_via
    FOREIGN KEY (via_id) REFERENCES via (id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT fk_despacho_situacion
    FOREIGN KEY (situacion_id) REFERENCES situacion (id)
    ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE = InnoDB;

-- ============================================================
-- 4. DATOS INICIALES: ROLES Y PERMISOS
-- ============================================================

INSERT IGNORE INTO rol
  (id, nombre, descripcion, es_sistema, activo)
VALUES
  (1, 'Administrador', 'Acceso completo al sistema', 1, 1),
  (2, 'Operador', 'Gestiona despachos y consulta catálogos', 0, 1),
  (3, 'Consulta', 'Acceso de consulta y reportes', 0, 1);

INSERT IGNORE INTO permiso
  (modulo, accion, descripcion, activo)
VALUES
  ('roles', 'consultar', 'Consultar roles', 1),
  ('roles', 'crear', 'Crear roles', 1),
  ('roles', 'editar', 'Editar roles', 1),
  ('roles', 'eliminar', 'Activar o desactivar roles', 1),
  ('usuarios', 'consultar', 'Consultar usuarios', 1),
  ('usuarios', 'crear', 'Crear usuarios', 1),
  ('usuarios', 'editar', 'Editar usuarios', 1),
  ('usuarios', 'eliminar', 'Activar o desactivar usuarios', 1),
  ('bitacora', 'consultar', 'Consultar la bitácora', 1),
  ('bitacora', 'exportar', 'Exportar la bitácora', 1),
  ('perfil-usuario', 'consultar', 'Consultar el perfil', 1),
  ('perfil-usuario', 'editar', 'Editar el perfil', 1),
  ('registro-despacho', 'consultar', 'Consultar despachos', 1),
  ('registro-despacho', 'crear', 'Crear despachos', 1),
  ('registro-despacho', 'editar', 'Editar despachos', 1),
  ('registro-despacho', 'eliminar', 'Activar o desactivar despachos', 1),
  ('reporte-despacho', 'consultar', 'Consultar reportes', 1),
  ('reporte-despacho', 'exportar', 'Exportar reportes', 1),
  ('clientes', 'consultar', 'Consultar clientes', 1),
  ('clientes', 'crear', 'Crear clientes', 1),
  ('clientes', 'editar', 'Editar clientes', 1),
  ('clientes', 'eliminar', 'Activar o desactivar clientes', 1),
  ('navieras', 'consultar', 'Consultar navieras', 1),
  ('navieras', 'crear', 'Crear navieras', 1),
  ('navieras', 'editar', 'Editar navieras', 1),
  ('navieras', 'eliminar', 'Activar o desactivar navieras', 1),
  ('destinos', 'consultar', 'Consultar destinos', 1),
  ('destinos', 'crear', 'Crear destinos', 1),
  ('destinos', 'editar', 'Editar destinos', 1),
  ('destinos', 'eliminar', 'Activar o desactivar destinos', 1),
  ('operadores-logisticos', 'consultar', 'Consultar operadores logísticos', 1),
  ('operadores-logisticos', 'crear', 'Crear operadores logísticos', 1),
  ('operadores-logisticos', 'editar', 'Editar operadores logísticos', 1),
  ('operadores-logisticos', 'eliminar', 'Activar o desactivar operadores logísticos', 1),
  ('puertos-llegada', 'consultar', 'Consultar puertos de llegada', 1),
  ('puertos-llegada', 'crear', 'Crear puertos de llegada', 1),
  ('puertos-llegada', 'editar', 'Editar puertos de llegada', 1),
  ('puertos-llegada', 'eliminar', 'Activar o desactivar puertos de llegada', 1),
  ('productos', 'consultar', 'Consultar productos', 1),
  ('productos', 'crear', 'Crear productos', 1),
  ('productos', 'editar', 'Editar productos', 1),
  ('productos', 'eliminar', 'Activar o desactivar productos', 1),
  ('variedades', 'consultar', 'Consultar variedades', 1),
  ('variedades', 'crear', 'Crear variedades', 1),
  ('variedades', 'editar', 'Editar variedades', 1),
  ('variedades', 'eliminar', 'Activar o desactivar variedades', 1),
  ('vias', 'consultar', 'Consultar vías', 1),
  ('vias', 'crear', 'Crear vías', 1),
  ('vias', 'editar', 'Editar vías', 1),
  ('vias', 'eliminar', 'Activar o desactivar vías', 1),
  ('situaciones', 'consultar', 'Consultar situaciones', 1),
  ('situaciones', 'crear', 'Crear situaciones', 1),
  ('situaciones', 'editar', 'Editar situaciones', 1),
  ('situaciones', 'eliminar', 'Activar o desactivar situaciones', 1);

-- El administrador recibe todos los permisos.
INSERT IGNORE INTO rol_permiso (rol_id, permiso_id, activo)
SELECT 1, p.id, 1
FROM permiso p;

-- El operador gestiona despachos y consulta catálogos.
INSERT IGNORE INTO rol_permiso (rol_id, permiso_id, activo)
SELECT 2, p.id, 1
FROM permiso p
WHERE
  (p.modulo = 'perfil-usuario'
    AND p.accion IN ('consultar', 'editar'))
  OR p.modulo = 'registro-despacho'
  OR (p.modulo = 'reporte-despacho'
    AND p.accion IN ('consultar', 'exportar'))
  OR (p.modulo IN (
      'clientes',
      'navieras',
      'destinos',
      'operadores-logisticos',
      'puertos-llegada',
      'productos',
      'variedades',
      'vias',
      'situaciones'
    ) AND p.accion = 'consultar');

-- El rol Consulta solo visualiza información y exporta reportes.
INSERT IGNORE INTO rol_permiso (rol_id, permiso_id, activo)
SELECT 3, p.id, 1
FROM permiso p
WHERE
  (p.modulo = 'perfil-usuario'
    AND p.accion IN ('consultar', 'editar'))
  OR (p.modulo = 'registro-despacho'
    AND p.accion = 'consultar')
  OR (p.modulo = 'reporte-despacho'
    AND p.accion IN ('consultar', 'exportar'))
  OR (p.modulo IN (
      'clientes',
      'navieras',
      'destinos',
      'operadores-logisticos',
      'puertos-llegada',
      'productos',
      'variedades',
      'vias',
      'situaciones'
    ) AND p.accion = 'consultar');

-- Contraseña almacenada exclusivamente como hash BCrypt, costo 12.
INSERT IGNORE INTO usuario
  (
    id,
    rol_id,
    nombre_usuario,
    nombres,
    apellidos,
    correo,
    telefono,
    password_hash,
    es_sistema,
    debe_cambiar_password,
    activo
  )
VALUES
  (
    1,
    1,
    'ADMIN',
    'Administrador',
    'Sistema',
    'admin@agrihusa.local',
    NULL,
    '$2a$12$7MdycDWDTSxMlVsKwEWOrOD6i1DflVlf9tKR0G0qmkSJLzg7W6bwG',
    1,
    0,
    1
  );

-- ============================================================
-- 5. DATOS INICIALES: CATÁLOGOS
-- ============================================================

INSERT IGNORE INTO cliente
  (
    id,
    tipo_documento,
    numero_documento,
    razon_social,
    nombre_comercial,
    contacto,
    correo,
    telefono,
    direccion,
    pais,
    activo
  )
VALUES
  (1, 'RUC', '20555555551', 'IMPORTADORA ANDINA S.A.C.', 'IMPORTADORA ANDINA', 'María Torres', 'contacto@andina.example', '987654321', 'Av. Los Andes 450', 'PERÚ', 1),
  (2, 'RUC', '20666666662', 'DISTRIBUIDORA PACÍFICO S.A.C.', 'DISTRIBUIDORA PACÍFICO', 'Carlos Mendoza', 'ventas@pacifico.example', '986543210', 'Av. El Pacífico 820', 'PERÚ', 1),
  (3, 'RUC', '20777777773', 'COMERCIAL LOS VALLES E.I.R.L.', 'COMERCIAL LOS VALLES', 'Ana Ramírez', 'compras@losvalles.example', '985432109', 'Jr. Los Cultivos 125', 'PERÚ', 0);

INSERT IGNORE INTO naviera
  (id, codigo, nombre, pais, contacto, correo, telefono, sitio_web, activo)
VALUES
  (1, 'MSK', 'MAERSK', 'DINAMARCA', 'Área comercial', 'comercial@maersk.example', '+45 7000 1000', 'https://maersk.example', 1),
  (2, 'MSC', 'MSC', 'SUIZA', 'Área comercial', 'comercial@msc.example', '+41 7000 2000', 'https://msc.example', 1),
  (3, 'HLC', 'HAPAG-LLOYD', 'ALEMANIA', 'Área comercial', 'comercial@hapag.example', '+49 7000 3000', 'https://hapag.example', 1),
  (4, 'CMA', 'CMA CGM', 'FRANCIA', 'Área comercial', 'comercial@cma.example', '+33 7000 4000', 'https://cma.example', 0),
  (5, 'EMC', 'EVERGREEN', 'TAIWÁN', 'Área comercial', 'comercial@evergreen.example', '+886 7000 5000', 'https://evergreen.example', 1);

INSERT IGNORE INTO destino (id, pais, ciudad, activo)
VALUES
  (1, 'PERÚ', 'LIMA', 1),
  (2, 'ECUADOR', 'QUITO', 1),
  (3, 'COLOMBIA', 'BOGOTÁ', 1),
  (4, 'CHILE', 'SANTIAGO', 1),
  (5, 'BOLIVIA', 'LA PAZ', 0),
  (6, 'MÉXICO', 'CIUDAD DE MÉXICO', 1),
  (7, 'ARGENTINA', 'BUENOS AIRES', 1),
  (8, 'ESTADOS UNIDOS', 'MIAMI', 1);

INSERT IGNORE INTO operador_logistico
  (
    id,
    ruc,
    razon_social,
    nombre_comercial,
    contacto,
    correo,
    telefono,
    direccion,
    activo
  )
VALUES
  (1, '20444444441', 'LOGÍSTICA ANDINA S.A.C.', 'LOGÍSTICA ANDINA', 'Jorge Mendoza', 'operaciones@andina.example', '987111222', 'Av. Industrial 1250, Lima', 1),
  (2, '20333333332', 'TRANSPORTES DEL PACÍFICO S.A.C.', 'TRANSPORTES DEL PACÍFICO', 'Lucía Fernández', 'contacto@pacifico-logistica.example', '986222333', 'Av. Néstor Gambetta 720, Callao', 1),
  (3, '20222222223', 'CARGA SEGURA OPERACIONES E.I.R.L.', 'CARGA SEGURA', 'Miguel Salas', 'operaciones@cargasegura.example', '985333444', 'Jr. Los Transportistas 410, Lima', 0);

INSERT IGNORE INTO puerto_llegada
  (id, codigo, puerto, pais, activo)
VALUES
  (1, 'PECLL', 'CALLAO', 'PERÚ', 1),
  (2, 'CLVAP', 'VALPARAÍSO', 'CHILE', 1),
  (3, 'COBUN', 'BUENAVENTURA', 'COLOMBIA', 1),
  (4, 'ECGYE', 'GUAYAQUIL', 'ECUADOR', 0),
  (5, 'MXZLO', 'MANZANILLO', 'MÉXICO', 1);

INSERT IGNORE INTO producto
  (id, codigo, nombre, descripcion, activo)
VALUES
  (1, 'P001', 'UVA', 'UVA FRESCA DE EXPORTACIÓN', 1),
  (2, 'P002', 'PALTA', 'PALTA FRESCA DE EXPORTACIÓN', 1),
  (3, 'P003', 'ARÁNDANO', 'ARÁNDANO FRESCO DE EXPORTACIÓN', 1),
  (4, 'P004', 'ESPÁRRAGO', 'ESPÁRRAGO FRESCO DE EXPORTACIÓN', 1),
  (5, 'P005', 'MANGO', 'MANGO FRESCO DE EXPORTACIÓN', 0);

INSERT IGNORE INTO variedad
  (id, producto_id, nombre, activo)
VALUES
  (1, 2, 'HASS', 1),
  (2, 2, 'FUERTE', 1),
  (3, 1, 'RED GLOBE', 1),
  (4, 1, 'SWEET GLOBE', 1),
  (5, 1, 'AUTUMN CRISP', 0),
  (6, 3, 'BILOXI', 1),
  (7, 3, 'VENTURA', 1),
  (8, 4, 'UC 157 F1', 1);

INSERT IGNORE INTO via (id, descripcion, activo)
VALUES
  (1, 'MARÍTIMA', 1),
  (2, 'AÉREA', 1),
  (3, 'TERRESTRE', 1),
  (4, 'FERROVIARIA', 0),
  (5, 'FLUVIAL', 1);

INSERT IGNORE INTO situacion (id, descripcion, activo)
VALUES
  (1, 'PROGRAMADO', 1),
  (2, 'EN PREPARACIÓN', 1),
  (3, 'DESPACHADO', 1),
  (4, 'EN TRÁNSITO', 1),
  (5, 'ENTREGADO', 1),
  (6, 'CANCELADO', 1),
  (7, 'OBSERVADO', 0);

-- ============================================================
-- 6. DATOS INICIALES: DESPACHOS
-- ============================================================

INSERT IGNORE INTO despacho
  (
    id,
    codigo,
    fecha_despacho,
    fecha_estimada_llegada,
    cliente_id,
    naviera_id,
    destino_id,
    operador_logistico_id,
    puerto_llegada_id,
    producto_id,
    variedad_id,
    via_id,
    situacion_id,
    cantidad,
    unidad_medida,
    numero_contenedor,
    observaciones,
    activo
  )
VALUES
  (
    1,
    CONCAT('DES-', YEAR(CURDATE()), '-0001'),
    DATE_ADD(CURDATE(), INTERVAL 2 DAY),
    DATE_ADD(CURDATE(), INTERVAL 20 DAY),
    1, 1, 4, 1, 2, 2, 1, 1, 1,
    1200.00,
    'CAJAS',
    'MSKU1234567',
    'DESPACHO DE PALTA HASS A VALPARAÍSO',
    1
  ),
  (
    2,
    CONCAT('DES-', YEAR(CURDATE()), '-0002'),
    DATE_SUB(CURDATE(), INTERVAL 5 DAY),
    DATE_ADD(CURDATE(), INTERVAL 12 DAY),
    2, 2, 3, 2, 3, 1, 3, 1, 3,
    950.00,
    'CAJAS',
    'MSCU7654321',
    'DESPACHO DE UVA RED GLOBE A BUENAVENTURA',
    1
  ),
  (
    3,
    CONCAT('DES-', YEAR(CURDATE()), '-0003'),
    DATE_SUB(CURDATE(), INTERVAL 12 DAY),
    DATE_ADD(CURDATE(), INTERVAL 5 DAY),
    1, 3, 6, 1, 5, 3, 6, 1, 4,
    720.00,
    'CAJAS',
    'HLCU2468101',
    'DESPACHO DE ARÁNDANO BILOXI A MANZANILLO',
    1
  );

-- ============================================================
-- 7. VISTA PARA EL REPORTE DE DESPACHOS
-- No se crea una tabla de reporte porque los datos provienen
-- de despacho y de sus catálogos relacionados.
-- ============================================================

CREATE OR REPLACE VIEW vw_reporte_despacho AS
SELECT
  d.id,
  d.codigo,
  d.fecha_despacho,
  d.fecha_estimada_llegada,
  d.cliente_id,
  c.razon_social AS cliente,
  d.naviera_id,
  n.nombre AS naviera,
  d.destino_id,
  CONCAT(de.ciudad, ', ', de.pais) AS destino,
  d.operador_logistico_id,
  ol.razon_social AS operador_logistico,
  d.puerto_llegada_id,
  CONCAT(pl.puerto, ', ', pl.pais) AS puerto_llegada,
  d.producto_id,
  p.nombre AS producto,
  d.variedad_id,
  va.nombre AS variedad,
  d.via_id,
  vi.descripcion AS via,
  d.situacion_id,
  si.descripcion AS situacion,
  d.cantidad,
  d.unidad_medida,
  d.numero_contenedor,
  d.observaciones,
  d.activo,
  d.fecha_creacion,
  d.fecha_actualizacion
FROM despacho d
INNER JOIN cliente c
  ON c.id = d.cliente_id
INNER JOIN naviera n
  ON n.id = d.naviera_id
INNER JOIN destino de
  ON de.id = d.destino_id
INNER JOIN operador_logistico ol
  ON ol.id = d.operador_logistico_id
INNER JOIN puerto_llegada pl
  ON pl.id = d.puerto_llegada_id
INNER JOIN producto p
  ON p.id = d.producto_id
INNER JOIN variedad va
  ON va.id = d.variedad_id
  AND va.producto_id = d.producto_id
INNER JOIN via vi
  ON vi.id = d.via_id
INNER JOIN situacion si
  ON si.id = d.situacion_id;

-- ============================================================
-- CONSULTAS DE COMPROBACIÓN
-- ============================================================

SELECT 'Base de datos AGRIHUSA creada correctamente' AS resultado;
SELECT COUNT(*) AS total_roles FROM rol;
SELECT COUNT(*) AS total_permisos FROM permiso;
SELECT COUNT(*) AS total_usuarios FROM usuario;
SELECT COUNT(*) AS total_despachos FROM despacho;

