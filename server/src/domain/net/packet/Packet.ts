export interface PacketProps {
    buffer?: Uint8Array;
    id?: number;
}

export default class Packet {
    public static readonly MAX_PACKET_SIZE = 4096;
    public static readonly LITTLE_ENDIAN = true;

    private offset: number = 0;
    private readonly buffer: DataView;
    public get Buffer(): Uint8Array {
        return new Uint8Array(this.buffer.buffer);
    }
    
    constructor(
        {buffer, id}: PacketProps = {}
    ) {
        this.buffer = new DataView((buffer ?? new Uint8Array(Packet.MAX_PACKET_SIZE)).buffer);

        if(id)
        {
            this.writeFloat32(id);
        }
    }

    public writeByte(value: number): void 
    {
        this.buffer.setInt8(this.offset, value);
        this.offset++;
    }

    public writeShort(value: number): void {
        this.buffer.setInt16(this.offset, value, Packet.LITTLE_ENDIAN)
        this.offset += 2;
    }

    public writeInt(value: number): void {
        this.buffer.setInt32(this.offset, value, Packet.LITTLE_ENDIAN);
        this.offset += 4;
    }

    public writeFloat32(value: number): void {
        this.buffer.setFloat32(this.offset, value, Packet.LITTLE_ENDIAN);
        this.offset += 4;
    }

    public writeFloat64(value: number): void {
        this.buffer.setFloat64(this.offset, value, Packet.LITTLE_ENDIAN)
    }
    
    public writeBoolean(value: boolean): void {
        this.buffer.setUint8(this.offset, value ? 1 : 0);
        this.offset++;
    }

    public readNumber(): number {
        const value = this.buffer.getFloat32(this.offset, Packet.LITTLE_ENDIAN);
        this.offset += 4;

        return value;
    }

    public readBoolean(): boolean {
        const value = this.buffer.getUint8(this.offset);
        this.offset++;

        return value === 1;
    }

    public writeString(value: string): void {
        const encoder = new TextEncoder();
        const encoded = encoder.encode(value);

        this.buffer.setUint8(this.offset, encoded.length);
        this.offset++;

        for (const byte of encoded) {
            this.buffer.setUint8(this.offset, byte);
            this.offset++;
        }
    }

    public readString(): string {
        const length = this.buffer.getUint8(this.offset);
        this.offset++;

        const bytes = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
            bytes[i] = this.buffer.getUint8(this.offset);
            this.offset++;
        }

        const decoder = new TextDecoder();
        return decoder.decode(bytes);
    }

    public write(numeric: number): void;
    public write(bool: boolean): void;
    public write(str: string): void;
    public write(value: number | boolean | string): void {
        if (typeof value === 'number') return this.writeFloat32(value);
        if (typeof value === 'boolean') return this.writeBoolean(value);
        if (typeof value === 'string') return this.writeString(value);
    }
}