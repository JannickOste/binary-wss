import WebSocket from 'ws';
import Packet from './Packet';
import Client from './Client';
import IPacketHandler from './packets/IPacketHandler';
import ClientPacket from './packets/ClientPacket';
import ServerPacket from './packets/ServerPacket';
import  ServerHandshake from './packets/server/Handshake';
import ClientHandshake from './packets/client/Handshake';

export default class Server {
    private readonly server: WebSocket.Server;
    private readonly clients: Map<WebSocket, Client> = new Map();
    private readonly clientPackets: Map<ClientPacket, IPacketHandler> = new Map();
    private readonly serverPackets: Map<ServerPacket, IPacketHandler> = new Map(); 
    
    private lastId = 0;

    constructor(
        private readonly PORT: number = 8080
    ) {
        // Just for example sake. This should be moved to a separate method or class and be more dynamic
        this.serverPackets.set(ServerPacket.HANDSHAKE, new ServerHandshake());
        this.clientPackets.set(ClientPacket.HANDSHAKE, new ClientHandshake());

        this.server = new WebSocket.Server({ port: PORT });
        this.server.on('connection', this.onClientConnect.bind(this));
    }

    private onClientConnect(socket: WebSocket): void {
        socket.binaryType = 'arraybuffer';

        const client = new Client(this.lastId++, socket);

        this.clients.set(socket, client);

        socket.on('message', this.onPacketReceive.bind(this, socket));
        socket.on('close', this.onClientDisconnect.bind(this, socket));

        this.serverPackets.get(ServerPacket.HANDSHAKE)?.handle(client);
    }

    private onPacketReceive(socket: WebSocket, data: WebSocket.Data): void {
        const packet = new Packet({ buffer: new Uint8Array(data as ArrayBuffer) });
        const id = packet.readNumber();

        const packetHandler = this.clientPackets.get(id);
        if (packetHandler) {
            packetHandler.handle(this.clients.get(socket)!, packet);
            return;
        } 

        socket.close();
    }

    private onClientDisconnect(socket: WebSocket): void {
        this.clients.delete(socket);
    }
}
