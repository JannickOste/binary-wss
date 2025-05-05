import Client from "../Client";
import Packet from "./Packet";

interface IClientPacketBuilder {
    id: number;

    handle(... data: unknown[]): Promise<Packet>;
}

export default IClientPacketBuilder;