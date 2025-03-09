import App from "../../../../../App";
import Client from "../../../../domain/net/Client";
import Packet from "../../../../domain/net/packet/Packet";
import IPacketHandler from "../../../../domain/net/packet/IPacketHandler";
import ClientHandshake from "../client/Handshake"

export default class Handshake implements IPacketHandler
{ 
    public async handle(
        packet: Packet,
        socket: WebSocket
    ): Promise<void> 
    {
        const id = packet.readNumber();
        const publicKey = packet.readString();
        App.client = new Client(id, socket, publicKey);

        new ClientHandshake().handle(
            new Packet(),
            socket
        )
        console.log(`Handshake packet received from server, client initialized with id ${id}`);
    }
}