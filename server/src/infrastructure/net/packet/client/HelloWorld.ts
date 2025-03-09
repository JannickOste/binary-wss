import { inject } from "inversify";
import types from "../../../../di";
import provide from "../../../../domain/decorators/provide";
import Client from "../../../../domain/net/Client";
import ClientPacket from "../../../../domain/net/ClientPacket";
import IClientPacketHandler from "../../../../domain/net/packet/IClientPacketHandler";
import Packet from "../../../../domain/net/packet/Packet";
import Server from "../../Server";
import IAESInterface from "../../../../domain/crypt/IAESInterface";

@provide(types.Core.Domain.Net.Packet.IClientPacketHandler)
export default class HelloWorld implements IClientPacketHandler {
    id = ClientPacket.HELLO_WORLD;


    public async handle(
        client: Client,
        packet: Packet
    ): Promise<void> 
    {
        const encrypted = packet.readString()
        const iv = packet.readString();


        console.log(client.clientAes.decrypt(encrypted, iv))
    }
}