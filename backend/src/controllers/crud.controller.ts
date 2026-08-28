import { prisma } from '../config/prisma.js';
export const crud = (model, include) => ({
  list: async (req, res) => res.json(await prisma[model].findMany({ include, orderBy: { createdAt: 'desc' } })),
  get: async (req, res) => { const row = await prisma[model].findUnique({ where: { id: req.params.id }, include }); if (!row) return res.status(404).json({ error: 'NOT_FOUND', message: 'Recurso no encontrado' }); res.json(row); },
  create: async (req, res) => res.status(201).json(await prisma[model].create({ data: req.body, include })),
  update: async (req, res) => res.json(await prisma[model].update({ where: { id: req.params.id }, data: req.body, include })),
  remove: async (req, res) => { await prisma[model].delete({ where: { id: req.params.id } }); res.status(204).end(); },
});
