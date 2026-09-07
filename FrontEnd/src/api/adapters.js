const roleNames = {
  ADMINISTRADOR: "Administrador",
  AGENTE: "Agente",
  SUPERVISOR: "Supervisor",
};

const statusNames = {
  ACTIVO: "Activo",
  SUSPENDIDO: "Suspendido",
  INACTIVO: "Inactivo",
  APROBADA: "Aprobada",
  RECHAZADA: "Rechazada",
  PENDIENTE: "Pendiente",
  VIGENTE: "Vigente",
  EN_GRACIA: "En periodo de gracia",
  SUSPENDIDA: "Suspendida",
  PAGADA: "Pagada",
  ATRASADA: "Atrasada",
};

const displayStatus = (value) => statusNames[value] || value;
const id = (value) => value ?? "";

export const adaptUser = (user) => ({ ...user, rol: roleNames[user.rol] || user.rol });

export const adaptPlan = (plan) => ({ ...plan, id: String(plan.id) });

export const adaptAfiliado = (item) => ({
  ...item,
  id: id(item.id),
  plan: item.plan?.id || item.planId,
  estado: displayStatus(item.estado),
  desde: item.desde,
  nacimiento: item.nacimiento || "",
});

export const adaptProveedor = (item) => ({ ...item, id: id(item.id) });

export const adaptAutorizacion = (item) => ({
  ...item,
  id: id(item.id),
  afiliadoId: item.afiliadoId || item.afiliado?.id,
  proveedorId: item.proveedorId || item.proveedor?.id,
  estado: displayStatus(item.estado),
});

export const adaptReclamo = (item) => ({
  ...item,
  id: id(item.id),
  afiliadoId: item.afiliadoId || item.afiliado?.id,
  proveedorId: item.proveedorId || item.proveedor?.id,
  estado: displayStatus(item.estado),
});

export const adaptPoliza = (item) => ({ ...item, plan: item.plan?.id || item.planId, estado: displayStatus(item.estado) });
export const adaptServicio = (item) => ({ ...item, id: id(item.id), estado: displayStatus(item.estado) });
export const adaptPago = (item) => ({ ...item, id: id(item.id), estado: displayStatus(item.estado) });
export const adaptFactura = (item) => ({ ...item, id: id(item.id), estado: displayStatus(item.estado) });

export const adaptCollection = (items, adapter) => (Array.isArray(items) ? items.map(adapter) : []);
