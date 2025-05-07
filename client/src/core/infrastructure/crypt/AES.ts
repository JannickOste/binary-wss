import crypto from "crypto";
import IAESInterface from "../../domain/crypt/IAESInterface";
import provide from "../../domain/decorators/provide";
import types from "../../../di";
import { bindingScopeValues } from "inversify";
import { unmanaged } from "inversify";

@provide(types.Client.Crypt.AES, bindingScopeValues.Singleton)
class AES implements IAESInterface {
    constructor(
       @unmanaged() public readonly key: Buffer = crypto.randomBytes(32)
    ) {
        if (this.key.length !== 32) throw new Error("Key must be 32 bytes (256 bits)");
    }

    encrypt(data: Buffer, key?: Uint8Array | Buffer): { encrypted: Buffer; iv: Buffer } {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv("aes-256-cbc", key ?? this.key, iv);

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