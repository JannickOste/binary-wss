import crypto from "crypto";
import IAESInterface from "../../domain/crypt/IAESInterface";


class AES implements IAESInterface {
    constructor(
        private readonly key: Buffer
    ) {
        if (this.key.length !== 32) throw new Error("Key must be 32 bytes (256 bits)");
    }

    encrypt(data: Buffer): { encrypted: Buffer; iv: Buffer } {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv("aes-256-cbc", this.key, iv);

        let encrypted = cipher.update(data);
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return {
            encrypted: encrypted,
            iv: iv,
        };
    }

    decrypt(data: Buffer, iv: Buffer): Buffer {
        const decipher = crypto.createDecipheriv("aes-256-cbc", this.key, iv);
        let decrypted = decipher.update(data);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted;
    }
}

export default AES;