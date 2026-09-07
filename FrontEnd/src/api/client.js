import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("arsfuturo_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) localStorage.removeItem("arsfuturo_token");
    return Promise.reject(error);
  },
);

const unwrap = async (request) => (await request).data;

export const authApi = {
  login: (credentials) => unwrap(api.post("/auth/login", credentials)),
  me: () => unwrap(api.get("/auth/me")),
};

export const resourcesApi = {
  planes: () => unwrap(api.get("/planes")),
  afiliados: () => unwrap(api.get("/afiliados")),
  proveedores: () => unwrap(api.get("/proveedores")),
  autorizaciones: () => unwrap(api.get("/autorizaciones")),
  reclamos: () => unwrap(api.get("/reclamos")),
  polizas: () => unwrap(api.get("/polizas")),
  servicios: () => unwrap(api.get("/servicios")),
  pagos: () => unwrap(api.get("/pagos")),
  facturas: () => unwrap(api.get("/facturas")),
  dashboard: () => unwrap(api.get("/dashboard/resumen")),
};

export const mutationsApi = {
  afiliado: (payload) => unwrap(api.post("/afiliados", payload)),
  actualizarAfiliado: (id, payload) => unwrap(api.patch(`/afiliados/${id}`, payload)),
  autorizacion: (payload) => unwrap(api.post("/autorizaciones", payload)),
  aprobarAutorizacion: (id) => unwrap(api.patch(`/autorizaciones/${id}/aprobar`)),
  rechazarAutorizacion: (id) => unwrap(api.patch(`/autorizaciones/${id}/rechazar`)),
  reclamo: (payload) => unwrap(api.post("/reclamos", payload)),
  servicio: (payload) => unwrap(api.post("/servicios", payload)),
  pago: (payload) => unwrap(api.post("/pagos", payload)),
  generarFacturas: (periodo) => unwrap(api.post("/facturas/generar", periodo ? { periodo } : {})),
  pagarFactura: (id, referencia) => unwrap(api.patch(`/facturas/${id}/pagar`, { referencia })),
  recordarFactura: (id) => unwrap(api.patch(`/facturas/${id}/recordatorio`)),
  graciaFactura: (id) => unwrap(api.patch(`/facturas/${id}/gracia`)),
  suspenderFactura: (id) => unwrap(api.patch(`/facturas/${id}/suspender`)),
};

export default api;
