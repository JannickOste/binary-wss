import { inject } from "inversify";
import types from "../../../../di";
import IRSAInterface from "../../../../domain/crypt/IRSAInterface";
import provide from "../../../../domain/decorators/provide";
import Client from "../../../../domain/net/Client";
import ClientPacket from "../../../../domain/net/ClientPacket";
import IClientPacketHandler from "../../../../domain/net/packet/IClientPacketHandler";
import IPacketDispatcher from "../../../../domain/net/packet/IPacketDispatcher";
import Packet from "../../../../domain/net/packet/Packet";

@provide(types.Core.Domain.Net.Packet.IClientPacketHandler)
export default class HelloWorld implements IClientPacketHandler {
    id = ClientPacket.HELLO_WORLD;

    constructor(
        @inject(types.Core.Domain.Crypt.IRSAInterface) private readonly rsaInterface: IRSAInterface,
        @inject(types.Core.Domain.Net.Packet.IPacketDispatcher) private readonly packetDispatcher: IPacketDispatcher
    ) {}


    public async handle(
        client: Client,
        packet: Packet
    ): Promise<void> 
    {
        console.log("Decrypting client AES key")
        const clientAesKeyEncrypted = packet.readBuffer();
        client.clientAesKey = Buffer.from(this.rsaInterface.decrypt(clientAesKeyEncrypted))


        const encrypted = packet.readBuffer()
        const iv = packet.readBuffer();

        console.log("Decrypting client hello world packet")
        console.log(client.clientAes.decrypt(
            Buffer.from(encrypted), 
            Buffer.from(iv)
        ))
    }
}