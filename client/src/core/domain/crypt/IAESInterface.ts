
interface IAESInterface 
{ 
    key: Buffer;

    encrypt(data: Buffer, key?: Buffer | Uint8Array): { encrypted: Buffer; iv: Buffer };
    decrypt(encryptedHex: Buffer, ivHex: Buffer): Buffer;
}

export default IAESInterface;