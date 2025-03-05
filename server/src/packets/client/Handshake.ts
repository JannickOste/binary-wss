import Client from "../../Client";
import IPacketHandler from "../IPacketHandler";

export default class Handshake implements IPacketHandler {
    public async handle(
        client: Client
    ): Promise<void> 
    {
        // Could to some cryptography here
    }
}