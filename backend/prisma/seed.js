import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const plans = [
  { id: 'BASICO', nombre: 'Plan Básico de Salud', copagoConsulta: 200, cobertura: { consultas: true, laboratorio: true, emergencias: true, hospitalizacion: true, odontologia: false, saludMental: false } },
  { id: 'PLUS', nombre: 'Plan Complementario', copagoConsulta: 100, cobertura: { consultas: true, laboratorio: true, emergencias: true, hospitalizacion: true, odontologia: true, saludMental: false } },
  { id: 'PREMIUM', nombre: 'Plan Premium', copagoConsulta: 50, cobertura: { consultas: true, laboratorio: true, emergencias: true, hospitalizacion: true, odontologia: true, saludMental: true } },
];
async function main() {
  const hash = await bcrypt.hash('admin123', 12);
  for (const [usuario, nombre, rol, password] of [['admin','Administrador','ADMINISTRADOR','admin123'], ['agente','Agente ARS','AGENTE','agente123'], ['supervisor','Supervisor','SUPERVISOR','super123']]) await prisma.usuario.upsert({ where: { usuario }, update: {}, create: { usuario, nombre, rol, passwordHash: await bcrypt.hash(password, 12) } });
  for (const plan of plans) await prisma.plan.upsert({ where: { id: plan.id }, update: plan, create: plan });
  const providers = [{ nombre: 'Hospital General Plaza de la Salud', tipo: 'Hospital', ciudad: 'Santo Domingo', telefono: '+1 809 555 0001' }, { nombre: 'CEDIMAT', tipo: 'Imagenología', ciudad: 'Santo Domingo', telefono: '+1 809 555 0002' }, { nombre: 'Laboratorio Referencia', tipo: 'Laboratorio', ciudad: 'Santo Domingo', telefono: '+1 809 555 0003' }];
  for (const provider of providers) { const found = await prisma.proveedor.findFirst({ where: { nombre: provider.nombre } }); if (!found) await prisma.proveedor.create({ data: provider }); }
  const policy = await prisma.poliza.upsert({ where: { id: 'P-001' }, update: {}, create: { id: 'P-001', empresa: 'COSEVI, S.R.L.', planId: 'PREMIUM', desde: new Date('2022-11-01'), hasta: new Date('2026-10-31'), primaMensual: 185000, asegurados: 52 } });
  await prisma.afiliado.upsert({ where: { cedula: '001-1234567-8' }, update: {}, create: { nombre: 'María Gonzalo Padilla', cedula: '001-1234567-8', planId: 'PREMIUM', polizaId: policy.id, desde: new Date('2023-05-10'), nacimiento: new Date('1991-09-14'), telefono: '+1 809 555 1111', correo: 'maria.padilla@demo.do', dependientes: 1 } });
  console.log('Datos demo creados. Usuarios: admin/admin123, agente/agente123, supervisor/super123');
}
main().finally(() => prisma.$disconnect());
