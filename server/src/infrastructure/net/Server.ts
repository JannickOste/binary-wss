import WebSocket from 'ws';
import Packet from '../../domain/net/packet/Packet';
import Client from '../../domain/net/Client';
import ServerPacket from '../../domain/net/ServerPacket';
import IClientPacketHandler from '../../domain/net/packet/IClientPacketHandler';
import IServerPacketHandler from '../../domain/net/packet/IServerPacketHandler';
import types from '../../di';
import { multiInject } from 'inversify';
import { unmanaged } from 'inversify';
import IServer from '../../domain/net/IServer';
import provide from '../../domain/decorators/provide';

@provide(types.Core.Domain.Net.IServer)
export default class Server implements IServer {
    private server: WebSocket.Server | undefined;
    private readonly clients: Map<WebSocket, Client> = new Map();
    
    private lastId = 0;

    constructor(
        @unmanaged() private readonly PORT: number = 8080,
        @multiInject(types.Core.Domain.Net.Packet.IClientPacketHandler) private readonly clientPacketHandlers: IClientPacketHandler[],
        @multiInject(types.Core.Domain.Net.Packet.IServerPacketHandler) private readonly serverPacketHandlers: IServerPacketHandler[],
    ) {
    }

    private onClientConnect(socket: WebSocket): void {
        socket.binaryType = 'arraybuffer';

        const client = new Client(this.lastId++, socket);

        this.clients.set(socket, client);

        socket.on('message', this.onPacketReceive.bind(this, socket));
        socket.on('close', this.onClientDisconnect.bind(this, socket));

        this.serverPacketHandlers.find(v => v.id === ServerPacket.HANDSHAKE)?.handle(client);
    }

    private onPacketReceive(socket: WebSocket, data: WebSocket.Data): void {
        const packet = new Packet({ buffer: new Uint8Array(data as ArrayBuffer) });
        const id = packet.readNumber();

        const packetHandler = this.clientPacketHandlers.find(v => v.id === id);
        if (packetHandler) {
            packetHandler.handle(this.clients.get(socket)!, packet);
            return;
        } 

        socket.close();
    }

    private onClientDisconnect(socket: WebSocket): void {
        this.clients.delete(socket);
    }

    public async listen(): Promise<void>
    {
        this.server = new WebSocket.Server({ port: this.PORT });
        this.server.on('connection', this.onClientConnect.bind(this));
    }

    public async destroy(): Promise<void>
    {
        this.server?.close();
    }
}
