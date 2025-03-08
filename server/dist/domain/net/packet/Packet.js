"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Packet {
    get buffer() {
        return new Uint8Array(this.dataview.buffer);
    }
    constructor({ buffer, id } = {}) {
        this.offset = 0;
        this.readNumber = (littleEndian) => this.readFloat32(littleEndian);
        this.dataview = new DataView((buffer !== null && buffer !== void 0 ? buffer : new Uint8Array(Packet.MAX_PACKET_SIZE)).buffer);
        if (id) {
            this.writeFloat32(id);
        }
    }
    writeByte(value) {
        this.dataview.setInt8(this.offset, value);
        this.offset++;
    }
    readByte() {
        const value = this.dataview.getInt8(this.offset);
        this.offset++;
        return value;
    }
    writeShort(value, littleEndian = true) {
        this.dataview.setInt16(this.offset, value, littleEndian);
        this.offset += 2;
    }
    readShort(littleEndian = true) {
        const value = this.dataview.getInt16(this.offset, littleEndian);
        this.offset += 2;
        return value;
    }
    writeInt(value, littleEndian = true) {
        this.dataview.setInt32(this.offset, value, littleEndian);
        this.offset += 4;
    }
    readInt(littleEndian = true) {
        const value = this.dataview.getInt32(this.offset, littleEndian);
        this.offset += 4;
        return value;
    }
    writeFloat32(value, littleEndian = true) {
        this.dataview.setFloat32(this.offset, value, littleEndian);
        this.offset += 4;
    }
    readFloat32(littleEndian = true) {
        const value = this.dataview.getFloat32(this.offset, littleEndian);
        this.offset += 4;
        return value;
    }
    writeFloat64(value, littleEndian = true) {
        this.dataview.setFloat64(this.offset, value, littleEndian);
        this.offset += 8;
    }
    writeBoolean(value) {
        this.dataview.setUint8(this.offset, value ? 1 : 0);
        this.offset++;
    }
    readBoolean() {
        const value = this.dataview.getUint8(this.offset);
        this.offset++;
        return value === 1;
    }
    writeString(value) {
        const encoder = new TextEncoder();
        const encoded = encoder.encode(value);
        this.dataview.setUint8(this.offset, encoded.length);
        this.offset++;
        for (const byte of encoded) {
            this.dataview.setUint8(this.offset, byte);
            this.offset++;
        }
    }
    readString() {
        const length = this.dataview.getUint8(this.offset);
        this.offset++;
        const bytes = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
            bytes[i] = this.dataview.getUint8(this.offset);
            this.offset++;
        }
        const decoder = new TextDecoder();
        return decoder.decode(bytes);
    }
    write(value, littleEndian) {
        if (typeof value === 'number')
            return this.writeFloat32(value, littleEndian);
        if (typeof value === 'boolean')
            return this.writeBoolean(value);
        if (typeof value === 'string')
            return this.writeString(value);
    }
}
Packet.MAX_PACKET_SIZE = 4096;
exports.default = Packet;
