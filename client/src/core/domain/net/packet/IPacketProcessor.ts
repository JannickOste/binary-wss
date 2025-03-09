import Client from "../Client";

export default interface IPacketProcessor {
    processPacket(client: Client, data: Uint8Array): Promise<void>;
}
