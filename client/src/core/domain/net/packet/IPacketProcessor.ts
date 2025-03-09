import Client from "../Client";
export default interface IPacketProcessor {
    processPacket(data: Uint8Array): Promise<void>;
}
