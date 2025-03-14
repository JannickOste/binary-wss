import Client from "../../../../domain/net/Client";
import Packet from "../../../../domain/net/packet/Packet";
import ClientPacket from "../../../../domain/net/packet/client/ClientPacket";
import IClientPacketHandler from "../../../../domain/net/packet/IClientPacketHandler";
import types from "../../../../../di";
import provide from "../../../../domain/decorators/provide";
import { inject } from "inversify";

@provide(types.Core.Domain.Net.Packet.IClientPacketHandler)
export default class HelloWorld implements IClientPacketHandler
{ 
    id = ClientPacket.HELLO_WORLD;

    constructor(
        @inject(types.Core.Domain.Net.Client) private readonly client: Client 
    ) {

    }
    public async handle(
    ): Promise<void> 
    {
        const packet = new Packet();
        packet.write(ClientPacket.HELLO_WORLD);

        console.dir(this.client.serverAESKey)
        const {encrypted, iv} = this.client.serverAES.encrypt("hello world")
        packet.write(encrypted);
        packet.write(iv)

        this.client.socket.send(packet.buffer)
    }
}