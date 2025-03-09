import Packet from "./Packet";

interface IPacketHandler {
    handle(packet: Packet, ... data: unknown[]): Promise<void>;
}

export default IPacketHandler;