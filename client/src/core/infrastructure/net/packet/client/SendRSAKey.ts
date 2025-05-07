import Client from "../../../../domain/net/Client";
import Packet from "../../../../domain/net/packet/Packet";
import ClientPacket from "../../../../domain/net/packet/client/ClientPacket";
import IClientPacketBuilder from "../../../../domain/net/packet/IClientPacketBuilder";
import provide from "../../../../domain/decorators/provide";
import types, { container } from "../../../../../di";
import { inject } from "inversify";
import EncryptionFlag from "../../../../domain/crypt/EncryptionFlag";
import forge from "node-forge";
import EncryptionManager from "../../../crypt/manager/EncryptionManager";

@provide(types.Core.Domain.Net.Packet.IClientPacketHandler)
export default class SendRSAKey extends Packet implements IClientPacketBuilder 
{ 
    id = ClientPacket.SEND_RSA_KEY;

    constructor(
        @inject(types.Core.Domain.Crypt.Manager.IEncryptionManager) private readonly encryptionManager: EncryptionManager 
    ) {
        super({
            id: ClientPacket.SEND_RSA_KEY,
            encryption: EncryptionFlag.NONE
        })
    }

    public async handle(
    ): Promise<Packet> 
    {        
        const key = this.encryptionManager.getKey(EncryptionFlag.RSA);
        
        this.writeBuffer(key);

        return this;
    }
}