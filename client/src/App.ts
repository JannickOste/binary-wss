import Client from "./Client";
import WebSocket from "ws";
import Packet from "./Packet";
import ServerPacket from "./packets/ServerPacket";
import IPacketHandler from "./packets/IPacketHandler";
import Handshake from "./packets/server/Handshake";

export default class App {
    public static client?: Client;
    private static socket?: WebSocket;
    private static serverPacketHandlers: Map<ServerPacket, IPacketHandler> = new Map();

    public static main(): void {
        this.serverPacketHandlers.set(ServerPacket.HANDSHAKE, new Handshake());


        this.socket = new WebSocket("ws://localhost:8080");

        this.socket.binaryType = "arraybuffer";

        this.socket.on("message", App.onPacketReceive.bind(this));

    }

    private static onPacketReceive(data: WebSocket.Data): void {
        if (data instanceof ArrayBuffer) {
            const buffer = new Uint8Array(data);

            const packet = new Packet({ buffer: buffer });

            const id = packet.readNumber();
            const packetHandler = this.serverPacketHandlers.get(id);
            if(packetHandler) {
                packetHandler.handle(packet, this.socket!);
                return;
            }
        } 

        
        this.socket?.close();
    }
}
