import Client from "../Client";
import ClientPacket from "../ClientPacket";
import Packet from "./Packet";

interface IClientPacketHandler {
    id: ClientPacket;

    handle(client: Client, packet: Packet, ... props: unknown[]): Promise<void>;
}

export default IClientPacketHandler;