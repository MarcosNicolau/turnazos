import fs from "fs/promises";

export class FileReader {
	async readFile({ path }: { path: string }) {
		try {
			const res = await fs.readFile(path, "utf-8");
			return res;
		} catch (err) {
			return Promise.reject(err);
		}
	}
}
