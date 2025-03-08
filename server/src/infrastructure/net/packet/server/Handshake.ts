import Client from "../../../../domain/net/Client";
import Packet from "../../../../domain/net/packet/Packet";
import ClientPacket from "../../../../domain/net/ClientPacket";
import IServerPacketHandler from "../../../../domain/net/packet/IServerPacketHandler";
import ServerPacket from "../../../../domain/net/ServerPacket";
import types from "../../../../di";
import provide from "../../../../domain/decorators/provide";

@provide(types.Core.Domain.Net.Packet.IServerPacketHandler)
export default class Handshake implements IServerPacketHandler {
    id = ServerPacket.HANDSHAKE;

    public async handle(
        client: Client
    ): Promise<void> 
    {
        const payload = new Packet({id: ClientPacket.HANDSHAKE});

        payload.write(client.id);

        client.socket.send(payload.buffer);
        console.log(`Handshake packet send to client ${client.id}`);
    }
}