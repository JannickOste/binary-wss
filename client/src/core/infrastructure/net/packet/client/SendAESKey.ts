import Packet from "../../../../domain/net/packet/Packet";
import ClientPacket from "../../../../domain/net/packet/client/ClientPacket";
import IClientPacketBuilder from "../../../../domain/net/packet/IClientPacketBuilder";
import types from "../../../../../di";
import provide from "../../../../domain/decorators/provide";
import { inject } from "inversify";
import EncryptionFlag from "../../../../domain/crypt/EncryptionFlag";
import EncryptionManager from "../../../crypt/manager/EncryptionManager";

@provide(types.Core.Domain.Net.Packet.IClientPacketHandler)
export default class SendAESKey extends Packet implements IClientPacketBuilder
{ 
    id = ClientPacket.SEND_AES_KEY;

    constructor(
        @inject(types.Core.Domain.Crypt.Manager.IEncryptionManager) private readonly encryptionManager: EncryptionManager 
    ) {
        super({
            id: ClientPacket.SEND_AES_KEY,
            encryption: EncryptionFlag.NONE
        })
    }

    public async handle(
    ): Promise<Packet> 
    {
        this.writeBuffer(this.encryptionManager.getKey(EncryptionFlag.AES))
        this.writeString("Hello world")
        
        return this;
    }
}