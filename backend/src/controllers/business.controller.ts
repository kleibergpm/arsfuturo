import { prisma } from '../config/prisma.js';
import { NotificationService, notificationService } from '../services/notifications.service.js';

export class BusinessController {
  constructor(private readonly database = prisma, private readonly notifications: NotificationService = notificationService) {}

  private coverageFor(coverage, procedure) {
    const normalizedProcedure = procedure.toLowerCase();
    if (normalizedProcedure.includes('consulta')) return coverage.consultas;
    if (normalizedProcedure.includes('laborat')) return coverage.laboratorio;
    if (normalizedProcedure.includes('odont')) return coverage.odontologia;
    if (normalizedProcedure.includes('psico') || normalizedProcedure.includes('mental')) return coverage.saludMental;
    if (normalizedProcedure.includes('rayos') || normalizedProcedure.includes('imagen')) return coverage.emergencias || coverage.hospitalizacion;
    return true;
  }

  private today() {
    return new Date();
  }

  createAuthorization = async (req, res) => {
    const { afiliadoId, proveedorId, procedimiento } = req.body;
    const [afiliado, proveedor] = await Promise.all([
      this.database.afiliado.findUnique({ where: { id: afiliadoId }, include: { plan: true } }),
      this.database.proveedor.findUnique({ where: { id: proveedorId } }),
    ]);

    if (!afiliado || !proveedor) return res.status(422).json({ error: 'VALIDATION_ERROR', message: 'Afiliado o proveedor inexistente' });

    const eligible = afiliado.estado === 'ACTIVO' && this.coverageFor(afiliado.plan.cobertura, procedimiento);
    const row = await this.database.autorizacion.create({
      data: { afiliadoId, proveedorId, procedimiento, copago: eligible ? afiliado.plan.copagoConsulta : 0, estado: eligible ? 'APROBADA' : 'PENDIENTE' },
      include: { afiliado: true, proveedor: true },
    });
    await this.notifications.create({ tipo: 'info', titulo: 'Autorización creada', mensaje: `La autorización ${row.id} está ${row.estado}.` });
    res.status(201).json(row);
  };

  decideAuthorization = (estado) => async (req, res) => {
    const row = await this.database.autorizacion.update({ where: { id: req.params.id }, data: { estado } });
    await this.notifications.create({ tipo: estado === 'APROBADA' ? 'success' : 'error', titulo: 'Autorización procesada', mensaje: `Autorización ${row.id}: ${estado}.` });
    res.json(row);
  };

  decideClaim = (estado) => async (req, res) => {
    const row = await this.database.reclamo.update({ where: { id: req.params.id }, data: { estado } });
    await this.notifications.create({ tipo: estado === 'APROBADA' ? 'success' : 'error', titulo: 'Reclamo procesado', mensaje: `Reclamo ${row.id}: ${estado}.` });
    res.json(row);
  };

  createService = async (req, res) => {
    const { afiliadoId, proveedorId, autorizacionId } = req.body;
    const [afiliado, proveedor, authorization] = await Promise.all([
      this.database.afiliado.findUnique({ where: { id: afiliadoId }, include: { plan: true } }),
      this.database.proveedor.findUnique({ where: { id: proveedorId } }),
      autorizacionId ? this.database.autorizacion.findUnique({ where: { id: autorizacionId } }) : null,
    ]);
    if (!afiliado || !proveedor || afiliado.estado !== 'ACTIVO' || (autorizacionId && (!authorization || authorization.estado !== 'APROBADA'))) {
      return res.status(422).json({ error: 'VALIDATION_ERROR', message: 'Servicio no elegible o autorización no aprobada' });
    }
    res.status(201).json(await this.database.servicioMedico.create({ data: { ...req.body, copago: afiliado.plan.copagoConsulta } }));
  };

  issuePayment = async (req, res) => {
    const { servicioId, monto, referenciaBanco, metodo } = req.body;
    const result = await this.database.$transaction(async (transaction) => {
      const service = await transaction.servicioMedico.findUnique({ where: { id: servicioId } });
      if (!service || service.estado === 'PAGADO') {
        const error = Object.assign(new Error('Servicio inexistente o ya pagado'), { status: 422 });
        throw error;
      }
      const payment = await transaction.pagoProveedor.create({ data: { servicioId, proveedorId: service.proveedorId, monto, referenciaBanco, metodo } });
      await transaction.servicioMedico.update({ where: { id: servicioId }, data: { estado: 'PAGADO' } });
      return payment;
    });
    await this.notifications.create({ tipo: 'success', titulo: 'Pago procesado', mensaje: `Pago ${result.id} registrado.` });
    res.status(201).json(result);
  };

  generateInvoices = async (req, res) => {
    const periodo = req.body.periodo || this.today().toISOString().slice(0, 7);
    const existing = await this.database.factura.count({ where: { periodo } });
    if (existing) return res.status(409).json({ error: 'CONFLICT', message: `Ya hay facturas para ${periodo}` });
    const policies = await this.database.poliza.findMany({ where: { estado: { in: ['VIGENTE', 'EN_GRACIA'] } } });
    const emision = this.today();
    const vencimiento = new Date(emision.getFullYear(), emision.getMonth(), 10);
    const rows = await this.database.$transaction(policies.map((policy) => this.database.factura.create({ data: { polizaId: policy.id, periodo, emision, vencimiento, monto: policy.primaMensual } })));
    res.status(201).json(rows);
  };

  payInvoice = async (req, res) => {
    const invoice = await this.database.$transaction(async (transaction) => {
      const invoiceRow = await transaction.factura.update({ where: { id: req.params.id }, data: { estado: 'PAGADA', fechaPago: this.today(), referencia: req.body.referencia } });
      await transaction.poliza.update({ where: { id: invoiceRow.polizaId }, data: { estado: 'VIGENTE' } });
      return invoiceRow;
    });
    res.json(invoice);
  };

  remindInvoice = async (req, res) => res.json(await this.database.factura.update({ where: { id: req.params.id }, data: { recordatorioEnviado: true, estado: 'ATRASADA' } }));

  graceInvoice = async (req, res) => {
    const invoice = await this.database.factura.update({ where: { id: req.params.id }, data: { estado: 'EN_GRACIA' } });
    await this.database.poliza.update({ where: { id: invoice.polizaId }, data: { estado: 'EN_GRACIA' } });
    res.json(invoice);
  };

  suspendInvoice = async (req, res) => {
    const invoice = await this.database.factura.findUnique({ where: { id: req.params.id } });
    if (!invoice) return res.status(404).json({ error: 'NOT_FOUND', message: 'Factura no encontrada' });
    await this.database.poliza.update({ where: { id: invoice.polizaId }, data: { estado: 'SUSPENDIDA' } });
    res.status(204).end();
  };

  dashboard = async (req, res) => {
    const [activos, reclamosPendientes, autorizacionesHoy, montoReclamos] = await Promise.all([
      this.database.afiliado.count({ where: { estado: 'ACTIVO' } }),
      this.database.reclamo.count({ where: { estado: 'EN_REVISION' } }),
      this.database.autorizacion.count({ where: { fecha: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
      this.database.reclamo.aggregate({ _sum: { monto: true } }),
    ]);
    res.json({ activos, reclamosPendientes, autorizacionesHoy, montoReclamos: montoReclamos._sum.monto || 0 });
  };
}

export const businessController = new BusinessController();
