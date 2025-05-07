import { inject } from "inversify";
import types from "../../../../di";
import provide from "../../../../domain/decorators/provide";
import Client from "../../../../domain/net/Client";
import ClientPacket from "../../../../domain/net/ClientPacket";
import IClientPacketHandler from "../../../../domain/net/packet/IClientPacketHandler";
import Packet from "../../../../domain/net/packet/Packet";
import IRSAInterface from "../../../../domain/crypt/IRSAInterface";
import IPacketDispatcher from "../../../../domain/net/packet/IPacketDispatcher";
import ServerPacket from "../../../../domain/net/ServerPacket";
import { createPublicKey } from "crypto";

@provide(types.Core.Domain.Net.Packet.IClientPacketHandler)
export default class ClientHandshake implements IClientPacketHandler {
    id = ClientPacket.SEND_RSA_KEY;

    constructor(
        @inject(types.Core.Domain.Crypt.IRSAInterface) private readonly rsaInterface: IRSAInterface,
        @inject(types.Core.Domain.Net.Packet.IPacketDispatcher) private readonly packetDispatcher: IPacketDispatcher
    ) {}

    public async handle(
        client: Client,
        packet: Packet
    ): Promise<void> 
    {
        const data = packet.readBuffer();
        const decoder = new TextDecoder();
        try 
        {
            createPublicKey(decoder.decode(data));
        } catch (e) 
        {
            client.socket.terminate();
            return;
        }

        client.clientRSAKey = decoder.decode(data);

        await this.packetDispatcher.dispatchToClient(
            client,
            ServerPacket.SEND_AES_KEY
        )
    }
}