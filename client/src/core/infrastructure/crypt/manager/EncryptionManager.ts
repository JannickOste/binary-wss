import { bindingScopeValues, inject } from "inversify";
import types, { container } from "../../../../di";
import IAESInterface from "../../../domain/crypt/IAESInterface";
import IRSAInterface from "../../../domain/crypt/IRSAInterface";
import EncryptionFlag from "../../../domain/crypt/EncryptionFlag";
import Packet from "../../../domain/net/packet/Packet";
import provide from "../../../domain/decorators/provide";
import AES from "../AES";
import RSA from "../RSA";
import forge from "node-forge";

@provide(types.Core.Domain.Crypt.Manager.IEncryptionManager, bindingScopeValues.Singleton)
export default class EncryptionManager 
{ 
  private serverRSAKey: string | undefined;

  private serverAESKey: Buffer | undefined;

  constructor(
    @inject(types.Client.Crypt.RSA) private readonly clientRSA: IRSAInterface,
    @inject(types.Client.Crypt.AES) private readonly clientAES: IAESInterface
  ) {
  }

  public encrypt(
    flag: EncryptionFlag,
    data: Buffer | Uint8Array
  ) {
    console.log("Encrypting data with flag: ", flag);
    let buffer: Uint8Array = new Uint8Array();

    switch (flag) {
      case EncryptionFlag.RSA:
        if(!this.serverRSAKey) {
          throw new Error("Server RSA key is not set"); 
        }

        buffer = this.clientRSA.encrypt(data, this.serverRSAKey);
        break;

      case EncryptionFlag.AES:
        if(!this.serverAESKey) {
          throw new Error("Server AES key is not set"); 
        }

        const packetWriter = new Packet();
        const crypted = this.clientAES.encrypt(Buffer.from(data), this.serverAESKey);

        packetWriter.writeBuffer(crypted.iv);
        packetWriter.writeBuffer(crypted.encrypted);

        buffer = packetWriter.buffer;
        break;
        
      default: throw new Error("Invalid encryption flag");
    }

    return buffer;
  }

  public decrypt(
    flag: EncryptionFlag,
    data:  Buffer | Uint8Array
  ) {
    console.log("Decrypting data with flag: ", flag);
    switch (flag) {
      case EncryptionFlag.RSA:
        break;

      case EncryptionFlag.AES:
        const packet = new Packet({buffer: data});
        const iv = packet.readBuffer();
        const encrypted = packet.readBuffer();

        return this.clientAES.decrypt(Buffer.from(encrypted), Buffer.from(iv));
        
      default: throw new Error("Invalid encryption flag");
    }
  }

  public setServerRSAKey(key: string | undefined) {
    this.serverRSAKey = key;
  }

  public setServerAESKey(key: Buffer | Uint8Array | undefined) {
    this.serverAESKey = typeof key !== "undefined" ? Buffer.from(key) : key;
  }

  
  public getKey(flag: EncryptionFlag): Buffer
  {
    switch (flag) {
      case EncryptionFlag.RSA:
        const encoder = new TextEncoder();
        const encoded = encoder.encode(this.clientRSA.publicKey);

        return Buffer.from(encoded.buffer)
      case EncryptionFlag.AES:
        return this.clientAES.key;
      default: throw new Error("Invalid encryption flag");
    }
  }

}