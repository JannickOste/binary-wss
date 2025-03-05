export interface PacketProps {
    buffer: Uint8Array;
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
        {buffer}: PacketProps
    ) {
        this.buffer = new DataView((buffer ?? new Uint8Array(Packet.MAX_PACKET_SIZE)).buffer);
    }

    public readNumber(): number {
        const value = this.buffer.getFloat32(this.offset);
        this.offset += 4;

        return value;
    }

    protected writeNumber(value: number): void {
        this.buffer.setFloat32(this.offset, value);
        this.offset++;
    }
    
    protected writeBoolean(value: boolean): void {
        this.buffer.setUint8(this.offset, value ? 1 : 0);
        this.offset++;
    }

    public readBoolean(): boolean {
        const value = this.buffer.getUint8(this.offset);
        this.offset++;

        return value === 1;
    }

    protected writeString(value: string): void {
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
        if (typeof value === 'number') return this.writeNumber(value);
        if (typeof value === 'boolean') return this.writeBoolean(value);
        if (typeof value === 'string') return this.writeString(value);
    }
}