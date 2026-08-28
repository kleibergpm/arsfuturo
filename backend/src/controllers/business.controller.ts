import { prisma } from '../config/prisma.js';
import { notify } from '../services/notifications.service.js';
const date = () => new Date();
const coverageFor = (coverage, procedure) => {
  const p = procedure.toLowerCase();
  if (p.includes('consulta')) return coverage.consultas;
  if (p.includes('laborat')) return coverage.laboratorio;
  if (p.includes('odont')) return coverage.odontologia;
  if (p.includes('psico') || p.includes('mental')) return coverage.saludMental;
  if (p.includes('rayos') || p.includes('imagen')) return coverage.emergencias || coverage.hospitalizacion;
  return true;
};
export async function createAuthorization(req, res) {
  const { afiliadoId, proveedorId, procedimiento } = req.body;
  const [afiliado, proveedor] = await Promise.all([prisma.afiliado.findUnique({ where: { id: afiliadoId }, include: { plan: true } }), prisma.proveedor.findUnique({ where: { id: proveedorId } })]);
  
  if (!afiliado || !proveedor) return res.status(422).json({ error: 'VALIDATION_ERROR', message: 'Afiliado o proveedor inexistente' });
  
  const eligible = afiliado.estado === 'ACTIVO' && coverageFor(afiliado.plan.cobertura, procedimiento);
  const row = await prisma.autorizacion.create({ data: { afiliadoId, proveedorId, procedimiento, copago: eligible ? afiliado.plan.copagoConsulta : 0, estado: eligible ? 'APROBADA' : 'PENDIENTE' }, include: { afiliado: true, proveedor: true } });
  await notify({ tipo: 'info', titulo: 'Autorización creada', mensaje: `La autorización ${row.id} está ${row.estado}.` });
  res.status(201).json(row);
}
export const decideAuthorization = (estado) => async (req, res) => { const row = await prisma.autorizacion.update({ where: { id: req.params.id }, data: { estado } }); await notify({ tipo: estado === 'APROBADA' ? 'success' : 'error', titulo: 'Autorización procesada', mensaje: `Autorización ${row.id}: ${estado}.` }); res.json(row); };
export const decideClaim = (estado) => async (req, res) => { const row = await prisma.reclamo.update({ where: { id: req.params.id }, data: { estado } }); await notify({ tipo: estado === 'APROBADA' ? 'success' : 'error', titulo: 'Reclamo procesado', mensaje: `Reclamo ${row.id}: ${estado}.` }); res.json(row); };
export async function createService(req, res) {
  const { afiliadoId, proveedorId, autorizacionId } = req.body;
  const [afiliado, proveedor, authorization] = await Promise.all([prisma.afiliado.findUnique({ where: { id: afiliadoId }, include: { plan: true } }), prisma.proveedor.findUnique({ where: { id: proveedorId } }), autorizacionId ? prisma.autorizacion.findUnique({ where: { id: autorizacionId } }) : null]);
  if (!afiliado || !proveedor || afiliado.estado !== 'ACTIVO' || (autorizacionId && (!authorization || authorization.estado !== 'APROBADA'))) return res.status(422).json({ error: 'VALIDATION_ERROR', message: 'Servicio no elegible o autorización no aprobada' });
  res.status(201).json(await prisma.servicioMedico.create({ data: { ...req.body, copago: afiliado.plan.copagoConsulta } }));
}
export async function issuePayment(req, res) {
  const { servicioId, monto, referenciaBanco, metodo } = req.body;
  const result = await prisma.$transaction(async (tx) => { const service = await tx.servicioMedico.findUnique({ where: { id: servicioId } }); if (!service || service.estado === 'PAGADO') { const e = new Error('Servicio inexistente o ya pagado'); e.status = 422; throw e; } const payment = await tx.pagoProveedor.create({ data: { servicioId, proveedorId: service.proveedorId, monto, referenciaBanco, metodo } }); await tx.servicioMedico.update({ where: { id: servicioId }, data: { estado: 'PAGADO' } }); return payment; });
  await notify({ tipo: 'success', titulo: 'Pago procesado', mensaje: `Pago ${result.id} registrado.` }); res.status(201).json(result);
}
export async function generateInvoices(req, res) {
  const periodo = req.body.periodo || date().toISOString().slice(0, 7); const existing = await prisma.factura.count({ where: { periodo } }); if (existing) return res.status(409).json({ error: 'CONFLICT', message: `Ya hay facturas para ${periodo}` });
  const policies = await prisma.poliza.findMany({ where: { estado: { in: ['VIGENTE', 'EN_GRACIA'] } } }); const emision = date(); const vencimiento = new Date(emision.getFullYear(), emision.getMonth(), 10);
  const rows = await prisma.$transaction(policies.map((p) => prisma.factura.create({ data: { polizaId: p.id, periodo, emision, vencimiento, monto: p.primaMensual } }))); res.status(201).json(rows);
}
export async function payInvoice(req, res) { const invoice = await prisma.$transaction(async (tx) => { const f = await tx.factura.update({ where: { id: req.params.id }, data: { estado: 'PAGADA', fechaPago: date(), referencia: req.body.referencia } }); await tx.poliza.update({ where: { id: f.polizaId }, data: { estado: 'VIGENTE' } }); return f; }); res.json(invoice); }
export const remindInvoice = async (req, res) => res.json(await prisma.factura.update({ where: { id: req.params.id }, data: { recordatorioEnviado: true, estado: 'ATRASADA' } }));
export const graceInvoice = async (req, res) => { const f = await prisma.factura.update({ where: { id: req.params.id }, data: { estado: 'EN_GRACIA' } }); await prisma.poliza.update({ where: { id: f.polizaId }, data: { estado: 'EN_GRACIA' } }); res.json(f); };
export const suspendInvoice = async (req, res) => { const f = await prisma.factura.findUnique({ where: { id: req.params.id } }); if (!f) return res.status(404).json({ error: 'NOT_FOUND', message: 'Factura no encontrada' }); await prisma.poliza.update({ where: { id: f.polizaId }, data: { estado: 'SUSPENDIDA' } }); res.status(204).end(); };
export async function dashboard(req, res) { const [activos, reclamosPendientes, autorizacionesHoy, montoReclamos] = await Promise.all([prisma.afiliado.count({ where: { estado: 'ACTIVO' } }), prisma.reclamo.count({ where: { estado: 'EN_REVISION' } }), prisma.autorizacion.count({ where: { fecha: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }), prisma.reclamo.aggregate({ _sum: { monto: true } })]); res.json({ activos, reclamosPendientes, autorizacionesHoy, montoReclamos: montoReclamos._sum.monto || 0 }); }
