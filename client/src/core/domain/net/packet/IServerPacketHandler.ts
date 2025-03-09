import Packet from "./Packet";

interface IServerPacketHandler {
    id: number;
    handle(packet: Packet, ... data: unknown[]): Promise<void>;
}

export default IServerPacketHandler;