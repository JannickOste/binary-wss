import AES from "../../infrastructure/crypt/AES";
import RSA from "../../infrastructure/crypt/RSA";
import crypto from "crypto"

export default class Client {
    public readonly cryptInterface: RSA = new RSA()
    public  serverAESKey: Buffer | undefined;
    public readonly clientAESKey = crypto.randomBytes(32);

    public get clientAES()
    {
        return new AES(this.clientAESKey)
    }

    public get serverAES()
    {
        return new AES(this.serverAESKey ?? Buffer.from([]))
    }

    constructor(
        private readonly id: number, 
        private readonly socket: WebSocket,
        public readonly serverKey: string
    ) {

    }
}
