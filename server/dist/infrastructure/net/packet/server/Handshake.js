"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const Packet_1 = __importDefault(require("../../../../domain/net/packet/Packet"));
const ClientPacket_1 = __importDefault(require("../../../../domain/net/ClientPacket"));
const ServerPacket_1 = __importDefault(require("../../../../domain/net/ServerPacket"));
const di_1 = __importDefault(require("../../../../di"));
const provide_1 = __importDefault(require("../../../../domain/decorators/provide"));
let Handshake = class Handshake {
    constructor() {
        this.id = ServerPacket_1.default.HANDSHAKE;
    }
    handle(client) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = new Packet_1.default({ id: ClientPacket_1.default.HANDSHAKE });
            payload.write(client.id);
            client.socket.send(payload.buffer);
            console.log(`Handshake packet send to client ${client.id}`);
        });
    }
};
Handshake = __decorate([
    (0, provide_1.default)(di_1.default.Core.Domain.Net.Packet.IServerPacketHandler)
], Handshake);
exports.default = Handshake;
