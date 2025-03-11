
interface IAESInterface 
{ 
    encrypt(data: Buffer): { encrypted: Buffer; iv: Buffer };
    decrypt(data: Buffer, iv: Buffer): Buffer;
}

export default IAESInterface;