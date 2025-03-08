interface IServer {
    listen(): Promise<void>;
    destroy(): Promise<void>;
}

export default IServer;