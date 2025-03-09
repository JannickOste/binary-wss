import Client from "../Client";
import ClientPacket from "./client/ClientPacket";
import ServerPacket from "./server/ServerPacket";

export default interface IPacketDispatcher {
    dispatchToServer(client: Client, id: ClientPacket, ...data: unknown[]): Promise<void>;
}
