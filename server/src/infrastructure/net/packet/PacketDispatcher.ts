import { multiInject } from "inversify";
import IClientPacketHandler from "../../../domain/net/packet/IClientPacketHandler";
import types from "../../../di";
import ServerPacket from "../../../domain/net/ServerPacket";
import Packet from "../../../domain/net/packet/Packet";
import Client from "../../../domain/net/Client";
import WebSocket from "ws";
import Server from "../Server";
import IServerPacketBuilder from "../../../domain/net/packet/IServerPacketBuilder";
import provide from "../../../domain/decorators/provide";
import IPacketDispatcher from "../../../domain/net/packet/IPacketDispatcher";

@provide(types.Core.Domain.Net.Packet.IPacketDispatcher)
export default class PacketDispatcher implements IPacketDispatcher {
    private readonly serverPacketHandlerMap: Map<ServerPacket, IServerPacketBuilder> = new Map();

    constructor(
        @multiInject(types.Core.Domain.Net.Packet.IServerPacketHandler) serverPacketHandlers: IServerPacketBuilder[],
    ) {
        serverPacketHandlers.forEach(handler => this.serverPacketHandlerMap.set(handler.id, handler));
    }

    public async dispatchToClient(client: Client, id: ServerPacket, ... data: unknown[]): Promise<void> {
        const packetHandler = this.serverPacketHandlerMap.get(id);
        if(packetHandler)
        {
            const payload = await packetHandler.build(
                client,
                data
            );

            console.log(`Sending packet to client ${client.id} with packet id: ${id} and encryption: ${payload.encryption}`)
            client.socket.send(payload.buffer);
        } else console.log(`Packet handler with id: ${id} not found`)
    }

    public async dispatchToAll(id: ServerPacket, ... data: unknown[]): Promise<void> {
        for(const [, client] of Server.clients.entries())
        {
            await this.dispatchToClient(client, id, ... data);
        }
    }
}
