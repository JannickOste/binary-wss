export default class Client {
    constructor(
        private readonly id: number, 
        private readonly socket: WebSocket
    ) {
    }
}
