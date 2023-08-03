import bcrypt from "bcrypt";
import crypto from "crypto";

/**
 * @param data The data to be encrypted.
 * @param saltOrRounds The salt to be used in encryption. If specified as a number then a
 * salt will be generated with the specified number of rounds and used.
 * @return A promise to be either resolved with the encrypted data salt or rejected with an Error
 *
 * @example
 * import * as bcrypt from 'bcrypt';
 * const saltRounds = 10;
 * const myPlaintextPassword = 's0/\/\P4$$w0rD';
 *
 * (async () => {
 *     // Technique 1 (generate a salt and hash on separate function calls):
 *     const salt = await bcrypt.genSalt(saltRounds);
 *     const hash = await bcrypt.hash(myPlaintextPassword, salt);
 *     // Store hash in your password DB.
 *
 *     // Technique 2 (auto-gen a salt and hash):
 *     const hash2 = await bcrypt.hash(myPlaintextPassword, saltRounds);
 *     // Store hash in your password DB.
 * })();
 */
export const saltString = (string: string, salt?: string | number) =>
	bcrypt.hash(string, salt || 11);

/**
 * @param data The data to be encrypted.
 * @param encrypted The data to be compared against.
 * @return A promise to be either resolved with the comparison result salt or rejected with an Error
 *
 * @example
 * import * as bcrypt from 'bcrypt';
 * const myPlaintextPassword = 's0/\/\P4$$w0rD';
 * const someOtherPlaintextPassword = 'not_bacon';
 *
 * (async () => {
 *     // Load hash from your password DB.
 *     const result1 = await bcrypt.compare(myPlaintextPassword, hash);
 *     // result1 == true
 *
 *     const result2 = await bcrypt.compare(someOtherPlaintextPassword, hash);
 *     // result2 == false
 * })();
 */
export const compareSaltedString = (string: string, encrypted: string) =>
	bcrypt.compare(string, encrypted);

export const generateRandomKey = (bytes?: number) =>
	crypto.randomBytes(bytes || 20).toString("hex");

export const generateRandomCode = (length = 6) =>
	Math.random()
		.toString()
		.substring(2, length + 2);
