import Packet from "../../../../domain/net/packet/Packet";
import IServerPacketHandler from "../../../../domain/net/packet/IServerPacketHandler";
import ServerPacket from "../../../../domain/net/packet/server/ServerPacket";
import types from "../../../../../di";
import { inject } from "inversify";
import Client from "../../../../domain/net/Client";
import provide from "../../../../domain/decorators/provide";
import HelloWorld from "../client/HelloWorld";
import IPacketDispatcher from "../../../../domain/net/packet/IPacketDispatcher";
import ClientPacket from "../../../../domain/net/packet/client/ClientPacket";

@provide(types.Core.Domain.Net.Packet.IServerPacketHandler)
export default class SendAESKey implements IServerPacketHandler
{ 
    id = ServerPacket.SEND_AES_KEY;

    constructor(
        @inject(types.Core.Domain.Net.Client) private readonly client: Client,
        @inject(types.Core.Domain.Net.Packet.IPacketDispatcher) private readonly dispatcher: IPacketDispatcher
    ) {

    }

    public async handle(
        packet: Packet
    ): Promise<void> 
    {
        const serverAesEncrypted = packet.readBuffer()
        const serverAes = this.client.cryptInterface.decrypt(serverAesEncrypted)

        this.client.serverAESKey = Buffer.from(serverAes);
        
        await this.dispatcher.dispatchToServer(
            ClientPacket.HELLO_WORLD
        )
    }
}