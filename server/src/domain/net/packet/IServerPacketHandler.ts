import Client from "../Client";
import ServerPacket from "../ServerPacket";

interface IServerPacketHandler {
    id: ServerPacket;

    handle(client: Client, ... props: unknown[]): Promise<void>;
}

export default IServerPacketHandler;