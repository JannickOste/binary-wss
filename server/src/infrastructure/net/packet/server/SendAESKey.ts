import Client from "../../../../domain/net/Client";
import Packet from "../../../../domain/net/packet/Packet";
import ClientPacket from "../../../../domain/net/ClientPacket";
import IServerPacketHandler from "../../../../domain/net/packet/IServerPacketHandler";
import ServerPacket from "../../../../domain/net/ServerPacket";
import types from "../../../../di";
import provide from "../../../../domain/decorators/provide";
import { inject } from "inversify";
import IRSAInterface from "../../../../domain/crypt/IRSAInterface";

@provide(types.Core.Domain.Net.Packet.IServerPacketHandler)
export default class Handshake implements IServerPacketHandler {
    id = ServerPacket.SEND_RSA_KEY;
    
    constructor(
        @inject(types.Core.Domain.Crypt.IRSAInterface) private readonly rsa: IRSAInterface
    ) {

    }

    public async handle(
        client: Client
    ): Promise<void> 
    {
        const payload = new Packet({
            id: this.id
        });

        const encryptedServerAES = this.rsa.encrypt(
            client.serverAesKey, 
            client.publicKey
        )
        
        payload.writeBuffer(
            Buffer.from(encryptedServerAES)
        );

        client.socket.send(payload.buffer);
    }
}