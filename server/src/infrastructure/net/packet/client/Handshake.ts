import types from "../../../../di";
import provide from "../../../../domain/decorators/provide";
import Client from "../../../../domain/net/Client";
import ClientPacket from "../../../../domain/net/ClientPacket";
import IClientPacketHandler from "../../../../domain/net/packet/IClientPacketHandler";
import Packet from "../../../../domain/net/packet/Packet";

@provide(types.Core.Domain.Net.Packet.IClientPacketHandler)
export default class Handshake implements IClientPacketHandler {
    id = ClientPacket.HANDSHAKE;

    public async handle(
        client: Client,
        packet: Packet
    ): Promise<void> 
    {
        // Could to some cryptography here
    }
}