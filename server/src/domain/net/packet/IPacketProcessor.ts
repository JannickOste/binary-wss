import Client from "../../../domain/net/Client";

export default interface IPacketProcessor {
    processPacket(client: Client, data: Uint8Array): Promise<void>;
}
