import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../lib/env.js";
import { prisma } from "../lib/prisma.js";

export class AuthController {
	constructor(
		private readonly database = prisma,
		private readonly configuration = env,
	) {}

	login = async (req, res) => {
		const user = await this.database.user.findUnique({
			where: { username: req.body.username },
		});
		console.log(user);
		if (
			!user ||
			!(await bcrypt.compare(req.body.password, user.passwordHash))
		) {
			return res.status(401).json({
				error: "INVALID_CREDENTIALS",
				message: "Usuario o contraseña incorrectos",
			});
		}

		const token = jwt.sign(
			{ sub: user.id, username: user.username, role: user.role },
			this.configuration.jwtSecret,
			{ expiresIn: "8h" },
		);
		res.json({
			token,
			user: {
				id: user.id,
				username: user.username,
				name: user.name,
				role: user.role,
			},
		});
	};

	me = async (req, res) => {
		const user = await this.database.user.findUnique({
			where: { id: req.user.sub },
			select: { id: true, username: true, name: true, role: true },
		});
		res.json(user);
	};
}

export const authController = new AuthController();
