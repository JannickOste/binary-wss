interface IWebSocketClient { 
    connect(): Promise<void>; 
    disconnect(): Promise<void>;
}

export default IWebSocketClient;