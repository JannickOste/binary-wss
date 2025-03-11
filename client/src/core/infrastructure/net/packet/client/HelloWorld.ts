import Client from "../../../../domain/net/Client";
import Packet from "../../../../domain/net/packet/Packet";
import ClientPacket from "../../../../domain/net/packet/client/ClientPacket";
import IClientPacketHandler from "../../../../domain/net/packet/IClientPacketHandler";
import types, { container } from "../../../../../di";
import provide from "../../../../domain/decorators/provide";
import { inject } from "inversify";

@provide(types.Core.Domain.Net.Packet.IClientPacketHandler)
export default class HelloWorld implements IClientPacketHandler
{ 
    id = ClientPacket.HELLO_WORLD;

    public async handle(
    ): Promise<void> 
    {
        const client = container.get<Client>(types.Core.Domain.Net.Client);
        const packet = new Packet({
            id: ClientPacket.HELLO_WORLD
        });

        const clientAesKeyEncrypted = client.cryptInterface.encrypt(
            client.clientAESKey,
            client.serverRSAKey
        );
        console.dir(client.id)
        packet.writeBuffer(Buffer.from(clientAesKeyEncrypted))

        const textEncoder = new TextEncoder();
        const encoded = textEncoder.encode("hello world");

        const {encrypted, iv} = client.serverAES.encrypt(Buffer.from(encoded.buffer))
        packet.writeBuffer(encrypted);
        packet.writeBuffer(iv)

        client.socket.send(packet.buffer)
    }
}