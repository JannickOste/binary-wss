import Client from "../../../../domain/net/Client";
import Packet from "../../../../domain/net/packet/Packet";
import ClientPacket from "../../../../domain/net/packet/client/ClientPacket";
import IClientPacketBuilder from "../../../../domain/net/packet/IClientPacketBuilder";
import types, { container } from "../../../../../di";
import provide from "../../../../domain/decorators/provide";
import { inject } from "inversify";

@provide(types.Core.Domain.Net.Packet.IClientPacketHandler)
export default class SendAESKey implements IClientPacketBuilder
{ 
    id = ClientPacket.HELLO_WORLD;

    public async handle(
    ): Promise<Packet> 
    {
        const client = container.get<Client>(types.Core.Domain.Net.Client);
        const packet = new Packet({
            id: ClientPacket.HELLO_WORLD
        });

        const clientAesKeyEncrypted = client.cryptInterface.encrypt(
            client.clientAESKey,
            client.serverRSAKey
        );
        
        packet.writeBuffer(Buffer.from(clientAesKeyEncrypted))

        return packet;
    }
}