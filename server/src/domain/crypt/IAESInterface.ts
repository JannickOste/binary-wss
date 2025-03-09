
interface IAESInterface 
{ 
    encrypt(data: string | Buffer): { encrypted: string; iv: string };
    decrypt(encryptedHex: string, ivHex: string): string;
}

export default IAESInterface;