import 'reflect-metadata';
import { Container } from "inversify";

export const container = new Container();

const types = {
    Core: {
        Domain: {
            Net: {
                Packet: {
                    IClientPacketHandler: Symbol.for("Core/Domain/Net/Packet/IClientPacketHandler"),
                    IServerPacketHandler:  Symbol.for("Core/Domain/Net/Packet/IServerPacketHandler"),
                },
                IServer: Symbol.for("Core/Domain/Net/IServer")
            }
        }
    }
}

export default types;