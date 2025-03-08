"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
exports.container = new inversify_1.Container();
const types = {
    Core: {
        Domain: {
            Net: {
                Packet: {
                    IClientPacketHandler: Symbol.for("Core/Domain/Net/Packet/IClientPacketHandler"),
                    IServerPacketHandler: Symbol.for("Core/Domain/Net/Packet/IServerPacketHandler"),
                },
                IServer: Symbol.for("Core/Domain/Net/IServer")
            }
        }
    }
};
exports.default = types;
