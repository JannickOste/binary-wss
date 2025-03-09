
import Kernel from "./core/infrastructure/Kernel";
import WebSocketClient from "./core/infrastructure/net/WebSocketClient";

(async() => {
    const kernel = new Kernel()

    await kernel.init()
    await kernel.start()
})()