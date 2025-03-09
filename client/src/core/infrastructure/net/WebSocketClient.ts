import Client from "../../domain/net/Client";
import provide from "../../domain/decorators/provide";
import types, { container } from "../../../di";
import IWebSocketClient from "../../domain/net/IWebsocketClient";
import { inject } from "inversify";
import IPacketProcessor from "../../domain/net/packet/IPacketProcessor";
import { WebSocket } from "ws";

@provide(types.Core.Domain.Net.IWebSocketClient)
export default class WebSocketClient implements IWebSocketClient {
    constructor(
        @inject(types.Core.Domain.Net.Packet.IPacketProcessor) private readonly packetProcessor: IPacketProcessor,
        @inject(types.Core.Domain.Net.Client) private readonly client: Client
    ) {
    }

    public async connect(): Promise<void> {
        const socket = new WebSocket("ws://localhost:8080");
        socket.binaryType = "arraybuffer";
        socket.on("message", this.onPacketReceived.bind(this));
        console.log("client connected...")
    }

    public async disconnect(): Promise<void> {
        this.client?.socket.close();
    }

    private async onPacketReceived(event: MessageEvent): Promise<void> { 
        if (event instanceof ArrayBuffer) {
            const buffer = new Uint8Array(event);

            await this.packetProcessor.processPacket(
                buffer
            )
        } 
    }
}
