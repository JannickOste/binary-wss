import Client from "../../../../domain/net/Client";
import Packet from "../../../../domain/net/packet/Packet";
import IServerPacketHandler from "../../../../domain/net/packet/IServerPacketHandler";
import ServerPacket from "../../../../domain/net/packet/server/ServerPacket";
import { inject } from "inversify";
import types, { container } from "../../../../../di";
import ClientPacket from "../../../../domain/net/packet/client/ClientPacket";
import provide from "../../../../domain/decorators/provide";
import PacketDispatcher from "../PacketDispatcher";
import ClientHandshake from "../client/SendRSAKey";
import IPacketDispatcher from "../../../../domain/net/packet/IPacketDispatcher";

@provide(types.Core.Domain.Net.Packet.IServerPacketHandler)
export default class ServerHandshake implements IServerPacketHandler
{ 
    id = ServerPacket.HANDSHAKE;

    constructor(
        @inject(types.Core.Domain.Net.Packet.IPacketDispatcher) private readonly dispatcher: IPacketDispatcher,
    ) {

    }

    public async handle(
        packet: Packet
    ): Promise<void> 
    {
        const client = container.get<Client>(types.Core.Domain.Net.Client);

        const publicKey = packet.readString();

        client.serverRSAKey = publicKey;
    
        await this.dispatcher.dispatchToServer(
            ClientPacket.HANDSHAKE
        )
    }
}