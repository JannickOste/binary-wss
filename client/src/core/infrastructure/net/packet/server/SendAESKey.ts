import App from "../../../../../App";
import Client from "../../../../domain/net/Client";
import Packet from "../../../../domain/net/packet/Packet";
import IPacketHandler from "../../../../domain/net/packet/IPacketHandler";
import ClientHandshake from "../client/Handshake"
import HelloWorld from "../client/HelloWorld";

export default class SendAESKey implements IPacketHandler
{ 
    public async handle(
        packet: Packet,
        socket: WebSocket
    ): Promise<void> 
    {
        const serverAes = packet.readBuffer()
        if(App.client)
            App.client.serverAESKey = Buffer.from(App.client.cryptInterface.decrypt(serverAes))
        
        new HelloWorld().handle(packet, socket)
    }
}