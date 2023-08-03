import { AppError } from "utils/error";
import { prisma } from "config/prisma";
import { BusinessServicesBassClass } from "services/business/base";
import { Pagination } from "type/pagination";
import { CreateNotification } from "type/services/business";
import { DocumentNotFoundError } from "utils/error";
import { getOffset } from "utils/pagination";

export class BusinessNotificationsManagement extends BusinessServicesBassClass {
	create = async (notification: CreateNotification) => {
		try {
			const res = await prisma.business.update({
				data: { notifications: { create: { ...notification, read: false } } },
				where: { id_user_id: this.id_user_id },
			});
			if (!res) return Promise.reject(new DocumentNotFoundError());
			return res;
		} catch (err) {
			return Promise.reject(err);
		}
	};
	getAll = async (pagination: Pagination) => {
		try {
			const res = await prisma.business.findUnique({
				select: {
					notifications: {
						skip: getOffset(pagination),
						take: pagination.size,
						orderBy: { created_at: "desc" },
					},
				},
				where: { id_user_id: this.id_user_id },
			});
			if (!res) return Promise.reject(new DocumentNotFoundError());
			return res;
		} catch (err) {
			return Promise.reject(err);
		}
	};
	get = async (notificationId: number) => {
		try {
			const res = await prisma.business.findUnique({
				select: { notifications: { where: { id: notificationId } } },
				where: { id_user_id: this.id_user_id },
			});
			if (!res) return Promise.reject(new DocumentNotFoundError());
			//Since we are selecting with the notification id it only returns one
			if (!res.notifications[0])
				return Promise.reject(
					new AppError({ message: "The notification does not exist", httpCode: 400 })
				);
			return res.notifications[0];
		} catch (err) {
			return Promise.reject(err);
		}
	};
	markAsRead = async (notificationId: number) => {
		try {
			const res = await prisma.business.update({
				data: {
					notifications: {
						update: { data: { read: true }, where: { id: notificationId } },
					},
				},
				where: { id_user_id: this.id_user_id },
			});
			if (!res) return Promise.reject(new DocumentNotFoundError());
			return res;
		} catch (err) {
			return Promise.reject(err);
		}
	};
	markAllAsRead = async () => {
		try {
			const res = await prisma.notification.updateMany({
				data: {
					read: true,
				},
				where: { business: { user_id: this.user_id, id: this.id } },
			});
			if (!res) return Promise.reject(new DocumentNotFoundError());
			return res;
		} catch (err) {
			return Promise.reject(err);
		}
	};
	remove = async (notificationId: number) => {
		try {
			const res = await prisma.business.update({
				data: { notifications: { delete: { id: notificationId } } },
				where: { id_user_id: this.id_user_id },
			});
			if (!res) return Promise.reject(new DocumentNotFoundError());
			return res;
		} catch (err) {
			return Promise.reject(err);
		}
	};
	removeAll = async () => {
		try {
			const res = await prisma.business.update({
				data: { notifications: { deleteMany: {} } },
				where: { id_user_id: this.id_user_id },
			});
			if (!res) return Promise.reject(new DocumentNotFoundError());
			return res;
		} catch (err) {
			return Promise.reject(err);
		}
	};
}
