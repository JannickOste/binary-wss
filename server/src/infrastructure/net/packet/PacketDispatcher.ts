import { multiInject } from "inversify";
import IClientPacketHandler from "../../../domain/net/packet/IClientPacketHandler";
import types from "../../../di";
import ServerPacket from "../../../domain/net/ServerPacket";
import Packet from "../../../domain/net/packet/Packet";
import Client from "../../../domain/net/Client";
import WebSocket from "ws";
import Server from "../Server";
import IServerPacketHandler from "../../../domain/net/packet/IServerPacketHandler";
import provide from "../../../domain/decorators/provide";
import IPacketDispatcher from "../../../domain/net/packet/IPacketDispatcher";

@provide(types.Core.Domain.Net.Packet.IPacketDispatcher)
export default class PacketDispatcher implements IPacketDispatcher {
    private readonly clientPacketHandlerMap: Map<number, IServerPacketHandler> = new Map();

    constructor(
        @multiInject(types.Core.Domain.Net.Packet.IServerPacketHandler) private readonly clientPacketHandlers: IServerPacketHandler[],
    ) {
        this.clientPacketHandlers.forEach(handler => this.clientPacketHandlerMap.set(handler.id, handler));
    }

    public async dispatchToClient(client: Client, id: ServerPacket, ... data: unknown[]): Promise<void> {
        const packetHandler = this.clientPacketHandlerMap.get(id);
        if(packetHandler)
        {
            console.log(`Dispatching packet handler with id: ${id}`)
            await packetHandler.handle(
                client,
                data
            );
        } else console.log(`Packet handler with id: ${id} not found`)
    }

    public async dispatchToAll(id: ServerPacket, ... data: unknown[]): Promise<void> {
        for(const [, client] of Server.clients.entries())
        {
            await this.dispatchToClient(client, id, ... data);
        }
    }
}
