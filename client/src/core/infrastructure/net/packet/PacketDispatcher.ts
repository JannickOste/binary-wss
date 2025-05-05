import { inject, multiInject } from "inversify";
import IClientPacketBuilder from "../../../domain/net/packet/IClientPacketBuilder";
import provide from "../../../domain/decorators/provide";
import IPacketDispatcher from "../../../domain/net/packet/IPacketDispatcher";
import types from "../../../../di";
import ClientPacket from "../../../domain/net/packet/client/ClientPacket";
import Client from "../../../domain/net/Client";

@provide(types.Core.Domain.Net.Packet.IPacketDispatcher)
export default class PacketDispatcher implements IPacketDispatcher {
    private readonly clientPacketHandlerMap: Map<number, IClientPacketBuilder> = new Map();

    constructor(
        @multiInject(types.Core.Domain.Net.Packet.IClientPacketHandler) private readonly clientPacketHandlers: IClientPacketBuilder[],
        @inject(types.Core.Domain.Net.Client) private readonly client: Client 
    ) {
        this.clientPacketHandlers.forEach(handler => this.clientPacketHandlerMap.set(handler.id, handler));
    }

    public async dispatchToServer(id: ClientPacket): Promise<void> {
        const packetHandler = this.clientPacketHandlerMap.get(id);
        if(packetHandler)
        {
            console.log(`Sending packet to server with id: ${id}`)
            const payload = await packetHandler.handle();

            this.client.socket.send(payload.buffer);
        } else console.log(`Packet handler with id: ${id} not found`)
    }

}
