
interface IAESInterface 
{ 
    encrypt(data: Buffer): { encrypted: Buffer; iv: Buffer };
    decrypt(encryptedHex: Buffer, ivHex: Buffer): Buffer;
}

export default IAESInterface;