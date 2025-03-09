import { globSync } from "glob"
import types, { container } from "../di";
import IServer from "../domain/net/IServer";

export default class Kernel 
{
    public async init(): Promise<void> 
    {
        console.log("Loading dependencies...")
        for(const file of globSync(`{src,dist}/**/*.${__filename.endsWith("ts") ? "ts" : "js"}`, {absolute: true}))
        {
            const _ = require(file)
        }
    }

    public async start(): Promise<void> 
    {
        const server = container.get<IServer>(types.Core.Domain.Net.IServer)
        if(server)
        {
            console.log("Starting server...");  

            await server.listen();
            
            console.log("Server started!");
        }
    }
}