import forge from "node-forge";

class RSA {
    constructor(
        private readonly keyPair: forge.pki.rsa.KeyPair = forge.pki.rsa.generateKeyPair(4096)
    ){
    }

    public get publicKey(): string
    {
        return forge.pki.publicKeyToRSAPublicKeyPem(this.keyPair.publicKey);
    }

    encrypt(data: Uint8Array): Uint8Array {
        const buffer = forge.util.createBuffer(data);
        const encrypted = this.keyPair.publicKey.encrypt(buffer.bytes(), 'RSA-OAEP');
        
        return new Uint8Array(
            forge.util.createBuffer(encrypted).getBytes().split('').map(c => c.charCodeAt(0))
        );
    }

    decrypt(encryptedData: Uint8Array): Uint8Array {
        const buffer = forge.util.createBuffer(encryptedData);
        const decrypted = this.keyPair.privateKey.decrypt(buffer.bytes(), 'RSA-OAEP');

        return new Uint8Array(
            decrypted.split('').map(c => c.charCodeAt(0))
        );
    }
}

export default RSA;