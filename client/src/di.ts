import 'reflect-metadata';
import { Container } from "inversify";
import AES from './core/infrastructure/crypt/AES';

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
                IWebSocketClient: Symbol.for("Core/Domain/Net/IWebSocketClient"),
                Client: Symbol.for("Core/Domain/Net/Client"),
            },
            Crypt: {
                IRSAInterface: Symbol.for("Core/Domain/Crypt/IRSAInterface"),
                IAESInterface: Symbol.for("Core/Domain/Crypt/IAESInterface"),
                Manager: {
                    IEncryptionManager: Symbol.for("Core/Domain/Crypt/Manager/IEncryptionManager"),
                }
            }
        }
    },
    Client: {
        Crypt: {
            AES: Symbol.for("Client/Crypt/AES"),
            RSA: Symbol.for("Client/Crypt/RSA"),
        }
    }
}

export default types;