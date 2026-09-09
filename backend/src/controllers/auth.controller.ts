import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';

export class AuthController {
  constructor(private readonly database = prisma, private readonly configuration = env) {}

  login = async (req, res) => {
    const user = await this.database.usuario.findUnique({ where: { usuario: req.body.usuario } });
    if (!user || !(await bcrypt.compare(req.body.password, user.passwordHash))) {
      return res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'Usuario o contraseña incorrectos' });
    }

    const token = jwt.sign({ sub: user.id, usuario: user.usuario, rol: user.rol }, this.configuration.jwtSecret, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, usuario: user.usuario, nombre: user.nombre, rol: user.rol } });
  };

  me = async (req, res) => {
    const user = await this.database.usuario.findUnique({ where: { id: req.user.sub }, select: { id: true, usuario: true, nombre: true, rol: true } });
    res.json(user);
  };
}

export const authController = new AuthController();
