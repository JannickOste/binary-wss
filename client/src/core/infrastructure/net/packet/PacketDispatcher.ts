import { multiInject } from "inversify";
import IClientPacketHandler from "../../../domain/net/packet/IClientPacketHandler";
import provide from "../../../domain/decorators/provide";
import IPacketDispatcher from "../../../domain/net/packet/IPacketDispatcher";
import types from "../../../../di";
import ClientPacket from "../../../domain/net/packet/client/ClientPacket";

@provide(types.Core.Domain.Net.Packet.IPacketDispatcher)
export default class PacketDispatcher implements IPacketDispatcher {
    private readonly clientPacketHandlerMap: Map<number, IClientPacketHandler> = new Map();

    constructor(
        @multiInject(types.Core.Domain.Net.Packet.IClientPacketHandler) private readonly clientPacketHandlers: IClientPacketHandler[],
    ) {
        this.clientPacketHandlers.forEach(handler => this.clientPacketHandlerMap.set(handler.id, handler));
    }

    public async dispatchToServer(id: ClientPacket): Promise<void> {
        const packetHandler = this.clientPacketHandlerMap.get(id);
        if(packetHandler)
        {
            console.log(`Sending packet to server with id: ${id}`)
            await packetHandler.handle();
        } else console.log(`Packet handler with id: ${id} not found`)
    }

}
