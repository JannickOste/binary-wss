import Client from "../../../../domain/net/Client";
import Packet from "../../../../domain/net/packet/Packet";
import ClientPacket from "../../../../domain/net/packet/client/ClientPacket";
import IClientPacketBuilder from "../../../../domain/net/packet/IClientPacketBuilder";
import provide from "../../../../domain/decorators/provide";
import types from "../../../../../di";
import { inject } from "inversify";

@provide(types.Core.Domain.Net.Packet.IClientPacketHandler)
export default class ClientHandshake implements IClientPacketBuilder
{ 
    id = ClientPacket.HANDSHAKE;

    constructor(
        @inject(types.Core.Domain.Net.Client) private readonly client: Client 
    ) {

    }
    public async handle(
    ): Promise<Packet> 
    {
        const packet = new Packet({
            id: ClientPacket.HANDSHAKE
        });
        
        packet.write(this.client.cryptInterface.publicKey ?? "")
        
        
        return packet;
    }
}