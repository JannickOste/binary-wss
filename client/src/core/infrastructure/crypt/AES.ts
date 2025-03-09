import crypto from "crypto";
import IAESInterface from "../../domain/crypt/IAESInterface";

export default class AES implements IAESInterface {
    constructor(
        private readonly key: Buffer
    ) {
        if (this.key.length !== 32) throw new Error("Key must be 32 bytes (256 bits)");
    }

    encrypt(data: string | Buffer): { encrypted: string; iv: string } {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv("aes-256-cbc", this.key, iv);

        let encrypted = cipher.update(data);
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return {
            encrypted: encrypted.toString("hex"),
            iv: iv.toString("hex"),
        };
    }

    decrypt(encryptedHex: string, ivHex: string): string {
        const iv = Buffer.from(ivHex, "hex");
        const encryptedData = Buffer.from(encryptedHex, "hex");

        const decipher = crypto.createDecipheriv("aes-256-cbc", this.key, iv);
        let decrypted = decipher.update(encryptedData);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    }
}