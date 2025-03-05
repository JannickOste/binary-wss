import App from "../../App";
import Client from "../../Client";
import Packet from "../../Packet";
import IPacketHandler from "../IPacketHandler";

export default class Handshake implements IPacketHandler
{ 
    public async handle(
        packet: Packet,
        socket: WebSocket
    ): Promise<void> 
    {
        const id = packet.readNumber();
        App.client = new Client(id, socket);

        console.log(`Handshake packet received from server, client initialized with id ${id}`);
    }
}