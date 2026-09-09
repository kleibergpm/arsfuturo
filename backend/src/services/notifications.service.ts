import { prisma } from '../config/prisma.js';

export class NotificationService {
	constructor(private readonly database = prisma) {}

	create = (data) => this.database.notificacion.create({ data });
}

export const notificationService = new NotificationService();
export const notify = notificationService.create;
