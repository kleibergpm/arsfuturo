export const PLANES = [
  { id: "BASICO", nombre: "Plan Basico de Salud (PBS)", copagoConsulta: 200, cobertura: { consultas: true, laboratorio: true, emergencias: true, hospitalizacion: true } },
  { id: "PLUS", nombre: "Plan Complementario", copagoConsulta: 100, cobertura: { consultas: true, laboratorio: true, emergencias: true, hospitalizacion: true, odontologia: true } },
  { id: "PREMIUM", nombre: "Plan Premium", copagoConsulta: 50, cobertura: { consultas: true, laboratorio: true, emergencias: true, hospitalizacion: true, odontologia: true, saludMental: true } },
];

export function getPlanById(id) {
  return PLANES.find((plan) => plan.id === id) || PLANES[0];
}

export function canAuthorize(afiliado, procedimiento) {
  const plan = getPlanById(afiliado.plan);
  const value = procedimiento.toLowerCase();
  if (value.includes("consulta")) return plan.cobertura.consultas;
  if (value.includes("rayos") || value.includes("imagen")) return plan.cobertura.emergencias || plan.cobertura.hospitalizacion;
  if (value.includes("laborat")) return plan.cobertura.laboratorio;
  if (value.includes("odont")) return plan.cobertura.odontologia || false;
  if (value.includes("psico") || value.includes("mental")) return plan.cobertura.saludMental || false;
  return true;
}
