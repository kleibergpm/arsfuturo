import type { ApiRecord, ApiUser } from "./client";

export type Plan = { id: string; nombre: string; copagoConsulta?: number; cobertura: Record<string, boolean> };
export type AdaptedRecord = ApiRecord & { id: string; estado?: string };

const roleNames: Record<string, string> = {
  ADMINISTRADOR: "Administrador",
  AGENTE: "Agente",
  SUPERVISOR: "Supervisor",
};

const statusNames: Record<string, string> = {
  ACTIVO: "Activo", SUSPENDIDO: "Suspendido", INACTIVO: "Inactivo", APROBADA: "Aprobada",
  RECHAZADA: "Rechazada", PENDIENTE: "Pendiente", VIGENTE: "Vigente", EN_GRACIA: "En periodo de gracia",
  SUSPENDIDA: "Suspendida", PAGADA: "Pagada", ATRASADA: "Atrasada", PENDIENTE_PAGO: "Pendiente de Pago", PAGADO: "Pagado", PROCESADO: "Procesado",
};

const displayStatus = (value: unknown): string | undefined => typeof value === "string" ? statusNames[value] || value : undefined;
const id = (value: unknown) => String(value ?? "");

export const adaptUser = (user: ApiUser) => ({ ...user, rol: roleNames[user.rol] || user.rol });
export const adaptPlan = (plan: ApiRecord): Plan => ({ ...plan, id: id(plan.id), nombre: String(plan.nombre || ""), cobertura: (plan.cobertura || {}) as Record<string, boolean> }) as Plan;
export const adaptAfiliado = (item: ApiRecord): AdaptedRecord => ({ ...item, id: id(item.id), plan: (item.plan as ApiRecord | undefined)?.id || item.planId, estado: displayStatus(item.estado), desde: item.desde, nacimiento: item.nacimiento || "" });
export const adaptProveedor = (item: ApiRecord): AdaptedRecord => ({ ...item, id: id(item.id) });
export const adaptAutorizacion = (item: ApiRecord): AdaptedRecord => ({ ...item, id: id(item.id), afiliadoId: item.afiliadoId || (item.afiliado as ApiRecord | undefined)?.id, proveedorId: item.proveedorId || (item.proveedor as ApiRecord | undefined)?.id, estado: displayStatus(item.estado) });
export const adaptReclamo = (item: ApiRecord): AdaptedRecord => ({ ...item, id: id(item.id), afiliadoId: item.afiliadoId || (item.afiliado as ApiRecord | undefined)?.id, proveedorId: item.proveedorId || (item.proveedor as ApiRecord | undefined)?.id, estado: displayStatus(item.estado) });
export const adaptPoliza = (item: ApiRecord): AdaptedRecord => ({ ...item, id: id(item.id), plan: (item.plan as ApiRecord | undefined)?.id || item.planId, estado: displayStatus(item.estado) });
export const adaptServicio = (item: ApiRecord): AdaptedRecord => ({ ...item, id: id(item.id), estado: displayStatus(item.estado) });
export const adaptPago = (item: ApiRecord): AdaptedRecord => ({ ...item, id: id(item.id), estado: displayStatus(item.estado) });
export const adaptFactura = (item: ApiRecord): AdaptedRecord => ({ ...item, id: id(item.id), estado: displayStatus(item.estado) });
export const adaptCollection = <T>(items: ApiRecord[], adapter: (item: ApiRecord) => T): T[] => Array.isArray(items) ? items.map(adapter) : [];
