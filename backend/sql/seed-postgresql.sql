-- Datos de demostración para ARS Futuro.
-- Ejecutar después de init-postgresql.sql, conectado a la base ars_futuro.
BEGIN;

INSERT INTO usuarios (id, usuario, nombre, password_hash, rol) VALUES
  ('00000000-0000-4000-8000-000000000001', 'admin', 'Administrador', '$2a$12$.XAyLBDDVf5BD022zalNmOKcNthjP2ih/GfhwxMyR14DfkWQkbBmm', 'ADMINISTRADOR'),
  ('00000000-0000-4000-8000-000000000002', 'agente', 'Agente ARS', '$2a$12$prtpR3YzTde/tArkInKHMOry3.HjfZmhMRyr4g7qa3bHnxznlEmgC', 'AGENTE'),
  ('00000000-0000-4000-8000-000000000003', 'supervisor', 'Supervisor', '$2a$12$uDMMAdXvTkHCgTdriWH1feiD4nN5Jsii5LUxeapsVl2R3uORYV0XG', 'SUPERVISOR');

INSERT INTO planes (id, nombre, copago_consulta, cobertura) VALUES
  ('BASICO', 'Plan Básico de Salud', 200.00, '{"consultas":true,"laboratorio":true,"emergencias":true,"hospitalizacion":true,"odontologia":false,"saludMental":false}'::jsonb),
  ('PLUS', 'Plan Complementario', 100.00, '{"consultas":true,"laboratorio":true,"emergencias":true,"hospitalizacion":true,"odontologia":true,"saludMental":false}'::jsonb),
  ('PREMIUM', 'Plan Premium', 50.00, '{"consultas":true,"laboratorio":true,"emergencias":true,"hospitalizacion":true,"odontologia":true,"saludMental":true}'::jsonb);

INSERT INTO proveedores (id, nombre, tipo, ciudad, telefono) VALUES
  ('10000000-0000-4000-8000-000000000001', 'Hospital General Plaza de la Salud', 'Hospital', 'Santo Domingo', '+1 809 555 0001'),
  ('10000000-0000-4000-8000-000000000002', 'CEDIMAT', 'Imagenología', 'Santo Domingo', '+1 809 555 0002'),
  ('10000000-0000-4000-8000-000000000003', 'Laboratorio Referencia', 'Laboratorio', 'Santo Domingo', '+1 809 555 0003'),
  ('10000000-0000-4000-8000-000000000004', 'HOMS', 'Hospital', 'Santiago', '+1 809 555 0004');

INSERT INTO polizas (id, empresa, plan_id, desde, hasta, prima_mensual, asegurados, estado) VALUES
  ('P-001', 'COSEVI, S.R.L.', 'PREMIUM', '2022-11-01', '2026-10-31', 185000.00, 52, 'VIGENTE'),
  ('P-002', 'DINAFA, S.A.', 'PLUS', '2023-01-01', '2026-12-31', 99000.00, 31, 'VIGENTE'),
  ('P-003', 'COMINTER, S.R.L.', 'BASICO', '2024-02-01', '2025-12-31', 48000.00, 14, 'SUSPENDIDA');

INSERT INTO afiliados (id, nombre, cedula, plan_id, poliza_id, estado, desde, nacimiento, telefono, correo, dependientes) VALUES
  ('20000000-0000-4000-8000-000000000001', 'María Gonzalo Padilla', '001-1234567-8', 'PLUS', 'P-002', 'ACTIVO', '2023-05-10', '1991-09-14', '+1 809 555 1111', 'maria.padilla@demo.do', 1),
  ('20000000-0000-4000-8000-000000000002', 'Ricardo Balbuena', '001-9876543-2', 'PREMIUM', 'P-001', 'ACTIVO', '2022-11-01', '1990-03-22', '+1 829 647 1044', 'ricardo@cosevi.do', 2),
  ('20000000-0000-4000-8000-000000000003', 'Juan Patiño Cáceres', '001-2345678-9', 'BASICO', 'P-003', 'ACTIVO', '2024-01-15', '1988-07-05', '+1 809 555 2222', 'juan.pc@demo.do', 0),
  ('20000000-0000-4000-8000-000000000004', 'Gia Fernández', '001-7654321-0', 'PLUS', 'P-002', 'SUSPENDIDO', '2023-02-01', '1995-04-10', '+1 809 555 3333', 'gia@demo.do', 3);

INSERT INTO autorizaciones (id, afiliado_id, proveedor_id, procedimiento, copago, estado, fecha) VALUES
  ('30000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'Consulta general', 100.00, 'APROBADA', CURRENT_DATE),
  ('30000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', 'Rayos X de tórax', 50.00, 'PENDIENTE', CURRENT_DATE),
  ('30000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000003', 'Laboratorio completo', 200.00, 'RECHAZADA', CURRENT_DATE - 2);

INSERT INTO reclamos (id, afiliado_id, proveedor_id, monto, estado, fecha) VALUES
  ('40000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 1500.00, 'EN_REVISION', CURRENT_DATE),
  ('40000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000004', 2800.00, 'APROBADA', CURRENT_DATE - 5),
  ('40000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000002', 950.00, 'RECHAZADA', CURRENT_DATE - 10);

INSERT INTO servicios_medicos (id, afiliado_id, proveedor_id, autorizacion_id, descripcion, costo, copago, fecha, estado) VALUES
  ('50000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', 'Consulta general', 1200.00, 100.00, CURRENT_DATE, 'PENDIENTE_PAGO'),
  ('50000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000003', NULL, 'Laboratorio completo', 950.00, 200.00, CURRENT_DATE - 7, 'PAGADO');

INSERT INTO pagos_proveedores (id, proveedor_id, servicio_id, referencia_banco, monto, metodo, fecha, estado) VALUES
  ('60000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000003', '50000000-0000-4000-8000-000000000002', 'ORD-2026-0001', 750.00, 'Transferencia', CURRENT_DATE - 6, 'PROCESADO');

INSERT INTO facturas (id, poliza_id, periodo, emision, vencimiento, monto, estado, fecha_pago, referencia, recordatorio_enviado) VALUES
  ('70000000-0000-4000-8000-000000000001', 'P-001', '2026-08', '2026-08-01', '2026-08-10', 185000.00, 'PAGADA', '2026-08-08', 'PR-2026-0808-0001', FALSE),
  ('70000000-0000-4000-8000-000000000002', 'P-002', '2026-09', '2026-09-01', '2026-09-10', 99000.00, 'PENDIENTE', NULL, NULL, FALSE),
  ('70000000-0000-4000-8000-000000000003', 'P-003', '2026-09', '2026-09-01', '2026-09-10', 48000.00, 'ATRASADA', NULL, NULL, TRUE);

INSERT INTO notificaciones (id, usuario_id, tipo, titulo, mensaje, leida) VALUES
  ('80000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'success', 'Base de datos lista', 'Los datos de demostración fueron cargados correctamente.', FALSE),
  ('80000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000003', 'info', 'Reclamo pendiente', 'Hay un reclamo pendiente de revisión.', FALSE);

COMMIT;
