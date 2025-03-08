import Packet from "../../../../../src/domain/net/packet/Packet"
import crypto from "crypto";

describe("Packet Class", () => {
    test("It can write and read a boolean value", () => {
        const expected = true;
        
        const writingPacket = new Packet();
        writingPacket.writeBoolean(expected);

        const readingPacket = new Packet({buffer: writingPacket.buffer})
        const readValue = readingPacket.readBoolean();

        expect(readValue).toBe(expected);
    })

    test("It can write and read a string value", () => {
        const expected = "hello world";

        const writingPacket = new Packet();
        writingPacket.writeString(expected);

        const readingPacket = new Packet({buffer: writingPacket.buffer})
        const readValue = readingPacket.readString();

        expect(readValue).toBe(readValue);
    })

    test("It can write and read a byte value", () => {
        const expected = 127; 

        const writingPacket = new Packet();
        writingPacket.writeByte(expected);
        
        const readingPacket = new Packet({buffer: writingPacket.buffer});
        const readValue = readingPacket.readByte();
        expect(readValue).toBe(expected);
    })

    test("It wraps back to a negative number when the byte value exceeds the maximum allowed", () => {
        const input = 128; 
        const output = -128;

        const writingPacket = new Packet();
        writingPacket.writeByte(input);
        
        const readingPacket = new Packet({buffer: writingPacket.buffer});
        const readValue = readingPacket.readByte();
        expect(readValue).toBe(output);
    })

    test("It can write and read a short value", () => {
        const expected = 32767;
        
        const writingPacket = new Packet();
        writingPacket.writeShort(expected);
        
        const readingPacket = new Packet({buffer: writingPacket.buffer});
        const readValue = readingPacket.readShort();
        expect(readValue).toBe(expected);
    })

    test("It wraps back to a negative number when the short value exceeds the maximum allowed", () => {
        const input = 32768; 
        const output = -32768;

        const writingPacket = new Packet();
        writingPacket.writeShort(input);
        
        const readingPacket = new Packet({buffer: writingPacket.buffer});
        const readValue = readingPacket.readShort();
        expect(readValue).toBe(output);
    })

    test("It can write and read an integer value", () => {
        const expected = 2147483647;
        
        const writingPacket = new Packet();
        writingPacket.writeInt(expected);
        
        const readingPacket = new Packet({buffer: writingPacket.buffer});
        const readValue = readingPacket.readInt();
        expect(readValue).toBe(expected);
    })

    test("It wraps back to a negative number when the integer value exceeds the maximum allowed", () => {
        const input = 2147483648; 
        const output = -2147483648;

        const writingPacket = new Packet();
        writingPacket.writeInt(input);
        
        const readingPacket = new Packet({buffer: writingPacket.buffer});
        const readValue = readingPacket.readInt();
        expect(readValue).toBe(output);
    })
    
})
