import { WebSocket } from "ws";
import crypto from "crypto"
import AES from "../../infrastructure/crypt/AES";

export default class Client 
{
    public publicKey: string = "";
    public clientAesKey: Buffer | undefined ;
    public readonly serverAesKey: Buffer = crypto.randomBytes(32);
    public get clientAes()
    {
        return new AES(this.clientAesKey ?? Buffer.from([]));
    }

    constructor(
        public readonly id: number,
        public readonly socket: WebSocket
    ) {

    }
}