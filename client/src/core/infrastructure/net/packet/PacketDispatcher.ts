import { inject, multiInject } from "inversify";
import IClientPacketBuilder from "../../../domain/net/packet/IClientPacketBuilder";
import provide from "../../../domain/decorators/provide";
import IPacketDispatcher from "../../../domain/net/packet/IPacketDispatcher";
import types, { container } from "../../../../di";
import ClientPacket from "../../../domain/net/packet/client/ClientPacket";
import Client from "../../../domain/net/Client";
import EncryptionFlag from "../../../domain/crypt/EncryptionFlag";
import EncryptionManager from "../../crypt/manager/EncryptionManager";
import Packet from "../../../domain/net/packet/Packet";

@provide(types.Core.Domain.Net.Packet.IPacketDispatcher)
export default class PacketDispatcher implements IPacketDispatcher {
    private readonly clientPacketHandlerMap: Map<number, IClientPacketBuilder> = new Map();

    constructor(
        @multiInject(types.Core.Domain.Net.Packet.IClientPacketHandler) private readonly clientPacketHandlers: IClientPacketBuilder[],
        @inject(types.Core.Domain.Net.Client) private readonly client: Client,
        @inject(types.Core.Domain.Crypt.Manager.IEncryptionManager) private readonly encryptionManager: EncryptionManager
    ) {
        this.clientPacketHandlers.forEach(handler => this.clientPacketHandlerMap.set(handler.id, handler));
    }

    public async dispatchToServer(id: ClientPacket): Promise<void> {
        const packetHandler = this.clientPacketHandlerMap.get(id);
        if(packetHandler)
        {
            let payload = await packetHandler.handle();

            if(payload.encryption > 0)
            {
                const [_, encryption] = [payload.readNumber(), payload.readNumber()];
                const remaniningData = new Uint8Array(payload.buffer, payload.currentOffset, payload.buffer.byteLength - payload.currentOffset);
                const encryptedData = this.encryptionManager.encrypt(payload.encryption, remaniningData); 

                const newPayload = new Packet({id: id, encryption: encryption});
                newPayload.writeBuffer(Buffer.from(encryptedData));

                payload = newPayload;
            }

            console.log(`[LOG]: Sending packet to server with id: ${id}`)

            this.client.socket.send(payload.buffer);
        } else console.log(`Packet handler with id: ${id} not found`)
    }

}
