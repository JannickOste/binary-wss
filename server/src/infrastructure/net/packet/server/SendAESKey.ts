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
export default class Handshake implements IServerPacketBuilder {
    id = ServerPacket.SEND_AES_KEY;
    
    constructor(
        @inject(types.Core.Domain.Crypt.IRSAInterface) private readonly rsa: IRSAInterface
    ) {

    }

    public async build(
        client: Client
    ): Promise<Packet> 
    {
        const payload = new Packet({
            id: this.id,
            encryption: EncryptionFlag.RSA
        });

        const encryptedServerAES = this.rsa.encrypt(
            client.serverAesKey, 
            client.clientRSAKey
        )
        
        payload.writeBuffer(
            Buffer.from(encryptedServerAES)
        );

        return payload;
    }
}