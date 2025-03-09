import Client from "../Client";

interface IClientPacketHandler {
    id: number;

    handle(... data: unknown[]): Promise<void>;
}

export default IClientPacketHandler;