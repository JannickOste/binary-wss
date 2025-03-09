import AES from "../../../../../src/infrastructure/crypt/AES";
import crypto from "crypto";

describe("AES class", () => {
    const key = crypto.randomBytes(32); 
    const aesInstance = new AES(key);
    const data = "Hello, World!";

    test("It should instantiate with a valid 32-byte key", () => {
        expect(aesInstance).toBeInstanceOf(AES);
    });

    test("It should throw an error if the key is not 32 bytes", () => {
        expect(() => new AES(crypto.randomBytes(16))).toThrow();
    });

    test("It should encrypt and decrypt data correctly", () => {
        const { encrypted, iv } = aesInstance.encrypt(data);
        expect(typeof encrypted).toBe("string");
        expect(typeof iv).toBe("string");

        const decrypted = aesInstance.decrypt(encrypted, iv);
        expect(decrypted).toBe(data);
    });

    test("It should throw an error on decryption with incorrect IV", () => {
        const { encrypted } = aesInstance.encrypt(data);
        const incorrectIv = crypto.randomBytes(16).toString("hex");

        expect(() => aesInstance.decrypt(encrypted, incorrectIv)).toThrow();
    });

    test("It should throw an error on decryption with incorrect encrypted data", () => {
        const { iv } = aesInstance.encrypt(data);
        const incorrectEncryptedData = "invalidEncryptedData";

        expect(() => aesInstance.decrypt(incorrectEncryptedData, iv)).toThrow();
    });


    test("It should handle empty data", () => {
        const emptyData = "";
        const { encrypted, iv } = aesInstance.encrypt(emptyData);
        expect(typeof encrypted).toBe("string");
        expect(typeof iv).toBe("string");

        const decrypted = aesInstance.decrypt(encrypted, iv);
        expect(decrypted).toBe(emptyData); 
    });

    test("It should handle large data", () => {
        const largeData = "A".repeat(1_000_000); 
        const { encrypted, iv } = aesInstance.encrypt(largeData);
        expect(typeof encrypted).toBe("string");
        expect(typeof iv).toBe("string");

        const decrypted = aesInstance.decrypt(encrypted, iv);
        expect(decrypted).toBe(largeData); 
    });
    
    test("It should handle Buffer input", () => {
        const bufferData = Buffer.from("Hello, Buffer!");
        const { encrypted, iv } = aesInstance.encrypt(bufferData);
        expect(typeof encrypted).toBe("string");
        expect(typeof iv).toBe("string");

        const decrypted = aesInstance.decrypt(encrypted, iv);
        expect(decrypted).toBe(bufferData.toString());
    });
});
