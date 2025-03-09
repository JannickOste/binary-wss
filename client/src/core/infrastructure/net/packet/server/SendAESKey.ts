import Packet from "../../../../domain/net/packet/Packet";
import IServerPacketHandler from "../../../../domain/net/packet/IServerPacketHandler";
import ServerPacket from "../../../../domain/net/packet/server/ServerPacket";
import types from "../../../../../di";
import { inject } from "inversify";
import Client from "../../../../domain/net/Client";
import provide from "../../../../domain/decorators/provide";
import HelloWorld from "../client/HelloWorld";

export default class SendAESKey implements IServerPacketHandler
{ 
    id = ServerPacket.SEND_AES_KEY;

    constructor(
        @inject(types.Core.Domain.Net.Client) private readonly client: Client 
    ) {

    }

    public async handle(
        packet: Packet
    ): Promise<void> 
    {
        console.dir("aes")
        const serverAes = packet.readBuffer()
        if(this.client)
            this.client.serverAESKey = Buffer.from(this.client.cryptInterface.decrypt(serverAes))
        
    }
}