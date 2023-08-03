export class BusinessServicesBassClass {
	id: number;
	user_id: string;
	id_user_id: { id: number; user_id: string };

	constructor({ id, user_id }: { id: number; user_id: string }) {
		this.id = id;
		this.user_id = user_id;
		this.id_user_id = {
			id,
			user_id,
		};
	}
}
