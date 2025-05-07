import { WebSocket } from "ws";
import crypto from "crypto"
import AES from "../../infrastructure/crypt/AES";

export default class Client 
{
    public clientRSAKey: string = "";
    public clientAESKey: Buffer | undefined ;
    public readonly serverAesKey: Buffer = crypto.randomBytes(32);

    public get clientAes()
    {
        return new AES(this.clientAESKey ?? Buffer.from([]));
    }

    constructor(
        public readonly id: number,
        public readonly socket: WebSocket
    ) {

    }
}