import Client from "../../Client";
import Packet from "../../Packet";
import ClientPacket from "../ClientPacket";
import IPacketHandler from "../IPacketHandler";

export default class Handshake implements IPacketHandler {
    public async handle(
        client: Client
    ): Promise<void> 
    {
        const packet = new Packet();

        packet.write(ClientPacket.HANDSHAKE);
        packet.write(client.id);

        client.socket.send(packet.Buffer);

        console.log(`Handshake packet send to client ${client.id}`);
    }
}