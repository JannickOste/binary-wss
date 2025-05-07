import { multiInject } from "inversify";
import Client from "../../../domain/net/Client";
import IClientPacketHandler from "../../../domain/net/packet/IClientPacketHandler";
import Packet from "../../../domain/net/packet/Packet";
import types from "../../../di";
import IPacketProcessor from "../../../domain/net/packet/IPacketProcessor";
import provide from "../../../domain/decorators/provide";
import ClientPacket from "../../../domain/net/ClientPacket";

@provide(types.Core.Domain.Net.Packet.IPacketProcessor)
export default class PacketProcessor implements IPacketProcessor
{

    private readonly clientPacketHandlerMap: Map<ClientPacket, IClientPacketHandler> = new Map();

    constructor(
        @multiInject(types.Core.Domain.Net.Packet.IClientPacketHandler) private readonly clientPacketHandlers: IClientPacketHandler[],
    ) {
        this.clientPacketHandlers.forEach(handler => this.clientPacketHandlerMap.set(handler.id, handler));

    }

    public async processPacket(
        client: Client,
        data: Uint8Array
    ) {
        const packet = new Packet({ buffer: new Uint8Array(data as ArrayBuffer) });
        const id = packet.readNumber();
        const encryption = packet.readNumber();
        
        console.log(`Packet received with id: ${id}, encryption: ${encryption}`)    
        const packetHandler = this.clientPacketHandlerMap.get(id);
        if (packetHandler) {
            packetHandler.handle(client, packet);
            return;
        } 

        client.socket.close();
    }
}