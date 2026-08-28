import app from './app.js'; import { env } from './config/env.js'; import { prisma } from './config/prisma.js';
const server = app.listen(env.port, () => console.log(`ARS Futuro API en http://localhost:${env.port}`));
const close = async () => { await prisma.$disconnect(); server.close(); }; process.on('SIGINT', close); process.on('SIGTERM', close);
