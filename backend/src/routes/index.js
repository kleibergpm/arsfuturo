import { Router } from 'express';
import { z } from 'zod';
import { authenticate, allow } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../middleware/errors.js';
import { login, me } from '../controllers/auth.controller.js';
import { crud } from '../controllers/crud.controller.js';
import * as business from '../controllers/business.controller.js';
const r = Router(); const id = z.string().uuid(); const uuid = z.object({ id }); const roles = { admin: ['ADMINISTRADOR'], staff: ['ADMINISTRADOR', 'AGENTE'], review: ['ADMINISTRADOR', 'SUPERVISOR'] };
const authBody = z.object({ usuario: z.string().min(3), password: z.string().min(6) });
const schemas = {
  afiliado: z.object({ nombre: z.string().min(2), cedula: z.string().min(8), planId: z.string(), polizaId: z.string().optional().nullable(), estado: z.enum(['ACTIVO','SUSPENDIDO','INACTIVO']).optional(), desde: z.coerce.date(), nacimiento: z.coerce.date().optional().nullable(), telefono: z.string().optional().nullable(), correo: z.string().email().optional().nullable(), dependientes: z.coerce.number().int().min(0).optional() }),
  proveedor: z.object({ nombre: z.string().min(2), tipo: z.string().min(2), ciudad: z.string().min(2), telefono: z.string().min(7) }),
  plan: z.object({ id: z.string().min(2), nombre: z.string(), copagoConsulta: z.coerce.number().min(0), cobertura: z.record(z.boolean()) }),
  poliza: z.object({ id: z.string().min(2), empresa: z.string(), planId: z.string(), desde: z.coerce.date(), hasta: z.coerce.date(), primaMensual: z.coerce.number().positive(), asegurados: z.coerce.number().int().min(0).optional(), estado: z.enum(['VIGENTE','EN_GRACIA','SUSPENDIDA','VENCIDA']).optional() }),
  reclamo: z.object({ afiliadoId: z.string().uuid(), proveedorId: z.string().uuid(), monto: z.coerce.number().positive(), fecha: z.coerce.date().optional() }),
  autorizacion: z.object({ afiliadoId: z.string().uuid(), proveedorId: z.string().uuid(), procedimiento: z.string().min(3) }),
  servicio: z.object({ afiliadoId: z.string().uuid(), proveedorId: z.string().uuid(), autorizacionId: z.string().uuid().optional().nullable(), descripcion: z.string().min(3), costo: z.coerce.number().positive() }),
  pago: z.object({ servicioId: z.string().uuid(), monto: z.coerce.number().positive(), referenciaBanco: z.string().min(3), metodo: z.string().min(3) }),
};
r.post('/auth/login', validate(authBody), asyncHandler(login)); r.get('/auth/me', authenticate, asyncHandler(me));
const resource = (path, model, schema, include, access = roles.admin) => { const c = crud(model, include); r.get(path, authenticate, allow(...access), asyncHandler(c.list)); r.get(`${path}/:id`, authenticate, allow(...access), asyncHandler(c.get)); r.post(path, authenticate, allow(...access), validate(schema), asyncHandler(c.create)); r.patch(`${path}/:id`, authenticate, allow(...access), validate(schema.partial()), asyncHandler(c.update)); r.delete(`${path}/:id`, authenticate, allow(...access), asyncHandler(c.remove)); };
resource('/planes', 'plan', schemas.plan, undefined); resource('/proveedores', 'proveedor', schemas.proveedor, undefined, roles.staff); resource('/polizas', 'poliza', schemas.poliza, { plan: true }, roles.admin); resource('/afiliados', 'afiliado', schemas.afiliado, { plan: true, poliza: true }, roles.staff); resource('/reclamos', 'reclamo', schemas.reclamo, { afiliado: true, proveedor: true }, roles.staff);
resource('/notificaciones', 'notificacion', z.object({ usuarioId: z.string().uuid().optional().nullable(), tipo: z.string(), titulo: z.string().optional().nullable(), mensaje: z.string(), leida: z.boolean().optional() }), undefined, ['ADMINISTRADOR','AGENTE','SUPERVISOR']);
r.get('/autorizaciones', authenticate, allow(...roles.staff), asyncHandler(crud('autorizacion', { afiliado: true, proveedor: true }).list)); r.get('/autorizaciones/:id', authenticate, allow(...roles.staff), asyncHandler(crud('autorizacion', { afiliado: true, proveedor: true }).get)); r.post('/autorizaciones', authenticate, allow(...roles.staff), validate(schemas.autorizacion), asyncHandler(business.createAuthorization)); r.patch('/autorizaciones/:id/aprobar', authenticate, allow(...roles.review), asyncHandler(business.decideAuthorization('APROBADA'))); r.patch('/autorizaciones/:id/rechazar', authenticate, allow(...roles.review), asyncHandler(business.decideAuthorization('RECHAZADA')));
r.get('/servicios', authenticate, allow(...roles.staff), asyncHandler(crud('servicioMedico', { afiliado: true, proveedor: true, autorizacion: true }).list)); r.post('/servicios', authenticate, allow(...roles.staff), validate(schemas.servicio), asyncHandler(business.createService));
r.get('/pagos', authenticate, allow(...roles.admin), asyncHandler(crud('pagoProveedor', { servicio: true, proveedor: true }).list)); r.post('/pagos', authenticate, allow(...roles.admin), validate(schemas.pago), asyncHandler(business.issuePayment));
r.get('/facturas', authenticate, allow(...roles.admin), asyncHandler(crud('factura', { poliza: true }).list)); r.post('/facturas/generar', authenticate, allow(...roles.admin), validate(z.object({ periodo: z.string().regex(/^\d{4}-\d{2}$/).optional() })), asyncHandler(business.generateInvoices)); r.patch('/facturas/:id/pagar', authenticate, allow(...roles.admin), validate(z.object({ referencia: z.string().min(3) })), asyncHandler(business.payInvoice)); r.patch('/facturas/:id/recordatorio', authenticate, allow(...roles.admin), asyncHandler(business.remindInvoice)); r.patch('/facturas/:id/gracia', authenticate, allow(...roles.admin), asyncHandler(business.graceInvoice)); r.patch('/facturas/:id/suspender', authenticate, allow(...roles.admin), asyncHandler(business.suspendInvoice));
r.get('/dashboard/resumen', authenticate, asyncHandler(business.dashboard));
export default r;
