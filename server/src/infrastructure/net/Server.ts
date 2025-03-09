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
import { inject } from 'inversify';
import IPacketDispatcher from '../../domain/net/packet/IPacketDispatcher';
import IPacketProcessor from '../../domain/net/packet/IPacketProcessor';

@provide(types.Core.Domain.Net.IServer)
export default class Server implements IServer {
    private server: WebSocket.Server | undefined;
    public static readonly clients: Map<WebSocket, Client> = new Map();
    private readonly clientPacketHandlerMap: Map<number, IClientPacketHandler> = new Map();
    private readonly serverPacketHandlerMap: Map<number, IServerPacketHandler> = new Map();
    
    
    private lastId = 0;

    constructor(
        @unmanaged() private readonly PORT: number = 8080,
        @multiInject(types.Core.Domain.Net.Packet.IClientPacketHandler) private readonly clientPacketHandlers: IClientPacketHandler[],
        @multiInject(types.Core.Domain.Net.Packet.IServerPacketHandler) private readonly serverPacketHandlers: IServerPacketHandler[],
        @inject(types.Core.Domain.Net.Packet.IPacketDispatcher) public readonly packetDispatcher: IPacketDispatcher,
        @inject(types.Core.Domain.Net.Packet.IPacketProcessor) private readonly packetProcessor: IPacketProcessor
    ) {
        this.clientPacketHandlers.forEach(handler => this.clientPacketHandlerMap.set(handler.id, handler));
        this.serverPacketHandlers.forEach(handler => this.serverPacketHandlerMap.set(handler.id, handler));

    }

    private async onClientConnect(socket: WebSocket): Promise<void> {
        socket.binaryType = 'arraybuffer';
        const client = new Client(this.lastId++, socket);

        Server.clients.set(socket, client);
        
        socket.on('message', this.onPacketReceive.bind(this, socket));
        socket.on('close', this.onClientDisconnect.bind(this, socket));

        await this.packetDispatcher.dispatchToClient(
            client,
            ServerPacket.HANDSHAKE
        )
    }

    private async onPacketReceive(socket: WebSocket, data: WebSocket.Data): Promise<void> {
        const client = Server.clients.get(socket);
        if(client)
        {
            await this.packetProcessor.processPacket(
                client, 
                new Uint8Array(data as ArrayBuffer) 
            )
        }
    }

    private onClientDisconnect(socket: WebSocket): void {
        Server.clients.delete(socket);
    }

    public async listen(): Promise<void>
    {
        this.server = new WebSocket.Server({ port: this.PORT, maxPayload: Packet.MAX_PACKET_SIZE, });
        this.server.on('connection', this.onClientConnect.bind(this));
    }

    public async destroy(): Promise<void>
    {
        this.server?.close();
    }
}
