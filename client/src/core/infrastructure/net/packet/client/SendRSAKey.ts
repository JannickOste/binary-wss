import Client from "../../../../domain/net/Client";
import Packet from "../../../../domain/net/packet/Packet";
import ClientPacket from "../../../../domain/net/packet/client/ClientPacket";
import IClientPacketHandler from "../../../../domain/net/packet/IClientPacketHandler";
import provide from "../../../../domain/decorators/provide";
import types from "../../../../../di";
import { inject } from "inversify";

@provide(types.Core.Domain.Net.Packet.IClientPacketHandler)
export default class ClientHandshake implements IClientPacketHandler
{ 
    id = ClientPacket.HANDSHAKE;

    constructor(
        @inject(types.Core.Domain.Net.Client) private readonly client: Client 
    ) {

    }
    public async handle(
    ): Promise<void> 
    {
        const packet = new Packet({
            id: ClientPacket.HANDSHAKE
        });
        
        packet.write(this.client.cryptInterface.publicKey ?? "")
        
        this.client.socket.send(packet.buffer)
    }
}