interface IRSAInterface { 
    publicKey: string;

    encrypt(data: Uint8Array, receivedPublicKeyPem?: string): Uint8Array;
    decrypt(encryptedData: Uint8Array): Uint8Array;
}

export default IRSAInterface;
