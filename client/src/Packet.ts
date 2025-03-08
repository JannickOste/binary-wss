export interface PacketProps {
    buffer?: Uint8Array;
    id?: number;
}

export default class Packet {
    public static readonly MAX_PACKET_SIZE = 4096;

    private offset: number = 0;
    private readonly dataview: DataView;
    public get buffer(): Uint8Array {
        return new Uint8Array(this.dataview.buffer);
    }
    
    constructor(
        {buffer, id}: PacketProps = {}
    ) {
        this.dataview = new DataView((buffer ?? new Uint8Array(Packet.MAX_PACKET_SIZE)).buffer);

        if(id)
        {
            this.writeFloat32(id);
        }

    }

    public writeByte(value: number): void 
    {
        if (this.offset + 1 > Packet.MAX_PACKET_SIZE) {
            throw new Error("Packet size exceeds the maximum allowed size");
        }

        this.dataview.setInt8(this.offset, value);
        this.offset++;
    }

    public readByte(): number 
    {
        const value = this.dataview.getInt8(this.offset);
        this.offset++;

        return value;
    }

    public writeShort(value: number, littleEndian: boolean = true): void {
        this.dataview.setInt16(this.offset, value, littleEndian);
        this.offset += 2;
    }

    public readShort(littleEndian: boolean = true): number {
        const value = this.dataview.getInt16(this.offset, littleEndian);
        this.offset += 2; 

        return value;
    }

    public writeInt(value: number, littleEndian: boolean = true): void {
        this.dataview.setInt32(this.offset, value, littleEndian);
        this.offset += 4;
    }

    public readInt(littleEndian: boolean = true): number {
        const value = this.dataview.getInt32(this.offset, littleEndian);
        this.offset += 4; 
        
        return value;
    }

    public writeFloat32(value: number, littleEndian: boolean = true): void {
        this.dataview.setFloat32(this.offset, value, littleEndian);
        this.offset += 4;
    }

    public readFloat32(littleEndian: boolean = true): number {
        const value = this.dataview.getFloat32(this.offset, littleEndian);
        this.offset += 4;

        return value;
    }

    public readNumber = (littleEndian: boolean = true) => this.readFloat32(littleEndian);

    public writeFloat64(value: number, littleEndian: boolean = true): void {
        this.dataview.setFloat64(this.offset, value, littleEndian);
        this.offset += 8;
    }
    
    public writeBoolean(value: boolean): void {
        this.dataview.setUint8(this.offset, value ? 1 : 0);
        this.offset++;
    }

    public readBoolean(): boolean {
        const value = this.dataview.getUint8(this.offset);
        this.offset++;

        return value === 1;
    }

    public writeString(value: string): void {
        const encoder = new TextEncoder();
        const encoded = encoder.encode(value);

        this.writeInt(encoded.length);

        for (const byte of encoded) {
            this.dataview.setUint8(this.offset, byte);
            this.offset++;
        }
    }

    public readString(): string {
        const length = this.readInt();
        console.log(length)
        const bytes = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
            bytes[i] = this.dataview.getUint8(this.offset);
            this.offset++;
        }

        const decoder = new TextDecoder();
        return decoder.decode(bytes);
    }

    public write(numeric: number, littleEndian?: boolean): void;
    public write(bool: boolean): void;
    public write(str: string): void;
    public write(value: number | boolean | string, littleEndian?: boolean): void {
        if (typeof value === 'number') return this.writeFloat32(value, littleEndian);
        if (typeof value === 'boolean') return this.writeBoolean(value);
        if (typeof value === 'string') return this.writeString(value);
    }
}
