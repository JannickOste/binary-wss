import Client from "./core/domain/net/Client";
import WebSocket from "ws";
import Packet from "./core/domain/net/packet/Packet";
import ServerPacket from "./core/domain/net/packet/server/ServerPacket";
import IPacketHandler from "./core/domain/net/packet/IPacketHandler";
import Handshake from "./core/infrastructure/net/packet/server/Handshake";
import SendAESKey from "./core/infrastructure/net/packet/server/SendAESKey";

export default class App {
    public static client?: Client;
    private static socket?: WebSocket;
    private static serverPacketHandlers: Map<ServerPacket, IPacketHandler> = new Map();

    public static main(): void {
        this.serverPacketHandlers.set(ServerPacket.HANDSHAKE, new Handshake());
        this.serverPacketHandlers.set(ServerPacket.SEND_AES_KEY, new SendAESKey());


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
