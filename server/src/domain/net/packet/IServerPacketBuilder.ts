import Client from "../Client";
import ServerPacket from "../ServerPacket";
import Packet from "./Packet";

interface IServerPacketBuilder {
    id: ServerPacket;

    build(client: Client, ... props: unknown[]): Promise<Packet>;
}

export default IServerPacketBuilder;