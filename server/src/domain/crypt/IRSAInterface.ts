interface IRSAInterface { 
    publicKey: string;

    encrypt(data: Uint8Array): Uint8Array;
    decrypt(encryptedData: Uint8Array): Uint8Array;
}

export default IRSAInterface;
