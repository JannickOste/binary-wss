import { WebSocket } from "ws";
export default class Client 
{
    constructor(
        public readonly id: number,
        public readonly socket: WebSocket
    ) {

    }
}