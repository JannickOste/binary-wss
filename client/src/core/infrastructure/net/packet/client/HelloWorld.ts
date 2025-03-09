import App from "../../../../../App";
import Client from "../../../../domain/net/Client";
import Packet from "../../../../domain/net/packet/Packet";
import ClientPacket from "../../../../domain/net/packet/client/ClientPacket";
import IPacketHandler from "../../../../domain/net/packet/IPacketHandler";

export default class HelloWorld implements IPacketHandler
{ 
    public async handle(
        d: Packet,
        socket: WebSocket
    ): Promise<void> 
    {
        const packet = new Packet();
        packet.write(ClientPacket.HELLO_WORLD);

        if(App.client)
        {
            console.log("server aes key")
            console.dir(App.client.serverAESKey)
            const {encrypted, iv} = App.client.serverAES.encrypt("hello world")
            packet.write(encrypted);
            packet.write(iv)

            socket.send(packet.buffer)
        }
    }
}