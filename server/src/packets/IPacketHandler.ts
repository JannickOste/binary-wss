import Client from "../Client";

interface IPacketHandler {
    handle(client: Client, ... props: unknown[]): Promise<void>;
}

export default IPacketHandler;