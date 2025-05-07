import ClientPacket from "./client/ClientPacket";

export default interface IPacketDispatcher {
    dispatchToServer(id: ClientPacket, ...data: unknown[]): Promise<void>;
}
