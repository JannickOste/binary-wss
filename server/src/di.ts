import 'reflect-metadata';
import { Container } from "inversify";

export const container = new Container();

const types = {
    Core: {
        Domain: {
            Net: {
                Packet: {
                    IClientPacketHandler:  Symbol.for("Core/Domain/Net/Packet/IClientPacketHandler"),
                    IServerPacketHandler:  Symbol.for("Core/Domain/Net/Packet/IServerPacketHandler"),
                    IPacketDispatcher:     Symbol.for("Core/Domain/Net/Packet/IPacketDispatcher"),
                    IPacketProcessor:      Symbol.for("Core/Domain/Net/Packet/IPacketProcessor"),
                },
                IServer: Symbol.for("Core/Domain/Net/IServer")
            },
            Crypt: {
                IRSAInterface: Symbol.for("Core/Domain/Crypt/IRSAInterface")
            }
        }
    }
}

export default types;