import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
export async function login(req, res) {
  const user = await prisma.usuario.findUnique({ where: { usuario: req.body.usuario } });
  if (!user || !(await bcrypt.compare(req.body.password, user.passwordHash))) return res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'Usuario o contraseña incorrectos' });
  const token = jwt.sign({ sub: user.id, usuario: user.usuario, rol: user.rol }, env.jwtSecret, { expiresIn: '8h' });
  res.json({ token, user: { id: user.id, usuario: user.usuario, nombre: user.nombre, rol: user.rol } });
}
export async function me(req, res) { const user = await prisma.usuario.findUnique({ where: { id: req.user.sub }, select: { id: true, usuario: true, nombre: true, rol: true } }); res.json(user); }
