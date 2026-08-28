import { prisma } from '../config/prisma.js';
export const notify = (data) => prisma.notificacion.create({ data });
