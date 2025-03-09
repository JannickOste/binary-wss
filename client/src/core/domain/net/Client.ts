import AES from "../../infrastructure/crypt/AES";
import RSA from "../../infrastructure/crypt/RSA";
import crypto from "crypto"
import { WebSocket } from "ws";

export default class Client {
    public cryptInterface: RSA = new RSA()
    public  serverAESKey: Buffer | undefined;
    public clientAESKey = crypto.randomBytes(32);

    public get clientAES()
    {
        return new AES(this.clientAESKey)
    }

    public get serverAES()
    {
        return new AES(this.serverAESKey ?? Buffer.from([]))
    }

    constructor(
        public socket: WebSocket,
        public serverKey: string,
        public id: number, 
    ) {

    }
}
