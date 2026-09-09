-- ARS Futuro: inicialización de PostgreSQL.
-- Ejecute las dos primeras instrucciones conectado a la base "postgres" como superusuario.
CREATE DATABASE ars_futuro;

-- En psql, cambie de conexión antes de ejecutar el resto del archivo:
-- \c ars_futuro

CREATE TYPE rol AS ENUM ('ADMINISTRADOR', 'AGENTE', 'SUPERVISOR');
CREATE TYPE estado_afiliado AS ENUM ('ACTIVO', 'SUSPENDIDO', 'INACTIVO');
CREATE TYPE estado_autorizacion AS ENUM ('PENDIENTE', 'APROBADA', 'RECHAZADA');
CREATE TYPE estado_reclamo AS ENUM ('EN_REVISION', 'APROBADA', 'RECHAZADA');
CREATE TYPE estado_poliza AS ENUM ('VIGENTE', 'EN_GRACIA', 'SUSPENDIDA', 'VENCIDA');
CREATE TYPE estado_factura AS ENUM ('PENDIENTE', 'PAGADA', 'ATRASADA', 'EN_GRACIA');
CREATE TYPE estado_servicio AS ENUM ('PENDIENTE_PAGO', 'PAGADO');
CREATE TYPE estado_pago AS ENUM ('PROCESADO', 'RECHAZADO');

CREATE TABLE usuarios (
  id VARCHAR(36) PRIMARY KEY,
  usuario VARCHAR(100) NOT NULL UNIQUE,
  nombre VARCHAR(160) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol rol NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE planes (
  id VARCHAR(30) PRIMARY KEY,
  nombre VARCHAR(160) NOT NULL,
  copago_consulta NUMERIC(12, 2) NOT NULL CHECK (copago_consulta >= 0),
  cobertura JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE proveedores (
  id VARCHAR(36) PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  tipo VARCHAR(80) NOT NULL,
  ciudad VARCHAR(100) NOT NULL,
  telefono VARCHAR(40) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE polizas (
  id VARCHAR(30) PRIMARY KEY,
  empresa VARCHAR(200) NOT NULL,
  plan_id VARCHAR(30) NOT NULL REFERENCES planes(id),
  desde DATE NOT NULL,
  hasta DATE NOT NULL,
  prima_mensual NUMERIC(14, 2) NOT NULL CHECK (prima_mensual > 0),
  asegurados INTEGER NOT NULL DEFAULT 0 CHECK (asegurados >= 0),
  estado estado_poliza NOT NULL DEFAULT 'VIGENTE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (hasta >= desde)
);

CREATE TABLE afiliados (
  id VARCHAR(36) PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  cedula VARCHAR(20) NOT NULL UNIQUE,
  plan_id VARCHAR(30) NOT NULL REFERENCES planes(id),
  poliza_id VARCHAR(30) REFERENCES polizas(id),
  estado estado_afiliado NOT NULL DEFAULT 'ACTIVO',
  desde DATE NOT NULL,
  nacimiento DATE,
  telefono VARCHAR(40),
  correo VARCHAR(255),
  dependientes INTEGER NOT NULL DEFAULT 0 CHECK (dependientes >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE autorizaciones (
  id VARCHAR(36) PRIMARY KEY,
  afiliado_id VARCHAR(36) NOT NULL REFERENCES afiliados(id),
  proveedor_id VARCHAR(36) NOT NULL REFERENCES proveedores(id),
  procedimiento VARCHAR(255) NOT NULL,
  copago NUMERIC(12, 2) NOT NULL CHECK (copago >= 0),
  estado estado_autorizacion NOT NULL DEFAULT 'PENDIENTE',
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reclamos (
  id VARCHAR(36) PRIMARY KEY,
  afiliado_id VARCHAR(36) NOT NULL REFERENCES afiliados(id),
  proveedor_id VARCHAR(36) NOT NULL REFERENCES proveedores(id),
  monto NUMERIC(14, 2) NOT NULL CHECK (monto > 0),
  estado estado_reclamo NOT NULL DEFAULT 'EN_REVISION',
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE servicios_medicos (
  id VARCHAR(36) PRIMARY KEY,
  afiliado_id VARCHAR(36) NOT NULL REFERENCES afiliados(id),
  proveedor_id VARCHAR(36) NOT NULL REFERENCES proveedores(id),
  autorizacion_id VARCHAR(36) REFERENCES autorizaciones(id),
  descripcion VARCHAR(255) NOT NULL,
  costo NUMERIC(14, 2) NOT NULL CHECK (costo > 0),
  copago NUMERIC(12, 2) NOT NULL CHECK (copago >= 0),
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  estado estado_servicio NOT NULL DEFAULT 'PENDIENTE_PAGO',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pagos_proveedores (
  id VARCHAR(36) PRIMARY KEY,
  proveedor_id VARCHAR(36) NOT NULL REFERENCES proveedores(id),
  servicio_id VARCHAR(36) NOT NULL UNIQUE REFERENCES servicios_medicos(id),
  referencia_banco VARCHAR(120) NOT NULL UNIQUE,
  monto NUMERIC(14, 2) NOT NULL CHECK (monto > 0),
  metodo VARCHAR(80) NOT NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  estado estado_pago NOT NULL DEFAULT 'PROCESADO',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE facturas (
  id VARCHAR(36) PRIMARY KEY,
  poliza_id VARCHAR(30) NOT NULL REFERENCES polizas(id),
  periodo CHAR(7) NOT NULL CHECK (periodo ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  emision DATE NOT NULL,
  vencimiento DATE NOT NULL,
  monto NUMERIC(14, 2) NOT NULL CHECK (monto > 0),
  estado estado_factura NOT NULL DEFAULT 'PENDIENTE',
  fecha_pago DATE,
  referencia VARCHAR(120) UNIQUE,
  recordatorio_enviado BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (poliza_id, periodo),
  CHECK (vencimiento >= emision)
);

CREATE TABLE notificaciones (
  id VARCHAR(36) PRIMARY KEY,
  usuario_id VARCHAR(36) REFERENCES usuarios(id),
  tipo VARCHAR(50) NOT NULL,
  titulo VARCHAR(160),
  mensaje TEXT NOT NULL,
  leida BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX proveedores_ciudad_tipo_idx ON proveedores (ciudad, tipo);
CREATE INDEX polizas_estado_idx ON polizas (estado);
CREATE INDEX afiliados_estado_idx ON afiliados (estado);
CREATE INDEX autorizaciones_estado_fecha_idx ON autorizaciones (estado, fecha);
CREATE INDEX reclamos_estado_fecha_idx ON reclamos (estado, fecha);
CREATE INDEX servicios_medicos_estado_fecha_idx ON servicios_medicos (estado, fecha);
CREATE INDEX facturas_estado_vencimiento_idx ON facturas (estado, vencimiento);
CREATE INDEX notificaciones_usuario_leida_idx ON notificaciones (usuario_id, leida);
