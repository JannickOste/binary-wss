import App from "../../../../../App";
import Client from "../../../../domain/net/Client";
import Packet from "../../../../domain/net/packet/Packet";
import ClientPacket from "../../../../domain/net/packet/client/ClientPacket";
import IPacketHandler from "../../../../domain/net/packet/IPacketHandler";
import HelloWorld from "./HelloWorld";

export default class Handshake implements IPacketHandler
{ 
    public async handle(
        d: Packet,
        socket: WebSocket
    ): Promise<void> 
    {
        const packet = new Packet();
        packet.write(ClientPacket.HANDSHAKE)
        packet.write(App.client?.cryptInterface.publicKey ?? "")
        
        if (App.client) {
            const encrypted = App.client.cryptInterface.encrypt(App.client.clientAESKey, App.client.serverKey);
            if (!encrypted) {
                console.error("Encryption failed, received undefined value!");
            } else {
                packet.writeBuffer(Buffer.from(encrypted)); // Ensure correct type
            }
        }
        
        socket.send(packet.buffer)
    
    }
}