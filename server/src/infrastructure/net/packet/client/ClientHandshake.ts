import { inject } from "inversify";
import types from "../../../../di";
import provide from "../../../../domain/decorators/provide";
import Client from "../../../../domain/net/Client";
import ClientPacket from "../../../../domain/net/ClientPacket";
import IClientPacketHandler from "../../../../domain/net/packet/IClientPacketHandler";
import Packet from "../../../../domain/net/packet/Packet";
import Server from "../../Server";
import IRSAInterface from "../../../../domain/crypt/IRSAInterface";
import IPacketDispatcher from "../../../../domain/net/packet/IPacketDispatcher";
import ServerPacket from "../../../../domain/net/ServerPacket";

@provide(types.Core.Domain.Net.Packet.IClientPacketHandler)
export default class ClientHandshake implements IClientPacketHandler {
    id = ClientPacket.HANDSHAKE;

    constructor(
        @inject(types.Core.Domain.Crypt.IRSAInterface) private readonly rsaInterface: IRSAInterface,
        @inject(types.Core.Domain.Net.Packet.IPacketDispatcher) private readonly packetDispatcher: IPacketDispatcher
    ) {}

    public async handle(
        client: Client,
        packet: Packet
    ): Promise<void> 
    {
        client.publicKey = packet.readString();    
        
        await this.packetDispatcher.dispatchToClient(
            client,
            ServerPacket.SEND_RSA_KEY
        )
    }
}