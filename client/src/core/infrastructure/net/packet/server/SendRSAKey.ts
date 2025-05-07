import Client from "../../../../domain/net/Client";
import Packet from "../../../../domain/net/packet/Packet";
import IServerPacketHandler from "../../../../domain/net/packet/IServerPacketHandler";
import ServerPacket from "../../../../domain/net/packet/server/ServerPacket";
import { inject } from "inversify";
import types, { container } from "../../../../../di";
import ClientPacket from "../../../../domain/net/packet/client/ClientPacket";
import provide from "../../../../domain/decorators/provide";
import PacketDispatcher from "../PacketDispatcher";
import IPacketDispatcher from "../../../../domain/net/packet/IPacketDispatcher";
import EncryptionManager from "../../../crypt/manager/EncryptionManager";

@provide(types.Core.Domain.Net.Packet.IServerPacketHandler)
export default class SendRSAKey implements IServerPacketHandler
{ 
    id = ServerPacket.SEND_RSA_KEY;

    constructor(
        @inject(types.Core.Domain.Crypt.Manager.IEncryptionManager) private readonly encryptionManager: EncryptionManager, 
        @inject(types.Core.Domain.Net.Packet.IPacketDispatcher) private readonly dispatcher: IPacketDispatcher,
    ) {

    }

    public async handle(
        packet: Packet
    ): Promise<void> 
    {
        const publicKey = packet.readString();
        this.encryptionManager.setServerRSAKey(publicKey);
    
        await this.dispatcher.dispatchToServer(
            ClientPacket.SEND_RSA_KEY
        )
    }
}