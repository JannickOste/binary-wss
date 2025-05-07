import Client from "../../../../domain/net/Client";
import Packet from "../../../../domain/net/packet/Packet";
import ClientPacket from "../../../../domain/net/ClientPacket";
import IServerPacketBuilder from "../../../../domain/net/packet/IServerPacketBuilder";
import ServerPacket from "../../../../domain/net/ServerPacket";
import types from "../../../../di";
import provide from "../../../../domain/decorators/provide";
import { inject } from "inversify";
import IRSAInterface from "../../../../domain/crypt/IRSAInterface";
import EncryptionFlag from "../../../../domain/crypt/EncryptionFlag";

@provide(types.Core.Domain.Net.Packet.IServerPacketHandler)
export default class SendRSAKey implements IServerPacketBuilder {
    id = ServerPacket.SEND_RSA_KEY;
    
    constructor(
        @inject(types.Core.Domain.Crypt.IRSAInterface) private readonly rsa: IRSAInterface
    ) {

    }

    public async build(
    ): Promise<Packet> 
    {
        const payload = new Packet({
            id: this.id,
            encryption: EncryptionFlag.NONE
        });
        
        payload.write(this.rsa.publicKey);

        return payload;
    }
}