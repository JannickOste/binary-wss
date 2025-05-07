import { multiInject } from "inversify";
import Client from "../../../domain/net/Client";
import Packet from "../../../domain/net/packet/Packet";
import IPacketProcessor from "../../../domain/net/packet/IPacketProcessor";
import provide from "../../../domain/decorators/provide";
import types from "../../../../di";
import IServerPacketHandler from "../../../domain/net/packet/IServerPacketHandler";

@provide(types.Core.Domain.Net.Packet.IPacketProcessor)
export default class PacketProcessor implements IPacketProcessor
{

    private readonly serverPacketHandlerMap: Map<number, IServerPacketHandler> = new Map();

    constructor(
        @multiInject(types.Core.Domain.Net.Packet.IServerPacketHandler) private readonly serverPacketHandlers: IServerPacketHandler[],

    ) {
        this.serverPacketHandlers.forEach(handler => this.serverPacketHandlerMap.set(handler.id, handler));
    }

    public async processPacket(
        data: Uint8Array
    ) {
        const receivedPacket = new Packet({ buffer: new Uint8Array(data as ArrayBuffer) });
        const id = receivedPacket.readNumber();
        const encryption = receivedPacket.readNumber();
        
        console.log(`Packet received with id: ${id}, encryption: ${encryption}`)
        const packetHandler = this.serverPacketHandlerMap.get(id);
        if (packetHandler) {
            packetHandler.handle(receivedPacket);
            return;
        } else console.log("No packet handler found")
    }
}