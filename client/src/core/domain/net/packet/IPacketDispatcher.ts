import Client from "../Client";
import ClientPacket from "./client/ClientPacket";
import ServerPacket from "./server/ServerPacket";

export default interface IPacketDispatcher {
    dispatchToServer(id: ClientPacket, ...data: unknown[]): Promise<void>;
}
