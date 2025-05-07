import AES from "../../infrastructure/crypt/AES";
import RSA from "../../infrastructure/crypt/RSA";
import crypto from "crypto"
import { WebSocket } from "ws";

export default class Client {

    constructor(
        public socket: WebSocket,
        public id: number, 
    ) {

    }
}
