import Client from "../../../../domain/net/Client";
import Packet from "../../../../domain/net/packet/Packet";
import IServerPacketHandler from "../../../../domain/net/packet/IServerPacketHandler";
import ServerPacket from "../../../../domain/net/packet/server/ServerPacket";
import { inject } from "inversify";
import types, { container } from "../../../../../di";
import ClientPacket from "../../../../domain/net/packet/client/ClientPacket";
import provide from "../../../../domain/decorators/provide";
import PacketDispatcher from "../PacketDispatcher";
import ClientHandshake from "../client/ClientHandshake";
import IPacketDispatcher from "../../../../domain/net/packet/IPacketDispatcher";

@provide(types.Core.Domain.Net.Packet.IServerPacketHandler)
export default class ServerHandshake implements IServerPacketHandler
{ 
    id = ServerPacket.HANDSHAKE;

    constructor(
        @inject(types.Core.Domain.Net.Client) private readonly client: Client,
        @inject(types.Core.Domain.Net.Packet.IPacketDispatcher) private readonly dispatcher: IPacketDispatcher,
    ) {

    }

    public async handle(
    ): Promise<void> 
    {
        const packet = new Packet();
        const id = packet.readNumber();
        const publicKey = packet.readString();
        this.client.id = id;
        this.client.serverKey = publicKey;

        await this.dispatcher.dispatchToServer(
            ClientPacket.HANDSHAKE
        )
    }
}