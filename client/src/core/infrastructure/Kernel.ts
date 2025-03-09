import { globSync } from "glob"
import types, { container } from "../../di";
import IWebSocketClient from "../domain/net/IWebsocketClient";
import Client from "../domain/net/Client";

import { WebSocket } from "ws";
export default class Kernel 
{
    public async init(): Promise<void> 
    {
        console.log("Loading dependencies...")
        for(const file of globSync(`{src,dist}/**/*.${__filename.endsWith("ts") ? "ts" : "js"}`, {absolute: true}))
        {
            const _ = require(file)
        }

        
        container.bind(types.Core.Domain.Net.Client).toConstantValue(
            new Client(new WebSocket("ws://localhost:8080"), "", -1)
        );
    }

    public async start(): Promise<void> 
    {
        const client = container.get<IWebSocketClient>(types.Core.Domain.Net.IWebSocketClient)

        try 
        {
            await client.connect();
        } catch (e)
        {
            console.log("Error occured when attempting to connect", e)
        }
    }
}