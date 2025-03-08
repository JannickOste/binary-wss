"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const Packet_1 = __importDefault(require("../../domain/net/packet/Packet"));
const Client_1 = __importDefault(require("../../domain/net/Client"));
const ServerPacket_1 = __importDefault(require("../../domain/net/ServerPacket"));
const di_1 = __importDefault(require("../../di"));
const inversify_1 = require("inversify");
const inversify_2 = require("inversify");
const provide_1 = __importDefault(require("../../domain/decorators/provide"));
let Server = class Server {
    constructor(PORT = 8080, clientPacketHandlers, serverPacketHandlers) {
        this.PORT = PORT;
        this.clientPacketHandlers = clientPacketHandlers;
        this.serverPacketHandlers = serverPacketHandlers;
        this.clients = new Map();
        this.lastId = 0;
    }
    onClientConnect(socket) {
        var _a;
        socket.binaryType = 'arraybuffer';
        const client = new Client_1.default(this.lastId++, socket);
        this.clients.set(socket, client);
        socket.on('message', this.onPacketReceive.bind(this, socket));
        socket.on('close', this.onClientDisconnect.bind(this, socket));
        (_a = this.serverPacketHandlers.find(v => v.id === ServerPacket_1.default.HANDSHAKE)) === null || _a === void 0 ? void 0 : _a.handle(client);
    }
    onPacketReceive(socket, data) {
        const packet = new Packet_1.default({ buffer: new Uint8Array(data) });
        const id = packet.readNumber();
        const packetHandler = this.clientPacketHandlers.find(v => v.id === id);
        if (packetHandler) {
            packetHandler.handle(this.clients.get(socket), packet);
            return;
        }
        socket.close();
    }
    onClientDisconnect(socket) {
        this.clients.delete(socket);
    }
    listen() {
        return __awaiter(this, void 0, void 0, function* () {
            this.server = new ws_1.default.Server({ port: this.PORT, maxPayload: Packet_1.default.MAX_PACKET_SIZE, });
            this.server.on('connection', this.onClientConnect.bind(this));
        });
    }
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            (_a = this.server) === null || _a === void 0 ? void 0 : _a.close();
        });
    }
};
Server = __decorate([
    (0, provide_1.default)(di_1.default.Core.Domain.Net.IServer),
    __param(0, (0, inversify_2.unmanaged)()),
    __param(1, (0, inversify_1.multiInject)(di_1.default.Core.Domain.Net.Packet.IClientPacketHandler)),
    __param(2, (0, inversify_1.multiInject)(di_1.default.Core.Domain.Net.Packet.IServerPacketHandler)),
    __metadata("design:paramtypes", [Number, Array, Array])
], Server);
exports.default = Server;
