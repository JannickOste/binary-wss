import Packet from "../../../../domain/net/packet/Packet";
import IServerPacketHandler from "../../../../domain/net/packet/IServerPacketHandler";
import ServerPacket from "../../../../domain/net/packet/server/ServerPacket";
import types, { container } from "../../../../../di";
import { inject } from "inversify";
import Client from "../../../../domain/net/Client";
import provide from "../../../../domain/decorators/provide";
import IPacketDispatcher from "../../../../domain/net/packet/IPacketDispatcher";
import ClientPacket from "../../../../domain/net/packet/client/ClientPacket";
import EncryptionManager from "../../../crypt/manager/EncryptionManager";

@provide(types.Core.Domain.Net.Packet.IServerPacketHandler)
export default class SendAESKey implements IServerPacketHandler
{ 
    id = ServerPacket.SEND_AES_KEY;

    constructor(
        @inject(types.Core.Domain.Crypt.Manager.IEncryptionManager) private readonly encryptionManager: EncryptionManager, 
        @inject(types.Core.Domain.Net.Packet.IPacketDispatcher) private readonly dispatcher: IPacketDispatcher
    ) {

    }

    public async handle(
        packet: Packet
    ): Promise<void> 
    {
        const serverAES = packet.readBuffer()
        
        this.encryptionManager.setServerAESKey(serverAES);

        await this.dispatcher.dispatchToServer(
            ClientPacket.SEND_AES_KEY
        )
    }
}