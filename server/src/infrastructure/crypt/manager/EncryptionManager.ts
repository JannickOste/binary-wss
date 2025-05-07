import { inject } from "inversify";
import EncryptionFlag from "../../../domain/crypt/EncryptionFlag";
import Client from "../../../domain/net/Client";
import types from "../../../di";
import IRSAInterface from "../../../domain/crypt/IRSAInterface";
import Packet from "../../../domain/net/packet/Packet";

export default class EncryptionManager 
{ 
    constructor(
        @inject(types.Core.Domain.Crypt.IRSAInterface) private readonly rsa: IRSAInterface
    ) {

    }

    public encrypt(flag: EncryptionFlag, client: Client, data: Buffer): Buffer | Uint8Array
    { 
        switch(flag)
        {
            case EncryptionFlag.RSA:
                return this.rsa.encrypt(data, client.clientRSAKey);
                break;

            case EncryptionFlag.AES:
                const {encrypted, iv} = client.clientAES.encrypt(data);

                const packetWriter = new Packet();
                packetWriter.writeBuffer(iv);
                packetWriter.writeBuffer(encrypted);

                return packetWriter.buffer;
            default:
                throw new Error("Invalid encryption flag");
        }
    }

    public decrypt(flag: EncryptionFlag, client: Client, data: Buffer): Buffer
    {

    }
}