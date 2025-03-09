import Client from "../../../domain/net/Client";
import ServerPacket from "../../../domain/net/ServerPacket";

export default interface IPacketDispatcher {
    dispatchToClient(client: Client, id: ServerPacket, ...data: unknown[]): Promise<void>;
    dispatchToAll(id: ServerPacket, ...data: unknown[]): Promise<void>;
}
